# CMS Implementation Report — Poornakanya Pratishthan

**Report date:** 2 November 2026
**Scope:** Local source-code implementation only
**Production changes:** None

## Summary

This work adds safe CMS groundwork to the existing Next.js and Supabase website without replacing its architecture or creating fictional organisational content. It improves membership application review, bounds JSON request bodies on two public APIs, and adds a public Gallery route with an explicit empty state.

This is a partial foundation, not a complete CMS. No production database, authentication configuration, Storage policies, deployment, or applicant records were changed or accessed.

## Work completed

### Membership application administration

- The admin dashboard now loads a bounded first page instead of retrieving every application.
- Application pages contain at most 20 records and show an exact filtered count.
- Administrators can search applicant names and filter by application status.
- Search is performed by an authorized server action; applicant search terms are not put in a URL.
- Server-side validation checks search input, page number, and status before querying.
- Status changes continue to use the existing server-side authorization and update flow.
- Supabase query errors are surfaced in the admin UI or reported by the server rather than converted to successful empty results.

### Request body limits

- Added a reusable streamed JSON reader that rejects declared or actual payloads above a byte limit.
- Application requests are limited to 8,000 bytes.
- Contact requests are limited to 12,000 bytes.
- Oversized requests receive HTTP 413; malformed JSON receives HTTP 400.
- The existing application persistence and Resend email-delivery behavior remains in place.

### Public Gallery

- Added `/gallery` with a clear empty state explaining that approved photographs are not yet published.
- Added Gallery to public navigation, breadcrumbs, and the sitemap.
- No placeholder or unverified photos were introduced.

## Files changed

| File | Change |
|---|---|
| `src/app/admin/actions.ts` | Added authorized, validated membership-application search action. |
| `src/app/admin/application-review.tsx` | Added name search, status filtering, pagination controls, and status-update refresh behavior. |
| `src/app/admin/page.tsx` | Replaced the unbounded application query with the first bounded page. |
| `src/lib/admin-applications.ts` | Added shared server-side pagination and filtering query logic. |
| `src/app/api/applications/route.ts` | Added streamed request-body size enforcement. |
| `src/app/api/contact/route.ts` | Added streamed request-body size enforcement while retaining Resend delivery. |
| `src/lib/request-json.ts` | Added the bounded JSON request-body reader. |
| `src/app/gallery/page.tsx` | Added the public Gallery page and honest empty state. |
| `src/data/site.ts` | Added Gallery to public navigation. |
| `src/components/ui/breadcrumbs.tsx` | Added the Gallery breadcrumb label. |
| `src/app/sitemap.ts` | Added `/gallery` to the public sitemap. |
| `src/app/globals.css` | Added Gallery empty-state and application filter/pagination styles. |

The existing untracked `FINAL_WEBSITE_AUDIT.md` was preserved and not modified as part of this report.

## Validation performed

| Check | Result |
|---|---|
| `npm run lint` | Passed with no warnings. |
| `npx tsc --noEmit` | Passed. |
| `npm run build` | Passed; Next.js generated the Gallery and existing site routes. |
| `git diff --check` | Passed. |
| Local malformed application JSON | Returned HTTP 400. |
| Local malformed contact JSON | Returned HTTP 400. |
| Local oversized application JSON | Returned HTTP 413. |
| Local chunked oversized contact request | Returned HTTP 413. |
| Local Gallery route | Returned HTTP 200 and rendered the empty-state message. |
| Local sitemap | Included `/gallery`. |

The API tests used only invalid or oversized synthetic requests. No valid application was submitted and no contact email was sent. No production service was used for these tests.

## Not implemented

The following items remain outside this implementation:

- CMS management for public pages, events, programmes, announcements, or SEO metadata.
- Standalone event and programme detail pages backed by CMS data.
- Album creation, media library, uploads, replacement, or deletion.
- Supabase Storage bucket or policy configuration.
- Leadership editing, deletion, ordering, or image uploads.
- Branch management; no branch details were invented.
- Contact enquiry database persistence; contact remains email-delivery based.
- Administrative audit log.
- Membership internal notes, export, retention, or deletion workflows.
- Rate limiting, consent evidence/version capture, and under-18 guardian workflow.
- New database schemas, migrations, or production schema verification.

## Decisions and approvals still required

Before implementing gated features, confirm:

1. Approved membership consent wording/version and any under-18 guardian process.
2. Personal-data retention, correction, and deletion rules.
3. Whether contact enquiries may be stored, and their retention policy.
4. Administrator roles and permissions, if roles beyond the existing access model are desired.
5. Verified branch and leadership information and authorised photographs.
6. Verified event dates, reports, and approved programme content.
7. Actual production database schema, migration history, backup, and rollback arrangements.
8. Approved Storage bucket names, access model, and policies.

No schema or Storage configuration should be applied until production state and approvals are verified.

## Production and repository safety

- No migrations were created or executed.
- No production database, Auth settings, Storage buckets, policies, or environment variables were changed.
- No deploy, push, or commit was performed.
- No applicant records or credentials were accessed or included in this report.
