# Poornakanya Pratishthan

An English-language institutional website built with Next.js App Router, React
and TypeScript.

## Development

```bash
npm install
npm run dev
```

The root URL redirects to `/en`. The English homepage is at `/en`; English pages
use `/about`, `/programmes`, `/events`, `/leadership`, `/branches`, `/vision`,
`/contact` and `/apply`. Legacy `/mr` URLs redirect to their English equivalents.

## Content

Organisation information is stored in `src/data/`. It includes the establishment
date, founder, eligibility age, objectives, programmes, committee names and
designations, the Saraswati Mahotsav event details, historical regional
expansion and the five-year priorities.

The historical figures of 30 branches and 500 members are explicitly labelled
as initial-phase figures, never current totals. The Saraswati Mahotsav year was
not supplied and is not inferred. Committee data contains only full names, official designations, and optional
approved individual portrait paths; do not add personal biographies or contact
details. Event photographs and current branch details require verified
organisational assets before publication. The current brand mark and abstract
homepage illustration are replaceable design artwork, not the organisation's
supplied official logo or photographs.
The leadership cards each have an individual photo space above the member's
name.

## Photography

The project currently contains no authentic organisation or event photographs.
Photo galleries on the home, About, Programmes, Events and Branches pages show
clearly marked spaces until suitable approved images are supplied. Add photos
under `public/images/` and set each corresponding `src` in
`src/data/photo-galleries.ts` (for example, `/images/saraswati-mahotsav-01.jpg`).
Use verified descriptions for alt text and captions. To add an approved
committee portrait, place it under `public/images/leadership/` and set that
member's `photoSrc` in `src/data/leadership.ts`, for example
`/images/leadership/bhavana-ramnath-iyer.jpg`.

The footer lists Instagram, Facebook and Twitter by name. Set the verified
`handle` and profile `url` for each entry in `socialLinks` in `src/data/site.ts`
to show the handle and make them working links.

## Environment and contact form

Copy `.env.example` to `.env.local` and set values as available:

- `NEXT_PUBLIC_SITE_URL`: canonical production origin, used for metadata and sitemap.
- `NEXT_PUBLIC_CONTACT_EMAIL`: official public email shown on the contact page.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase project URL and publishable/anon key, used for admin authentication.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase service role key for the leadership database. Never expose this key in client code or commit it.
- `SUPER_ADMIN_EMAIL`: email address of the protected super-admin account.
- `CONTACT_EMAIL`: private recipient address for submitted enquiries.
- `RESEND_API_KEY`: server-side API key for Resend.
- `RESEND_FROM_EMAIL`: verified sender address for Resend.

The contact form remains disabled until all three server-side email settings
are configured. Do not publish personal contact details.

## Membership applications

The public application form is available at `/apply`. It
collects an applicant's name, email, phone number, city, and a short message.
Submissions require consent and are stored in the private
`membership_applications` table for review in `/admin`; they are not emailed or
published automatically. Admins can update an application's review status.
Run `supabase/migrations/202611020003_create_membership_applications.sql` in
the configured Supabase project before accepting applications. Run
`supabase/migrations/202611020004_add_application_details.sql` after it to add
the detailed application fields: age, education/occupation, interests, relevant
experience, availability, and motivation. Keep the service-role key server-only.

## Leadership admin

The admin panel at `/admin` requires a Supabase project, the protected
`SUPER_ADMIN_EMAIL` account, and the admin-access migration:

1. Create a Supabase project and copy its project URL, publishable/anon key, and
   service role key into `.env.local` using the variables in `.env.example`.
2. Set `SUPER_ADMIN_EMAIL` to your own email address. This account is protected
   and cannot be removed through the admin panel.
3. Run all SQL migrations in `supabase/migrations/` in order. They create the
   leadership, admin-access, and private membership-application tables and
   application detail fields.
4. In Supabase Authentication, create an account for the super admin. Keep
   public sign-ups disabled.
5. Restart the application and sign in at `/admin/login`. Admins can then grant
   or revoke access for existing Supabase Auth accounts in the admin panel.
   All panel administrators can add committee members and grant or revoke
   admin access; only the configured super-admin account is protected from
   removal.

The form adds a member's full name, official designation, and optional local
portrait path. Place approved portraits under `public/images/` before entering
their `/images/...` path. New records appear on the leadership page and
home-page committee preview. If Supabase is entirely
unconfigured, public pages retain the built-in committee list; partially
configured Supabase settings or database errors are reported rather than
silently falling back.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Do not deploy or publish the site until the organisation has reviewed the
content, supplied remaining verified materials, and configured its production
domain and contact delivery.
