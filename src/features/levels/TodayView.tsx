// The daily "what to do today" screen for a guided learning path. It shows the
// learner the current week and day, the plain-English activity, what to learn,
// the day's card targets, and the right call to action (study, or take a section
// test). Purely presentational. All data and callbacks arrive via props from the
// orchestrator (Path.tsx); this component holds no state and reaches no store.

import type { TodayViewProps } from './viewTypes';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import './levels.css';

export default function TodayView(props: TodayViewProps) {
  const {
    plan,
    flatDay,
    dayIndex,
    totalDays,
    sections,
    todaySection,
    moduleInfo,
    onStartStudy,
    onMarkDone,
    onOpenSchedule,
    onStartTest,
    onReviewModule,
    onSwitchLevel,
  } = props;

  const atEnd = dayIndex >= totalDays;

  return (
    <div className="view view-task">
      <Panel>
        <div className="today-head">
          <div>
            <div className="today-week">
              Week {flatDay.week} of {plan.totalWeeks} · {flatDay.weekTheme}
            </div>
            <div className="today-day-label">
              {flatDay.label} · Day {dayIndex}
            </div>
          </div>
          <div>
            <div className="today-progress">
              Day {dayIndex} of {totalDays}
            </div>
            <Button variant="ghost" small onClick={onSwitchLevel}>
              Switch level
            </Button>
          </div>
        </div>

        <p className="today-activity">{flatDay.activity}</p>

        {flatDay.learnModuleKeys.length > 0 && (
          <div className="today-modules">
            <span className="muted">Learn today:</span>
            {flatDay.learnModuleKeys.map((key) => (
              <Button
                key={key}
                variant="ghost"
                small
                onClick={() => onReviewModule(key)}
              >
                {moduleInfo[key]?.name ?? key}
              </Button>
            ))}
          </div>
        )}

        <div className="today-facts">
          <span className="pill">New cards: {flatDay.newCards}</span>
          {flatDay.reviewTarget && (
            <span className="pill">Reviews: {flatDay.reviewTarget}</span>
          )}
        </div>

        <div className="today-cta-row">
          {todaySection ? (
            <Button
              variant="primary"
              onClick={() => onStartTest(todaySection.id)}
            >
              Take the {todaySection.title} test
            </Button>
          ) : (
            <Button variant="primary" onClick={onStartStudy}>
              Start today's study
            </Button>
          )}
          <Button variant="ghost" onClick={onMarkDone} disabled={atEnd}>
            Mark day done
          </Button>
          <Button variant="ghost" onClick={onOpenSchedule}>
            Full schedule
          </Button>
        </div>

        <div className="chip-row">
          {sections.map((sv) => (
            <span
              key={sv.section.id}
              className={`sec-chip ${sv.status.status}`}
            >
              <span className="dot" />
              {sv.section.title}
              {sv.status.status === 'passed' && sv.status.bestScorePct != null
                ? ` ${sv.status.bestScorePct}%`
                : ''}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
}
