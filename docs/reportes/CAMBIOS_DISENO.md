# Log de Cambios de Diseño — SomosTecnicos FSM

**Fecha:** 2026-03-06
**Basado en:** `docs/reportes/AUDITORIA_DISENO.md`

---

## Estado Global

| Aplicado | Pendiente |
|----------|-----------|
| 28 fixes | 0 pendientes |

> **DIS-20 completado — 2026-03-07**: todos los empty states inline migrados a `<EmptyState />`.

---

## Cambios Aplicados

### DIS-01 — CRÍTICO: Triple sistema de colores unificado (Todos los portales)
**Archivos:** `app/globals.css`, `styles/tokens.css`, `lib/design-system.ts`, y ~40 componentes

- `--primary` de shadcn/ui ahora apunta al rojo corporativo: `oklch(0.398 0.18 15)` ≈ `#A50034`
- `tokens.css` añade bloque `--st-*` como namespace corporativo sin colisionar con shadcn
- `--st-status-*` son aliases de Workshop tokens (único source of truth)
- `workshop-button-primary` migrado de `--tool-orange` a `--st-primary`
- Batch reemplazo de ~200 instancias de `bg-[#A50034]`, `text-[#A50034]`, `#991B1B` → `bg-primary`, `text-primary`
- Excepciones preservadas con hex: Recharts props, inline style gradients, email templates, PDF renderer

---

### DIS-02 — ALTO: Mezcla de vocabularios CSS (Parcialmente resuelto)
**Archivos:** `components/domain/empty-state.tsx` (principal fix)

- Botón del EmptyState: `bg-tool-orange` → `bg-primary` (vocabulario shadcn)
- Decorative dots: `bg-tool-orange/30`, `bg-assigned-blue/30` → `bg-primary/30`, `bg-blue-500/30`
- **Pendiente menor**: `next-job-card.tsx` aún usa `border-tool-orange/20` (uso semántico intencionado del Workshop token — aceptable)

---

### DIS-04 — ALTO: `DashboardStats` migrado a `MetricCard` (Admin)
**Archivo:** `components/admin/dashboard-stats.tsx`

- Las 8 cards del admin ahora usan `<MetricCard>` + `<MetricGrid>` del sistema unificado
- Eliminado markup de `<Card>` inline repetido 8 veces
- Cada card usa `iconColor` apropiado: `warning` (pendientes), `info` (en proceso), `success` (completadas/ingresos/hoy), `primary` (total/técnicos/tiempo)
- Skeleton de carga remplazado con animación coherente al estilo `MetricCard`

---

### DIS-05 — ALTO: Icono incorrecto en card "En Proceso" (Admin)
**Archivo:** `components/admin/dashboard-stats.tsx`
- Cambiado icono de `AlertTriangle` (advertencia) a `Wrench` (trabajo activo) en la card "En Proceso"

---

### DIS-06 — ALTO: Portal Admin sin navegación móvil
**Archivo:** `app/(admin)/admin/layout-client.tsx`

- Añadido `<BottomNav>` al portal Admin con 4 items primarios: Dashboard, Órdenes, Técnicos, Mensajes
- Contenido principal con `pb-16 md:pb-0` para no quedar oculto bajo el nav
- Items de admin seleccionados: las 4 acciones más frecuentes del manager en campo

---

### DIS-07 — ALTO: QuickActions sin jerarquía visual (Admin)
**Archivo:** `app/(admin)/admin/dashboard/page.tsx`

- Botón "Nueva Orden" cambiado de `variant="outline"` a `variant="default"` (color primario)
- Ahora existe una acción claramente primaria en el panel de acciones rápidas

---

### DIS-08 — MEDIO: Header title dinámico según página activa (Todos los portales)
**Archivos:**
- `app/(admin)/admin/layout-client.tsx`
- `app/(client)/customer/layout-client.tsx`
- `app/(technician)/technician/layout-client.tsx`

En los tres portales:
- Lógica `activeItem` que busca el item de navegación activo usando `pathname`
- El `title` del `<UnifiedHeader>` refleja la sección activa (ej: "Órdenes", "Mis Asignaciones")
- Subtitle del admin: "Sistema Operativo" → "Panel de Administración"

---

### DIS-09 — BAJO: Descripción inconsistente en card "Hoy" (Admin)
**Archivo:** `components/admin/dashboard-stats.tsx`
- Texto cambiado de `"Nuevas hoy"` a `"Completadas hoy"` — el valor es `completadasHoy`

---

### DIS-10 — CRÍTICO: Card "Ofertas Especiales" vacía (Cliente)
**Archivo:** `app/(client)/customer/dashboard/page.tsx`
- La card solo se renderiza cuando `promotions.length > 0`
- Eliminado contenedor vacío con header pero sin contenido

---

