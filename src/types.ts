// Shared types for LLM Fluency Lab.
// This file is the single source of truth. Every module imports from here.

export type Difficulty = 'core' | 'intermediate' | 'advanced';

export type LevelKey = 'beginner' | 'intermediate' | 'expert';

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface VideoRef {
  url: string;
  title: string;
  channel: string;
}

export interface BreakdownSection {
  heading: string;
  // Full prose, now used as the optional "Read more" detail behind a toggle.
  explanation: string;
  keyTerms: KeyTerm[];
  // Optional diagram-led fields layered on for the "See how it works" view.
  // caption: 1-2 short plain sentences that explain the visual quickly.
  caption?: string;
  // svg: a single self-contained inline <svg> string (with xmlns) that
  // schematically visualizes this one concept. Injected via
  // dangerouslySetInnerHTML, so it must be valid standalone SVG markup.
  svg?: string;
  // video: a curated YouTube explainer for this concept.
  video?: VideoRef;
}

export interface Card {
  id: string;
  categoryKey: string;
  category: string;
  subtopic: string;
  question: string;
  answer: string;
  plain: string;
  difficulty: Difficulty;
}

export interface Category {
  key: string;
  name: string;
  summary: string;
  breakdown: BreakdownSection[];
  video?: VideoRef;
  cards: Card[];
  tier?: number;
  learningObjectives?: string[];
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';
export type MemoryState = 'new' | 'learning' | 'review' | 'relearning';

export interface CardState {
  due: number; // epoch ms
  stability: number;
  difficulty: number; // FSRS difficulty 1..10
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: MemoryState;
  lastReview: number | null;
  history: Array<{ ts: number; rating: Rating }>;
}

export interface FsrsParams {
  requestRetention: number;
  maximumInterval?: number;
}

export interface DiagnosticResponse {
  cardId: string;
  categoryKey: string;
  confidence: number; // 0..1 pre-reveal
  outcome: 'knew' | 'partial' | 'missed';
}

export interface DiagnosticResult {
  completedAt: number;
  perCategory: Record<string, { ability: number /*0..1*/; tested: number }>;
  overall: number; // 0..1
  calibration: number; // mean |confidence - correctness|, lower is better
  responses: DiagnosticResponse[];
}

export interface ProgramPlan {
  createdAt: number;
  targetDate: number; // epoch ms "fluent by"
  path: string[]; // ordered categoryKeys, prerequisite-aware
  dailyNewTarget: number;
  dailyReviewEstimate: number;
  requestRetention: number;
  seededKnown: string[]; // cardIds pre-seeded from diagnostic
  rationale: string; // plain-English why this plan
}

export interface DailyLogEntry {
  date: string; // YYYY-MM-DD
  reviews: number;
  newCards: number;
  fluency: number;
}

export interface Settings {
  requestRetention: number;
  interleave: boolean;
  dailyNewCap: number;
  hideAdvanced: boolean;
}

// --- Learning levels (guided paths over the deck) ---
// Static curriculum types (LevelPlan, LevelSection, ScheduleDay, ...) live in
// data/levels.ts. The types below are the per-user runtime state, persisted in
// the store and synced like the rest of the snapshot.

// One generated multiple-choice option for a section-test question.
export interface TestOption {
  id: string;
  text: string;
  correct: boolean;
}

// A generated section-test question. Normally multiple-choice; when a card's
// answer makes poor options, `selfRate` is set and the runner falls back to
// reveal-and-rate for that item.
export interface TestQuestion {
  cardId: string;
  categoryKey: string;
  subtopic: string;
  difficulty: Difficulty;
  prompt: string; // the card's question
  answer: string; // the correct answer (shown on reveal)
  options: TestOption[]; // shuffled; exactly one correct (empty when selfRate)
  selfRate?: boolean;
}

export interface TestQuestionResult {
  cardId: string;
  categoryKey: string;
  subtopic: string;
  difficulty: Difficulty;
  correct: boolean;
  chosen?: string; // chosen option text, or self-rating
}

export interface SectionTestAttempt {
  sectionId: string;
  level: LevelKey;
  startedAt: number;
  completedAt: number;
  scorePct: number;
  passThresholdPct: number;
  passed: boolean;
  questions: TestQuestionResult[];
  weakModuleKeys: string[];
}

export type SectionStatus = 'locked' | 'available' | 'passed';

export interface SectionProgress {
  sectionId: string;
  status: SectionStatus;
  bestScorePct?: number;
  attempts: number;
  lastAttemptAt?: number;
}

export interface LevelEnrollment {
  level: LevelKey;
  startedAt: number;
  anchorDate: string; // YYYY-MM-DD of day 1
  currentDayIndex: number; // 1-based pointer into the flattened schedule
  sectionProgress: Record<string, SectionProgress>;
  attempts: SectionTestAttempt[];
}

// A flagged module in the post-test gap analysis.
export interface WeakModule {
  moduleKey: string;
  weakness: number; // 0..1, higher = study more
  missedSubtopics: string[];
}
