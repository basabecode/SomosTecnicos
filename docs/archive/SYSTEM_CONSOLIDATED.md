# 🎯 SYSTEM CONSOLIDATED - Single Source of Truth (SSOT)

**Proyecto:** SomosTécnicos - Sistema de Gestión de Servicios Técnicos
**Última Versión Consolidada:** Enero 2026 (Reflejando estado de Octubre 2025)
**Estado General:** 90% Completado ✅

---

## 1. Resumen Ejecutivo (Sistema FSM)

**SomosTécnicos** es una plataforma integral de **Field Service Management (FSM)** diseñada para un entorno de servicio técnico gestionado. Su objetivo es centralizar la recepción de solicitudes y permitir que un administrador coordine al equipo técnico de manera manual y eficiente.

El sistema optimiza la logística mediante:
- **Asignación Manual Directa:** El administrador tiene el control total sobre a quién asigna cada servicio según disponibilidad.
- **Interfaz Móvil Prioritaria:** Diseño optimizado para que técnicos y clientes operen desde sus dispositivos móviles con facilidad.
- **Transparencia:** Seguimiento del estado de la orden por etapas claras (Pendiente, Asignado, En Proceso, Completado).
- **Notificaciones:** Alertas inmediatas para el técnico cuando el administrador le asigna un nuevo servicio.

---

## 2. Arquitectura Confirmada

### 👥 Roles y Permisos
- **Super Administrador:** Acceso total a configuraciones, finanzas y gestión de usuarios.
- **Administrador / Manager:** Gestión operativa de órdenes, técnicos y asignaciones.
- **Técnico:** Vista móvil para gestionar tareas asignadas, cambiar estados y reportar terminación.
- **Cliente:** Portal para solicitar servicios, rastrear órdenes y gestionar su perfil.

### 🔄 Flujo de Estados (FSM)
1. **PENDIENTE:** El cliente envía una solicitud desde el landing o portal.
2. **ASIGNADO:** El administrador vincula a un técnico con la orden.
3. **EN_PROCESO:** El técnico ha iniciado la labor (o está "En camino").
4. **COMPLETADO:** Servicio finalizado con éxito.
5. **CANCELADO:** Orden anulada por el cliente o administrador.

### 📧 Sistema de Notificaciones
- **Email:** Integración con Resend para confirmaciones y alertas.
- **SMS/WhatsApp:** Canales prioritarios para comunicación directa con el cliente (Twilio/Meta API).
- **In-App:** Centro de mensajes y notificaciones en tiempo real para el portal cliente.

### 🛠️ Stack Tecnológico
- **Frontend:** Next.js 15.2.4 (App Router), React 19, Tailwind CSS.
- **Backend:** API Routes (Next.js), Prisma ORM.
- **Base de Datos:** PostgreSQL (Dockerizado para desarrollo).
- **Seguridad:** JWT (JSON Web Tokens), Middleware de protección de rutas.
- **Validación:** Zod (Esquemas de validación de entradas).

---

## 3. Inventario de Funcionalidades Implementadas

### ✅ Frontend (Público y Cliente)
- **Landing Page Premium:** Hero optimizado, slider de marcas, grid de electrodomésticos y FAQ.
- **Login Unificado:** Único punto de entrada (`/login`) con redirección inteligente por rol.
- **Wizard de Solicitud:** Formulario de 3 pasos (Aparato -> Problema -> Contacto).
- **AIChat:** Chatbot flotante para pre-diagnóstico y auto-llenado de solicitudes.
- **Portal del Cliente:** Historial de órdenes, seguimiento de estado y gestión de perfil.

### ✅ Panel Administrativo (Backend)
- **Dashboard de Estadísticas:** Visualización de métricas clave (Órdenes activas, técnicos disponibles).
- **Gestión de Órdenes:** Listado CRUD, asignación manual de técnicos y cambio de estados.
- **Gestión de Técnicos:** Registro de personal, especialidades y disponibilidad.
- **Reportes Visuales:** Gráficos de rendimiento y volumen de servicios.

### ✅ Backend y Seguridad
- **APIs Optimizadas:** Endpoints `/optimized` que eliminan problemas N+1 (70-90% más rápidos).
- **Logger Centralizado:** Sistema de logs estructurados en `lib/logger.ts`.
- **Middleware de Seguridad:** Protección de rutas `/admin/*`, `/customer/*`, etc.
- **Seed de Datos:** Sistema de inicialización con cuentas de prueba completas.

---

## 4. Roadmap de Pendientes (Crítico)

| ID | Tarea | Prioridad | Estado |
|----|-------|-----------|--------|
| **UI-001** | **Navegación Móvil (BottomNav):** Implementar barra inferior en portales de técnico y cliente. | 🔴 ALTA | Pendiente |
| **UI-002** | **Cards de Órdenes:** Sustituir tablas por tarjetas interactivas en vistas móviles. | 🔴 ALTA | Pendiente |
| **AL-003** | **Validaciones Zod Globales:** Asegurar integridad de datos en todas las APIs. | 🟡 MEDIA | En Progreso |
| **CR-001** | **Migración Prisma (Customers):** Sync final de la base de datos. | 🟡 MEDIA | Pendiente |
| **NOT-001** | **Sistema de Alertas In-App:** Visualizar notificaciones de nuevas asignaciones al técnico. | 🔵 BAJA | Roadmap |

---

## 5. Glosario de Archivos de Referencia
- **Testing:** `docs/CUENTAS_PRUEBA.md`
- **Arquitectura:** `docs/ARQUITECTURA_SOFTWARE.md`
- **Roadmap Extendido:** `docs/ROADMAP_MEJORAS_2025.md`
