# Phase 3 — CMS Data and Events Implementation Plan

**Current phase deliverables:** database design, review-only SQL proposal, Events UI prototype, and this plan. No SQL or migrations were executed.

## 1. Current-state audit

### Phase 1 / Phase 2

- Phase 1 added bounded JSON body readers to the application/contact APIs, a Gallery empty-state route, and bounded application review with search/status filters/pagination.
- Phase 2 added an authenticated `/admin` route-group workspace, responsive navigation/shell, dashboard counts using existing data, and explicit Planned module labels.
- The Events navigation was a non-link marked Planned before this phase.
- The existing `/events` public route is source-managed and contains Saraswati Mahotsav material with no year supplied, plus planned initiatives.
- Phase 2 uses server-side `getCurrentAdminEmail()` and existing service-role access checks; server actions keep their own authorization checks.

### Source-defined database

Four local migrations define `leadership_members`, `admin_access`, and `membership_applications`. They are not proof of production schema or applied migration history. Existing leadership must be reused, not duplicated. Membership and contact data remain private; the latter is currently email-only.

### Production boundaries

No credentials, applicant records, production schema, auth settings, Storage buckets, RLS policies, production deployments, or backups were inspected or changed for Phase 3. No SQL was executed.

## 2. Phase 3 deliverables

1. `PHASE_3_CMS_DATABASE_DESIGN.md` — unified proposed model, fields, relationships, uniqueness/indexes, workflows, deletion behavior, RLS and migration gates.
2. `PHASE_3_EVENTS_MODULE_SPECIFICATION.md` — create/edit/publish lifecycle, public behavior, validation, privacy, security, and acceptance criteria.
3. `PHASE_3_IMPLEMENTATION_PLAN.md` — this sequencing and approval plan.
4. `supabase/review-only/phase-3-cms-schema.sql` — additive proposal only, outside `supabase/migrations`; do not execute or apply.
5. `src/app/admin/(workspace)/events/page.tsx` — authenticated Events prototype with empty state, disabled filters, disabled create/edit form designs, and status badge design.

The UI prototype does not read or write a database and contains no sample event records.

## 3. Recommended sequence after review

### Gate 0 — Owner and production verification

Before any database work:

- Approve the module schema and resolve conflicts against a read-only inspection of the actual target schema and migration history.
- Verify current grants/RLS, database extensions, backup/restore and rollback method.
- Confirm event editorial policy: required fields for publishing, event-state meanings, timezone handling, public canceled/postponed presentation, and report approval.
- Approve whether contact enquiries are to be persisted. The proposed `contact_enquiries` table must be omitted if not approved.
- Confirm retention/deletion rules for personal data and audit records.
- Approve Storage bucket names, visibility, MIME/size limits, upload policy, and object cleanup before media integration.

### Gate 1 — Schema and access layer

- Convert only approved review SQL into one or more migration files after catalog comparison.
- Do not migrate static event data automatically. Preserve the existing public events page as the source baseline.
- Generate/update Supabase TypeScript database types from the approved schema.
- Keep public reads on least-privilege clients/RLS and writes behind the existing authenticated server-action boundary.
- Add safe, validated event repository functions; never return drafts through public query paths.
- Add audit event recording only in the same success path as the corresponding mutation; define handling if audit insertion fails.

### Gate 2 — Event admin persistence

- Replace prototype controls with a bounded listing and validated server actions.
- Implement create/edit draft, publish/schedule, unpublish, archive, and separately confirmed soft-delete.
- Ensure listing search/status/time filters are server-validated and paginated.
- Preserve old values on validation errors and surface storage/database errors explicitly.
- Add synthetic test data only to an approved local/staging database.

### Gate 3 — Public event reads

- Keep `/events` and existing static event facts; add approved CMS data only when published/due.
- Add `/events/[slug]` for published and due records; exclude drafts, scheduled-future, archived, and deleted rows.
- Separate upcoming/past by verified `starts_at`; unknown dates remain unknown.
- Add event sitemap and metadata output only for published records.
- Keep planned initiatives distinct from confirmed event records.

### Gate 4 — QA and release readiness

- Test authorized/unauthorized server actions and direct route requests.
- Test workflow transitions, scheduling boundaries, URL validation, slug collision, pagination/filtering, errors, empty states, and accessibility.
- Verify no public response includes private metadata or unpublished content.
- Verify Storage object access separately from database RLS.
- Validate backup/rollback in an approved staging environment before requesting production approval.

## 4. Risk and rollback considerations

| Risk | Mitigation / rollback |
|---|---|
| Production schema differs from repository migrations | Inspect actual catalog first; stop and document conflicts; never run review SQL directly. |
| Admin lockout or privilege escalation | Preserve login and allowlist semantics; keep server authorization on every action; test with non-production synthetic accounts. |
| Static event facts lost or rewritten | No automatic imports or public-page replacement; preserve source version until editorial sign-off. |
| Future-scheduled event leaks early | Public RLS/query must test `publish_at is null or publish_at <= now()` and publication state. |
| Slug collision or broken public links | Check uniqueness and route redirects before slug edit; keep ID stable and version slug changes deliberately. |
| Media object becomes public unexpectedly | Table RLS and Storage object policy reviewed together; no bucket/policy assumed. |
| Personal data is over-retained | Enquiry persistence conditional; retention must be approved; hard deletion process required for PII. |
| Audit failure loses traceability | Decide whether failed audit writes abort the associated mutation; never silently claim audit success. |

Rollback of a future migration must be reviewed before application. Prefer additive changes and do not drop tables/columns or reverse backfills automatically. A database rollback cannot recover media objects deleted from Storage, so media removal requires an independent safe-retention process.

## 5. Decisions requiring owner approval

1. Approve or revise the proposed tables/columns/constraints and which modules are in the first schema batch.
2. Decide whether contact enquiries should be persisted. If no, remove `contact_enquiries` from any future migration.
3. Approve privacy/data-retention/deletion periods for enquiries and audit history.
4. Confirm event requirements: publish-required fields, timezone, operational statuses, canceled/postponed display, registration behavior, report and agenda approvals.
5. Supply verified event content and authorize use of event photos; do not infer missing event dates.
6. Approve Storage bucket/access policy and media validation limits.
7. Confirm whether branch and leadership schema additions are in scope; supply verified data before publication.
8. Confirm public page-content migration and legal review separately; this phase does not make public pages database-driven.
9. Approve an actual schema/backup/rollback inspection by an authorized operator before migrations.
10. Explicitly approve any future migration execution, production data changes, or deployment as a separate task.

## 6. Current status

- Database design: proposed, not applied.
- Events specification: prepared.
- Events admin UI: prototype only, no persistence.
- Public event integration: plan only; current `/events` remains unchanged.
- Database migrations/SQL execution: none.
- Production changes, commit, push, deployment: none.
