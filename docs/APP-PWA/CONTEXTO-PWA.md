# SomosTécnicos — Contexto de Proyecto PWA

> Versión 1.0 | Basado en somostecnicos.com + arquitectura existente

---

## 1. Identidad de Marca

| Elemento         | Valor                                                              |
| ---------------- | ------------------------------------------------------------------ |
| Nombre           | SomosTécnicos                                                      |
| Tagline          | "Reparaciones Inteligentes para tu Hogar"                          |
| Subtítulo        | "Plataforma digital para solicitar servicio técnico especializado" |
| Color primario   | `#e40014` (rojo)                                                   |
| Color secundario | `#f05100` (naranja)                                                |
| Color fondo      | `#ffffff`                                                          |
| Color superficie | `#fef2f2`                                                          |
| Tipografía       | Sans-serif (sistema)                                               |
| Logo             | ST con tipografía bold + "SomosTécnicos"                           |
| Dominio          | somostecnicos.com                                                  |
| Cobertura        | Cali y alrededores, Valle del Cauca, Colombia                      |
| Contacto         | +57 300 309 4854 / soporte@somostecnicos.com                       |

---

## 2. Propuesta de Valor

- ✅ Técnicos certificados con garantía incluida
- ✅ Mejor calificación del mercado
- ✅ Atención lunes a sábado
- ✅ Solicitud 100% en línea
- ✅ IA para soporte y diagnóstico
- ✅ Seguimiento en tiempo real del servicio

---

## 3. Servicios Ofrecidos

| Servicio          | Descripción                        |
| ----------------- | ---------------------------------- |
| Neveras           | Reparación especializada           |
| Lavadoras         | Diagnóstico y solución de fallas   |
| Calentadores      | Instalación y reparación           |
| Estufas y Hornos  | Mantenimiento y reparación         |
| Televisores       | Reparación electrónica             |
| Electricista      | Servicios eléctricos residenciales |
| Computadores      | Soporte técnico                    |
| Cámaras y Alarmas | Instalación y configuración        |

**Tipos de intervención:**

- 🔧 Reparación Especializada — Diagnóstico y solución de fallas
- 🏠 Instalación Calificada — Montaje seguro de equipos nuevos
- 🛡️ Mantenimiento Preventivo — Limpieza y ajustes preventivos

---

## 4. Arquitectura Técnica del Proyecto

### Stack

```
Frontend:   Next.js App Router (React) → PWA
Backend:    Next.js Route Handlers (API)
DB:         PostgreSQL via Neon + Prisma ORM
Realtime:   SSE (Server-Sent Events)
Auth:       NextAuth / JWT
Email:      Brevo / SMTP via queue
Hosting:    Vercel
```

### Estructura de Portales

```
┌─────────────────────────────────────────────────────┐
│                SomosTecnicos PWA                     │
│                                                     │
│  [Portal Cliente]         [Portal Técnico]          │
│   /dashboard/customer      /dashboard/tech          │
│   Solicitar servicio       Ver asignaciones         │
│   Seguimiento órden        Actualizar estados       │
│   Mensajes                 Enviar cotizaciones      │
│   Historial                Reportes de visita       │
│                                                     │
│  [Portal Admin]           [Portal Manager]          │
│   /dashboard/admin         /dashboard/manager       │
│   Gestionar órdenes        Ver reportes             │
│   Asignar técnicos         Dashboard analítico      │
│   Aprobar técnicos         Sin mutaciones directas  │
│   Configuración                                     │
└─────────────────────────────────────────────────────┘
```

---

## 5. Navegación del Sitio Web (somostecnicos.com)

### Navegación Principal

- **Inicio** — Hero con CTA principal
- **Servicios** — Catálogo de servicios por categoría
- **Seguimiento** — Rastreo de orden en tiempo real
- **Contacto** — Formulario + datos de contacto
- **Registrarse** — Registro de clientes
- **Iniciar Sesión** — Login (clientes, técnicos, admin)
- **Solicitar Servicio** — CTA principal

### Páginas del Sitio

```
/                    → Home principal
/servicios           → Catálogo de servicios
/sobre-nosotros      → Equipo y valores
/contacto            → Formulario de contacto
/trabaja-con-nosotros → Registro de técnicos
/blog                → Blog técnico
/barrios             → Cobertura por barrio en Cali
/login               → Autenticación
/seguimiento         → Tracking de orden
```

---

## 6. Ciclo de Vida de Órdenes (State Machine)

