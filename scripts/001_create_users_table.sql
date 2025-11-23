-- Create users table extending Supabase auth
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  is_premium boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_tier text, -- 'free', 'premium', 'team'
  team_seats integer default 1,
  trial_ends_at timestamp,
  is_admin boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.users enable row level security;

-- Users can view/update their own data
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert their own data"
  on public.users for insert
  with check (auth.uid() = id);

-- Admins can view all users
create policy "Admins can view all users"
  on public.users for select
  using (
    auth.uid() in (select id from public.users where is_admin = true)
  );
