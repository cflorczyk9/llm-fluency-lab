// Adaptive placement engine (CAT-lite) for the diagnostic.
//
// Pure logic, no React. The Diagnostic component holds the answered responses in
// state and asks this module for the next probe and, at the end, the scored
// result. Selection is deterministic over the responses so re-renders are stable.
//
// Strategy: breadth first, then depth.
//  1. Probe every category once at its lowest available difficulty.
//  2. Spend the remaining budget stepping UP in areas the learner clearly knew
//     (to find their ceiling) and confirming the floor in areas they missed.
// Difficulty steps within a category: core -> intermediate -> advanced.

import type {
  Card,
  Category,
  Difficulty,
  DiagnosticResponse,
  DiagnosticResult,
} from '../../types';
import { tierOf } from '../../data/tiers';

export const DIFFICULTY_ORDER: Difficulty[] = ['core', 'intermediate', 'advanced'];

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  core: 0,
  intermediate: 1,
  advanced: 2,
};

// Harder questions carry more weight when scoring an area: getting an advanced
// card right says more about ability than getting a core card right.
const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  core: 1,
  intermediate: 1.6,
  advanced: 2.2,
};

type Outcome = DiagnosticResponse['outcome'];

const OUTCOME_SCORE: Record<Outcome, number> = { knew: 1, partial: 0.5, missed: 0 };

