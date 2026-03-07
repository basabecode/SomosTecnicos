# Auditoría de Diseño y UX — SomosTecnicos FSM

**Proyecto:** somostecnicos_FSM
**Fecha auditoría:** 2026-03-06
**Alcance:** Frontend completo — portales Admin, Cliente, Técnico + componentes compartidos
**Auditor:** Claude Code

---

## Post-Auditoría: Bug de tokens CSS descubierto (2026-03-07)

### DIS-CSS01 — Conflicto `.text-primary` Workshop vs Tailwind v4

**Archivos:** `styles/tokens.css` línea 298 (eliminada), `app/(public)/trabaja-con-nosotros/page.tsx`

**Causa raíz:** Durante la refactorización DIS-01, `tokens.css` tenía:
```css
/* Fuera de @layer — alta especificidad */
.text-primary { color: hsl(var(--text-primary)); }  /* navy oscuro Workshop */
```
Al estar fuera de `@layer`, esta clase sobrescribía la utilidad generada por Tailwind v4 (`text-primary` → `var(--color-primary)` → rojo corporativo). Resultado: cualquier `className="text-primary"` renderizaba como navy oscuro, no como `#a50034`.

**Fix aplicado:**
1. Eliminadas las líneas conflictivas de `tokens.css` (`.text-primary`, `.text-secondary`, `.text-tertiary`)
2. `text-primary` ahora resuelve correctamente a `var(--color-primary)` = rojo corporativo

**Patrón para fondos oscuros (`bg-[#1a0a0f]`):**

| Clase | Valor | Cuándo usar |
|-------|-------|-------------|
| `text-primary` | `var(--color-primary)` → oklch | Fondos claros o contextos normales |
| `text-st-primary` | `var(--st-primary)` = `#a50034` hex fijo | **Fondos oscuros** — nunca se sobreescribe con dark mode |

En secciones con fondo oscuro como `bg-[#1a0a0f]`, usar `text-st-primary` garantiza que el rojo corporativo siempre se muestre correctamente independientemente del contexto CSS o resolución oklch.

**Archivos corregidos:**
- `styles/tokens.css`: eliminadas clases Workshop conflictivas
- `app/(public)/trabaja-con-nosotros/page.tsx` líneas 456 y 495: `text-primary` → `text-st-primary` (dentro de `bg-[#1a0a0f]`)

---

## Resumen Ejecutivo

| Categoría  | Total | Descripción |
|------------|-------|-------------|
| CRÍTICO    | 4     | Rompen la experiencia o generan datos incorrectos |
| ALTO       | 10    | Inconsistencias visuales evidentes o UX deficiente |
| MEDIO      | 9     | Mejoras de coherencia y pulido |
| BAJO       | 5     | Detalles finos de accesibilidad y código |
| **TOTAL**  | **28**| |

---

## 1. Sistema de Diseño (Tokens y Colores)

### DIS-01 — CRÍTICO: Triple sistema de colores en conflicto

**Archivo(s):** `styles/tokens.css`, `app/globals.css`, múltiples componentes

El proyecto tiene **tres sistemas de color simultáneos e incompatibles**:

1. **Workshop tokens** (`tokens.css`): `--tool-orange` (naranja) como color primario de acción (`workshop-button-primary`)
2. **Brand tokens** (`globals.css` línea 9): `--primary: #a50034` (rojo corporativo)
3. **shadcn/ui tokens** (`globals.css` línea 26): `--primary: oklch(0.205 0 0)` (casi negro)

Ninguno de estos tres "primarios" coincide entre sí. El resultado es que el color de botones varía según qué componente se usa:
- `<Button>` de shadcn → negro/gris oscuro
- `workshop-button-primary` → naranja
- Hardcoded `bg-[#991B1B]` en header avatar, sidebar avatar → rojo oscuro
- Hardcoded `bg-[#A50034]` en gradientes del dashboard → rojo diferente

**Impacto:** Ningún técnico de diseño puede mantener consistencia de color. Refactoring muy costoso si se quiere cambiar el color de marca.

**Solución:** Unificar `--primary` de shadcn al rojo corporativo `#A50034` en `globals.css` y eliminar los hexadecimales hardcoded.

---

