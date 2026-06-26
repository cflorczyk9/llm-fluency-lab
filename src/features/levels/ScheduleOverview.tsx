// The full week-by-week study schedule for a chosen learning path. Shows every
// week's theme and days, highlights the current day, and marks the days that end
// in a section test. Purely presentational: all data and callbacks arrive via
// props from the orchestrator (Path.tsx); this component holds no state and
// reaches no store.

import type { ScheduleOverviewProps } from './viewTypes';
import Button from '../../components/Button';
import './levels.css';

export default function ScheduleOverview(props: ScheduleOverviewProps) {
  const { plan, currentDayIndex, sections, onBack } = props;

  // Running 1-based counter across all weeks and days, so each rendered day
  // gets a unique absolute index. A day is "today" when its absolute index
  // matches the current pointer. Evaluation order (weeks then days) is
  // deterministic, so incrementing as we render is safe.
  let absIndex = 0;

  return (
    <div className="view">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 className="section">{plan.title} schedule</h2>
        <Button variant="ghost" small onClick={onBack}>
          Back
        </Button>
      </div>

      <div className="chip-row">
        {sections.map((sv) => (
          <span className={`sec-chip ${sv.status.status}`} key={sv.section.id}>
            <span className="dot" />
            {sv.section.title}
            {sv.status.status === 'passed' && sv.status.bestScorePct !== undefined
              ? ` ${sv.status.bestScorePct}%`
              : null}
          </span>
        ))}
      </div>

      {plan.schedule.map((week) => (
        <div className="sched-week" key={`w${week.week}`}>
          <div className="sched-week-head">
            <span className="sched-week-num">Week {week.week}</span>
            <span className="sched-week-theme">{week.theme}</span>
          </div>

          {week.days.map((day) => {
            absIndex += 1;
            const thisIndex = absIndex;
            const isToday = thisIndex === currentDayIndex;
            const dayClass = [
              'sched-day',
              isToday ? 'today' : '',
              day.sectionTestId ? 'test' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const meta = day.sectionTestId
              ? 'Section test'
              : day.newCards > 0
                ? `${day.newCards} new`
                : 'Review';

            return (
              <div
                className={dayClass}
                key={`w${week.week}d${day.day}-${thisIndex}`}
              >
                <div className="d-label">{day.label}</div>
                <div>{day.activity}</div>
                <div className="d-meta">{meta}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
