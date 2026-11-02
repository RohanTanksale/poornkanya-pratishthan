create table if not exists public.leadership_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(btrim(name)) between 1 and 100),
  role text not null check (role in (
    'President',
    'Vice President',
    'Working President',
    'Secretary',
    'Joint Secretary',
    'Treasurer',
    'Joint Treasurer',
    'Outreach Coordinator'
  )),
  photo_src text check (
    photo_src is null or (
      char_length(photo_src) <= 300
      and photo_src ~* '^/images/([A-Za-z0-9._-]+/)*[A-Za-z0-9._-]+\.(avif|gif|jpe?g|png|webp)$'
    )
  ),
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.leadership_members enable row level security;
revoke all on public.leadership_members from public, anon, authenticated;
grant all on public.leadership_members to service_role;

insert into public.leadership_members (name, role, display_order)
values
  ('Bhavana Ramnath Iyer', 'President', 1),
  ('Rasika Hemant Joshi', 'Vice President', 2),
  ('Sadhana Dnyanesh Sudame', 'Working President', 3),
  ('Avani Shinde', 'Secretary', 4),
  ('Kimaya Paithankar', 'Joint Secretary', 5),
  ('Kasturi Joshi', 'Treasurer', 6),
  ('Ishani Kulkarni', 'Joint Treasurer', 7),
  ('Nishigandha Thadave', 'Outreach Coordinator', 8),
  ('Sampada Parnerkar', 'Outreach Coordinator', 9)
on conflict (name) do nothing;