### DIS-02 — ALTO: Mezcla de vocabularios de clase en los mismos componentes

**Archivo(s):** `components/domain/next-job-card.tsx`, `components/domain/empty-state.tsx`, `app/(technician)/technician/dashboard/page.tsx`

Los componentes mezclan simultáneamente cuatro vocabularios:
- Tokens Workshop: `bg-tool-orange`, `text-label-ink`, `border-border-light`
- Tailwind hardcoded: `bg-gray-50`, `text-gray-700`, `border-gray-200`
- Colores hex: `bg-[#A50034]`, `text-[#991B1B]`
- Tokens shadcn: `bg-muted`, `text-muted-foreground`

`NextJobCard` usa correctamente `border-tool-orange/20`, `bg-gradient-to-br from-tool-orange/5`, pero el mismo `TechnicianDashboard` que lo renderiza usa `bg-blue-50/50` y `border-blue-100` directamente.

**Solución:** Elegir un vocabulario (recomendado: shadcn + los tokens de estado de `tokens.css`) y estandarizarlo en todos los componentes.

---

### DIS-03 — MEDIO: `tokens.css` define clases utilitarias que no se usan en Tailwind v4

**Archivo:** `styles/tokens.css` líneas 226–262

Tailwind v4 genera utilidades desde CSS custom properties automáticamente. Las clases manuales como `.bg-workshop-floor`, `.text-label-ink`, `.border-light` definidas en `tokens.css` compiten con la generación automática de Tailwind y pueden causar especificidad inesperada.

**Solución:** Revisar si Tailwind v4 ya genera estas utilidades desde las custom properties y eliminar las definiciones manuales duplicadas.

---

## 2. Portal Administrador

### DIS-04 — ALTO: `DashboardStats` no usa `MetricCard` existente

**Archivo:** `components/admin/dashboard-stats.tsx`

Existe `components/layout/metric-card.tsx` — un componente `MetricCard` unificado con soporte para iconColor, trend y hover interactions. Sin embargo, `DashboardStats` usa `<Card>` de shadcn directamente con markup inline repetido 8 veces. Las cards del admin no tienen colores de énfasis, efectos hover ni información de tendencia, mientras que `MetricCard` sí los implementa.

**Resultado visual:** Las 8 stats del admin son uniformemente grises y planas, sin jerarquía visual que señale las métricas críticas (pendientes, urgentes).

**Solución:** Reemplazar los `<Card>` manuales de `DashboardStats` por instancias de `<MetricCard>` con el `iconColor` apropiado.

---

### DIS-05 — ALTO: Icono incorrecto en card "En Proceso"

**Archivo:** `components/admin/dashboard-stats.tsx` línea 201

La card "En Proceso" usa `<AlertTriangle>` (ícono de advertencia/peligro) cuando el estado indica trabajo activo. Debería ser `<Wrench>` o `<Activity>`. El color también es `text-blue-500` pero el ícono de triángulo sugiere error, creando disonancia cognitiva.

---

### DIS-06 — ALTO: Portal Admin sin navegación móvil

**Archivo:** `app/(admin)/admin/layout-client.tsx`

Los portales Cliente y Técnico tienen `<BottomNav>` para mobile. El portal Admin solo tiene el hamburger en el header. Para un manager que usa tablet/móvil en campo, esto es una degradación significativa de ergonomía.

**Nota:** El admin tiene 8 items de nav, demasiados para un BottomNav completo. Solución posible: BottomNav con 4-5 items primarios (Dashboard, Órdenes, Técnicos, Mensajes, +Más).

---

### DIS-07 — ALTO: QuickActions sin jerarquía — 4 botones outline iguales

**Archivo:** `app/(admin)/admin/dashboard/page.tsx` líneas 84–119

El componente `QuickActions` tiene 4 botones todos con `variant="outline"` — igual visual weight. La acción primaria del admin es probablemente "Nueva Orden" o "Asignar Técnico". Al menos uno debería ser `variant="default"` o con el color de acento para señalar la acción recomendada.

---

### DIS-08 — MEDIO: Header title siempre estático

**Archivo(s):** `app/(admin)/admin/layout-client.tsx` línea 190, `app/(client)/customer/layout-client.tsx` línea 142, `app/(technician)/technician/layout-client.tsx` línea 126

