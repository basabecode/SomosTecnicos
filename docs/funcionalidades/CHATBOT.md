# DOCUMENTACIÓN MAESTRA: SISTEMA DE CHAT UNIFICADO
## SomosTécnicos - Servicios de Reparación a Domicilio

Este documento constituye la fuente única de verdad sobre la arquitectura, implementación y mejoras del sistema de mensajería interna de la plataforma SomosTécnicos.

---

## 1. 🛠️ ARQUITECTURA Y TECNOLOGÍAS

El sistema de chat está diseñado para proporcionar una comunicación fluida y jerárquica entre **Clientes**, **Técnicos** y **Administradores (Soporte)**.

### Stack Tecnológico
| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Framework** | **Next.js 14/15/16** | Gestión de rutas (App Router), Server Components y API Routes. |
| **Persistencia** | **PostgreSQL** | Almacenamiento de mensajes, hilos y relaciones. |
| **ORM** | **Prisma** | Modelado de datos, consultas seguras y migraciones. |
| **Autenticación** | **JWT / AuthContext** | Control de acceso basado en roles (`admin`, `technician`, `customer`). |
| **Interfaz** | **Tailwind CSS & Lucide Icons** | Diseño responsivo (Breakpoint `md`), moderno y minimalista. |
| **Actualización** | **HTTP Polling (60s Notifications / 10s Chat)** | Sincronización continua de datos entre cliente y servidor. |
| **UI Updates** | **Optimistic UI Updates** | Feedback inmediato al usuario antes de confirmar con el servidor. |

---

## 2. 🏗️ ESTRUCTURA Y FUNCIONAMIENTO

### Lógica de Enrutamiento (`lib/chat-logic.ts`)
Para evitar la fragmentación de conversaciones, se utiliza una lógica centralizada de agrupación:
- **Threads por Orden**: Si un mensaje incluye un `orderId`, se agrupa bajo la clave `order-{orderId}`.
- **Threads Directos**: Si no hay orden, se agrupa por el par de usuarios (`direct-{partnerId}`).
- **Buzón de Soporte ('0')**: El ID `0` representa al sistema de soporte general, atendido por administradores.

### Componentes Clave
- **`NotificationBell`**: Gestiona las alertas globales, el conteo de no leídos y el acceso rápido a conversaciones recientes.
- **`chat-logic.ts`**: Biblioteca compartida que determina a quién responder (`calculateReplyReceiver`) y cómo agrupar mensajes (`getThreadKey`).
- **`notification-context.tsx`**: Contexto global de React que mantiene el estado de las alertas en tiempo real en todos los paneles.

---

## 3. 🚀 MEJORAS HISTÓRICAS Y CONSOLIDADAS

### Integridad de Identidad
- **Sincronización de Perfiles**: Se resolvió la discrepancia entre las tablas `Technician` y `AdminUser`, permitiendo que los técnicos utilicen su identidad única para enviar y recibir mensajes sin pérdida de datos.
- **Normalización de Nombres**: Se sustituyeron los identificadores genéricos por nombres reales mediante consultas *Just-In-Time* (JIT) en los paneles de administración.

### Backend y Estabilidad
- **Compatibilidad Next.js 15+**: Se actualizaron las rutas dinámicas (`params`) para ser tratadas como promesas awaitables, corrigiendo errores 500 en la eliminación de hilos.
- **Sanitización de Datos**: El endpoint `POST /api/messages` ahora valida y limpia los campos `orderId` (evitando fallos de clave foránea) y asegura la integridad del remitente.

### UX y Visualización
- **Alineación Inteligente (`isMe`)**: Comparación robusta de IDs para asegurar que los mensajes propios siempre aparezcan a la derecha.
- **Layout Adaptativo**: Ajuste del breakpoint principal a `md` (768px). Esto garantiza que en tablets y laptops medianas se mantenga la vista de dos columnas (Lista + Chat) en lugar de colapsar a vista móvil.
- **Modo "Leído" Automático**: Al abrir una conversación, el sistema marca inmediatamente los mensajes como leídos, actualizando los contadores de forma optimista.

---

## 4. 🔍 VALIDACIÓN DE ÚLTIMOS CAMBIOS (FUNCIONAL)

A fecha de enero de 2026, las últimas implementaciones críticas han sido validadas como **totalmente funcionales**:

1.  **Eliminación de Chat por Admin**: Los administradores ahora pueden borrar conversaciones dirigidas al buzón `support` ('0') gracias a la expansión de permisos en la query de eliminación.
2.  **Campana de Notificaciones Inteligente**:
    *   **Auto-Limpieza**: Al hacer clic en la campana, el contador rojo desaparece al instante (`markAllAsRead`) mediante una actualización optimista.
    *   **Estado Persistente**: Se corrigió el bug que hacía reaparecer alertas borradas al actualizar la página, asegurando que el estado del backend sea el que mande.
3.  **Botón "Volver al Inicio"**: Implementado en el sidebar de los tres paneles (Cliente, Técnico, Administrador) para facilitar la navegación fuera del dashboard.
4.  **Scripts de Test Automáticos**: El script `scripts/test-chat-system.ts` valida el flujo completo (Envío -> Recepción -> Respuesta -> Borrado) sin dejar residuos en la base de datos de producción.

---

## 5. 🟢 ESTADO FINAL
El sistema de chat es actualmente **ROBUSTO, CONSISTENTE y ESCALABLE**. Se ha eliminado la redundancia de código y se ha unificado la experiencia de usuario en todos los niveles de acceso.

---
**Auditor de Software:** Antigravity Agent
**Fecha de Consolidación:** 27 de Enero de 2026
**Estatus:** ✅ CERTIFICADO PARA PRODUCCIÓN
