# Final Website Audit — Poornakanya Pratishthan

**Audit date:** 2 November 2026
**Repository commit:** `dfe9aa0` (`Build Poornakanya Pratishthan website`)
**Branch:** `main`, tracking `origin/main`
**Audit type:** Read-only source, configuration, migration, and public-route review. No form submissions, administrator sign-ins, private-record access, database changes, deployment changes, or source-code changes were made.

## Scope and evidence

The review covered the project manifest and scripts, App Router pages and layout, shared components, source-managed content, admin pages and server actions, API handlers, Supabase clients and migrations, environment-variable **names only**, SEO files, Next.js configuration, deployment/test-file inventory, Git status, and a public-only browser check of the configured website.

Findings are marked as:

- **Source verified:** directly represented by repository code/configuration.
- **Live route checked:** a safe public GET was made in the browser; this does not verify its backend or full interaction.
- **Not verified:** requires credentials, production configuration, database access, provider access, or a full workflow test.

The audit does not inspect real applicant records or reveal environment-variable values.

## Report 1 — Executive summary

The site is an English-language Next.js 16 App Router application using React 19, TypeScript, Supabase, and Resend for configured contact delivery. It is an established public website, not a blank project. The existing public pages, design system, admin login flow, membership-application workflow, leadership data workflow, and legal pages should be retained and improved incrementally.

The current administrator area is a small leadership and membership-review tool, **not a CMS**. It supports administrator access, adding committee members, and changing membership application statuses. It does not manage public page content, programmes, events, galleries, branches, announcements, contact enquiries, media, SEO, or audit history.

The source defines three application tables in four migrations. Production schema, migration state, stored records, storage buckets, policies, backups, and provider settings were not inspected. The live `/admin/login` page currently reports that admin access is not configured. No login was attempted; no private admin page or applicant records were opened.

The public pages checked are reachable, but `/gallery` returns 404. Lint, TypeScript, and production build checks pass locally. Actual authentication, submissions, email delivery, database persistence, and administration are **not verified**.

**Recommendation:** retain the current stack, pages, and admin system; first confirm content and production data/backup facts, then implement security foundations and CMS functionality in small backward-compatible phases. Do not start migrations or production deployment without approval.

## Report 2 — Existing functionality inventory

Status definitions:

- **EXISTS AND WORKS:** implemented in source and the named safe route check succeeded, where applicable.
- **EXISTS BUT INCOMPLETE:** there is useful implementation, but requested coverage is missing.
- **DOES NOT EXIST:** no implementation was found in the repository.
- **NEEDS VERIFICATION:** behavior depends on an external service or privileged workflow not tested here.

### Public site and routes

| Page or feature | Status | Evidence and notes |
|---|---|---|
| Home (`/`, `/en`) | EXISTS AND WORKS | Root redirects to `/en`; both live GETs returned 200. `src/app/page.tsx`, `src/app/en/page.tsx`. |
| About (`/about`) | EXISTS AND WORKS | Live GET returned 200. `src/app/about/page.tsx`. |
| Vision (`/vision`) | EXISTS AND WORKS | Live GET returned 200. `src/app/vision/page.tsx`. |
| Programmes (`/programmes`) | EXISTS AND WORKS | Live GET returned 200; page presents activity themes and labels proposed initiatives as planned. `src/app/programmes/page.tsx`. |
| Events (`/events`) | EXISTS BUT INCOMPLETE | Live GET returned 200. Existing Saraswati Mahotsav material and planned initiatives are static; the year is explicitly not supplied; no event CMS or report archive. `src/app/events/page.tsx`, `src/data/events.ts`. |
| Leadership (`/leadership`) | EXISTS BUT INCOMPLETE | Live GET returned 200. Source supports database-backed member listing, but no edit/delete/upload controls; production data behavior is not verified. `src/app/leadership/page.tsx`, `src/lib/leadership.ts`. |
| Branches (`/branches`) | EXISTS BUT INCOMPLETE | Live GET returned 200; branch records are empty and current addresses/contact data are not supplied. Historical regions are not a live branch directory. `src/app/branches/page.tsx`, `src/data/branches.ts`. |
| Gallery (`/gallery`) | DOES NOT EXIST | Live GET returned 404. Photo-gallery placeholders are embedded on other pages; there is no standalone route or gallery management. `src/components/ui/photo-gallery.tsx`, `src/data/photo-galleries.ts`. |
| Membership application (`/apply`) | EXISTS BUT INCOMPLETE | Live GET returned 200; UI/API and schema are present. Submission persistence, email, and admin review were not tested. No consent evidence is saved. `src/app/apply/page.tsx`, `src/components/applications/application-form.tsx`, `src/app/api/applications/route.ts`. |
| Contact (`/contact`) | EXISTS BUT INCOMPLETE | Live GET returned 200. Form sends through Resend when configured; there is no enquiry database/dashboard. Delivery configuration and email were not tested. `src/app/contact/page.tsx`, `src/app/api/contact/route.ts`. |
| Privacy (`/privacy`) | EXISTS AND WORKS | Live GET returned 200; content exists but should be reconciled with verified retention, vendor, and safeguarding practices. `src/app/privacy/page.tsx`. |
| Terms (`/terms`) | EXISTS AND WORKS | Live GET returned 200; organisational/legal review is still appropriate. `src/app/terms/page.tsx`. |
| Header/footer, breadcrumbs, responsive CSS | EXISTS BUT INCOMPLETE | Shared components, skip link, focus styling, mobile menu and responsive rules exist. Social entries have no configured destinations and render as non-links. No full accessibility audit or device/browser matrix was run. `src/components/layout/`, `src/components/ui/breadcrumbs.tsx`, `src/app/globals.css`, `src/data/site.ts`. |
| English and legacy redirects | EXISTS AND WORKS | Live `/mr` and `/mr/about` GETs ended at `/en` and `/about`. Redirect rules are in `next.config.ts`. |
| Not-found page | EXISTS AND WORKS | An unknown public route returned a branded 404. `src/app/not-found.tsx`. |

