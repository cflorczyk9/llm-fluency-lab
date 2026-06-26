// Global app state: card scheduling, diagnostic, program plan, lessons, daily
// log, and settings. Persisted to localStorage under "llm-fluency-lab/v1".
//
// This is the FOUNDATION store. Actions are real where trivial (grading wired to
// fsrs.review, export/import/reset, snapshots). Feature agents read selectors and
// call actions; keep the action names and shapes stable.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  Card,
  CardState,
  DailyLogEntry,
  DiagnosticResult,
  FsrsParams,
  ProgramPlan,
  Rating,
  Settings,
} from '../types';
import { emptyState, review } from '../lib/fsrs';
import { overallFluency } from '../lib/fluency';
import { categories } from '../data/content';

const STORAGE_KEY = 'llm-fluency-lab/v1';

const DEFAULT_SETTINGS: Settings = {
  requestRetention: 0.9,
  interleave: true,
  dailyNewCap: 10,
  hideAdvanced: false,
};

export interface PersistedState {
  cardStates: Record<string, CardState>;
  program: ProgramPlan | null;
  diagnostic: DiagnosticResult | null;
  lessons: Record<string, { startedAt?: number }>;
  dailyLog: DailyLogEntry[];
  settings: Settings;
}

// The cloud-sync snapshot is exactly the locally persisted state. Keeping these
// the same shape means export/import and cloud push/pull all move one object.
export type Snapshot = PersistedState;

interface StoreActions {
  gradeCard: (cardId: string, rating: Rating) => void;
  setDiagnostic: (result: DiagnosticResult) => void;
  setProgram: (plan: ProgramPlan) => void;
  seedKnown: (cardIds: string[]) => void;
  startLesson: (key: string) => void;
  recordDailySnapshot: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  resetAll: () => void;
  exportJSON: () => string;
  importJSON: (text: string) => void;

  // Object-level snapshot access for cloud sync (no JSON round-trip).
  getSnapshot: () => Snapshot;
  loadSnapshot: (snap: Snapshot) => void;

  // Selectors / helpers
  getCardState: (id: string) => CardState;
  dueCards: (now: number, categoryKey?: string) => Card[];
  todaysQueue: (now: number) => Card[];
}

export type Store = PersistedState & StoreActions;

const INITIAL_PERSISTED: PersistedState = {
  cardStates: {},
  program: null,
  diagnostic: null,
  lessons: {},
  dailyLog: [],
  settings: DEFAULT_SETTINGS,
};

// Every card in the deck, in content (path) order.
const ALL_CARDS: Card[] = categories.flatMap((c) => c.cards);
const CARD_BY_ID = new Map<string, Card>(ALL_CARDS.map((c) => [c.id, c]));

function paramsFromSettings(settings: Settings): FsrsParams {
  return { requestRetention: settings.requestRetention };
}

