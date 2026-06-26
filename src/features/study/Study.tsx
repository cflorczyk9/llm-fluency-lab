// Study: the core retrieval-practice loop, upgraded with learning-science best
// practices (interleaving, metacognitive confidence + calibration, immediate
// feedback, spaced scheduling explained at the boundaries).
//
// Reads the queue and grading from the store, the interval previews from the
// scheduler, and composes the pure helpers in ./session. Only this folder is
// owned here, so cross-cut concerns (queue rules) reuse store selectors.

import { useEffect, useMemo, useRef, useState } from 'react';

import Button from '../../components/Button';
import Panel from '../../components/Panel';
import Tag from '../../components/Tag';
import { useStore } from '../../store/store';
import { previewIntervals } from '../../lib/fsrs';
import type { Card, Rating } from '../../types';

import {
  FOCUS_OPTIONS,
  buildAheadQueue,
  buildFocusQueue,
  calibrationSummary,
  fmtDueFromNow,
  fmtInterval,
  nextDueAt,
  orderSession,
  videoForCard,
  type ConfSample,
} from './session';
import './study.css';

const ALL = '__all';

const CONF_LEVELS: ReadonlyArray<{ label: string; value: number }> = [
  { label: 'Guessing', value: 0.15 },
  { label: 'Pretty sure', value: 0.55 },
  { label: 'I know this', value: 0.9 },
];

const KEY_TO_RATING: Record<string, Rating> = {
  '1': 'again',
  '2': 'hard',
  '3': 'good',
  '4': 'easy',
};

interface SessionState {
  queue: Card[]; // upcoming cards, current excluded
  current: Card | null;
  revealed: boolean;
  total: number; // initial card count, fixed for the session
  completed: number; // cards finished for good (not requeued by Again)
  conf: number | null; // confidence chosen for the current card, if any
  samples: ConfSample[]; // confidence vs outcome, for the calibration readout
  ahead: boolean; // true when this is an early/cram session
}

const EMPTY_SESSION: SessionState = {
  queue: [],
  current: null,
  revealed: false,
  total: 0,
  completed: 0,
  conf: null,
  samples: [],
  ahead: false,
};

