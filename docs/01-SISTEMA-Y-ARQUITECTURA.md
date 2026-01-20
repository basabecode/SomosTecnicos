# 🏗️ 01. SISTEMA Y ARQUITECTURA - Única Fuente de Verdad (SSOT)

**Proyecto:** SomosTécnicos - Sistema de Gestión de Servicios Técnicos (Field Service Management - FSM)
**Última Versión Consolidada:** Enero 2026
**Estado General:** 90% Completado ✅

---

## 1. Resumen Ejecutivo
**SomosTécnicos** es una plataforma integral diseñada para centralizar la recepción de solicitudes de servicio técnico y permitir que un administrador coordine al equipo técnico de manera eficiente.

### Objetivos Clave:
- **Asignación Manual Directa:** Control total del administrador sobre las asignaciones.
- **Interfaz Móvil Prioritaria:** Optimizado para técnicos en campo y clientes finales.
- **Transparencia:** Seguimiento del estado de la orden en tiempo real.
- **Comunicación:** Notificaciones in-app y externas (Email/SMS/WhatsApp).

---

## 2. Arquitectura de Software

### 👥 Roles y Permisos (RBAC)
- **Super Administrador:** Acceso total (configuraciones, finanzas, usuarios).
- **Administrador / Manager:** Gestión operativa de órdenes, técnicos y asignaciones.
- **Técnico:** Vista móvil para gestionar tareas asignadas y reportar estados.
- **Cliente:** Portal para solicitar servicios, rastrear órdenes y gestionar perfil.

### 🔄 Flujo de Estados (FSM)
1. **PENDIENTE:** Solicitud enviada por el cliente.
2. **ASIGNADO:** Administrador vincula un técnico a la orden.
3. **EN_PROCESO:** El técnico ha iniciado la labor (o está "En camino").
4. **COMPLETADO:** Servicio finalizado con éxito.
5. **CANCELADO:** Orden anulada por el cliente o administrador.

### 🛠️ Stack Tecnológico
- **Frontend:** Next.js 15.2.4 (App Router), React 19, Tailwind CSS, shadcn/ui.
- **Backend:** Next.js API Routes, TypeScript.
- **Base de Datos:** PostgreSQL (Prisma ORM).
- **Seguridad:** JWT (Access/Refresh Tokens), Middleware de protección.
- **Validación:** Zod (Esquemas globales).
- **Notificaciones:** Resend (Email), Twilio (SMS/WhatsApp - Roadmap), In-App (Polling 60s).

---

## 3. Estructura de Carpetas Principal
```
app/
├── (auth)/             # Login y Registro (multietapa)
├── admin/              # Panel de control administrativo
├── (client)/customer/  # Portal del cliente
├── (technician)/       # Portal del técnico
├── api/                # Capa de backend (Servicios, Órdenes, Auth)
lib/
├── database/           # Cliente Prisma y migraciones
├── services/           # Lógica de negocio (Notificaciones, Auth)
├── validations.ts      # Esquemas Zod centralizados
prisma/
└── schema.prisma       # Definición de modelos (Orders, Customers, Technicians, etc.)
```

---

## 4. Rutas de Acceso Clave

### 📍 Públicas
- `/` : Landing Page Premium
- `/login` : Login Unificado (Detección automática de rol)
- `/register/customer` : Registro multietapa de clientes
- `/register/technician` : Solicitud de técnicos (Requiere aprobación)

### 🔐 Privadas
- `/admin/dashboard` : Métricas y gestión global
- `/admin/applications` : Aprobación de técnicos pendientes
- `/customer/dashboard` : Mis servicios y solicitudes
- `/technician/dashboard` : Mis asignaciones de campo

---

## 5. Diseño y Estética
- **Paleta:** Rojo corporativo (#A50034), Gris Oscuro (#2C3E50), Fondo Gradiente Soft.
- **UX:** Animaciones con Framer Motion, Feedbacks visuales con Toasts, Diseño Mobile-First.
- **AIChat:** Chatbot inteligente integrado para pre-diagnóstico y auto-llenado de solicitudes.

---
_Documentación consolidada a partir de `SYSTEM_CONSOLIDATED.md` y `ARQUITECTURA_SOFTWARE.md`._
