// Unit tests for the spaced-repetition wrapper (ts-fsrs, FSRS 4.5/5).
// Pure logic, deterministic timestamps, no app state. Run with:
//   npx vitest run src/lib/fsrs.test.ts
//
// Coverage (per the module contract):
//  - new-card scheduling and history recording
//  - easy interval > good > hard (monotonic ordering)
//  - again lapses the card and shortens the interval
//  - retrievability decays as time passes
//  - higher requestRetention (0.95) schedules sooner than lower (0.85)

import { describe, expect, it } from 'vitest';

import type { CardState, FsrsParams } from '../types';
import { emptyState, previewIntervals, retrievability, review } from './fsrs';

const DAY = 86_400_000;
const START = Date.UTC(2026, 0, 1); // fixed epoch ms for determinism
const params: FsrsParams = { requestRetention: 0.9 };

// Build a stabilized, review-state card by grading it "good" a few times,
// each review happening exactly when the card falls due. This graduates the
// card out of the short-term learning steps into a real multi-day interval.
function mature(p: FsrsParams, start = START): CardState {
  let s = emptyState(start);
  for (let i = 0; i < 4; i += 1) s = review(s, 'good', s.due, p);
  return s;
}

describe('emptyState', () => {
  it('produces a fresh, unreviewed card due now', () => {
    const s = emptyState(START);
    expect(s.state).toBe('new');
    expect(s.reps).toBe(0);
    expect(s.lapses).toBe(0);
    expect(s.stability).toBe(0);
    expect(s.lastReview).toBeNull();
    expect(s.history).toEqual([]);
    expect(s.due).toBe(START);
  });
});

describe('review (new card scheduling)', () => {
  it('schedules the card forward, advances reps, and records history', () => {
    const s0 = emptyState(START);
    const s1 = review(s0, 'good', START, params);

    expect(s1.reps).toBe(1);
    expect(s1.state).not.toBe('new');
    expect(s1.lastReview).toBe(START);
    expect(s1.due).toBeGreaterThan(START);
    expect(s1.stability).toBeGreaterThan(0);
    expect(s1.history).toHaveLength(1);
    expect(s1.history[0]).toMatchObject({ ts: START, rating: 'good' });
  });

  it('does not mutate the input card state', () => {
    const s0 = emptyState(START);
    const snapshot = JSON.stringify(s0);
    review(s0, 'good', START, params);
    expect(JSON.stringify(s0)).toBe(snapshot);
  });
});

describe('interval ordering', () => {
  it('grades a card so easy > good > hard > again, all non-negative', () => {
    const s = mature(params);
    expect(s.state).toBe('review');

    const iv = previewIntervals(s, s.due, params);

    expect(iv.again).toBeGreaterThanOrEqual(0);
    expect(iv.hard).toBeGreaterThan(iv.again);
    expect(iv.good).toBeGreaterThan(iv.hard);
    expect(iv.easy).toBeGreaterThan(iv.good);
  });

  it('respects maximumInterval by shrinking long intervals', () => {
    const s = mature(params);
    const uncapped = previewIntervals(s, s.due, params);
    const capped = previewIntervals(s, s.due, { requestRetention: 0.9, maximumInterval: 30 });

    expect(uncapped.easy).toBeGreaterThan(100); // naturally a long interval
    expect(capped.easy).toBeLessThan(uncapped.easy);
  });
});

describe('again (lapse)', () => {
  it('moves a stabilized card to relearning, increments lapses, and shortens the interval', () => {
    const s = mature(params);
    expect(s.state).toBe('review');
    const priorIntervalDays = s.scheduledDays;

    const lapsed = review(s, 'again', s.due, params);

    expect(lapsed.state).toBe('relearning');
    expect(lapsed.lapses).toBe(s.lapses + 1);
    expect(lapsed.history[lapsed.history.length - 1]).toMatchObject({ rating: 'again' });

    const daysUntilDue = (lapsed.due - s.due) / DAY;
    expect(daysUntilDue).toBeLessThan(priorIntervalDays);
  });
});

describe('retrievability', () => {
  it('is 0 for a brand-new card', () => {
    expect(retrievability(emptyState(START), START)).toBe(0);
  });

  it('decays as time passes since the last review', () => {
    const s = mature(params);
    const atDue = retrievability(s, s.due);
    const muchLater = retrievability(s, s.due + 120 * DAY);

    expect(atDue).toBeGreaterThan(muchLater);
    expect(atDue).toBeLessThanOrEqual(1);
    expect(muchLater).toBeGreaterThanOrEqual(0);
    // At the due date, recall should sit near the request-retention target.
    expect(atDue).toBeGreaterThan(0.8);
    expect(atDue).toBeLessThan(0.95);
  });
});

describe('requestRetention', () => {
  it('schedules sooner at 0.95 than at 0.85 for the same card', () => {
    const s = mature({ requestRetention: 0.9 });

    const tighter = previewIntervals(s, s.due, { requestRetention: 0.95 });
    const looser = previewIntervals(s, s.due, { requestRetention: 0.85 });

    expect(tighter.good).toBeLessThan(looser.good);
    expect(tighter.hard).toBeLessThan(looser.hard);
    expect(tighter.easy).toBeLessThan(looser.easy);
  });
});
