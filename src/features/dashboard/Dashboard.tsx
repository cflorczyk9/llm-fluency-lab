// DASHBOARD: progress analytics framed around mastery and the active program.
//
// Headline fluency + tiles, a per-category radar, an overall-fluency trend line,
// your three weakest areas, the active program (countdown / coverage / pace),
// and a calibration readout that surfaces how well your confidence matched
// reality on the diagnostic. Everything reads from the shared store and the
// fluency / fsrs contracts. No backend, local-first.

import { useEffect, useMemo } from 'react';

import Panel from '../../components/Panel';
import { categories } from '../../data/content';
import { TIERS, tierOf } from '../../data/tiers';
import { emptyState } from '../../lib/fsrs';
import { categoryFluency, overallFluency } from '../../lib/fluency';
import { useStore } from '../../store/store';
import type { CardState } from '../../types';

import './dashboard.css';
import {
  C,
  FluencyRadar,
  FluencyTrend,
  fluColor,
  fluLabel,
  type RadarDatum,
} from './charts';

// Tier number for a category, with a safe fallback.
function tierForKey(key: string, tier?: number): number {
  return tier ?? (tierOf(key) || 1);
}

// A short, radar-friendly label for a tier (the part before the colon).
function shortTierLabel(name: string): string {
  return name.split(':')[0].trim();
}

const DAY = 86_400_000;