Los tres portales muestran un título fijo ("Panel de Administración", "Portal Cliente", "Portal Técnico") sin importar la página activa. En páginas profundas como `/admin/orders/[id]` el header no refleja contexto de ubicación. El `subtitle` del admin dice "Sistema Operativo" — información de poco valor.

**Solución:** Derivar el título del header a partir del `pathname` activo usando el mismo array `sidebarItems`.

---

### DIS-09 — BAJO: Stat card de "Hoy" con descripción inconsistente

**Archivo:** `components/admin/dashboard-stats.tsx` línea 250

La card "Hoy" tiene título "Hoy", valor `completadasHoy` (completadas hoy) pero descripción "Nuevas hoy". El valor y la descripción contradicen la métrica real (completadas ≠ nuevas).

---

## 3. Portal Cliente

### DIS-10 — CRÍTICO: Card "Ofertas Especiales" siempre vacía (sin empty state)

**Archivo:** `app/(client)/customer/dashboard/page.tsx` líneas 78, 363–400

```typescript
const promotions: any[] = []  // Array siempre vacío
```

La card "Ofertas Especiales" se renderiza siempre con su header (`<CardTitle>`, `<CardHeader>`) pero con contenido vacío porque `promotions.map(...)` sobre array vacío produce nada. El usuario ve una card con título y un área blanca debajo — parece un error de carga.

**Solución:** Añadir condición `if (promotions.length === 0) return null` o mostrar un empty state explícito hasta que haya promociones reales.

---

### DIS-11 — ALTO: Grid de stats con solo 2 de 4 columnas ocupadas

**Archivo:** `app/(client)/customer/dashboard/page.tsx` líneas 198–224

```typescript
<div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
  <Card>Servicios Activos</Card>
  <Card>Historial Total</Card>
  {/* 2 columnas vacías en desktop */}
</div>
```

En desktop (lg), el grid de 4 columnas tiene 2 cards y 2 espacios vacíos. El espacio en blanco no es intencional — parece incompleto.

**Solución:** Cambiar el grid a `grid-cols-2` en todos los breakpoints, o agregar 2 stats adicionales relevantes (ej: "Próximo Servicio", "Satisfacción").

---

### DIS-12 — ALTO: Loading state full-page vs skeletons por sección

**Archivo:** `app/(client)/customer/dashboard/page.tsx` línea 171–177, vs `app/(admin)/admin/dashboard/page.tsx`

El dashboard cliente muestra un `<Loader2>` de pantalla completa mientras carga. El dashboard admin tiene skeletons por sección (`<Suspense fallback={<StatsLoading />}>`). El enfoque del cliente bloquea toda la página — el usuario no ve nada durante la carga.

**Solución:** Usar el mismo patrón de skeletons del admin: mostrar la estructura de página con placeholders mientras cargan los datos.

---

### DIS-13 — ALTO: `statusIcons` con iconos repetidos — sin diferenciación por estado

**Archivo:** `app/(client)/customer/dashboard/page.tsx` líneas 112–125

```typescript
const statusIcons: Record<ServiceStatus, StatusIconComponent> = {
  pendiente: Clock,
  en_camino: Clock,        // mismo que pendiente
  esperando_repuestos: Clock,  // mismo
  reagendado: Clock,       // mismo
  ...
}
```

4 de 12 estados usan el mismo ícono `Clock`. Los estados `en_camino`, `esperando_repuestos` y `reagendado` tienen connotaciones muy distintas pero son visualmente idénticos. Nota: este `statusIcons` no se usa en el JSX visible actualmente — es código muerto que podría activarse en el futuro con bugs visuales.

---

### DIS-14 — MEDIO: Historial reciente sin link a detalle de orden

**Archivo:** `app/(client)/customer/dashboard/page.tsx` líneas 341–354

Los items del historial reciente muestran tipo de servicio, fecha y badge de estado, pero no tienen ningún enlace para ver el detalle. El usuario no puede hacer click en una orden histórica desde el dashboard.

---

### DIS-15 — BAJO: Botón refresh sin `aria-label` explícito

**Archivo:** `app/(client)/customer/dashboard/page.tsx` línea 192

