// Shared prop contracts for the learning-level view components. The orchestrator
// (Path.tsx) owns all store access and logic and passes plain data + callbacks
// down, so every component below is purely presentational and these interfaces
// are the single contract between them.

import type {
  LevelKey,
  SectionProgress,
  SectionTestAttempt,
  TestQuestion,
  TestQuestionResult,
  WeakModule,
} from '../../types';
import type { FlatDay, LevelPlan, LevelSection } from '../../data/levels';

// Lightweight per-module display info, resolved from the deck by the orchestrator.
export interface ModuleInfo {
  key: string;
  name: string;
  summary: string;
  tier: number;
  hasVideo: boolean;
  videoUrl?: string;
}

// A section paired with the learner's progress on it.
export interface SectionStatusView {
  section: LevelSection;
  status: SectionProgress;
}

export interface LevelPickerProps {
  levels: LevelPlan[];
  onChoose: (level: LevelKey) => void;
  onTakeDiagnostic: () => void;
}

export interface TodayViewProps {
  plan: LevelPlan;
  flatDay: FlatDay;
  dayIndex: number; // current 1-based pointer
  totalDays: number;
  sections: SectionStatusView[];
  todaySection?: LevelSection; // set when flatDay.sectionTestId is present
  moduleInfo: Record<string, ModuleInfo>;
  onStartStudy: () => void;
  onMarkDone: () => void;
  onOpenSchedule: () => void;
  onStartTest: (sectionId: string) => void;
  onReviewModule: (moduleKey: string) => void;
  onSwitchLevel: () => void;
}

export interface ScheduleOverviewProps {
  plan: LevelPlan;
  currentDayIndex: number;
  sections: SectionStatusView[];
  onBack: () => void;
}

export interface SectionTestRunnerProps {
  section: LevelSection;
  questions: TestQuestion[];
  onComplete: (results: TestQuestionResult[]) => void;
  onCancel: () => void;
}

export interface SectionTestResultsProps {
  section: LevelSection;
  attempt: SectionTestAttempt;
  weakModules: WeakModule[];
  moduleInfo: Record<string, ModuleInfo>;
  onReviewModule: (moduleKey: string) => void;
  onRetry: () => void;
  onContinue: () => void;
}
