import { describe, it, expect } from 'vitest';

import { mergeSnapshots } from './merge';
import type { Snapshot } from '../../store/store';
import type { CardState, Settings } from '../../types';

function cardState(partial: Partial<CardState>): CardState {
  return {
    due: 0,
    stability: 1,
    difficulty: 5,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 'review',
    lastReview: null,
    history: [],
    ...partial,
  };
}

const SETTINGS: Settings = {
  requestRetention: 0.9,
  interleave: true,
  dailyNewCap: 10,
  hideAdvanced: false,
};

function snapshot(partial: Partial<Snapshot>): Snapshot {
  return {
    cardStates: {},
    program: null,
    diagnostic: null,
    lessons: {},
    dailyLog: [],
    settings: SETTINGS,
    enrollment: null,
    ...partial,
  };
}

describe('mergeSnapshots — cardStates', () => {
  it('keeps the more recently reviewed state for a shared card', () => {
    const local = snapshot({ cardStates: { a: cardState({ reps: 3, lastReview: 100 }) } });
    const remote = snapshot({ cardStates: { a: cardState({ reps: 1, lastReview: 200 }) } });
    const merged = mergeSnapshots(local, remote);
    expect(merged.cardStates.a.lastReview).toBe(200);
    expect(merged.cardStates.a.reps).toBe(1);
  });

  it('unions cards that exist on only one side', () => {
    const local = snapshot({ cardStates: { a: cardState({ lastReview: 100 }) } });
    const remote = snapshot({ cardStates: { b: cardState({ lastReview: 50 }) } });
    const merged = mergeSnapshots(local, remote);
    expect(Object.keys(merged.cardStates).sort()).toEqual(['a', 'b']);
  });

  it('breaks lastReview ties toward more reps', () => {
    const local = snapshot({ cardStates: { a: cardState({ reps: 5, lastReview: 100 }) } });
    const remote = snapshot({ cardStates: { a: cardState({ reps: 2, lastReview: 100 }) } });
    expect(mergeSnapshots(local, remote).cardStates.a.reps).toBe(5);
  });

  it('is commutative on card progress', () => {
    const local = snapshot({ cardStates: { a: cardState({ reps: 3, lastReview: 100 }), c: cardState({ lastReview: 10 }) } });
    const remote = snapshot({ cardStates: { a: cardState({ reps: 1, lastReview: 200 }), b: cardState({ lastReview: 5 }) } });
    const ab = mergeSnapshots(local, remote).cardStates;
    const ba = mergeSnapshots(remote, local).cardStates;
    expect(ab).toEqual(ba);
  });

  it('merging a snapshot with itself is a no-op for cardStates', () => {
    const snap = snapshot({ cardStates: { a: cardState({ reps: 3, lastReview: 100 }) } });
    expect(mergeSnapshots(snap, snap).cardStates).toEqual(snap.cardStates);
  });
});

describe('mergeSnapshots — dailyLog', () => {
  it('keeps the entry with more reviews per date and sorts by date', () => {
    const local = snapshot({
      dailyLog: [
        { date: '2026-06-02', reviews: 5, newCards: 2, fluency: 40 },
        { date: '2026-06-01', reviews: 3, newCards: 1, fluency: 30 },
      ],
    });
    const remote = snapshot({
      dailyLog: [{ date: '2026-06-02', reviews: 9, newCards: 4, fluency: 55 }],
    });
    const merged = mergeSnapshots(local, remote).dailyLog;
    expect(merged.map((e) => e.date)).toEqual(['2026-06-01', '2026-06-02']);
    expect(merged.find((e) => e.date === '2026-06-02')?.reviews).toBe(9);
  });
});

describe('mergeSnapshots — lessons', () => {
  it('keeps the earliest startedAt per lesson', () => {
    const local = snapshot({ lessons: { intro: { startedAt: 500 } } });
    const remote = snapshot({ lessons: { intro: { startedAt: 200 }, rag: { startedAt: 700 } } });
    const merged = mergeSnapshots(local, remote).lessons;
    expect(merged.intro.startedAt).toBe(200);
    expect(merged.rag.startedAt).toBe(700);
  });
});

describe('mergeSnapshots — diagnostic, program, settings', () => {
  it('keeps the most recently completed diagnostic', () => {
    const local = snapshot({
      diagnostic: { completedAt: 100, perCategory: {}, overall: 0.5, calibration: 0.1, responses: [] },
    });
    const remote = snapshot({
      diagnostic: { completedAt: 300, perCategory: {}, overall: 0.7, calibration: 0.2, responses: [] },
    });
    expect(mergeSnapshots(local, remote).diagnostic?.completedAt).toBe(300);
  });

  it('keeps the most recently created program', () => {
    const mk = (createdAt: number) => ({
      createdAt,
      targetDate: 0,
      path: [],
      dailyNewTarget: 5,
      dailyReviewEstimate: 10,
      requestRetention: 0.9,
      seededKnown: [],
      rationale: '',
    });
    const local = snapshot({ program: mk(100) });
    const remote = snapshot({ program: mk(250) });
    expect(mergeSnapshots(local, remote).program?.createdAt).toBe(250);
  });

  it('falls back to whichever side has the value', () => {
    const local = snapshot({ diagnostic: null });
    const remote = snapshot({
      diagnostic: { completedAt: 5, perCategory: {}, overall: 0.5, calibration: 0.1, responses: [] },
    });
    expect(mergeSnapshots(local, remote).diagnostic?.completedAt).toBe(5);
  });

  it('keeps the local device settings', () => {
    const local = snapshot({ settings: { ...SETTINGS, dailyNewCap: 25 } });
    const remote = snapshot({ settings: { ...SETTINGS, dailyNewCap: 3 } });
    expect(mergeSnapshots(local, remote).settings.dailyNewCap).toBe(25);
  });
});
