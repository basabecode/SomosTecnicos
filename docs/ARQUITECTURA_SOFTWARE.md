# 🏗️ Arquitectura del Software - Servicio Técnico

## 📋 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVICIO TÉCNICO - ARQUITECTURA                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   🌐 FRONTEND   │    │   ⚙️ BACKEND    │    │   🗄️ DATABASE   │         │
│  │                 │    │                 │    │                 │         │
│  │  Next.js 15     │◄──►│  API Routes     │◄──►│  PostgreSQL     │         │
│  │  React 19       │    │  TypeScript     │    │  Prisma ORM     │         │
│  │  Tailwind CSS   │    │  Zod Validation │    │  Backups Auto   │         │
│  │  shadcn/ui      │    │  JWT Auth       │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           ▼                       ▼                       ▼                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │ 📱 CLIENTES     │    │ 📧 SERVICIOS    │    │ 📊 REPORTES     │         │
│  │                 │    │                 │    │                 │         │
│  │ • Formulario    │    │ • Resend Email  │    │ • Métricas      │         │
│  │ • Seguimiento   │    │ • SMS (Twilio)  │    │ • Dashboards    │         │
│  │ • Responsive    │    │ • WhatsApp API  │    │ • Exportación   │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           └───────────────────────┼───────────────────────┘                 │
│                                   ▼                                         │
│                        ┌─────────────────┐                                  │
│                        │ 👥 PANEL ADMIN  │                                  │
│                        │                 │                                  │
│                        │ • Gestión       │                                  │
│                        │ • Asignaciones  │                                  │
│                        │ • Reportes      │                                  │
│                        │ • Configuración │                                  │
│                        └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura Detallada de Carpetas

