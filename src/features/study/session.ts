// Pure helpers for the Study session: queue building, category interleaving,
// interval formatting, and confidence calibration. No React, no store. The
// Study component composes these with store selectors.

import type { Card, CardState, Rating, VideoRef } from '../../types';
import { categories } from '../../data/content';

// Lookup tables built once from the content deck.
export const CATEGORY_BY_KEY = new Map(categories.map((c) => [c.key, c]));
export const ALL_CARDS: Card[] = categories.flatMap((c) => c.cards);

export interface FocusOption {
  key: string;
  name: string;
}

export const FOCUS_OPTIONS: FocusOption[] = categories.map((c) => ({
  key: c.key,
  name: c.name,
}));

// The category video that backs a given card, if the deck defines one.
export function videoForCard(card: Card): VideoRef | null {
  const cat = CATEGORY_BY_KEY.get(card.categoryKey);
  return cat?.video ?? null;
}

// Turn a "days until due" number into a short human label for grade buttons.
export function fmtInterval(days: number): string {
  if (!isFinite(days) || days <= 0) {
    const mins = Math.round(days * 24 * 60);
    return mins <= 1 ? '<1m' : `${mins}m`;
  }
  if (days < 1 / 24) {
    const mins = Math.max(1, Math.round(days * 24 * 60));
    return `${mins}m`;
  }
  if (days < 1) {
    const hours = Math.max(1, Math.round(days * 24));
    return `${hours}h`;
  }
  if (days < 30) {
    return `${Math.round(days)}d`;
  }
  if (days < 365) {
    return `${Math.round(days / 30)}mo`;
  }
  return `${(days / 365).toFixed(days < 365 * 2 ? 1 : 0)}y`;
}

