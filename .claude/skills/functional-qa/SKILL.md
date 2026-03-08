---
name: functional-qa
description: Functional UI Audit for SomosTecnicos portals. Use when validating that every button, link, form and action in the admin, customer or technician portal has a real implementation and produces an observable result. Invoke for QA reviews, dead UI detection, stub hunting, or before any release. Covers all 3 portals plus shared components.
model: claude-sonnet-4-5
metadata:
  version: 1.0.0
  author: basabecode
  domain: qa-testing
  triggers: QA, audit funcional, smoke test, dead UI, botones sin función, stubs, validar funcionalidad, functional testing, revisión de portales
  related-skills: eda-architect, realtime-gateway, admin-dashboard, production-ready
---

# Functional QA — SomosTecnicos

Auditoría funcional exhaustiva de los 3 portales. Valida que cada elemento
interactivo tenga un handler real, llame a una API existente y produzca un
resultado observable para el usuario.

## Uso

```
/functional-qa --portal <portal> [--scope <scope>] [--output <path>]
/functional-qa -p <portal> [-s <scope>] [-o <path>]
```

## Parámetros

| Parámetro   | Corto | Descripción                                              | Requerido | Default |
|-------------|-------|----------------------------------------------------------|-----------|---------|
| `--portal`  | `-p`  | Portal a auditar: `admin`, `customer`, `technician`, `all` | **Sí**  | -       |
| `--scope`   | `-s`  | Alcance: `full`, `buttons`, `forms`, `navigation`, `empty-states` | No | `full` |
| `--output`  | `-o`  | Ruta del reporte de salida                               | No        | `docs/reportes/FUNCTIONAL_AUDIT.md` |

## Ejemplos

```sh
# Auditar todos los portales completo
/functional-qa --portal all

# Solo botones del portal admin
/functional-qa -p admin -s buttons

# Portal técnico con reporte personalizado
/functional-qa -p technician -o docs/reportes/qa-tecnico-$(date +%Y%m%d).md
```

## Step 0: Validación de Parámetros

**CRÍTICO**: Antes de ejecutar, validar:

1. `--portal` es requerido — fallar si no se provee
2. `portal` debe ser: `admin`, `customer`, `technician` o `all`
3. `scope` debe ser: `full`, `buttons`, `forms`, `navigation`, `empty-states`
4. Si se pasa `-h` o `--help`, mostrar esta ayuda y detener

## Step 1: Lectura de Contexto

Antes de auditar, leer estos archivos para entender el sistema:

```
lib/state-machine.ts          — estados válidos de órdenes
lib/services/notification.service.ts — eventos del sistema
app/api/                      — endpoints disponibles
components/domain/empty-state.tsx    — componente de empty states
.claude/skills/eda-architect/SKILL.md — flujo EDA del sistema
```

## Step 2: Mapeo de Rutas por Portal

### Portal Admin — `app/(admin)/admin/`

| Página | Ruta |
|--------|------|
| Dashboard | `/admin/dashboard` |
| Órdenes | `/admin/orders` |
| Detalle orden | `/admin/orders/[id]` |
| Asignar técnico | `/admin/orders/[id]/assign` |
| Editar orden | `/admin/orders/[id]/edit` |
| Técnicos | `/admin/technicians` |
| Crear técnico | `/admin/technicians/create` |
| Editar técnico | `/admin/technicians/[id]/edit` |
| Clientes | `/admin/customers` |
| Mensajes | `/admin/messages` |
| Aplicaciones | `/admin/applications` |
| Asignaciones | `/admin/assignments` |
| Reportes | `/admin/reports` |
| Configuración | `/admin/settings` |

### Portal Cliente — `app/(client)/customer/`

| Página | Ruta |
|--------|------|
| Dashboard | `/customer/dashboard` |
| Solicitar servicio | `/customer/request` |
| Historial | `/customer/history` |
| Mensajes | `/customer/messages` |
| Notificaciones | `/customer/notifications` |
| Perfil | `/customer/profile` |
| Servicios | `/customer/services` |
| Garantía | `/customer/warranty` |
| Configuración | `/customer/settings` |

