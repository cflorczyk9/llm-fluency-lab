// The level-selection screen: a learner picks one of three guided paths
// (beginner / intermediate / expert) or opts into the placement test instead.
// Purely presentational. All data and callbacks arrive via props from the
// orchestrator (Path.tsx); this component holds no state and reaches no store.

import type { LevelKey } from '../../types';
import type { LevelPickerProps } from './viewTypes';
import Button from '../../components/Button';
import './levels.css';

// Turn a level key like "beginner" into a display label like "Beginner".
function capitalize(level: LevelKey): string {
  return level[0].toUpperCase() + level.slice(1);
}

export default function LevelPicker(props: LevelPickerProps) {
  const { levels, onChoose, onTakeDiagnostic } = props;

  return (
    <div className="view view-task">
      <h2 className="section">Choose your path</h2>
      <p className="muted">
        Pick the depth that fits you. You can switch levels anytime, and your
        card progress carries over.
      </p>

      <div className="level-grid">
        {levels.map((plan) => (
          <div className="level-card" key={plan.level}>
            <div className="level-eyebrow">{capitalize(plan.level)}</div>
            <h3>{plan.title}</h3>

            <div className="level-meta">
              <span>
                <b>{plan.totalWeeks}</b> weeks
              </span>
              <span>
                <b>{plan.assumedMinutesPerDay}</b> min a day
              </span>
              <span>
                <b>{plan.moduleKeys.length}</b> modules
              </span>
              <span>
                <b>{plan.sections.length}</b> section tests
              </span>
            </div>

            <p className="level-blurb">{plan.blurb}</p>

            <Button variant="primary" onClick={() => onChoose(plan.level)}>
              Start this path
            </Button>
          </div>
        ))}
      </div>

      <div className="level-aside">
        <span className="muted">Not sure where you land? </span>
        <Button variant="ghost" small onClick={onTakeDiagnostic}>
          Take the 10-minute placement test
        </Button>
      </div>
    </div>
  );
}
