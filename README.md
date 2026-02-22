# somostecnicos — Field Service Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com/)

Plataforma integral de **Field Service Management (FSM)** que centraliza el ciclo de vida completo de servicios técnicos a domicilio: desde la solicitud del cliente hasta el cierre del técnico en campo.

---

## Tabla de contenidos

1. [Descripción del producto](#descripción-del-producto)
2. [Arquitectura y stack](#arquitectura-y-stack)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Roles y permisos](#roles-y-permisos)
5. [Módulos principales](#módulos-principales)
6. [Configuración del entorno](#configuración-del-entorno)
7. [Desarrollo local](#desarrollo-local)
8. [Base de datos](#base-de-datos)
9. [Despliegue](#despliegue)
10. [Convenciones de código](#convenciones-de-código)
11. [Documentación adicional](#documentación-adicional)

---

## Descripción del producto

**somostecnicos** conecta a clientes con técnicos especializados en reparación de electrodomésticos y tecnología. La plataforma gestiona:

- Solicitud y seguimiento de órdenes de servicio
- Asignación y despacho de técnicos en campo
- Comunicación interna entre clientes, técnicos y administración
- Notificaciones en tiempo real (SSE)
- Facturación electrónica
- Métricas y reportes operativos

---

## Arquitectura y stack

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js (App Router) | 15 | Framework principal, SSR/SSG |
| React | 19 | UI reactiva |
| TypeScript | 5 | Tipado estricto |
| Tailwind CSS | 4 | Estilos utilitarios |
| shadcn/ui | latest | Componentes accesibles |
| Framer Motion | — | Animaciones |

### Backend / Infraestructura
| Tecnología | Uso |
|-----------|-----|
| Prisma ORM | Acceso a base de datos, migraciones |
| PostgreSQL | Base de datos relacional (Neon serverless) |
| Redis | Caché y rate limiting |
| JWT | Autenticación sin estado |
| Server-Sent Events (SSE) | Notificaciones en tiempo real |

### Herramientas de desarrollo
| Herramienta | Uso |
|------------|-----|
| pnpm | Gestor de dependencias |
| Docker | PostgreSQL y Redis locales |
| Playwright | Tests E2E |

---

## Estructura del proyecto

```
somostecnicos_FSM/
├── app/
│   ├── (admin)/admin/          # Panel de administración
│   ├── (client)/customer/      # Panel de cliente
│   ├── (technician)/technician/# Panel de técnico
│   ├── api/                    # API Routes (Next.js)
│   │   ├── auth/               # Autenticación y sesiones
│   │   ├── messages/           # Sistema de mensajería interna
│   │   ├── notifications/      # Notificaciones y SSE stream
│   │   ├── orders/             # Gestión de órdenes
│   │   └── ...
│   └── (public)/               # Páginas públicas (landing, contacto)
├── components/
│   ├── navigation/             # Navbar, sidebar, notification-bell
│   ├── notifications/          # Sistema de notificaciones UI
│   └── ui/                     # Componentes base (shadcn)
├── contexts/                   # React Context providers
│   ├── auth-context.tsx        # Sesión de usuario
│   └── notification-context.tsx# Estado global de notificaciones
├── lib/
│   ├── auth.ts                 # Utilidades JWT y middleware de autenticación
│   ├── chat-logic.ts           # Lógica centralizada del sistema de mensajería
│   ├── prisma.ts               # Cliente Prisma singleton
│   └── services/               # Servicios de backend (notificaciones, email)
├── prisma/
│   └── schema.prisma           # Esquema de base de datos
├── public/                     # Activos estáticos
└── docs/                       # Documentación interna del proyecto
```

---

## Roles y permisos

El sistema implementa **RBAC (Role-Based Access Control)** con cuatro roles:

| Rol | Panel de acceso | Descripción |
|-----|----------------|-------------|
| `super_admin` | `/admin` | Control total del sistema |
| `admin` | `/admin` | Gestión operativa diaria |
| `technician_manager` | `/admin` | Gestión de técnicos y asignaciones |
| `technician` | `/technician` | Gestión de asignaciones propias |
| `customer` | `/customer` | Solicitudes y seguimiento de órdenes |

La autenticación usa **JWT** con tokens de acceso de corta duración y refresh tokens.

---

## Módulos principales

### Órdenes de servicio (`/api/orders`)
- Creación, asignación y seguimiento de órdenes con FSM de estados
- Estados: `pendiente → asignado → en_proceso → completado / cancelado`
- Historial de cambios con autoría y timestamps

### Mensajería interna (`/api/messages`, `lib/chat-logic.ts`)
- Hilos de conversación entre admin ↔ cliente y admin ↔ técnico
- Soft-delete por usuario: cada participante borra su vista de forma independiente
- Marcado de mensajes leídos con optimistic updates

### Notificaciones en tiempo real (`/api/notifications`)
- SSE stream persistente por usuario (`/api/notifications/stream`)
- Campanita con contador de no leídas que se limpia al abrir
- Botones de refresh manual y limpieza de notificaciones leídas
- Sonido de alerta con Web Audio API

### Asignaciones y técnicos (`/api/assignments`, `/api/technicians`)
- Asignación manual y automática de técnicos
- Control de disponibilidad y estado en campo
- Reportes de visita con diagnósticos y costos

### Facturación (`/api/invoices`)
- Generación de facturas electrónicas con desglose de costos
- IVA configurable (19% por defecto)
- Envío por email y WhatsApp

---

## Configuración del entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env
```

Variables requeridas (ver `.env.example` para la lista completa):

| Variable | Descripción |
|---------|-------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL (con pooler) |
| `DIRECT_URL` | URL directa a PostgreSQL (para migraciones) |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |
| `REDIS_URL` | URL de conexión a Redis |
| `NEXTAUTH_URL` | URL base de la aplicación |

> No commitees el archivo `.env` bajo ninguna circunstancia.

---

## Desarrollo local

### Prerrequisitos
- Node.js >= 20
- pnpm >= 9
- Docker (para base de datos y Redis locales)

### Pasos

```bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar servicios locales (PostgreSQL + Redis)
pnpm docker:up

# 3. Aplicar esquema de base de datos
pnpm db:push

# 4. Poblar datos de prueba
pnpm db:seed

# 5. Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Base de datos

El esquema se gestiona con **Prisma**. Comandos útiles:

```bash
# Aplicar cambios del schema a la BD (desarrollo)
pnpm prisma db push

# Crear y aplicar migración (producción)
pnpm prisma migrate dev --name descripcion_cambio

# Abrir Prisma Studio (explorador visual de datos)
pnpm prisma studio

# Regenerar cliente Prisma tras cambios en schema
pnpm prisma generate
```

### Modelos principales
- `Order` — Órdenes de servicio
- `Message` — Mensajería interna (con soft-delete por usuario)
- `Notification` — Notificaciones del sistema
- `Assignment` — Asignaciones de técnicos a órdenes
- `Customer` — Usuarios clientes
- `Technician` — Técnicos del servicio
- `AdminUser` — Usuarios administrativos
- `Invoice` — Facturas electrónicas

---

## Despliegue

El proyecto se despliega en **Vercel** (plataforma principal). Los pasos de CI/CD están documentados en [`docs/operaciones/DEPLOYMENT_VERCEL.md`](docs/operaciones/DEPLOYMENT_VERCEL.md).

Puntos clave:
- Configurar todas las variables de entorno en el dashboard de Vercel
- La BD usa Neon PostgreSQL con connection pooling habilitado
- Redis en producción requiere instancia dedicada (Upstash recomendado)

---

## Convenciones de código

- **TypeScript estricto**: no usar `any` salvo con `@ts-ignore` justificado
- **API Routes**: autenticar siempre con `authenticateRequest()` o el HOF `withAuth()`
- **Estado optimista**: actualizar UI antes de confirmar en servidor; revertir en error
- **Soft delete de mensajes**: usar `deletedBySender`/`deletedByReceiver`, nunca `deleteMany` directo
- **Notificaciones**: toda creación de notificación pasa por `sendNotification()` en `lib/services/notification.service.ts`
- **Lógica de chat centralizada**: importar siempre desde `lib/chat-logic.ts` (no duplicar en páginas)

### Estructura de commits
```
tipo(scope): descripción corta

feat: nueva funcionalidad
fix: corrección de bug
refactor: reestructuración sin cambio de comportamiento
docs: solo documentación
style: formato, sin cambio lógico
```

---

## Documentación adicional

Toda la documentación técnica está en la carpeta [`docs/`](docs/):

| Documento | Descripción |
|-----------|-------------|
| [`docs/INDICE.md`](docs/INDICE.md) | Índice completo de la documentación |
| [`docs/01_ARQUITECTURA_SISTEMA.md`](docs/01_ARQUITECTURA_SISTEMA.md) | Arquitectura y decisiones de diseño |
| [`docs/diseno/UI_GUIDE.md`](docs/diseno/UI_GUIDE.md) | Guía de estilos y componentes UI |
| [`docs/operaciones/DEPLOYMENT_VERCEL.md`](docs/operaciones/DEPLOYMENT_VERCEL.md) | Guía de despliegue en producción |
| [`docs/registro_cambios/CHANGELOG.md`](docs/registro_cambios/CHANGELOG.md) | Historial de versiones |

---

*Desarrollado por [basabecode](https://github.com/basabecode)*
