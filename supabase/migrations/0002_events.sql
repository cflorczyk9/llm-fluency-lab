-- Usage analytics for LLM Fluency Lab (signed-in users only).
--
-- An append-only event log: one row per tracked interaction (a tab opened, a
-- card graded, a video opened, a module opened, the diagnostic finished). Each
-- row is tied to the signed-in user. Row Level Security lets a user insert and
-- read only their own events; you (the project owner) aggregate across all
-- users from the dashboard with the service role, which bypasses RLS.
--
-- Why signed-in only: the app is local-first and most visitors never sign in,
-- so there is deliberately no anonymous tracking here. Only people who opted
-- into an account generate events.
--
-- Example owner queries (run in the Supabase SQL editor):
--   -- most-opened modules
--   select payload->>'key' as module, count(*) from events
--     where event_type = 'module_opened' group by 1 order by 2 desc;
--   -- hardest cards (most "again" grades)
--   select payload->>'cardId' as card, count(*) from events
--     where event_type = 'card_graded' and payload->>'rating' = 'again'
--     group by 1 order by 2 desc limit 20;
--   -- most-visited tabs
--   select payload->>'view' as view, count(*) from events
--     where event_type = 'view_opened' group by 1 order by 2 desc;

create table if not exists public.events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  event_type text not null,
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_user_created_idx
  on public.events (user_id, created_at desc);
create index if not exists events_type_idx
  on public.events (event_type);

alter table public.events enable row level security;

-- A user may append only events keyed to themselves.
drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own"
  on public.events for insert
  with check (auth.uid() = user_id);

-- A user may read only their own events. (Owner-side aggregation uses the
-- service role, which bypasses RLS.)
drop policy if exists "events_select_own" on public.events;
create policy "events_select_own"
  on public.events for select
  using (auth.uid() = user_id);
