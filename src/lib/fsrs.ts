// Spaced-repetition scheduler. Thin wrapper around ts-fsrs (FSRS 4.5/5).
// Do NOT hand-roll SM-2. The UI codes against the four exported functions.
//
// This is the FOUNDATION wrapper: real, working signatures backed by ts-fsrs so
// the store can wire gradeCard -> review immediately. A downstream agent may
// extend it (fuzz, learning steps, custom weights) without changing signatures.

import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating as FsrsRating,
  State as FsrsState,
  type Card as FsrsCard,
  type FSRS,
  type Grade,
} from 'ts-fsrs';
import type { CardState, FsrsParams, MemoryState, Rating } from '../types';

const MS_PER_DAY = 86_400_000;

const RATING_TO_FSRS: Record<Rating, Grade> = {
  again: FsrsRating.Again,
  hard: FsrsRating.Hard,
  good: FsrsRating.Good,
  easy: FsrsRating.Easy,
};

const STATE_FROM_FSRS: Record<number, MemoryState> = {
  [FsrsState.New]: 'new',
  [FsrsState.Learning]: 'learning',
  [FsrsState.Review]: 'review',
  [FsrsState.Relearning]: 'relearning',
};

const STATE_TO_FSRS: Record<MemoryState, FsrsState> = {
  new: FsrsState.New,
  learning: FsrsState.Learning,
  review: FsrsState.Review,
  relearning: FsrsState.Relearning,
};

function makeScheduler(params: FsrsParams): FSRS {
  return fsrs(
    generatorParameters({
      request_retention: params.requestRetention,
      maximum_interval: params.maximumInterval ?? 36_500,
      enable_fuzz: false,
    }),
  );
}

// Convert our serializable CardState into a ts-fsrs Card. History is kept on our
// side only; ts-fsrs does not need it to schedule the next interval.
function toFsrsCard(card: CardState): FsrsCard {
  return {
    due: new Date(card.due),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    reps: card.reps,
    lapses: card.lapses,
    state: STATE_TO_FSRS[card.state],
    last_review: card.lastReview != null ? new Date(card.lastReview) : undefined,
  };
}

function fromFsrsCard(fsrsCard: FsrsCard, history: CardState['history']): CardState {
  return {
    due: new Date(fsrsCard.due).getTime(),
    stability: fsrsCard.stability,
    difficulty: fsrsCard.difficulty,
    elapsedDays: fsrsCard.elapsed_days,
    scheduledDays: fsrsCard.scheduled_days,
    reps: fsrsCard.reps,
    lapses: fsrsCard.lapses,
    state: STATE_FROM_FSRS[fsrsCard.state] ?? 'new',
    lastReview: fsrsCard.last_review ? new Date(fsrsCard.last_review).getTime() : null,
    history,
  };
}

export function emptyState(now: number): CardState {
  return fromFsrsCard(createEmptyCard(new Date(now)), []);
}

export function review(
  card: CardState,
  rating: Rating,
  now: number,
  params: FsrsParams,
): CardState {
  const scheduler = makeScheduler(params);
  const result = scheduler.next(toFsrsCard(card), new Date(now), RATING_TO_FSRS[rating]);
  const nextHistory = [...card.history, { ts: now, rating }];
  return fromFsrsCard(result.card, nextHistory);
}

export function retrievability(card: CardState, now: number): number {
  // New cards have no recall history yet.
  if (card.lastReview == null || card.state === 'new') return 0;
  const scheduler = makeScheduler({ requestRetention: 0.9 });
  return scheduler.get_retrievability(toFsrsCard(card), new Date(now), false);
}

export function previewIntervals(
  card: CardState,
  now: number,
  params: FsrsParams,
): Record<Rating, number> {
  const scheduler = makeScheduler(params);
  const log = scheduler.repeat(toFsrsCard(card), new Date(now));
  const daysUntilDue = (next: FsrsCard): number =>
    Math.max(0, (new Date(next.due).getTime() - now) / MS_PER_DAY);
  return {
    again: daysUntilDue(log[FsrsRating.Again].card),
    hard: daysUntilDue(log[FsrsRating.Hard].card),
    good: daysUntilDue(log[FsrsRating.Good].card),
    easy: daysUntilDue(log[FsrsRating.Easy].card),
  };
}
