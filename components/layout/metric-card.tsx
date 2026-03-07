/**
 * Componente Unificado de Tarjeta de Métrica
 * Diseño estandarizado para mostrar métricas en dashboards
 */

'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  /** Título de la métrica */
  title: string
  /** Valor principal de la métrica */
  value: string | number
  /** Descripción o subtítulo */
  description?: string
  /** Icono de la métrica */
  icon: LucideIcon
  /** Color del icono y acentos */
  iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** Tendencia (opcional) */
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  /** Clase adicional */
  className?: string
  /** Acción al hacer click */
  onClick?: () => void
}

const iconColorClasses = {
  primary: 'bg-red-50 text-primary',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-50 text-yellow-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-600',
}

const trendColorClasses = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'primary',
  trend,
  className,
  onClick,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        // Mobile: 20px padding, Desktop: 24px padding
        'bg-white rounded-xl shadow-sm p-5 md:p-6 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        {/* Contenido Principal */}
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">
            {title}
          </p>
          {/* Mobile: 24px, Desktop: 28px */}
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 truncate">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 truncate">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trendColorClasses[trend.direction]
                )}
              >
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500 truncate">{trend.label}</span>
            </div>
          )}
        </div>

        {/* Icono - Mobile: 48px, Desktop: 52px */}
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg flex-shrink-0 ml-3',
            iconColorClasses[iconColor]
          )}
        >
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid de Tarjetas de Métricas
 * Contenedor responsive para múltiples tarjetas
 */
interface MetricGridProps {
  children: React.ReactNode
  className?: string
}

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
    >
      {children}
    </div>
  )
}