### Portal Técnico — `app/(technician)/technician/`

| Página | Ruta |
|--------|------|
| Dashboard | `/technician/dashboard` |
| Asignaciones | `/technician/assignments` |
| Ejecutar asignación | `/technician/assignments/[id]/execute` |
| Cotizar | `/technician/assignments/[id]/quote` |
| Cerrar servicio | `/technician/assignments/[id]/close` |
| Historial | `/technician/history` |
| Mensajes | `/technician/messages` |
| Notificaciones | `/technician/notifications` |
| Agenda | `/technician/schedule` |
| Configuración | `/technician/settings` |

## Step 3: Checklist de Auditoría por Elemento

Para cada página del portal seleccionado, verificar:

### Botones y Acciones

```
[ ] onClick está definido (no undefined, no vacío)
[ ] Handler llama a una función real (no solo console.log o TODO)
[ ] Función llama a un endpoint API existente en app/api/
[ ] Estado de loading durante la operación (disabled, spinner)
[ ] Resultado exitoso es visible (toast, redirect, actualización de UI)
[ ] Error es manejado y mostrado al usuario (no solo console.error)
[ ] Botones destructivos tienen confirmación (dialog/alert)
```

### Formularios

```
[ ] onSubmit está implementado
[ ] Validación de campos antes de enviar
[ ] Estado de loading en el botón de submit
[ ] Errores de validación se muestran inline
[ ] Respuesta exitosa redirige o actualiza UI
[ ] Respuesta de error muestra mensaje descriptivo
[ ] Campos se limpian o resetean apropiadamente post-submit
```

### Navegación y Links

```
[ ] href apunta a una ruta existente en el proyecto
[ ] No hay links a rutas 404
[ ] Breadcrumbs reflejan la ubicación real
[ ] Back buttons llevan a la página correcta
[ ] Links externos abren en nueva pestaña (_blank + noopener)
```

### Empty States

```
[ ] Componente EmptyState de components/domain/empty-state.tsx
[ ] No hay divs vacíos o texto inline sin componente
[ ] Empty state tiene acción sugerida (botón o link)
[ ] Mensaje es contextual (no genérico "No hay datos")
```

### Notificaciones y Feedback

```
[ ] Operaciones exitosas muestran toast de confirmación
[ ] Errores de API muestran mensaje legible (no "Error 500")
[ ] Operaciones largas tienen indicador de progreso
[ ] Acciones irreversibles tienen advertencia previa
```

## Step 4: Patrones de Dead UI a Detectar

### Botones sin handler

```tsx
// ❌ Dead UI — sin onClick
<Button>Aprobar orden</Button>

// ❌ Dead UI — handler vacío
<Button onClick={() => {}}>Aprobar orden</Button>

// ❌ Stub — solo log
<Button onClick={() => console.log('clicked')}>Aprobar orden</Button>

// ✅ Implementado
<Button onClick={handleApproveOrder} disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Aprobar orden'}
</Button>
```

### TODOs en handlers

```tsx
// ❌ Detectar estos patrones:
const handleSubmit = async () => {
  // TODO: implementar
}

const handleDelete = () => {
  // Por implementar
}
```

### APIs inexistentes

```tsx
// ❌ Verificar que el endpoint existe en app/api/
await fetch('/api/orders/bulk-delete')   // ¿existe app/api/orders/bulk-delete/route.ts?
await fetch('/api/reports/generate')     // ¿existe app/api/reports/generate/route.ts?
```

### Estados de orden fuera de FSM

```tsx
// ❌ Transición no válida según lib/state-machine.ts
await fetch(`/api/orders/${id}/status`, {
  body: JSON.stringify({ status: 'completed' })  // ¿es una transición válida?
})
```

## Step 5: Comandos de Búsqueda Automática

Ejecutar estos greps para encontrar Dead UI rápidamente:

