// Read/write a user's progress snapshot to the Supabase `progress` table.
//
// One row per user, keyed by auth user id, holding the whole snapshot as JSON.
// Row Level Security (see supabase/migrations/0001_progress.sql) guarantees a
// user can only ever read or write their own row, so the anon key in the
// browser is safe.

import { supabase } from '../../lib/supabase';
import type { Snapshot } from '../../store/store';

const TABLE = 'progress';

// Returns the stored snapshot, or null if the user has never synced before.
export async function pullSnapshot(userId: string): Promise<Snapshot | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select('snapshot')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.snapshot as Snapshot | undefined) ?? null;
}

// Upserts the user's snapshot. Resolves when the write is acknowledged.
export async function pushSnapshot(userId: string, snapshot: Snapshot): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      snapshot,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (error) throw error;
}
