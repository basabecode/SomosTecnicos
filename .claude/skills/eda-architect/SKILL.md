---
name: eda-architect
description: Expert in Event-Driven Architecture for SomosTecnicos. Use when analyzing or designing event flows between admin, customer, and technician portals. Covers state machine transitions, notification events, message threading, queue processing, and order lifecycle. Invoke when working on orders, assignments, notifications, messages, or any cross-portal communication.
metadata:
  version: 1.0.0
  author: basabecode
  domain: backend-architecture
  triggers: eventos, state machine, notificaciones, cola de trabajos, ciclo de vida orden, EDA, pub/sub, flujo entre portales
  related-skills: realtime-gateway, admin-dashboard, postgre-design, production-ready
---

# EDA Architect — SomosTecnicos

## Contexto del Proyecto

SomosTecnicos usa una arquitectura **event-driven ligera** basada en:

- **Next.js App Router** con Route Handlers como endpoints de eventos
- **Prisma + PostgreSQL (Neon)** como event store implícito
- **State Machine** (`lib/state-machine.ts`) para el ciclo de vida de órdenes
- **Queue system** (`lib/queue.ts`) para procesamiento asíncrono
- **SSE** (`/api/notifications/stream`) como canal de entrega en tiempo real
- **Sin broker externo** (no Kafka, no RabbitMQ, no Redis)

## Portales y sus Roles en el EDA

```
┌────────────────────────────────────────────────────┐
│                   EVENT FLOW                        │
│                                                     │
│  [Customer Portal]                                  │
│    → Crea orden (POST /api/orders)                  │
│    → Recibe notificaciones (SSE stream)             │
│    → Lee mensajes (/api/messages)                   │
│                                                     │
│  [Admin Portal]                                     │
│    → Asigna técnico (POST /api/orders/[id]/assign)  │
│    → Aprueba/rechaza (approve, reject)              │
│    → Gestiona aplicaciones de técnicos              │
│                                                     │
│  [Technician Portal]                                │
│    → Recibe asignación (assignments)                │
│    → Actualiza estado (status, quote, close)        │
│    → Envía reportes de visita                       │
│                                                     │
│  [Manager Portal]                                   │
│    → Vista de reportes y dashboard                  │
│    → Sin capacidad de mutación directa              │
└────────────────────────────────────────────────────┘
```

## State Machine — Ciclo de Vida de Órdenes

Archivo clave: `lib/state-machine.ts`

```
ORDEN STATES:
pending → assigned → in_progress → quoted → approved → completed
                                          ↘ rejected
       → cancelled (desde cualquier estado temprano)
```

**Transiciones y quién las dispara:**

| Transición             | Actor         | Endpoint                           |
| ---------------------- | ------------- | ---------------------------------- |
| pending → assigned     | Admin         | POST /api/orders/[id]/assign       |
| assigned → in_progress | Técnico       | PATCH /api/assignments/[id]/status |
| in_progress → quoted   | Técnico       | POST /api/orders/[id]/quote        |
| quoted → approved      | Cliente/Admin | POST /api/orders/[id]/approve      |
| approved → completed   | Técnico       | POST /api/orders/[id]/close        |
| any → cancelled        | Admin         | PATCH /api/orders/[id]/status      |

## Sistema de Notificaciones como Event Bus

Archivo clave: `lib/services/notification.service.ts`

El servicio de notificaciones actúa como **event dispatcher interno**:

```typescript
// Patrón actual en el proyecto
await NotificationService.create({
  userId: targetUserId,
  type: 'ORDER_ASSIGNED', // tipo de evento
  title: '...',
  message: '...',
  orderId: order.id,
})

// Entrega via SSE
// GET /api/notifications/stream → evento push al cliente
```

**Tipos de eventos identificados:**

