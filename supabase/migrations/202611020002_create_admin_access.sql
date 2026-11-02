create table if not exists public.admin_access (
  email text primary key check (
    char_length(email) between 3 and 254
    and email = lower(btrim(email))
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  granted_by text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_access enable row level security;
revoke all on public.admin_access from public, anon, authenticated;
grant all on public.admin_access to service_role;
