-- ===========================================================================
-- Migration: hero_meta — the 4-cell strip below the hero
-- Run this once in the Supabase SQL Editor.
-- ===========================================================================

create table if not exists public.hero_meta (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  value       text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists hero_meta_sort_idx on public.hero_meta(sort_order);

alter table public.hero_meta enable row level security;

drop policy if exists "hero_meta_public_read"  on public.hero_meta;
drop policy if exists "hero_meta_auth_insert"  on public.hero_meta;
drop policy if exists "hero_meta_auth_update"  on public.hero_meta;
drop policy if exists "hero_meta_auth_delete"  on public.hero_meta;

create policy "hero_meta_public_read"
  on public.hero_meta for select
  to anon, authenticated using (true);

create policy "hero_meta_auth_insert"
  on public.hero_meta for insert
  to authenticated with check (true);

create policy "hero_meta_auth_update"
  on public.hero_meta for update
  to authenticated using (true) with check (true);

create policy "hero_meta_auth_delete"
  on public.hero_meta for delete
  to authenticated using (true);

-- Seed (safe to re-run: clears then re-inserts)
delete from public.hero_meta;
insert into public.hero_meta (label, value, sort_order) values
  ('Currently',  'BCA · Year 3',  1),
  ('Focus',      'ERP & process', 2),
  ('Internship', 'UPDOT',         3),
  ('Based in',   'Bangalore',     4);

-- Refresh PostgREST so the new table is reachable via the REST API
notify pgrst, 'reload schema';
