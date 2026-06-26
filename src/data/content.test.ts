// Integrity tests for the assembled curriculum content deck. These guard the
// shape and internal consistency of `categories` (the 24-module deck) so a bad
// edit to any module file fails fast and loudly. Run with:
//   npx vitest run src/data/content.test.ts
//
// Design notes:
//  - We test the RUNTIME objects from `categories`, never the source text. The
//    module files mix two authoring styles (quoted vs unquoted keys), but both
//    resolve to the same Category/Card types, so the runtime shape is the truth.
//  - Checks collect ALL offenders and assert the offender list is empty, so a
//    single run surfaces every problem rather than just the first.
//  - The filesystem check resolves paths from the repo root via process.cwd(),
//    which is where `vitest run` executes.

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import type { BreakdownSection, Card, Difficulty } from '../types';
import { categories } from './content';
import { prerequisiteOrder } from './prerequisites';

const DIFFICULTIES: Difficulty[] = ['core', 'intermediate', 'advanced'];

// Flatten every card across the deck, in path order.
const allCards: Card[] = categories.flatMap((c) => c.cards);

// Set of real, canonical category keys.
const categoryKeys = new Set(categories.map((c) => c.key));

const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

describe('content deck: size', () => {
  it('has exactly 24 modules', () => {
    expect(categories).toHaveLength(24);
  });

  it('has a sane total card count (480..520)', () => {
    expect(allCards.length).toBeGreaterThanOrEqual(480);
    expect(allCards.length).toBeLessThanOrEqual(520);
  });
});

