# EMMYFAD Global Enterprise — Project Notes

## Overview

Portfolio + service-request + admin web app for **Fadirepo Emmanuel Opeyemi**'s
Lagos-based marine engineering firm, **EMMYFAD Global Enterprise**.

Public site: business profile, 7 service pages with contract-request forms,
contact page with Leaflet map. Admin dashboard: requests, contacts, messages,
payments, audit log.

## Stack

- **Frontend**: React 19 + Vite + Tailwind v4 + shadcn/ui, Wouter routing,
  TanStack Query, Framer Motion, react-leaflet (OpenStreetMap tiles).
- **Backend**: Node.js, Express 5, Pino logging, Zod validation.
- **Database**: PostgreSQL with Drizzle ORM (managed via `pnpm --filter @workspace/db run push`).
- **API contract**: OpenAPI 3.1 in `lib/api-spec/openapi.yaml` → Orval codegen
  → typed React Query hooks in `@workspace/api-client-react` and Zod schemas
  in `@workspace/api-zod`.
- **Auth**: Clerk (email + password). Setup managed by Clerk Replit blueprint.
- **Payments**: Stripe Checkout. Server gracefully degrades when
  `STRIPE_SECRET_KEY` is missing — payment requests are saved as drafts with
  a clear note instead of crashing.
- **Maps**: Leaflet + react-leaflet (default marker icons fixed via
  `L.Icon.Default.mergeOptions`).

## Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| `artifacts/api-server` | `/api/...` | Express API server |
| `artifacts/emmyfad` | `/` | Public site + admin dashboard |
| `artifacts/mockup-sandbox` | `/__mockup` | Design preview sandbox (unused) |

## Routing (artifacts/emmyfad)

- `/` Home — hero, services grid, profile (NIN masked as `27492-XXXXX-2229`)
- `/about` About — company story + tech stack cards (no live timestamps)
- `/contact` Contact — office details + Leaflet map with 5 restaurant landmarks
- `/services/:slug` Service detail — scope, deliverables, contract request form
- `/sign-in` and `/sign-up` Clerk auth pages
- `/admin` Admin dashboard with tabs: Overview, Requests, Contacts, Messages,
  Payments, Bookkeeping (audit log)

## Database tables

`businessProfile`, `skills`, `services`, `landmarks`, `serviceRequests`,
`messages`, `paymentRequests`, `auditLog`.

Seed script: `artifacts/api-server/scripts/seed.ts` (run with
`../../scripts/node_modules/.bin/tsx scripts/seed.ts` from the api-server
folder).

Seed loads:
- 1 business profile (Fadirepo Emmanuel Opeyemi, NIN `27492502229` stored —
  masked at the UI layer)
- 9 skills (Marine Linkin, Caterpillar, Damen, Maritime Traffic, NIMASA, IMO,
  Maritime Coast Guard, MPA, Glasgow College)
- 7 services (Marine Engineering, Maritime Safety, Maritime Security, Maritime
  Procurement, Safety Gadgets, Diving & Equipment, Offshore & Exportation),
  each with deliverables, portfolio highlights, and Nigerian commercial-law
  contract terms.
- 5 landmark restaurants near 6.5483, 3.2967 (Idimu Road, Ejigbo)
- 2 example service requests + 2 messages + 1 paid payment for dashboard demo.

## Environment

- `DATABASE_URL` — Postgres (provided)
- `SESSION_SECRET` — provided
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` —
  provided via Clerk blueprint
- `VITE_CLERK_PROXY_URL` — provided via Clerk blueprint
- `STRIPE_SECRET_KEY` — **NOT yet provided**. The user dismissed the Stripe
  integration proposal. The Payments tab will save requests as `draft` with
  a friendly note instead of producing live links until Stripe is connected.
  To enable: connect the Stripe integration or set `STRIPE_SECRET_KEY` in
  environment secrets and restart the API workflow.

## Key files

- `lib/api-spec/openapi.yaml` — single source of truth for the API contract
- `lib/db/src/schema/index.ts` — Drizzle table schemas
- `artifacts/api-server/src/app.ts` — Express setup with Clerk middleware +
  proxy
- `artifacts/api-server/src/routes/*.ts` — REST handlers
- `artifacts/api-server/src/lib/stripe.ts` — Stripe client (lazy, optional)
- `artifacts/api-server/src/lib/auth.ts` — `requireAuth` Clerk gate
- `artifacts/emmyfad/src/App.tsx` — root with routing + ClerkProvider
- `artifacts/emmyfad/src/pages/admin/AdminLayout.tsx` — admin shell with tabs
- `artifacts/emmyfad/src/pages/admin/tabs/*` — one file per dashboard tab

## Conventions

- No emojis anywhere in the UI.
- No live UK/USA timestamp clocks anywhere.
- NIN is stored unmasked in the DB but always rendered as
  `27492-XXXXX-2229` in the UI.
- All admin write actions append a row to the `auditLog` table for
  bookkeeping.
- All hooks come from `@workspace/api-client-react`; do not call the API
  directly with `fetch`.
- After mutations, invalidate the appropriate `getXxxQueryKey()` from the
  generated client.
