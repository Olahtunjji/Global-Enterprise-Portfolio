# EMMYFAD Global Enterprise

A portfolio + contract-request + admin dashboard web application for
**Fadirepo Emmanuel Opeyemi**'s Lagos-based marine engineering and maritime
procurement firm, **EMMYFAD Global Enterprise** (62B Idimu Road, Ejigbo,
Lagos).

The site lets shipowners, port authorities, and government regulators learn
about the firm, browse the seven service lines, submit a contract request
under Nigerian commercial-law terms, and contact the office. The owner signs
in to a private dashboard to triage requests, message customers, send Stripe
payment links, and keep an audit trail.

---

## 1. Project Category

| Aspect | Classification |
| --- | --- |
| Domain | Marine Engineering / Maritime Services |
| Type | Business portfolio + Service-request CRM + Payment workflow |
| Audience (public) | Shipowners, port authorities, government regulators |
| Audience (admin) | The business owner |
| Pattern | Three-tier monolith (browser → REST API → Postgres) |
| Hosting | Replit Deployments (Reserved VM-class, single region) |
| Architectural style | Layered + Modular Monorepo (pnpm workspaces) |

---

## 2. The full lifecycle — design to implementation

### 2.1 Discovery and information architecture

The product was scoped from a single brief listing the owner's identity, the
nine credibility brands to display, the seven service lines, the office
address, and the admin features required. From the brief we derived an
information architecture of three public pages plus seven service detail
pages plus a six-tab admin console. No emojis, no live UK/USA clocks, NIN
masked at the UI layer.

