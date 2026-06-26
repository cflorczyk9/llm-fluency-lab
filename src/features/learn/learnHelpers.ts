// Helpers for the Learn library: category ordering, YouTube embedding, fluency
// color, lesson-state badges, and the elaborative "check yourself" prompts that
// sit between the lesson and spaced repetition.

import type { Card, Category, ProgramPlan } from '../../types';

// Order categories by the program path when a program exists, otherwise keep the
// pedagogical (content) order. Categories not named in the path fall to the end
// in their original order, so a partial path still renders everything.
export function orderCategories(
  categories: Category[],
  program: ProgramPlan | null,
): Category[] {
  if (!program || program.path.length === 0) return categories;
  const rank = new Map(program.path.map((key, i) => [key, i]));
  return [...categories].sort((a, b) => {
    const ra = rank.get(a.key) ?? Number.MAX_SAFE_INTEGER;
    const rb = rank.get(b.key) ?? Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    return categories.indexOf(a) - categories.indexOf(b);
  });
}

// Turn a normal YouTube watch URL into an embeddable one. Handles watch?v=,
// youtu.be short links, and URLs that are already embeds. Falls back to the
// original string if nothing matches so a bad link never throws.
export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname.startsWith('/embed/')) return url;
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  } catch {
    return url;
  }
}

// Bar / number color, matching the original thresholds (green, blue, gold, red).
export function fluColor(v: number): string {
  if (v >= 70) return 'var(--accent2)';
  if (v >= 45) return 'var(--accent)';
  if (v >= 25) return 'var(--gold)';
  return 'var(--gap)';
}

// Trim the shared "By the end you can ..." preamble so a learning objective reads
// cleanly as a bullet under a "By the end you'll be able to" heading. Falls back
// to the original text if it does not match the expected shape.
export function objectiveText(objective: string): string {
  const trimmed = objective
    .replace(/^by the end,?\s+you\s+(can|will be able to|are able to|should be able to)\s+/i, '')
    .trim();
  if (!trimmed) return objective;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export interface LessonBadge {
  cls: 'ls-new' | 'ls-learning' | 'ls-fluent';
  label: string;
}

// Where the learner stands on a category: not started, in progress, or fluent.
// "Fluent" is driven by recall strength, the middle state by either an opened
// lesson or any points on the board.
export function lessonBadge(categoryFlu: number, started: boolean): LessonBadge {
  if (categoryFlu >= 67) return { cls: 'ls-fluent', label: 'Fluent' };
  if (started || categoryFlu > 0) return { cls: 'ls-learning', label: 'In progress' };
  return { cls: 'ls-new', label: 'Not started' };
}

export interface CompCheck {
  id: string;
  prompt: string;
  answer: string;
}

// Build the elaborative "check yourself" prompts. These reuse the breakdown
// sections and the core cards as self-explanation questions: the learner tries
// to answer in their head, then reveals the explanation. This is the
// comprehension step that primes the cards before spaced repetition starts.
export function buildComprehension(category: Category): CompCheck[] {
  const checks: CompCheck[] = [];

  category.breakdown.forEach((section, i) => {
    checks.push({
      id: `${category.key}-bd-${i}`,
      prompt: `In your own words, why does "${section.heading.toLowerCase()}" matter?`,
      answer: section.explanation,
    });
  });

  // A couple of core cards become "explain it back" checks. We lead with the
  // plain-English version since the goal here is understanding, not recall.
  const coreCards: Card[] = category.cards.filter((c) => c.difficulty === 'core');
  const pool = coreCards.length > 0 ? coreCards : category.cards;
  pool.slice(0, 2).forEach((card) => {
    checks.push({
      id: `${card.id}-comp`,
      prompt: `Can you explain: ${card.question}`,
      answer: card.plain || card.answer,
    });
  });

  return checks;
}