```bash
# Botones sin onClick
grep -rn "<Button[^>]*>" app/(admin) app/(client) app/(technician) \
  | grep -v "onClick" | grep -v "type=\"submit\""

# TODOs en handlers
grep -rn "TODO\|por implementar\|// TODO\|console.log" \
  --include="*.tsx" --include="*.ts" \
  app/(admin) app/(client) app/(technician)

# onClick vacíos
grep -rn "onClick={() => {}}\|onClick={() => null}" \
  --include="*.tsx" \
  app/(admin) app/(client) app/(technician)

# Fetch a APIs que podrían no existir
grep -rn "fetch('/api/" --include="*.tsx" --include="*.ts" \
  app/(admin) app/(client) app/(technician) \
  | awk -F"'" '{print $2}' | sort -u

# Empty states inline (sin componente EmptyState)
grep -rn "No hay\|Sin \|No tienes\|No existen\|length === 0" \
  --include="*.tsx" \
  app/(admin) app/(client) app/(technician)
```

## Step 6: Generación del Reporte

Generar `docs/reportes/FUNCTIONAL_AUDIT.md` con esta estructura:

```markdown
# Functional UI Audit — SomosTecnicos
Fecha: [fecha]
Portal(es): [portales auditados]
Scope: [alcance]

## Resumen Ejecutivo
- Total elementos auditados: X
- ✅ Implementados correctamente: X
- ⚠️ Parcialmente implementados (stubs): X
- ❌ Dead UI (sin función real): X
- 🔴 Críticos: X

## Dead UI Detectado

| # | Portal | Página | Elemento | Problema | Prioridad |
|---|--------|--------|----------|----------|-----------|
| 1 | Admin  | /orders | Botón "Exportar" | onClick vacío | CRÍTICO |

## Stubs Detectados

| # | Portal | Archivo | Línea | Descripción |
|---|--------|---------|-------|-------------|

## Transiciones de Estado Inválidas

| # | Endpoint | Transición intentada | Estado actual válido |
|---|----------|---------------------|---------------------|

## Empty States sin Componente

| # | Portal | Página | Descripción actual | Corrección |
|---|--------|--------|--------------------|------------|

## Items OK

| Portal | Página | Elementos validados |
|--------|--------|---------------------|

## Plan de Corrección Recomendado

Ordenado por prioridad:
1. [CRÍTICO] ...
2. [ALTO] ...
3. [MEDIO] ...
```

## Quick Reference

| Paso | Acción |
|------|--------|
| Contexto | Leer state-machine.ts + skill eda-architect |
| Mapeo | Identificar todas las páginas del portal |
| Búsqueda | Ejecutar greps de dead UI |
| Revisión | Verificar cada elemento interactivo |
| Reporte | Generar FUNCTIONAL_AUDIT.md |

## Troubleshooting

**Handler existe pero no hace nada visible**
- Verificar que el endpoint API responde correctamente
- Verificar que el toast/feedback está conectado al resultado
- Revisar si hay un `catch` que silencia el error

**Endpoint existe pero retorna error**
- Verificar autenticación — el usuario del portal tiene permiso
- Revisar middleware.ts — la ruta está protegida correctamente
- Consultar skill `eda-architect` para validar la transición de estado

**Empty state no usa el componente**
- Ver `components/domain/empty-state.tsx` para la API correcta
- Reemplazar JSX inline con `<EmptyState title="..." description="..." />`

## Anti-Patrones Comunes en SomosTecnicos

| Anti-Patrón | Síntoma | Corrección |
|-------------|---------|------------|
| Botón de exportar sin función | `onClick={() => {}}` | Implementar `/api/dashboard/export` |
| Cambio de estado sin FSM | `status: 'completed'` directo | Usar transición válida de state-machine |
| Toast solo en éxito | Sin `catch` con toast de error | Agregar `toast.error()` en catch |
| Formulario sin loading | Submit doble posible | `disabled={isSubmitting}` |
| Link a ruta futura | href a página no creada | Redirigir a página existente o deshabilitar |