```
servicio_tecnico/
├── 📁 app/                              # App Router de Next.js
│   ├── 🔐 (auth)/                       # Grupo de rutas de autenticación
│   │   ├── 📄 login/
│   │   │   └── page.tsx                 # [AUTH] Página de login admin
│   │   ├── 📄 register/
│   │   │   └── page.tsx                 # [AUTH] Registro de admin
│   │   └── 📄 layout.tsx                # [AUTH] Layout para autenticación
│   │
│   ├── 👥 admin/                        # Panel de administración
│   │   ├── 📊 dashboard/
│   │   │   └── page.tsx                 # [ADMIN] Dashboard principal
│   │   ├── 📋 orders/
│   │   │   ├── page.tsx                 # [ADMIN] Lista de órdenes
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             # [ADMIN] Detalle de orden
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx         # [ADMIN] Editar orden
│   │   │   └── create/
│   │   │       └── page.tsx             # [ADMIN] Crear orden manual
│   │   ├── 🔧 technicians/
│   │   │   ├── page.tsx                 # [ADMIN] Lista de técnicos
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx             # [ADMIN] Perfil de técnico
│   │   │   └── create/
│   │   │       └── page.tsx             # [ADMIN] Crear técnico
│   │   ├── 📈 reports/
│   │   │   ├── page.tsx                 # [ADMIN] Reportes generales
│   │   │   ├── orders/
│   │   │   │   └── page.tsx             # [ADMIN] Reportes de órdenes
│   │   │   └── performance/
│   │   │       └── page.tsx             # [ADMIN] Rendimiento técnicos
│   │   ├── ⚙️ settings/
│   │   │   ├── page.tsx                 # [ADMIN] Configuraciones
│   │   │   ├── services/
│   │   │   │   └── page.tsx             # [ADMIN] Tipos de servicios
│   │   │   └── zones/
│   │   │       └── page.tsx             # [ADMIN] Zonas de trabajo
│   │   └── 📄 layout.tsx                # [ADMIN] Layout principal admin
│   │
│   ├── 🔌 api/                          # API Routes (Backend)
│   │   ├── 🔐 auth/
│   │   │   ├── 📄 login/
│   │   │   │   └── route.ts             # [API] POST /api/auth/login
│   │   │   ├── 📄 logout/
│   │   │   │   └── route.ts             # [API] POST /api/auth/logout
│   │   │   ├── 📄 me/
│   │   │   │   └── route.ts             # [API] GET /api/auth/me
│   │   │   └── 📄 refresh/
│   │   │       └── route.ts             # [API] POST /api/auth/refresh
│   │   │
│   │   ├── 📋 orders/
│   │   │   ├── 📄 route.ts              # [API] GET/POST /api/orders
│   │   │   ├── 📄 [id]/
│   │   │   │   ├── route.ts             # [API] GET/PUT/DELETE /api/orders/:id
│   │   │   │   ├── 📄 assign/
│   │   │   │   │   └── route.ts         # [API] POST /api/orders/:id/assign
│   │   │   │   ├── 📄 status/
│   │   │   │   │   └── route.ts         # [API] PUT /api/orders/:id/status
│   │   │   │   └── 📄 history/
│   │   │   │       └── route.ts         # [API] GET /api/orders/:id/history
│   │   │   ├── 📄 search/
│   │   │   │   └── route.ts             # [API] GET /api/orders/search
│   │   │   └── 📄 stats/
│   │   │       └── route.ts             # [API] GET /api/orders/stats
│   │   │
│   │   ├── 🔧 technicians/
│   │   │   ├── 📄 route.ts              # [API] GET/POST /api/technicians
│   │   │   ├── 📄 [id]/
│   │   │   │   ├── route.ts             # [API] GET/PUT/DELETE /api/technicians/:id
│   │   │   │   ├── 📄 assignments/
│   │   │   │   │   └── route.ts         # [API] GET /api/technicians/:id/assignments
│   │   │   │   └── 📄 stats/
│   │   │   │       └── route.ts         # [API] GET /api/technicians/:id/stats
│   │   │   ├── 📄 available/
│   │   │   │   └── route.ts             # [API] GET /api/technicians/available
│   │   │   └── 📄 search/
│   │   │       └── route.ts             # [API] GET /api/technicians/search
│   │   │
│   │   ├── 📧 notifications/
│   │   │   ├── 📄 email/
│   │   │   │   └── route.ts             # [API] POST /api/notifications/email
│   │   │   ├── 📄 sms/
│   │   │   │   └── route.ts             # [API] POST /api/notifications/sms
│   │   │   └── 📄 [orderId]/
│   │   │       └── route.ts             # [API] GET /api/notifications/:orderId
│   │   │
│   │   ├── 📊 reports/
│   │   │   ├── 📄 dashboard/
│   │   │   │   └── route.ts             # [API] GET /api/reports/dashboard
│   │   │   ├── 📄 orders/
│   │   │   │   └── route.ts             # [API] GET /api/reports/orders
│   │   │   ├── 📄 technicians/
│   │   │   │   └── route.ts             # [API] GET /api/reports/technicians
│   │   │   └── 📄 export/
│   │   │       └── route.ts             # [API] POST /api/reports/export
│   │   │
│   │   ├── ⚙️ settings/
│   │   │   ├── 📄 route.ts              # [API] GET/PUT /api/settings
│   │   │   ├── 📄 services/
│   │   │   │   └── route.ts             # [API] GET/POST /api/settings/services
│   │   │   └── 📄 zones/
│   │   │       └── route.ts             # [API] GET/POST /api/settings/zones
│   │   │
│   │   └── 🔍 search/
│   │       ├── 📄 global/
│   │       │   └── route.ts             # [API] GET /api/search/global
│   │       └── 📄 orders/
│   │           └── route.ts             # [API] GET /api/search/orders
│   │
│   ├── 📄 globals.css                   # Estilos globales
│   ├── 📄 layout.tsx                    # Layout raíz de la aplicación
│   └── 📄 page.tsx                      # Página principal (landing)
│
├── 🧩 components/                       # Componentes React
│   ├── 👥 admin/                        # Componentes específicos del admin
│   │   ├── 📊 charts/
│   │   │   ├── orders-chart.tsx         # [COMP] Gráfico de órdenes
│   │   │   ├── revenue-chart.tsx        # [COMP] Gráfico de ingresos
│   │   │   └── performance-chart.tsx    # [COMP] Gráfico de rendimiento
│   │   ├── 📋 orders/
│   │   │   ├── order-list.tsx           # [COMP] Lista de órdenes
│   │   │   ├── order-detail.tsx         # [COMP] Detalle de orden
│   │   │   ├── order-form.tsx           # [COMP] Formulario de orden
│   │   │   ├── order-status-badge.tsx   # [COMP] Badge de estado
│   │   │   └── assign-technician.tsx    # [COMP] Modal asignar técnico
│   │   ├── 🔧 technicians/
│   │   │   ├── technician-list.tsx      # [COMP] Lista de técnicos
│   │   │   ├── technician-card.tsx      # [COMP] Tarjeta de técnico
│   │   │   ├── technician-form.tsx      # [COMP] Formulario de técnico
│   │   │   └── availability-toggle.tsx  # [COMP] Toggle disponibilidad
│   │   ├── 📈 dashboard/
│   │   │   ├── stats-cards.tsx          # [COMP] Tarjetas de estadísticas
│   │   │   ├── recent-orders.tsx        # [COMP] Órdenes recientes
│   │   │   ├── alerts-panel.tsx         # [COMP] Panel de alertas
│   │   │   └── quick-actions.tsx        # [COMP] Acciones rápidas
│   │   ├── 📊 reports/
│   │   │   ├── report-filters.tsx       # [COMP] Filtros de reportes
│   │   │   ├── export-buttons.tsx       # [COMP] Botones de exportación
│   │   │   └── data-table.tsx           # [COMP] Tabla de datos
│   │   ├── ⚙️ settings/
│   │   │   ├── service-types.tsx        # [COMP] Tipos de servicios
│   │   │   ├── work-zones.tsx           # [COMP] Zonas de trabajo
│   │   │   └── system-config.tsx        # [COMP] Configuración sistema
│   │   └── 🎨 layout/
│   │       ├── admin-header.tsx         # [COMP] Header del admin
│   │       ├── admin-sidebar.tsx        # [COMP] Sidebar del admin
│   │       └── breadcrumbs.tsx          # [COMP] Breadcrumbs navegación
│   │
│   ├── 🔐 auth/                         # Componentes de autenticación
│   │   ├── login-form.tsx               # [COMP] Formulario de login
│   │   ├── protected-route.tsx          # [COMP] HOC rutas protegidas
│   │   └── auth-guard.tsx               # [COMP] Guard de autenticación
│   │
│   ├── 📧 notifications/                # Sistema de notificaciones
│   │   ├── toast-provider.tsx           # [COMP] Proveedor de toasts
│   │   ├── email-templates/
│   │   │   ├── order-confirmation.tsx   # [TEMP] Confirmación de orden
│   │   │   ├── assignment-notice.tsx    # [TEMP] Notificación asignación
│   │   │   └── completion-notice.tsx    # [TEMP] Notificación completado
│   │   └── notification-center.tsx      # [COMP] Centro de notificaciones
│   │
│   ├── 🎨 ui/                           # Componentes UI base (shadcn/ui)
│   │   ├── button.tsx                   # [UI] Botones
│   │   ├── input.tsx                    # [UI] Campos de entrada
│   │   ├── card.tsx                     # [UI] Tarjetas
│   │   ├── dialog.tsx                   # [UI] Modales
│   │   ├── table.tsx                    # [UI] Tablas
│   │   ├── badge.tsx                    # [UI] Badges
│   │   ├── select.tsx                   # [UI] Selectores
│   │   ├── calendar.tsx                 # [UI] Calendario
│   │   ├── form.tsx                     # [UI] Formularios
│   │   └── ... (otros componentes UI)
│   │
│   └── 🌐 public/                       # Componentes públicos (existentes)
│       ├── header.tsx                   # [COMP] Header público
│       ├── hero-section.tsx             # [COMP] Sección hero
│       ├── service-form.tsx             # [COMP] Formulario de servicio
│       ├── order-tracking.tsx           # [COMP] Seguimiento mejorado
│       ├── appliance-grid.tsx           # [COMP] Grid de electrodomésticos
│       ├── service-types.tsx            # [COMP] Tipos de servicios
│       ├── faq.tsx                      # [COMP] Preguntas frecuentes
│       ├── footer.tsx                   # [COMP] Footer
│       └── success-modal.tsx            # [COMP] Modal de éxito
│
├── 🔧 lib/                              # Librerías y utilidades
│   ├── 🗄️ database/
│   │   ├── prisma.ts                    # [LIB] Cliente de Prisma
│   │   ├── connection.ts                # [LIB] Configuración de conexión
│   │   └── migrations.ts                # [LIB] Utilidades de migración
│   ├── 🔐 auth/
│   │   ├── jwt.ts                       # [LIB] Utilidades JWT
│   │   ├── bcrypt.ts                    # [LIB] Hash de contraseñas
│   │   ├── middleware.ts                # [LIB] Middleware de auth
│   │   └── permissions.ts               # [LIB] Sistema de permisos
│   ├── 📧 notifications/
│   │   ├── email.ts                     # [LIB] Servicio de email
│   │   ├── sms.ts                       # [LIB] Servicio de SMS
│   │   ├── templates.ts                 # [LIB] Plantillas de notificaciones
│   │   └── queue.ts                     # [LIB] Cola de notificaciones
│   ├── 📊 reports/
│   │   ├── generators.ts                # [LIB] Generadores de reportes
│   │   ├── exporters.ts                 # [LIB] Exportadores (PDF, Excel)
│   │   └── analytics.ts                 # [LIB] Análisis de datos
│   ├── 🔍 search/
│   │   ├── elastic.ts                   # [LIB] Elasticsearch (opcional)
│   │   ├── filters.ts                   # [LIB] Filtros de búsqueda
│   │   └── indexing.ts                  # [LIB] Indexación de datos
│   ├── ✅ validations/
│   │   ├── schemas.ts                   # [LIB] Esquemas Zod
│   │   ├── order-validation.ts          # [LIB] Validaciones de órdenes
│   │   ├── technician-validation.ts     # [LIB] Validaciones de técnicos
│   │   └── auth-validation.ts           # [LIB] Validaciones de auth
│   ├── 🔧 utils/
│   │   ├── constants.ts                 # [LIB] Constantes del sistema
│   │   ├── helpers.ts                   # [LIB] Funciones auxiliares
│   │   ├── formatters.ts                # [LIB] Formateadores
│   │   ├── date-utils.ts                # [LIB] Utilidades de fechas
│   │   └── id-generators.ts             # [LIB] Generadores de ID
│   └── 📦 cache/
│       ├── redis.ts                     # [LIB] Cliente Redis
│       ├── memory.ts                    # [LIB] Caché en memoria
│       └── strategies.ts                # [LIB] Estrategias de caché
│
├── 🎯 hooks/                            # Custom hooks
│   ├── use-auth.ts                      # [HOOK] Hook de autenticación
│   ├── use-orders.ts                    # [HOOK] Hook para órdenes
│   ├── use-technicians.ts               # [HOOK] Hook para técnicos
│   ├── use-notifications.ts             # [HOOK] Hook para notificaciones
│   ├── use-reports.ts                   # [HOOK] Hook para reportes
│   ├── use-local-storage.ts             # [HOOK] Hook para localStorage
│   ├── use-debounce.ts                  # [HOOK] Hook de debounce
│   └── use-websocket.ts                 # [HOOK] Hook WebSocket (futuro)
│
├── 📝 types/                            # Definiciones de tipos TypeScript
│   ├── auth.ts                          # [TYPE] Tipos de autenticación
│   ├── orders.ts                        # [TYPE] Tipos de órdenes
│   ├── technicians.ts                   # [TYPE] Tipos de técnicos
│   ├── notifications.ts                 # [TYPE] Tipos de notificaciones
│   ├── reports.ts                       # [TYPE] Tipos de reportes
│   ├── api.ts                           # [TYPE] Tipos de respuestas API
│   └── global.ts                        # [TYPE] Tipos globales
│
├── 🗄️ prisma/                          # Configuración de Prisma
│   ├── schema.prisma                    # [DB] Esquema de base de datos
│   ├── migrations/                      # [DB] Migraciones
│   │   ├── 001_initial_setup/
│   │   ├── 002_add_technicians/
│   │   ├── 003_add_notifications/
│   │   └── ... (otras migraciones)
│   ├── seed.ts                          # [DB] Datos iniciales
│   └── seed-data/                       # [DB] Datos de prueba
│       ├── admin-users.json
│       ├── technicians.json
│       └── sample-orders.json
│
├── 🧪 tests/                            # Tests
│   ├── __mocks__/                       # [TEST] Mocks
│   ├── api/                             # [TEST] Tests de API
│   │   ├── orders.test.ts
│   │   ├── technicians.test.ts
│   │   └── auth.test.ts
│   ├── components/                      # [TEST] Tests de componentes
│   │   ├── order-form.test.tsx
│   │   ├── dashboard.test.tsx
│   │   └── notifications.test.tsx
│   └── utils/                           # [TEST] Tests de utilidades
│       ├── validators.test.ts
│       └── formatters.test.ts
│
├── 📚 docs/                             # Documentación
│   ├── api/                             # [DOC] Documentación de API
│   │   ├── endpoints.md
│   │   ├── authentication.md
│   │   └── examples.md
│   ├── deployment/                      # [DOC] Guías de despliegue
│   │   ├── vercel.md
│   │   ├── railway.md
│   │   └── docker.md
│   └── user-guides/                     # [DOC] Guías de usuario
│       ├── admin-panel.md
│       └── api-usage.md
│
├── 🔧 config/                           # Archivos de configuración
│   ├── docker-compose.yml               # [CONFIG] Docker para desarrollo
│   ├── docker-compose.prod.yml          # [CONFIG] Docker para producción
│   ├── nginx.conf                       # [CONFIG] Nginx (si se usa)
│   └── pm2.config.js                    # [CONFIG] PM2 (si se usa)
│
├── 📦 public/                           # Archivos estáticos
│   ├── images/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── placeholders/
│   ├── documents/
│   │   ├── privacy-policy.pdf
│   │   └── terms-of-service.pdf
│   └── manifest.json                    # [CONFIG] Manifest PWA
│
├── 🌍 middleware.ts                     # [CONFIG] Middleware de Next.js
├── 📄 next.config.mjs                   # [CONFIG] Configuración de Next.js
├── 📄 tailwind.config.js                # [CONFIG] Configuración de Tailwind
├── 📄 tsconfig.json                     # [CONFIG] Configuración de TypeScript
├── 📄 package.json                      # [CONFIG] Dependencias y scripts
├── 📄 pnpm-lock.yaml                    # [CONFIG] Lock de dependencias
├── 📄 .env.local                        # [CONFIG] Variables de entorno local
├── 📄 .env.example                      # [CONFIG] Ejemplo de variables
├── 📄 .gitignore                        # [CONFIG] Archivos ignorados por Git
└── 📄 README.md                         # [DOC] Documentación principal
```

