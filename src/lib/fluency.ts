// Fluency scoring. Turns FSRS memory state into a 0..100 "how fluent are you"
// number for cards, categories, and the whole deck.
//
// FOUNDATION implementation: a sensible blend of long-term strength (stability)
// and current recall (retrievability). A downstream agent may retune the curve;
// the signatures here are the contract the UI and dashboard code against.

import type { CardState } from '../types';
import { retrievability } from './fsrs';

// Stability in days mapped to a 0..1 "durability" score. ~21 days of stability
// reads as roughly fluent; the log curve rewards early gains and flattens later.
function durability(stabilityDays: number): number {
  if (stabilityDays <= 0) return 0;
  const score = Math.log1p(stabilityDays) / Math.log1p(21);
  return Math.max(0, Math.min(1, score));
}

export function cardFluency(card: CardState, now: number): number {
  if (card.state === 'new' || card.reps === 0) return 0;
  const recall = retrievability(card, now); // 0..1 predicted recall right now
  const durable = durability(card.stability); // 0..1 long-term strength
  const blended = 0.45 * recall + 0.55 * durable;
  return Math.round(Math.max(0, Math.min(1, blended)) * 100);
}

export function categoryFluency(states: CardState[], now: number): number {
  if (states.length === 0) return 0;
  const total = states.reduce((sum, s) => sum + cardFluency(s, now), 0);
  return Math.round(total / states.length);
}

export function overallFluency(allStates: CardState[], now: number): number {
  return categoryFluency(allStates, now);
}
