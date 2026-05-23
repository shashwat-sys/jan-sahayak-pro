# Jan Sahayak Pro

Protected operations workspace for Janman Peoples Foundation and the Jan Nyaya Abhiyan team. This app is built with Next.js App Router, Clerk authentication, Neon Postgres via Drizzle, and server-side Anthropic-powered drafting/reporting endpoints.

## Stack

- Next.js 16 App Router
- React 19
- Clerk for authentication
- Neon Postgres + Drizzle ORM
- Vercel AI SDK with Anthropic
- Vitest for unit tests

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `ANTHROPIC_API_KEY`
   - `SEED_ADMIN_EMAIL`
   - optional: `DEMO_MODE=true` for a local read-only UI preview without Clerk or Neon
3. Install dependencies with `npm install` if needed.
4. Create the schema with `npm run db:push`.
5. Seed demo data with `npm run db:seed`.
6. Start the app with `npm run dev`.

If env vars are missing, the app will route to `/setup` with configuration instructions instead of exposing broken protected routes.

## Demo mode

Set `DEMO_MODE=true` in `.env.local` to preview the full admin interface with seeded in-memory demo data. This bypasses Clerk and Neon for read-only UI review, while keeping the production deployment model unchanged.

## Useful scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run db:generate
npm run db:push
npm run db:seed
```

## Auth model

- Clerk protects all admin routes and AI endpoints.
- Access is limited to users whose email or `clerkUserId` is present in the `app_users` table with role `admin`.
- The seed script inserts one admin record using `SEED_ADMIN_EMAIL`.

## Seeded features

- Dashboard with stale-case alerts, hearings, team task ownership, and monthly finance rollups
- Cases list and detail workflow with diary, hearings, documents, and linked tasks
- Activities and bulk participant registration
- Finance ledger and category/project summaries
- Role-aware monthly reports with AI-generated summaries
- Donor/APPI/internal AI reports
- Legal drafting surface with optional case-linked context
- Team registry and AI-generated offer letters

## Verification

Current workspace checks:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run db:generate`
