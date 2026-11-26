-- =====================================
-- TODOS TABLE (Supabase SQL Editor mein run karein)
-- =====================================
create table if not exists todos (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================
-- RLS: har user sirf apne todos dekhe / badle
-- =====================================
alter table todos enable row level security;

create policy "own select" on todos for select using (auth.uid() = user_id);
create policy "own insert" on todos for insert with check (auth.uid() = user_id);
create policy "own update" on todos for update using (auth.uid() = user_id);
create policy "own delete" on todos for delete using (auth.uid() = user_id);
