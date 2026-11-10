# Hari Om Enterprises · Admin Studio

A standalone React, TypeScript, and Vite frontend prototype. It runs separately
from the existing static public website and does not change or replace it.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```powershell
cd admin
npm install
npm run dev
```

Open the local URL printed by Vite (by default, <http://127.0.0.1:5173>).
The admin app is mounted at <http://127.0.0.1:5173/admin/>.

## Checks and production preview

```powershell
npm run typecheck
npm run build
npm run preview
```

The generated static frontend is written to `dist/`. Deploy the contents of
`dist/` at the `/admin/` URL prefix, separately from the public website. See
[DEPLOYMENT.md](./DEPLOYMENT.md) for path mapping and current hosting status.

## Authentication setup

The login uses Supabase Auth password sign-in and checks each signed-in user
against the RLS-protected `public.admin_memberships` table. Public sign-up is
not implemented. With no Supabase environment configured, the admin remains
locked and does not display its screens.

1. Create a Supabase project and configure `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY` in a local `admin/.env.local` file or the
   admin Vercel project's environment variables. Only use the project URL and
   publishable key; never put a service-role key in the browser.
2. Apply `supabase/migrations/20261110000000_admin_memberships.sql` to the
   project.
3. Invite the owner from Supabase Auth (do not enable public sign-up). Add the
   invited Auth user's UUID and assigned role to `public.admin_memberships`
   using the Supabase SQL editor or a trusted administrative process. Browser
   users have select-only access to their own active membership.
4. Build and verify the app. A successful sign-in redirects to
   `/admin/dashboard`; an account without an active membership is denied.

The migration protects only admin membership lookup. The current module
content is still clearly labelled demo data and has no database, upload/storage,
publishing, email, or real enquiry handling. Before storing real business or
customer data, add and test RLS policies for every table and storage bucket,
server-side input validation, audit logging, backups, and appropriate MFA.
Client-side routing is not an authorization boundary for future resources.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting constraints.
