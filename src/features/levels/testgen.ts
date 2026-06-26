// Section-test generation and post-test gap analysis.
//
// Tests author no new content: every question is built at attempt time from the
// cards that already exist in the section's modules. A question is multiple
// choice (the card's answer plus distractors drawn from other cards); when a
// card's answer makes poor options we fall back to reveal-and-rate for that item.
//
// All randomness flows through a seeded PRNG so a given attempt renders the same
// test across re-renders, while a fresh seed on retry draws a different set.

import type {
  Card,
  CardState,
  Difficulty,
  TestQuestion,
  TestQuestionResult,
  WeakModule,
} from '../../types';
import type { LevelSection } from '../../data/levels';
import { categories } from '../../data/content';
import { categoryFluency } from '../../lib/fluency';

// Deterministic PRNG (mulberry32). Same seed -> same sequence.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CARDS_BY_MODULE = new Map<string, Card[]>(
  categories.map((c) => [c.key, c.cards]),
);

export function cardsForModules(
  moduleKeys: string[],
  difficulties: Difficulty[],
): Card[] {
  const allow = new Set(difficulties);
  const out: Card[] = [];
  for (const key of moduleKeys) {
    for (const card of CARDS_BY_MODULE.get(key) ?? []) {
      if (allow.has(card.difficulty)) out.push(card);
    }
  }
  return out;
}

// First sentence (or a clamped slice) of a card answer, so multiple-choice
// options stay short and comparable instead of full paragraphs.
function shortText(text: string, cap = 140): string {
  const trimmed = text.trim();
  const dot = trimmed.search(/[.!?](\s|$)/);
  const firstSentence = dot > 0 ? trimmed.slice(0, dot + 1) : trimmed;
  const picked = firstSentence.length >= 20 ? firstSentence : trimmed;
  return picked.length > cap ? `${picked.slice(0, cap - 1).trimEnd()}…` : picked;
}

