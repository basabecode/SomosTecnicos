# Diseño: Sistema de Ciclo de Vida Completo de Servicios

**Fecha:** 2026-02-09
**Estado:** Validado
**Autor:** Brainstorming colaborativo

---

## 1. Resumen Ejecutivo

Implementar trazabilidad end-to-end de servicios con código único `ORD-YYYY-NNNN`, módulo de cotización/cierre en el portal del técnico, aprobación de cotización por el cliente, y visibilidad completa para el administrador como observador.

---

## 2. Decisiones de Diseño

| Decisión | Resultado |
|----------|-----------|
| Código de servicio | Reutilizar `orderNumber` con formato `ORD-YYYY-NNNN` |
| Formulario de cierre | 3 campos: descripción, costo total, estado final |
| Registro de repuestos | No itemizado. Solo costo total |
| Visibilidad al cliente | Inmediata, sin aprobación del admin |
| Estados finales | Mapear a existentes: `reparado`, `cancelado`, `reagendado` |
| Aprobación de cotización | El cliente aprueba/rechaza desde su portal |
| Costo de visita técnica | $50.000 COP fijo, configurable por admin, abonable al total |
| Rol del admin | Observador omnisciente: ve todo, no interviene en el flujo |

---

## 3. Regla de Negocio: Costos

### Visita técnica
- Costo fijo: **$50.000 COP** (configurable en `SystemSetting` key: `COSTO_VISITA_TECNICA`)
- Se cobra SIEMPRE que el técnico acude al domicilio

### Escenarios de cobro

| Escenario | Lo que paga el cliente |
|-----------|----------------------|
| Cliente aprueba cotización de $350.000 | $350.000 (los $50k de visita ya están incluidos en el total) |
| Cliente rechaza la cotización | Solo $50.000 (visita) |
| Equipo no tiene arreglo | Solo $50.000 (visita) |
| Técnico cierra como reparado con costo $X | $X (visita incluida) |

---

## 4. Flujo Completo del Servicio

```
Cliente solicita servicio
        │
        ▼
  [pendiente] ──admin asigna──▶ [asignado]
                                    │
                              técnico en camino
                                    │
                                    ▼
                              [en_camino]
                                    │
                              técnico llega y revisa
                                    │
                                    ▼
                               [revisado]
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              Tiene arreglo    No reparable    Requiere seguimiento
                    │               │               │
                    ▼               ▼               ▼
              [cotizado]      [cancelado]      [reagendado]
                    │          costo: $50k
                    │
          ┌─────────┴─────────┐
          │                   │
    Cliente APRUEBA     Cliente RECHAZA
          │                   │
          ▼                   ▼
     [en_proceso]        [cancelado]
          │               costo: $50k
    técnico repara
          │
          ▼
     [reparado]
     costo: $total
          │
          ▼
     [entregado]
          │
          ▼
     [completado]
```

---

## 5. Acciones del Técnico

### 5.1 Enviar Cotización
- **Cuándo:** Después del diagnóstico (estado `revisado`)
- **Ruta:** `/technician/assignments/[id]/quote`
- **API:** `POST /api/orders/[id]/quote`
- **Campos del formulario:**
  - Diagnóstico (texto libre, obligatorio)
  - Costo estimado de reparación (número COP, obligatorio)
- **Efectos:**
  - `Order.estado` → `cotizado`
  - `Order.costoEstimado` → monto ingresado
  - `OrderHistory` → registro con `changedBy: 'technician'`
  - `Notification` → se crea para el cliente

### 5.2 Cerrar como Reparado
- **Cuándo:** Después de reparar (estado `en_proceso`)
- **Ruta:** `/technician/assignments/[id]/close`
- **API:** `PATCH /api/orders/[id]/close`
- **Campos del formulario:**
  - Descripción del trabajo realizado (texto, obligatorio)
  - Costo total final (número COP, obligatorio)
  - Estado: `reparado` (preseleccionado)
- **Efectos (transacción Prisma):**
  - `Order.estado` → `reparado`
  - `Order.costoFinal` → monto ingresado
  - `Assignment.estado` → `completado`
  - `Assignment.notasTecnico` → descripción del trabajo
  - `Assignment.fechaCompletada` → `now()`
  - `OrderHistory` → registro con `changedBy: 'technician'`
  - `Notification` → se crea para el cliente

### 5.3 Cerrar como No Reparable
- **Cuándo:** Después de diagnosticar que no tiene arreglo (estado `revisado`)
- **Ruta:** `/technician/assignments/[id]/close`
- **API:** `PATCH /api/orders/[id]/close`
- **Campos del formulario:**
  - Descripción del problema (texto, obligatorio)
  - Estado: `no reparable` seleccionado
  - Costo: se autocompleta con $50.000 (visita técnica, no editable)
