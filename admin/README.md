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

## Checks and production preview

```powershell
npm run typecheck
npm run build
npm run preview
```

The generated static frontend is written to `dist/`. Deploy it separately from
the public website; route configuration and hosting are not included yet.

## Prototype limitations

All records are clearly identified as demo data. Search, navigation, sidebar
collapse, filters, theme preference, and modal previews operate locally in the
browser. There is no authentication, database, upload/storage, publishing,
email, or real enquiry handling. Form submissions do not persist data. Do not
enter real customer or business information. `.env.example` contains no
credentials and no backend is configured.

Before using this interface with real information, implement and review a
backend, role-based authorization, secure storage, server-side validation, and
production backups.