---

## 🔄 Flujo de Datos y Comunicación

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FLUJO DE DATOS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  👤 CLIENTE                    🔐 ADMIN                    🔧 TÉCNICO       │
│      │                           │                           │               │
│      ▼                           ▼                           ▼               │
│  ┌─────────┐                 ┌─────────┐                ┌─────────┐         │
│  │Frontend │                 │Admin    │                │Mobile   │         │
│  │Público  │                 │Panel    │                │App      │         │
│  └─────────┘                 └─────────┘                │(Futuro) │         │
│      │                           │                      └─────────┘         │
│      │    ┌─────────────────────┼─────────────────────┐      │               │
│      │    │                     │                     │      │               │
│      ▼    ▼                     ▼                     ▼      ▼               │
│  ┌──────────────────────────────────────────────────────────────┐            │
│  │                     API LAYER (Next.js)                      │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │            │
│  │  │ Orders  │ │Technic. │ │  Auth   │ │Reports  │ │Notific. │ │            │
│  │  │   API   │ │   API   │ │   API   │ │   API   │ │   API   │ │            │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │            │
│  └──────────────────────────────────────────────────────────────┘            │
│                                   │                                         │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐            │
│  │                    BUSINESS LOGIC                            │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │            │
│  │  │Validat. │ │Process  │ │Assign   │ │Generate │ │Schedule │ │            │
│  │  │& Rules  │ │Orders   │ │Technic. │ │Reports  │ │Notific. │ │            │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │            │
│  └──────────────────────────────────────────────────────────────┘            │
│                                   │                                         │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐            │
│  │                   DATA ACCESS LAYER                          │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │            │
│  │  │ Prisma  │ │ Cache   │ │Search   │ │Files    │ │Logs     │ │            │
│  │  │  ORM    │ │(Redis)  │ │Engine   │ │Storage  │ │System   │ │            │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │            │
│  └──────────────────────────────────────────────────────────────┘            │
│                                   │                                         │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐            │
│  │                    DATABASE LAYER                            │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │            │
│  │  │Orders   │ │Technic. │ │ Users   │ │Settings │ │ Logs    │ │            │
│  │  │Table    │ │Table    │ │ Table   │ │ Table   │ │ Table   │ │            │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │            │
│  │                    PostgreSQL Database                       │            │
│  └──────────────────────────────────────────────────────────────┘            │
│                                                                             │
│                                   │                                         │
│                                   ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐            │
│  │                   EXTERNAL SERVICES                          │            │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │            │
│  │  │Resend   │ │Twilio   │ │WhatsApp │ │Storage  │ │Payment  │ │            │
│  │  │ Email   │ │  SMS    │ │Business │ │(AWS S3) │ │Gateway  │ │            │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │            │
│  └──────────────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Mapa de Componentes y Responsabilidades

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MAPA DE COMPONENTES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🌐 FRONTEND PÚBLICO                        👥 PANEL ADMINISTRACIÓN         │
│  ┌─────────────────────────┐                ┌─────────────────────────┐     │
│  │                         │                │                         │     │
│  │ 🏠 Landing Page         │                │ 📊 Dashboard            │     │
│  │  ├─ Header              │                │  ├─ Stats Cards         │     │
│  │  ├─ Hero Section        │                │  ├─ Charts              │     │
│  │  ├─ Service Types       │                │  ├─ Recent Orders       │     │
│  │  ├─ Appliance Grid      │                │  └─ Alerts Panel        │     │
│  │  ├─ Service Form ◄──────┼────────────────┼─► Orders Management     │     │
│  │  ├─ Order Tracking ◄────┼────────────────┼─► Order Details         │     │
│  │  ├─ FAQ Section         │                │                         │     │
│  │  └─ Footer              │                │ 🔧 Technicians          │     │
│  │                         │                │  ├─ Technician List     │     │
│  │ 📧 Notifications        │                │  ├─ Assign Modal        │     │
│  │  ├─ Success Modal       │                │  ├─ Availability        │     │
│  │  └─ Toast Messages      │                │  └─ Performance         │     │
│  │                         │                │                         │     │
│  └─────────────────────────┘                │ 📈 Reports              │     │
│                                             │  ├─ Analytics Charts    │     │
│  🔧 API ENDPOINTS                           │  ├─ Export Functions    │     │
│  ┌─────────────────────────┐                │  └─ Date Filters        │     │
│  │                         │                │                         │     │
│  │ 📋 Orders API           │                │ ⚙️ Settings             │     │
│  │  ├─ POST /orders        │                │  ├─ Service Types       │     │
│  │  ├─ GET /orders/:id     │                │  ├─ Work Zones          │     │
│  │  ├─ PUT /orders/:id     │                │  └─ System Config       │     │
│  │  └─ POST /assign        │                │                         │     │
│  │                         │                └─────────────────────────┘     │
│  │ 👥 Technicians API      │                                                │
│  │  ├─ GET /technicians    │                🔐 AUTENTICACIÓN                │
│  │  ├─ POST /technicians   │                ┌─────────────────────────┐     │
│  │  └─ GET /available      │                │                         │     │
│  │                         │                │ 🔑 Login/Logout         │     │
│  │ 📊 Reports API          │                │ 🛡️ JWT Middleware       │     │
│  │  ├─ GET /dashboard      │                │ 👤 User Management      │     │
│  │  └─ GET /analytics      │                │ 🚫 Route Protection     │     │
│  │                         │                │                         │     │
│  │ 📧 Notifications API    │                └─────────────────────────┘     │
│  │  ├─ POST /email         │                                                │
│  │  └─ POST /sms           │                📱 CARACTERÍSTICAS FUTURAS      │
│  │                         │                ┌─────────────────────────┐     │
│  └─────────────────────────┘                │                         │     │
│                                             │ 📱 Mobile App           │     │
│  🗄️ DATABASE                               │ 💬 Real-time Chat       │     │
│  ┌─────────────────────────┐                │ 🌍 Multi-language       │     │
│  │                         │                │ 💳 Payment Integration  │     │
│  │ 📊 Orders Table         │                │ 📍 GPS Tracking         │     │
│  │ 👥 Technicians Table    │                │ 🔔 Push Notifications   │     │
│  │ 📧 Notifications Table  │                │                         │     │
│  │ 👤 Admin Users Table    │                └─────────────────────────┘     │
│  │ ⚙️ Settings Table       │                                                │
│  │                         │                                                │
│  └─────────────────────────┘                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Estados y Flujos de Trabajo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ESTADOS DEL SISTEMA                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📋 FLUJO DE ÓRDENES                                                        │
│                                                                             │
│  [Cliente llena formulario] ──► [Validación] ──► [Guardar en BD]            │
│              │                        │                   │                 │
│              ▼                        ▼                   ▼                 │
│       [Error mostrado]        [Error validación]   [🟡 PENDIENTE]          │
│                                                           │                 │
│                                                           ▼                 │
│                                              [Admin asigna técnico]         │
│                                                           │                 │
│                                                           ▼                 │
│                                                    [🔵 ASIGNADO]            │
│                                                           │                 │
│                                                           ▼                 │
│                                               [Técnico en camino]            │
│                                                           │                 │
│                                                           ▼                 │
│                                                   [🟣 EN_PROCESO]           │
│                                                           │                 │
│                                                           ▼                 │
│                                              [Servicio completado]          │
│                                                           │                 │
│                                                           ▼                 │
│                                                   [✅ COMPLETADO]           │
│                                                                             │
│  👥 FLUJO DE TÉCNICOS                                                       │
│                                                                             │
│  [Admin crea técnico] ──► [Definir especialidades] ──► [✅ ACTIVO]          │
│              │                        │                    │                │
│              ▼                        ▼                    ▼                │
│       [Datos válidos]           [Asignar zona]       [🟢 DISPONIBLE]       │
│                                                           │                 │
│                                                           ▼                 │
│                                                [Recibe asignación]          │
│                                                           │                 │
│                                                           ▼                 │
│                                                    [🔴 OCUPADO]             │
│                                                           │                 │
│                                                           ▼                 │
│                                                [Completa servicio]          │
│                                                           │                 │
│                                                           ▼                 │
│                                                [🟢 DISPONIBLE]              │
│                                                                             │
│  📊 FLUJO DE REPORTES                                                       │
│                                                                             │
│  [Admin solicita reporte] ──► [Filtrar datos] ──► [Generar gráficos]       │
│              │                        │                   │                 │
│              ▼                        ▼                   ▼                 │
│    [Seleccionar período]      [Aplicar filtros]    [Mostrar dashboard]     │
│                                                           │                 │
│                                                           ▼                 │
│                                                [Opción de exportar]         │
│                                                           │                 │
│                                                           ▼                 │
│                                                [📄 PDF / 📊 Excel]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Seguridad y Autenticación

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITECTURA DE SEGURIDAD                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🔐 CAPAS DE SEGURIDAD                                                      │
│                                                                             │
│  ┌─ Cliente ────────────────────────────────────────────────────────────┐   │
│  │  • Validación frontend (Zod)                                        │   │
│  │  • HTTPS obligatorio                                                 │   │
│  │  • CSP Headers                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ Middleware ──────────────────────────────────────────────────────────┐   │
│  │  • Rate Limiting                                                     │   │
│  │  • CORS Configuration                                                │   │
│  │  • Request Validation                                                │   │
│  │  • JWT Verification                                                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ API Layer ───────────────────────────────────────────────────────────┐   │
│  │  • Input Sanitization                                                │   │
│  │  • Output Encoding                                                   │   │
│  │  • Authentication Required                                           │   │
│  │  • Role-based Access Control                                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─ Database ────────────────────────────────────────────────────────────┐   │
│  │  • SQL Injection Protection (Prisma)                                 │   │
│  │  • Encrypted Connections                                             │   │
│  │  • Backup Encryption                                                 │   │
│  │  • Access Logging                                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🛡️ MECANISMOS DE PROTECCIÓN                                               │
│                                                                             │
│  • JWT Tokens (Access + Refresh)                                           │
│  • Password Hashing (bcrypt)                                               │
│  • Session Management                                                       │
│  • RBAC (Role-Based Access Control)                                        │
│  • Input/Output Validation                                                 │
│  • Error Handling Seguro                                                   │
│  • Logging y Monitoring                                                    │
│  • Environment Variables                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

Esta arquitectura del software proporciona una visión completa y estructurada de cómo se organizará todo el proyecto, desde la estructura de carpetas hasta los flujos de datos y la seguridad. ¿Te gustaría que profundice en algún aspecto específico o que empecemos con la implementación de alguna parte?