> Learn the IA technique used here:
> [Nielsen Norman Group — Information Architecture: Study Guide](https://www.nngroup.com/articles/information-architecture-study-guide/)
> · [The Difference Between Information Architecture and Navigation](https://www.nngroup.com/articles/ia-vs-navigation/)

### 2.2 Visual design

A maritime palette of deep navy + signal-orange accents on a clean white
canvas, paired with the Inter typeface, the **lucide-react** icon set
(Anchor, Ship, Compass, ShieldCheck, etc.), and a sticky 9-brand marquee
across the top of every page. The marquee uses CSS `mask-image` for the
fade-in/out edges and a CSS keyframe loop for the horizontal scroll, so it
runs at zero JavaScript cost.

> Learn the visual stack:
> [Tailwind CSS docs](https://tailwindcss.com/docs) ·
> [shadcn/ui — Introduction](https://ui.shadcn.com/docs) ·
> [Refactoring UI book (free chapter)](https://refactoringui.com/) ·
> [Inter typeface](https://rsms.me/inter/) ·
> [Lucide icons](https://lucide.dev/)

### 2.3 Wireframe → component prototyping

Each screen was sketched as nested shadcn/ui primitives (`Card`,
`Accordion`, `Dialog`, `Tabs`, `Sheet`, `Button`, `Input`, `Textarea`,
`Badge`) before being committed. The contract-request form was prototyped
first because its terms-acceptance gate is the conversion lever for the
whole site.

> Learn component-driven design:
> [Component Driven User Interfaces](https://www.componentdriven.org/) ·
> [shadcn/ui — Composition](https://ui.shadcn.com/docs/components)

### 2.4 API contract first

Before writing a single React component or Express handler, we authored the
**OpenAPI 3.1** contract in `lib/api-spec/openapi.yaml`. From that one
source of truth we generate:

- typed React Query hooks (`@workspace/api-client-react`) via **Orval**
- Zod request/response schemas (`@workspace/api-zod`)
- Express handler types consumed by the API server

This guarantees the browser, the server, and the database layer all agree
on every field name, type, and status code.

> Learn API-first development:
> [OpenAPI Specification 3.1.0](https://spec.openapis.org/oas/v3.1.0.html) ·
> [API-First with OpenAPI — Stoplight](https://stoplight.io/api-design-guide) ·
> [Orval — Generate React Query hooks from OpenAPI](https://orval.dev/) ·
> [Zod docs](https://zod.dev/)

### 2.5 Database modelling

Eight tables, all keyed by a `serial` primary key, with timezone-aware
timestamps and Drizzle's `$inferSelect` to auto-derive TypeScript row types.
See section 4 for the full schema.

> Learn the data layer:
> [Drizzle ORM — Quick Start](https://orm.drizzle.team/docs/get-started) ·
> [Drizzle Kit migrations](https://orm.drizzle.team/docs/kit-overview) ·
> [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) ·
> [Database Normalization explained](https://www.geeksforgeeks.org/normal-forms-in-dbms/)

### 2.6 Backend implementation

Express 5 on Node.js, Pino structured logging, Zod runtime validation at
every route boundary, Clerk middleware for admin gating, and a lazy-loaded
Stripe client that gracefully degrades when no key is present (payment
requests are saved as `draft` instead of crashing).

> Learn the backend stack:
> [Express 5 — Getting started](https://expressjs.com/en/starter/installing.html) ·
> [Pino — High-speed Node.js logger](https://getpino.io/) ·
> [Stripe Checkout — Quickstart](https://docs.stripe.com/checkout/quickstart) ·
> [Clerk — Express Backend SDK](https://clerk.com/docs/references/express/overview)

### 2.7 Frontend implementation

React 19 + Vite for the build, Wouter for client-side routing (much smaller
than React Router), TanStack Query for server-state caching, Framer Motion
for the page transitions, and react-leaflet + OpenStreetMap tiles for the
contact-page map (no Google Maps API key needed).

> Learn the frontend stack:
> [React docs (new)](https://react.dev/) ·
> [Vite — Why Vite](https://vitejs.dev/guide/why.html) ·
> [Wouter — minimalist router](https://github.com/molefrog/wouter) ·
> [TanStack Query overview](https://tanstack.com/query/latest/docs/framework/react/overview) ·
> [Framer Motion docs](https://motion.dev/docs) ·
> [react-leaflet docs](https://react-leaflet.js.org/) ·
> [Leaflet quick start](https://leafletjs.com/examples/quick-start/) ·
> [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

### 2.8 Authentication

Clerk handles email + password sign-in, sign-up, and session management.
The Express middleware (`requireAuth`) inspects the Clerk session on every
admin route and rejects unauthenticated callers with `401`.

> Learn authentication patterns:
> [Clerk — Quickstart for React](https://clerk.com/docs/quickstarts/react) ·
> [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### 2.9 Payments

The admin opens a service request, fills in `purchaserEmail` + amount, and
clicks **Send payment link**. The server calls
`stripe.checkout.sessions.create({ mode: "payment", … })` and stores the
returned `url` and `sessionId` on the `payment_requests` row. The admin
copies the link from the dashboard and sends it to the customer through
their preferred channel.

> Learn the payment flow:
> [Stripe Checkout — How it works](https://docs.stripe.com/payments/checkout) ·
> [Stripe — Sessions API reference](https://docs.stripe.com/api/checkout/sessions/create)

### 2.10 Deployment

The whole monorepo is published as a Replit Deployment. The API server and
the React build are served behind a single proxy that routes `/api/*` to
Express and everything else to the static Vite output.

> Learn deployment basics:
> [Replit Deployments docs](https://docs.replit.com/cloud-services/deployments) ·
> [Twelve-Factor App methodology](https://12factor.net/)

---

## 3. Architecture

### 3.1 High-level diagram

```
┌────────────────────────┐         HTTPS         ┌──────────────────────────┐
│  Browser               │◄────────────────────► │  Replit Deployment Edge  │
│  React 19 + Vite       │                        │  (TLS, mTLS-proxy)       │
│  TanStack Query        │                        └────────────┬─────────────┘
│  Wouter · Framer       │                                     │
│  react-leaflet · Clerk │                  ┌──────────────────┴──────────────────┐
└────────────┬───────────┘                  │                                     │
             │                              ▼                                     ▼
             │                   ┌──────────────────────┐         ┌────────────────────────┐
             │                   │ Static Vite bundle    │         │ Express 5 API server   │
             │                   │ (HTML/CSS/JS assets)  │         │ Clerk middleware       │
             │                   └──────────────────────┘         │ Zod validation         │
             │                                                    │ Pino logging           │
             │                                                    └────────────┬───────────┘
             │                                                                 │
             │  Clerk JS SDK                                                   │ pg driver
             ▼                                                                 ▼
   ┌──────────────────────┐                                       ┌─────────────────────────┐
   │ Clerk hosted auth    │                                       │ PostgreSQL              │
   │ (sessions + users)   │                                       │ (Drizzle ORM)           │
   └──────────────────────┘                                       └─────────────────────────┘
                                                                              │
                                                              admin issues    │
                                                              payment link    ▼
                                                                  ┌─────────────────────────┐
                                                                  │ Stripe Checkout API     │
                                                                  │ (lazy, optional)        │
                                                                  └─────────────────────────┘
```

### 3.2 Layered breakdown

| Layer | Responsibility | Technology |
| --- | --- | --- |
| Presentation | Pages, components, routing, animations | React 19, Wouter, Tailwind, shadcn/ui, Framer Motion |
| State | Server cache, optimistic updates, query invalidation | TanStack Query |
| Contract | Single source of truth for every endpoint | OpenAPI 3.1 + Orval + Zod |
| Application | HTTP handlers, validation, auth gates | Express 5, Clerk middleware, Zod |
| Domain | Drizzle queries, business rules | Drizzle ORM + TypeScript |
| Persistence | Tables, indexes, transactions | PostgreSQL 16 |
| Integration | Outbound third-party calls | Stripe Node SDK, Clerk Backend SDK |

> Learn layered / clean architecture:
> [Clean Architecture — Robert C. Martin (post)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) ·
> [Hexagonal Architecture — Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/) ·
> [martinfowler.com — Layered architecture](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)

### 3.3 Monorepo layout

```
.
├── artifacts/
│   ├── api-server/         Express + Drizzle + Stripe + Clerk gates
│   │   ├── src/app.ts
│   │   ├── src/routes/     One file per resource group
│   │   ├── src/lib/        auth.ts, stripe.ts
│   │   └── scripts/seed.ts
│   ├── emmyfad/            React 19 + Vite public site + admin dashboard
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── pages/      Home · About · Contact · ServiceDetail
│   │       └── pages/admin/
│   │           ├── AdminLayout.tsx
│   │           └── tabs/   Overview · Requests · Contacts · Messages · Payments · Audit
│   └── mockup-sandbox/     Design preview sandbox (unused in prod)
├── lib/
│   ├── db/                 Drizzle schema + connection pool
│   ├── api-spec/           OpenAPI 3.1 source of truth
│   ├── api-client-react/   Orval-generated React Query hooks
│   └── api-zod/            Orval-generated Zod schemas
├── replit.md               Project memo
└── README.md
```

> Learn monorepo patterns:
> [pnpm workspaces](https://pnpm.io/workspaces) ·
> [Monorepo.tools](https://monorepo.tools/) ·
> [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

### 3.4 Request lifecycle (admin updates a service request)

1. Admin clicks **Save** in the dashboard.
2. `useUpdateServiceRequest` (TanStack Query mutation) fires
   `PATCH /api/service-requests/:id`.
3. Express receives the call; Clerk middleware validates the session cookie.
4. Zod parses the body against the OpenAPI-derived schema; on failure
   responds `400` with field-level errors.
5. Drizzle runs the `UPDATE service_requests SET … WHERE id = $1`
   statement inside a transaction.
6. Inside the same transaction we `INSERT INTO audit_log` so every state
   change is bookkept.
7. On success, the handler responds `200` with the new row.
8. The React Query mutation invalidates the `getListServiceRequestsQueryKey`
   and the request list re-renders with the fresh data.

> Learn the request-lifecycle pattern:
> [TanStack Query — Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) ·
> [PostgreSQL — Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)

---

## 4. Database schemas

All eight tables, exactly as defined in `lib/db/src/schema/`. Types are
auto-derived via Drizzle's `$inferSelect`.

### 4.1 `business_profile`

The single owner row used across the public site.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `business_name` | `text` | "EMMYFAD Global Enterprise" |
| `owner_name` | `text` | "Fadirepo Emmanuel Opeyemi" |
| `email` | `text` | `efadirepo@yahoo.com` |
| `address` | `text` | "62B Idimu Road, Ejigbo, Lagos" |
| `nin` | `text` | Stored unmasked; UI renders `27492-XXXXX-2229` |
| `sex` | `text` | "male" |
| `date_of_birth` | `text` | ISO date string |
| `bio` | `text` | Free-form |
| `latitude` / `longitude` | `double precision` | Used by the Leaflet map |

### 4.2 `skills`

The nine credibility brands rendered in the sticky marquee.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `name` | `text` | e.g. "Caterpillar" |
| `category` | `text` | e.g. "Diesel Engines" |
| `value_proposition` | `text` | One-liner |
| `logo_url` | `text` | Optional logo |
| `accent_color` | `text` | Hex string for the chip |
| `icon_key` | `text` | Lucide icon name |
| `sort_order` | `integer` | Marquee order |

### 4.3 `services`

The seven service lines exposed at `/services/:slug`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `slug` | `text` UNIQUE | URL slug |
| `title` | `text` | e.g. "Marine Engineering" |
| `tagline` | `text` | One-liner |
| `description` | `text` | Long-form |
| `deliverables` | `text[]` | What the customer receives |
| `portfolio_highlights` | `text[]` | Past wins |
| `contract_terms` | `text` | Nigerian commercial-law clauses |
| `icon_key` | `text` | Lucide icon |
| `sort_order` | `integer` | Listing order |

### 4.4 `landmarks`

Restaurants (★ ≥ 2) shown around the office on the contact map.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `name` | `text` | Restaurant name |
| `category` | `text` | Default "restaurant" |
| `star_rating` | `integer` | 2-5 |
| `latitude` / `longitude` | `double precision` | Marker position |
| `directions_hint` | `text` | "Walk 5 min east of office" |

### 4.5 `service_requests`

A customer's contract request.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `service_slug` | `text` | FK by convention to `services.slug` |
| `service_title` | `text` | Snapshot at submit time |
| `purchaser_name` | `text` | |
| `purchaser_email` | `text` | |
| `purchaser_phone` | `text` | |
| `purchaser_company` | `text` | Nullable |
| `project_address` | `text` | |
| `project_description` | `text` | |
| `estimated_budget` | `integer` | USD whole dollars, nullable |
| `start_date` | `text` | ISO date string, nullable |
| `contract_terms_accepted` | `boolean` | Required `true` to submit |
| `status` | `text` | `new` · `in_review` · `accepted` · `rejected` · `completed` |
| `admin_notes` | `text` | Internal |
| `created_at` / `updated_at` | `timestamptz` | Auto-managed |

### 4.6 `messages`

Outbound and inbound messages tied to a service request.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `service_request_id` | `integer` | FK by convention |
| `direction` | `text` | `inbound` or `outbound` |
| `subject` | `text` | |
| `body` | `text` | |
| `recipient_email` | `text` | |
| `created_at` | `timestamptz` | |

### 4.7 `payment_requests`

Each Stripe Checkout link issued by the admin.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `service_request_id` | `integer` | Parent request |
| `purchaser_name` | `text` | |
| `purchaser_email` | `text` | |
| `amount_cents` | `integer` | Stored in cents to avoid float errors |
| `currency` | `text` | Default `usd` |
| `description` | `text` | Shown on the Stripe Checkout page |
| `status` | `text` | `draft` · `awaiting_payment` · `paid` · `failed` |
| `stripe_checkout_url` | `text` | Nullable until session created |
| `stripe_session_id` | `text` | Nullable |
| `error_message` | `text` | Populated when Stripe is not connected |
| `created_at` / `paid_at` | `timestamptz` | |

### 4.8 `audit_log`

Append-only log of every admin state change.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `serial` | Primary key |
| `action` | `text` | e.g. `service_request.update` |
| `entity_type` | `text` | e.g. `service_request` |
| `entity_id` | `integer` | Nullable for system-wide events |
| `actor` | `text` | Default `system`, otherwise Clerk user id |
| `details` | `text` | Free-form context |
| `created_at` | `timestamptz` | |

> Learn relational design:
> [PostgreSQL — Data Definition](https://www.postgresql.org/docs/current/ddl.html) ·
> [SQLBolt interactive tutorial](https://sqlbolt.com/)

---

## 5. Running the project locally

```bash
# Install dependencies (workspace-wide)
pnpm install

# Push the schema to your Postgres
pnpm --filter @workspace/db run push

# Seed demo data
cd artifacts/api-server && ../../scripts/node_modules/.bin/tsx scripts/seed.ts

# Start everything (or use the configured workflows in Replit)
pnpm --filter @workspace/api-server run dev   # Express on PORT
pnpm --filter @workspace/emmyfad   run dev    # Vite  on PORT
```

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `SESSION_SECRET` | Express session signing |
| `CLERK_SECRET_KEY` | Clerk backend SDK |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend SDK |
| `VITE_CLERK_PUBLISHABLE_KEY` | Mirrored to the browser bundle |
| `VITE_CLERK_PROXY_URL` | Clerk proxy (auto-set by the Replit blueprint) |
| `STRIPE_SECRET_KEY` | **Optional.** Without it, payment requests stay `draft`. |

---

## 6. Conventions

- No emojis anywhere in the UI.
- No live UK/USA timestamp clocks anywhere.
- NIN is stored unmasked but always rendered masked.
- Every admin write appends a row to `audit_log` for bookkeeping.
- Browser code never calls `fetch` directly; it uses
  `@workspace/api-client-react` hooks.
- After a mutation, invalidate the matching `getXxxQueryKey()` from the
  generated client.

---

## 7. Further reading

- [Refactoring UI](https://refactoringui.com/) — practical visual design
  for engineers
- [Patterns.dev](https://www.patterns.dev/) — React + web architecture
  patterns
- [The Twelve-Factor App](https://12factor.net/) — production-grade SaaS
  fundamentals
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — web security
  baseline
- [Designing Data-Intensive Applications](https://dataintensive.net/) —
  long-form reference for the persistence layer
- [Replit Docs](https://docs.replit.com/) — workflows, deployments,
  integrations
