---
name: realtime-gateway
description: Expert in real-time communication for SomosTecnicos. Use when working on SSE streams, notification delivery, message polling, or evaluating whether to upgrade to WebSockets. Covers the /api/notifications/stream endpoint, notification-context, notification-bell component, and cross-portal real-time sync. Invoke for any work on notificaciones, mensajes en tiempo real, or live dashboard updates.
metadata:
  version: 1.0.0
  author: basabecode
  domain: realtime-frontend-backend
  triggers: SSE, notificaciones, tiempo real, stream, notification bell, mensajes, live updates, WebSocket
  related-skills: eda-architect, admin-dashboard, vercel-react-best-practices
---

# Realtime Gateway — SomosTecnicos

## Arquitectura Actual de Tiempo Real

El proyecto usa **Server-Sent Events (SSE)** — NO WebSockets.

```
┌─────────────────┐         HTTP SSE         ┌──────────────────┐
│   Browser       │ ←──────────────────────── │  Next.js Server  │
│  (3 portales)   │  eventos unidireccionales  │  /api/notifications│
│                 │                            │  /stream         │
│  notification   │ ────── HTTP POST ─────────→│  /api/messages   │
│  -context       │  (enviar mensajes)         │  /api/orders/... │
└─────────────────┘                            └──────────────────┘
                                                       │
                                                       ▼
                                              PostgreSQL (Neon)
                                              + lib/queue.ts
```

## Archivos Clave

```
app/api/notifications/stream/route.ts   ← SSE endpoint
app/api/notifications/route.ts          ← CRUD notificaciones
app/api/notifications/[id]/read/route.ts
app/api/notifications/read-all/route.ts
app/api/notifications/clear/route.ts
lib/services/notification.service.ts   ← Crear/leer notificaciones
contexts/notification-context.tsx       ← Estado global frontend
components/notifications/notification-system.tsx
components/navigation/notification-bell.tsx
```

## Implementación SSE Correcta

### Backend — Stream Endpoint

```typescript
// app/api/notifications/stream/route.ts
export const runtime = 'edge' // CRÍTICO para Vercel

export async function GET(req: Request) {
  const user = await getAuthUser(req)
  if (!user) return new Response('Unauthorized', { status: 401 })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Enviar notificaciones pendientes al conectar
      const pending = await NotificationService.getUnread(user.id)
      if (pending.length > 0) {
        sendEvent({ type: 'INITIAL', notifications: pending })
      }

      // Polling interno cada 3 segundos
      const interval = setInterval(async () => {
        const latest = await NotificationService.getLatest(user.id)
        if (latest) sendEvent({ type: 'NEW_NOTIFICATION', data: latest })
      }, 3000)

      // CRÍTICO: cleanup al desconectar
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // importante para Vercel/nginx
    },
  })
}
```

### Frontend — Notification Context

```typescript
// contexts/notification-context.tsx
const connectSSE = useCallback(() => {
  if (!user) return

  const eventSource = new EventSource('/api/notifications/stream')

  eventSource.onmessage = event => {
    const data = JSON.parse(event.data)

    if (data.type === 'INITIAL') {
      setNotifications(data.notifications)
    } else if (data.type === 'NEW_NOTIFICATION') {
      setNotifications(prev => [data.data, ...prev])
    }
  }

  eventSource.onerror = () => {
    eventSource.close()
    // Reconexión con backoff exponencial
    setTimeout(connectSSE, 5000)
  }

  return () => eventSource.close()
}, [user])

useEffect(() => {
  const cleanup = connectSSE()
  return cleanup
}, [connectSSE])
```

## Incongruencias a Detectar

### SSE Stream

- [ ] ¿El stream hace cleanup con `req.signal.addEventListener('abort')`?
- [ ] ¿Tiene header `X-Accel-Buffering: no` para Vercel?
- [ ] ¿El intervalo de polling se limpia al cerrar?
- [ ] ¿Maneja autenticación antes de abrir el stream?
- [ ] ¿Usa `export const runtime = 'edge'` para evitar timeout de 60s?

### Notification Context

- [ ] ¿Reconecta el SSE cuando se pierde la conexión?
- [ ] ¿Los 3 portales (admin, customer, technician) usan el mismo contexto?
- [ ] ¿El badge de notificaciones se actualiza en tiempo real sin refresh?
- [ ] ¿Se marca como leída la notificación al hacer click?

### Mensajes

- [ ] ¿El polling de mensajes nuevos está integrado con el SSE o es independiente?
- [ ] ¿El componente de mensajes actualiza la lista sin recargar la página?
- [ ] ¿Los threads muestran indicador de mensajes no leídos?

### Cross-portal

- [ ] ¿Cuando el admin asigna un técnico, el técnico recibe notificación SSE inmediata?
- [ ] ¿Cuando el técnico actualiza estado, el cliente recibe SSE?
- [ ] ¿El admin ve actualizaciones en vivo en el dashboard sin refresh?

## Decisión: SSE vs WebSocket

Para SomosTecnicos, **SSE es la elección correcta** porque:

| Criterio                     | SSE ✓              | WebSocket |
| ---------------------------- | ------------------ | --------- |
| Vercel compatible            | Sí (Edge runtime)  | Limitado  |
| Unidireccional server→client | Sí                 | Overkill  |
| Reconexión automática        | Nativa del browser | Manual    |
| Complejidad                  | Baja               | Alta      |
| Escala serverless            | Sí                 | No        |

**Solo migrar a WebSocket si:** se necesita edición colaborativa en tiempo real
o chat con latencia < 100ms entre usuarios simultáneos.

## Limitaciones SSE en Vercel

```
⚠️  Vercel Function timeout: 60s (Hobby), 300s (Pro) en Node.js runtime
✅  Edge Runtime: sin timeout, ideal para SSE de larga duración
⚠️  No persistent connections — cada reconexión es nueva función
```

## Checklist de Auditoría Realtime

```
[ ] /api/notifications/stream usa Edge Runtime
[ ] Stream hace cleanup en abort signal
[ ] Frontend reconecta con backoff al perder SSE
[ ] notification-context.tsx compartido entre los 3 portales
[ ] notification-bell.tsx muestra contador en tiempo real
[ ] Mensajes nuevos disparan notificación SSE al destinatario
[ ] Dashboard admin actualiza stats sin refresh manual
[ ] No hay memory leaks en intervalos del stream
[ ] Autenticación verificada antes de abrir stream
[ ] Headers correctos para Vercel (X-Accel-Buffering: no)
```

## Anti-Patrones a Detectar

| Anti-Patrón               | Síntoma                                          | Corrección                      |
| ------------------------- | ------------------------------------------------ | ------------------------------- |
| Stream sin cleanup        | Sin `req.signal` handler                         | Agregar abort listener          |
| Polling en frontend       | `setInterval(() => fetch('/api/notifications'))` | Usar SSE context                |
| SSE sin autenticación     | Stream abierto sin verificar JWT                 | Auth antes del stream           |
| Sin reconexión            | `eventSource.onerror` vacío                      | Retry con backoff               |
| Notificación sin SSE push | Solo guarda en DB                                | Trigger en NotificationService  |
| Node.js runtime en stream | Timeout a los 60s en Vercel                      | `export const runtime = 'edge'` |