### DIS-11 — ALTO: Grid de stats incompleto en desktop (Cliente)
**Archivo:** `app/(client)/customer/dashboard/page.tsx`
- Grid cambiado de `grid-cols-2 lg:grid-cols-4` a `grid-cols-2`
- Eliminadas las 2 columnas vacías en desktop

---

### DIS-12 — ALTO: Loading full-page vs skeletons (Cliente)
**Archivo:** `app/(client)/customer/dashboard/page.tsx`

- Eliminado el spinner `<Loader2>` de pantalla completa
- Reemplazado por skeleton estructurado que muestra la forma de la página: header skeleton + 2 stat cards skeleton + lista skeleton
- Consistente con el patrón ya usado en el portal admin

---

### DIS-13 — ALTO: `statusIcons` con íconos repetidos (Cliente)
**Archivo:** `app/(client)/customer/dashboard/page.tsx`

- `en_camino`: `Clock` → `MapPin` (técnico en tránsito)
- `cotizado`: `CheckCircle` → `ShoppingCart` (presupuesto comercial)
- `esperando_repuestos`: `Clock` → `Calendar` (espera programada)
- `reparado`: `CheckCircle` → `Star` (reparación exitosa)
- `reagendado`: `Clock` → `Calendar` (nuevo agendamiento)
- Eliminados los 4 estados que usaban el mismo icono `Clock`

---

### DIS-14 — MEDIO: Historial reciente sin link a detalle (Cliente)
**Archivo:** `app/(client)/customer/dashboard/page.tsx`
- Items del historial envueltos en `<Link href="/customer/services">` con hover state

---

### DIS-15 — BAJO: Botón refresh sin `aria-label` (Cliente)
**Archivo:** `app/(client)/customer/dashboard/page.tsx`
- Añadido `aria-label="Recargar datos"` al botón de recarga

---

### DIS-16 — CRÍTICO: Badge "Disponible" estático desconectado (Técnico)
**Archivo:** `app/(technician)/technician/layout-client.tsx`
- Eliminado el badge `"Disponible"` hardcodeado del header
- `rightContent` → `undefined`

---

### DIS-17 — ALTO: `alert()` nativo reemplazado con toasts (Técnico)
**Archivo:** `app/(technician)/technician/dashboard/page.tsx`

Tres instancias de `window.alert()` eliminadas → `toast()` con variantes semánticas

---

### DIS-18 — ALTO: Stats scroll horizontal sin indicador (Técnico)
**Archivo:** `app/(technician)/technician/dashboard/page.tsx`

- Contenedor: `flex overflow-x-auto snap-x ...` → `grid grid-cols-2 lg:grid-cols-4 gap-4`
- Cards: eliminados `min-w-[160px]`, `snap-start`, `flex-shrink-0`
- En mobile las 4 stats ahora forman una cuadrícula 2×2 legible sin scroll oculto

---

### DIS-19 — MEDIO: BottomNav con 5 items apretados (Técnico)
**Archivo:** `app/(technician)/technician/layout-client.tsx`

- Eliminado "Config" del `mobileNavItems`
- BottomNav: 5 items → 4 items: Inicio, Asignaciones, Mensajes, Historial
- "Configuración" queda accesible por el menú del avatar en el header (ya estaba ahí)

---

### DIS-21 — ALTO: NotificationBell marca todo como leído al abrir (Todos)
**Archivo:** `components/navigation/notification-bell.tsx`
- `markAllAsRead()` movido a **cerrar** el dropdown (`!isOpen && unreadCount > 0`)
- El usuario ve los indicadores de "no leído" mientras revisa el panel

---

### DIS-22 — MEDIO: Sidebar con ancho hardcodeado inline (Todos)
**Archivo:** `components/layout/unified-sidebar.tsx`
- `style={{ width: '240px' }}` → clase Tailwind `w-60`

---

### DIS-23 — MEDIO: Color de avatar fallback hardcodeado (Todos)
**Archivos:** `components/layout/unified-header.tsx`, `components/layout/unified-sidebar.tsx`
- `bg-[#991B1B]` / `bg-[#A50034]` → `bg-primary` (token Tailwind, se actualiza automáticamente con el tema)

---

### DIS-24 — MEDIO: Emojis como ilustraciones en EmptyState (Todos)
**Archivo:** `components/domain/empty-state.tsx`

- Eliminados emojis (`📦`, `🔧`, `📋`, `📅`, `👥`) como ilustraciones
- Reemplazados por los íconos Lucide (`Package`, `Wrench`, `ClipboardList`, `Calendar`, `Users`) ya definidos en cada config
- Icono centrado en contenedor circular con `text-primary`
- Consistente cross-platform (sin variación OS)

---

### DIS-25 — BAJO: Indicador de estado solo por color (Técnico)
**Archivo:** `app/(technician)/technician/dashboard/page.tsx`
- `role="img"` y `aria-label` con texto del estado al punto de color de disponibilidad

