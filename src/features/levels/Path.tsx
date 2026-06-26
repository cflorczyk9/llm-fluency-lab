// Orchestrator for the learning-levels feature. Owns all store access and the
// little view state machine (pick a level -> today -> schedule / section test ->
// results), and passes plain data + callbacks down to the presentational
// components. This is the only component in the feature that touches the store.

import { useEffect, useMemo, useState } from 'react';

import { useStore } from '../../store/store';
import { categories } from '../../data/content';
import {
  LEVELS,
  LEVEL_ORDER,
  flattenSchedule,
  sectionById,
  type LevelPlan,
} from '../../data/levels';
import type {
  LevelKey,
  SectionTestAttempt,
  TestQuestion,
  TestQuestionResult,
  WeakModule,
} from '../../types';
import { track } from '../analytics/track';
import { generateSectionTest, analyzeWeakness, scorePct } from './testgen';
import { statusOf } from './plan';
import type { ModuleInfo, SectionStatusView } from './viewTypes';

import LevelPicker from './LevelPicker';
import TodayView from './TodayView';
import ScheduleOverview from './ScheduleOverview';
import SectionTestRunner from './SectionTestRunner';
import SectionTestResults from './SectionTestResults';
import './levels.css';

type Mode = 'today' | 'schedule' | 'test' | 'results';

// Window-event navigation (App.tsx listens for these to switch tabs).
function navTo(view: string) {
  window.dispatchEvent(new CustomEvent('llm-fluency-lab:nav', { detail: view }));
}
function navToModule(categoryKey: string) {
  window.dispatchEvent(
    new CustomEvent('llm-fluency-lab:navigate', {
      detail: { view: 'learn', categoryKey },
    }),
  );
}

// Per-module display info from the deck (name, summary, hero video).
const MODULE_INFO: Record<string, ModuleInfo> = Object.fromEntries(
  categories.map((c) => [
    c.key,
    {
      key: c.key,
      name: c.name,
      summary: c.summary,
      tier: c.tier ?? 1,
      hasVideo: Boolean(c.video),
      videoUrl: c.video?.url,
    } satisfies ModuleInfo,
  ]),
);

