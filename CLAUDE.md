# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build (runs prisma generate first)
pnpm build

# Lint
pnpm lint

# Database
pnpm db:push          # Apply schema to DB (dev, no migration history)
pnpm db:migrate       # Create + apply migration (production-ready)
pnpm db:seed          # Seed demo data (uses DEMO_* env vars)
pnpm db:studio        # Open Prisma Studio GUI

# Local services (Docker)
pnpm docker:up        # Start PostgreSQL + Redis
pnpm docker:down      # Stop services

# Full setup from scratch
pnpm setup            # docker:up + db:push + db:seed
```

After modifying `prisma/schema.prisma`, run `pnpm db:generate` to regenerate the Prisma client before building.

## Architecture

**Next.js 15 App Router** with three parallel user panels, each in a route group:

- `app/(admin)/admin/` — Admin/super_admin/technician_manager panel
- `app/(client)/customer/` — Customer panel
- `app/(technician)/technician/` — Technician panel
- `app/(public)/` — Public landing pages (no auth)
- `app/api/` — All API routes

**Authentication** is custom JWT (no NextAuth sessions). Two separate user tables exist: `AdminUser` and `Customer`, both using autoincrement integer IDs. This means IDs **can collide** between tables — all auth code tracks `userType: 'admin' | 'customer'` alongside the ID to disambiguate.

- `lib/auth.ts` — JWT generation/verification, `authenticateRequest()`, `withAuth()` HOC, `withRoles()` HOC
- JWT tokens are stored in cookies (`auth-token` or `token`), read by Server Components via `getCurrentUser()`
- API routes use `withAuth(handler)` or call `authenticateRequest(request)` directly

**State machine** for orders is enforced in `lib/state-machine.ts`. Always use `isValidTransition(from, to)` before updating order status. Order states (12 total): `pendiente → asignado → en_camino → revisado → cotizado → en_proceso → esperando_repuestos → reparado → entregado → completado` (plus `cancelado` and `reagendado` as branches).

**Real-time notifications** use Server-Sent Events at `/api/notifications/stream`. All notification creation must go through `sendNotification()` in `lib/services/notification.service.ts` — never write to the `Notification` table directly.

**Messaging** (`/api/messages`, `lib/chat-logic.ts`): Messages use soft-delete per user (`deletedBySender`/`deletedByReceiver` flags). Never call `deleteMany` on messages. All thread-grouping and message-routing logic is centralized in `lib/chat-logic.ts` — import from there, don't duplicate in page components. IDs between `Customer` and `AdminUser` collide, so `isOwnMessage()` compares both `senderId` AND `senderType`.

**Key lib files:**
- `lib/constants.ts` — All enum-like constants (`ORDER_STATES`, `USER_ROLES`, `ASSIGNMENT_STATES`, etc.) and their display helpers
- `lib/prisma.ts` — Singleton Prisma client
- `lib/validations.ts` — Zod schemas for API input validation
- `lib/logger.ts` — Structured logger (`logger`, `logAuth`, `logAPI`)

**Path alias:** `@/` maps to the repo root.

## Key Conventions

- **Strict TypeScript**: avoid `any`; use `@ts-ignore` only with justification
- **API auth**: always protect routes with `withAuth()` or `withRoles()` — never skip for non-public endpoints
- **Optimistic updates**: update UI before server confirmation; revert on error
- **Order numbers**: use `generateSequentialOrderNumber()` from `lib/order-utils.ts` — `generateOrderNumber()` in `constants.ts` is deprecated
- **Roles** (from `USER_ROLES` constant): `super_admin`, `admin`, `technician_manager`, `viewer`, `customer`, `technician`

## Environment Variables

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL with connection pooler |
| `DIRECT_URL` | PostgreSQL direct (for migrations) |
| `JWT_SECRET` | Sign tokens (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App base URL |
| `BREVO_API_KEY` | Email sending via Brevo |
| `DEMO_*` | Seed account credentials (dev only) |

Generate secrets with: `openssl rand -base64 32`

## Deployment

Deployed to **Vercel**. Database is **Neon PostgreSQL** (serverless, requires both `DATABASE_URL` pooler URL and `DIRECT_URL` direct URL). Redis in production: **Upstash**. See `docs/operaciones/DEPLOYMENT_VERCEL.md` for full deployment guide.

## Commit Convention

```
feat(scope): short description    # new feature
fix(scope): short description     # bug fix
refactor(scope): description      # no behavior change
docs(scope): description          # docs only
style(scope): description         # formatting only
```
