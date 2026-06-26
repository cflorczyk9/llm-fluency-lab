// Snapshot merge for cloud sync.
//
// When a user logs in on a device, we must reconcile the progress already on
// that device (local) with whatever is in the cloud (remote) WITHOUT losing
// either. A naive "remote wins" or "local wins" would silently wipe out study
// done on the other device. So we merge field by field, always keeping the more
// advanced / more recent record:
//
//   cardStates  per card id, keep the state reviewed most recently
//               (later lastReview wins; ties break toward more reps)
//   dailyLog    per date, keep the entry with more reviews
//   lessons     per key, keep the earliest startedAt (when you began it)
//   diagnostic  keep the most recently completed one
//   program     keep the most recently created plan
//   settings    keep the local device's settings (you're actively on it)
//
// The result is order-independent and idempotent: merge(a, b) and merge(b, a)
// produce the same progress, and merging a snapshot with itself is a no-op.

import type { Snapshot } from '../../store/store';
import type {
  CardState,
  DailyLogEntry,
  DiagnosticResult,
  ProgramPlan,
} from '../../types';

function reviewedAt(s: CardState): number {
  return s.lastReview ?? -Infinity;
}

// More-progressed card wins: most recently reviewed, then most reps.
function pickCardState(a: CardState, b: CardState): CardState {
  const ta = reviewedAt(a);
  const tb = reviewedAt(b);
  if (ta !== tb) return ta > tb ? a : b;
  return a.reps >= b.reps ? a : b;
}

function mergeCardStates(
  a: Record<string, CardState>,
  b: Record<string, CardState>,
): Record<string, CardState> {
  const out: Record<string, CardState> = { ...a };
  for (const [id, state] of Object.entries(b)) {
    const existing = out[id];
    out[id] = existing ? pickCardState(existing, state) : state;
  }
  return out;
}

function mergeDailyLog(a: DailyLogEntry[], b: DailyLogEntry[]): DailyLogEntry[] {
  const byDate = new Map<string, DailyLogEntry>();
  for (const entry of [...a, ...b]) {
    const existing = byDate.get(entry.date);
    // More reviews on a given day is the better record of that day's work.
    if (!existing || entry.reviews > existing.reviews) byDate.set(entry.date, entry);
  }
  return [...byDate.values()].sort((x, y) => x.date.localeCompare(y.date));
}

function mergeLessons(
  a: Record<string, { startedAt?: number }>,
  b: Record<string, { startedAt?: number }>,
): Record<string, { startedAt?: number }> {
  const out: Record<string, { startedAt?: number }> = { ...a };
  for (const [key, val] of Object.entries(b)) {
    const existing = out[key];
    if (!existing) {
      out[key] = val;
      continue;
    }
    const earliest = Math.min(
      existing.startedAt ?? Infinity,
      val.startedAt ?? Infinity,
    );
    out[key] = { startedAt: Number.isFinite(earliest) ? earliest : undefined };
  }
  return out;
}

function pickLater<T>(
  a: T | null,
  b: T | null,
  stamp: (v: T) => number,
): T | null {
  if (!a) return b;
  if (!b) return a;
  return stamp(a) >= stamp(b) ? a : b;
}

export function mergeSnapshots(local: Snapshot, remote: Snapshot): Snapshot {
  return {
    cardStates: mergeCardStates(local.cardStates, remote.cardStates),
    dailyLog: mergeDailyLog(local.dailyLog, remote.dailyLog),
    lessons: mergeLessons(local.lessons, remote.lessons),
    diagnostic: pickLater<DiagnosticResult>(
      local.diagnostic,
      remote.diagnostic,
      (d) => d.completedAt,
    ),
    program: pickLater<ProgramPlan>(
      local.program,
      remote.program,
      (p) => p.createdAt,
    ),
    // You're actively on the local device; its settings win.
    settings: local.settings,
  };
}
