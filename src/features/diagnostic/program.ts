// Personalized program generator. Turns a DiagnosticResult plus a chosen target
// into a ProgramPlan: an ordered study path, a pre-seeded list of cards the
// learner already knows, daily new/review targets, and a plain-English rationale.
//
// buildProgram is PURE: it returns a plan and never touches the store. The Program
// component commits the plan (seedKnown + setProgram + updateSettings). Keeping the
// builder pure makes it testable and lets the UI decide when to seed.

import type {
  Card,
  Category,
  DiagnosticResult,
  ProgramPlan,
} from '../../types';
import { emptyState, review } from '../../lib/fsrs';
import { tierOf } from '../../data/tiers';

const DAY_MS = 86_400_000;

export const DEFAULT_REQUEST_RETENTION = 0.9;

const NEW_MIN = 5;
const NEW_MAX = 40;

// How far a weak category may be pulled forward past its prerequisite slot. A small
// window keeps prerequisites largely intact while still front-loading weak areas.
const LOOKAHEAD = 2;

// Ability assumed for a category the diagnostic never probed: neutral, so untested
// areas are neither aggressively front-loaded nor pushed to the back.
const UNTESTED_ABILITY = 0.5;

export type ProgramTarget =
  | { kind: 'date'; date: number }
  | { kind: 'weeks'; weeks: number };

