import { useMemo } from 'react';

import { categories } from '../../data/content';
import { TIERS, tierOf } from '../../data/tiers';
import { useStore } from '../../store/store';
import CategoryRow from './CategoryRow';
import { orderCategories } from './learnHelpers';
import './Learn.css';

// Tier number for a category, with a safe fallback.
function tierForKey(key: string, tier?: number): number {
  return tier ?? (tierOf(key) || 1);
}

// The Learn library: a guided lesson per module (watch, read, check yourself,
// peek at the cards) that teaches each area before and around the spaced
// repetition in Study. Modules are grouped under the four curriculum tiers.
// Within a tier they follow the program path when one exists, otherwise the
// built-in pedagogical order.
export default function Learn() {
  const program = useStore((s) => s.program);
  const ordered = useMemo(() => orderCategories(categories, program), [program]);

  // Continuous 1..N step number, in the order modules are presented.
  const stepByKey = useMemo(() => {
    const m = new Map<string, number>();
    ordered.forEach((c, i) => m.set(c.key, i + 1));
    return m;
  }, [ordered]);

  // Partition the ordered modules into their tiers, preserving order. Only tiers
  // that actually have modules are rendered.
  const groups = useMemo(
    () =>
      TIERS.map((t) => ({
        tier: t,
        cats: ordered.filter((c) => tierForKey(c.key, c.tier) === t.number),
      })).filter((g) => g.cats.length > 0),
    [ordered],
  );

  return (
    <div className="view learn">
      <div className="learn-toolbar">
        <h2 className="section" style={{ margin: 0 }}>
          Learn
        </h2>
        <a
          className="guide-link"
          href="/llm-how-it-works.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the visual guide
        </a>
      </div>

      <p className="muted" style={{ margin: '0 0 16px', maxWidth: 640 }}>
        Work an area top to bottom: watch the short lesson, read the breakdown,
        check yourself with the why prompts, then lock it in with spaced
        repetition over in Study. The curriculum runs in four tiers, from how the
        machine works up to judgment and the frontier.
        {program
          ? ' Within each tier, ordered to match your program path.'
          : ' Within each tier, ordered for a sensible learning path.'}
      </p>

      {groups.map((g) => (
        <section className="tier-section" key={g.tier.number}>
          <div className="tier-header">
            <div className="tier-eyebrow">Tier {g.tier.number}</div>
            <h3 className="tier-title">{g.tier.name}</h3>
            <p className="tier-summary">{g.tier.summary}</p>
          </div>
          {g.cats.map((cat) => (
            <CategoryRow key={cat.key} category={cat} step={stepByKey.get(cat.key) ?? 0} />
          ))}
        </section>
      ))}
    </div>
  );
}