// A longer phrasing for the "next card is due" closing line.
export function fmtDueFromNow(ms: number): string {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${Math.max(1, mins)} minute${mins === 1 ? '' : 's'}`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

// Group cards by category, preserving first-seen category order and the order
// of cards within each category.
function groupByCategory(cards: Card[]): { order: string[]; groups: Map<string, Card[]> } {
  const groups = new Map<string, Card[]>();
  const order: string[] = [];
  for (const c of cards) {
    let g = groups.get(c.categoryKey);
    if (!g) {
      g = [];
      groups.set(c.categoryKey, g);
      order.push(c.categoryKey);
    }
    g.push(c);
  }
  return { order, groups };
}

// Round-robin across categories so the learner does not drill one topic in a
// block. This is the interleaving best practice: it feels harder, retains more.
export function interleaveByCategory(cards: Card[]): Card[] {
  const { order, groups } = groupByCategory(cards);
  const cursors = new Map(order.map((k) => [k, 0]));
  const out: Card[] = [];
  let placed = 0;
  while (placed < cards.length) {
    for (const k of order) {
      const g = groups.get(k)!;
      const i = cursors.get(k)!;
      if (i < g.length) {
        out.push(g[i]);
        cursors.set(k, i + 1);
        placed += 1;
      }
    }
  }
  return out;
}

// Keep cards blocked by category (interleaving turned off).
export function blockByCategory(cards: Card[]): Card[] {
  const { order, groups } = groupByCategory(cards);
  return order.flatMap((k) => groups.get(k)!);
}

// Final ordering for a session. A focus filter means a single category, so the
// interleave flag is moot there.
export function orderSession(cards: Card[], interleave: boolean, focused: boolean): Card[] {
  if (focused) return cards;
  return interleave ? interleaveByCategory(cards) : blockByCategory(cards);
}

// Build the queue for a single focused category, mirroring the store's
// todaysQueue rules (due reviews first, then capped unseen new cards).
export function buildFocusQueue(opts: {
  focusKey: string;
  now: number;
  hideAdvanced: boolean;
  newCap: number;
  getCardState: (id: string) => CardState;
}): Card[] {
  const { focusKey, now, hideAdvanced, newCap, getCardState } = opts;
  const cards = CATEGORY_BY_KEY.get(focusKey)?.cards ?? [];
  const allowed = (c: Card) => !(hideAdvanced && c.difficulty === 'advanced');

  const due = cards.filter((c) => {
    if (!allowed(c)) return false;
    const st = getCardState(c.id);
    return st.state !== 'new' && st.due <= now;
  });
  const seen = new Set(due.map((c) => c.id));
  const fresh = cards
    .filter((c) => {
      if (seen.has(c.id) || !allowed(c)) return false;
      return getCardState(c.id).state === 'new';
    })
    .slice(0, Math.max(0, newCap));

  return [...due, ...fresh];
}

// Cards available to study early once the scheduled queue is empty: unseen new
// cards first (learn ahead), then seen-but-not-yet-due cards sorted by how soon
// they come back (cram). Returns the queue plus availability counts.
export function buildAheadQueue(opts: {
  now: number;
  focusKey: string | null;
  hideAdvanced: boolean;
  limit: number;
  getCardState: (id: string) => CardState;
}): { queue: Card[]; newAvail: number; cramAvail: number } {
  const { now, focusKey, hideAdvanced, limit, getCardState } = opts;
  const pool = focusKey ? (CATEGORY_BY_KEY.get(focusKey)?.cards ?? []) : ALL_CARDS;
  const allowed = (c: Card) => !(hideAdvanced && c.difficulty === 'advanced');

  const fresh: Card[] = [];
  const upcoming: Card[] = [];
  for (const c of pool) {
    if (!allowed(c)) continue;
    const st = getCardState(c.id);
    if (st.state === 'new') fresh.push(c);
    else if (st.due > now) upcoming.push(c);
  }
  upcoming.sort((a, b) => getCardState(a.id).due - getCardState(b.id).due);

  const queue = (fresh.length > 0 ? fresh : upcoming).slice(0, Math.max(0, limit));
  return { queue, newAvail: fresh.length, cramAvail: upcoming.length };
}

// Soonest moment a seen card comes due again, for the closing "next up" line.
export function nextDueAt(opts: {
  now: number;
  getCardState: (id: string) => CardState;
}): number | null {
  const { now, getCardState } = opts;
  let soonest: number | null = null;
  for (const c of ALL_CARDS) {
    const st = getCardState(c.id);
    if (st.state === 'new') continue;
    if (st.due > now && (soonest === null || st.due < soonest)) soonest = st.due;
  }
  return soonest;
}

// ---- Confidence calibration (metacognition) ----

export interface ConfSample {
  confidence: number; // 0..1, what the learner predicted before reveal
  rating: Rating; // how it actually went
}

// Map a grade to a 0..1 "did you actually know it" score.
export function ratingCorrectness(rating: Rating): number {
  switch (rating) {
    case 'again':
      return 0;
    case 'hard':
      return 0.4;
    case 'good':
      return 0.85;
    case 'easy':
      return 1;
  }
}

export interface Calibration {
  samples: number;
  gap: number; // mean |confidence - correctness|, lower is better
  headline: string;
  detail: string;
}

// Summarize how well predicted confidence matched real recall this session.
export function calibrationSummary(samples: ConfSample[]): Calibration | null {
  if (samples.length === 0) return null;
  let gapSum = 0;
  let confSum = 0;
  let correctSum = 0;
  for (const s of samples) {
    const correct = ratingCorrectness(s.rating);
    gapSum += Math.abs(s.confidence - correct);
    confSum += s.confidence;
    correctSum += correct;
  }
  const gap = gapSum / samples.length;
  const meanConf = confSum / samples.length;
  const meanCorrect = correctSum / samples.length;

  let headline: string;
  let detail: string;
  if (gap < 0.18) {
    headline = 'Well calibrated.';
    detail =
      'Your sense of what you knew matched how the cards actually went. That self-read is worth trusting.';
  } else if (meanConf - meanCorrect > 0.12) {
    headline = 'A little overconfident.';
    detail =
      'You felt surer than the cards bore out. Slow down on the ones that feel obvious, they are the easiest to fool yourself on.';
  } else if (meanCorrect - meanConf > 0.12) {
    headline = 'You sold yourself short.';
    detail =
      'You knew more than you predicted. Trust the first answer that comes to mind a bit more.';
  } else {
    headline = 'Roughly calibrated.';
    detail = 'Your confidence and recall lined up reasonably well across the session.';
  }
  return { samples: samples.length, gap, headline, detail };
}
