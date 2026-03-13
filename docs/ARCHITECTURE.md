# 🏗️ Arquitectura del Proyecto — SomosTécnicos FSM

> **Última actualización:** 2026-03-12
> **Versión:** Next.js 15 · React 19 · Tailwind CSS v4 · Prisma 6 · PostgreSQL (Neon) · Redis (Upstash)

---

## 📋 Descripción General

**SomosTécnicos** es una plataforma Field Service Management (FSM) para coordinar servicios técnicos a domicilio en Cali, Colombia. Conecta clientes con técnicos especializados en electrodomésticos, electrónica e instalaciones. Incluye portal público (SEO), gestión de órdenes, dashboards por rol y asistente IA.

---

## 🗂️ Estructura de Directorios

```
somostecnicos_FSM/
│
├── app/                          # Next.js App Router (directorio raíz de la app)
│   ├── (admin)/                  # Rutas privadas — Panel Administrador
│   │   ├── admin/dashboard/
│   │   ├── admin/orders/
│   │   ├── admin/technicians/
│   │   └── admin/customers/
│   │
│   ├── (client)/                 # Rutas privadas — Panel Cliente
│   │   ├── customer/dashboard/
│   │   └── customer/orders/
│   │
│   ├── (public)/                 # Rutas públicas — Portal Web (SEO)
│   │   ├── page.tsx              # Homepage (/)
│   │   ├── contacto/             # Página de contacto (/contacto)
│   │   ├── sobre-nosotros/       # Sobre nosotros (/sobre-nosotros)
│   │   ├── blog/                 # Blog (/blog, /blog/[slug])
│   │   ├── servicios/            # Páginas de servicio SEO (/servicios/[slug])
│   │   ├── barrios/              # Páginas de barrio SEO (/barrios/[slug])
│   │   ├── admin-info/           # Info pública de la app (/admin-info)
│   │   ├── login/                # Autenticación (/login)
│   │   ├── register/             # Registro cliente y técnico (/register/customer, /register/technician)
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── terminos-y-condiciones/
│   │
│   ├── (technician)/             # Rutas privadas — Panel Técnico
│   │   ├── technician/dashboard/
│   │   └── technician/orders/
│   │
│   ├── manager/                  # Rutas privadas — Panel Manager
│   │
│   ├── api/                      # API Routes (REST endpoints)
│   │   ├── auth/                 # Login, logout, refresh, profile, register
│   │   ├── orders/               # CRUD órdenes de servicio
│   │   ├── technicians/          # Gestión de técnicos, asignaciones
│   │   ├── customers/            # Gestión de clientes
│   │   ├── assignments/          # Asignación técnico-orden
│   │   ├── dashboard/            # Datos de dashboard por rol
│   │   ├── messages/             # Mensajería interna
│   │   ├── notifications/        # Sistema de notificaciones
│   │   ├── ai-chat/              # IA asistente (clasificación de servicios)
│   │   ├── reports/              # Reportes y analytics
│   │   └── system/               # Health check, monitoreo
│   │
│   ├── actions/                  # Server Actions de Next.js
│   ├── globals.css               # Estilos globales (Tailwind + utilidades custom)
│   ├── layout.tsx                # Layout raíz (fonts, providers, metadata)
│   ├── robots.ts                 # robots.txt dinámico
│   └── sitemap.ts                # Sitemap XML dinámico
│
├── components/                   # Componentes React reutilizables
│   ├── ui/                       # Design System base (shadcn/ui — 58 componentes)
│   │   ├── button.tsx, card.tsx, dialog.tsx, ...
│   │
│   ├── admin/                    # Componentes exclusivos del panel admin
│   ├── technician/               # Componentes exclusivos del panel técnico
│   ├── dashboard/                # Widgets compartidos de dashboard
│   ├── domain/                   # Componentes de dominio del negocio
│   ├── layout/                   # Componentes de layout (sidebar, nav)
│   ├── navigation/               # Navegación avanzada
│   ├── notifications/            # Sistema de notificaciones UI
│   ├── providers/                # React Providers (tema, auth)
│   │
│   │   ── Componentes Públicos Clave ──────────────────────────
│   ├── header.tsx                # Sticky header + megamenú Servicios (hover/click)
│   ├── hero-section.tsx          # Hero homepage — split layout desktop/mobile
│   ├── service-types.tsx         # Sección tipos de servicio + video background
│   ├── service-process.tsx       # Proceso de 6 pasos + imagen técnico
│   ├── service-form.tsx          # Formulario solicitud de servicio (multi-step)
│   ├── faq.tsx                   # Preguntas frecuentes (Radix Accordion)
│   ├── brands-slider.tsx         # Carrusel infinito marcas especializadas
│   ├── footer.tsx                # Footer 4 columnas + copyright
│   ├── ai-chat.tsx               # Asistente IA flotante (clasificación por voz/texto)
│   ├── mobile-optimizations.tsx  # Widget móvil flotante (ChatWidget)
│   ├── sitelinks-nav.tsx         # Sitelinks SEO para Google
│   ├── order-tracking-modal.tsx  # Modal de seguimiento de orden
│   └── success-modal.tsx         # Modal confirmación exitosa
│
├── lib/                          # Utilidades, servicios y lógica de negocio
│   ├── auth.ts                   # JWT, tokens, sesiones, roles
│   ├── auth-middleware.ts        # Middleware de autenticación por ruta
│   ├── prisma.ts                 # Cliente Prisma singleton (connection pooling)
│   ├── email.ts                  # Servicio de emails (Brevo/SendinBlue)
│   ├── validations.ts            # Schemas Zod para validación de formularios
│   ├── constants.ts              # Constantes globales (estados, roles, barrios)
│   ├── cache.ts                  # Cache en memoria para API responses
│   ├── queue.ts                  # Cola de trabajos asíncronos (emails, notif.)
│   ├── state-machine.ts          # Máquina de estados para órdenes FSM
│   ├── logger.ts                 # Logger estructurado (niveles: debug/info/error)
│   ├── idempotency.ts            # Prevención de duplicados en operaciones críticas
│   ├── design-system.ts          # Tokens y clases del design system (TS)
│   ├── chat-logic.ts             # Lógica del asistente IA (clasificación)
│   ├── seo/                      # Utilidades SEO — estructura modular
│   │   ├── blog-data.ts          # Barrel re-export de ./blog/index (8 líneas)
│   │   ├── blog/                 # Blog modular por área temática (13 archivos)
│   │   │   ├── types.ts          # Interfaces: BlogPost, BlogSection, BlogFaq, BlogCluster
│   │   │   ├── clusters.ts       # BLOG_CLUSTERS — 8 clústeres temáticos
│   │   │   ├── index.ts          # BLOG_POSTS (Record), BLOG_POSTS_LIST, getRelatedBlogPosts
│   │   │   ├── neveras.ts        # 6 posts — reparación de neveras
│   │   │   ├── lavadoras.ts      # 10 posts — reparación de lavadoras
│   │   │   ├── televisores.ts    # 5 posts — reparación de televisores
│   │   │   ├── seguridad.ts      # 5 posts — cámaras y seguridad electrónica
│   │   │   ├── general.ts        # 4 posts — contenido general
│   │   │   ├── calentadores.ts   # 6 posts — calentadores de paso y acumulación
│   │   │   ├── secadoras.ts      # 5 posts — reparación de secadoras
│   │   │   ├── estufas.ts        # 5 posts — reparación de estufas y hornos
│   │   │   ├── redes.ts          # 5 posts — redes y WiFi
│   │   │   └── electricidad.ts   # 5 posts — electricidad residencial
│   │   ├── barrios-data.ts       # Datos de barrios de Cali (SEO programático)
│   │   ├── marcas-data.ts        # Datos de marcas por especialidad
│   │   ├── servicios-data.ts     # Datos de servicios (slugs, metadata)
│   │   └── schema-builders.ts    # Constructores JSON-LD (LocalBusiness, FAQ, etc.)
│   ├── email/                    # Templates de email (React Email)
│   ├── invoice/                  # Generación de facturas PDF
│   └── services/                 # Servicios de dominio de negocio
│
├── prisma/                       # ORM y base de datos
│   ├── schema.prisma             # Modelos de datos (Users, Orders, Technicians...)
│   ├── seed.ts                   # Datos iniciales para desarrollo
│   └── migrations/               # Migraciones de DB (versionadas)
│
├── styles/                       # Sistema de diseño global
│   ├── tokens.css                # Design tokens: colores, tipografía, espaciado
│   └── globals.css               # Animaciones globales, utilidades, reset
│
├── hooks/                        # React custom hooks
│   └── useAuth.ts, useOrders.ts, ...
│
├── contexts/                     # React Contexts globales
│   └── AuthContext.tsx, NotificationContext.tsx
│
├── scripts/                      # Herramientas de desarrollo y operaciones
│   ├── seed-data/, test-*, monitor-*
│
├── tests/                        # Tests E2E con Playwright
├── docs/                         # Documentación del proyecto
│   ├── ARCHITECTURE.md           # ← este archivo
│   └── ...
│
├── public/                       # Assets estáticos (~127 archivos, todos en AVIF/SVG)
│   ├── hero/                     # Hero section: casa-moderna2.avif (desktop), hero_mobil.avif
│   ├── blog/                     # Imágenes de blog por categoría (AVIF 1200×675)
│   │   ├── seguridad/            # 7 imágenes — cámaras y alarmas
│   │   └── televisores/          # 5 imágenes — televisores
│   ├── electrodomesticos/        # 8 imágenes AVIF de equipos (nevera, lavadora, etc.)
│   ├── especialistas/            # 4 imágenes AVIF de técnicos
│   ├── hero-servicios/           # 13 imágenes AVIF para heroes de páginas de servicio
│   ├── img-3d/                   # 8 imágenes 3D/renders del sitio
│   ├── icons/                    # 5 iconos PWA (PNG: 192, 512, apple-touch, 16, 32)
│   ├── logos/                    # 40+ logos SVG de marcas (LG, Samsung, Hikvision, etc.)
│   ├── video/                    # 3 archivos: postal-video.avif, video_animado_tecnico.mp4,
│   │   │                         #             video_reparacion_ok.mp4
│   ├── seo/                      # og-image.jpg para Open Graph
│   ├── placeholders/             # placeholder-user.avif
│   ├── robots.txt                # Reglas de crawling
│   ├── llms.txt                  # Instrucciones para crawlers de IA (GEO)
│   ├── favicon.ico
│   ├── site.webmanifest          # PWA manifest
│   └── sw.js                     # Service worker (Workbox)
│
├── middleware.ts                 # Middleware global Next.js (auth, redirects)
├── next.config.mjs               # Configuración Next.js (imágenes, headers)
├── package.json                  # Dependencias y scripts
└── docker-compose.yml            # PostgreSQL local con Docker
```