- **Efectos (transacción Prisma):**
  - `Order.estado` → `cancelado`
  - `Order.costoFinal` → $50.000 (valor de `COSTO_VISITA_TECNICA`)
  - `Assignment.estado` → `completado`
  - `Assignment.notasTecnico` → descripción
  - `Assignment.fechaCompletada` → `now()`
  - `OrderHistory` → registro con metadata `{ motivo: 'no_reparable' }`
  - `Notification` → se crea para el cliente

---

## 6. Acciones del Cliente

### 6.1 Aprobar Cotización
- **Cuándo:** Orden en estado `cotizado`
- **Dónde:** `/customer/services` o card en `/customer/dashboard`
- **API:** `PATCH /api/orders/[id]/approve`
- **Body:** `{ action: 'approve' }`
- **Efectos:**
  - `Order.estado` → `en_proceso`
  - `OrderHistory` → registro con `changedBy: 'customer'`
  - `Notification` → se crea para el técnico

### 6.2 Rechazar Cotización
- **Cuándo:** Orden en estado `cotizado`
- **API:** `PATCH /api/orders/[id]/approve`
- **Body:** `{ action: 'reject' }`
- **Efectos:**
  - `Order.estado` → `cancelado`
  - `Order.costoFinal` → $50.000 (visita)
  - `OrderHistory` → registro con metadata `{ motivo: 'cotizacion_rechazada' }`
  - `Notification` → se crea para el técnico

---

## 7. Vista del Administrador

El administrador es un **observador omnisciente**: ve todo, no participa activamente en el flujo.

### Lo que ve en `/admin/orders/[id]`
- Timeline completo del servicio vía `OrderHistory`
- Cada transición con: quién la hizo, cuándo, y notas
- Diagnóstico del técnico
- Cotización enviada y decisión del cliente
- Descripción del trabajo y costo final
- Resumen financiero (visita vs. reparación)

### Filtros adicionales en el dashboard
- Filtro: "Cotizaciones pendientes" (órdenes en estado `cotizado`)
- Filtro: "Servicios cerrados hoy"
- Todas las notificaciones del sistema llegan también al admin

---

## 8. Cambios Necesarios

### 8.1 Corrección del `orderNumber`

| Archivo | Cambio |
|---------|--------|
| `lib/constants.ts` | Eliminar `generateOrderNumber()` (necesita BD) |
| `lib/order-utils.ts` (NUEVO) | Nuevo `generateOrderNumber()` que consulta BD: último del año + 1 |
| `lib/constants.ts` | Actualizar `REGEX_PATTERNS.ORDER_NUMBER` a `/^ORD-\d{4}-\d{4}$/` |
| `app/api/orders/route.ts` | Usar nuevo generador |
| `app/api/orders/optimized/route.ts` | Reemplazar generador inline |

### 8.2 APIs Nuevas

| Archivo | Método | Propósito |
|---------|--------|-----------|
| `app/api/orders/[id]/quote/route.ts` | POST | Técnico envía cotización |
| `app/api/orders/[id]/approve/route.ts` | PATCH | Cliente aprueba/rechaza |
| `app/api/orders/[id]/close/route.ts` | PATCH | Técnico cierra servicio |

### 8.3 Páginas Nuevas

| Archivo | Portal | Propósito |
|---------|--------|-----------|
| `app/(technician)/technician/assignments/[id]/quote/page.tsx` | Técnico | Formulario de cotización |
| `app/(technician)/technician/assignments/[id]/close/page.tsx` | Técnico | Formulario de cierre |
| `components/service-quote-card.tsx` | Cliente | Card de cotización con Aprobar/Rechazar |

### 8.4 Configuración del Sistema

| Key en `SystemSetting` | Valor | Descripción |
|------------------------|-------|-------------|
| `COSTO_VISITA_TECNICA` | `50000` | Costo fijo de visita técnica en COP |

### 8.5 Sin cambios en el Schema de Prisma
Se reutilizan campos existentes:
- `Order.costoEstimado` → cotización
- `Order.costoFinal` → cobro real
- `Order.descripcionProblema` → diagnóstico
- `Assignment.notasTecnico` → descripción del trabajo
- `OrderHistory.metadata` → motivos de cancelación

---

## 9. Orden de Implementación

### Fase 1: Código de orden (bajo riesgo)
1. Crear `lib/order-utils.ts` con generador secuencial
2. Actualizar APIs de creación de órdenes
3. Actualizar regex

### Fase 2: Cotización (técnico → cliente)
4. API `/api/orders/[id]/quote`
5. UI `/technician/assignments/[id]/quote`
6. Insertar `COSTO_VISITA_TECNICA` en SystemSetting

### Fase 3: Aprobación (cliente)
7. API `/api/orders/[id]/approve`
8. Componente `service-quote-card.tsx`
9. Integrar en dashboard/services del cliente

### Fase 4: Cierre (técnico)
10. API `/api/orders/[id]/close`
11. UI `/technician/assignments/[id]/close`

### Fase 5: Observabilidad (admin)
12. Timeline visual en detalle de orden del admin
13. Filtros de cotizaciones pendientes
