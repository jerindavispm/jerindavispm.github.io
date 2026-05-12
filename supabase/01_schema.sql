-- ===========================================================================
-- Portfolio schema
-- Run this file FIRST in the Supabase SQL Editor.
-- Then run 02_seed.sql to populate initial content.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- profile  (singleton — exactly one row)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id          int  primary key default 1,
  name        text not null,
  first_name  text not null,
  last_name   text not null,
  role        text not null,
  location    text not null,
  status      text not null,
  blurb       text not null,
  email       text not null,
  phone       text not null,
  github      text not null,
  linkedin    text not null,
  updated_at  timestamptz default now(),
  constraint profile_singleton check (id = 1)
);

-- ---------------------------------------------------------------------------
-- nav_items
-- ---------------------------------------------------------------------------
create table if not exists public.nav_items (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  href        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists nav_items_sort_idx on public.nav_items(sort_order);

-- ---------------------------------------------------------------------------
-- experience
-- ---------------------------------------------------------------------------
create table if not exists public.experience (
  id          uuid primary key default gen_random_uuid(),
  role        text not null,
  company     text not null,
  type        text not null,
  duration    text not null,
  summary     text not null,
  highlights  text[] not null default '{}',
  tools       text[] not null default '{}',
  sort_order  int  not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists experience_sort_idx on public.experience(sort_order);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  tag         text not null,
  year        text not null,
  summary     text not null,
  role        text not null,
  stack       text[] not null default '{}',
  link        text,
  sort_order  int  not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists projects_sort_idx on public.projects(sort_order);

-- ---------------------------------------------------------------------------
-- skill_groups (parent) + skill_items (child)
-- ---------------------------------------------------------------------------
create table if not exists public.skill_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists skill_groups_sort_idx on public.skill_groups(sort_order);

create table if not exists public.skill_items (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.skill_groups(id) on delete cascade,
  label       text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists skill_items_group_idx on public.skill_items(group_id);
create index if not exists skill_items_sort_idx  on public.skill_items(sort_order);

-- ---------------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------------
create table if not exists public.certifications (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date_label  text not null,
  is_ongoing  boolean not null default false,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists certifications_sort_idx on public.certifications(sort_order);

-- ---------------------------------------------------------------------------
-- languages
-- ---------------------------------------------------------------------------
create table if not exists public.languages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists languages_sort_idx on public.languages(sort_order);

-- ---------------------------------------------------------------------------
-- education
-- ---------------------------------------------------------------------------
create table if not exists public.education (
  id          uuid primary key default gen_random_uuid(),
  school      text not null,
  degree      text not null,
  location    text,
  period      text,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);
create index if not exists education_sort_idx on public.education(sort_order);

-- ===========================================================================
-- Row Level Security
-- Public can READ everything. Only authenticated users can WRITE.
-- ===========================================================================

-- Enable RLS on every table
alter table public.profile        enable row level security;
alter table public.nav_items      enable row level security;
alter table public.experience     enable row level security;
alter table public.projects       enable row level security;
alter table public.skill_groups   enable row level security;
alter table public.skill_items    enable row level security;
alter table public.certifications enable row level security;
alter table public.languages      enable row level security;
alter table public.education      enable row level security;

-- Public read policies (anon role)
do $$
declare t text;
begin
  for t in select unnest(array[
    'profile','nav_items','experience','projects',
    'skill_groups','skill_items','certifications','languages','education'
  ]) loop
    execute format('drop policy if exists "%1$s_public_read" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_public_read" on public.%1$s for select to anon, authenticated using (true);',
      t
    );
  end loop;
end $$;

-- Authenticated write policies (insert/update/delete)
do $$
declare t text;
begin
  for t in select unnest(array[
    'profile','nav_items','experience','projects',
    'skill_groups','skill_items','certifications','languages','education'
  ]) loop
    execute format('drop policy if exists "%1$s_auth_insert" on public.%1$s;', t);
    execute format('drop policy if exists "%1$s_auth_update" on public.%1$s;', t);
    execute format('drop policy if exists "%1$s_auth_delete" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_auth_insert" on public.%1$s for insert to authenticated with check (true);',
      t
    );
    execute format(
      'create policy "%1$s_auth_update" on public.%1$s for update to authenticated using (true) with check (true);',
      t
    );
    execute format(
      'create policy "%1$s_auth_delete" on public.%1$s for delete to authenticated using (true);',
      t
    );
  end loop;
end $$;