---

## 🎨 Sistema de Diseño

### Design Tokens — Dos capas que NO deben mezclarse

**Capa 1 — Tailwind/shadcn** (`app/globals.css`): `--background`, `--primary`, `--border`...
Usar con clases Tailwind: `bg-primary`, `text-foreground`, etc.

**Capa 2 — Corporativo ST** (`styles/tokens.css`): prefijo `--st-*` y `--workshop-*`

| Token | Valor | Uso |
|---|---|---|
| `--st-primary` | `#a50034` | Rojo marca — CTAs principales |
| `--st-primary-hover` | `#8a0029` | Hover de CTAs |
| `--st-success` | `#27ae60` | Confirmaciones |
| `--st-warning` | `#f39c12` | Advertencias |
| `--st-error` | `#e74c3c` | Errores |
| `--st-status-pending` | alias `--pending-amber` | Órdenes pendientes |
| `--st-status-active` | alias `--assigned-blue` | Órdenes activas |
| `--st-status-completed` | alias `--completed-green` | Órdenes completadas |
| `--st-status-cancelled` | alias `--steel-frame` | Órdenes canceladas |
| Hero desktop fondo | `#4a0418` | Fondo split del hero homepage |
| Hero dark páginas internas | `#1a1a2e` | Fondo hero en páginas de servicio |

