-- Required extension for UUID generation
create extension if not exists pgcrypto;

-- Profile table linked to Supabase auth user
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamp default now()
);

-- Workouts table
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  exercises jsonb not null default '[]'::jsonb,
  duration integer,
  created_at timestamp default now()
);

-- Progress tracking table
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  weight numeric not null,
  date date not null
);

create index if not exists idx_workouts_user_created_at on workouts(user_id, created_at desc);
create index if not exists idx_progress_user_date on progress(user_id, date desc);
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null,
  bio text,
  age integer,
  weight_kg decimal,
  height_cm decimal,
  goal text,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  exercise_name text not null,
  sets integer,
  reps integer,
  weight_kg decimal,
  notes text,
  workout_date date default current_date,
  created_at timestamp default now()
);

create table if not exists progress_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  weight_kg decimal,
  body_fat_percent decimal,
  chest_cm decimal,
  waist_cm decimal,
  hips_cm decimal,
  notes text,
  logged_at timestamp default now()
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text,
  category text,
  description text,
  instructions text
);