```
ESTADOS:
pending → assigned → in_progress → quoted → approved → completed
                                           ↘ rejected
       → cancelled (desde estados tempranos)
```

### Transiciones y Actores

| Transición             | Actor           | Endpoint                           |
| ---------------------- | --------------- | ---------------------------------- |
| pending → assigned     | Admin           | POST /api/orders/[id]/assign       |
| assigned → in_progress | Técnico         | PATCH /api/assignments/[id]/status |
| in_progress → quoted   | Técnico         | POST /api/orders/[id]/quote        |
| quoted → approved      | Cliente / Admin | POST /api/orders/[id]/approve      |
| quoted → rejected      | Cliente / Admin | POST /api/orders/[id]/reject       |
| approved → completed   | Técnico         | POST /api/orders/[id]/close        |
| any → cancelled        | Admin           | PATCH /api/orders/[id]/status      |

---

## 7. Sistema de Eventos (EDA)

### Tipos de Eventos

```typescript
ORDER_CREATED           → nuevo pedido del cliente
ORDER_ASSIGNED          → técnico asignado por admin
ORDER_STATUS_CHANGED    → cambio general de estado
ORDER_QUOTED            → cotización enviada por técnico
ORDER_APPROVED          → cotización aprobada por cliente
ORDER_COMPLETED         → servicio cerrado
MESSAGE_RECEIVED        → nuevo mensaje en thread
APPLICATION_APPROVED    → técnico aprobado en plataforma
APPLICATION_REJECTED    → técnico rechazado
```

### Flujo de Notificaciones (SSE)

```
GET /api/notifications/stream → Push en tiempo real al cliente
```

### Sistema de Mensajes (Threads por Orden)

```
Thread (por orden)
  ├── Cliente ↔ Admin
  ├── Técnico ↔ Admin
  └── Mensajes del sistema (cambios de estado automáticos)

Endpoints:
GET  /api/messages                      → listar mensajes
GET  /api/messages/thread/[threadId]    → mensajes de un thread
POST /api/messages                      → enviar mensaje
PATCH /api/messages/mark-read          → marcar como leídos
```

---

## 8. Estructura PWA — Pantallas por Portal

### Portal Cliente

```
Login / Registro
Dashboard cliente
  ├── Nueva solicitud de servicio
  ├── Mis órdenes (lista + estado)
  ├── Detalle de orden + seguimiento en tiempo real
  ├── Chat con técnico/admin
  ├── Aprobar/rechazar cotización
  └── Historial de servicios

Perfil del cliente
Notificaciones
```

### Portal Técnico

```
Login técnico
Dashboard técnico
  ├── Mis asignaciones del día
  ├── Detalle de asignación
  ├── Actualizar estado (en camino / en sitio / cerrar)
  ├── Enviar cotización
  ├── Chat con cliente/admin
  ├── Subir fotos del trabajo
  └── Historial de servicios realizados

Mi perfil técnico
Notificaciones
```

### Portal Admin

```
Login admin
Dashboard admin
  ├── Órdenes pendientes de asignación
  ├── Asignar técnico a orden
  ├── Ver todas las órdenes (filtros por estado)
  ├── Gestión de técnicos
  ├── Aprobar/rechazar solicitudes de técnicos
  ├── Chat con clientes y técnicos
  └── Configuración del sistema

Reportes
Cola de trabajos (/api/system/queues)
```

### Portal Manager

```
Login manager
Dashboard analítico
  ├── KPIs (órdenes/día, técnicos activos, NPS)
  ├── Reportes por servicio
  ├── Mapa de cobertura
  └── Exportación de datos
```

---

## 9. Flujo Principal del Usuario (Customer Journey)

```
1. DESCUBRIMIENTO
   Landing page → entiende el servicio → CTA "Solicitar"

2. REGISTRO / LOGIN
   Registro con email o teléfono → OTP o contraseña

3. SOLICITUD
   Selecciona tipo de equipo → describe el problema
   → elige disponibilidad horaria → confirma dirección

4. ASIGNACIÓN (Admin)
   Admin recibe notificación → asigna técnico disponible
   → cliente recibe push: "Técnico asignado: [nombre]"

5. VISITA
   Técnico navega → llega → diagnostica
   → envía cotización al cliente

6. APROBACIÓN
   Cliente aprueba o rechaza cotización

7. RESOLUCIÓN
   Técnico ejecuta trabajo → cierra orden con reporte
   → cliente califica al técnico

8. POSTVENTA
   Factura → garantía activada → historial del equipo
```

---

## 10. Identidad Visual para la PWA

### Paleta de Colores

