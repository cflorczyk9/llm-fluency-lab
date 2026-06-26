// Shared types for LLM Fluency Lab.
// This file is the single source of truth. Every module imports from here.

export type Difficulty = 'core' | 'intermediate' | 'advanced';

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface BreakdownSection {
  heading: string;
  explanation: string;
  keyTerms: KeyTerm[];
}

export interface VideoRef {
  url: string;
  title: string;
  channel: string;
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
