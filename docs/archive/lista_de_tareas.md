# Lista de Tareas Consolidadas

Este archivo agrupa las tareas pendientes y planes de acción detallados para el proyecto.

---

## Tarea 1: Sistema de Facturación Electrónica

**Fecha de Creación:** 03 de Enero de 2026
**Estado:** En Progreso (Fase 1 y 2 Completadas)

### 🟢 Lo que ya está hecho
1.  **Modelo de Datos `Invoice`** en Prisma.
2.  **Librería de Generación de PDF** configurada (`generator.ts`, `templates`).

### 🟡 Tareas Pendientes
- [ ] **Implementar API de Backend:** Endpoints en `/api/invoices` para generar y listar facturas.
- [ ] **Implementar Sistema de Envío:** Integración con Resend (Email) y WhatsApp.
- [ ] **Interfaz de Usuario:** Botones de generación en admin y descarga en portal cliente.
- [ ] **Pruebas:** Validar cálculos y consecutivos.

---

## Tarea 2: TAREAS PENDIENTES - CONTINUACIÓN MAÑANA

**Fecha:** 11 de octubre de 2025
**Estado:** Sistema funcional y estable

### 🔄 LO QUE FALTA POR HACER
1. **AL-003:** Validaciones Zod (PRIORIDAD #1)
2. **CR-001:** Migraciones Prisma
3. **ME-001:** Actualizar dependencias

### 🚀 PLAN DETALLADO
#### ⭐ Tarea #1: Validaciones Zod (2-3 horas)
- [ ] Crear schemas en `lib/validations.ts` (Login, Órdenes, Clientes, Técnicos).
- [ ] Implementar middleware de validación automático.
- [ ] Integrar en rutas API y mejorar mensajes de error en frontend.

#### 🔄 Tarea #2: Migraciones Prisma
- [ ] Sincronizar schema.prisma vs base de datos actual.
- [ ] Ejecutar `prisma migrate dev`.

#### 🔧 Tarea #3: Actualizar Dependencias
- [ ] `npm audit fix` y `pnpm update`.

---
