# 🏗️ Arquitectura del Proyecto — SomosTécnicos FSM

> **Última actualización:** 2026-03-04
> **Versión:** Next.js 16.1.6 · React 19 · Tailwind CSS v4 · Prisma 6 · PostgreSQL

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
│   ├── seo/                      # Utilidades SEO (metadata, schema, keywords)
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
├── public/                       # Assets estáticos
│   ├── img-3d/                   # Imágenes 3D y renders del sitio
│   └── icons/, logos/
│
├── middleware.ts                 # Middleware global Next.js (auth, redirects)
├── next.config.mjs               # Configuración Next.js (imágenes, headers)
├── package.json                  # Dependencias y scripts
└── docker-compose.yml            # PostgreSQL local con Docker
```

---

## 🎨 Sistema de Diseño

### Design Tokens (`styles/tokens.css`)

| Token | Valor | Uso |
|---|---|---|
| `--stamp-red` / `#A50034` | Rojo institucional | CTAs, acentos, highlights |
| `--label-ink` / `#2C3E50` | Azul oscuro | Texto primario, nav |
| `--tool-orange` / `#FF6B6B` | Naranja/salmón | Badges, alertas |
| `--safe-green` / `#27AE60` | Verde | Botón "Solicitar Servicio" |
| `--bg-paper` / `#F8F6F3` | Beige cálido | Fondos de sección |
| Hero oscuro | `#1a0a0f` | Fondo hero páginas internas |

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

```
PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
    ↓         ↓            ↓
CANCELLED  CANCELLED   CANCELLED
```

Implementado en `lib/state-machine.ts`. Las transiciones están validadas en el servidor antes de persistir en BD.

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

### Secciones del Megamenú

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

## 📊 SEO Programático

Dos tipos de páginas generadas dinámicamente para SEO:

1. **`/servicios/[slug]`** — una página por tipo de servicio (ej: `reparacion-neveras-cali`)
2. **`/barrios/[slug]`** — una página por barrio de Cali cubierto

Ambas usan `generateStaticParams()` para pre-renderizado estático y `generateMetadata()` para meta-tags dinámicas. Los slugs y datos base están en `lib/constants.ts`.

---

## 🔄 Historial de Cambios Recientes (2026-03-04)

### Mejoras de Diseño Aplicadas

| Componente | Cambio |
|---|---|
| `footer.tsx` | Consistencia tipográfica: h4 "Contacto" usa `text-sm uppercase tracking-widest` (igual que nav/servicios). Grid `sm:grid-cols-2` para mobile |
| `service-process.tsx` | `pt-8` en cards para que el badge numérico `-top-4` no se corte. Imagen usa `aspect-ratio` en lugar de `h-[px]` fija |
| `service-types.tsx` | `min-h` en lugar de `h-fixed` para el contenedor principal |
| `app/(public)/page.tsx` | Cards blog: `h-48` estándar + excerpt con `line-clamp-2` |
| `contacto/page.tsx` | Hero con gradientes decorativos (consistente con sobre-nosotros). Badges de zonas con hover red |
| `sobre-nosotros/page.tsx` | Hero con gradientes decorativos. Cards de valores con hover interactivo |
| `styles/globals.css` | Animación `animate-scroll` global (brands slider); `.img-safe`, `.text-clamp-2/3`, prevención zoom iOS, `.page-hero-dark` |
| `app/globals.css` | Agrega `animate-scroll`, `.img-safe`, `.text-clamp-2/3`, iOS font-size fix |
| `brands-slider.tsx` | Eliminado `<style jsx>` — usa la animación del CSS global |
| `header.tsx` | **Fix hover megamenú Servicios:** Panel usa `pt-2` (sin gap) + timeout 200ms |
