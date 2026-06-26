-- Progress sync for LLM Fluency Lab.
--
-- One row per user holds that user's entire study snapshot (card scheduling,
-- diagnostic, program, lessons, daily log, settings) as JSON. Row Level
-- Security makes the table self-serve from the browser with the public anon
-- key: every policy is scoped to auth.uid(), so a signed-in user can only ever
-- read or write their own row and never anyone else's.
--
-- Apply this in the Supabase dashboard SQL editor, or with the Supabase CLI
-- (`supabase db push`), once per project.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  snapshot   jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- A user may read only their own row.
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
  on public.progress for select
  using (auth.uid() = user_id);

-- A user may insert only a row keyed to themselves.
drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
  on public.progress for insert
  with check (auth.uid() = user_id);

-- A user may update only their own row.
drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- A user may delete only their own row.
drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own"
  on public.progress for delete
  using (auth.uid() = user_id);
