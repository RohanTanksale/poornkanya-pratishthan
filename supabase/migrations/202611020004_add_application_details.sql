alter table public.membership_applications
  add column if not exists age smallint,
  add column if not exists education text,
  add column if not exists interests text,
  add column if not exists experience text,
  add column if not exists availability text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'membership_applications_age_range'
      and conrelid = 'public.membership_applications'::regclass
  ) then
    alter table public.membership_applications
      add constraint membership_applications_age_range
      check (age is null or age between 15 and 25);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'membership_applications_education_length'
      and conrelid = 'public.membership_applications'::regclass
  ) then
    alter table public.membership_applications
      add constraint membership_applications_education_length
      check (education is null or char_length(education) <= 150);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'membership_applications_interests_length'
      and conrelid = 'public.membership_applications'::regclass
  ) then
    alter table public.membership_applications
      add constraint membership_applications_interests_length
      check (interests is null or char_length(interests) <= 1000);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'membership_applications_experience_length'
      and conrelid = 'public.membership_applications'::regclass
  ) then
    alter table public.membership_applications
      add constraint membership_applications_experience_length
      check (experience is null or char_length(experience) <= 1000);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'membership_applications_availability_length'
      and conrelid = 'public.membership_applications'::regclass
  ) then
    alter table public.membership_applications
      add constraint membership_applications_availability_length
      check (availability is null or char_length(availability) <= 500);
  end if;
end
$$;
