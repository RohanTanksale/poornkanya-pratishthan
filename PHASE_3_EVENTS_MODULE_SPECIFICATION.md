# Phase 3 — Events Management Specification

**Status:** UI prototype and backend specification only. Event persistence is not connected.

## 1. Current-state boundary

- The public `/events` page already contains source-managed Saraswati Mahotsav material and explicitly states that its year was not supplied.
- It also displays planned upcoming initiatives; these must not be represented as confirmed or dated events.
- The authenticated admin workspace currently has only a planned Events navigation entry. This phase links it to `/admin/events` and labels it **Prototype**.
- No historical event is copied into a CMS record. No date, venue, report, guest, or photograph is invented.
- The prototype has no server action, API, database read/write, or success-shaped save behavior.

## 2. Administrator workflows (target behavior)

### Create

1. Authorized administrator opens `/admin/events` and selects **Create event**.
2. Enter verified title, slug, plain/structured description, start/end timestamps and explicit time zone, venue/location, optional registration link/deadline, event state, cover media reference, and SEO fields.
3. Save as draft without making it public, or publish immediately/schedule publication.
4. Server validates every field and the administrator session, then persists through a reviewed database migration.
5. On success, revalidate the admin list and relevant public event routes; show explicit success. On failure, return a clear error without pretending that persistence succeeded.

### Edit

1. Open a persisted event from the admin list.
2. Load the selected event by ID through an authorized server-side read.
3. Preserve existing status and values until a submitted change is validated.
4. Record the authenticated actor and update timestamp.
5. Require a confirmation step for archive/unpublish/delete actions; archive/soft-delete must not remove related media objects.

### Publish, unpublish, archive

- **Draft:** never public.
- **Published now:** public if required fields are valid and no soft-delete marker exists.
- **Scheduled:** store `publication_status = 'published'` with a future `publish_at`; public queries exclude it until due. No cron is required to make the row visible if public reads always compare with the current time; no database row mutation occurs at the schedule time.
- **Unpublish:** move to `draft`, remove from public output, retain the record.
- **Archive:** move to `archived`, retain the record, omit from upcoming public listings, and preserve authorized admin access.
- **Soft delete:** set `deleted_at` only through a separately confirmed, authorized workflow. It is not a synonym for archive.
- Operational event state (`scheduled`, `postponed`, `cancelled`, `completed`) is separate from editorial publication state.

## 3. Event data and validation

| Field | Requirement |
|---|---|
| Title | Required; bounded plain text; trim whitespace. |
| Slug | Required for published record; lowercase URL-safe unique among active records; regenerate only with an explicit edit decision. |
| Description | Required for publication; bounded plain text/structured content; do not render arbitrary HTML. |
| Start date/time | Optional for draft when unknown; required to publish. Do not infer missing dates. Store `timestamptz` plus an explicit IANA time-zone identifier when supplied. |
| End date/time | Optional; if supplied, must be at/after start. |
| Venue and location | Optional for draft; publication requirements should be confirmed by editorial policy. Keep venue and location distinct. |
| Registration URL | Optional; validate length and HTTPS protocol/host allowlist policy. No applicant registration data is stored in the event record. |
| Registration deadline | Optional; validate it does not follow the event start. |
| Event state | `scheduled`, `postponed`, `cancelled`, or `completed`; only an administrator may set it. Do not infer “completed” just because start time passed. |
| Cover/social image | Optional reference to an approved media asset; do not accept arbitrary storage paths as a substitute for an approved asset. |
| Publication state | `draft`, `published`, or `archived`; schedule with `publish_at`. |
| SEO title/description | Optional bounded text; retain current public metadata until a reviewed integration replaces it. |
| Report | Optional verified post-event report; publish only after approval. |
| Agenda/speakers | Optional related ordered rows. Store only supplied and approved names/designations. |

## 4. Admin listing requirements

Target list columns:

- Title and slug.
- Start date/time as supplied (unknown remains “Date not supplied” in an approved legacy/import workflow).
- Event state.
- Publication state badge.
- Updated time and editor.
- Actions: open/edit, publish/unpublish, archive; destructive actions behind confirmation.

Target filters:

