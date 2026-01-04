# Tareas Pendientes: Sistema de Facturación Electrónica

**Fecha de Creación:** 03 de Enero de 2026
**Estado:** En Progreso (Fase 1 y 2 Completadas)

Este documento detalla los pasos restantes para completar la implementación del sistema de facturación electrónica en la plataforma.

---

## 🟢 Lo que ya está hecho (Pasos 1 y 2)

1.  **Modelo de Datos `Invoice`**: Agregado a `prisma/schema.prisma` y sincronizado parcialmente (requiere revisión final de migración).
2.  **Librería de Generación de PDF**:
    *   `lib/invoice/templates/invoice-template.tsx`: Plantilla visual profesional.
    *   `lib/invoice/generator.ts`: Lógica para generar y guardar el PDF.
    *   `lib/invoice/invoice-number.ts`: Utilidad para numeración consecutiva.

---

## 🟡 Tareas Pendientes (Para próxima sesión)

### 1. Implementar API de Backend (Paso 3)
Crear los endpoints necesarios para que el frontend pueda solicitar la creación de facturas.

*   [ ] **Crear endpoint de generación:** `app/api/invoices/generate/route.ts`
    *   Debe recibir `orderId`, `paymentMethod`, `paymentReference`.
    *   Debe calcular costos (subtotal, IVA, total).
    *   Debe llamar a `generateInvoicePDF`.
    *   Debe guardar registro en base de datos.
*   [ ] **Crear endpoint de listado:** `app/api/invoices/route.ts` (para admin).
*   [ ] **Crear endpoint por orden:** `app/api/invoices/by-order/[orderId]/route.ts`.

### 2. Implementar Sistema de Envío (Pasos 4 y 5)
Configurar los servicios para enviar las facturas a los clientes.

*   [ ] **Configurar Resend (Email)**:
    *   Instalar SDK: `pnpm add resend`.
    *   Configurar API Key en `.env`.
    *   Crear servicio: `lib/invoice/email-sender.ts`.
*   [ ] **Configurar WhatsApp**:
    *   Crear utilidad `lib/invoice/whatsapp-sender.ts`.
    *   Definir si se usa API oficial o enlace `wa.me` (enlace recomendado inicialmente).

### 3. Interfaz de Usuario (Paso 6)
Crear las pantallas y botones para que los usuarios interactúen con el sistema.

*   **Panel Administrativo**:
    *   [ ] Botón "Generar Factura" en el detalle de la orden (`/admin/orders/[id]`).
    *   [ ] Modal para confirmar datos de pago antes de generar.
    *   [ ] Vista de lista de facturas (`/admin/invoices`).
*   **Portal del Cliente**:
    *   [ ] Sección "Mis Facturas" en el dashboard.
    *   [ ] Botón de descarga de PDF en el detalle del servicio.

### 4. Pruebas y Validación
*   [ ] Verificar que el consecutivo de facturas no se repita.
*   [ ] Validar cálculos de IVA y totales.
*   [ ] Probar la descarga del PDF en móviles.
*   [ ] Verificar que los correos lleguen correctamente.

---

## 📝 Notas Técnicas Importantes

*   **Migración de BD Pending**: Hubo un bloqueo de archivo al intentar migrar la base de datos (`prisma db push`). **Acción requerida:** Detener el servidor de desarrollo (`pnpm run dev`), ejecutar `npx prisma db push` o `npx prisma migrate dev`, y luego volver a iniciar el servidor.
*   **Dependencias**: Asegurarse de que `@react-pdf/renderer` esté funcionando correctamente en el entorno de build (Vercel), ya que a veces requiere configuración adicional en `next.config.js`.

## 📍 Ubicación de Archivos Clave
*   Schema: `prisma/schema.prisma`
*   Lógica Facturación: `lib/invoice/`
*   Assets Públicos: `public/invoices/`
