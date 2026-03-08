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

- **Tailwind v4 — restricciones de valores arbitrarios**:
  - **Sin px en dimensiones**: No usar `w-[Xpx]`, `h-[Xpx]`, `size-[Xpx]`. Usar escala estándar (`w-96`, `size-48`) o rem si la escala no alcanza. Para decorativos usar clases estándar (`blur-3xl`, `size-96`).
  - **Sin opacidad decimal**: No usar `bg-color/[0.X]`, `border-color/[0.X]`, `text-color/[0.X]`. Usar entero porcentual sin corchetes: `bg-color/10` (10%), `bg-color/7` (7%), etc.
  - Tokens de tamaño reutilizables van en `styles/tokens.css`.
- **Strict TypeScript**: avoid `any`; use `@ts-ignore` only with justification
- **API auth**: always protect routes with `withAuth()` or `withRoles()` — never skip for non-public endpoints
- **Optimistic updates**: update UI before server confirmation; revert on error
- **Order numbers**: use `generateSequentialOrderNumber()` from `lib/order-utils.ts` — `generateOrderNumber()` in `constants.ts` is deprecated
- **Roles** (from `USER_ROLES` constant): `super_admin`, `admin`, `technician_manager`, `viewer`, `customer`, `technician`

## Environment Variables

Copy `.env.example` to `.env`. Key variables:

| Variable        | Purpose                                 |
| --------------- | --------------------------------------- |
| `DATABASE_URL`  | PostgreSQL with connection pooler       |
| `DIRECT_URL`    | PostgreSQL direct (for migrations)      |
| `JWT_SECRET`    | Sign tokens (`openssl rand -base64 32`) |
| `NEXTAUTH_URL`  | App base URL                            |
| `BREVO_API_KEY` | Email sending via Brevo                 |
| `DEMO_*`        | Seed account credentials (dev only)     |

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

# ============================================================

# BLOQUE DE INSTRUCCIONES DE SKILLS

## Sistema de Skills — LECTURA OBLIGATORIA

Este proyecto tiene 24 skills especializadas distribuidas en tres ubicaciones.
**REGLA FUNDAMENTAL:** Antes de ejecutar cualquier tarea, DEBES revisar si existe un skill relevante y leer su SKILL.md completo ANTES de escribir código o tomar decisiones. No confíes solo en tu conocimiento general — las instrucciones del skill tienen prioridad.

### Ubicaciones de Skills

```
.claude/skills/          → Skills del proyecto (diseño, frontend, producción)
.agents/skills/          → Skills de SEO y contenido
~/.claude/skills/        → Skills globales (auth, base de datos, gestión)
```

### Mapa de Skills por Contexto

Usa esta tabla para identificar qué skill leer según la tarea solicitada:

#### Diseño y Frontend (.claude/skills/)

| Contexto / Palabras clave                                 | Skill                       | Ruta                                                |
| --------------------------------------------------------- | --------------------------- | --------------------------------------------------- |
| Dashboard, panel admin, vista de administración           | admin-dashboard             | .claude/skills/admin-dashboard/SKILL.md             |
| Limpiar docs, documentación, organizar archivos .md       | docs-cleaner                | .claude/skills/docs-cleaner/SKILL.md                |
| UI, diseño web, componentes visuales, estilos             | frontend-design             | .claude/skills/frontend-design/SKILL.md             |
| Interfaces, layouts, UX, flujos de usuario                | interface-design            | .claude/skills/interface-design/SKILL.md            |
| Ideas, brainstorming, propuestas, creatividad             | lluvia-de-ideas             | .claude/skills/lluvia-de-ideas/SKILL.md             |
| Base de datos, PostgreSQL, tablas, esquemas, relaciones   | postgre-design              | .claude/skills/postgre-design/SKILL.md              |
| Deploy, producción, optimización, build, rendimiento      | production-ready            | .claude/skills/production-ready/SKILL.md            |
| Responsive, mobile, adaptable, breakpoints, media queries | responsive-design           | .claude/skills/responsive-design/SKILL.md           |
| Vercel, React, Next.js, deployment, mejores prácticas     | vercel-react-best-practices | .claude/skills/vercel-react-best-practices/SKILL.md |

#### SEO y Contenido (.agents/skills/)

