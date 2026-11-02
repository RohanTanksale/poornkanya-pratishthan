create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (
    char_length(email) between 3 and 254
    and email = lower(btrim(email))
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  phone text not null check (char_length(phone) between 7 and 25),
  city text not null check (char_length(btrim(city)) between 1 and 100),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  status text not null default 'pending' check (
    status in ('pending', 'reviewed', 'accepted', 'declined')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.membership_applications enable row level security;
revoke all on public.membership_applications from public, anon, authenticated;
grant all on public.membership_applications to service_role;
