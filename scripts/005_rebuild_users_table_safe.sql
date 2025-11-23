-- Drop the existing users table and recreate with safe RLS policies
drop table if exists public.users cascade;

-- Recreate users table with safe RLS (no recursive queries)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  is_premium boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_tier text default 'free', -- 'free', 'premium', 'team'
  team_seats integer default 1,
  trial_ends_at timestamp,
  is_admin boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.users enable row level security;

-- Simple policy: Users can only view their own data
-- No recursive queries - just check the id directly
create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- Users can update their own data
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id);

-- Users can insert their own profile on signup
create policy "Users can insert own profile"
  on public.users
  for insert
  with check (auth.uid() = id);

-- Note: For admin operations (viewing/updating other users),
-- use the Supabase service role key from the backend/API routes
-- This bypasses RLS and is safe when called from authenticated backends only