```tsx
<Button variant="outline" size="icon" onClick={fetchOrders} title="Recargar datos">
  <RefreshCw className="h-4 w-4" />
</Button>
```

Usa `title` (tooltip HTML) pero no `aria-label`. Para screen readers, `aria-label` es el atributo correcto. El `title` solo aparece en hover en desktop.

---

## 4. Portal Técnico

### DIS-16 — CRÍTICO: Badge "Disponible" decorativo desconectado del estado real

**Archivo:** `app/(technician)/technician/layout-client.tsx` líneas 137–143

```tsx
<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
  Disponible
</Badge>
```

Este badge en el header siempre muestra "Disponible" en verde independientemente del estado real del técnico. Un técnico "en_descanso" u "offline" sigue viendo "Disponible" en su header. Es información incorrecta prominente.

**Solución:** Conectar el badge al estado real del técnico via contexto/API, o eliminarlo del layout y dejarlo solo en el dashboard donde sí está correctamente conectado.

---

### DIS-17 — ALTO: `alert()` nativo para errores — UX de los años 90

**Archivo:** `app/(technician)/technician/dashboard/page.tsx` líneas 168, 203, 521

```typescript
alert('Error actualizando estado: ' + (data.error || 'Desconocido'))
alert('Error de conexión al actualizar estado')
alert("Reportar problema")  // placeholder
```

Tres usos de `window.alert()`. Bloquea la UI del navegador, no se puede estilizar, y rompe la experiencia en WebViews. El proyecto ya tiene `useToast` importado en la página de órdenes admin. El tercer `alert` también expone al usuario una feature sin implementar.

**Solución:** Reemplazar por `useToast` del sistema de shadcn/ui. El botón "Reportar Incidencia" debería ocultarse hasta tener implementación real, o llevar a un formulario.

---

### DIS-18 — ALTO: Stat cards con scroll horizontal sin indicador de desbordamiento

**Archivo:** `app/(technician)/technician/dashboard/page.tsx` líneas 290–342

```tsx
<div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 ...">
  <Card className="min-w-[160px] snap-start flex-shrink-0">...</Card>
```

En mobile, las 4 stat cards permiten scroll horizontal pero no hay indicador visual de que hay más cards (no hay peek de la siguiente card, no hay dots de paginación, el scrollbar está oculto). El usuario puede no descubrir la card de "Zona".

**Solución:** Mostrar un peek (~20px) de la siguiente card al lado derecho de la pantalla, o mostrar 2 cards en mobile con `grid-cols-2` sin scroll.

---

### DIS-19 — MEDIO: BottomNav con 5 items muy apretados

**Archivo:** `app/(technician)/technician/layout-client.tsx` líneas 61–67

El técnico tiene 5 items en mobile nav: Inicio, Mensajes, Asignaciones, Historial, Config. Con 5 items en una pantalla de 375px, cada item tiene ~75px de ancho — apretado. El label "Config" es abreviado y no descriptivo. El cliente solo tiene 4 items y se ve mejor.

**Solución:** Reducir a 4 items: Inicio, Asignaciones, Mensajes, Historial — y mover Configuración al menú del header avatar.

---

## 5. Componentes Compartidos

### DIS-20 — ALTO: Empty states inconsistentes entre portales

Se usan tres enfoques distintos para estados vacíos:

1. **`EmptyState` de `components/domain`** (técnico): Componente unificado con ilustración emoji, título y descripción. Correcto.
2. **Inline ad-hoc** (cliente en `activeServices.length === 0`): `<Clock className="w-12 h-12 ... opacity-20">` + texto + botón. Sin componente.
3. **Simple texto** (admin alertas): `<div className="text-center py-4 text-muted-foreground text-sm">No hay alertas...</div>`. Sin icono.

El sistema `EmptyState` existe pero solo se usa en el portal técnico. Los otros portales implementan sus propios empty states sin seguir el patrón.

---

### DIS-21 — ALTO: `NotificationBell` marca todo como leído al abrir el dropdown

**Archivo:** `components/navigation/notification-bell.tsx` líneas 37–43

```typescript
onOpenChange={(isOpen) => {
  setOpen(isOpen)
  if (isOpen && unreadCount > 0) {
    markAllAsRead()  // Se llama instantáneamente al abrir
  }
}}
```

