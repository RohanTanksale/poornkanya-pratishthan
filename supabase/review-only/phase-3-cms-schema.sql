-- REVIEW-ONLY PROPOSAL — NOT A MIGRATION.
-- Do not run this file against local, staging, or production Supabase.
-- First inspect the actual target schema, migration history, RLS, grants,
-- extensions, backups, rollback plan, and owner approvals.
--
-- This proposal reuses public.leadership_members and
-- public.membership_applications without altering either table.
-- Contact-enquiry persistence remains conditional on an owner decision.
-- Storage bucket creation and object policies are deliberately not included.

begin;

create function public.cms_phase3_set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.cms_phase3_set_updated_at() from public, anon, authenticated;

create table public.cms_media_assets (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'branding', 'leadership', 'programmes', 'events', 'gallery',
    'branches', 'documents', 'other'
  )),
  storage_bucket text not null check (char_length(btrim(storage_bucket)) between 1 and 100),
  object_key text not null check (char_length(btrim(object_key)) between 1 and 700),
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  mime_type text not null check (mime_type in (
    'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm', 'application/pdf'
  )),
  byte_size bigint not null check (byte_size between 1 and 52428800),
  width integer check (width is null or width between 1 and 50000),
  height integer check (height is null or height between 1 and 50000),
  alt_text text not null default '' check (char_length(alt_text) <= 500),
  caption text check (caption is null or char_length(caption) <= 2000),
  visibility text not null default 'private'
    check (visibility in ('private', 'public')),
  asset_state text not null default 'ready'
    check (asset_state in ('processing', 'ready', 'archived')),
  uploaded_by text not null check (char_length(uploaded_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint cms_media_assets_object_unique unique (storage_bucket, object_key),
  constraint cms_media_assets_video_dimensions check (
    mime_type not like 'video/%' or (width is null and height is null)
  )
);

create table public.site_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null check (page_key in (
    'home', 'about', 'vision', 'privacy', 'terms'
  )),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content) = 'object'),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  publish_at timestamptz,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (
    seo_description is null or char_length(seo_description) <= 180
  ),
  canonical_url text check (
    canonical_url is null or (
      char_length(canonical_url) <= 2048
      and canonical_url ~ '^https://'
    )
  ),
  og_title text check (og_title is null or char_length(og_title) <= 100),
  og_description text check (
    og_description is null or char_length(og_description) <= 300
  ),
  social_image_id uuid references public.cms_media_assets(id) on delete set null,
  created_by text not null check (char_length(created_by) between 3 and 254),
  updated_by text not null check (char_length(updated_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint site_pages_page_key_unique unique (page_key)
);

create unique index site_pages_slug_live_unique
  on public.site_pages (slug)
  where deleted_at is null;

create index site_pages_publication_idx
  on public.site_pages (publication_status, publish_at)
  where deleted_at is null;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 20000),
  category text check (category is null or char_length(category) <= 100),
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text check (timezone is null or char_length(timezone) <= 100),
  venue text check (venue is null or char_length(venue) <= 180),
  location text check (location is null or char_length(location) <= 500),
  registration_url text check (
    registration_url is null or (
      char_length(registration_url) <= 2048
      and registration_url ~ '^https://'
    )
  ),
  registration_deadline timestamptz,
  event_status text not null default 'scheduled'
    check (event_status in ('scheduled', 'postponed', 'cancelled', 'completed')),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  publish_at timestamptz,
  featured boolean not null default false,
  display_order integer not null default 0,
  cover_media_id uuid references public.cms_media_assets(id) on delete set null,
  report text check (report is null or char_length(report) <= 30000),
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (
    seo_description is null or char_length(seo_description) <= 180
  ),
  canonical_url text check (
    canonical_url is null or (
      char_length(canonical_url) <= 2048
      and canonical_url ~ '^https://'
    )
  ),
  og_title text check (og_title is null or char_length(og_title) <= 100),
  og_description text check (
    og_description is null or char_length(og_description) <= 300
  ),
  social_image_id uuid references public.cms_media_assets(id) on delete set null,
  created_by text not null check (char_length(created_by) between 3 and 254),
  updated_by text not null check (char_length(updated_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint events_dates_ordered check (
    ends_at is null or starts_at is null or ends_at >= starts_at
  ),
  constraint events_registration_deadline check (
    registration_deadline is null
    or starts_at is null
    or registration_deadline <= starts_at
  ),
  constraint events_publish_requires_start check (
    publication_status <> 'published'
    or (starts_at is not null and char_length(btrim(description)) > 0)
  )
);

create unique index events_slug_live_unique
  on public.events (slug)
  where deleted_at is null;

create index events_public_upcoming_idx
  on public.events (starts_at asc, display_order asc)
  where publication_status = 'published' and deleted_at is null;

create index events_admin_status_idx
  on public.events (publication_status, event_status, starts_at desc)
  where deleted_at is null;

create table public.event_agenda_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 180),
  description text check (description is null or char_length(description) <= 4000),
  presenter text check (presenter is null or char_length(presenter) <= 180),
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_agenda_dates_ordered check (
    ends_at is null or starts_at is null or ends_at >= starts_at
  ),
  constraint event_agenda_event_order_unique unique (event_id, display_order)
);

