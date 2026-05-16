-- Missio initial schema (MVP). Enable RLS and policies in production.

create extension if not exists "pgcrypto";

-- Organizations (B2B)
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  website text,
  created_at timestamptz default now()
);

-- Students (can be anonymous pre-auth; link auth user later)
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  profile jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Programs published by orgs or curated
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  organization_id uuid references organizations (id) on delete set null,
  payload jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI / heuristic match results per student snapshot
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students (id) on delete cascade,
  program_id uuid references programs (id) on delete cascade,
  score numeric,
  reasons jsonb,
  warnings jsonb,
  created_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students (id) on delete cascade,
  program_id uuid references programs (id) on delete cascade,
  status text default 'draft',
  payload jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students (id) on delete cascade,
  program_id uuid references programs (id) on delete set null,
  channel text,
  body text,
  urgency text,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- Cache for /api/match (keyed by hash of profile + program ids)
create table if not exists match_cache (
  profile_hash text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);

create index if not exists idx_matches_student on matches (student_id);
create index if not exists idx_applications_student on applications (student_id);
create index if not exists idx_alerts_student on alerts (student_id);
