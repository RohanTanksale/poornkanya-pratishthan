create table if not exists public.initiative_interests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  initiative_title text not null,
  consent boolean not null default false,
  created_at timestamptz not null default now(),

  constraint valid_contact_method
    check (
      nullif(trim(email), '') is not null
      or nullif(trim(phone), '') is not null
    ),

  constraint consent_required
    check (consent = true),

  constraint valid_name_length
    check (length(trim(full_name)) between 2 and 100),

  constraint valid_initiative_length
    check (length(initiative_title) between 2 and 200)
);

alter table public.initiative_interests
enable row level security;

grant insert on public.initiative_interests to anon, authenticated;

drop policy if exists "Allow visitors to submit initiative interest"
on public.initiative_interests;

create policy "Allow visitors to submit initiative interest"
on public.initiative_interests
for insert
to anon, authenticated
with check (
  consent = true
  and length(trim(full_name)) between 2 and 100
  and (
    nullif(trim(email), '') is not null
    or nullif(trim(phone), '') is not null
  )
  and length(initiative_title) between 2 and 200
);