El usuario abre el panel de notificaciones y antes de poder leer, todas se marcan como leídas. No puede distinguir las nuevas de las viejas en ese mismo momento. El punto rojo del badge (`h-2 w-2 bg-[#A50034]`) en cada notificación desaparece antes de que el usuario lo vea.

**Solución:** Marcar como leídas cuando el usuario cierra el dropdown (no al abrir), o cuando hace hover/click sobre cada notificación individual.

---

### DIS-22 — MEDIO: Sidebar con ancho hardcodeado inline

**Archivo:** `components/layout/unified-sidebar.tsx` línea 63

```tsx
style={{ width: '240px' }}
```

Ancho inline en lugar de clase Tailwind `w-60` (240px). Los layouts que abren el sidebar en un `<SheetContent>` usan `w-60` y `w-[240px]` en diferentes lugares. Tres valores distintos para el mismo ancho:
- `unified-sidebar.tsx`: `style={{ width: '240px' }}`
- `admin/layout-client.tsx` SheetContent: `w-60`
- `customer/layout-client.tsx` SheetContent: `w-[240px]`
- `technician/layout-client.tsx` SheetContent: `w-[240px]`

---

### DIS-23 — MEDIO: Color de avatar fallback hardcodeado en múltiples lugares

**Archivo(s):** `components/layout/unified-header.tsx` línea 112, `components/layout/unified-sidebar.tsx` línea 81

```tsx
// header
<AvatarFallback className="bg-[#991B1B] text-white ...">
// sidebar
<AvatarFallback className="bg-[#991B1B] text-white ...">
```

El color `#991B1B` está hardcodeado en dos componentes separados. Si se cambia el color de marca, hay que buscarlo manualmente. Debería ser `bg-primary` o una variable CSS.

---

### DIS-24 — MEDIO: `EmptyState` usa emojis como ilustraciones

**Archivo:** `components/domain/empty-state.tsx` líneas 30–61

Los emojis como ilustraciones (`📦`, `🔧`, `📋`, `📅`, `👥`) se renderizan diferente según el sistema operativo (iOS vs Android vs Windows vs macOS). En Windows 10/11 los emojis tienen una apariencia notablemente diferente a iOS. Para una app profesional B2B, es preferible usar ilustraciones SVG o íconos de Lucide consistentes con el sistema de diseño.

---

### DIS-25 — BAJO: Indicador de estado solo por color (accesibilidad)

**Archivo:** `app/(technician)/technician/dashboard/page.tsx` líneas 272–280

```tsx
<div className={`w-1.5 h-1.5 rounded-full mr-1 ${
  technician?.status === 'disponible' ? 'bg-green-500 animate-pulse' :
  technician?.status === 'ocupado' ? 'bg-blue-500' : 'bg-orange-500'
}`}></div>
Estado: {technician?.status === 'disponible' ? 'Disponible' : ...}
```

El punto de estado usa únicamente color para comunicar información, sin texto de respaldo para screen readers. Aunque hay texto adyacente, el punto en sí no tiene `aria-label` ni `role`.

---

### DIS-26 — BAJO: `h4` con clases de tipografía no-estándar

**Archivo:** `app/(technician)/technician/dashboard/page.tsx` línea 390

```tsx
<h4 className="text-small font-[600] text-text-secondary uppercase tracking-wide">
```

`text-small` no es una clase de Tailwind estándar — debería ser `text-sm`. `font-[600]` es un valor arbitrario cuando `font-semibold` cumple la misma función. `text-text-secondary` es un token Workshop custom. Esta línea mezcla los tres vocabularios en un solo elemento.

---

### DIS-27 — BAJO: `<Suspense>` en admin dashboard sin beneficio real

**Archivo:** `app/(admin)/admin/dashboard/page.tsx` líneas 326–344

`<Suspense>` envuelve `<DashboardStats>` y `<RecentOrders>` que son componentes `'use client'` con `useEffect` para fetch de datos. Los componentes cliente no suspenden con `fetch` — el `<Suspense>` solo actúa durante el SSR/RSC. El `fallback` nunca se mostrará en runtime (los componentes muestran su propio loading state internamente). Es código inofensivo pero confuso.