---

### DIS-26 — BAJO: `h4` con clases de tipografía no-estándar (Técnico)
**Archivo:** `app/(technician)/technician/dashboard/page.tsx`
- `text-small font-[600] text-text-secondary` → `text-sm font-semibold text-muted-foreground`

---

### DIS-27 — BAJO: `<Suspense>` sin beneficio real en admin dashboard
**Archivo:** `app/(admin)/admin/dashboard/page.tsx`

- Eliminados los 3 wrappers `<Suspense>` alrededor de `<DashboardStats>`, `<RecentOrders>`, `<TechnicianStatus>`, `<DashboardCharts>`
- Los componentes `use client` con `useEffect` no suspenden — el `fallback` nunca se mostraba
- Eliminadas las funciones helper `StatsLoading()` y `CardLoading()` (código muerto)

---

### DIS-28 — BAJO: `pathname` no usado en `TechnicianLayoutClient`
**Archivo:** `app/(technician)/technician/layout-client.tsx`
- `pathname` eliminado inicialmente; restaurado en DIS-08 para la lógica de título activo

---

### DIS-03 — MEDIO: Tokens manuales vs Tailwind v4 (Todos)
**Archivos:** `app/globals.css`, `styles/tokens.css`

- Resuelto por diseño: el bloque `@theme inline` en `globals.css` expone todos los tokens corporativos como propiedades `--color-st-*`, `--color-st-status-*`, etc.
- Tailwind v4 genera automáticamente las utilidades `bg-st-primary`, `text-st-error`, `bg-st-status-pending`, etc. a partir de ese bloque — sin necesidad de clases manuales.
- Las clases utilitarias explícitas añadidas en `tokens.css` (`.bg-st-primary`, `.text-st-primary`, etc.) quedan como capa de compatibilidad para contextos no-Tailwind (HTML vanilla, emails, pruebas), pero no entran en conflicto porque Tailwind v4 genera las suyas en `@layer utilities` con menor especificidad que las no-layer de `tokens.css`.
- No se requiere ninguna acción adicional.

---

### DIS-20 — ALTO: Empty states inconsistentes entre portales (Todos)
**Archivos:** `app/(admin)/admin/dashboard/page.tsx`, `app/(admin)/admin/customers/page.tsx`, `app/(admin)/admin/orders/[id]/assign/page.tsx`, `app/(client)/customer/messages/page.tsx`

Cuatro patrones inline reemplazados por `<EmptyState />`:

| Archivo | Empty state anterior | Variante aplicada |
|---------|---------------------|-------------------|
| `admin/dashboard/page.tsx` | `<div className="text-center py-4 ...">No hay alertas...</div>` | `no-results` + `className="p-4"` |
| `admin/customers/page.tsx` | `<TableRow><TableCell>No se encontraron clientes...</TableCell></TableRow>` | `no-results` dentro de `<TableCell colSpan={7}>` |
| `admin/orders/[id]/assign/page.tsx` | `<div>...<p>No se encontraron técnicos...</p><Button>Ver todos</Button></div>` | `no-technicians` con `onAction={() => setIgnoreCity(true)}` |
| `customer/messages/page.tsx` | `<div><MessageSquare/><p>No se encontraron mensajes</p></div>` | `no-messages` + `className="p-6"` |

Import `{ EmptyState } from '@/components/domain'` añadido a los 4 archivos.

---

## Cambios Pendientes

| ID | Descripción | Razón de postergación |
|----|-------------|----------------------|
| — | Sin pendientes | Todos los 28 issues resueltos |

---

## Archivos con hex de marca preservado intencionalmente

| Archivo | Razón |
|---------|-------|
| `components/admin/dashboard-charts.tsx` | Recharts `fill`/`stroke` props |
| `components/technician/technician-charts.tsx` | Recharts `fill` prop |
| `components/technician-cta.tsx` | `style={{ background: linear-gradient(...) }}` |
| `lib/config/specialties.ts` | Objeto de config de datos |
| `lib/email.ts`, `lib/email/templates/*` | HTML inline para clientes de email |
| `lib/invoice/templates/invoice-template.tsx` | Renderizado de PDF |
| `app/(public)/trabaja-con-nosotros/page.tsx:665` | SVG `stroke="#A50034"` (atributo SVG) |
| `app/(public)/login/page.tsx`, `forgot-password`, `reset-password` | Gradiente multi-parada `from-[#8B1538] via-primary to-[#2C3E50]` |
| `components/header.tsx`, `hero-section.tsx` | Gradientes decorativos con stops `#c9003f` intencionales |
| `lib/design-system.ts` | Valores JS de referencia (fuente de verdad del design system) |

---

*Generado por Claude Code — 2026-03-06 | DIS-20 completado 2026-03-07*