| Contexto / Palabras clave                                   | Skill                | Ruta                                         |
| ----------------------------------------------------------- | -------------------- | -------------------------------------------- |
| SEO para IA, LLMs, visibilidad en AI, AI search             | ai-seo               | .agents/skills/ai-seo/SKILL.md               |
| Blog, artículos, calendario editorial, plan de contenido    | blog-strategy        | .agents/skills/blog-strategy/SKILL.md        |
| Crear contenido, redacción, textos, copywriting             | content-creation     | .agents/skills/content-creation/SKILL.md     |
| SEO programático, páginas generadas, templates SEO          | programmatic-seo     | .agents/skills/programmatic-seo/SKILL.md     |
| Schema, datos estructurados, JSON-LD, rich snippets         | schema-markup        | .agents/skills/schema-markup/SKILL.md        |
| Auditoría SEO, análisis técnico, errores SEO                | seo-audit            | .agents/skills/seo-audit/SKILL.md            |
| Competencia, análisis competidores, páginas alternativas    | seo-competitor-pages | .agents/skills/seo-competitor-pages/SKILL.md |
| Contenido SEO, optimización de texto, keywords en contenido | seo-content          | .agents/skills/seo-content/SKILL.md          |
| SEO local, geolocalización, Google Maps, ciudades           | seo-geo              | .agents/skills/seo-geo/SKILL.md              |
| SEO técnico, crawling, indexación, sitemap, robots.txt      | seo-technical        | .agents/skills/seo-technical/SKILL.md        |

#### Infraestructura y Gestión (~/.claude/skills/)

| Contexto / Palabras clave                                 | Skill              | Ruta                                         |
| --------------------------------------------------------- | ------------------ | -------------------------------------------- |
| Gestión de proyecto, tareas, planificación, PM, sprints   | ai-pm-assistant    | ~/.claude/skills/ai-pm-assistant/SKILL.md    |
| Autenticación, login, registro, Supabase Auth, sesiones   | auth-supabase      | ~/.claude/skills/auth-supabase/SKILL.md      |
| Métricas, KPIs, indicadores, rendimiento del proyecto     | pmis-metrics       | ~/.claude/skills/pmis-metrics/SKILL.md       |
| Roles, permisos, RBAC, WorkOS, control de acceso          | rbac-workos        | ~/.claude/skills/rbac-workos/SKILL.md        |
| Migraciones, esquema DB, Supabase migrations, ALTER TABLE | supabase-migration | ~/.claude/skills/supabase-migration/SKILL.md |

### Reglas de Uso de Skills

1. **Siempre leer antes de actuar.** Cuando una tarea coincida con algún skill del mapa anterior, lee el SKILL.md completo antes de empezar. No asumas que ya sabes qué dice.

2. **Combinar skills cuando sea necesario.** Muchas tareas requieren más de un skill. Por ejemplo:
   - "Crear una landing page optimizada para SEO" → lee `frontend-design` + `seo-content` + `schema-markup`
   - "Diseñar las tablas para el módulo de usuarios" → lee `postgre-design` + `auth-supabase`
   - "Preparar el sitio para producción" → lee `production-ready` + `seo-technical` + `responsive-design`
   - "Crear una página de servicios por ciudad" → lee `programmatic-seo` + `seo-geo` + `frontend-design`

3. **Las instrucciones del skill tienen prioridad** sobre tu conocimiento general. Si un skill dice "usa esta estructura" o "sigue este patrón", hazlo aunque creas que hay otra forma mejor.

4. **No inventes soluciones cuando existe un skill.** Si el mapa indica que hay un skill para la tarea, úsalo. No resuelvas desde cero lo que ya está documentado.

5. **Ante la duda, revisa.** Si no estás seguro de si un skill aplica, léelo. Es mejor leer un skill que no necesitabas que saltarte uno que sí necesitabas.

# ============================================================

# Three.js Animation — Instrucciones para CLAUDE.md

## Three.js Animation / Tarjetas y Diseños 3D

### Cuándo usar

Activa este skill siempre que el usuario pida:

- Tarjetas 3D, tarjetas interactivas o con efecto de profundidad
- Animaciones 3D: objetos que giran, flotan, se transforman, flip
- Diseños 3D animados, escenas con movimiento
- Modelos GLTF/GLB animados
- Cualquier mención de: "tarjeta 3D", "diseño 3D", "animación 3D", "efecto 3D", "Three.js"

### Cómo usar

**ANTES de escribir código**, lee el skill:

```
.claude/skills/threejs-skills/skills/threejs-animation/SKILL.md
```

### Flujo obligatorio

1. Leer `threejs-animation/SKILL.md`
2. Aplicar los patrones y API documentados (Three.js r160+)
3. Producir código funcional completo (HTML con JS inline cuando sea posible)
4. Incluir siempre: resize handler, animation loop, antialiasing, pixelRatio limitado a 2
5. Llamar `.dispose()` en geometrías/materiales/texturas al limpiar

```

```

# ============================================================

# Arquitectura de Comunicación en Tiempo Real

## Stack de Comunicación

- **Notificaciones en tiempo real**: Server-Sent Events (SSE) — NO WebSockets
- **Endpoint SSE**: `app/api/notifications/stream/route.ts` — debe usar `export const runtime = 'edge'`
- **Estado global frontend**: `contexts/notification-context.tsx`
- **Dispatcher de eventos**: `lib/services/notification.service.ts` — usar siempre `sendNotification()`, nunca escribir directo a la tabla `Notification`
- **Cola de jobs**: `lib/queue.ts` — emails y operaciones pesadas van aquí, nunca síncronos en Route Handler