### Admin, APIs, and CMS capabilities

| Capability | Status | Current source behavior |
|---|---|---|
| Admin dashboard and overview | EXISTS BUT INCOMPLETE | `/admin` is an authenticated page with leadership, admin access, and applications sections; it is not a CMS dashboard. `src/app/admin/page.tsx`. |
| Admin login/logout | NEEDS VERIFICATION | Supabase password sign-in, authorization check, sign-out, and session refresh are implemented. The live login page says admin access is not configured; no credentials were used. `src/app/admin/login/`, `src/app/admin/actions.ts`, `src/proxy.ts`. |
| Roles and permissions | EXISTS BUT INCOMPLETE | Super-admin protection and an email allowlist exist. Other authorized admins share broad privileges; no role/capability model is implemented. `src/lib/supabase/server.ts`, `src/app/admin/actions.ts`. |
| Leadership list/create | EXISTS BUT INCOMPLETE | Public database-backed listing and admin creation exist. Existing member edit/delete, ordering controls, and uploads do not. `src/app/admin/member-form.tsx`, `src/app/admin/actions.ts`, `src/app/admin/page.tsx`. |
| Membership application review | EXISTS BUT INCOMPLETE | Admin can view submissions and change status. No search, filters, pagination, notes, export, correction, or retention/delete workflow. `src/app/admin/application-review.tsx`, `src/app/admin/actions.ts`. |
| Contact enquiry management | DOES NOT EXIST | Contact messages are sent to email and are not persisted to an enquiry table or dashboard. `src/app/api/contact/route.ts`. |
| Programme/event/page/branch/announcement CMS | DOES NOT EXIST | Public data is source-managed; there are no corresponding admin CRUD workflows. |
| Gallery/media upload | DOES NOT EXIST | Leadership accepts a local image path; no upload endpoint, Storage SDK integration, bucket configuration, or media library was found. |
| SEO management | DOES NOT EXIST | Page metadata is coded in page modules; there is no admin editor for title, description, canonical, or social image. |
| Audit log | DOES NOT EXIST | No application audit table or event-writing workflow found. |

### Live public checks performed

Safe GET checks only; no form was submitted and no private data was requested.

| Route/check | Result |
|---|---|
| `/`, `/en`, `/about`, `/vision`, `/programmes`, `/events`, `/leadership`, `/branches`, `/contact`, `/apply`, `/privacy`, `/terms` | HTTP 200 |
| `/gallery` | HTTP 404 |
| `/mr`, `/mr/about` | Redirected to `/en`, `/about` |
| `/robots.txt`, `/sitemap.xml` | HTTP 200 |
| `/admin/login` | HTTP 200; page reports admin access is not configured |
| `/admin` and authenticated workflows | Not accessed; no sign-in attempted and no personal records inspected |
| Form submission, Supabase, Resend, Storage | Not tested |

