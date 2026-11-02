# Phase 3 — CMS Database Architecture

**Status:** Review proposal only; no migration has been applied.
**Schema evidence:** Four checked-in SQL migrations, not a verified production schema.
**Related SQL:** [`supabase/review-only/phase-3-cms-schema.sql`](./supabase/review-only/phase-3-cms-schema.sql)

## 1. Scope and verified baseline

The local migration history defines these tables:

| Existing table | Source-defined columns and purpose | Existing access behavior |
|---|---|---|
| `public.leadership_members` | `id uuid`, unique `name`, constrained `role`, optional `photo_src`, `display_order`, `created_at`; seeded leadership records. | RLS enabled; client roles revoked; service role granted access. |
| `public.admin_access` | Normalized-email primary key `email`, `granted_by`, `created_at`. | RLS enabled; client roles revoked; service role granted access. |
| `public.membership_applications` | Applicant fields, status, timestamps; a later migration adds age, education, interests, experience, availability. | RLS enabled; client roles revoked; service role granted access. |

The migrations are:

- `202611020001_create_leadership_members.sql`
- `202611020002_create_admin_access.sql`
- `202611020003_create_membership_applications.sql`
- `202611020004_add_application_details.sql`

These are **repository artifacts only**. The production database schema, applied migration versions, actual rows, grants, RLS state, extensions, backup, and rollback capability have not been verified. This design must be compared with the real target before any implementation migration is approved.

The current Next.js admin uses a server-only service-role client after checking Supabase Auth and the existing email allowlist (`SUPER_ADMIN_EMAIL` or `admin_access`). The service role bypasses RLS. Therefore, server-side action authorization and secret isolation remain critical even when RLS is enabled.

## 2. Architecture principles

1. Keep the existing public pages and their verified source content as the fallback until a deliberate, reviewed content cutover.
2. Reuse `leadership_members` and `membership_applications`; do not create competing copies or casually alter their constraints.
3. Keep private applicant and enquiry records separate from public editorial content.
4. Use structured JSON only for page blocks and programme objectives/activities. Validate the allowed shape in TypeScript; do not render arbitrary stored HTML.
5. Separate editorial publication state from event occurrence state.
6. Treat `publish_at` as the earliest public visibility time. A record with `publication_status = 'published'` and a future `publish_at` remains invisible to public reads until its time.
7. Prefer archive/soft-delete for public content and media metadata. Hard deletion of personal data is governed separately by approved retention rules.
8. Use a media metadata table for storage references; file bytes remain in an approved Storage bucket.
9. Keep administrator writes behind existing server authorization. Do not invent roles.
10. Record minimal audit metadata, never credentials, tokens, full application payloads, or unnecessary personal data.

## 3. Proposed entity inventory

New editorial/support tables proposed in the companion SQL:

1. `site_pages`
2. `events`
3. `event_agenda_items` — child records supporting ordered schedules/speakers
4. `programmes`
5. `announcements`
6. `gallery_albums`
7. `cms_media_assets`
8. `gallery_album_media` — many-to-many media/album relationship and per-album captions/order
9. `branches`
10. `contact_enquiries` — conditional on the owner approving enquiry persistence
11. `admin_audit_log`

Existing reused tables: `leadership_members`, `membership_applications`, and `admin_access`.

The additional agenda and album-media tables avoid embedding relational ordering and reusable media relationships into opaque JSON. `contact_enquiries` is a proposal only and must not be created without the owner’s decision.

## 4. Proposed table definitions

Column names below are paired with PostgreSQL types. The companion SQL contains constraints, indexes, foreign keys, triggers, grants, and policies. All new mutable editorial tables have `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()`; update triggers maintain `updated_at`. Editorial records that can be removed from publication use nullable `deleted_at timestamptz`; normal archival uses `publication_status = 'archived'`.

### 4.1 `site_pages`

**Purpose:** Versionable, structured editorial content for Home, About, Vision, Privacy Policy, and Terms. Does not replace current page rendering until a separately reviewed cutover.

