-- Track subscription changes for audit
create table if not exists public.subscription_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  event_type text not null, -- 'upgrade', 'downgrade', 'renewal', 'cancel'
  tier_from text,
  tier_to text,
  amount integer, -- in cents
  created_at timestamp default now()
);

alter table public.subscription_logs enable row level security;

create policy "Users can view their own logs"
  on public.subscription_logs for select
  using (auth.uid() = user_id);