## Report 3 — Issues and risks

Severity reflects potential impact and source evidence, not a claim that exploitation or production failure occurred.

### Critical

No confirmed critical issue was established by this read-only audit.

### High

1. **Consent evidence is not retained — high confidence.** The application handler requires `consent === true`, but the insert omits consent text/version and timestamp; the migration has no corresponding fields. Under-18 applicants (the form allows ages 15–17) have no guardian-review record despite the privacy copy. This is a privacy/safeguarding recordkeeping gap, not a legal determination. Evidence: `src/app/api/applications/route.ts` (consent check and insert); `supabase/migrations/202611020003_create_membership_applications.sql`; `src/app/privacy/page.tsx`.
2. **No operational correction/deletion workflow for applicant records — high confidence in admin scope.** Privacy copy accepts data requests, but admin actions only update status and have no deletion or retention process. An external/manual procedure may exist; it was not verifiable. Evidence: `src/app/privacy/page.tsx`; `src/app/admin/actions.ts`.
3. **Application list is unbounded — high confidence in code; impact depends on volume.** Dashboard query selects all application rows and personal fields, ordered newest-first, without pagination or limit. Evidence: `src/app/admin/page.tsx`.

### Medium

1. **Public endpoints lack application-level rate limits and streamed body caps — medium confidence; deployment-dependent.** Both APIs rely on a declared `Content-Length` check before `request.json()`. A missing length is treated as zero; the handlers do not enforce a streamed byte limit. No CAPTCHA or app-level rate limiter is present. Hosting/WAF controls might reduce exposure but were not inspected. Evidence: `src/app/api/applications/route.ts`, `src/app/api/contact/route.ts`.
2. **Admin permissions are coarse.** An allowlisted admin can grant/revoke other admins, create committee entries, and update application status; no role separation or least-privilege capabilities. Evidence: `src/app/admin/actions.ts`, `src/lib/supabase/server.ts`.
3. **Live admin access is unconfigured at time of check.** `/admin/login` explicitly displays a setup notice on the public deployment. This may be intentional before launch; admin workflow availability is not demonstrated. Do not infer the cause or attempt to enable it without the owner’s approval.
4. **No admin edit/delete for leadership and no upload verification.** The form accepts a `/images/...` path but does not upload or confirm the asset exists. Evidence: `src/app/admin/member-form.tsx`, `src/app/admin/actions.ts`.
5. **No persistent contact-enquiry workflow.** Messages rely on external email delivery and are unavailable in the application admin; failed or misrouted email cannot be managed from the site. Evidence: `src/app/api/contact/route.ts`.

### Low

1. **Gallery deep link is missing.** The live `/gallery` route returns 404 although galleries are embedded on public pages. Add it only after approved media and intended album requirements are confirmed.
2. **Sitemap is configuration-dependent and source-maintained.** `src/app/sitemap.ts` returns an empty sitemap without `NEXT_PUBLIC_SITE_URL`; routes are manually listed.
3. **SEO is not CMS-managed.** Metadata helpers and page metadata exist; structured data and a dedicated social preview image were not found.
4. **Photography and branch content remain placeholders/empty.** Do not substitute invented details. The README documents missing authentic media and unverified current branch details.
5. **No automated test suite or CI workflow was found.** Current lint/type/build scripts are useful, but do not cover forms, permissions, persistence, uploads, responsive browser behavior, or regression workflows.

## Report 4 — Complete CMS gap analysis