- Identity/route: `id uuid` primary key; `page_key text` unique and constrained to the five approved page identifiers; `slug text` unique among non-deleted rows.
- Content: `title text not null`; `content jsonb not null default {}` and constrained to a JSON object. The application must validate a page-specific block schema.
- Workflow: `publication_status text` (`draft`, `published`, `archived`); nullable `publish_at timestamptz`; nullable `deleted_at timestamptz`.
- SEO: `seo_title text`, `seo_description text`, `canonical_url text`, `og_title text`, `og_description text`, and `social_image_id uuid`.
- Attribution/timestamps: `created_by text`, `updated_by text`, `created_at`, `updated_at`.
- Relationship: `social_image_id` references `cms_media_assets(id)` with `ON DELETE SET NULL`.
- Constraints/indexes: unique `page_key`; partial unique live `slug`; partial publication/schedule index.
- Publishing: public only when published, not deleted, and `publish_at` is null or due. Archive/unpublish removes it from public reads without deleting the row.
- RLS: anon/authenticated select policy for currently published rows; no client insert/update/delete policy.

### 4.2 `events`

**Purpose:** Event editorial record, future/past listing, event detail, registration link, featured image, report, and SEO.

- Identity: `id uuid` primary key; `title text`; `slug text` unique among non-deleted rows.
- Description/location: `description text`; nullable `category text`, `venue text`, `location text`.
- Date/time: nullable `starts_at timestamptz`, `ends_at timestamptz`, `timezone text`. Drafts may have unknown dates. Publishing requires `starts_at`; the CMS must not backfill or infer unknown historical dates.
- Registration: nullable `registration_url text`, `registration_deadline timestamptz`. URLs must be validated as approved HTTPS destinations by the application.
- Event state: `event_status text` (`scheduled`, `postponed`, `cancelled`, `completed`) is distinct from publication state. Past/upcoming is derived from `starts_at`, not guessed from a status label.
- Editorial workflow: `publication_status text` (`draft`, `published`, `archived`), nullable `publish_at`, `featured boolean`, `display_order integer`, `deleted_at`.
- Images: nullable `cover_media_id uuid`, `social_image_id uuid`, each referencing `cms_media_assets(id)` with `ON DELETE SET NULL`.
- Report/SEO: nullable `report text`, `seo_title`, `seo_description`, `canonical_url`, `og_title`, `og_description`.
- Attribution/timestamps: `created_by`, `updated_by`, `created_at`, `updated_at`.
- Constraints/indexes: slug format and partial uniqueness; end not before start; registration deadline not after start; published event requires start date/time; upcoming public index on start/order; admin status/date index.
- Publishing: drafts are private; scheduled publication is `published` plus future `publish_at`; unpublish returns to draft; archive keeps the record but removes it from public queries; soft-delete is a separate protected operation.
- RLS: public select only for due, published, non-deleted events; no direct client writes.

### 4.3 `event_agenda_items`

**Purpose:** Ordered optional event schedule entries and verified presenter labels; avoids storing a variable list of relational data in an event text field.

- `id uuid` primary key; `event_id uuid not null`; `title text not null`; nullable `description text`, `presenter text`, `starts_at timestamptz`, `ends_at timestamptz`; `display_order integer not null`; `created_at`, `updated_at`.
- Relationship: `event_id` references `events(id)` with `ON DELETE CASCADE`.
- Constraints/indexes: end not before start; unique `(event_id, display_order)`; index `(event_id, display_order)`.
- Workflow: agenda rows are visible only through their parent event’s publication state and schedule. Parent archives/unpublishes hide agenda entries.
- RLS: select policy requires a public, due, non-deleted event parent; no client writes.

### 4.4 `programmes`

**Purpose:** Verified programme descriptions, objectives, activities, display ordering, image, publication, and SEO.

- Identity/content: `id uuid` primary key; `title text`; live-unique `slug text`; `description text`; nullable `category text`.
- Structured fields: `objectives jsonb not null default []`; `activities jsonb not null default []`; application validation must enforce arrays of bounded plain-text items.
- Workflow: `publication_status`, `publish_at`, `display_order`, `featured`, `deleted_at`.
- Media/SEO: nullable `cover_media_id`, `social_image_id` FKs to `cms_media_assets`; SEO title/description, canonical URL, OG title/description.
- Attribution/timestamps: `created_by`, `updated_by`, `created_at`, `updated_at`.
- Constraints/indexes: partial unique live slug; partial published display-order index.
- Publishing: planned initiatives must not be represented as delivered programmes. Only approved content can be published.
- RLS: public select for due published non-deleted records; no client writes.