> **Regla:** Nunca usar hex hardcodeados en componentes. Usar `var(--st-primary)` o `bg-primary`.

### Tipografía

| Variable | Familia | Uso |
|---|---|---|
| Display | `Outfit` | Títulos hero y sección |
| Body | `Plus Jakarta Sans` | Texto general |
| Mono | `Geist Mono` | Código y datos |

### Breakpoints (Tailwind)

| Alias | Ancho | Nota |
|---|---|---|
| `sm` | 640px | Tablets pequeños |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop — activación menú de escritorio |
| `xl` | 1280px | Desktop grande |

### Clases Globales Clave (`app/globals.css`)

```css
.animate-scroll       /* Brands slider — 40s linear infinite */
.img-safe             /* Protección de imágenes en cards (object-cover) */
.text-clamp-2/3       /* line-clamp cross-browser */
.no-scrollbar         /* Oculta scrollbar sin deshabilitar scroll */
.native-card          /* Card glassmorphism (backdrop-filter blur) */
.page-hero-dark       /* Hero oscuro estándar para páginas internas */
```

---

## 🗺️ Rutas Públicas (Portal SEO)

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `app/(public)/page.tsx` | Homepage — landing principal |
| `/contacto` | `app/(public)/contacto/page.tsx` | Contacto e información |
| `/sobre-nosotros` | `app/(public)/sobre-nosotros/page.tsx` | Historia, misión, valores |
| `/blog` | `app/(public)/blog/page.tsx` | Listado de artículos |
| `/blog/[slug]` | `app/(public)/blog/[slug]/page.tsx` | Artículo individual |
| `/servicios/[slug]` | `app/(public)/servicios/[slug]/page.tsx` | Páginas por servicio (SEO programático) |
| `/barrios/[slug]` | `app/(public)/barrios/[slug]/page.tsx` | Páginas por barrio (SEO programático) |
| `/admin-info` | `app/(public)/admin-info/info-view.tsx` | Guía de uso por rol |

