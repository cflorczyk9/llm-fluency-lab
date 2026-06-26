import { useMemo, useState } from 'react';

import Panel from '../../components/Panel';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { useStore } from '../../store/store';
import { categories } from '../../data/content';
import { categoryFluency } from '../../lib/fluency';
import type { CardState } from '../../types';

import {
  buildProgram,
  navigateTo,
  type ProgramTarget,
} from '../diagnostic/program';

const RETENTION_OPTIONS: Array<{ label: string; value: number }> = [
  { label: 'Lighter load (85%)', value: 0.85 },
  { label: 'Standard (90%)', value: 0.9 },
  { label: 'Aggressive (95%)', value: 0.95 },
];

const WEEK_PRESETS = [2, 4, 8];

function ymdLocal(ms: number): string {
  const d = new Date(ms);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function dateLabel(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function daysBetween(future: number, now: number): number {
  return Math.ceil((future - now) / 86_400_000);
}

export default function Program() {
  const now = Date.now();

  const diagnostic = useStore((s) => s.diagnostic);
  const program = useStore((s) => s.program);
  const cardStates = useStore((s) => s.cardStates);

  const setProgram = useStore((s) => s.setProgram);
  const seedKnown = useStore((s) => s.seedKnown);
  const updateSettings = useStore((s) => s.updateSettings);
  const dueCards = useStore((s) => s.dueCards);

  const fluencyByKey = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of categories) {
      const states = cat.cards
        .map((card) => cardStates[card.id])
        .filter(Boolean) as CardState[];
      map[cat.key] = categoryFluency(states, now);
    }
    return map;
  }, [cardStates, now]);

  const nameByKey = useMemo(
    () => new Map(categories.map((c) => [c.key, c.name])),
    [],
  );

  // Build (and seed, first time only) or adjust the plan.
  function commitPlan(target: ProgramTarget, requestRetention: number) {
    if (!diagnostic) return;
    const firstBuild = program == null;
    const plan = buildProgram({
      diagnostic,
      categories,
      target,
      requestRetention,
      now: Date.now(),
    });
    if (firstBuild) {
      seedKnown(plan.seededKnown);
    }
    setProgram(plan);
    // Wire the plan into the real study queue and scheduler.
    updateSettings({
      requestRetention: plan.requestRetention,
      dailyNewCap: plan.dailyNewTarget,
    });
  }

  // No diagnostic yet: send them to the placement test.
  if (!diagnostic) {
    return (
      <div className="view view-task">
        <h2 className="section">Your program</h2>
        <Panel>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Start with a 10-minute placement test
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            Before we build a plan, we check what you already know. The test adapts to
            you and seeds the cards you have down, so your time goes to the gaps. After
            that you get a day-by-day path to fluency.
          </p>
          <div style={{ marginTop: 14 }}>
            <Button variant="primary" onClick={() => navigateTo('diagnostic')}>
              Take the placement test
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  // Diagnostic done, no program yet: choose a target and build.
  if (!program) {
    const overallPct = Math.round(diagnostic.overall * 100);
    return (
      <div className="view view-task">
        <h2 className="section">Build your program</h2>
        <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
          <Panel>
            <div style={{ fontWeight: 700 }}>Placement done</div>
            <p className="muted" style={{ margin: '6px 0 0' }}>
              Starting ability {overallPct} / 100. Pick when you want to be fluent and
              we will lay out the path.
            </p>
          </Panel>
          <PlanControls
            submitLabel="Build my program"
            initialRetention={0.9}
            onSubmit={commitPlan}
          />
        </div>
      </div>
    );
  }

  // Full home view.
  const daysLeft = daysBetween(program.targetDate, now);
  const reviewsDue = dueCards(now).length;
  const targetPast = daysLeft < 0;

  return (
    <div className="view view-task">
      <h2 className="section">Your program</h2>

      <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
        <Panel>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                FLUENT BY
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>
                {dateLabel(program.targetDate)}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                {targetPast
                  ? 'Target date has passed. Adjust it below.'
                  : daysLeft === 0
                    ? 'Target is today'
                    : `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} to go`}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                TODAY
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>
                {program.dailyNewTarget} new
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {reviewsDue} {reviewsDue === 1 ? 'review' : 'reviews'} due
              </div>
            </div>
          </div>

          <p className="muted" style={{ margin: '14px 0 0', fontSize: 13.5 }}>
            {program.rationale}
          </p>

          <div style={{ marginTop: 14 }}>
            <Button variant="primary" onClick={() => navigateTo('study')}>
              Start today&apos;s session
            </Button>
          </div>
        </Panel>

        <Panel>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Your path</div>
          <p className="muted" style={{ margin: '0 0 12px', fontSize: 13 }}>
            Ordered to close your weakest areas first, while keeping each topic on top
            of the ones it builds on. Bars show current fluency.
          </p>
          <div style={{ display: 'grid', gap: 12 }}>
            {program.path.map((key, i) => {
              const fluency = fluencyByKey[key] ?? 0;
              const ability = diagnostic.perCategory[key];
              return (
                <div key={key}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      fontSize: 13,
                      marginBottom: 4,
                      gap: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      <span style={{ color: 'var(--muted)', fontWeight: 700 }}>
                        {i + 1}.
                      </span>{' '}
                      {nameByKey.get(key) ?? key}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>
                      {ability
                        ? `start ${Math.round(ability.ability * 100)}%`
                        : 'not tested'}{' '}
                      &middot; fluency {fluency}
                    </span>
                  </div>
                  <ProgressBar
                    value={fluency}
                    slim
                    color={
                      fluency >= 70
                        ? 'var(--accent2)'
                        : fluency >= 40
                          ? 'var(--gold)'
                          : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
        </Panel>

        <AdjustPanel
          targetDate={program.targetDate}
          retention={program.requestRetention}
          onSubmit={commitPlan}
        />
      </div>
    </div>
  );
}

function AdjustPanel({
  targetDate,
  retention,
  onSubmit,
}: {
  targetDate: number;
  retention: number;
  onSubmit: (target: ProgramTarget, retention: number) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Panel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>Adjust target</div>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: 13 }}>
              Change your fluent-by date or how hard the scheduler pushes.
            </p>
          </div>
          <Button variant="ghost" small onClick={() => setOpen(true)}>
            Adjust
          </Button>
        </div>
      </Panel>
    );
  }
  return (
    <PlanControls
      title="Adjust target"
      submitLabel="Update plan"
      initialDate={targetDate}
      initialRetention={retention}
      onSubmit={(t, r) => {
        onSubmit(t, r);
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
}

function PlanControls({
  title,
  submitLabel,
  initialDate,
  initialRetention,
  onSubmit,
  onCancel,
}: {
  title?: string;
  submitLabel: string;
  initialDate?: number;
  initialRetention: number;
  onSubmit: (target: ProgramTarget, retention: number) => void;
  onCancel?: () => void;
}) {
  const now = Date.now();
  const defaultDate = initialDate ?? now + 4 * 7 * 86_400_000;

  const [mode, setMode] = useState<'weeks' | 'date'>(initialDate ? 'date' : 'weeks');
  const [weeks, setWeeks] = useState<number>(4);
  const [dateStr, setDateStr] = useState<string>(ymdLocal(defaultDate));
  const [retention, setRetention] = useState<number>(initialRetention);

  function submit() {
    let target: ProgramTarget;
    if (mode === 'weeks') {
      target = { kind: 'weeks', weeks };
    } else {
      // Parse the date input as local midnight.
      const parsed = new Date(`${dateStr}T00:00:00`).getTime();
      const safe = Number.isFinite(parsed) ? parsed : defaultDate;
      target = { kind: 'date', date: safe };
    }
    onSubmit(target, retention);
  }

  const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--muted)',
    letterSpacing: '0.04em',
  } as const;
  const selectStyle = {
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--line)',
    background: 'var(--panel)',
    fontWeight: 600,
  } as const;

  return (
    <Panel>
      {title && <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>}

      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <div style={{ ...labelStyle, marginBottom: 8 }}>TARGET</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {WEEK_PRESETS.map((w) => (
              <Button
                key={w}
                small
                variant={mode === 'weeks' && weeks === w ? 'primary' : 'default'}
                onClick={() => {
                  setMode('weeks');
                  setWeeks(w);
                }}
              >
                {w} weeks
              </Button>
            ))}
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>or</span>
            <input
              type="date"
              value={dateStr}
              min={ymdLocal(now)}
              onChange={(e) => {
                setDateStr(e.target.value);
                setMode('date');
              }}
              onFocus={() => setMode('date')}
              style={selectStyle}
            />
          </div>
        </div>

        <div>
          <div style={{ ...labelStyle, marginBottom: 8 }}>RETENTION</div>
          <select
            value={retention}
            onChange={(e) => setRetention(Number(e.target.value))}
            style={{ ...selectStyle, width: '100%', maxWidth: 280 }}
          >
            {RETENTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 12.5 }}>
            Higher retention means more frequent reviews and a heavier daily load.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="primary" onClick={submit}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
}
