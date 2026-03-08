# Functional UI Audit — SomosTecnicos
Fecha: 2026-03-08  
Tipo: Functional Testing / Smoke Testing (UI)  
Entorno: local (`http://localhost:3000`)  
Modo auth: bypass de testing (`AUTH_BYPASS_FOR_TESTS=true`, `AUTH_BYPASS_MODE=header`)

## Resumen Ejecutivo

Resultado de smoke funcional por portales:

- Admin: ✅ PASS
- Cliente: ✅ PASS
- Técnico: ✅ PASS

Estado global del smoke: **✅ todo funcionando correctamente** en el alcance evaluado.

## Alcance Validado

### Portal Admin

Rutas verificadas:

- `/admin/dashboard`
- `/admin/orders`
- `/admin/orders/create`
- `/admin/technicians`
- `/admin/customers`
- `/admin/messages`
- `/admin/applications`
- `/admin/assignments`
- `/admin/reports`
- `/admin/settings`
- `/admin/profile`
- Dinámicas (si existen IDs): `/admin/orders/[id]`, `/admin/orders/[id]/edit`, `/admin/orders/[id]/assign`, `/admin/technicians/[id]`, `/admin/technicians/[id]/edit`

### Portal Cliente

Rutas verificadas:

- `/customer/dashboard`
- `/customer/request`
- `/customer/history`
- `/customer/messages`
- `/customer/notifications`
- `/customer/profile`
- `/customer/services`
- `/customer/warranty`
- `/customer/settings`

### Portal Técnico

Rutas verificadas:

- `/technician/dashboard`
- `/technician/assignments`
- `/technician/history`
- `/technician/messages`
- `/technician/notifications`
- `/technician/schedule`
- `/technician/settings`

## Criterios de aceptación del smoke

Para cada ruta evaluada:

- Respuesta HTTP `< 400`
- Render de `body` visible
- Sin página 404 visible (`This page could not be found`, `404`, `No encontrado`)

## Correcciones aplicadas durante la auditoría

- Se creó página faltante para eliminar 404 en navegación:
  - `app/(admin)/admin/orders/create/page.tsx`
- Se creó endpoint faltante para reportes visuales:
  - `app/api/reports/dashboard/route.ts`

## Evidencia de ejecución

Comando:

```bash
AUTH_BYPASS_FOR_TESTS=true AUTH_BYPASS_MODE=header pnpm exec playwright test tests/functional_smoke_portals.spec.ts --project=chromium
```

Resultado:

- `3 passed`

Archivo de test:

- `tests/functional_smoke_portals.spec.ts`

## Riesgos residuales (no bloqueantes para smoke)

- Warnings de imágenes Next/Image por `quality` fuera de `images.qualities`.
- Warning de deprecación de `middleware` (migración futura a `proxy` recomendada por Next).

## Recomendación operativa

- Mantener este smoke en CI para validar rutas críticas de los tres portales en cada release.
