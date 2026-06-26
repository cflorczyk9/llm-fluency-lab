import { useMemo, useState } from 'react';

import Panel from '../../components/Panel';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { useStore } from '../../store/store';
import { categories } from '../../data/content';
import { track } from '../analytics/track';
import type { DiagnosticResponse } from '../../types';

import {
  planBudget,
  probedCategoryKeys,
  scoreDiagnostic,
  selectNextProbe,
} from './adaptive';
import { navigateTo } from './program';

type Phase = 'intro' | 'confidence' | 'reveal' | 'done';

const CONFIDENCE_OPTIONS: Array<{ label: string; hint: string; value: number }> = [
  { label: 'Guessing', hint: 'No real idea', value: 0.1 },
  { label: 'Some idea', hint: 'Roughly there', value: 0.5 },
  { label: 'Confident', hint: 'I know this', value: 0.9 },
];

const GRADE_OPTIONS: Array<{
  outcome: DiagnosticResponse['outcome'];
  label: string;
  variant: 'good' | 'hard' | 'again';
}> = [
  { outcome: 'knew', label: 'Knew it', variant: 'good' },
  { outcome: 'partial', label: 'Partly', variant: 'hard' },
  { outcome: 'missed', label: 'Missed', variant: 'again' },
];

const TOTAL_CARDS = categories.reduce((n, c) => n + c.cards.length, 0);