### Schema Markup JSON-LD Implementado

- `LocalBusiness` (homepage, contacto)
- `FAQPage` (homepage FAQ)
- `WebSite` + `Sitelinks` (homepage)
- `Organization` (sobre-nosotros)
- `BreadcrumbList` (todas las páginas internas)
- `VideoObject` (si aplica)

---

## 🔐 Autenticación y Autorización

### Roles del Sistema

| Rol | Dashboard | Acceso |
|---|---|---|
| `customer` | `/customer/dashboard` | Crear/ver sus órdenes |
| `technician` | `/technician/dashboard` | Ver asignaciones, reportar trabajo |
| `manager` | `/manager/dashboard` | Gestión operativa |
| `admin` | `/admin/dashboard` | Acceso completo |

### Flujo JWT

```
Login → access_token (15min) + refresh_token (7d)
       ↓ localStorage
Header Authorization: Bearer <token>
       ↓ middleware.ts
Validación con jose → redirect si no autorizado
```

### Middleware de Protección (`middleware.ts`)

Protege rutas privadas según rol. Las rutas en `(public)` son abiertas. El middleware redirige a `/login` si no hay token válido, o al dashboard correcto según el rol si intenta acceder a una ruta de otro rol.

---

## 🔄 Estado de Órdenes (FSM)

**12 estados totales** implementados en `lib/state-machine.ts`.
Usar siempre `isValidTransition(from, to)` antes de actualizar estado en BD.