```css
--color-primary: #e40014; /* Rojo marca */
--color-secondary: #f05100; /* Naranja acento */
--color-danger: #bf000f; /* Rojo oscuro para errores */
--color-success: #16a34a; /* Verde para estados positivos */
--color-warning: #f59e0b; /* Amarillo para alertas */
--color-surface: #fef2f2; /* Fondo tenue rojo */
--color-background: #ffffff; /* Blanco base */
--color-text: #1a1a1a; /* Texto principal */
--color-muted: #6b7280; /* Texto secundario */
```

### Estados de Orden (Badges)

```
pending     → badge gris     "Pendiente"
assigned    → badge azul     "Asignado"
in_progress → badge naranja  "En Progreso"
quoted      → badge amarillo "Cotizado"
approved    → badge verde    "Aprobado"
completed   → badge verde    "Completado"
rejected    → badge rojo     "Rechazado"
cancelled   → badge gris     "Cancelado"
```

### Componentes Clave PWA

- `ServiceCard` — Tarjeta de servicio con ícono del equipo
- `OrderStatusBadge` — Badge de estado con color dinámico
- `TechnicianCard` — Perfil del técnico con rating
- `OrderTimeline` — Línea de tiempo del ciclo de vida
- `ChatThread` — Mensajería en tiempo real
- `NotificationBell` — Campanita con contador SSE
- `ServiceRequestForm` — Formulario multi-paso de solicitud
- `QuoteCard` — Tarjeta de cotización con acciones aprobar/rechazar
- `RatingModal` — Modal de calificación post-servicio

---

## 11. Marcas que se Reparan

Samsung, LG, Whirlpool, Haceb, Mabe, Electrolux, Bosch, Sony, Panasonic, Daewoo, Challenger, Kalley, entre otras marcas líderes del mercado colombiano.

---

## 12. Consideraciones PWA

### Características Mobile-First

- **Offline**: Cache de mis órdenes activas
- **Push Notifications**: Al cambiar estado de orden
- **Add to Homescreen**: Manifest configurado con ícono ST
- **Geolocalización**: Para confirmar dirección del cliente
- **Cámara**: Para que el técnico suba fotos del trabajo

### Configuración PWA (manifest.json)

```json
{
  "name": "SomosTécnicos",
  "short_name": "SomosTécnicos",
  "description": "Servicio técnico a domicilio en Cali",
  "theme_color": "#e40014",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

### Service Worker — Estrategias de Cache

```
Network-first:  /api/orders, /api/messages (siempre fresco)
Cache-first:    /servicios, /sobre-nosotros, imágenes de UI
Stale-while-revalidate: Assets estáticos, fuentes
```

---

## 13. SEO y Metadatos

```
Title:       "SomosTécnicos | Servicio Técnico a Domicilio en Cali"
Description: "Técnicos certificados para reparación de neveras, lavadoras,
              calentadores, estufas y televisores en Cali. Garantía incluida."
Keywords:    servicio técnico cali, reparación neveras cali, técnico a domicilio,
             reparación lavadoras cali, calentadores cali
Schema.org:  LocalBusiness → ServiceBusiness
Location:    Cali, Valle del Cauca, Colombia
```

---

## 14. Integraciones y APIs Externas

| Integración  | Propósito                        |
| ------------ | -------------------------------- |
| Brevo / SMTP | Emails transaccionales via queue |
| WhatsApp     | +57 300 309 4854 para soporte    |
| Google Maps  | Ubicación del cliente / técnico  |
| Vercel       | Hosting y deployments            |
| Neon         | PostgreSQL serverless            |

---

## 15. Convenciones del Proyecto

### Rutas de API

```
/api/orders              → CRUD de órdenes
/api/orders/[id]/assign  → asignar técnico
/api/orders/[id]/quote   → enviar cotización
/api/orders/[id]/approve → aprobar cotización
/api/orders/[id]/close   → cerrar orden
/api/assignments/[id]/status → actualizar estado técnico
/api/messages            → mensajería
/api/notifications/stream → SSE tiempo real
/api/system/queues       → estado de la cola
```

### Archivos Clave

```
lib/state-machine.ts        → FSM del ciclo de vida de órdenes
lib/queue.ts                → Cola de trabajos asíncronos
lib/idempotency.ts          → Claves de idempotencia
lib/services/notification.service.ts → Dispatcher de eventos
prisma/schema.prisma        → Modelo de datos
```

---

_Documento generado automáticamente a partir de somostecnicos.com + skill EDA-Architect_
_Última actualización: Marzo 2026_