### 4.5 `announcements`

**Purpose:** Short notices with publishing schedule, optional expiry/featured presentation, and order.

- Identity/content: `id uuid` primary key; `title text`; live-unique `slug text`; `content text`.
- Workflow: `publication_status`, nullable `publish_at`, nullable `expires_at`, `display_order`, `featured`, `deleted_at`.
- Attribution/timestamps: `created_by`, `updated_by`, `created_at`, `updated_at`.
- Constraints/indexes: expiry later than publish time when both exist; partial unique live slug; publication/schedule/expiry/order index.
- Publishing: public only if published, due, unexpired, and not deleted; archive/unpublish hides immediately.
- RLS: public select for currently visible records; no client writes.

### 4.6 `gallery_albums`

**Purpose:** Public album title, description, cover, ordering, schedule, and visibility.

- `id uuid` primary key; `title text`; live-unique `slug text`; nullable `description text`.
- Workflow: `publication_status`, `publish_at`, `display_order`, `deleted_at`.
- Media: nullable `cover_media_id uuid` references `cms_media_assets(id)` with `ON DELETE SET NULL`.
- Attribution/timestamps: `created_by`, `updated_by`, `created_at`, `updated_at`.
- Indexes: partial unique live slug; published order/creation index.
- Publishing: an album is public only when due and published. Media is public only when its asset is ready and explicitly public.
- RLS: public select only for due, published, non-deleted albums; no client writes.

### 4.7 `cms_media_assets`

**Purpose:** Metadata and stable object references for approved media-library objects.

- `id uuid` primary key; `category text` constrained to branding, leadership, programmes, events, gallery, branches, documents, or other.
- Object identity: `storage_bucket text`, `object_key text`, unique together; `original_filename text`.
- File metadata: `mime_type text`, `byte_size bigint`, optional `width integer`, `height integer`; optional media format/hash extensions can be considered after upload requirements are approved.
- Accessibility/editorial: `alt_text text not null default ''`, nullable `caption text`.
- Access/lifecycle: `visibility text` (`private`, `public`); `asset_state text` (`processing`, `ready`, `archived`); nullable `deleted_at`.
- Attribution/timestamps: `uploaded_by text`, `created_at`, `updated_at`.
- Constraints/indexes: allowlisted MIME types, bounded size/dimensions, unique object key, lifecycle/visibility lookup index if query evidence warrants one.
- RLS: public metadata read only if visibility is public, asset state ready, and not deleted; private metadata is server-only.
- Storage: Storage object access policies are separate from table RLS and must match this metadata gate. The existing bucket inventory is unknown; no bucket name or public policy is assumed.

### 4.8 `gallery_album_media`

**Purpose:** Many-to-many album membership, per-album order, caption, and alternative text; one approved asset can be reused without duplicating media metadata.

- Composite primary key `(album_id uuid, media_id uuid)`.
- `display_order integer not null`, nullable `caption text`, `alt_text text not null default ''`, `created_at timestamptz`.
- Relationships: `album_id` references `gallery_albums(id)` with `ON DELETE CASCADE`; `media_id` references `cms_media_assets(id)` with `ON DELETE RESTRICT`.
- Constraints/indexes: unique `(album_id, display_order)`; index `(album_id, display_order)`.
- Deletion: remove a membership link to remove a photo from one album; do not delete the underlying object unless all references are safely cleared and an approved deletion workflow exists.
- RLS: public select only if the parent album is public and the media asset is ready/public/non-deleted; no client writes.

### 4.9 `leadership_members` — reuse existing table

Do not create a second leadership table. The checked-in migration defines:

- `id uuid` primary key, `name text not null unique`, constrained `role text`, nullable `photo_src text`, `display_order integer`, `created_at timestamptz`.
- Unique name and existing role/path constraints must be preserved.
- Existing RLS revokes client access and grants `service_role`.
- No `updated_at`, biography, status, media FK, or soft-delete field is verified in the local schema. Do not assume those fields exist in production. Propose additive alterations only after reviewing live schema and confirming the desired data model.