```
pendiente → asignado → en_camino → revisado → cotizado → en_proceso
                                                                 ↓
                                              esperando_repuestos → reparado → entregado → completado

Ramas de salida (desde casi cualquier estado):
  → cancelado
  → reagendado
```

| Estado | Descripción |
|---|---|
| `pendiente` | Solicitud enviada por el cliente, sin técnico asignado |
| `asignado` | Técnico asignado, pendiente de desplazamiento |
| `en_camino` | Técnico en ruta hacia el domicilio |
| `revisado` | Técnico llegó e inspeccionó el equipo |
| `cotizado` | Técnico envió cotización al cliente |
| `en_proceso` | Cliente aprobó cotización, reparación en curso |
| `esperando_repuestos` | Reparación pausada por falta de repuestos |
| `reparado` | Equipo reparado, pendiente de entrega/prueba |
| `entregado` | Entregado al cliente, en período de garantía |
| `completado` | Servicio finalizado y confirmado |
| `cancelado` | Orden cancelada (rama de salida) |
| `reagendado` | Visita reprogramada (rama de salida) |

Implementado en `lib/state-machine.ts`. Todas las transiciones se validan en el servidor antes de persistir en BD.

---

## 📡 API Endpoints Principales

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Autenticar usuario |
| POST | `/api/auth/register/customer` | Registrar cliente |
| POST | `/api/auth/register/technician` | Registrar técnico |
| POST | `/api/auth/refresh` | Renovar access token |
| GET | `/api/auth/profile` | Datos del usuario autenticado |
| GET | `/api/orders` | Listar órdenes (filtradas por rol) |
| POST | `/api/orders` | Crear nueva orden |
| PATCH | `/api/orders/[id]` | Actualizar estado/datos de orden |
| GET | `/api/technicians` | Listar técnicos disponibles |
| POST | `/api/assignments` | Asignar técnico a orden |
| POST | `/api/ai-chat` | Clasificar servicio con IA |
| GET | `/api/system/health` | Estado del sistema |

---

## 🧩 Componente Header — Detalle

El `header.tsx` es el componente más complejo del portal:

### Comportamiento del Megamenú Servicios

- **Desktop (≥ 1024px):** `div` contenedor con `onMouseEnter/Leave`. El panel se abre en hover Y en click. Usa `pt-2` (padding-top) en el panel wrapper para eliminar el gap entre trigger y panel (sin zona muerta para el mouse).
- **Mobile (< 1024px):** Acordeón que se expande al hacer tap en "Servicios". Lista plana de todos los servicios.
- **Click-outside:** `useEffect` con `mousedown` event para cerrar el dropdown.
- **Timeout de cierre:** 200ms — evita cierre prematuro al transitar entre trigger y panel.

### Secciones del Megamenú Servicios

```
┌─────────────────────────────────┐
│ SERVICIOS DISPONIBLES EN CALI   │
├────────────────┬────────────────┤
│ LÍNEA BLANCA   │ ELECTRÓNICA    │
│ • Neveras      │ • Televisores  │
│ • Lavadoras    │ • Computadores │
│ • Secadoras    ├────────────────┤
│ • Estufas      │ INSTALACIONES  │
│ • Calentadores │ • Electricista │
│                │ • Cámaras      │
├────────────────┴────────────────┤
│ [CTA: ¿No encuentras tu serv?]  │
└─────────────────────────────────┘
```

### Secciones del Megamenú Blog (categorías)

- **Desktop:** Dropdown con categorías de blog (clústeres) en hover.
- **Mobile:** Acordeón colapsable con lista de categorías.
- Sincroniza con `?tema=` en la URL del listado de blog (`/blog?tema=neveras`).

```
┌────────────────────────────────┐
│ BLOG — Temas                   │
├────────────────────────────────┤
│ • Neveras  • Televisores       │
│ • Lavadoras • Calentadores     │
│ • Secadoras • Redes            │
│ • Estufas  • Electricidad      │
└────────────────────────────────┘
```