- Search by title/slug.
- Publication state: all, draft, published, archived.
- Event state: all, scheduled, postponed, cancelled, completed.
- Date period: upcoming, past, unscheduled.
- Bounded pagination, stable ordering, and exact count if supported by query cost.

The current prototype shows the filter control design but disables it because there are no CMS records or persistence. It displays a genuine empty state and no sample records.

## 5. Event form specification

Create and edit forms share a validated schema and field components. The prototype previews:

- Title and slug.
- Description.
- Start/end date and time.
- Venue and location.
- Featured-image chooser placeholder (must be wired to approved media library later).
- Registration URL.
- Publication state and event state.
- SEO title and description.
- Save controls.

In the current interface, all these fields are disabled and saving is disabled. The edit preview explicitly says there is no selected event. This prevents a false impression that data is saved or editable.

## 6. Public visitor experience

### Preserve `/events`

Do not replace the current static public page or its verified content as part of this phase. Once persistence and reviewed content are available, augment `/events` with published CMS entries while preserving the existing Saraswati Mahotsav source content until a content migration and review are explicitly approved.

### Upcoming and past

- Query only `publication_status = 'published'`, due `publish_at`, and `deleted_at is null`.
- Upcoming: `starts_at >= now()`, sorted ascending, with bounded pagination.
- Past: `starts_at < now()`, sorted descending; do not automatically change event status or fabricate a report.
- `starts_at is null` is not silently assigned to either group; drafts should not be public, and any approved legacy presentation remains source-managed.
- A cancelled or postponed event may remain visible with a clear state label if the organization approves that UX.

### Event detail route

Add a future `/events/[slug]` route only when database integration is ready. It must:

- Return a not-found response for absent, draft, archived, deleted, or not-yet-due records.
- Include approved title, date/time/time zone, location, registration details, cover image/alt text, agenda, and optional report.
- Generate metadata from the published event only; escape content and avoid unsafe HTML.
- Preserve `/events` and existing legacy redirects.

### SEO and sitemap

- Add only currently published and due events to the public sitemap.
- Exclude draft, scheduled-future, archived, deleted, and private media/admin paths.
- Canonical and Open Graph URLs must use the configured public site URL and validated metadata.

## 7. Security and privacy

- Reuse the current Supabase Auth, email allowlist, super-admin protection, and server-side authorization helper.
- Every list/detail/action must authorize server-side before using the server-only service-role client.
- The service-role key bypasses RLS; it must never reach client bundles, and UI visibility is not an authorization control.
- Public reads should use a least-privilege client subject to RLS, or a separately reviewed server-side public query; never return draft rows in client payloads.
- Proposed RLS permits public reads only for published, due, non-deleted events and their visible child agenda rows. It grants no client writes.
- Registration URLs do not imply an internal registration database. If registration later collects personal information, define and approve a separate private data/retention model.
- Media object policies are separate from table RLS. Only approved public assets may be publicly readable; uploads/deletion require an authorized server workflow.
- Audit publication, unpublication, archive, edits, and media-reference changes with actor, operation, record ID, time, and minimal metadata. Do not log full descriptions or personal payloads.
- No new administrator role is defined.

## 8. Acceptance criteria for a persistence-ready module

1. Admin list contains no fabricated records and uses bounded queries.
2. Search and filters validate server-side and do not put sensitive data into URLs.
3. Draft, publish, schedule, unpublish, archive, and soft-delete have distinct tested behavior.
4. Public reads exclude all non-published, future-scheduled, archived, and deleted records.
5. Unknown historical dates remain unknown; no date inference/import is performed.
6. Every mutation checks the existing authorized-admin boundary and records an audit event.
7. Cover media must reference an approved asset and cannot expose private objects.
8. Form labels, keyboard operation, validation, pending, error, success, and empty states are accessible.
9. Integration preserves `/events`, current static facts, metadata defaults, and planned-initiative labels.
10. Tests use synthetic records in an approved local/staging database only.

## 9. Current prototype implementation

`/admin/events` is protected by the Phase 2 admin workspace layout. Its search/filter controls and create/edit form previews are disabled, the list contains no sample data, status badges are identified as design examples only, and the page repeatedly states that persistence is not connected. No API/action or migration is used by this page.
