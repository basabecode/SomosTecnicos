---
name: ui-design-pwa
description: >
  UI/UX design skill para SomosTécnicos PWA. Adapta los patrones del
  plugin ui-design (wshobson/agents) al stack Next.js + Tailwind + PWA.
  Usar cuando se construyan componentes, pantallas o design tokens del proyecto.
metadata:
  version: 1.0.0
  author: basabecode
  domain: frontend-design
  stack: Next.js App Router, Tailwind CSS, shadcn/ui, PWA
  source: github.com/wshobson/agents/plugins/ui-design (adaptado)
  triggers: componente, pantalla, diseño, UI, layout, tarjeta, formulario, modal, navegación, color, tema, token
---

# UI Design PWA — SomosTécnicos

Guía de diseño y patrones de componentes para la PWA de SomosTécnicos.
Adaptado desde los patrones de React Native al stack web: **Next.js + Tailwind CSS + shadcn/ui**.

---

## 1. Design Tokens

### Paleta de Colores (CSS custom properties)

```css
/* globals.css */
:root {
  /* Brand */
  --color-brand: #e40014;
  --color-brand-dark: #bf000f;
  --color-brand-light: #fef2f2;
  --color-accent: #f05100;

  /* Semánticos */
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
  --color-info: #2563eb;

  /* Neutros */
  --color-bg: #ffffff;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-muted: #6b7280;

  /* Spacing base 4px */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radios */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### Tailwind Config — Colores de Marca

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: '#e40014',
        dark:    '#bf000f',
        light:   '#fef2f2',
      },
      accent: '#f05100',
    }
  }
}
```

---

## 2. Tipografía

```css
/* Escala tipográfica */
.text-display {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}
.text-h1 {
  font-size: 1.5rem;
  font-weight: 700;
}
.text-h2 {
  font-size: 1.25rem;
  font-weight: 600;
}
.text-h3 {
  font-size: 1.125rem;
  font-weight: 600;
}
.text-body {
  font-size: 1rem;
  line-height: 1.6;
}
.text-sm {
  font-size: 0.875rem;
  color: var(--color-muted);
}
.text-xs {
  font-size: 0.75rem;
  color: var(--color-muted);
}
```

---

## 3. Componentes Base

### OrderStatusBadge

```tsx
// components/ui/OrderStatusBadge.tsx
const STATUS_CONFIG = {
  pending: { label: 'Pendiente', classes: 'bg-gray-100 text-gray-700' },
  assigned: { label: 'Asignado', classes: 'bg-blue-100 text-blue-700' },
  in_progress: {
    label: 'En Progreso',
    classes: 'bg-orange-100 text-orange-700',
  },
  quoted: { label: 'Cotizado', classes: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Aprobado', classes: 'bg-green-100 text-green-700' },
  completed: { label: 'Completado', classes: 'bg-green-200 text-green-800' },
  rejected: { label: 'Rechazado', classes: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelado', classes: 'bg-gray-200 text-gray-600' },
} as const

export function OrderStatusBadge({
  status,
}: {
  status: keyof typeof STATUS_CONFIG
}) {
  const { label, classes } = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  )
}
```

### ServiceCard

```tsx
// components/ui/ServiceCard.tsx
interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

export function ServiceCard({
  icon,
  title,
  description,
  href,
}: ServiceCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-3 p-5 bg-white rounded-2xl border border-gray-100
                  shadow-sm hover:shadow-md hover:border-brand/30 transition-all duration-200"
    >
      <div
        className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center
                      text-brand group-hover:bg-brand group-hover:text-white transition-colors"
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </a>
  )
}
```

### TechnicianCard

```tsx
// components/ui/TechnicianCard.tsx
interface TechnicianCardProps {
  name: string
  specialty: string
  rating: number
  reviewCount: number
  avatarUrl?: string
  isAvailable?: boolean
}

export function TechnicianCard({
  name,
  specialty,
  rating,
  reviewCount,
  avatarUrl,
  isAvailable,
}: TechnicianCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative">
        <img
          src={avatarUrl || '/placeholder-tech.png'}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />
        {isAvailable && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-500">{specialty}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({reviewCount} reseñas)</span>
        </div>
      </div>
    </div>
  )
}
```

### OrderTimeline