| CMS module | Status | Audit finding |
|---|---|---|
| 1. Dashboard and overview | EXISTS BUT INCOMPLETE | Existing `/admin` has leadership, access, and applications sections; no CMS overview, summaries, or module navigation. |
| 2. Website pages (Home, About, Vision, Privacy, Terms) | DOES NOT EXIST | Pages and copy are source-managed; SEO metadata is code-defined. |
| 3. Programmes | DOES NOT EXIST | Static data and display only; no create/edit/publish/archive UI or persistence. |
| 4. Events and historical archive | EXISTS BUT INCOMPLETE | One static event and planned items; no event CRUD, publication state, or archive. |
| 5. Event schedules, speakers, reports, photographs | EXISTS BUT INCOMPLETE | Some static event facts/guests/activities exist. No event editor, reports, or managed media. |
| 6. Gallery albums, images, videos, captions | DOES NOT EXIST | Reusable static gallery component and placeholder data exist; no dedicated route, album/media records, or upload workflow. |
| 7. Leadership profiles, roles, photos, order | EXISTS BUT INCOMPLETE | Listing and add action exist; no edit/delete/order UI or upload. Current schema includes role, optional path, and display order. |
| 8. Branches | DOES NOT EXIST | Historical regions are static; `branches` is an empty array; no branch management. |
| 9. Membership applications | EXISTS BUT INCOMPLETE | Submit, store, view, and change status exist. Search, filters, pagination, internal notes, export, correction/deletion/retention are absent. |
| 10. Contact enquiries | DOES NOT EXIST | Configured email delivery only; no persistence or admin management. |
| 11. Announcements | DOES NOT EXIST | No announcement content model or display/admin workflow. |
| 12. Media library / Supabase Storage | DOES NOT EXIST | No bucket integration, upload/delete workflow, or media library. |
| 13. SEO and social previews | EXISTS BUT INCOMPLETE | Static metadata helper, Open Graph basics, robots, and sitemap exist; no per-content editing or structured data identified. |
| 14. Admin users and permissions | EXISTS BUT INCOMPLETE | Email allowlist and protected super-admin exist; no granular roles. Live account/configuration status not verified beyond login setup notice. |
| 15. Audit logs | DOES NOT EXIST | No application-level log table or admin-action audit trail found. |

## Report 5 — Database and Supabase plan

### Existing and source-verified structures

| Table | Source-defined purpose and important fields | Access model in migration |
|---|---|---|
| `leadership_members` | UUID id; unique name; constrained role; optional `photo_src`; `display_order`; creation timestamp; seeded leadership records. | RLS enabled; privileges revoked from `public`, `anon`, `authenticated`; grants to `service_role`. |
| `admin_access` | Normalized email primary key; `granted_by`; creation timestamp. | Same RLS/revoke/service-role pattern. |
| `membership_applications` | UUID id; name, email, phone, city, message; pending/reviewed/accepted/declined status; timestamps. A later migration adds age, education, interests, experience, and availability. | Same RLS/revoke/service-role pattern. |

Evidence: all four files under `supabase/migrations/`. No application foreign-key relationships, database functions, triggers, explicit indexes, or Storage policies were found in those migration files. Supabase system-managed objects and external configuration are outside this source review.

### Proposed structures — not present and not approved for creation

First inspect the **actual production schema and migration history**. Reuse an existing equivalent object if present; never create a duplicate based only on this proposal.

Possible additive model, subject to content and workflow decisions:

- Extend `admin_access` with role/capability information if multiple privilege levels are approved; do not replace the current sign-in or allowlist during the first implementation.
- Add `site_pages` (stable page key, structured content, SEO fields, publication state, updated-by/timestamps) for pages intentionally managed from the CMS.
- Add `programmes` and `events`, with publication/archive state; use related rows for event schedules/speakers/reports only if required by actual editorial needs.
- Add `gallery_albums` and `gallery_media` (album relationship, object key, safe media metadata, caption, alt text, ordering, visibility). Use Supabase Storage for file bytes, not database blobs.
- Add `branches` only when verified branch data is supplied.
- Add `contact_enquiries` if the organisation chooses database-backed inbox/review; define recipient workflow and retention first.
- Add `announcements` only if its publishing/scheduling behavior is agreed.
- Add `admin_audit_log` for actor, action, entity, timestamp, and minimal metadata; do not log secrets or applicant payloads unnecessarily.
- Add membership consent evidence/version/timestamp and any guardian-consent fields only after the organisation establishes approved safeguarding and legal requirements. Plan backfills as nullable/additive; do not fabricate historical consent.

### RLS and Storage requirements for a future design

- Keep all applicant and contact records private. Public clients must not be able to query them.
- Enforce administrator authorization server-side for every read and write; use granular capabilities if approved. Do not rely on hidden UI controls.
- Keep service-role credentials server-only. Add least-privilege data access and audit trails.
- Public, approved site images may use a read-public asset strategy; uploads, replacement, and deletion must require an authorized server-side action.
- Never store membership documents or sensitive personal information in a public media bucket. Use private buckets and signed access if such files are ever required.
- Validate file size, MIME type and actual content, allowed extension, dimensions where appropriate, object path, and authorization. Add quotas and safe replacement/deletion behavior.
- No Storage bucket, object, policy, or configuration was inspected or changed. Presence of external buckets is **not verified**.

