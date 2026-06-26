import { describe, it, expect } from 'vitest';

import { generateSectionTest, analyzeWeakness, scorePct, mulberry32 } from './testgen';
import { LEVELS } from '../../data/levels';
import { emptyState } from '../../lib/fsrs';
import type { CardState, TestQuestionResult } from '../../types';

const NOW = 1_700_000_000_000;
const getCardState = (): CardState => emptyState(NOW);

const beginnerSection = LEVELS.beginner.sections[0];

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe('generateSectionTest', () => {
  it('returns exactly questionCount questions', () => {
    const test = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 1 });
    expect(test).toHaveLength(beginnerSection.test.questionCount);
  });

  it('is deterministic across renders with the same seed, varies with a new seed', () => {
    const a = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 7 });
    const b = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 7 });
    const c = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 99 });
    expect(a.map((q) => q.cardId)).toEqual(b.map((q) => q.cardId));
    expect(a.map((q) => q.cardId)).not.toEqual(c.map((q) => q.cardId));
  });

  it('covers every module in the section at least once', () => {
    const test = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 3 });
    const covered = new Set(test.map((q) => q.categoryKey));
    for (const key of beginnerSection.moduleKeys) {
      expect(covered.has(key)).toBe(true);
    }
  });

  it('MCQ questions have exactly one correct option among four', () => {
    const test = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 5 });
    for (const q of test) {
      if (q.selfRate) continue;
      expect(q.options).toHaveLength(4);
      expect(q.options.filter((o) => o.correct)).toHaveLength(1);
      // no duplicate option text
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
    }
  });

  it('draws only from the allowed difficulties', () => {
    const test = generateSectionTest({ section: beginnerSection, getCardState, now: NOW, seed: 2 });
    const allowed = new Set(beginnerSection.test.includeDifficulties);
    for (const q of test) expect(allowed.has(q.difficulty)).toBe(true);
  });
});

describe('scorePct', () => {
  it('rounds correct/total to a percent', () => {
    const mk = (correct: boolean): TestQuestionResult => ({
      cardId: 'x',
      categoryKey: 'intro',
      subtopic: 's',
      difficulty: 'core',
      correct,
    });
    expect(scorePct([mk(true), mk(true), mk(false), mk(false)])).toBe(50);
    expect(scorePct([mk(true), mk(true), mk(true)])).toBe(100);
    expect(scorePct([])).toBe(0);
  });
});

describe('analyzeWeakness', () => {
  it('ranks the module with more missed answers as weaker', () => {
    const section = beginnerSection; // modules: intro, tokenization
    const [m1, m2] = section.moduleKeys;
    const results: TestQuestionResult[] = [
      // m1: all wrong
      { cardId: 'a', categoryKey: m1, subtopic: 'history', difficulty: 'core', correct: false },
      { cardId: 'b', categoryKey: m1, subtopic: 'definition', difficulty: 'core', correct: false },
      // m2: all right
      { cardId: 'c', categoryKey: m2, subtopic: 'tokens', difficulty: 'core', correct: true },
      { cardId: 'd', categoryKey: m2, subtopic: 'tokens', difficulty: 'core', correct: true },
    ];
    const weak = analyzeWeakness({ section, results, getCardState, now: NOW });
    expect(weak[0].moduleKey).toBe(m1);
    expect(weak[0].weakness).toBeGreaterThan(weak[weak.length - 1].weakness);
    expect(weak[0].missedSubtopics).toEqual(expect.arrayContaining(['history', 'definition']));
  });
});