- `ORDER_CREATED` — nuevo pedido del cliente
- `ORDER_ASSIGNED` — técnico asignado
- `ORDER_STATUS_CHANGED` — cambio de estado
- `ORDER_QUOTED` — cotización enviada
- `ORDER_APPROVED` — cotización aprobada
- `ORDER_COMPLETED` — servicio cerrado
- `MESSAGE_RECEIVED` — nuevo mensaje en thread
- `APPLICATION_APPROVED` / `APPLICATION_REJECTED` — técnico aprobado/rechazado

## Sistema de Mensajes

Archivos clave: `app/api/messages/`

El sistema de mensajes usa **threads** por orden:

```
Thread (por orden)
  ├── Mensajes entre Cliente ↔ Admin
  ├── Mensajes entre Técnico ↔ Admin
  └── Mensajes del sistema (cambios de estado)
```

Endpoints:

- `GET /api/messages` — listar mensajes
- `GET /api/messages/thread/[threadId]` — mensajes de un thread
- `POST /api/messages` — enviar mensaje
- `PATCH /api/messages/mark-read` — marcar leídos

## Queue System

Archivo clave: `lib/queue.ts`

Cola interna para procesamiento asíncrono:

- Envío de emails (Brevo/SMTP)
- Generación de facturas
- Notificaciones diferidas

Monitoreo: `GET /api/system/queues`

## Workflow de Análisis EDA

Cuando Claude Code analiza el flujo EDA del proyecto:

1. **Leer state machine** → `lib/state-machine.ts`
2. **Rastrear transiciones** → cada endpoint que cambia estado de orden
3. **Verificar notificaciones** → ¿cada transición dispara notificación al actor correcto?
4. **Revisar mensajes** → ¿los threads se crean correctamente por orden?
5. **Auditar queue** → ¿los jobs fallidos tienen retry/dead letter?
6. **Verificar SSE** → ¿el stream cierra correctamente y maneja reconexión?

## Incongruencias Comunes a Detectar

### Notificaciones faltantes

- ¿Toda transición de estado notifica a TODOS los actores relevantes?
- ¿El cliente recibe notificación cuando el técnico cierra la orden?
- ¿El técnico recibe notificación cuando el cliente aprueba la cotización?

### State Machine

- ¿Existen transiciones de estado que no pasan por `lib/state-machine.ts`?
- ¿Hay endpoints que cambian `order.status` directamente en DB sin validar la FSM?

### Mensajes

- ¿Los threads se crean automáticamente al crear una orden?
- ¿Los mensajes del sistema (cambios de estado) se insertan en el thread?

### Queue

- ¿Los emails críticos (asignación, cotización) están en la cola o son síncronos?
- ¿Hay manejo de errores en jobs fallidos?

## Checklist de Auditoría EDA

```
[ ] lib/state-machine.ts define todas las transiciones válidas
[ ] Cada Route Handler de estado valida contra la FSM antes de mutar DB
[ ] NotificationService.create() se llama después de cada transición exitosa
[ ] Notificación llega al actor correcto (no solo al admin)
[ ] Thread de mensajes existe para cada orden activa
[ ] Queue procesa emails críticos de forma asíncrona
[ ] /api/system/queues expone estado de la cola
[ ] SSE stream maneja desconexión y cleanup correcto
[ ] Idempotency keys en operaciones críticas (lib/idempotency.ts)
```

## Anti-Patrones a Detectar

| Anti-Patrón                      | Síntoma en Código                                      | Corrección                             |
| -------------------------------- | ------------------------------------------------------ | -------------------------------------- |
| Estado directo en DB             | `prisma.order.update({ status: 'completed' })` sin FSM | Pasar por `stateMachine.transition()`  |
| Notificación síncrona bloqueante | `await sendEmail()` dentro del Route Handler           | Encolar en `queue.add()`               |
| Thread duplicado                 | Crear thread sin verificar existencia                  | Check `findFirst` antes de crear       |
| SSE sin cleanup                  | Sin `req.signal.addEventListener('abort')`             | Cerrar conexión al desconectar cliente |
| Notificación al actor incorrecto | Notificar solo al admin en cierre de orden             | Notificar a cliente Y técnico          |