export interface BuildProgramInput {
  diagnostic: DiagnosticResult;
  categories: Category[];
  target: ProgramTarget;
  requestRetention?: number;
  now?: number;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function cardMap(categories: Category[]): Map<string, Card> {
  const map = new Map<string, Card>();
  for (const cat of categories) for (const card of cat.cards) map.set(card.id, card);
  return map;
}

function totalCardCount(categories: Category[]): number {
  return categories.reduce((n, c) => n + c.cards.length, 0);
}

function resolveTargetDate(target: ProgramTarget, now: number): number {
  if (target.kind === 'date') return target.date;
  return now + Math.max(1, target.weeks) * 7 * DAY_MS;
}

function studyDaysUntil(targetDate: number, now: number): number {
  return Math.max(1, Math.ceil((targetDate - now) / DAY_MS));
}

// Cards the diagnostic showed as clearly known: answered "knew it" on an
// intermediate or advanced card. These get pre-seeded so the learner skips them.
export function seededKnownFromDiagnostic(
  categories: Category[],
  diagnostic: DiagnosticResult,
): string[] {
  const byId = cardMap(categories);
  const seeded: string[] = [];
  for (const r of diagnostic.responses) {
    if (r.outcome !== 'knew') continue;
    const card = byId.get(r.cardId);
    if (!card) continue;
    if (card.difficulty === 'intermediate' || card.difficulty === 'advanced') {
      seeded.push(r.cardId);
    }
  }
  return seeded;
}

// Ordered study path, TIER-AWARE. The curriculum is split into four tiers (see
// src/data/tiers.ts and src/data/prerequisites.ts). The hard rule: a later-tier
// module is never scheduled before all of its earlier-tier foundations, so you
// never study agents or safety before the basics of how a model works. Within a
// tier we still front-load the learner's weakest areas (bounded by a small
// lookahead window over the within-tier order, so a topic never jumps too far
// ahead of the ones it builds on). Module 'intro' is pinned to the very front as
// the universal starting point.
interface TierItem {
  key: string;
  ability: number;
}

function tierForCategory(c: Category): number {
  // Every category carries its own tier; fall back to the lookup, then tier 1.
  return c.tier ?? (tierOf(c.key) || 1);
}

// Weakest-first ordering within a single tier. `group` is already in the
// within-tier teaching order, which acts as the prerequisite backbone.
function orderWithinTier(group: TierItem[]): string[] {
  const remaining = group.map((g, index) => ({ ...g, index }));
  const out: string[] = [];
  while (remaining.length > 0) {
    const window = out.length + LOOKAHEAD;
    let eligible = remaining.filter((c) => c.index <= window);
    if (eligible.length === 0) eligible = [remaining[0]];
    // Weakest first, breaking ties by backbone position so prerequisites hold.
    eligible.sort((a, b) => a.ability - b.ability || a.index - b.index);
    const pick = eligible[0];
    out.push(pick.key);
    remaining.splice(remaining.indexOf(pick), 1);
  }
  return out;
}

export function orderPath(
  categories: Category[],
  diagnostic: DiagnosticResult,
): string[] {
  // Bucket categories by tier, preserving content order as the within-tier
  // backbone.
  const byTier = new Map<number, TierItem[]>();
  for (const c of categories) {
    const tier = tierForCategory(c);
    const item: TierItem = {
      key: c.key,
      ability: diagnostic.perCategory[c.key]?.ability ?? UNTESTED_ABILITY,
    };
    const list = byTier.get(tier);
    if (list) list.push(item);
    else byTier.set(tier, [item]);
  }

  // Walk tiers in ascending order; everything in tier N lands before tier N+1.
  const result: string[] = [];
  for (const tier of [...byTier.keys()].sort((a, b) => a - b)) {
    result.push(...orderWithinTier(byTier.get(tier)!));
  }

  // Pin 'intro' first regardless of how strong the learner tested on it.
  const introAt = result.indexOf('intro');
  if (introAt > 0) {
    result.splice(introAt, 1);
    result.unshift('intro');
  }
  return result;
}

// Rough daily review load at steady state, derived from FSRS. We simulate one card
// graded "good" repeatedly over a 30-day window to get reviews-per-card-per-day,
// then scale by the cards in active rotation.
function estimateDailyReviews(
  dailyNewTarget: number,
  seededCount: number,
  requestRetention: number,
  now: number,
): number {
  const params = { requestRetention };
  let card = emptyState(now);
  let cursor = now;
  let reviews = 0;
  const horizon = now + 30 * DAY_MS;
  for (let i = 0; i < 60; i++) {
    card = review(card, 'good', cursor, params);
    reviews += 1;
    cursor = card.due;
    if (cursor > horizon) break;
  }
  const perCardPerDay = reviews / 30;
  // A card stays in frequent rotation for roughly two weeks before intervals
  // stretch out, so active cards is about two weeks of new intake plus the seeded.
  const activeCards = dailyNewTarget * 14 + seededCount;
  const estimate = Math.round(activeCards * perCardPerDay);
  return clamp(estimate, 0, 200);
}

function buildRationale(args: {
  weakestNames: string[];
  dailyNewTarget: number;
  studyDays: number;
  seededCount: number;
}): string {
  const { weakestNames, dailyNewTarget, studyDays, seededCount } = args;
  const parts: string[] = [];

  if (weakestNames.length > 0) {
    const names =
      weakestNames.length === 1
        ? weakestNames[0]
        : `${weakestNames[0]} and ${weakestNames[1]}`;
    parts.push(
      `This plan puts your weakest areas first (${names}), so you close the biggest gaps early.`,
    );
  } else {
    parts.push('This plan walks the topics in order, building each on the last.');
  }

  if (dailyNewTarget > 0) {
    parts.push(
      `To reach fluency in about ${studyDays} days, aim for ${dailyNewTarget} new cards a day plus your due reviews.`,
    );
  } else {
    parts.push('The placement test cleared the deck, so you are in review-only mode.');
  }

  if (seededCount > 0) {
    const noun = seededCount === 1 ? 'card' : 'cards';
    parts.push(
      `The test marked ${seededCount} ${noun} you clearly knew, so those start as review and you skip straight to what is new.`,
    );
  }

  return parts.join(' ');
}

export function buildProgram(input: BuildProgramInput): ProgramPlan {
  const now = input.now ?? Date.now();
  const requestRetention = input.requestRetention ?? DEFAULT_REQUEST_RETENTION;
  const { categories, diagnostic } = input;

  const targetDate = resolveTargetDate(input.target, now);
  const studyDays = studyDaysUntil(targetDate, now);

  const path = orderPath(categories, diagnostic);

  const seeded = seededKnownFromDiagnostic(categories, diagnostic);
  const totalCards = totalCardCount(categories);
  const remainingUnknown = Math.max(0, totalCards - seeded.length);

  let dailyNewTarget: number;
  if (remainingUnknown === 0) {
    dailyNewTarget = 0;
  } else {
    const raw = Math.ceil(remainingUnknown / studyDays);
    const floor = Math.min(NEW_MIN, remainingUnknown);
    dailyNewTarget = clamp(raw, floor, NEW_MAX);
  }

  const dailyReviewEstimate = estimateDailyReviews(
    dailyNewTarget,
    seeded.length,
    requestRetention,
    now,
  );

  const nameByKey = new Map(categories.map((c) => [c.key, c.name]));
  const weakestNames = Object.entries(diagnostic.perCategory)
    .sort((a, b) => a[1].ability - b[1].ability)
    .slice(0, 2)
    .map(([key]) => nameByKey.get(key) ?? key);

  const rationale = buildRationale({
    weakestNames,
    dailyNewTarget,
    studyDays,
    seededCount: seeded.length,
  });

  return {
    createdAt: now,
    targetDate,
    path,
    dailyNewTarget,
    dailyReviewEstimate,
    requestRetention,
    seededKnown: seeded,
    rationale,
  };
}

// --- Cross-tab navigation -------------------------------------------------
// The app routes via App's local tab state, with no router or store hook. To keep
// "Start today's session" and the placement-test CTA working from within these
// feature components, navigateTo dispatches a CustomEvent (for App to subscribe to
// later, see contractDeviations) and, as a working fallback now, clicks the
// matching tab button in the existing tab bar.

export type NavTarget = 'program' | 'learn' | 'study' | 'dashboard' | 'diagnostic';

export const NAV_EVENT = 'llm-fluency-lab:nav';

const TAB_LABEL: Record<NavTarget, string> = {
  program: 'Home',
  learn: 'Learn',
  study: 'Study',
  dashboard: 'Dashboard',
  diagnostic: 'Diagnostic',
};

export function navigateTo(target: NavTarget): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: target }));
  if (typeof document === 'undefined') return;
  const label = TAB_LABEL[target];
  const tabs = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const match = tabs.find((b) => (b.textContent ?? '').trim() === label);
  match?.click();
}