```tsx
// components/ui/OrderTimeline.tsx
const TIMELINE_STEPS = [
  { key: 'pending', label: 'Solicitud recibida' },
  { key: 'assigned', label: 'Técnico asignado' },
  { key: 'in_progress', label: 'En camino / En sitio' },
  { key: 'quoted', label: 'Cotización enviada' },
  { key: 'approved', label: 'Cotización aprobada' },
  { key: 'completed', label: 'Servicio completado' },
]

const STEP_ORDER = [
  'pending',
  'assigned',
  'in_progress',
  'quoted',
  'approved',
  'completed',
]

export function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STEP_ORDER.indexOf(currentStatus)

  return (
    <ol className="relative border-l-2 border-gray-200 ml-3 space-y-6">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const pending = i > currentIdx
        return (
          <li key={step.key} className="ml-6">
            <span
              className={`absolute -left-[11px] w-5 h-5 rounded-full flex items-center justify-center
              ${done ? 'bg-brand border-2 border-brand' : ''}
              ${active ? 'bg-white border-2 border-brand ring-4 ring-brand/20' : ''}
              ${pending ? 'bg-gray-200 border-2 border-gray-300' : ''}`}
            >
              {done && <span className="text-white text-xs">✓</span>}
              {active && <span className="w-2 h-2 bg-brand rounded-full" />}
            </span>
            <p
              className={`text-sm font-medium ${active ? 'text-brand' : done ? 'text-gray-700' : 'text-gray-400'}`}
            >
              {step.label}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
```

### NotificationBell

```tsx
// components/ui/NotificationBell.tsx
'use client'
import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

export function NotificationBell({ userId }: { userId: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const source = new EventSource(`/api/notifications/stream?userId=${userId}`)
    source.onmessage = e => {
      const data = JSON.parse(e.data)
      if (data.type === 'NEW_NOTIFICATION') setCount(c => c + 1)
    }
    return () => source.close()
  }, [userId])

  return (
    <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
      <Bell className="w-5 h-5 text-gray-600" />
      {count > 0 && (
        <span
          className="absolute top-1 right-1 w-4 h-4 bg-brand text-white text-[10px]
                         font-bold rounded-full flex items-center justify-center"
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
```

### QuoteCard

```tsx
// components/ui/QuoteCard.tsx
interface QuoteCardProps {
  technicianName: string
  description: string
  amount: number
  createdAt: Date
  onApprove: () => void
  onReject: () => void
  isPending?: boolean
}

export function QuoteCard({
  technicianName,
  description,
  amount,
  createdAt,
  onApprove,
  onReject,
  isPending,
}: QuoteCardProps) {
  return (
    <div className="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-yellow-700 font-medium uppercase tracking-wide">
            Cotización de {technicianName}
          </p>
          <p className="text-sm text-gray-700 mt-1">{description}</p>
        </div>
        <span className="text-2xl font-bold text-gray-900">
          ${amount.toLocaleString('es-CO')}
        </span>
      </div>
      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl
                             hover:bg-brand-dark transition-colors"
          >
            Aprobar
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2.5 bg-white text-red-600 text-sm font-semibold rounded-xl
                             border border-red-200 hover:bg-red-50 transition-colors"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## 4. Layout Patterns (Mobile-First PWA)

### App Shell — Bottom Navigation (Cliente/Técnico)

```tsx
// components/layout/AppShell.tsx
const NAV_ITEMS_CUSTOMER = [
  { href: '/dashboard/customer', icon: Home, label: 'Inicio' },
  {
    href: '/dashboard/customer/orders',
    icon: ClipboardList,
    label: 'Mis Órdenes',
  },
  {
    href: '/dashboard/customer/messages',
    icon: MessageCircle,
    label: 'Mensajes',
  },
  { href: '/dashboard/customer/profile', icon: User, label: 'Perfil' },
]

