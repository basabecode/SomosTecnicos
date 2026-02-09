/**
 * EmptyState - Componente de Signature
 * Estados vacíos contextuales para diferentes paneles
 * Parte del sistema de diseño Workshop
 */

'use client'

import { LucideIcon, Package, Wrench, ClipboardList, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateVariant =
  | 'no-orders'
  | 'no-assignments'
  | 'no-technicians'
  | 'no-history'
  | 'no-schedule'

interface EmptyStateConfig {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  illustration: string
}

const emptyStateConfigs: Record<EmptyStateVariant, EmptyStateConfig> = {
  'no-orders': {
    icon: Package,
    title: 'No hay órdenes pendientes',
    description: 'Todas las órdenes han sido asignadas o completadas. ¡Excelente trabajo!',
    actionLabel: 'Ver historial',
    illustration: '📦',
  },
  'no-assignments': {
    icon: Wrench,
    title: 'No tienes asignaciones activas',
    description: 'Estás disponible para nuevos servicios. Te notificaremos cuando tengas una nueva asignación.',
    illustration: '🔧',
  },
  'no-technicians': {
    icon: Users,
    title: 'No hay técnicos disponibles',
    description: 'Todos los técnicos están ocupados o fuera de servicio en este momento.',
    actionLabel: 'Ver todos los técnicos',
    illustration: '👥',
  },
  'no-history': {
    icon: ClipboardList,
    title: 'Aún no tienes historial',
    description: 'Aquí aparecerán tus servicios completados y su información.',
    illustration: '📋',
  },
  'no-schedule': {
    icon: Calendar,
    title: 'No hay servicios programados',
    description: 'No tienes servicios programados para hoy. Revisa el calendario para ver próximas citas.',
    actionLabel: 'Ver calendario',
    illustration: '📅',
  },
}

interface EmptyStateProps {
  variant: EmptyStateVariant
  onAction?: () => void
  className?: string
}

export function EmptyState({ variant, onAction, className }: EmptyStateProps) {
  const config = emptyStateConfigs[variant]
  const Icon = config.icon

  return (
    <div className={cn('workshop-card p-12', className)}>
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        {/* Illustration */}
        <div className="relative mb-6">
          {/* Background circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-tool-orange/10 to-assigned-blue/10 rounded-full blur-2xl" />

          {/* Icon container */}
          <div className="relative w-24 h-24 rounded-full bg-surface-overlay border-2 border-border-light flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-tool-orange/5 to-transparent rounded-full" />
            <span className="text-5xl relative z-10" role="img" aria-label={config.title}>
              {config.illustration}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-h2 font-[700] text-label-ink mb-2">
            {config.title}
          </h3>
          <p className="text-body text-text-secondary">
            {config.description}
          </p>
        </div>

        {/* Action */}
        {config.actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-tool-orange hover:bg-tool-orange/90 text-white font-[600] shadow-md"
          >
            {config.actionLabel}
          </Button>
        )}

        {/* Decorative elements */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-tool-orange/30" />
          <div className="w-2 h-2 rounded-full bg-assigned-blue/30" />
          <div className="w-2 h-2 rounded-full bg-checkmark-green/30" />
        </div>
      </div>
    </div>
  )
}

// Variantes específicas para uso directo
export function NoOrdersEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState variant="no-orders" onAction={onAction} />
}

export function NoAssignmentsEmptyState() {
  return <EmptyState variant="no-assignments" />
}

export function NoTechniciansEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState variant="no-technicians" onAction={onAction} />
}

export function NoHistoryEmptyState() {
  return <EmptyState variant="no-history" />
}

export function NoScheduleEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState variant="no-schedule" onAction={onAction} />
}