---

## 📦 Dependencias Clave

| Paquete | Versión | Propósito |
|---|---|---|
| `next` | 16.1.6 | Framework principal |
| `react` | 19.x | UI Library |
| `tailwindcss` | v4.x | Estilos utility-first |
| `prisma` | 6.x | ORM + migraciones |
| `@prisma/client` | 6.x | Cliente de BD tipo-safe |
| `framer-motion` | 12.x | Animaciones avanzadas |
| `lucide-react` | 0.575 | Iconografía |
| `@radix-ui/*` | varios | Componentes accesibles |
| `zod` | 3.x | Validación de esquemas |
| `react-hook-form` | 7.x | Formularios performantes |
| `jose` | 6.x | JWT (edge-compatible) |
| `bcryptjs` | 3.x | Hashing de contraseñas |
| `sonner` | 2.x | Toasts/notificaciones UI |
| `recharts` | 2.x | Gráficos dashboard |
| `@react-email/*` | latest | Templates email HTML |
| `@react-pdf/renderer` | 4.x | Generación PDF facturas |

---

## 🚀 Scripts de Desarrollo

```bash
pnpm dev              # Servidor de desarrollo (Turbopack) — http://localhost:3000
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm db:migrate       # Aplicar migraciones Prisma
pnpm db:seed          # Poblar BD con datos de prueba
pnpm db:studio        # Interfaz visual de BD (Prisma Studio)
pnpm docker:up        # Levantar PostgreSQL local con Docker
pnpm health           # Verificar estado del sistema
```

---

## 🔧 Configuración de Entorno