function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export default function Path() {
  const enrollment = useStore((s) => s.enrollment);
  const chooseLevel = useStore((s) => s.chooseLevel);
  const advanceDay = useStore((s) => s.advanceDay);
  const recordSectionTest = useStore((s) => s.recordSectionTest);
  const leaveLevel = useStore((s) => s.leaveLevel);
  const getCardState = useStore((s) => s.getCardState);

  const [mode, setMode] = useState<Mode>('today');
  const [test, setTest] = useState<{
    sectionId: string;
    startedAt: number;
    questions: TestQuestion[];
  } | null>(null);
  const [results, setResults] = useState<{
    attempt: SectionTestAttempt;
    weakModules: WeakModule[];
  } | null>(null);

  const plan: LevelPlan | null = enrollment ? LEVELS[enrollment.level] : null;

  const flat = useMemo(() => (plan ? flattenSchedule(plan) : []), [plan]);

  const sectionViews: SectionStatusView[] = useMemo(() => {
    if (!plan || !enrollment) return [];
    return plan.sections.map((section) => ({
      section,
      status: statusOf(enrollment, section.id),
    }));
  }, [plan, enrollment]);

  // Fire remediation-opened when a failed result screen appears.
  useEffect(() => {
    if (mode === 'results' && results && !results.attempt.passed) {
      track('remediation_opened', {
        sectionId: results.attempt.sectionId,
        weakModuleKeys: results.attempt.weakModuleKeys,
      });
    }
  }, [mode, results]);

  // --- Not enrolled: choose a level ---
  if (!enrollment || !plan) {
    return (
      <LevelPicker
        levels={LEVEL_ORDER.map((k) => LEVELS[k])}
        onChoose={(level: LevelKey) => {
          chooseLevel(level);
          track('level_selected', { level });
          setMode('today');
        }}
        onTakeDiagnostic={() => navTo('diagnostic')}
      />
    );
  }

  function startTest(sectionId: string) {
    if (!plan) return;
    const section = sectionById(plan, sectionId);
    if (!section) return;
    const now = Date.now();
    const questions = generateSectionTest({
      section,
      getCardState,
      now,
      seed: newSeed(),
    });
    track('section_test_started', { sectionId, level: plan.level });
    setTest({ sectionId, startedAt: now, questions });
    setResults(null);
    setMode('test');
  }

  function finishTest(answered: TestQuestionResult[]) {
    if (!plan || !test) return;
    const section = sectionById(plan, test.sectionId);
    if (!section) return;
    const now = Date.now();
    const sp = scorePct(answered);
    const passed = sp >= section.test.passThresholdPct;
    const weak = analyzeWeakness({ section, results: answered, getCardState, now });
    const weakModuleKeys = weak.filter((w) => w.weakness > 0).slice(0, 3).map((w) => w.moduleKey);
    const attempt: SectionTestAttempt = {
      sectionId: section.id,
      level: plan.level,
      startedAt: test.startedAt,
      completedAt: now,
      scorePct: sp,
      passThresholdPct: section.test.passThresholdPct,
      passed,
      questions: answered,
      weakModuleKeys,
    };
    recordSectionTest(attempt);
    track('section_test_completed', {
      sectionId: section.id,
      level: plan.level,
      scorePct: sp,
      passed,
      weakModuleKeys,
    });
    setResults({ attempt, weakModules: weak });
    setMode('results');
  }

  const dayIndex = Math.min(Math.max(1, enrollment.currentDayIndex), flat.length || 1);
  const flatDay = flat[dayIndex - 1];
  const todaySection = flatDay?.sectionTestId
    ? sectionById(plan, flatDay.sectionTestId) ?? undefined
    : undefined;

  // --- Section test runner ---
  if (mode === 'test' && test) {
    const section = sectionById(plan, test.sectionId);
    if (section) {
      return (
        <SectionTestRunner
          section={section}
          questions={test.questions}
          onComplete={finishTest}
          onCancel={() => setMode('today')}
        />
      );
    }
  }

  // --- Results + remediation ---
  if (mode === 'results' && results) {
    const section = sectionById(plan, results.attempt.sectionId);
    if (section) {
      return (
        <SectionTestResults
          section={section}
          attempt={results.attempt}
          weakModules={results.weakModules}
          moduleInfo={MODULE_INFO}
          onReviewModule={navToModule}
          onRetry={() => startTest(results.attempt.sectionId)}
          onContinue={() => setMode('today')}
        />
      );
    }
  }

  // --- Full schedule ---
  if (mode === 'schedule') {
    return (
      <ScheduleOverview
        plan={plan}
        currentDayIndex={dayIndex}
        sections={sectionViews}
        onBack={() => setMode('today')}
      />
    );
  }

  // --- Today (default once enrolled) ---
  if (!flatDay) {
    // Schedule finished: send them to the overview.
    return (
      <ScheduleOverview
        plan={plan}
        currentDayIndex={dayIndex}
        sections={sectionViews}
        onBack={() => setMode('today')}
      />
    );
  }

  return (
    <TodayView
      plan={plan}
      flatDay={flatDay}
      dayIndex={dayIndex}
      totalDays={flat.length}
      sections={sectionViews}
      todaySection={todaySection}
      moduleInfo={MODULE_INFO}
      onStartStudy={() => navTo('study')}
      onMarkDone={advanceDay}
      onOpenSchedule={() => setMode('schedule')}
      onStartTest={startTest}
      onReviewModule={navToModule}
      onSwitchLevel={() => {
        if (
          window.confirm(
            'Switch level? Your schedule resets to the new path, but your card progress stays.',
          )
        ) {
          leaveLevel();
          setMode('today');
        }
      }}
    />
  );
}