## Reglas de Eventos

- Toda transición de estado de orden dispara notificación al actor correcto (no solo al admin)
- `NotificationService.create()` después de cada transición exitosa
- El SSE stream debe hacer cleanup con `req.signal.addEventListener('abort')`
- Skills de referencia: `.claude/skills/eda-architect/SKILL.md` y `.claude/skills/realtime-gateway/SKILL.md`

# ============================================================

# Sistema de Colores — Tokens CSS

## Dos capas de tokens que NO deben mezclarse

| Capa | Prefijo | Archivo | Uso |
|------|---------|---------|-----|
| Tailwind / shadcn | `--background`, `--primary`, `--border`… | `app/globals.css` | Componentes shadcn/ui, clases `bg-primary` |
| Corporativo ST | `--st-*` | `styles/tokens.css` | Marca, estados de orden, colores semánticos propios |
| Workshop | `--workshop-*`, `--pending-amber`… | `styles/tokens.css` | Design system físico del taller |

## Tokens corporativos clave

| Token | Valor | Uso |
|-------|-------|-----|
| `--st-primary` | `#a50034` | Rojo marca — CTAs principales |
| `--st-primary-hover` | `#8a0029` | Hover de CTAs |
| `--st-success` | `#27ae60` | Confirmaciones |
| `--st-warning` | `#f39c12` | Advertencias |
| `--st-error` | `#e74c3c` | Errores (antes `--accent`) |
| `--st-status-pending` | alias `--pending-amber` | Órdenes pendientes |
| `--st-status-active` | alias `--assigned-blue` | Órdenes activas |
| `--st-status-completed` | alias `--completed-green` | Órdenes completadas |
| `--st-status-cancelled` | alias `--steel-frame` | Órdenes canceladas |

## Reglas de color

- **Nunca** usar hex hardcodeados (`#a50034`) en componentes — usar `var(--st-primary)` o `bg-primary`
- **Nunca** usar sintaxis arbitraria de Tailwind para colores de marca (`bg-[#A50034]`)
- Componentes shadcn usan `bg-primary` — que apunta al rojo corporativo via oklch en `globals.css`
- Empty states inline prohibidos — usar `<EmptyState />` de `components/domain/empty-state.tsx`

# ============================================================

# QA Funcional — Dead UI

## Skill disponible

`.claude/skills/functional-qa/SKILL.md` — Auditoría funcional de los 3 portales

## Reglas de implementación

- **Nunca** dejar `onClick={() => {}}` o handlers con solo `console.log`
- **Siempre** manejar error además del éxito (`toast.error()` en catch)
- **Siempre** deshabilitar botones durante operaciones (`disabled={isLoading}`)
- Botones destructivos requieren confirmación (dialog/alert antes de ejecutar)
- Formularios requieren estado de loading en submit y reset post-éxito

## Estado actual del proyecto — Issues de diseño

# ============================================================

# Convenciones Tailwind (memoria de proyecto)

## Regla de compatibilidad

- Usar `shrink-0` en lugar de `flex-shrink-0`.
- Usar `grow` en lugar de `flex-grow`.
- Evitar `min-w-[20px]` cuando existe utilidad nativa; usar `min-w-5`.
- Preferir utilidades de escala nativa cuando el valor coincide exactamente.

## Mapeos frecuentes

- `w-[240px]` -> `w-60`
- `w-[120px]` -> `w-30`
- `min-h-[44px]` -> `min-h-11`
- `min-w-[160px]` -> `min-w-40`
- `min-w-[200px]` -> `min-w-50`
- `min-w-[240px]` -> `min-w-60`
- `min-w-[300px]` -> `min-w-75`
- `max-w-[120px]` -> `max-w-30`
- `w-[180px]` -> `w-45`
- `w-[600px]` -> `w-150`
- `min-w-[100px]` -> `min-w-25`
- `min-w-[260px]` -> `min-w-65`
- `min-h-[100px]` -> `min-h-25`
- `min-h-[320px]` -> `min-h-80`
- `min-h-[380px]` -> `min-h-95`
- `min-h-[400px]` -> `min-h-100`
- `min-h-[420px]` -> `min-h-105`
- `max-w-[320px]` -> `max-w-80`
- `max-w-[400px]` -> `max-w-100`
- `max-w-[500px]` -> `max-w-125`
- `max-w-[540px]` -> `max-w-135`
- `max-h-[120px]` -> `max-h-30`
- `max-h-[540px]` -> `max-h-135`
- `max-h-[600px]` -> `max-h-150`

## Motivo

- Mantener consistencia con la convención actual de Tailwind del proyecto.
- Reducir clases legacy y arbitrarias innecesarias para evitar errores de revisión.