export function AppShell({
  children,
  role,
}: {
  children: React.ReactNode
  role: 'customer' | 'tech' | 'admin'
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <img src="/logo-st.svg" alt="SomosTécnicos" className="h-7" />
        <NotificationBell userId="..." />
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100
                      flex items-center justify-around h-16 px-2 safe-area-bottom"
      >
        {NAV_ITEMS_CUSTOMER.map(item => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </div>
  )
}
```

### ServiceRequestForm (Multi-step)

```tsx
// Paso 1: Selección de equipo
// Paso 2: Descripción del problema + fotos
// Paso 3: Dirección + disponibilidad horaria
// Paso 4: Confirmación

const STEPS = ['Equipo', 'Problema', 'Dirección', 'Confirmar']

export function ServiceRequestForm() {
  const [step, setStep] = useState(0)

  return (
    <div className="px-4 py-6">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${i < step ? 'bg-brand text-white' : ''}
              ${i === step ? 'bg-brand text-white ring-4 ring-brand/20' : ''}
              ${i > step ? 'bg-gray-100 text-gray-400' : ''}`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs ${i === step ? 'text-brand font-medium' : 'text-gray-400'}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-64">
        {step === 0 && <StepEquipo />}
        {step === 1 && <StepProblema />}
        {step === 2 && <StepDireccion />}
        {step === 3 && <StepConfirmar />}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl"
          >
            Atrás
          </button>
        )}
        <button
          onClick={() => (step < 3 ? setStep(s => s + 1) : handleSubmit())}
          className="flex-1 py-3 bg-brand text-white font-semibold rounded-2xl hover:bg-brand-dark transition-colors"
        >
          {step < 3 ? 'Continuar' : 'Confirmar Solicitud'}
        </button>
      </div>
    </div>
  )
}
```

---

## 5. Patrones de Interacción (Adaptados desde React Native → Web PWA)

### Swipe-to-Reveal (Técnico — acciones rápidas en orden)

Usar `@use-gesture/react` o CSS scroll snap para acciones rápidas mobile.

### Pull-to-Refresh

```tsx
// En Next.js PWA usar router.refresh() en pull gesture
```

### Skeleton Loaders

```tsx
// Siempre usar skeletons mientras carga, nunca spinners solos
export function OrderCardSkeleton() {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3 animate-pulse">
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
    </div>
  )
}
```

### Toast Notifications

```tsx
// Usar sonner (recomendado con Next.js App Router)
import { toast } from 'sonner'

// Éxito
toast.success('Orden asignada correctamente')
// Error
toast.error('No se pudo procesar la solicitud')
// Promesa
toast.promise(assignOrder(id), {
  loading: 'Asignando técnico...',
  success: 'Técnico asignado',
  error: 'Error al asignar',
})
```

---

## 6. Accesibilidad (WCAG 2.2 — Mobile)

```tsx
// Siempre incluir:
// - aria-label en iconos sin texto
// - role="status" en cambios dinámicos
// - tabIndex en elementos interactivos custom
// - focus-visible rings

// Ratio de contraste mínimo 4.5:1
// brand #e40014 sobre blanco = ✅ 5.1:1
// text-gray-500 sobre blanco = ✅ 4.6:1

// Target touch mínimo 44×44px
<button className="min-h-[44px] min-w-[44px] ..." />
```

---

## 7. Responsive (Mobile-First → Desktop Admin)

```
Mobile  (< 640px):  Portales cliente y técnico — bottom nav, full width cards
Tablet  (640–1024px): Sidebar colapsable, grid 2 cols
Desktop (> 1024px): Portal admin/manager — sidebar fija, dashboard multi-columna
```

```tsx
// Breakpoints Tailwind útiles para este proyecto
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// Sidebar admin
<aside className="hidden lg:flex w-64 flex-col ...">
// Stack → Row en desktop
<div className="flex flex-col md:flex-row gap-4">
```

---

## 8. PWA-Specific Patterns

### Offline Indicator

```tsx
export function OfflineBanner() {
  const [offline, setOffline] = useState(false)
  useEffect(() => {
    const on = () => setOffline(true)
    const off = () => setOffline(false)
    window.addEventListener('offline', on)
    window.addEventListener('online', off)
    return () => {
      window.removeEventListener('offline', on)
      window.removeEventListener('online', off)
    }
  }, [])

  if (!offline) return null
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900
                    text-sm font-medium text-center py-2 px-4"
    >
      Sin conexión — mostrando datos guardados
    </div>
  )
}
```

### Install Prompt (Add to Homescreen)

```tsx
export function InstallBanner() {
  // Guardar el evento beforeinstallprompt y mostrarlo con branding de SomosTécnicos
  // Solo mostrar si no está instalado y el usuario lleva 2+ visitas
}
```

---

## 9. Convenciones del Proyecto

| Regla          | Patrón                                           |
| -------------- | ------------------------------------------------ |
| Componentes UI | `components/ui/NombreComponente.tsx`             |
| Layouts        | `components/layout/NombreLayout.tsx`             |
| Íconos         | lucide-react                                     |
| Formularios    | react-hook-form + zod                            |
| Estado global  | zustand o React Context                          |
| Animaciones    | tailwind transitions + framer-motion para modals |
| Fuentes        | Inter o system-ui (sin carga externa)            |
| Imágenes       | next/image siempre                               |

---

## 10. Anti-Patrones a Evitar

| Anti-Patrón                        | Corrección                             |
| ---------------------------------- | -------------------------------------- |
| Botones sin `min-h-[44px]`         | Siempre 44px mínimo en mobile          |
| Colores hardcoded en JSX           | Usar clases Tailwind con tokens        |
| Spinners sin skeletons             | Preferir skeletons para layout estable |
| `onClick` en `<div>`               | Usar `<button>` con accesibilidad      |
| Formularios sin validación visible | Mostrar errores inline bajo el campo   |
| Notificaciones sin timeout         | Toast desaparece en 4s automáticamente |
| Imágenes sin `alt` descriptivo     | Describir contexto, no solo "imagen"   |