---

### DIS-28 — BAJO: `pathname` importado pero no usado en `TechnicianLayoutClient`

**Archivo:** `app/(technician)/technician/layout-client.tsx` línea 74

```typescript
const pathname = usePathname()  // Declarado pero nunca usado
```

`pathname` se declara pero no se referencia en el componente. El admin layout sí lo usa (para omitir el layout en `/admin/login`). Es código muerto.

---

## Resumen de Problemas por Portal

| # | Problema | Portal | Prioridad |
|---|----------|--------|-----------|
| DIS-01 | Triple sistema de colores en conflicto | Todos | CRÍTICO |
| DIS-02 | Mezcla de vocabularios CSS | Todos | ALTO |
| DIS-03 | Tokens manuales vs Tailwind v4 | Todos | MEDIO |
| DIS-04 | DashboardStats no usa MetricCard | Admin | ALTO |
| DIS-05 | Icono incorrecto "En Proceso" | Admin | ALTO |
| DIS-06 | Sin BottomNav en mobile | Admin | ALTO |
| DIS-07 | QuickActions sin jerarquía visual | Admin | ALTO |
| DIS-08 | Header title estático | Todos | MEDIO |
| DIS-09 | Card "Hoy" con descripción inconsistente | Admin | BAJO |
| DIS-10 | Card "Ofertas" vacía sin empty state | Cliente | CRÍTICO |
| DIS-11 | Grid stats incompleto en desktop | Cliente | ALTO |
| DIS-12 | Loading full-page vs skeletons | Cliente | ALTO |
| DIS-13 | statusIcons con iconos repetidos | Cliente | ALTO |
| DIS-14 | Historial sin link a detalle | Cliente | MEDIO |
| DIS-15 | Botón refresh sin aria-label | Cliente | BAJO |
| DIS-16 | Badge "Disponible" siempre verde | Técnico | CRÍTICO |
| DIS-17 | alert() nativo para errores | Técnico | ALTO |
| DIS-18 | Stats scroll sin indicador | Técnico | ALTO |
| DIS-19 | BottomNav con 5 items apretados | Técnico | MEDIO |
| DIS-20 | Empty states inconsistentes | Todos | ALTO |
| DIS-21 | NotificationBell marca leído al abrir | Todos | ALTO |
| DIS-22 | Sidebar ancho inconsistente | Todos | MEDIO |
| DIS-23 | Color avatar hardcodeado | Todos | MEDIO |
| DIS-24 | Emojis como ilustraciones | Todos | MEDIO |
| DIS-25 | Indicador estado solo por color | Técnico | BAJO |
| DIS-26 | h4 con clases mezcladas | Técnico | BAJO |
| DIS-27 | Suspense sin efecto real | Admin | BAJO |
| DIS-28 | pathname no usado | Técnico | BAJO |

---

## Oportunidades de Mejora UX (fuera de bugs)

### OPP-01: Breadcrumbs en páginas profundas
En admin, páginas como `/admin/orders/[id]/assignments` no tienen breadcrumb. El botón "Atrás" del navegador es el único escape. Implementar `<PageBreadcrumb>` (ya existe el componente en `components/page-breadcrumb.tsx`).

### OPP-02: Confirmación antes de acciones destructivas
El botón "Cerrar Sesión" en sidebar no pide confirmación. En mobile es fácil tocarlo accidentalmente. Un `AlertDialog` de shadcn sería suficiente.

### OPP-03: Indicador de página activa en header
Sincronizar el `title` del header con la página activa usando `usePathname()` + el array `sidebarItems`. Ejemplo: al estar en `/admin/orders`, el header podría mostrar "Órdenes de Servicio".

### OPP-04: Modo offline / error de red
Ningún portal tiene manejo de pérdida de conectividad. Un toast persistente o banner "Sin conexión" mejoraría la experiencia para técnicos en campo.

### OPP-05: Feedback de acciones exitosas
Acciones como actualizar estado de orden no siempre muestran feedback de éxito — solo recarga los datos. Un toast "Estado actualizado" daría confirmación inmediata.

---

*Generado por Claude Code — auditoría de diseño y UX*
*Fecha: 2026-03-06*
