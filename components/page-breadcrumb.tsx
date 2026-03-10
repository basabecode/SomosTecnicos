/**
 * PageBreadcrumb — Componente reutilizable de migas de pan.
 *
 * - Diseño consistente en todas las subpáginas.
 * - Totalmente responsive: funciona en móvil, tablet y desktop.
 * - target mínimo de toque ≥ 44px en mobile (padding + min-h).
 * - Soporta fondo oscuro (dark) y claro (light).
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string  // undefined = ítem actual (no clickeable)
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  /** Esquema de colores. 'dark' para fondos oscuros (#1a0a0f), 'light' para fondos claros */
  variant?: 'dark' | 'light'
  className?: string
  /** Mostrar ícono de casa en el primer ítem (Inicio) */
  showHomeIcon?: boolean
}

export default function PageBreadcrumb({
  items,
  variant = 'dark',
  className,
  showHomeIcon = false,
}: PageBreadcrumbProps) {
  const isDark = variant === 'dark'

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        // Layout base
        'flex items-center flex-wrap gap-x-1 gap-y-0.5',
        // Texto base
        'text-sm',
        className,
      )}
    >
      <ol className="flex items-center flex-wrap gap-x-1 gap-y-0.5 list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <li key={item.label} className="inline-flex items-center gap-1">
              {/* Separador — excepto en el primer ítem */}
              {!isFirst && (
                <ChevronRight
                  className={cn(
                    'w-3.5 h-3.5 shrink-0',
                    isDark ? 'text-gray-600' : 'text-gray-400',
                  )}
                  aria-hidden="true"
                />
              )}

              {isLast || !item.href ? (
                /* Ítem actual — no clickeable */
                <span
                  aria-current="page"
                  className={cn(
                    'font-medium truncate max-w-[160px] sm:max-w-xs',
                    isDark ? 'text-gray-200' : 'text-gray-700',
                  )}
                >
                  {item.label}
                </span>
              ) : (
                /* Ítem ancestro — clickeable */
                <Link
                  href={item.href}
                  className={cn(
                    // Tamaño mínimo táctil en mobile
                    'inline-flex items-center gap-1',
                    'min-h-11 sm:min-h-0 py-1',
                    'transition-colors duration-200',
                    isFirst && showHomeIcon ? 'gap-1.5' : '',
                    isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-primary',
                  )}
                >
                  {isFirst && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span className="truncate max-w-30 sm:max-w-xs">{item.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

