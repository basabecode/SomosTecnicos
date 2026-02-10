---
description: Flujo completo del servicio técnico: Creación, Asignación, Cotización, Aprobación y Cierre.
---

# 🛠️ Workflow: Ciclo de Vida del Servicio Técnico

Este documento describe el flujo operativo implementado para gestionar servicios técnicos de principio a fin.

## 🔄 1. Fases del Servicio

### A. Creación y Asignación
1.  **Creación**: El cliente solicita servicio o el admin lo crea manualmente.
    *   Generación automática de `ORDER-YYYY-NNNN`.
    *   Estado inicial: `pendiente`.
2.  **Asignación**: El admin asigna un técnico.
    *   Estado: `asignado` -> `en_camino` -> `revisado`.
    *   Se notifica al técnico.

### B. Diagnóstico y Cotización (Nueva Funcionalidad)
1.  **Diagnóstico**: El técnico revisa el equipo.
2.  **Cotización**: El técnico ingresa el diagnóstico y costo estimado en la App.
    *   Ruta: `/technician/assignments/[id]/quote`
    *   Estado orden: `cotizado`.
3.  **Regla de Negocio**:
    *   **Visita Técnica**: Costo base obligatorio ($50.000 COP) si no se aprueba reparación.

### C. Aprobación del Cliente
1.  **Revisión**: El cliente recibe la cotización (Email/Notificación).
2.  **Decisión**:
    *   **Aprobar**: El técnico procede. Estado: `en_proceso`.
    *   **Rechazar**: Se cancela el servicio. Se cobra solo la visita. Estado: `cancelado`.
    *   API: `PATCH /api/orders/[id]/approve`

### D. Ejecución y Cierre
1.  **Reparación**: El técnico realiza el trabajo (`en_proceso`).
2.  **Cierre Técnico**: El técnico finaliza la orden en la App.
    *   Ruta: `/technician/assignments/[id]/close`
    *   **Opciones**:
        *   ✅ **Reparado**: Éxito. Cobro total (Mano de obra + Repuestos + Visita).
        *   ❌ **No Reparable**: Falla. Cobro solo visita ($50.000).
        *   🔄 **Seguimiento**: Requiere nueva visita.

## 🧪 Pruebas y Validación

Se ha implementado un script automatizado para validar este flujo en la base de datos sin necesidad de interfaz gráfica constante.

Ejecutar:
```bash
npx tsx scripts/test-lifecycle-flow.ts
```

Consulte `docs/manual-pruebas-ciclo-vida.md` para guías detalladas de prueba manual.
