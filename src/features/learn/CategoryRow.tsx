import { useEffect, useMemo, useRef, useState } from 'react';

import type { Category, CardState } from '../../types';
import { useStore } from '../../store/store';
import { emptyState } from '../../lib/fsrs';
import { cardFluency, categoryFluency } from '../../lib/fluency';
import ConceptTile from './ConceptTile';
import {
  buildComprehension,
  fluColor,
  lessonBadge,
  objectiveText,
  toEmbedUrl,
} from './learnHelpers';

interface CategoryRowProps {
  category: Category;
  step: number;
}

// One expandable category in the Learn library. Holds its own open/peek/reveal
// state; reads fluency from the store so the badges update as the learner grades
// cards in Study. Opening a row records startLesson(key) so the dashboard and
// program can tell which areas have been opened.
export default function CategoryRow({ category, step }: CategoryRowProps) {
  const cardStates = useStore((s) => s.cardStates);
  const lessons = useStore((s) => s.lessons);
  const startLesson = useStore((s) => s.startLesson);

  const [open, setOpen] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);
  const [openChecks, setOpenChecks] = useState<Set<string>>(new Set());
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  // Index of the one concept whose full-width detail is open, or null. Lifted
  // here (not per tile) so only one detail panel is ever expanded at a time,
  // keeping the "See how it works" grid calm.
  const [openConcept, setOpenConcept] = useState<number | null>(null);

  // Self-contained interactive diagram embedded per module. The diagram lives in
  // /public/diagrams/<key>.html and posts its measured height back to us so the
  // iframe can size itself with no internal scrollbar. We default to a sensible
  // height until that message arrives, and clamp what it reports.
  const diagramRef = useRef<HTMLIFrameElement>(null);
  const [diagramHeight, setDiagramHeight] = useState(460);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as
        | { type?: string; key?: string; height?: number }
        | null;
      if (!data || data.type !== 'lfl-diagram-height') return;
      if (data.key !== category.key) return;
      const h = Math.round(Number(data.height));
      if (!Number.isFinite(h) || h <= 0) return;
      setDiagramHeight(Math.min(900, Math.max(220, h)));
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [category.key]);

  const now = Date.now();
  const empty = useMemo(() => emptyState(now), [now]);

  const stateOf = (id: string): CardState => cardStates[id] ?? empty;
  const isSeen = (id: string): boolean => {
    const st = cardStates[id];
    return !!(st && st.reps > 0);
  };

  const catFlu = Math.round(
    categoryFluency(
      category.cards.map((c) => stateOf(c.id)),
      now,
    ),
  );
  const started = !!lessons[category.key]?.startedAt;
  const badge = lessonBadge(catFlu, started);
  const checks = useMemo(() => buildComprehension(category), [category]);

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (!next) setOpenConcept(null); // start clean next time the module opens
    if (next && !started) startLesson(category.key);
  }

  function toggleSet(
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
  ) {
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={`cat-row${open ? ' open' : ''}`}>
      <div
        className="cat-head"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
      >
        <span className="cat-step">{step}</span>
        <div className="cat-name">{category.name}</div>
        <div className="cat-barwrap">
          <div className="bar">
            <i
              style={{
                width: `${Math.max(2, catFlu)}%`,
                background: fluColor(catFlu),
              }}
            />
          </div>
        </div>
        <span className={`ls-badge ${badge.cls}`}>{badge.label}</span>
        <div className="cat-flu">{catFlu}/100</div>
        <div className="cat-chev">&#9654;</div>
      </div>

      {open && (
        <div className="cat-body">
          <p className="cat-summary">{category.summary}</p>

          {/* What you'll be able to do (module learning objectives) */}
          {category.learningObjectives && category.learningObjectives.length > 0 && (
            <div className="objectives">
              <div className="obj-title">By the end you'll be able to</div>
              <ul className="obj-list">
                {category.learningObjectives.map((o, i) => (
                  <li key={`${category.key}-obj-${i}`}>{objectiveText(o)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: watch (only modules with a real video) */}
          {category.video && (
            <>
              <div className="step-h">Watch the lesson</div>
              <div className="lesson-video">
                <iframe
                  src={toEmbedUrl(category.video.url)}
                  title={category.video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="vmeta">
                  <a href={category.video.url} target="_blank" rel="noopener noreferrer">
                    {category.video.title}
                  </a>{' '}
                  &middot; {category.video.channel}
                </div>
              </div>
            </>
          )}

          {/* Step 2: see how it works. Lead with the interactive diagram as the
              hero, then a full-width grid of per-concept visual tiles. */}
          <div className="step-h">See how it works</div>
          <div className="module-diagram module-diagram-hero">
            <iframe
              ref={diagramRef}
              src={`/diagrams/${category.key}.html`}
              title={`${category.name} diagram`}
              loading="lazy"
              style={{ height: `${diagramHeight}px` }}
            />
          </div>
          <div className="concept-grid">
            {category.breakdown.map((section, i) => (
              <ConceptTile
                section={section}
                key={`${category.key}-bd-${i}`}
                expanded={openConcept === i}
                onToggle={() =>
                  setOpenConcept((cur) => (cur === i ? null : i))
                }
              />
            ))}
          </div>

          {/* Step 3: check yourself (elaborative prompts) */}
          {checks.length > 0 && (
            <>
              <div className="step-h">Check yourself</div>
              <div className="comp">
                {checks.map((c) => {
                  const isOpen = openChecks.has(c.id);
                  return (
                    <div className={`comp-q${isOpen ? ' open' : ''}`} key={c.id}>
                      <div
                        className="cq"
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSet(setOpenChecks, c.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSet(setOpenChecks, c.id);
                          }
                        }}
                      >
                        {c.prompt}
                      </div>
                      {isOpen && <div className="ca">{c.answer}</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 4: peek at the cards */}
          <div className="step-h">Lock it in with the cards</div>
          <div className="peek">
            <span
              className="peek-toggle"
              role="button"
              tabIndex={0}
              onClick={() => setPeekOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPeekOpen((v) => !v);
                }
              }}
            >
              Peek at the {category.cards.length} card
              {category.cards.length === 1 ? '' : 's'} {peekOpen ? '▴' : '▾'}
            </span>
            {peekOpen && (
              <div className="peek-cards">
                {category.cards.map((card) => {
                  const cardOpen = openCards.has(card.id);
                  const seen = isSeen(card.id);
                  const cf = Math.round(cardFluency(stateOf(card.id), now));
                  return (
                    <div
                      className={`peek-card${cardOpen ? ' open' : ''}`}
                      key={card.id}
                    >
                      <div
                        className="pq"
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSet(setOpenCards, card.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSet(setOpenCards, card.id);
                          }
                        }}
                      >
                        <span>{card.question}</span>
                        <span className="mini-flu">{seen ? `${cf}/100` : 'new'}</span>
                      </div>
                      {cardOpen && <div className="pa">{card.answer}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