Variables requeridas en `.env`:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
BREVO_API_KEY=...          # Servicio de emails
NEXT_PUBLIC_APP_URL=...    # URL pública del sitio
```

---

## 📱 Estrategia Responsive

| Elemento | Mobile | Tablet | Desktop |
|---|---|---|---|
| Header | Hamburger menu | Hamburger menu | Nav completa + megamenú hover |
| Hero | Full-bleed + overlay | Full-bleed + overlay | Split layout (imagen derecha) |
| Service Types | Video vertical + cards apiladas | Video + cards | Video 85% + cards absolutas |
| Service Process | 1 columna | 2 columnas | 3 columnas |
| Blog cards | 1 columna | 2 columnas | 3 columnas |
| Footer | 1 columna → 2 col (sm) | 2 columnas | 4 columnas |
| Chat widget | Flotante móvil | Flotante móvil | Chat IA desktop |

### Consideraciones Mobile

- **iOS Zoom:** `font-size: 16px` forzado en inputs para prevenir zoom automático
- **Touch targets:** `min-h-[44px]` en elementos interactivos clave
- **Safe areas:** `padding-bottom: env(safe-area-inset-bottom)` para notch/home bar
- **Scroll**: Clase `.no-scrollbar` para carruseles horizontales

---

## 🤖 Integración IA

El componente `ai-chat.tsx` implementa un asistente para clasificar solicitudes de servicio:

1. **Entrada:** Texto libre o voz del usuario (el servicio a solicitar)
2. **Clasificación:** API `/api/ai-chat` procesa y determina categoría/tipo de servicio
3. **Salida:** Redirige al formulario de solicitud pre-rellenado con el servicio detectado

La lógica de clasificación está en `lib/chat-logic.ts`. El componente es `'use client'` con estado local.

---

## 📊 SEO Programático y Blog

### Páginas generadas dinámicamente

1. **`/servicios/[slug]`** — una página por tipo de servicio (ej: `reparacion-neveras-cali`)
2. **`/barrios/[slug]`** — una página por barrio de Cali cubierto
3. **`/servicios/[slug]/[marca]`** — páginas por servicio + marca (ej: `reparacion-neveras-cali/lg`)

Todas usan `generateStaticParams()` + `generateMetadata()`. Datos en `lib/seo/`.

### Blog — Estructura modular (2026-03-12)

**51 posts** distribuidos en 9 archivos temáticos bajo `lib/seo/blog/`:

| Clúster | Archivo | Posts |
|---|---|---|
| Neveras | `neveras.ts` | 6 |
| Lavadoras | `lavadoras.ts` | 10 |
| Televisores | `televisores.ts` | 5 |
| Seguridad | `seguridad.ts` | 5 |
| General | `general.ts` | 4 |
| Calentadores | `calentadores.ts` | 6 |
| Secadoras | `secadoras.ts` | 5 |
| Estufas | `estufas.ts` | 5 |
| Redes | `redes.ts` | 5 |
| Electricidad | `electricidad.ts` | 5 |

El `blog-data.ts` en la raíz de `lib/seo/` es un **barrel re-export** de `./blog/index` (8 líneas).
El filtro de categoría se sincroniza con `?tema=` en la URL.

### Contenido editorial de blog

Archivos markdown fuente en `docs/contenido-blogs-md/`:
`BLOG-CONTENIDO-{NEVERA,LAVADORAS,TELEVISORES,SECADORAS,ESTUFAS,CALENTADORES-ADICIONALES,REDES,ELECTRICIDAD}.md`

### Prompts para assets visuales

- `docs/PROMPTS-IMAGENES-BLOG.md` — Prompts fotorrealistas por post (formato AVIF 1200×675)
- `docs/PROMPTS-VIDEOS-BLOG.md` — Prompts de video (Hero Loop, Showcase, Reels, Drone fly-through)

---

## 🔄 Historial de Cambios Recientes

### 2026-03-12 — Blog modular + Assets AVIF + SEO técnico

| Área | Cambio |
|---|---|
| `lib/seo/blog/` | Refactor modular completo: `blog-data.ts` reducido a barrel re-export; contenido dividido en 9 archivos temáticos + `types.ts`, `clusters.ts`, `index.ts` |
| `lib/seo/blog/*.ts` | 5 archivos nuevos: `secadoras.ts`, `estufas.ts`, `redes.ts`, `electricidad.ts`, `calentadores.ts` (expandido a 6 posts) |
| `components/header.tsx` | Megamenú blog por categorías (desktop dropdown + mobile acordeón); filtro URL `?tema=` |
| `app/(public)/blog/blog-client.tsx` | Sincronización de filtro activo con `?tema=` en URL |
| `app/(public)/blog/[slug]/page.tsx` | Mejoras SEO en página de artículo individual |
| Imágenes públicas | Migración completa a formato AVIF |
| `public/robots.txt` | Reglas actualizadas sin www |
| `public/llms.txt` | Añadido para GEO (AI crawler accessibility) |
| `public/sw.js` | Service worker actualizado |
| `docs/PROMPTS-IMAGENES-BLOG.md` | Prompts fotorrealistas para imágenes de blog (NUEVO) |
| `docs/PROMPTS-VIDEOS-BLOG.md` | Prompts de video para hero section y redes sociales (NUEVO) |
| Canonicals | Enforced `https://somostecnicos.com` (sin www) en sitemap y layout |

### 2026-03-04 — Mejoras de Diseño

| Componente | Cambio |
|---|---|
| `footer.tsx` | Consistencia tipográfica + grid `sm:grid-cols-2` para mobile |
| `service-process.tsx` | Badge numérico: `pt-8` para evitar corte; `aspect-ratio` en imagen |
| `app/(public)/page.tsx` | Cards blog: `h-48` + excerpt `line-clamp-2` |
| `contacto/page.tsx` | Hero con gradientes decorativos |
| `sobre-nosotros/page.tsx` | Cards de valores con hover interactivo |
| `styles/globals.css` | `animate-scroll`, `.img-safe`, `.text-clamp-2/3`, iOS font-size fix |
| `brands-slider.tsx` | Eliminado `<style jsx>` — usa animación CSS global |
| `header.tsx` | Fix hover megamenú Servicios: `pt-2` sin gap + timeout 200ms |
