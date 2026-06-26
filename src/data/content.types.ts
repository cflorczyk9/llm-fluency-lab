// Authoring helpers for the content deck. The content agent imports these to
// build categories with less boilerplate. Shapes come from the shared types.

import type { Card, Category, Difficulty } from '../types';

export type { Card, Category, Difficulty } from '../types';

// Pure helper to stamp a card with its category context, so authors only write
// the per-card fields and let the category supply key/name.
export function makeCard(
  categoryKey: string,
  category: string,
  fields: {
    id: string;
    subtopic: string;
    question: string;
    answer: string;
    plain: string;
    difficulty: Difficulty;
  },
): Card {
  return { categoryKey, category, ...fields };
}

// Collect every card across a list of categories, in path order.
export function allCards(categories: Category[]): Card[] {
  return categories.flatMap((c) => c.cards);
}
