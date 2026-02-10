# Manual de Pruebas: Ciclo de Vida del Servicio (Técnico y Cliente)

Este documento detalla las nuevas funcionalidades implementadas para gestionar el ciclo de vida completo de un servicio técnico, desde la cotización hasta el cierre.

## Flujo Implementado

1.  **Cotización (Técnico)**: El técnico inspecciona y envía una cotización.
2.  **Aprobación (Cliente)**: El cliente recibe la cotización y aprueba o rechaza via portal.
3.  **Cierre (Técnico)**: El técnico repara y cierra, o cancela si no es reparable.

## Rutas Clave

| Acción | Ruta / URL | Rol | Descripción |
| :--- | :--- | :--- | :--- |
| **Cotizar** | `/technician/assignments/[id]/quote` | Técnico | Formulario para ingresar diagnóstico y costo. |
| **Cerrar** | `/technician/assignments/[id]/close` | Técnico | Formulario final para reportar reparación o falla. |
| **Servicios** | `/customer/services` | Cliente | Lista de servicios donde puede ver cotizaciones. |

## Cómo Probar (Paso a Paso)

### 1. Prerrequisitos
Asegúrate de tener una orden creada y asignada a un técnico (puedes usar el script de prueba para generar datos si lo deseas).

### 2. Prueba de Cotización (Técnico)
1.  Inicia sesión como **Técnico**.
2.  Navega a la orden asignada.
3.  Si la orden está en estado `revisado` (o asignado/en camino), ingresa manualmente a la URL: `/technician/assignments/[ID_DE_ORDEN]/quote`.
    *   *Nota: Se habilitarán botones directos en la próxima actualización de la lista de tareas.*
4.  Llena el formulario con **Diagnóstico** y **Costo Estimado**.
5.  Envía la cotización.
6.  **Resultado esperado**: La orden pasa a estado `cotizado`.

### 3. Prueba de Aprobación (Cliente)
1.  El cliente puede aprobar via API o Portal.
2.  **Via Portal**: Ir a `/customer/services`.
    *   *Nota: El componente de aprobación ya está creado (`ServiceApprovalCard`) y se integrará visualmente en el dashboard.*
3.  **Via API (Postman/Curl)**:
    *   `PATCH /api/orders/[ID_DE_ORDEN]/approve`
    *   Body: `{ "action": "approve" }` (para aprobar) o `{ "action": "reject" }` (para rechazar).
4.  **Resultado esperado**:
    *   **Aprobar**: Estado pasa a `en_proceso`.
    *   **Rechazar**: Estado pasa a `cancelado`, Costo Final = Costo Visita ($50.000).

### 4. Prueba de Cierre (Técnico)
1.  Si la orden fue aprobada (`en_proceso`), el técnico procede a reparar.
2.  Ingresa a la URL: `/technician/assignments/[ID_DE_ORDEN]/close`.
3.  Selecciona el resultado:
    *   **Reparado**: Ingresa el costo total final y descripción.
    *   **No Reparable**: El sistema ajusta el costo automáticamente al valor de la visita ($50.000).
    *   **Seguimiento**: Para reagendar.
4.  **Resultado esperado**: La orden se marca como completada/reparada y se guarda el historial.

## Validación Automática
Se ha creado un script que simula todo este ciclo de vida en la base de datos para asegurar que la lógica de negocio es correcta.

Ejecutar en terminal:
```bash
npx tsx scripts/test-lifecycle-flow.ts
```

Si el script finaliza con `Exit code: 0`, todo el sistema backend funciona correctamente.
