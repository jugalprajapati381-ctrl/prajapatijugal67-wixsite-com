# Admin deployment and access status

## Vercel project setup

The repository is configured as a single Vercel project rooted at the
repository root. `vercel.json` runs the separate admin build, then
`admin/scripts/prepare-vercel-output.mjs` stages the existing public website
unchanged alongside the admin build at `/admin/`. The script excludes Git and
admin source/dependency folders from the deployment output. Vercel serves the
public website from the output root and the admin app from its `/admin/`
subdirectory.

Keep the Vercel project's **Root Directory** set to the repository root.
`vercel.json` supplies the admin install/build commands, output directory,
`/admin` and nested-route SPA rewrites. Verify the
project's production branch and environment variables before deployment.
The previously checked `www.hariomenterprises.com` resolved to a HugeDomains
listing; the DNS must be pointed to the verified Vercel project before the
domain can serve this deployment. Domain DNS has not been changed by this
repository update.

The public footer's **Owner Login** link points to `/admin`. Vite builds the
separate admin app with an `/admin/` asset base; its client routes include
`/admin/dashboard`, `/admin/booklets`, `/admin/materials`, `/admin/projects`,
`/admin/media`, `/admin/videos`, `/admin/enquiries`, and `/admin/settings`.
Other existing prototype screens also have route rewrites.

## Hosting requirements

For each deployment, Vercel builds `admin/dist/`, then stages the root public
site and admin artifact together under `admin/vercel-output/`. The checked-in
rewrites target only known admin client routes; they do not rewrite public
routes or the admin asset directory. Test the Vercel preview's `/`, `/admin`,
`/admin/dashboard`, and each module refresh before promoting to production.

## Authentication and data access

The frontend supports Supabase Auth password sign-in and requires an active row
in the RLS-protected `public.admin_memberships` table before rendering admin
screens. With no environment variables, it remains locked. The membership
policy permits authenticated users to read only their own active membership;
browser clients cannot create or change roles. Set up the provider and invite
users as described in [README.md](./README.md).

This does not make the demo module data persistent or implement backend
operations. Do not connect real customer/content data until every API, database
table and storage bucket has server-side authorization/RLS, safe input handling,
and tested backup and recovery. No business content, uploads, enquiries or
admin audit records are currently stored by this app.

## Independent deployments

The admin source, dependencies, and Vite build remain isolated under `admin/`,
but this single-domain Vercel deployment intentionally stages both sites into
one static output directory. Public HTML and assets remain separate files;
only the requested Owner Login footer link and its styling were added to the
public source.