### 4.10 `branches`

**Purpose:** Current verified branch directory, not historical areas or invented addresses.

- `id uuid` primary key; `name text`; live-unique `slug text`.
- Nullable `state text`, `city text`, `address text`, `coordinator text`, `contact_email text`, `contact_phone text`, `description text`.
- Nullable `image_media_id uuid` references `cms_media_assets(id)` with `ON DELETE SET NULL`.
- Workflow: `publication_status`, `publish_at`, `display_order`, `deleted_at`.
- Attribution/timestamps: `created_by`, `updated_by`, `created_at`, `updated_at`.
- Indexes: partial unique live slug; published ordering/name index.
- Privacy: contact details and coordinator identities become public only after explicit approval and publication.
- RLS: public select for due published non-deleted records; no client writes.

### 4.11 `contact_enquiries` — conditional proposal

**Purpose:** Private inbox only if the owner approves persisting enquiries in the database. Existing Resend delivery must continue if persistence is later added.

- `id uuid` primary key; `name text`, `email text`, `subject text`, `message text`.
- Workflow: `enquiry_status text` (`unread`, `read`, `closed`); nullable `read_at`, `closed_at`; `received_at timestamptz`.
- Retention: required `retention_expires_at timestamptz`; actual duration/value must be approved. Expired records require a server-side hard-delete job; soft-deletion would retain the personal data.
- `created_at`, `updated_at`.
- Indexes: `(enquiry_status, received_at desc)` and `retention_expires_at`.
- No relationship to public editorial tables; no public select policy or client grant.
- RLS: enabled with no anon/authenticated policies; server-only service role after admin authorization. Do not create this table absent owner approval.

### 4.12 `admin_audit_log`

**Purpose:** Append-only record of sensitive administrative operations with minimal metadata.

- `id bigint generated always as identity` primary key.
- `actor_email text`; `action text`; `entity_type text`; nullable `entity_id uuid` (intentionally polymorphic, so no FK to every entity table); `occurred_at timestamptz`; optional `request_id uuid`; `metadata jsonb not null default {}`.
- Relationships: no actor FK because the protected super-admin is environment-configured and may not have an `admin_access` row; entity IDs are polymorphic.
- Indexes: time descending, actor/time, entity type/id/time. Add more only after query evidence.
- Append-only: no client grants; ordinary admin application actions should insert but not update/delete log rows. Retention and privileged maintenance require a separate approved policy.
- Data minimization: never log message bodies, application payloads, credentials, auth tokens, or uploaded document content.
- RLS: enabled, no anon/authenticated access policy. Authorized log viewing/writing must go through server actions.

## 5. Status, timestamps, and deletion rules

| Entity | Publication workflow | Scheduling | Deletion |
|---|---|---|---|
| Site pages, events, programmes, announcements, albums, branches | `draft → published → archived`; unpublish returns to draft. | `publish_at`; future published rows remain hidden until due. Announcements also have `expires_at`. | Soft-delete via nullable `deleted_at`, separate from archive. |
| Event agenda items | Inherits event visibility. | Optional item times; event publication schedule governs public read. | Cascade with parent event. |
| Media assets | `processing → ready → archived`; public/private visibility separate. | No independent publish schedule; parent editorial item controls usage. | Soft-delete metadata; object cleanup only after reference checks and approved storage policy. |
| Album/media links | Inherits album and media visibility. | Inherits album schedule. | Remove relationship row; media object remains. |
| Existing leadership | Current schema has no publication/deletion workflow; preserve it. | None verified. | Do not add destructive behavior without reviewed migration and owner approval. |
| Contact enquiries | `unread → read → closed`. | No publishing. | Hard-delete on approved retention schedule; no soft deletion of PII. |
| Audit records | Append only; no publication state. | None. | Retention/maintenance policy requires approval. |
| Membership applications | Existing `pending/reviewed/accepted/declined`; no CMS republishing. | None. | Retention/correction/deletion policy is unresolved; do not change existing records. |