// The option text we show for a card: prefer the plain-English version when it
// is short enough, else the precise answer.
function optionText(card: Card): string {
  const plain = shortText(card.plain);
  const answer = shortText(card.answer);
  return plain.length > 0 && plain.length <= answer.length ? plain : answer;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function norm(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

// Pick the questionCount cards to test: at least one from every module
// (coverage), then fill weighted toward the lowest current fluency.
function selectCards(
  section: LevelSection,
  fluencyOf: (card: Card) => number,
  rng: () => number,
): Card[] {
  const { questionCount, drawsFromModuleKeys, includeDifficulties } = section.test;
  const byModule = new Map<string, Card[]>();
  for (const key of drawsFromModuleKeys) {
    byModule.set(
      key,
      cardsForModules([key], includeDifficulties),
    );
  }

  // Weakest-first within each module.
  for (const list of byModule.values()) {
    list.sort((a, b) => fluencyOf(a) - fluencyOf(b));
  }

  const picked: Card[] = [];
  const used = new Set<string>();

  // Coverage: one weakest card from each module (modules in random order so a
  // truncated test does not always favour the same modules).
  for (const key of shuffle(drawsFromModuleKeys, rng)) {
    const list = byModule.get(key) ?? [];
    const card = list.find((c) => !used.has(c.id));
    if (card && picked.length < questionCount) {
      picked.push(card);
      used.add(card.id);
    }
  }

  // Fill the rest from the combined pool, weakest-first with a little jitter.
  const pool = drawsFromModuleKeys
    .flatMap((k) => byModule.get(k) ?? [])
    .filter((c) => !used.has(c.id))
    .sort((a, b) => fluencyOf(a) - fluencyOf(b) + (rng() - 0.5) * 8);

  for (const card of pool) {
    if (picked.length >= questionCount) break;
    picked.push(card);
    used.add(card.id);
  }

  return picked;
}

export interface GenerateTestArgs {
  section: LevelSection;
  getCardState: (id: string) => CardState;
  now: number;
  seed: number;
}

// Build the section test: select cards, then turn each into an MCQ (or a
// self-rate item when good distractors are unavailable).
export function generateSectionTest({
  section,
  getCardState,
  now,
  seed,
}: GenerateTestArgs): TestQuestion[] {
  const rng = mulberry32(seed);
  const fluencyOf = (card: Card) => {
    const st = getCardState(card.id);
    // Reuse the per-card fluency by treating the single state as a 1-element set.
    return categoryFluency([st], now);
  };

  const selected = selectCards(section, fluencyOf, rng);

  // Distractor pool: every card across the section's modules (all difficulties),
  // so even a core-only test can pull plausible wrong answers.
  const distractorPool = cardsForModules(
    section.moduleKeys,
    ['core', 'intermediate', 'advanced'],
  );

  return selected.map((card) => {
    const correct = optionText(card);
    const correctNorm = norm(correct);

    // Prefer distractors from the same module/subtopic for plausibility.
    const candidates = shuffle(
      distractorPool.filter(
        (c) => c.id !== card.id && norm(optionText(c)) !== correctNorm,
      ),
      rng,
    ).sort((a, b) => {
      const score = (c: Card) =>
        (c.categoryKey === card.categoryKey ? 2 : 0) +
        (c.subtopic === card.subtopic ? 1 : 0);
      return score(b) - score(a);
    });

    const distractors: string[] = [];
    const seen = new Set<string>([correctNorm]);
    for (const c of candidates) {
      const text = optionText(c);
      const n = norm(text);
      if (seen.has(n)) continue;
      seen.add(n);
      distractors.push(text);
      if (distractors.length === 3) break;
    }

    const base = {
      cardId: card.id,
      categoryKey: card.categoryKey,
      subtopic: card.subtopic,
      difficulty: card.difficulty,
      prompt: card.question,
      answer: card.answer,
    };

    // Not enough clean distractors -> reveal-and-rate fallback for this item.
    if (distractors.length < 3) {
      return { ...base, options: [], selfRate: true };
    }

    const options = shuffle(
      [
        { id: 'correct', text: correct, correct: true },
        ...distractors.map((text, i) => ({ id: `d${i}`, text, correct: false })),
      ],
      rng,
    );
    return { ...base, options };
  });
}

export function scorePct(results: TestQuestionResult[]): number {
  if (results.length === 0) return 0;
  const correct = results.filter((r) => r.correct).length;
  return Math.round((correct / results.length) * 100);
}

export interface AnalyzeArgs {
  section: LevelSection;
  results: TestQuestionResult[];
  getCardState: (id: string) => CardState;
  now: number;
}

// Gap analysis: rank the section's modules by how much the learner should
// restudy, blending in-test accuracy (0.6) with stored FSRS fluency (0.4). A
// module that was barely tested leans entirely on stored fluency so it is not
// falsely cleared or flagged.
export function analyzeWeakness({
  section,
  results,
  getCardState,
  now,
}: AnalyzeArgs): WeakModule[] {
  const out: WeakModule[] = section.moduleKeys.map((moduleKey) => {
    const moduleResults = results.filter((r) => r.categoryKey === moduleKey);
    const asked = moduleResults.length;
    const correct = moduleResults.filter((r) => r.correct).length;
    const missedSubtopics = Array.from(
      new Set(moduleResults.filter((r) => !r.correct).map((r) => r.subtopic).filter(Boolean)),
    );

    const cards = cardsForModules([moduleKey], ['core', 'intermediate', 'advanced']);
    const storedFluency =
      categoryFluency(cards.map((c) => getCardState(c.id)), now) / 100;

    let weakness: number;
    if (asked <= 1) {
      weakness = 1 - storedFluency;
    } else {
      const inTestAccuracy = correct / asked;
      weakness = 0.6 * (1 - inTestAccuracy) + 0.4 * (1 - storedFluency);
    }

    return { moduleKey, weakness: Math.max(0, Math.min(1, weakness)), missedSubtopics };
  });

  return out.sort((a, b) => b.weakness - a.weakness);
}
