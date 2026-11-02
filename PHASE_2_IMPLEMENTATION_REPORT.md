# Phase 2 Implementation Report — CMS Foundation

**Date:** 2 November 2026
**Scope:** Local code changes only
**Production services changed:** None

## Summary

Phase 2 adds an authenticated CMS workspace around the existing `/admin` dashboard while preserving the existing Next.js, React, TypeScript, Supabase, public routes, and membership/leadership workflows.

The admin now has a responsive sidebar, breadcrumb, account header, navigation for existing and planned modules, a dashboard overview using current record counts, and route-level loading/error states. Modules without a complete backend workflow are explicitly marked **Planned** and are not presented as editable.

This is a CMS foundation, not a complete CMS. No database or Storage schema was changed, and no production services, records, credentials, or applicant data were accessed.

## Dashboard features implemented

- Added an `/admin` workspace shell with responsive sidebar navigation, mobile disclosure navigation, account identity, sign-out, breadcrumb, and main-content landmark.
- Added overview cards using the existing exact membership-application count and the existing leadership query result. No placeholder statistics are shown.
- Integrated existing membership application search, status filtering, pagination, and status updates.
- Integrated the existing leadership listing and member-add form. The dashboard explicitly notes that leadership edit, delete, ordering, and image uploads are not available.
- Kept existing administrator access management available.
- Added meaningful loading, empty, and error states.
- Labeled the following CMS modules as planned/unavailable: Website Pages, Events, Programmes, Gallery management, Announcements, Contact Enquiries, Media Library, SEO Settings, and Admin Activity.
- Hid public-site header/footer chrome on `/admin` routes so the CMS has a dedicated workspace. Public pages retain the existing header, footer, and scroll behavior.

## Authentication and authorization

- Preserved Supabase sign-in, session refresh, allowlist authorization, and protected super-admin behavior.
- Added a server-side authorization gate to the `/admin` route-group layout. Unauthenticated or unauthorized access redirects to `/admin/login`.
- Kept `/admin/login` outside the protected route group so users can still sign in.
- Retained the dashboard's own authorization check and existing authorization checks within sensitive server actions. Client-side navigation visibility is not used as a permission boundary.
- Reviewed all existing admin server actions. Sign-in remains public by design; sign-out only ends the current session; administrator grant/revoke, leadership addition, application search, and status updates verify authorization server-side.
- No roles or additional permissions were invented.

## Existing functionality preserved

- Existing admin login route, form, Supabase session handling, and sign-in actions.
- Existing administrator allowlist management and protected super-admin behavior.
- Existing membership application review and status-update workflow, including Phase 1 bounded pagination/search.
- Existing leadership listing and add-member workflow.
- Existing public routes and public-page layout behavior.
- Existing application submission and Resend contact-email workflows.
- Existing Phase 1 Gallery empty state, navigation, breadcrumb, sitemap entry, and streamed request-size limits.

## Files created

- `src/app/admin/(workspace)/layout.tsx` — server-side admin authorization gate and protected workspace layout.
- `src/app/admin/(workspace)/page.tsx` — dashboard overview and existing admin modules; retains the `/admin` URL through a route group.
- `src/app/admin/(workspace)/loading.tsx` — dashboard loading state.
- `src/app/admin/(workspace)/error.tsx` — retryable, non-sensitive dashboard error state.
- `src/app/admin/(workspace)/admin-workspace.css` — responsive workspace styles using existing site colors and typography.
- `src/components/admin/admin-navigation.tsx` — shared module navigation with available/planned indicators.
- `src/components/admin/admin-shell.tsx` — common CMS header, navigation, breadcrumbs, and sign-out.
- `src/components/layout/site-chrome.tsx` — preserves public site chrome and excludes it from admin routes.
- `PHASE_2_IMPLEMENTATION_REPORT.md` — this report.

Phase 1 files already present and preserved:

- `src/lib/request-json.ts`
- `src/lib/admin-applications.ts`
- `src/app/gallery/page.tsx`

## Files modified

- `src/app/layout.tsx` — delegates public/admin chrome selection to `SiteChrome`.
- `src/app/admin/login/page.tsx` — added the main-content target for the skip link; login remains outside the protected workspace layout.
- `src/app/admin/page.tsx` — moved into the `(workspace)` route group; the public route remains `/admin`.
- `src/app/admin/actions.ts` — Phase 1 authorized application-search server action.
- `src/app/admin/application-review.tsx` — Phase 1 search, filtering, pagination, and status refresh.
- `src/app/api/applications/route.ts` — Phase 1 streamed request-body limit.
- `src/app/api/contact/route.ts` — Phase 1 streamed request-body limit; email delivery retained.
- `src/app/globals.css` — Phase 1 filter/pagination and Gallery styling.
- `src/app/sitemap.ts` — Phase 1 Gallery route entry.
- `src/components/ui/breadcrumbs.tsx` — Phase 1 Gallery breadcrumb.
- `src/data/site.ts` — Phase 1 Gallery navigation entry.

The existing untracked `FINAL_WEBSITE_AUDIT.md` and `CMS_IMPLEMENTATION_REPORT.md` were preserved; neither was overwritten.

## Planned modules

These are navigation placeholders only; they do not have implemented content CRUD or persistence:

- Website page editing and publishing.
- Events and event archive.
- Programme management.
- Gallery albums and media management.
- Announcements.
- Contact enquiry inbox. Contact messages continue to use email delivery only.
- Media library and Supabase Storage uploads.
- SEO settings.
- Administrative activity/audit log.

Leadership management remains partial: listing and adding are available; editing, deletion, ordering, and image uploads are not.

## Database and Storage

- No database schema changes or migrations were needed for the CMS shell, so no database proposal was created in this phase.
- No migrations were created or executed.
- No production database, RLS policy, Auth configuration, Storage bucket, Storage policy, environment variable, or stored record was changed.
- A later phase requiring new tables must first verify the actual production schema/migration history and obtain approval. Storage uploads remain blocked on approved buckets and policies.

## Validation results

| Validation | Result |
|---|---|
| `npm run lint` | Passed. |
| `npx tsc --noEmit` | Passed after Next.js regenerated route types. |
| `npm run build` | Passed; Next.js generated `/admin` and `/admin/login` as dynamic routes, with the public routes retained. |
| `git diff --check` | Passed. |
| Local unauthenticated `GET /admin` with Supabase credentials blanked for the server process | Returned 307 redirect to `/admin/login`; no Supabase data request was made. |
| Local `/admin/login` page | Rendered the sign-in form and unconfigured notice with the CMS shell excluded. |
| Local public `/en` page | Rendered with the existing public header/footer and navigation. |

No valid form submission, administrator sign-in, Supabase query, production route, applicant record, or contact email was used for testing. The authenticated dashboard's visual state and production Auth behavior were not tested because that would require real admin credentials and could access private data.

## Remaining risks and approvals

1. Confirm production schema, migration history, RLS, backups, and rollback plans before any database-backed CMS work.
2. Obtain approved Storage bucket names, access policies, and media permissions before upload features.
3. Confirm approved consent and under-18 safeguarding procedures, plus personal-data retention/correction/deletion rules.
4. Decide whether contact enquiries may be stored and define access/retention policy before implementing an inbox.
5. Confirm administrator capabilities before introducing roles.
6. Supply verified page copy, event dates/reports, programme details, branches, leadership updates, and authorised photographs.
7. Add automated tests and staging coverage before production rollout; the repository currently has no configured test runner.

No commit, push, deployment, migration, production operation, or destructive action was performed.