describe('content deck: category shape', () => {
  it('every category has a non-empty key, name, and summary', () => {
    const offenders = categories
      .filter((c) => !nonEmpty(c.key) || !nonEmpty(c.name) || !nonEmpty(c.summary))
      .map((c) => c.key || c.name || '(unnamed)');
    expect(offenders, `categories missing key/name/summary: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every category has a non-empty cards array', () => {
    const offenders = categories
      .filter((c) => !Array.isArray(c.cards) || c.cards.length === 0)
      .map((c) => c.key);
    expect(offenders, `categories with no cards: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every category has a breakdown array of length >= 1', () => {
    const offenders = categories
      .filter((c) => !Array.isArray(c.breakdown) || c.breakdown.length < 1)
      .map((c) => c.key);
    expect(offenders, `categories with empty breakdown: ${offenders.join(', ')}`).toEqual([]);
  });

  it('category keys are unique across the deck', () => {
    const seen = new Map<string, number>();
    for (const c of categories) seen.set(c.key, (seen.get(c.key) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([k, n]) => `${k} (x${n})`);
    expect(dupes, `duplicate category keys: ${dupes.join(', ')}`).toEqual([]);
  });
});

describe('content deck: breakdown sections', () => {
  // (category key, section index, section) tuples for readable offender lists.
  const sections: Array<{ key: string; i: number; s: BreakdownSection }> = categories.flatMap(
    (c) => c.breakdown.map((s, i) => ({ key: c.key, i, s })),
  );

  it('every section has a non-empty heading and explanation', () => {
    const offenders = sections
      .filter(({ s }) => !nonEmpty(s.heading) || !nonEmpty(s.explanation))
      .map(({ key, i }) => `${key}[${i}]`);
    expect(offenders, `sections missing heading/explanation: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every section has a keyTerms array (possibly empty)', () => {
    const offenders = sections
      .filter(({ s }) => !Array.isArray(s.keyTerms))
      .map(({ key, i }) => `${key}[${i}]`);
    expect(offenders, `sections with non-array keyTerms: ${offenders.join(', ')}`).toEqual([]);
  });

  it('any present video has url, title, and channel', () => {
    const offenders = sections
      .filter(({ s }) => s.video !== undefined)
      .filter(({ s }) => !nonEmpty(s.video!.url) || !nonEmpty(s.video!.title) || !nonEmpty(s.video!.channel))
      .map(({ key, i }) => `${key}[${i}]`);
    expect(offenders, `sections with malformed video: ${offenders.join(', ')}`).toEqual([]);
  });

  it('any present svg is a non-empty string starting with <svg', () => {
    const offenders = sections
      .filter(({ s }) => s.svg !== undefined)
      .filter(({ s }) => !nonEmpty(s.svg) || !s.svg!.trimStart().startsWith('<svg'))
      .map(({ key, i }) => `${key}[${i}]`);
    expect(offenders, `sections with malformed svg: ${offenders.join(', ')}`).toEqual([]);
  });
});

describe('content deck: cards', () => {
  it('every card has non-empty id, question, answer, plain, and category', () => {
    const offenders = allCards
      .filter((c) => !nonEmpty(c.id) || !nonEmpty(c.question) || !nonEmpty(c.answer) || !nonEmpty(c.plain) || !nonEmpty(c.category))
      .map((c) => c.id || '(no id)');
    expect(offenders, `cards missing required text fields: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every card has a valid difficulty', () => {
    const offenders = allCards
      .filter((c) => !DIFFICULTIES.includes(c.difficulty))
      .map((c) => `${c.id}=${String(c.difficulty)}`);
    expect(offenders, `cards with bad difficulty: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every card is filed under the category it lives in (categoryKey matches)', () => {
    const offenders: string[] = [];
    for (const cat of categories) {
      for (const card of cat.cards) {
        if (card.categoryKey !== cat.key) {
          offenders.push(`${card.id}: categoryKey=${card.categoryKey} but lives in ${cat.key}`);
        }
      }
    }
    expect(offenders, `mis-filed cards: ${offenders.join('; ')}`).toEqual([]);
  });

  it('card ids are globally unique across the entire deck', () => {
    const counts = new Map<string, number>();
    for (const c of allCards) counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
    const duplicates = [...counts.entries()]
      .filter(([, n]) => n > 1)
      .map(([id, n]) => `${id} (x${n})`);
    expect(duplicates, `duplicate card ids: ${duplicates.join(', ')}`).toEqual([]);
  });
});

describe('content deck: prerequisite graph', () => {
  // prerequisites.ts exports a flat, prerequisite-aware order (prerequisiteOrder),
  // not an explicit edge map. We treat it as a linear chain where each key's
  // prerequisite is the key immediately before it, which is the graph the app
  // actually walks. From that we verify key validity, coverage, and acyclicity.
  const prereqMap = new Map<string, string[]>();
  prerequisiteOrder.forEach((key, i) => {
    prereqMap.set(key, i === 0 ? [] : [prerequisiteOrder[i - 1]]);
  });

  it('every key in the prerequisite order is a real category key', () => {
    const offenders = prerequisiteOrder.filter((k) => !categoryKeys.has(k));
    expect(offenders, `prereq-order keys with no matching category: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every key referenced as a prerequisite is a real category key', () => {
    const referenced = new Set<string>();
    for (const prereqs of prereqMap.values()) for (const p of prereqs) referenced.add(p);
    const offenders = [...referenced].filter((k) => !categoryKeys.has(k));
    expect(offenders, `prerequisites pointing at unknown keys: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every category key appears in the prerequisite order (full coverage)', () => {
    const ordered = new Set(prerequisiteOrder);
    const missing = [...categoryKeys].filter((k) => !ordered.has(k));
    expect(missing, `category keys absent from prerequisite order: ${missing.join(', ')}`).toEqual([]);
  });

  it('the prerequisite order has no duplicate keys', () => {
    const counts = new Map<string, number>();
    for (const k of prerequisiteOrder) counts.set(k, (counts.get(k) ?? 0) + 1);
    const dupes = [...counts.entries()].filter(([, n]) => n > 1).map(([k, n]) => `${k} (x${n})`);
    expect(dupes, `duplicate keys in prerequisite order: ${dupes.join(', ')}`).toEqual([]);
  });

  it('no category lists itself as its own prerequisite', () => {
    const offenders = [...prereqMap.entries()]
      .filter(([key, prereqs]) => prereqs.includes(key))
      .map(([key]) => key);
    expect(offenders, `self-referencing prerequisites: ${offenders.join(', ')}`).toEqual([]);
  });

  it('the prerequisite graph is acyclic', () => {
    // DFS with white/gray/black coloring; a gray node reached again is a back
    // edge, i.e. a cycle. Returns the cycle path (naming a node in it) or null.
    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const color = new Map<string, number>();
    for (const node of prereqMap.keys()) color.set(node, WHITE);
    const stack: string[] = [];

    const dfs = (node: string): string[] | null => {
      color.set(node, GRAY);
      stack.push(node);
      for (const next of prereqMap.get(node) ?? []) {
        if (!prereqMap.has(next)) continue; // unknown keys handled by another test
        const c = color.get(next);
        if (c === GRAY) {
          const idx = stack.indexOf(next);
          return [...stack.slice(idx), next];
        }
        if (c === WHITE) {
          const found = dfs(next);
          if (found) return found;
        }
      }
      stack.pop();
      color.set(node, BLACK);
      return null;
    };

    let cycle: string[] | null = null;
    for (const node of prereqMap.keys()) {
      if (color.get(node) === WHITE) {
        cycle = dfs(node);
        if (cycle) break;
      }
    }
    expect(cycle, cycle ? `cycle found: ${cycle.join(' -> ')}` : 'no cycle').toBeNull();
  });
});

describe('content deck: tiers', () => {
  it('every category that has a tier has it in 1..4', () => {
    const offenders = categories
      .filter((c) => c.tier !== undefined)
      .filter((c) => !Number.isInteger(c.tier) || (c.tier as number) < 1 || (c.tier as number) > 4)
      .map((c) => `${c.key}=${String(c.tier)}`);
    expect(offenders, `categories with out-of-range tier: ${offenders.join(', ')}`).toEqual([]);
  });
});

describe('content deck: diagram coverage', () => {
  it('every category has a public/diagrams/<key>.html file', () => {
    const missing = categories
      .map((c) => c.key)
      .filter((key) => !existsSync(resolve(process.cwd(), 'public', 'diagrams', `${key}.html`)));
    expect(missing, `missing diagram files: ${missing.join(', ')}`).toEqual([]);
  });
});
