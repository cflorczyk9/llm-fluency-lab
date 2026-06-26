// Usage analytics, signed-in only.
//
// `track()` appends one row to the Supabase `events` table. It is fire-and-
// forget: it never blocks the UI and never throws into it. It no-ops entirely
// unless cloud sync is configured AND a user is signed in, so a local-first,
// signed-out visitor generates no events at all (by design — see
// supabase/migrations/0002_events.sql).
//
// The signed-in user id is cached here and kept current by the auth listener in
// useCloudSync (setAnalyticsUserId), so track() stays synchronous and cheap.

import { supabase } from '../../lib/supabase';

export type EventType =
  | 'view_opened' // a tab / view was navigated to
  | 'module_opened' // a Learn module was expanded
  | 'card_graded' // a card was graded in Study
  | 'video_opened' // a lesson/card video link was opened
  | 'diagnostic_completed' // the placement test was finished
  | 'level_selected' // a learning level was chosen
  | 'section_test_started' // a section test was started
  | 'section_test_completed' // a section test was finished (pass or fail)
  | 'remediation_opened'; // the "study these" gap-analysis screen was viewed

let currentUserId: string | null = null;

// Called by the auth listener when the session changes.
export function setAnalyticsUserId(id: string | null): void {
  currentUserId = id;
}

export function track(eventType: EventType, payload: Record<string, unknown> = {}): void {
  if (!supabase || !currentUserId) return;
  void supabase
    .from('events')
    .insert({ user_id: currentUserId, event_type: eventType, payload })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn(`[analytics] ${eventType} insert failed:`, error.message);
      }
    });
}
