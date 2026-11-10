# Admin deployment and access status

## Current status

The repository contains no hosting, reverse-proxy, or deployment configuration.
The configured public domain was checked on November 10, 2026 and currently
redirects to a HugeDomains domain listing. There is therefore no verified
production host on which to install a rewrite or proxy rule. Do not deploy this
admin app to that hostname until its ownership, DNS, and hosting have been
confirmed.

The public footer's **Owner Login** link points to `/admin`. Vite builds the
separate admin app with an `/admin/` asset base; its client routes include
`/admin/dashboard`, `/admin/booklets`, `/admin/materials`, `/admin/projects`,
`/admin/media`, `/admin/videos`, `/admin/enquiries`, and `/admin/settings`.
Other existing prototype screens also have their own route paths.
The standalone Vite server and preview normalize `/admin` to `/admin/`.

## Hosting requirements

Deploy the contents of `admin/dist/` at the `/admin/` URL prefix, or reverse
proxy that prefix to an independently deployed admin frontend. Configure a
single-page-application fallback for `/admin/*` to the admin app's
`index.html`, so refreshing nested admin routes works. Keep the existing public
site's document root and root-level routes unchanged. Do not rewrite public
routes such as `/` to the admin app.

The exact rewrite/proxy syntax depends on the verified hosting platform. No
provider-specific rewrite is included because the current host is unknown.
Before enabling it, test both a public URL and direct refreshes of `/admin`,
`/admin/dashboard`, and each admin module.

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

Build and publish the admin artifact from the `admin/` project independently
from the static public website. Preserve the public site's root document and
assets when updating the `/admin/` artifact. Configure the chosen host's
deployment pipeline to publish only the admin build to the admin path or
admin-specific origin behind the `/admin/` proxy.