function ymd(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function gapNudge(name: string, v: number): string {
  if (v === 0) return `Untouched. Open Study and focus on "${name}" to put points on the board.`;
  if (v < 35) return `Weakest area. Filter your next session to "${name}" and grind the basics.`;
  if (v < 60) return 'Coming along. A few more solid reviews will move this into fluent range.';
  return 'Nearly there. Keep it warm with periodic reviews.';
}

// outcome -> correctness for calibration math
const CORRECTNESS: Record<'knew' | 'partial' | 'missed', number> = {
  knew: 1,
  partial: 0.5,
  missed: 0,
};

export default function Dashboard() {
  const cardStates = useStore((s) => s.cardStates);
  const program = useStore((s) => s.program);
  const diagnostic = useStore((s) => s.diagnostic);
  const dailyLog = useStore((s) => s.dailyLog);
  const dueCards = useStore((s) => s.dueCards);

  const now = Date.now();

  // Record today's snapshot once on mount so the trend line always includes the
  // latest study day. recordDailySnapshot is idempotent per calendar day.
  useEffect(() => {
    const s = useStore.getState();
    const hasReviewsNow = Object.values(s.cardStates).some((st) => st.history.length > 0);
    if (hasReviewsNow) s.recordDailySnapshot();
  }, []);

  const allCards = useMemo(() => categories.flatMap((c) => c.cards), []);
  // One frozen "new" state stands in for any card not yet studied, so untouched
  // cards count as 0 toward mastery (full-deck denominator).
  const EMPTY = useMemo<CardState>(() => emptyState(now), [now]);

  // ---- headline + per-module fluency (full deck: untouched = 0) ----
  const perCategory = useMemo(
    () =>
      categories.map((cat) => {
        const states = cat.cards.map((c) => cardStates[c.id] ?? EMPTY);
        return {
          key: cat.key,
          name: cat.name,
          tier: tierForKey(cat.key, cat.tier),
          value: categoryFluency(states, now),
        };
      }),
    [cardStates, EMPTY, now],
  );

  // ---- per-tier fluency (full deck: untouched = 0). Four tiers, one value each,
  // averaged over every card in the tier so the radar reads as a true mastery map.
  const perTier = useMemo(
    () =>
      TIERS.map((t) => {
        const states: CardState[] = [];
        for (const cat of categories) {
          if (tierForKey(cat.key, cat.tier) !== t.number) continue;
          for (const c of cat.cards) states.push(cardStates[c.id] ?? EMPTY);
        }
        return {
          number: t.number,
          name: t.name,
          value: states.length ? categoryFluency(states, now) : 0,
        };
      }),
    [cardStates, EMPTY, now],
  );

  // Modules grouped under their tier, for the compact breakdown list.
  const tierBreakdown = useMemo(
    () =>
      perTier
        .map((t) => ({
          tier: t,
          modules: perCategory.filter((p) => p.tier === t.number),
        }))
        .filter((g) => g.modules.length > 0),
    [perTier, perCategory],
  );

  const overall = useMemo(
    () => overallFluency(allCards.map((c) => cardStates[c.id] ?? EMPTY), now),
    [allCards, cardStates, EMPTY, now],
  );

  // ---- tiles ----
  const due = dueCards(now).length;
  const totalCards = allCards.length;

  const reviews = useMemo(
    () => Object.values(cardStates).reduce((n, st) => n + st.history.length, 0),
    [cardStates],
  );

  const { reviewsToday, newToday, streak } = useMemo(() => {
    const dayStart = startOfDay(now);
    const dateSet = new Set<string>();
    let rToday = 0;
    let nToday = 0;
    for (const st of Object.values(cardStates)) {
      for (const h of st.history) {
        dateSet.add(ymd(h.ts));
        if (h.ts >= dayStart) rToday += 1;
      }
      if (st.history.length > 0 && st.history[0].ts >= dayStart) nToday += 1;
    }
    // streak: walk back from today (today not yet studied does not break it)
    let s = 0;
    let cursor = now;
    if (!dateSet.has(ymd(cursor))) cursor -= DAY;
    while (dateSet.has(ymd(cursor))) {
      s += 1;
      cursor -= DAY;
    }
    return { reviewsToday: rToday, newToday: nToday, streak: s };
  }, [cardStates, now]);

  const hasReviews = reviews > 0;

  // ---- radar (four tier axes) + gaps (weakest individual modules) ----
  const radarData: RadarDatum[] = perTier.map((t) => ({
    key: `tier-${t.number}`,
    label: shortTierLabel(t.name),
    full: `Tier ${t.number}: ${t.name}`,
    value: t.value,
  }));

  const gaps = [...perCategory].sort((a, b) => a.value - b.value).slice(0, 3);

  // ---- trend (from store.dailyLog) ----
  const trendData = dailyLog.map((e) => ({ date: e.date, fluency: e.fluency }));

  // ---- program panel ----
  const programView = useMemo(() => {
    if (!program) return null;
    const pathKeys = program.path.length > 0 ? program.path : categories.map((c) => c.key);
    const pathKeySet = new Set(pathKeys);
    const pathCards = allCards.filter((c) => pathKeySet.has(c.categoryKey));
    const total = pathCards.length || 1;
    const started = pathCards.filter((c) => {
      const st = cardStates[c.id];
      return !!st && st.reps > 0;
    }).length;
    const coverage = Math.round((started / total) * 100);

    const daysLeft = Math.ceil((program.targetDate - now) / DAY);

    // pace: expected cards introduced by end of today vs actually started
    const daysElapsed = Math.max(
      0,
      Math.floor((startOfDay(now) - startOfDay(program.createdAt)) / DAY),
    );
    const expectedSeen = Math.min(
      total,
      program.seededKnown.length + (daysElapsed + 1) * Math.max(0, program.dailyNewTarget),
    );
    const diff = started - expectedSeen;
    const ahead = diff >= 0;
    const paceText =
      diff > 0 ? `${diff} cards ahead` : diff === 0 ? 'right on pace' : `${-diff} cards behind`;

    return {
      coverage,
      started,
      total,
      daysLeft,
      targetLabel: new Date(program.targetDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      newTarget: Math.max(0, program.dailyNewTarget),
      reviewEstimate: Math.max(0, program.dailyReviewEstimate),
      ahead,
      paceText,
      rationale: program.rationale,
    };
  }, [program, cardStates, allCards, now]);

  // ---- calibration (diagnostic) ----
  const calibration = useMemo(() => {
    const responses = diagnostic?.responses ?? [];
    if (!diagnostic || responses.length < 4) return null;
    let signed = 0;
    for (const r of responses) {
      signed += r.confidence - CORRECTNESS[r.outcome];
    }
    const biasPct = Math.round((signed / responses.length) * 100);
    const offByPct = Math.round(diagnostic.calibration * 100);

    let headline: string;
    if (biasPct >= 5) headline = `You tend to overestimate by about ${biasPct}%.`;
    else if (biasPct <= -5) headline = `You tend to underestimate by about ${-biasPct}%.`;
    else headline = 'Your self-assessment is well calibrated.';

    // marker bar: center = perfectly matched, right = overconfident
    const clamped = Math.max(-50, Math.min(50, biasPct));
    const left = 50 + Math.min(0, clamped);
    const width = Math.abs(clamped);
    const color = biasPct >= 5 ? C.gold : biasPct <= -5 ? C.accent : C.green;

    return { headline, offByPct, count: responses.length, left, width, color };
  }, [diagnostic]);

  const hasAnyActivity = hasReviews || !!diagnostic || !!program;

  return (
    <div className="view dashboard">
      <h2 className="section">Dashboard</h2>

      {/* Headline + tiles + radar */}
      <Panel className="dash-top">
        <div>
          <div className="bignum">
            {overall}
            <small>/100</small>
          </div>
          <div className="fluency-label">overall LLM fluency · {fluLabel(overall)}</div>
          <div className="tiles">
            <div className="tile">
              <div className="n">{due}</div>
              <div className="l">Due today</div>
            </div>
            <div className="tile">
              <div className="n">{totalCards}</div>
              <div className="l">Total cards</div>
            </div>
            <div className="tile">
              <div className="n">{reviews}</div>
              <div className="l">Reviews</div>
            </div>
            <div className="tile">
              <div className="n">{streak}</div>
              <div className="l">Day streak</div>
            </div>
          </div>
        </div>
        <div>
          <p className="chart-title">Fluency by tier</p>
          <p className="chart-sub">
            Your mastery across the four tiers, greener where you are stronger.
          </p>
          {hasReviews ? (
            <FluencyRadar data={radarData} />
          ) : (
            <div className="empty-chart">Study cards to fill in your mastery map.</div>
          )}
        </div>
      </Panel>

      {/* Per-module fluency, grouped by tier */}
      {hasReviews && (
        <Panel>
          <p className="chart-title">Fluency by module</p>
          <p className="chart-sub">
            Every module, grouped by tier. Bars show your current mastery.
          </p>
          <div className="tier-breakdown">
            {tierBreakdown.map((g) => (
              <div className="tier-block" key={g.tier.number}>
                <div className="tier-block-head">
                  <span className="tier-num">Tier {g.tier.number}</span>
                  <span className="tier-block-name">{shortTierLabel(g.tier.name)}</span>
                  <span className="tier-block-val">{Math.round(g.tier.value)}/100</span>
                </div>
                {g.modules.map((m) => {
                  const v = Math.round(m.value);
                  return (
                    <div className="mod-row" key={m.key}>
                      <span className="mod-name">{m.name}</span>
                      <span className="mod-bar">
                        <i style={{ width: `${Math.max(2, v)}%`, background: fluColor(v) }} />
                      </span>
                      <span className="mod-val">{v}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Program panel */}
      {programView && (
        <Panel>
          <div className="panel-head">
            <div>
              <p className="chart-title">Your program</p>
              <p className="chart-sub">Your plan to fluency and whether you are keeping pace.</p>
            </div>
            <span className={`pace ${programView.ahead ? 'ahead' : 'behind'}`}>
              <span className="dot" />
              {programView.ahead ? 'On pace' : 'Behind pace'} · {programView.paceText}
            </span>
          </div>
          <div className="prog-grid">
            <div className="prog-stat">
              <div className="n">
                {programView.daysLeft > 0
                  ? programView.daysLeft
                  : programView.daysLeft === 0
                    ? 'Today'
                    : Math.abs(programView.daysLeft)}
              </div>
              <div className="l">
                {programView.daysLeft > 0
                  ? 'days to fluent'
                  : programView.daysLeft === 0
                    ? 'target is today'
                    : 'days overdue'}
              </div>
              <div className="sub2">fluent by {programView.targetLabel}</div>
            </div>
            <div className="prog-stat">
              <div className="n">{programView.coverage}%</div>
              <div className="l">of your path covered</div>
              <div className="sub2">
                {programView.started}/{programView.total} cards started
              </div>
            </div>
            <div className="prog-stat">
              <div className="n">
                {newToday}/{programView.newTarget}
              </div>
              <div className="l">new cards today</div>
              <div className="sub2">
                {reviewsToday}/{programView.reviewEstimate} reviews done
              </div>
            </div>
          </div>
          {programView.rationale && <p className="prog-rationale">{programView.rationale}</p>}
        </Panel>
      )}

      {/* Trend + gaps */}
      <div className="charts-grid">
        <Panel>
          <p className="chart-title">Progress over time</p>
          <p className="chart-sub">Daily snapshot of your overall fluency.</p>
          {trendData.length > 0 ? (
            <FluencyTrend data={trendData} />
          ) : (
            <div className="empty-chart">Study on a few different days to draw your trend.</div>
          )}
        </Panel>

        <Panel>
          <p className="chart-title">Your gaps</p>
          <p className="chart-sub">The three areas to drill next.</p>
          {hasReviews ? (
            <div>
              {gaps.map((g) => {
                const v = Math.round(g.value);
                return (
                  <div className="gap-row" key={g.key}>
                    <div className="gap-head">
                      <span className="gn">{g.name}</span>
                      <span className="gv">{v}/100</span>
                    </div>
                    <div className="gap-bar">
                      <i style={{ width: `${Math.max(2, v)}%`, background: fluColor(v) }} />
                    </div>
                    <div className="gap-nudge">{gapNudge(g.name, v)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-chart">Study cards to surface your weakest areas.</div>
          )}
        </Panel>
      </div>

      {/* Calibration */}
      {calibration && (
        <Panel>
          <p className="chart-title">Calibration</p>
          <p className="chart-sub">How well your confidence matched reality on the diagnostic.</p>
          <p className="calib-headline">{calibration.headline}</p>
          <p className="calib-sub">
            Across {calibration.count} diagnostic answers, your confidence was off by{' '}
            {calibration.offByPct}% on average. Lower is better.
          </p>
          <div
            className="calib-bar"
            title="left of center: underconfident, right of center: overconfident"
          >
            <i
              style={{
                left: `${calibration.left}%`,
                width: `${Math.max(1, calibration.width)}%`,
                background: calibration.color,
              }}
            />
            <i style={{ left: '50%', width: 2, background: C.muted, opacity: 0.5 }} />
          </div>
        </Panel>
      )}

      {/* Whole-dashboard empty state */}
      {!hasAnyActivity && (
        <Panel>
          <div className="empty-state">
            <h3>Nothing to show yet</h3>
            <p>
              Take the Diagnostic to seed what you already know and build your program, then Study
              to start filling in your mastery map. Everything you do stays on this device.
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