create index event_agenda_event_idx
  on public.event_agenda_items (event_id, display_order);

create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '' check (char_length(description) <= 20000),
  category text check (category is null or char_length(category) <= 100),
  objectives jsonb not null default '[]'::jsonb
    check (jsonb_typeof(objectives) = 'array'),
  activities jsonb not null default '[]'::jsonb
    check (jsonb_typeof(activities) = 'array'),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  publish_at timestamptz,
  display_order integer not null default 0,
  featured boolean not null default false,
  cover_media_id uuid references public.cms_media_assets(id) on delete set null,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (
    seo_description is null or char_length(seo_description) <= 180
  ),
  canonical_url text check (
    canonical_url is null or (
      char_length(canonical_url) <= 2048
      and canonical_url ~ '^https://'
    )
  ),
  og_title text check (og_title is null or char_length(og_title) <= 100),
  og_description text check (
    og_description is null or char_length(og_description) <= 300
  ),
  social_image_id uuid references public.cms_media_assets(id) on delete set null,
  created_by text not null check (char_length(created_by) between 3 and 254),
  updated_by text not null check (char_length(updated_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index programmes_slug_live_unique
  on public.programmes (slug)
  where deleted_at is null;

create index programmes_public_order_idx
  on public.programmes (display_order, title)
  where publication_status = 'published' and deleted_at is null;

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  content text not null check (char_length(btrim(content)) between 1 and 10000),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  publish_at timestamptz,
  expires_at timestamptz,
  display_order integer not null default 0,
  featured boolean not null default false,
  created_by text not null check (char_length(created_by) between 3 and 254),
  updated_by text not null check (char_length(updated_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint announcements_expiry_after_publish check (
    expires_at is null or publish_at is null or expires_at > publish_at
  )
);

create unique index announcements_slug_live_unique
  on public.announcements (slug)
  where deleted_at is null;

create index announcements_public_schedule_idx
  on public.announcements (publish_at, expires_at, display_order)
  where publication_status = 'published' and deleted_at is null;

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text check (description is null or char_length(description) <= 5000),
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  publish_at timestamptz,
  display_order integer not null default 0,
  cover_media_id uuid references public.cms_media_assets(id) on delete set null,
  created_by text not null check (char_length(created_by) between 3 and 254),
  updated_by text not null check (char_length(updated_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index gallery_albums_slug_live_unique
  on public.gallery_albums (slug)
  where deleted_at is null;

create index gallery_albums_public_order_idx
  on public.gallery_albums (display_order, created_at desc)
  where publication_status = 'published' and deleted_at is null;

create table public.gallery_album_media (
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  media_id uuid not null references public.cms_media_assets(id) on delete restrict,
  display_order integer not null default 0,
  caption text check (caption is null or char_length(caption) <= 2000),
  alt_text text not null default '' check (char_length(alt_text) <= 500),
  created_at timestamptz not null default now(),
  primary key (album_id, media_id),
  constraint gallery_album_media_order_unique unique (album_id, display_order)
);

create index gallery_album_media_order_idx
  on public.gallery_album_media (album_id, display_order);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  state text check (state is null or char_length(state) <= 100),
  city text check (city is null or char_length(city) <= 100),
  address text check (address is null or char_length(address) <= 2000),
  coordinator text check (coordinator is null or char_length(coordinator) <= 180),
  contact_email text check (
    contact_email is null or char_length(contact_email) between 3 and 254
  ),
  contact_phone text check (
    contact_phone is null or char_length(contact_phone) between 7 and 25
  ),
  description text check (description is null or char_length(description) <= 5000),
  image_media_id uuid references public.cms_media_assets(id) on delete set null,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  publish_at timestamptz,
  display_order integer not null default 0,
  created_by text not null check (char_length(created_by) between 3 and 254),
  updated_by text not null check (char_length(updated_by) between 3 and 254),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index branches_slug_live_unique
  on public.branches (slug)
  where deleted_at is null;

create index branches_public_order_idx
  on public.branches (display_order, name)
  where publication_status = 'published' and deleted_at is null;

-- Persist this table only if the owner approves a database-backed contact inbox.
create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  subject text not null check (char_length(btrim(subject)) between 1 and 180),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  enquiry_status text not null default 'unread'
    check (enquiry_status in ('unread', 'read', 'closed')),
  received_at timestamptz not null default now(),
  read_at timestamptz,
  closed_at timestamptz,
  retention_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_enquiries_retention_after_creation check (
    retention_expires_at > received_at
  )
);

create index contact_enquiries_inbox_idx
  on public.contact_enquiries (enquiry_status, received_at desc);

create index contact_enquiries_retention_idx
  on public.contact_enquiries (retention_expires_at);

create table public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_email text not null check (char_length(actor_email) between 3 and 254),
  action text not null check (char_length(action) between 1 and 100),
  entity_type text not null check (char_length(entity_type) between 1 and 100),
  entity_id uuid,
  occurred_at timestamptz not null default now(),
  request_id uuid,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object')
);

create index admin_audit_log_time_idx
  on public.admin_audit_log (occurred_at desc);

create index admin_audit_log_actor_time_idx
  on public.admin_audit_log (actor_email, occurred_at desc);

create index admin_audit_log_entity_idx
  on public.admin_audit_log (entity_type, entity_id, occurred_at desc);

create trigger site_pages_set_updated_at
before update on public.site_pages
for each row execute function public.cms_phase3_set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.cms_phase3_set_updated_at();

create trigger event_agenda_items_set_updated_at
before update on public.event_agenda_items
for each row execute function public.cms_phase3_set_updated_at();

create trigger programmes_set_updated_at
before update on public.programmes
for each row execute function public.cms_phase3_set_updated_at();

create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.cms_phase3_set_updated_at();

create trigger gallery_albums_set_updated_at
before update on public.gallery_albums
for each row execute function public.cms_phase3_set_updated_at();

create trigger cms_media_assets_set_updated_at
before update on public.cms_media_assets
for each row execute function public.cms_phase3_set_updated_at();

create trigger branches_set_updated_at
before update on public.branches
for each row execute function public.cms_phase3_set_updated_at();

create trigger contact_enquiries_set_updated_at
before update on public.contact_enquiries
for each row execute function public.cms_phase3_set_updated_at();

alter table public.cms_media_assets enable row level security;
alter table public.site_pages enable row level security;
alter table public.events enable row level security;
alter table public.event_agenda_items enable row level security;
alter table public.programmes enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_album_media enable row level security;
alter table public.branches enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.admin_audit_log enable row level security;

revoke all on table
  public.cms_media_assets,
  public.site_pages,
  public.events,
  public.event_agenda_items,
  public.programmes,
  public.announcements,
  public.gallery_albums,
  public.gallery_album_media,
  public.branches,
  public.contact_enquiries,
  public.admin_audit_log
from public, anon, authenticated;

grant select on table
  public.cms_media_assets,
  public.site_pages,
  public.events,
  public.event_agenda_items,
  public.programmes,
  public.announcements,
  public.gallery_albums,
  public.gallery_album_media,
  public.branches
to anon, authenticated;

grant all on table
  public.cms_media_assets,
  public.site_pages,
  public.events,
  public.event_agenda_items,
  public.programmes,
  public.announcements,
  public.gallery_albums,
  public.gallery_album_media,
  public.branches,
  public.contact_enquiries,
  public.admin_audit_log
to service_role;

create policy cms_media_assets_public_read
on public.cms_media_assets for select to anon, authenticated
using (
  visibility = 'public'
  and asset_state = 'ready'
  and deleted_at is null
);

create policy site_pages_public_read
on public.site_pages for select to anon, authenticated
using (
  publication_status = 'published'
  and (publish_at is null or publish_at <= now())
  and deleted_at is null
);

create policy events_public_read
on public.events for select to anon, authenticated
using (
  publication_status = 'published'
  and (publish_at is null or publish_at <= now())
  and deleted_at is null
);

create policy event_agenda_public_read
on public.event_agenda_items for select to anon, authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_agenda_items.event_id
      and e.publication_status = 'published'
      and (e.publish_at is null or e.publish_at <= now())
      and e.deleted_at is null
  )
);

create policy programmes_public_read
on public.programmes for select to anon, authenticated
using (
  publication_status = 'published'
  and (publish_at is null or publish_at <= now())
  and deleted_at is null
);

create policy announcements_public_read
on public.announcements for select to anon, authenticated
using (
  publication_status = 'published'
  and (publish_at is null or publish_at <= now())
  and (expires_at is null or expires_at > now())
  and deleted_at is null
);

create policy gallery_albums_public_read
on public.gallery_albums for select to anon, authenticated
using (
  publication_status = 'published'
  and (publish_at is null or publish_at <= now())
  and deleted_at is null
);

create policy gallery_album_media_public_read
on public.gallery_album_media for select to anon, authenticated
using (
  exists (
    select 1
    from public.gallery_albums a
    join public.cms_media_assets m on m.id = gallery_album_media.media_id
    where a.id = gallery_album_media.album_id
      and a.publication_status = 'published'
      and (a.publish_at is null or a.publish_at <= now())
      and a.deleted_at is null
      and m.visibility = 'public'
      and m.asset_state = 'ready'
      and m.deleted_at is null
  )
);

create policy branches_public_read
on public.branches for select to anon, authenticated
using (
  publication_status = 'published'
  and (publish_at is null or publish_at <= now())
  and deleted_at is null
);

commit;
