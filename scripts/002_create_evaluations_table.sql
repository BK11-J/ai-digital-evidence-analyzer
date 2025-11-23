-- Create evaluations table for tracking user runs
create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  status text default 'pending', -- pending, running, completed, failed
  file_path text,
  models jsonb,
  metrics jsonb,
  results jsonb,
  is_large_job boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table public.evaluations enable row level security;

create policy "Users can view their own evaluations"
  on public.evaluations for select
  using (auth.uid() = user_id);

create policy "Users can create evaluations"
  on public.evaluations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own evaluations"
  on public.evaluations for update
  using (auth.uid() = user_id);
