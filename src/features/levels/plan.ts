// Bridges a learning level into the rest of the app.
//
// buildPlanFromLevel emits a ProgramPlan whose `path` is the level's module
// order, so the EXISTING Study scheduler/queue (which already orders new cards
// by program.path) drives intake for free — no scheduler changes. The other
// helpers manage section unlock state and locate "today" in the schedule.

import type {
  LevelEnrollment,
  ProgramPlan,
  SectionProgress,
} from '../../types';
import {
  flattenSchedule,
  type LevelPlan,
  type LevelSection,
} from '../../data/levels';

const DAY_MS = 24 * 60 * 60 * 1000;

function ymd(now: number): string {
  const d = new Date(now);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Average new-cards-per-learn-day across the schedule, used as the daily cap so
// Study's intake matches the plan's pace.
export function dailyNewTarget(plan: LevelPlan): number {
  const loads = flattenSchedule(plan)
    .map((d) => d.newCards)
    .filter((n) => n > 0);
  if (loads.length === 0) return 5;
  const avg = loads.reduce((a, b) => a + b, 0) / loads.length;
  return Math.max(3, Math.round(avg));
}

export function buildPlanFromLevel(plan: LevelPlan, now: number): ProgramPlan {
  const target = dailyNewTarget(plan);
  return {
    createdAt: now,
    targetDate: now + plan.totalWeeks * 7 * DAY_MS,
    path: [...plan.moduleKeys],
    dailyNewTarget: target,
    dailyReviewEstimate: target * 4,
    requestRetention: 0.9,
    seededKnown: [],
    rationale: plan.blurb,
  };
}

// Fresh enrollment: first section available, the rest locked.
export function initialEnrollment(plan: LevelPlan, now: number): LevelEnrollment {
  const sectionProgress: Record<string, SectionProgress> = {};
  plan.sections.forEach((s, i) => {
    sectionProgress[s.id] = {
      sectionId: s.id,
      status: i === 0 ? 'available' : 'locked',
      attempts: 0,
    };
  });
  return {
    level: plan.level,
    startedAt: now,
    anchorDate: ymd(now),
    currentDayIndex: 1,
    sectionProgress,
    attempts: [],
  };
}

export function nextSectionId(plan: LevelPlan, sectionId: string): string | null {
  const i = plan.sections.findIndex((s) => s.id === sectionId);
  if (i < 0 || i + 1 >= plan.sections.length) return null;
  return plan.sections[i + 1].id;
}

// Section status with a safe default for sections not yet recorded.
export function statusOf(
  enrollment: LevelEnrollment,
  sectionId: string,
): SectionProgress {
  return (
    enrollment.sectionProgress[sectionId] ?? {
      sectionId,
      status: 'locked',
      attempts: 0,
    }
  );
}

// The section a schedule day's test belongs to, if it is a test day.
export function testSectionForDay(
  plan: LevelPlan,
  sectionTestId: string | undefined,
): LevelSection | undefined {
  if (!sectionTestId) return undefined;
  return plan.sections.find((s) => s.id === sectionTestId);
}