`created_at` is immutable after insertion. `updated_at` changes on edits through a database trigger; `created_by` and `updated_by` store normalized actor email strings without a foreign key. Application code must set actor fields only after server-side authorization.

## 6. Relationships

- `site_pages.social_image_id → cms_media_assets.id`
- `events.cover_media_id/social_image_id → cms_media_assets.id`
- `events.id → event_agenda_items.event_id` (one-to-many)
- `programmes.cover_media_id/social_image_id → cms_media_assets.id`
- `announcements` may later reference a media asset only if an approved use case requires it; no such column is included in this proposal.
- `gallery_albums.cover_media_id → cms_media_assets.id`
- `gallery_albums.id ↔ cms_media_assets.id` through `gallery_album_media`
- `branches.image_media_id → cms_media_assets.id`
- Existing `leadership_members`, `membership_applications`, and `admin_access` remain separate and unchanged in this proposal.
- `contact_enquiries` and `admin_audit_log` have no cross-table applicant/media relationships.

## 7. Row Level Security and grants

The review-only SQL proposes:

- Enable RLS on every new table.
- Revoke table privileges from `PUBLIC`, `anon`, and `authenticated` first.
- Grant `SELECT` to `anon`/`authenticated` only on public editorial tables, then attach narrowly scoped RLS policies requiring published, due, non-deleted records. Media additionally requires `visibility = 'public'` and `asset_state = 'ready'`; announcements additionally require not expired.
- Grant no direct client writes to any proposed CMS table.
- Grant server-side `service_role` access; Supabase’s service role bypasses RLS. Accordingly, every server action must continue to authorize the current Supabase user before any service-role read or write. The service key must remain server-only.
- Give `contact_enquiries` and `admin_audit_log` no client grants/policies.
- Preserve existing RLS and grants on the current three application tables; do not alter them in this phase.

If future requirements demand direct authenticated-admin database access rather than the current server-action/service-role model, design an explicit database authorization function/policy that correctly includes the environment-configured super-admin. Do not approximate that identity check or invent roles.

### Storage access

Table RLS does not protect Storage objects. A later proposal must separately specify:

- Exact approved bucket names and whether each is public or private.
- Object path namespaces and allowed MIME types, byte limits, and actual-content checks.
- Public read only for published, approved assets if policy permits.
- Upload/replace/delete restricted to an authorized server-side workflow.
- No public access for application attachments or private documents.
- Safe cleanup, orphan handling, and reference checks before object deletion.

No bucket or Storage policy exists in verified source evidence.

## 8. Indexes and query shapes

Candidate indexes in the review-only script target known access patterns:

- Public content ordered/filtered by publication state and schedule.
- Events by start time/order for upcoming/past display and by workflow/status/date for admin lists.
- Event agenda and gallery memberships by parent plus order.
- Albums, programmes, branches by display order.
- Enquiries by status/received time and retention expiry.
- Audit log by occurrence time, actor/time, and entity/time.
- Unique constraints/indexes on page keys, live slugs, object keys, and order within one parent.

Review these against actual query plans and expected data volume before approval; do not add every speculative index automatically.

## 9. Migration, rollback, and verification gates

1. Obtain owner-approved read-only inspection of the actual target schema, migration versions, RLS, grants, and Storage configuration.
2. Compare all names/columns/constraints with these proposals. Reuse equivalent existing objects; if a conflict exists, document it rather than changing data.
3. Confirm required organizational policies/content and whether contact enquiries may be persisted.
4. Confirm backup/restore and rollback arrangements before any additive migration.
5. Split the review-only SQL into approved migration units. `contact_enquiries` must be omitted unless explicitly approved.
6. Validate FK delete behavior, partial unique indexes, time-zone/scheduling behavior, RLS behavior, Storage policy, and public/private read paths in an approved local/staging project.
7. Backfill no guessed event dates, consent evidence, branches, leadership changes, or publication states.
8. Apply only after a separate explicit production approval.

The companion SQL is not an executable migration and has not been run. In particular, its conditional contact table, grant/policy model, trigger/function behavior, and compatibility with the actual production catalog require review before conversion to migrations.
