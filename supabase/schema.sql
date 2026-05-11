-- ============================================================
-- UniApply – Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor to set up the real backend
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles (extends Supabase auth.users) ───────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null,
  email         text not null,
  role          text not null check (role in ('student', 'recruiter', 'admin')),
  phone         text,
  nationality   text,
  dob           date,
  -- student-specific
  -- recruiter-specific
  agency        text,
  agency_country text,
  commission_rate numeric(5,2) default 10,
  approved      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-insert profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Programs ────────────────────────────────────────────────
create table public.programs (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  faculty     text not null,
  level       text not null check (level in ('Undergraduate', 'Postgraduate', 'Doctorate', 'Certificate')),
  duration    text,
  fee         numeric(10,2),
  currency    text default 'USD',
  intake      text,
  seats       int default 0,
  description text,
  requirements jsonb default '[]',
  active      boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── Applications ────────────────────────────────────────────
create table public.applications (
  id                 uuid primary key default uuid_generate_v4(),
  student_id         uuid references public.profiles(id),
  student_name       text not null,
  student_email      text not null,
  program_id         uuid references public.programs(id),
  program_name       text not null,
  recruiter_id       uuid references public.profiles(id),
  recruiter_name     text,
  status             text not null default 'submitted'
                       check (status in ('submitted','under_review','conditional','accepted','rejected','withdrawn')),
  personal_statement text,
  admin_notes        text,
  additional_info    jsonb,
  offer_letter_url   text,
  submitted_at       timestamptz default now(),
  updated_at         timestamptz default now()
);

-- ─── Documents ───────────────────────────────────────────────
create table public.documents (
  id             uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications(id) on delete cascade,
  name           text not null,
  type           text not null,
  storage_path   text,        -- Supabase Storage path
  size           bigint,
  uploaded_at    timestamptz default now()
);

-- ─── Commissions ─────────────────────────────────────────────
create table public.commissions (
  id             uuid primary key default uuid_generate_v4(),
  recruiter_id   uuid references public.profiles(id),
  recruiter_name text not null,
  application_id uuid references public.applications(id),
  student_name   text not null,
  program_name   text not null,
  program_fee    numeric(10,2),
  rate           numeric(5,2) default 10,
  amount         numeric(10,2),
  status         text not null default 'pending'
                   check (status in ('pending','approved','paid','cancelled')),
  paid_at        timestamptz,
  created_at     timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────

alter table public.profiles     enable row level security;
alter table public.programs      enable row level security;
alter table public.applications  enable row level security;
alter table public.documents     enable row level security;
alter table public.commissions   enable row level security;

-- PROFILES: users can read/update their own profile; admins can read all
create policy "users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "admins can view all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- PROGRAMS: anyone can read; only admins can write
create policy "anyone can view active programs"
  on public.programs for select using (active = true);

create policy "admins can manage programs"
  on public.programs for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- APPLICATIONS: students see own; recruiters see theirs; admins see all
create policy "students see own applications"
  on public.applications for select using (student_id = auth.uid());

create policy "recruiters see their applications"
  on public.applications for select using (recruiter_id = auth.uid());

create policy "admins see all applications"
  on public.applications for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "students can insert applications"
  on public.applications for insert with check (student_id = auth.uid());

create policy "recruiters can insert applications"
  on public.applications for insert with check (recruiter_id = auth.uid());

-- COMMISSIONS: recruiters see own; admins manage all
create policy "recruiters see own commissions"
  on public.commissions for select using (recruiter_id = auth.uid());

create policy "admins manage commissions"
  on public.commissions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─── Seed data (sample programs) ─────────────────────────────
insert into public.programs (name, faculty, level, duration, fee, intake, seats, description, requirements) values
('Computer Science (BSc)', 'Engineering & Technology', 'Undergraduate', '4 Years', 15000, 'September 2025', 120,
 'A rigorous program covering algorithms, software engineering, AI, and systems design.',
 '["High School Diploma", "Math & Science A-level", "IELTS 6.5+"]'),
('Business Administration (MBA)', 'Business School', 'Postgraduate', '2 Years', 22000, 'January 2026', 80,
 'Develop strategic leadership skills with concentrations in Finance, Marketing, or Operations.',
 '["Bachelor''s Degree", "GMAT 550+", "IELTS 7.0+", "2 Years Work Experience"]'),
('Data Science & Analytics (MSc)', 'Engineering & Technology', 'Postgraduate', '18 Months', 18000, 'September 2025', 60,
 'Master machine learning, big data technologies, and statistical modelling.',
 '["Bachelor''s in CS/Math/Stats", "Python proficiency", "IELTS 6.5+"]');

-- ─── Storage Bucket ───────────────────────────────────────────
-- Run in Supabase Dashboard → Storage:
-- 1. Create bucket: "documents"  (private)
-- 2. Add policy: allow authenticated users to upload to own folder
--    INSERT policy: auth.uid()::text = (storage.foldername(name))[1]