### Production verification required before migrations

Obtain owner-approved, read-only production schema/migration inspection; confirm existing rows and dependencies without exporting personal data; verify current RLS, grants, Auth sign-up settings, buckets, and backups/restore. Record a backup and rollback plan before any schema change. No migration was executed.

## Report 6 — Exact file-by-file implementation plan

Paths under **New file (proposed)** do not currently exist. Create only the subset required by an approved design. Exact database object names remain proposals pending production inspection.

| Priority / phase | Existing file or proposed new file | Current purpose | Required change | Dependencies | Risk |
|---|---|---|---|---|---|
| P0 / 1 | `package.json`, `README.md`, `src/app/layout.tsx`, `src/app/globals.css` | Scripts/docs, root layout, shared design system | Preserve stack and baseline; document workflows; add tests/accessibility only within approved scope. No framework replacement. | None | Low |
| P0 / 1 | `src/app/admin/page.tsx`, `src/app/admin/login/page.tsx`, `src/app/admin/login/admin-login-form.tsx`, `src/app/admin/actions.ts`, `src/proxy.ts`, `src/lib/supabase/server.ts` | Existing admin, auth, authorization, server actions | Establish staging regression baseline first. Later add CMS navigation and capability checks while preserving login, session behavior, super-admin protection, and existing actions. | Live Auth/config verification | High: lockout or privilege regression |
| P0 / 2 | `src/app/api/applications/route.ts`, `src/app/api/contact/route.ts`, `src/components/applications/application-form.tsx`, `src/components/contact/contact-form.tsx` | Public submission, validation, user feedback | Add approved body-size enforcement and abuse controls; retain server validation; implement consent evidence and operational feedback only after policy requirements are confirmed. | Rate-limit provider/design; approved consent policy | High: public intake and personal data |
| P0 / 2 | `src/app/admin/application-review.tsx`, `src/app/admin/page.tsx`, `src/app/admin/actions.ts`, `supabase/migrations/` | Application listing/status action; existing schema migrations | Add pagination/search/filter with bounded queries; define retention/delete/correction process and audit behavior; additive schema only after backups and prod inspection. | Production schema, migration approval, retention policy | High: applicant data loss/exposure |
| P1 / 3 | `src/app/admin/page.tsx`, `src/app/admin/actions.ts`, `src/app/admin/admin-access-manager.tsx`, `src/lib/supabase/server.ts` | One admin screen and email allowlist | Add navigation/overview and explicit capabilities; preserve existing auth and protected super-admin. | Approved roles and admin workflows | High: authorization regression |
| P1 / 3 | **New (proposed):** `src/components/admin/admin-navigation.tsx`, `src/app/admin/content/page.tsx` | No CMS navigation or CMS overview currently | Add module navigation and content overview within the existing `/admin` system; retain `/admin` and its auth boundary. | Approved module order and authorization helper | Medium |
| P1 / 3, 9 | `src/app/en/page.tsx`, `src/app/about/page.tsx`, `src/app/vision/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`; `src/data/organisation.ts`, `src/data/vision.ts` | Public page rendering and source-managed copy | Add dynamic page reads only after content schema/editor/publish model is approved; retain static facts as fallback only if a deliberate migration strategy is chosen. Do not invent copy. | Content model, approved content | High: public misinformation/content regression |
| P1 / 4 | `src/app/events/page.tsx`, `src/data/events.ts`; **New (proposed):** `src/app/admin/events/page.tsx`, `src/app/admin/events/actions.ts`, `src/components/admin/event-form.tsx` | Static event display/data | Add event CRUD, status, archive, and public rendering. Add event details/reports only per confirmed requirements. | Event schema and content verification | Medium |
| P1 / 5 | `src/app/programmes/page.tsx`, `src/data/programmes.ts`, `src/components/programmes/programme-theme-grid.tsx`; **New (proposed):** `src/app/admin/programmes/page.tsx`, `src/app/admin/programmes/actions.ts`, `src/components/admin/programme-form.tsx` | Static activities and initiative display | Add approved programme CRUD and publish/archive flow; preserve distinction between current activity and planned initiative. | Programme model and verified content | Medium |
| P1 / 5 | **New (proposed):** `src/app/admin/announcements/page.tsx`, `src/app/admin/announcements/actions.ts`, `src/components/admin/announcement-form.tsx` | No announcement feature | Define announcement audience, scheduling, expiry, and archive before implementation. | Approved requirements and content schema | Medium |
| P1 / 6 | `src/components/ui/photo-gallery.tsx`, `src/data/photo-galleries.ts`, `src/types/photo.ts`, `src/app/en/page.tsx`, `src/app/about/page.tsx`, `src/app/programmes/page.tsx`, `src/app/events/page.tsx`, `src/app/branches/page.tsx`; **New (proposed):** `src/app/gallery/page.tsx`, `src/app/admin/gallery/page.tsx`, `src/app/admin/gallery/actions.ts`, `src/components/admin/gallery-album-form.tsx`, `src/components/admin/media-upload-form.tsx` | Embedded galleries/placeholders and static photo types | Build standalone album route and managed media only after approved assets, captions/alt text, Storage bucket, and policies are defined. | Approved media, Storage config/policy, album model | High: public/private media access |
| P1 / 7 | `src/app/leadership/page.tsx`, `src/app/admin/member-form.tsx`, `src/app/admin/actions.ts`, `src/components/ui/committee-member-card.tsx`, `src/data/leadership.ts`, `src/lib/leadership.ts`; **New (proposed):** `src/components/admin/leadership-member-editor.tsx` | Public member listing and admin add; fallback list | Add edit/delete/order and Storage-managed photo UX with confirmation; preserve present seed/fallback and unique-name/role constraints deliberately. | Production leadership rows, approved portraits, Storage | High: existing records/media |
| P1 / 7 | `src/app/branches/page.tsx`, `src/data/branches.ts`; **New (proposed):** `src/app/admin/branches/page.tsx`, `src/app/admin/branches/actions.ts`, `src/components/admin/branch-form.tsx` | Static historical regions; empty branch array | Add CRUD only when verified active branch/contact information is supplied. Distinguish history from current locations. | Approved branch data/schema | Medium |
| P1 / 8 | `src/app/admin/application-review.tsx`, `src/app/admin/actions.ts`, `src/app/admin/page.tsx`; **New (proposed):** `src/components/admin/application-filters.tsx` | Review all submissions, status-only update | Add approved search, filters, pagination, internal notes, retention/export behavior; limit PII in query/render. | Retention/access policy, bounded query design | High: PII handling |
| P1 / 8 | `src/app/api/contact/route.ts`, `src/app/contact/page.tsx`; **New (proposed):** `src/app/admin/enquiries/page.tsx`, `src/app/admin/enquiries/actions.ts`, `src/components/admin/enquiry-list.tsx` | Email-only contact delivery | Add persisted inbox only if desired; define delivery retry/failure, notification, retention, access, and duplicate handling. | Owner decision, DB and email configuration | High: personal enquiries |
| P2 / 9 | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/metadata.ts`, page modules; **New (proposed):** `src/app/opengraph-image.tsx` only if a verified share image is approved | Static SEO metadata and routes | Generate canonical sitemap entries from published content; add social preview/structured data where verified. Keep admin/private routes excluded. | Stable public URL and publish-state query | Medium |
| P2 / 10 | `src/app/globals.css`, `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, shared UI components | Shared styling/navigation | Accessibility and responsive refinement after browser/device checks; preserve identity and reduced-motion behavior. | Approved design/content assets | Low/Medium |
| P2 / 11 | **New (proposed):** `tests/public-routes.test.ts`, `tests/admin-actions.test.ts`, `tests/application-api.test.ts`, `tests/contact-api.test.ts`, `tests/fixtures/`; `.github/workflows/ci.yml` | No automated tests/CI identified | Add route/component/unit tests and staging workflow coverage before broad CMS rollout. These proposed test filenames assume a TypeScript-capable runner; select tooling only after an explicit dependency decision. | Approved tooling and staging environment | Medium |
| P0 / before any DB phase | **New migration files under `supabase/migrations/`, using the actual next remote migration version (names not assigned in this audit)** | Four existing migrations | Add additive, ordered migrations for approved models/fields/policies. Reuse verified production structures; no destructive rename/drop/recreate. | Backup, schema diff, migration review, rollback | High |