export function outcomeScore(outcome: Outcome): number {
  return OUTCOME_SCORE[outcome];
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

// How many items the placement test should run. The curriculum is 24 modules
// across four tiers, so we aim for about 18 to 22 probes (roughly five per tier):
// wide enough to touch every tier with a few probes each, short enough to stay
// under ~10 minutes. Scales down for smaller decks but never below a useful
// floor, and never more than the cards that actually exist (so a tiny stub deck
// still runs a sane, finite test).
const BREADTH_TARGET_BUDGET = 22;
const BREADTH_FLOOR_BUDGET = 18;

export function planBudget(categoryCount: number, totalCards: number): number {
  const target = Math.min(
    BREADTH_TARGET_BUDGET,
    Math.max(BREADTH_FLOOR_BUDGET, Math.round(categoryCount * 0.85)),
  );
  return Math.max(1, Math.min(target, Math.max(1, totalCards)));
}

// During the breadth phase, probe each tier up to this many distinct modules
// before going deeper. With four tiers this guarantees the test samples every
// tier early (at least 2 to 3 probes per tier) and stays breadth-first.
const BREADTH_PER_TIER = 3;

interface CatInfo {
  category: Category;
  index: number;
  tier: number;
  cardsByDiff: Record<Difficulty, Card[]>;
}

function indexCategories(categories: Category[]): CatInfo[] {
  return categories.map((category, index) => {
    const cardsByDiff: Record<Difficulty, Card[]> = {
      core: [],
      intermediate: [],
      advanced: [],
    };
    for (const card of category.cards) cardsByDiff[card.difficulty].push(card);
    const tier = category.tier ?? (tierOf(category.key) || 1);
    return { category, index, tier, cardsByDiff };
  });
}

function findCardById(infos: CatInfo[], id: string): Card | null {
  for (const info of infos) {
    for (const list of Object.values(info.cardsByDiff)) {
      const hit = list.find((c) => c.id === id);
      if (hit) return hit;
    }
  }
  return null;
}

export interface ProbeContext {
  categories: Category[];
  budget: number;
  responses: DiagnosticResponse[];
}

// Returns the next card to show, or null when the test is complete (budget hit or
// no unasked cards remain).
export function selectNextProbe(ctx: ProbeContext): Card | null {
  const { categories, budget, responses } = ctx;
  if (responses.length >= budget) return null;

  const infos = indexCategories(categories);
  const asked = new Set(responses.map((r) => r.cardId));

  interface Stat {
    probes: number;
    maxRank: number; // highest difficulty rank asked, -1 if none
    minRank: number; // lowest difficulty rank asked, 99 if none
    lastOutcome: Outcome | null;
  }
  const stat = new Map<string, Stat>();
  for (const info of infos) {
    stat.set(info.category.key, {
      probes: 0,
      maxRank: -1,
      minRank: 99,
      lastOutcome: null,
    });
  }
  for (const r of responses) {
    const s = stat.get(r.categoryKey);
    if (!s) continue;
    const card = findCardById(infos, r.cardId);
    const rank = card ? DIFFICULTY_RANK[card.difficulty] : 0;
    s.probes += 1;
    s.maxRank = Math.max(s.maxRank, rank);
    s.minRank = Math.min(s.minRank, rank);
    s.lastOutcome = r.outcome;
  }

  const unaskedAt = (info: CatInfo, rank: number): Card | null => {
    const diff = DIFFICULTY_ORDER[rank];
    if (!diff) return null;
    return info.cardsByDiff[diff].find((c) => !asked.has(c.id)) ?? null;
  };
  const firstUnaskedByRanks = (info: CatInfo, ranks: number[]): Card | null => {
    for (const rank of ranks) {
      const card = unaskedAt(info, rank);
      if (card) return card;
    }
    return null;
  };
  const lowestUnasked = (info: CatInfo): Card | null =>
    firstUnaskedByRanks(info, [0, 1, 2]);

  // Phase 1: breadth, balanced across tiers. Probe up to BREADTH_PER_TIER distinct
  // modules in each tier before going deeper, always picking from the tier sampled
  // least so far. This guarantees all four tiers get an early look (at least a few
  // probes each) instead of exhausting tier 1 before tier 4 is ever touched.
  const tierProbes = new Map<number, number>();
  for (const info of infos) {
    if (!tierProbes.has(info.tier)) tierProbes.set(info.tier, 0);
  }
  for (const info of infos) {
    tierProbes.set(
      info.tier,
      (tierProbes.get(info.tier) ?? 0) + stat.get(info.category.key)!.probes,
    );
  }
  const breadthCandidates = infos.filter(
    (info) =>
      stat.get(info.category.key)!.probes === 0 &&
      (tierProbes.get(info.tier) ?? 0) < BREADTH_PER_TIER,
  );
  if (breadthCandidates.length > 0) {
    breadthCandidates.sort(
      (a, b) =>
        (tierProbes.get(a.tier) ?? 0) - (tierProbes.get(b.tier) ?? 0) ||
        a.tier - b.tier ||
        a.index - b.index,
    );
    const card = lowestUnasked(breadthCandidates[0]);
    if (card) return card;
  }

  // Phase 2: depth up. Where the last answer was "knew", step to a harder card to
  // find the ceiling. Spread depth by preferring the least-probed such category.
  let best: { card: Card; probes: number; index: number } | null = null;
  for (const info of infos) {
    const s = stat.get(info.category.key)!;
    if (s.lastOutcome !== 'knew') continue;
    const card = firstUnaskedByRanks(info, [s.maxRank + 1, s.maxRank + 2]);
    if (!card) continue;
    if (
      !best ||
      s.probes < best.probes ||
      (s.probes === best.probes && info.index < best.index)
    ) {
      best = { card, probes: s.probes, index: info.index };
    }
  }
  if (best) return best.card;

  // Phase 3: confirm the floor. Where the last answer was missed or partial, ask an
  // easier-or-equal card to pin down what they do know.
  for (const info of infos) {
    const s = stat.get(info.category.key)!;
    if (s.lastOutcome === 'missed' || s.lastOutcome === 'partial') {
      const card = firstUnaskedByRanks(info, [s.minRank, s.minRank - 1, s.minRank - 2]);
      if (card) return card;
    }
  }

  // Phase 4: fill remaining budget with any unasked card, least-probed area first.
  const ordered = [...infos].sort(
    (a, b) =>
      stat.get(a.category.key)!.probes - stat.get(b.category.key)!.probes ||
      a.index - b.index,
  );
  for (const info of ordered) {
    const card = lowestUnasked(info);
    if (card) return card;
  }
  return null;
}

// Categories that have received at least one probe so far (for the coverage chips).
export function probedCategoryKeys(responses: DiagnosticResponse[]): Set<string> {
  return new Set(responses.map((r) => r.categoryKey));
}

// Turn the answered responses into a scored DiagnosticResult. Per-category ability
// is a difficulty-weighted average of outcome scores. Calibration is the mean gap
// between stated pre-answer confidence and actual correctness (lower is better).
export function scoreDiagnostic(
  categories: Category[],
  responses: DiagnosticResponse[],
  completedAt: number,
): DiagnosticResult {
  const infos = indexCategories(categories);

  interface Acc {
    weightSum: number;
    weightedScore: number;
    tested: number;
  }
  const acc = new Map<string, Acc>();
  let calibrationSum = 0;

  for (const r of responses) {
    const card = findCardById(infos, r.cardId);
    const difficulty: Difficulty = card?.difficulty ?? 'core';
    const weight = DIFFICULTY_WEIGHT[difficulty];
    const score = OUTCOME_SCORE[r.outcome];

    const a = acc.get(r.categoryKey) ?? { weightSum: 0, weightedScore: 0, tested: 0 };
    a.weightSum += weight;
    a.weightedScore += weight * score;
    a.tested += 1;
    acc.set(r.categoryKey, a);

    calibrationSum += Math.abs(r.confidence - score);
  }

  const perCategory: Record<string, { ability: number; tested: number }> = {};
  for (const [key, a] of acc) {
    perCategory[key] = {
      ability: a.weightSum > 0 ? clamp01(a.weightedScore / a.weightSum) : 0,
      tested: a.tested,
    };
  }

  const abilities = Object.values(perCategory).map((p) => p.ability);
  const overall = abilities.length
    ? clamp01(abilities.reduce((sum, x) => sum + x, 0) / abilities.length)
    : 0;
  const calibration = responses.length ? calibrationSum / responses.length : 0;

  return { completedAt, perCategory, overall, calibration, responses };
}
