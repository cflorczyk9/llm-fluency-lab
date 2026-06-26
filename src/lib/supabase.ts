// Supabase client, created lazily from Vite env vars.
//
// Cloud sync is OPTIONAL. If the two env vars are absent (the default for a
// plain local checkout), `supabase` is null and `isSupabaseConfigured` is
// false. Every caller must handle that case so the app stays fully usable
// local-first with no backend, exactly as it was before auth was added.
//
// Set these in `.env` (see `.env.example`) for local dev, and in the host's
// environment (e.g. Netlify) for production:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// The anon key is a public, browser-safe key. Row Level Security (see
// supabase/migrations) is what actually protects each user's data.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