export default function Study() {
  const settings = useStore((s) => s.settings);
  const program = useStore((s) => s.program);
  const cardStates = useStore((s) => s.cardStates);
  const gradeCard = useStore((s) => s.gradeCard);
  const updateSettings = useStore((s) => s.updateSettings);
  const todaysQueue = useStore((s) => s.todaysQueue);
  const getCardState = useStore((s) => s.getCardState);

  const [focus, setFocus] = useState<string>(ALL);
  const [session, setSession] = useState<SessionState>(EMPTY_SESSION);

  const focusKey = focus === ALL ? null : focus;

  // Refs so the window key listener always sees the latest state and actions
  // without re-binding on every card.
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const apiRef = useRef<{ reveal: () => void; grade: (r: Rating) => void }>({
    reveal: () => {},
    grade: () => {},
  });

  // Build a fresh session queue from the store, then order it for the session.
  function makeQueue(ahead: boolean): Card[] {
    const now = Date.now();
    let base: Card[];
    if (ahead) {
      base = buildAheadQueue({
        now,
        focusKey,
        hideAdvanced: settings.hideAdvanced,
        limit: 20,
        getCardState,
      }).queue;
    } else if (focusKey) {
      base = buildFocusQueue({
        focusKey,
        now,
        hideAdvanced: settings.hideAdvanced,
        newCap: settings.dailyNewCap,
        getCardState,
      });
    } else {
      base = todaysQueue(now);
    }
    return orderSession(base, settings.interleave, !!focusKey);
  }

  function start(ahead: boolean) {
    const ordered = makeQueue(ahead);
    const [first, ...rest] = ordered;
    setSession({
      queue: rest,
      current: first ?? null,
      revealed: false,
      total: ordered.length,
      completed: 0,
      conf: null,
      samples: [],
      ahead,
    });
  }

  // (Re)start the scheduled session whenever the session shape changes: focus
  // filter, interleave, starter-deck filter, or the daily new-card cap. Grading
  // does not touch these, so a normal review never rebuilds the queue.
  useEffect(() => {
    start(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey, settings.interleave, settings.hideAdvanced, settings.dailyNewCap]);

  function handleReveal() {
    const s = sessionRef.current;
    if (!s.current || s.revealed) return;
    setSession((prev) => ({ ...prev, revealed: true }));
  }

  function handleGrade(rating: Rating) {
    const s = sessionRef.current;
    if (!s.current || !s.revealed) return;
    const current = s.current;
    // Side effect lives outside the state updater so StrictMode's double-invoke
    // never double-grades the card.
    gradeCard(current.id, rating);
    setSession((prev) => {
      const samples =
        prev.conf != null ? [...prev.samples, { confidence: prev.conf, rating }] : prev.samples;
      // Again requeues the card near the end of this session for a second pass.
      const queue = rating === 'again' ? [...prev.queue, current] : prev.queue;
      const completed = rating === 'again' ? prev.completed : prev.completed + 1;
      const [next, ...rest] = queue;
      return {
        ...prev,
        queue: rest,
        current: next ?? null,
        revealed: false,
        conf: null,
        samples,
        completed,
      };
    });
  }

  function pickConf(value: number) {
    setSession((prev) => ({ ...prev, conf: prev.conf === value ? null : value }));
  }

  function openVisualGuide(categoryKey: string) {
    // The host app (App.tsx) can listen for this to switch to the Learn tab and
    // scroll to the category. If nothing listens, this is a harmless no-op.
    window.dispatchEvent(
      new CustomEvent('llm-fluency-lab:navigate', {
        detail: { view: 'learn', categoryKey },
      }),
    );
  }

  apiRef.current.reveal = handleReveal;
  apiRef.current.grade = handleGrade;

  // Keyboard shortcuts: space reveals, 1-4 grade once revealed.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      const s = sessionRef.current;
      if (!s.current) return;
      if (e.key === ' ' || e.code === 'Space') {
        if (!s.revealed) {
          e.preventDefault();
          apiRef.current.reveal();
        }
        return;
      }
      if (s.revealed && KEY_TO_RATING[e.key]) {
        e.preventDefault();
        apiRef.current.grade(KEY_TO_RATING[e.key]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Interval previews for the four grade buttons, only when the answer is shown.
  const preview = useMemo(() => {
    if (!session.current || !session.revealed) return null;
    return previewIntervals(getCardState(session.current.id), Date.now(), {
      requestRetention: settings.requestRetention,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.current?.id, session.revealed, settings.requestRetention]);

  // Early-study availability and next-due, recomputed as cards get graded.
  const aheadInfo = useMemo(
    () =>
      buildAheadQueue({
        now: Date.now(),
        focusKey,
        hideAdvanced: settings.hideAdvanced,
        limit: 20,
        getCardState,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focusKey, settings.hideAdvanced, cardStates],
  );
  const nextDue = useMemo(
    () => nextDueAt({ now: Date.now(), getCardState }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardStates],
  );

  const queueCount = (session.current ? 1 : 0) + session.queue.length;
  const newTarget = program?.dailyNewTarget ?? settings.dailyNewCap;
  const progressPct = session.total > 0 ? (session.completed / session.total) * 100 : 0;
  const current = session.current;
  const video = current ? videoForCard(current) : null;
  const calibration = calibrationSummary(session.samples);

  function aheadLabel(): string {
    if (aheadInfo.newAvail > 0) {
      const n = Math.min(20, aheadInfo.newAvail);
      return `Learn ahead (${n} new)`;
    }
    const n = Math.min(20, aheadInfo.cramAvail);
    return `Review early (${n})`;
  }

  return (
    <div className="view view-task">
      <h2 className="section">Study</h2>
      <Panel>
        <div className="study-bar">
          <div className="filter-wrap">
            <label htmlFor="focusFilter" className="sub muted">
              Focus
            </label>
            <select
              id="focusFilter"
              className="study-select"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            >
              <option value={ALL}>All categories (interleaved)</option>
              {FOCUS_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-wrap">
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.interleave}
                disabled={!!focusKey}
                onChange={(e) => updateSettings({ interleave: e.target.checked })}
              />
              Interleave
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.hideAdvanced}
                onChange={(e) => updateSettings({ hideAdvanced: e.target.checked })}
              />
              Starter deck
            </label>
            <span className="pill">queue {queueCount}</span>
            <span className="pill">new {newTarget}/day</span>
          </div>
        </div>

        {current ? (
          <>
            <div className="session-progress" aria-hidden="true">
              <i style={{ width: `${progressPct}%` }} />
            </div>
            <div className="card-stage" key={current.id}>
              <div className="card-meta">
                <Tag kind="cat">{current.category}</Tag>
                {current.subtopic && <Tag kind="sub">{current.subtopic}</Tag>}
                <Tag kind="difficulty" difficulty={current.difficulty}>
                  {current.difficulty}
                </Tag>
              </div>
              <div className="q">{current.question}</div>

              {session.revealed ? (
                <>
                  <div className="a">{current.answer}</div>
                  {current.plain && (
                    <div className="plain">
                      <span className="plain-label">In plain terms</span>
                      {current.plain}
                    </div>
                  )}
                  <div className="watch">
                    {video && (
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        Watch the short video
                      </a>
                    )}
                    <button
                      type="button"
                      className="linklike"
                      onClick={() => openVisualGuide(current.categoryKey)}
                    >
                      Open the visual guide
                    </button>
                  </div>
                  <div className="grade-row">
                    <Button variant="again" onClick={() => handleGrade('again')}>
                      <b>Again</b>
                      <span className="ivl">{preview ? fmtInterval(preview.again) : ''}</span>
                      <span className="gkey">1</span>
                    </Button>
                    <Button variant="hard" onClick={() => handleGrade('hard')}>
                      <b>Hard</b>
                      <span className="ivl">{preview ? fmtInterval(preview.hard) : ''}</span>
                      <span className="gkey">2</span>
                    </Button>
                    <Button variant="good" onClick={() => handleGrade('good')}>
                      <b>Good</b>
                      <span className="ivl">{preview ? fmtInterval(preview.good) : ''}</span>
                      <span className="gkey">3</span>
                    </Button>
                    <Button variant="easy" onClick={() => handleGrade('easy')}>
                      <b>Easy</b>
                      <span className="ivl">{preview ? fmtInterval(preview.easy) : ''}</span>
                      <span className="gkey">4</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="confidence-row">
                  <div className="confidence-label">
                    Before you flip, how sure are you? (optional, it sharpens your self-read)
                  </div>
                  <div className="conf-btns">
                    {CONF_LEVELS.map((lvl) => (
                      <button
                        key={lvl.label}
                        type="button"
                        className={`conf-btn${session.conf === lvl.value ? ' active' : ''}`}
                        onClick={() => pickConf(lvl.value)}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                  <Button variant="primary" onClick={handleReveal} style={{ width: '100%' }}>
                    Show answer
                  </Button>
                  <div className="reveal-hint">
                    Press <b>Space</b> to reveal, then <b>1</b> to <b>4</b> to grade.
                  </div>
                </div>
              )}
            </div>
          </>
        ) : session.completed > 0 ? (
          <div className="empty-state">
            <div className="big" style={{ color: 'var(--accent2)' }}>
              {session.ahead ? '✦' : '✓'}
            </div>
            <h3>{session.ahead ? 'Extra reps banked.' : 'Session complete.'}</h3>
            <p>
              You worked through {session.completed} card
              {session.completed === 1 ? '' : 's'}. Finished cards now wait on a spaced
              schedule. Each solid review pushes the next one further out, which is exactly
              what moves a fact into long-term memory.
              {nextDue
                ? ` Your next card comes due in about ${fmtDueFromNow(nextDue - Date.now())}.`
                : ''}
            </p>
            {calibration && (
              <div className="calib-note">
                <b>{calibration.headline}</b> {calibration.detail}
              </div>
            )}
            <div className="done-actions">
              {aheadInfo.queue.length > 0 && (
                <Button variant="good" onClick={() => start(true)}>
                  {aheadLabel()}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="big" style={{ color: 'var(--accent2)' }}>
              {'✓'}
            </div>
            <h3>Nothing due right now.</h3>
            <p>
              You are caught up{focusKey ? ' in this category' : ''}. Spaced repetition holds
              cards back until you are about to forget them, so an empty queue is the system
              working, not a gap.
              {aheadInfo.queue.length > 0
                ? ' You can still pull some cards early to drill them in.'
                : ''}
            </p>
            <div className="done-actions">
              {aheadInfo.queue.length > 0 && (
                <Button variant="good" onClick={() => start(true)}>
                  {aheadLabel()}
                </Button>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
