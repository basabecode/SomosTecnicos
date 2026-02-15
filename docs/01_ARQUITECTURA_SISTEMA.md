# 🏗️ 01. SISTEMA Y ARQUITECTURA - Única Fuente de Verdad (SSOT)

**Proyecto:** SomosTécnicos - Sistema de Gestión de Servicios Técnicos (Field Service Management - FSM)
**Última Versión Consolidada:** 15 de Febrero 2026 (Fase 2 Completada)
**Estado General:** 95% Completado ✅ (Escalabilidad implementada)

---

## 1. Resumen Ejecutivo
**SomosTécnicos** es una plataforma integral diseñada para centralizar la recepción de solicitudes de servicio técnico y permitir que un administrador coordine al equipo técnico de manera eficiente.

### Objetivos Clave:
- **Asignación Manual Directa:** Control total del administrador sobre las asignaciones.
- **Interfaz Móvil Prioritaria:** Optimizado para técnicos en campo y clientes finales.
- **Transparencia:** Seguimiento del estado de la orden en tiempo real.
- **Comunicación:** Notificaciones in-app y externas (Email/SMS/WhatsApp).
- **Alta Concurrencia:** Soporte para 500+ usuarios simultáneos (Implementado en Fase 2).

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

### 🛠️ Stack Tecnológico Actualizado
- **Frontend:** Next.js 15.2.4 (App Router), React 19, Tailwind CSS, shadcn/ui.
- **Backend:** Next.js API Routes, TypeScript, Server Actions.
- **Base de Datos:** PostgreSQL (Neon Tech) con Connection Pooling optimizado.
- **Caché:** Redis (Resultados de dashboard y listas frecuentes).
- **Colas (Queues):** Sistema asíncrono para emails, notificaciones y auditoría.
- **Seguridad:** JWT, Rate Limiting Middleware (Global), Protección de rutas.
- **Validación:** Zod (Esquemas globales).

### 🚀 Mejoras Fase 2 (Escalabilidad)
- **Rate Limiting:** Protección contra DDOS y abuso de API.
- **Transacciones Atómicas:** Asignaciones libres de race conditions.
- **ISR:** Dashboard administrativo con regeneración estática incremental.
- **Health Checks:** Monitoreo continuo de salud del sistema.

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
├── cache.ts            # 🆕 Sistema de caché
├── queue.ts            # 🆕 Sistema de colas
├── prisma.ts           # Cliente DB con pooling
├── validations.ts      # Esquemas Zod
prisma/
└── schema.prisma       # Definición de modelos
```

---

## 4. Rutas de Acceso Clave

### 📍 Públicas
- `/` : Landing Page Premium
- `/login` : Login Unificado
- `/register/customer` : Registro multietapa
- `/register/technician` : Solicitud de técnicos

### 🔐 Privadas
- `/admin/dashboard` : Panel de control (Optimizado con ISR)
- `/admin/applications` : Aprobación de técnicos
- `/customer/dashboard` : Mis servicios
- `/technician/dashboard` : Mis asignaciones

---

## 5. Diseño y Estética
- **Paleta:** Rojo corporativo (#A50034), Gris Oscuro (#2C3E50), Fondo Gradiente Soft.
- **UX:** Animaciones con Framer Motion, Feedbacks visuales, Diseño Mobile-First.
- **AIChat:** Chatbot inteligente integrado.

---
_Documentación actualizada tras la implementación de la Fase 2 de Escalabilidad._
