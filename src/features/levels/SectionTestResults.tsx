import type { SectionTestResultsProps } from './viewTypes';
import Button from '../../components/Button';
import './levels.css';

// Presentational results screen for a section test. Shows the score against the
// pass threshold and, on a miss (or whenever there are weak modules), the
// gap-analysis remediation: which modules to study more, the subtopics missed,
// and links to review them. The orchestrator owns all logic and store access.
export default function SectionTestResults(props: SectionTestResultsProps) {
  const { section, attempt, weakModules, moduleInfo } = props;

  const total = attempt.questions.length;
  const correctCount = attempt.questions.filter((q) => q.correct).length;

  // Top three modules worth more study, ignoring near-noise weakness.
  const modulesToStudy = weakModules
    .filter((wm) => wm.weakness > 0.15)
    .slice(0, 3);

  // Show remediation when failed, or whenever something is genuinely weak.
  const showRemediation = !attempt.passed || modulesToStudy.length > 0;

  return (
    <div className="view view-task">
      <h2 className="section">{section.title} results</h2>

      <div className="results-score">
        <span className="big">{attempt.scorePct}%</span>
        <div className="muted">
          {correctCount} of {total} correct
        </div>
      </div>

      <p className={`results-verdict ${attempt.passed ? 'pass' : 'fail'}`}>
        {attempt.passed
          ? 'Passed. Nice work.'
          : `You needed ${attempt.passThresholdPct}% to pass. Almost there, here is what to shore up.`}
      </p>

      {showRemediation && (
        <div className="remediation">
          <p className="remediation-intro">{section.remediation}</p>

          {modulesToStudy.map((wm) => {
            const info = moduleInfo[wm.moduleKey];
            const name = info?.name ?? wm.moduleKey;
            const widthPct = Math.round(wm.weakness * 100);
            return (
              <div className="weak-module" key={wm.moduleKey}>
                <h4>{name}</h4>
                <div className="weak-bar">
                  <i style={{ width: `${widthPct}%` }} />
                </div>
                {info?.summary && <div className="muted">{info.summary}</div>}
                {wm.missedSubtopics.length > 0 && (
                  <div className="weak-subtopics">
                    You missed: {wm.missedSubtopics.join(', ')}
                  </div>
                )}
                <div className="weak-actions">
                  <Button
                    variant="ghost"
                    small
                    onClick={() => props.onReviewModule(wm.moduleKey)}
                  >
                    Review this module
                  </Button>
                  {info?.hasVideo && info.videoUrl && (
                    <a
                      className="btn ghost small"
                      href={info.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Re-watch video
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="results-actions">
        {!attempt.passed && (
          <Button variant="primary" onClick={() => props.onRetry()}>
            Retry test
          </Button>
        )}
        <Button variant="ghost" onClick={() => props.onContinue()}>
          {attempt.passed ? 'Continue' : 'Continue anyway'}
        </Button>
      </div>
    </div>
  );
}
