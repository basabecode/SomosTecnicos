---
description: Estado del sistema de seguimiento de órdenes y plan maestro de facturación electrónica.
---

# 📦 Workflow: Seguimiento y Facturación

Este documento consolida el estado de la funcionalidad de rastreo de servicios y el plan de implementación de la facturación electrónica.

## 🕒 1. Sistema de Seguimiento (Implementado)

### Arquitectura de Rastreo
*   **Identificador Único:** `orderNumber` (unique string indexado en BD).
*   **Búsqueda Pública/Privada:** Endpoint `GET /api/orders/search?numeroOrden={numero}`.
*   **Portal Cliente:** Componente `OrderTrackingDashboard` permite buscar por número de orden y ver estado del técnico, ETA y progreso.
*   **Paneles Internos:** El número de orden es visible y buscable en las tablas y tarjetas de Admin y Técnico.

### Componentes Clave
- `components/dashboard/order-tracking-dashboard.tsx`
- `app/api/orders/search/route.ts`
- `components/domain/service-timeline.tsx` (Visualización de progreso)

---

## 🧾 2. Facturación Electrónica (En Progreso)

### Objetivos del Sistema
1.  Generación automática de PDF al completar el servicio.
2.  Envío multicanal (Email vía Resend, WhatsApp Business API).
3.  Cumplimiento legal básico de facturación consecutiva.

### Estado de Implementación
*   ✅ **Modelo de Datos:** Tabla `Invoice` creada en Prisma con todos los campos fiscales necesarios.
*   ✅ **Generador PDF:** Utilidad base configurada en `lib/invoice`.
*   🚧 **Pendiente:** Endpoints API (`/api/invoices/generate`), integración con flujo de pago y UI de historial para Admin/Cliente.

---

## 📅 3. Plan de Acción (Ene - Feb 2026)

### Fase A: API y Lógica de Generación
- [ ] Endpoint `POST /api/invoices/generate` vinculado al cierre de orden.
- [ ] Integración con el servicio de Email (Resend).
- [ ] Lógica de numeración secuencial fiscal.

### Fase B: Interfaz de Usuario
- [ ] Panel de "Mis Facturas" en el portal de cliente.
- [ ] Gestión centralizada de facturas en el panel administrativo.
- [ ] Botón "Descargar Factura" en el detalle de servicios completados.

---

## 🛠️ Tecnologías Utilizadas
- **PDF:** `@react-pdf/renderer` para generación dinámica.
- **Emails:** `Resend` para entrega de adjuntos.
- **WhatsApp:** Link dinámico `wa.me` (MVP) o WhatsApp Business API (Fase Avanzada).

---
*Este documento consolida el análisis de seguimiento y el plan de facturación.*