export default function Diagnostic() {
  const setDiagnostic = useStore((s) => s.setDiagnostic);
  const existing = useStore((s) => s.diagnostic);

  const [phase, setPhase] = useState<Phase>(existing ? 'done' : 'intro');
  const [responses, setResponses] = useState<DiagnosticResponse[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);

  const budget = useMemo(
    () => planBudget(categories.length, TOTAL_CARDS),
    [],
  );

  // Deterministic over the answered responses, so re-renders keep the same card.
  const current = useMemo(() => {
    if (phase !== 'confidence' && phase !== 'reveal') return null;
    return selectNextProbe({ categories, budget, responses });
  }, [phase, responses, budget]);

  const covered = useMemo(() => probedCategoryKeys(responses), [responses]);

  function start() {
    setResponses([]);
    setConfidence(null);
    setPhase('confidence');
  }

  function chooseConfidence(value: number) {
    setConfidence(value);
    setPhase('reveal');
  }

  function grade(outcome: DiagnosticResponse['outcome']) {
    if (!current) return;
    const response: DiagnosticResponse = {
      cardId: current.id,
      categoryKey: current.categoryKey,
      confidence: confidence ?? 0.5,
      outcome,
    };
    const next = [...responses, response];

    const done =
      next.length >= budget ||
      selectNextProbe({ categories, budget, responses: next }) == null;

    setResponses(next);
    setConfidence(null);

    if (done) {
      const result = scoreDiagnostic(categories, next, Date.now());
      setDiagnostic(result);
      track('diagnostic_completed', {
        overall: result.overall,
        calibration: result.calibration,
        tested: next.length,
      });
      setPhase('done');
    } else {
      setPhase('confidence');
    }
  }

  if (phase === 'intro') {
    return (
      <div className="view view-task">
        <h2 className="section">Placement test</h2>
        <Panel>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Find out what you already know
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            About 10 minutes. For each question you will rate your confidence, see the
            answer, then grade yourself. There is no penalty for guessing. The test
            adapts: do well in an area and it asks something harder, struggle and it
            moves on.
          </p>
          <p className="muted" style={{ marginTop: 8 }}>
            We will probe up to {budget} questions across {categories.length}{' '}
            {categories.length === 1 ? 'area' : 'areas'}, then build you a study plan.
          </p>
          <div style={{ marginTop: 14 }}>
            <Button variant="primary" onClick={start}>
              Start placement test
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  if (phase === 'done') {
    return <DoneScreen onRetake={start} />;
  }

  // confidence or reveal: a single probe card
  if (!current) {
    // No card available (empty deck). Fall back to a graceful message.
    return (
      <div className="view view-task">
        <h2 className="section">Placement test</h2>
        <Panel>
          <p className="muted" style={{ margin: 0 }}>
            There are no cards to test yet. Add content, then run the placement test.
          </p>
        </Panel>
      </div>
    );
  }

  const questionNumber = responses.length + 1;

  return (
    <div className="view view-task">
      <h2 className="section">Placement test</h2>

      <Panel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>
            Question {questionNumber} of {budget}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{current.category}</div>
        </div>

        <div style={{ marginTop: 8 }}>
          <ProgressBar value={(responses.length / budget) * 100} slim />
        </div>

        <CoverageChips coveredKeys={covered} activeKey={current.categoryKey} />

        <div
          key={`${current.id}-${phase}`}
          style={{ marginTop: 16, animation: 'fade 0.18s ease' }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}>
            {current.question}
          </div>

          {phase === 'confidence' ? (
            <div style={{ marginTop: 18 }}>
              <div
                style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}
              >
                Before you see the answer, how confident are you?
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {CONFIDENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    className="btn"
                    onClick={() => chooseConfidence(opt.value)}
                    style={{ flex: '1 1 140px', textAlign: 'left' }}
                  >
                    <div style={{ fontWeight: 700 }}>{opt.label}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        fontWeight: 500,
                      }}
                    >
                      {opt.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  background: 'var(--panel2)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: 14,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-deep)' }}>
                  ANSWER
                </div>
                <div style={{ marginTop: 6, fontWeight: 600 }}>{current.answer}</div>
                {current.plain && (
                  <p style={{ margin: '10px 0 0', color: 'var(--muted)' }}>
                    {current.plain}
                  </p>
                )}
              </div>

              <div style={{ fontSize: 13, color: 'var(--muted)', margin: '16px 0 8px' }}>
                How did you do?
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {GRADE_OPTIONS.map((opt) => (
                  <Button
                    key={opt.outcome}
                    variant={opt.variant}
                    onClick={() => grade(opt.outcome)}
                    style={{ flex: '1 1 120px' }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

function CoverageChips({
  coveredKeys,
  activeKey,
}: {
  coveredKeys: Set<string>;
  activeKey: string;
}) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
      {categories.map((cat) => {
        const isActive = cat.key === activeKey;
        const isCovered = coveredKeys.has(cat.key);
        const base = {
          fontSize: 11,
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: 20,
          border: '1px solid var(--line)',
        } as const;
        const style = isActive
          ? {
              ...base,
              background: 'rgba(47, 140, 255, 0.12)',
              color: 'var(--accent-deep)',
              borderColor: 'rgba(47, 140, 255, 0.34)',
            }
          : isCovered
            ? {
                ...base,
                background: 'rgba(31, 122, 80, 0.1)',
                color: '#15603e',
                borderColor: 'rgba(31, 122, 80, 0.3)',
              }
            : { ...base, background: 'var(--panel2)', color: 'var(--muted)' };
        return (
          <span key={cat.key} style={style}>
            {cat.name}
          </span>
        );
      })}
    </div>
  );
}

function DoneScreen({ onRetake }: { onRetake: () => void }) {
  const diagnostic = useStore((s) => s.diagnostic);
  if (!diagnostic) {
    return (
      <div className="view view-task">
        <h2 className="section">Placement test</h2>
        <Panel>
          <p className="muted" style={{ margin: 0 }}>
            No results yet.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={onRetake}>
              Start placement test
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  const overallPct = Math.round(diagnostic.overall * 100);
  const calibrationNote = calibrationMessage(diagnostic.calibration);

  // Per-category rows in content order, only those actually tested.
  const rows = categories
    .filter((c) => diagnostic.perCategory[c.key]?.tested)
    .map((c) => ({
      name: c.name,
      ability: diagnostic.perCategory[c.key].ability,
    }))
    .sort((a, b) => a.ability - b.ability);

  return (
    <div className="view view-task">
      <h2 className="section">Placement results</h2>

      <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
        <Panel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1 }}>
              {overallPct}
              <span
                style={{ fontSize: 18, color: 'var(--muted)', fontWeight: 600 }}
              >
                {' '}
                / 100
              </span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              starting ability across {rows.length}{' '}
              {rows.length === 1 ? 'area' : 'areas'}
            </div>
          </div>
          <p className="muted" style={{ margin: '10px 0 0' }}>
            {calibrationNote}
          </p>
        </Panel>

        <Panel>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Where you stand</div>
          <p className="muted" style={{ margin: '0 0 12px', fontSize: 13 }}>
            Weakest areas first. These are where your plan will start.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {rows.map((row) => {
              const pct = Math.round(row.ability * 100);
              const color =
                pct < 40
                  ? 'var(--gap)'
                  : pct < 70
                    ? 'var(--gold)'
                    : 'var(--accent2)';
              return (
                <div key={row.name}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{row.name}</span>
                    <span style={{ color: 'var(--muted)' }}>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} slim color={color} />
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <div style={{ fontWeight: 700 }}>Next: build your program</div>
          <p className="muted" style={{ margin: '6px 0 12px' }}>
            Your results are saved. Pick a target date on the Home tab and we will
            turn this into a day-by-day plan that front-loads your weak spots.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => navigateTo('program')}>
              Build my program
            </Button>
            <Button variant="ghost" onClick={onRetake}>
              Retake test
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function calibrationMessage(calibration: number): string {
  if (calibration <= 0.2) {
    return 'Your confidence matched your results closely. You have a good sense of what you know.';
  }
  if (calibration <= 0.35) {
    return 'Your confidence was roughly in line with your results, with some room to calibrate.';
  }
  return 'Your confidence and your results often disagreed. Worth slowing down to check what you actually know.';
}