function ymd(now: number): string {
  const d = new Date(now);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function startOfDay(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...INITIAL_PERSISTED,

      gradeCard: (cardId, rating) => {
        const now = Date.now();
        const { settings } = get();
        const current = get().getCardState(cardId);
        const next = review(current, rating, now, paramsFromSettings(settings));
        set((s) => ({ cardStates: { ...s.cardStates, [cardId]: next } }));
      },

      setDiagnostic: (result) => set({ diagnostic: result }),

      setProgram: (plan) => set({ program: plan }),

      seedKnown: (cardIds) => {
        const now = Date.now();
        const { settings } = get();
        const params = paramsFromSettings(settings);
        set((s) => {
          const cardStates = { ...s.cardStates };
          for (const id of cardIds) {
            // Two "good" reviews lands the card in review state with a real
            // interval, representing prior knowledge from the diagnostic.
            let state = emptyState(now);
            state = review(state, 'good', now, params);
            state = review(state, 'good', now, params);
            cardStates[id] = state;
          }
          return { cardStates };
        });
      },

      startLesson: (key) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [key]: { startedAt: s.lessons[key]?.startedAt ?? Date.now() },
          },
        })),

      recordDailySnapshot: () => {
        const now = Date.now();
        const today = ymd(now);
        const dayStart = startOfDay(now);
        const states = get().cardStates;
        const allStates = Object.values(states);

        let reviews = 0;
        let newCards = 0;
        for (const st of allStates) {
          const todays = st.history.filter((h) => h.ts >= dayStart);
          reviews += todays.length;
          if (st.history.length > 0 && st.history[0].ts >= dayStart) newCards += 1;
        }
        const fluency = overallFluency(allStates, now);

        set((s) => {
          const rest = s.dailyLog.filter((e) => e.date !== today);
          const entry: DailyLogEntry = { date: today, reviews, newCards, fluency };
          return { dailyLog: [...rest, entry].sort((a, b) => a.date.localeCompare(b.date)) };
        });
      },

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetAll: () => set({ ...INITIAL_PERSISTED }),

      exportJSON: () => {
        const { cardStates, program, diagnostic, lessons, dailyLog, settings } = get();
        return JSON.stringify(
          { version: 1, cardStates, program, diagnostic, lessons, dailyLog, settings },
          null,
          2,
        );
      },

      importJSON: (text) => {
        const parsed = JSON.parse(text) as Partial<Snapshot>;
        get().loadSnapshot(parsed as Snapshot);
      },

      getSnapshot: () => {
        const { cardStates, program, diagnostic, lessons, dailyLog, settings } = get();
        return { cardStates, program, diagnostic, lessons, dailyLog, settings };
      },

      loadSnapshot: (snap) => {
        set({
          cardStates: snap.cardStates ?? {},
          program: snap.program ?? null,
          diagnostic: snap.diagnostic ?? null,
          lessons: snap.lessons ?? {},
          dailyLog: snap.dailyLog ?? [],
          settings: { ...DEFAULT_SETTINGS, ...(snap.settings ?? {}) },
        });
      },

      getCardState: (id) => {
        const existing = get().cardStates[id];
        return existing ?? emptyState(Date.now());
      },

      dueCards: (now, categoryKey) => {
        const states = get().cardStates;
        return ALL_CARDS.filter((card) => {
          if (categoryKey && card.categoryKey !== categoryKey) return false;
          const st = states[card.id];
          if (!st || st.state === 'new') return false;
          return st.due <= now;
        });
      },

      todaysQueue: (now) => {
        const { settings, cardStates } = get();
        const hideAdvanced = settings.hideAdvanced;
        const reviewQueue = get()
          .dueCards(now)
          .filter((c) => !(hideAdvanced && c.difficulty === 'advanced'));

        // New cards: those with no recorded state yet, capped per day, ordered by
        // the program path when one exists.
        const seenIds = new Set(reviewQueue.map((c) => c.id));
        let newPool = ALL_CARDS.filter((c) => {
          if (seenIds.has(c.id)) return false;
          if (hideAdvanced && c.difficulty === 'advanced') return false;
          const st = cardStates[c.id];
          return !st || st.state === 'new';
        });

        const program = get().program;
        if (program && program.path.length > 0) {
          const order = new Map(program.path.map((k, i) => [k, i]));
          newPool = [...newPool].sort(
            (a, b) =>
              (order.get(a.categoryKey) ?? 999) - (order.get(b.categoryKey) ?? 999),
          );
        }

        const newCards = newPool.slice(0, Math.max(0, settings.dailyNewCap));
        return [...reviewQueue, ...newCards];
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state): PersistedState => ({
        cardStates: state.cardStates,
        program: state.program,
        diagnostic: state.diagnostic,
        lessons: state.lessons,
        dailyLog: state.dailyLog,
        settings: state.settings,
      }),
    },
  ),
);

// Convenience export so non-hook callers (helpers, tests) can read card lookups.
export function getCardById(id: string): Card | undefined {
  return CARD_BY_ID.get(id);
}
