// The section-test runner: presents one section-test question at a time, mostly
// multiple-choice with a reveal-and-rate fallback, and reports per-question
// results. Purely presentational. The orchestrator (Path.tsx) generates the
// questions and grades/persists the attempt; this component only presents the
// provided questions, collects answers, and calls onComplete with the results.

import { useState } from 'react';
import type { TestOption, TestQuestionResult } from '../../types';
import type { SectionTestRunnerProps } from './viewTypes';
import Button from '../../components/Button';
import './levels.css';

export default function SectionTestRunner(props: SectionTestRunnerProps) {
  const { section, questions, onComplete, onCancel } = props;

  // Current question index.
  const [i, setI] = useState(0);
  // Results for every question already answered and advanced past.
  const [results, setResults] = useState<TestQuestionResult[]>([]);
  // Per-question answer state, reset on each advance.
  const [chosenId, setChosenId] = useState<string | null>(null); // MCQ pick
  const [revealed, setRevealed] = useState(false); // self-rate: answer shown
  const [current, setCurrent] = useState<TestQuestionResult | null>(null);

  // Empty guard: nothing to present.
  if (questions.length === 0) {
    return (
      <div className="view view-task">
        <h2 className="section">{section.title} test</h2>
        <p className="muted">No questions are available for this test right now.</p>
        <Button variant="ghost" onClick={onCancel}>
          Quit
        </Button>
      </div>
    );
  }

  const q = questions[i];
  const isLast = i === questions.length - 1;
  const answered = current !== null;

  // Build the result skeleton from the current question's metadata.
  function makeResult(correct: boolean, chosen: string): TestQuestionResult {
    return {
      cardId: q.cardId,
      categoryKey: q.categoryKey,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      correct,
      chosen,
    };
  }

  // MCQ: record the chosen option and reveal correctness.
  function chooseOption(opt: TestOption) {
    if (answered) return;
    setChosenId(opt.id);
    setCurrent(makeResult(opt.correct, opt.text));
  }

  // Self-rate: record the learner's own grade. Only "Knew it" counts as correct.
  function selfRate(label: string, correct: boolean) {
    if (answered) return;
    setCurrent(makeResult(correct, label));
  }

  // Reset the per-question answer state for the next question.
  function resetPerQuestion() {
    setChosenId(null);
    setRevealed(false);
    setCurrent(null);
  }

  // Advance, or finish on the last question. Always include the just-answered
  // result so the final question is never dropped.
  function next() {
    if (!current) return;
    const all = [...results, current];
    if (isLast) {
      onComplete(all);
      return;
    }
    setResults(all);
    setI(i + 1);
    resetPerQuestion();
  }

  function optionClass(opt: TestOption): string {
    const classes = ['test-option'];
    if (answered) {
      if (opt.id === chosenId) classes.push('selected');
      if (opt.correct) classes.push('correct');
      if (opt.id === chosenId && !opt.correct) classes.push('wrong');
    }
    return classes.join(' ');
  }

  return (
    <div className="view view-task">
      <h2 className="section">{section.title} test</h2>

      <div className="test-stage">
        <div className="test-progress">
          <i style={{ width: `${(i / questions.length) * 100}%` }} />
        </div>

        <div className="test-prompt">{q.prompt}</div>

        {q.selfRate ? (
          // Reveal-and-rate fallback: no usable multiple-choice options.
          !revealed ? (
            <Button variant="primary" onClick={() => setRevealed(true)}>
              Show answer
            </Button>
          ) : (
            <>
              <div className="a">{q.answer}</div>
              <div className="test-selfrate">
                <Button
                  variant="good"
                  disabled={answered}
                  onClick={() => selfRate('Knew it', true)}
                >
                  Knew it
                </Button>
                <Button
                  variant="default"
                  disabled={answered}
                  onClick={() => selfRate('Partial', false)}
                >
                  Partial
                </Button>
                <Button
                  variant="again"
                  disabled={answered}
                  onClick={() => selfRate('Missed', false)}
                >
                  Missed
                </Button>
              </div>
            </>
          )
        ) : (
          // Standard multiple-choice.
          <div className="test-options">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={optionClass(opt)}
                disabled={answered}
                onClick={() => chooseOption(opt)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        <div className="test-footer">
          <span className="muted">
            Question {i + 1} of {questions.length}
          </span>
          <div className="test-selfrate">
            <Button variant="ghost" onClick={onCancel}>
              Quit
            </Button>
            {answered && (
              <Button variant="primary" onClick={next}>
                {isLast ? 'Finish' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
