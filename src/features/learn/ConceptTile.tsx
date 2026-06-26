import { useId } from 'react';

import type { BreakdownSection } from '../../types';

// Fall back to a trimmed version of the long explanation when an author has not
// written a short caption yet. We cut at a sentence boundary when we can so the
// default view still reads as a clean, short blurb rather than a hard chop.
function trimExplanation(text: string, max = 165): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const lastStop = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('? '),
    slice.lastIndexOf('! '),
  );
  if (lastStop > 90) return clean.slice(0, lastStop + 1);
  const lastSpace = slice.lastIndexOf(' ');
  return `${clean.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}...`;
}

interface ConceptTileProps {
  section: BreakdownSection;
  // Lifted to CategoryRow so only one concept is open at a time. The expanded
  // detail renders as a full-width band beneath the clicked tile's row.
  expanded: boolean;
  onToggle: () => void;
}

// One concept presented visually. Collapsed, the tile is short and scannable:
// heading, the schematic diagram as the visual anchor, a one-line caption, the
// key terms as compact chips, then the actions. The long prose and full
// glossary live in a separate full-width detail panel (see CategoryRow), so
// "Read more" opens a real, readable detail view instead of cramming a wall of
// text into a 290px column.
export default function ConceptTile({ section, expanded, onToggle }: ConceptTileProps) {
  const blurb = section.caption?.trim() || trimExplanation(section.explanation);
  const { video } = section;
  const detailId = useId();

  return (
    <>
      <div className={`concept-tile${expanded ? ' concept-tile--active' : ''}`}>
        <h4 className="concept-h">{section.heading}</h4>

        {section.svg && (
          <div
            className="concept-svg"
            role="img"
            aria-label={`${section.heading} diagram`}
            // Authored inline SVG markup; validated, self-contained, no scripts.
            dangerouslySetInnerHTML={{ __html: section.svg }}
          />
        )}

        <p className="concept-caption">{blurb}</p>

        {section.keyTerms.length > 0 && (
          <div className="concept-chips">
            {section.keyTerms.map((t) => (
              <span className="concept-chip" key={t.term} title={t.definition}>
                {t.term}
              </span>
            ))}
          </div>
        )}

        <div className="concept-actions">
          {video && (
            <a
              className="concept-watch"
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch on YouTube: ${video.title} by ${video.channel} (opens in a new tab)`}
            >
              <span aria-hidden="true">&#9654;</span> Watch on YouTube
              <span className="concept-watch-ch">{video.channel}</span>
            </a>
          )}
          <button
            type="button"
            className="concept-readmore"
            aria-expanded={expanded}
            aria-controls={detailId}
            onClick={onToggle}
          >
            {expanded ? 'Read less' : 'Read more'}
            <span className="concept-readmore-caret" aria-hidden="true">
              {expanded ? '▴' : '▾'}
            </span>
          </button>
        </div>
      </div>

      {expanded && (
        <section
          className="concept-detail"
          id={detailId}
          aria-label={`${section.heading}: full explanation`}
        >
          <div className="concept-detail-inner">
            <div className="concept-detail-head">
              <h5 className="concept-detail-h">{section.heading}</h5>
              <button
                type="button"
                className="concept-detail-close"
                onClick={onToggle}
                aria-label={`Close ${section.heading} details`}
              >
                Close
                <span aria-hidden="true">&#215;</span>
              </button>
            </div>

            <div className="concept-detail-body">
              {section.svg && (
                <div
                  className="concept-detail-svg"
                  role="img"
                  aria-label={`${section.heading} diagram`}
                  // Same authored inline SVG, shown larger in the detail view.
                  dangerouslySetInnerHTML={{ __html: section.svg }}
                />
              )}
              <div className="concept-detail-text">
                <p>{section.explanation}</p>
                {video && (
                  <a
                    className="concept-detail-watch"
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch on YouTube: ${video.title} by ${video.channel} (opens in a new tab)`}
                  >
                    <span aria-hidden="true">&#9654;</span> Watch on YouTube
                    <span className="concept-watch-ch">
                      {video.title} ({video.channel})
                    </span>
                  </a>
                )}
              </div>
            </div>

            {section.keyTerms.length > 0 && (
              <div className="concept-detail-glossary">
                <div className="concept-detail-label">Key terms</div>
                <dl className="concept-glossary">
                  {section.keyTerms.map((t) => (
                    <div className="concept-term" key={t.term}>
                      <dt>{t.term}</dt>
                      <dd>{t.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