### Existing migrations reviewed

- `supabase/migrations/202611020001_create_leadership_members.sql`
- `supabase/migrations/202611020002_create_admin_access.sql`
- `supabase/migrations/202611020003_create_membership_applications.sql`
- `supabase/migrations/202611020004_add_application_details.sql`

### Configuration and deployment files reviewed

`package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `.env.example`, and `README.md`. Environment-variable names are documented in the project; secret values were not included in this report. `.env.local` was not read or printed.

## Report 7 — Final implementation roadmap

The requested phases are retained, with a verification gate inserted before production-dependent work.

1. **Protect existing functionality and establish baseline.** Keep current branch/commit, retain admin/auth and routes, add regression coverage, confirm staging configuration, and document expected current behavior.
2. **Security, privacy, and backend foundations.** Confirm consent/safeguarding and retention policy; design bounded request handling, rate limits, role model, and audit requirements. Test against staging.
3. **CMS infrastructure and dashboard navigation.** Extend the current dashboard; establish capability checks, content model, publish workflow, validation, and migration/backups after production schema review.
4. **Events and historical event archive.** Model confirmed events separately from planned initiatives; preserve explicit unknown dates and verified historical facts.
5. **Programmes and announcements.** Add only agreed content/publishing requirements; do not relabel planned activities as delivered programmes.
6. **Gallery and Supabase Storage.** First receive approved assets and establish public/private policies; then implement album/media CRUD and the `/gallery` page.
7. **Leadership and branches.** Extend the current leadership workflow without replacing its source; add verified branch management only when current data is approved.
8. **Membership and contact enquiry management.** Improve bounded private application review and decide whether enquiries should be persisted. Protect PII and test all permissions.
9. **Public website dynamic content integration.** Connect public routes to published records with safe empty/error behavior; preserve existing public URLs and content integrity.
10. **SEO, accessibility, responsive design, and performance.** Verify metadata, canonical URL, sitemap/robots, structured data, keyboard/screen-reader usability, mobile layouts, and image performance.
11. **Testing, staging, backup, and production-readiness review.** Exercise auth, roles, CRUD, persistence, file access, emails, retention, and public routes. Verify backup/restore and rollback. Obtain explicit deployment approval.

No new dashboard, framework replacement, duplicate table, or destructive migration is recommended.

## Report 8 — Final readiness decision

### Must be resolved before implementation

- Confirm which CMS modules are in scope and in what order.
- Agree on applicant consent/under-18 safeguarding and personal-data retention/deletion.
- Establish whether contact enquiries should be persisted or remain email-only.
- Obtain approved photography and verified current branch/contact/event content.

### Safe first implementation work

- Add non-destructive tests and staging verification around current routes and admin actions.
- Improve UX/accessibility and static UI without changing persistence or auth semantics.
- Design pagination/rate limiting and roles against existing APIs before changing their behavior.

### Requires organisational confirmation

- Factual copy, current leaders and designations, branch locations and contacts, event year/schedule, photographs and usage permissions.
- Legal/privacy wording, retention durations, guardian requirements, and enquiry workflow.
- Admin role capabilities and who may read or manage applicant details.

### Requires Supabase/production verification

- Actual schema, migration history, records, grants, and RLS.
- Auth account and signup settings; current production admin access.
- Storage buckets, policies, file inventory, and ownership.
- Service configuration, Resend delivery, backups, restore, retention, and rate/WAF controls.

### Never change without explicit approval

- Production database records or schema; never drop, reset, or recreate tables to force a migration.
- Authentication configuration, admin grants, service-role credentials, Storage access policies, or personal-data retention.
- Live content that represents organisational facts, identities, or statistics.
- Production deployment or any destructive data/media operation.

## Audit execution record

### Git status before audit/report creation

- Branch: `main`
- HEAD: `dfe9aa0`, tracking `origin/main`
- Working tree: clean (`git status --short` produced no entries)
- Existing remote: configured; no remote changes were made.

### Validation and observations

- `npm run lint` — **PASS**
- `npx tsc --noEmit` — **PASS**
- `npm run build` — **PASS**; Next.js generated the existing application routes.
- Public production GET checks — the route/status results are recorded above. No POST, sign-in, or private-data access was performed.

### Files changed

- `FINAL_WEBSITE_AUDIT.md` — created as the requested report after confirming a clean worktree.

No source code, package/dependency manifest, database, Storage, authentication, environment, Git branch/commit/remote, or production site was changed. No migration was run and no deployment was performed.
