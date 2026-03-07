/**
 * EmptyState - Componente de Signature
 * Estados vacíos contextuales para diferentes paneles
 * Parte del sistema de diseño Workshop
 */

'use client'

import { LucideIcon, Package, Wrench, ClipboardList, Calendar, Users, MessageSquare, FileText, Shield, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateVariant =
  | 'no-orders'
  | 'no-assignments'
  | 'no-technicians'
  | 'no-history'
  | 'no-schedule'
  | 'no-services'
  | 'no-messages'
  | 'no-applications'
  | 'no-warranties'
  | 'no-results'

interface EmptyStateConfig {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
}

const emptyStateConfigs: Record<EmptyStateVariant, EmptyStateConfig> = {
  'no-orders': {
    icon: Package,
    title: 'No hay órdenes pendientes',
    description: 'Todas las órdenes han sido asignadas o completadas. ¡Excelente trabajo!',
    actionLabel: 'Ver historial',
  },
  'no-assignments': {
    icon: Wrench,
    title: 'No tienes asignaciones activas',
    description: 'Estás disponible para nuevos servicios. Te notificaremos cuando tengas una nueva asignación.',
  },
  'no-technicians': {
    icon: Users,
    title: 'No hay técnicos disponibles',
    description: 'Todos los técnicos están ocupados o fuera de servicio en este momento.',
    actionLabel: 'Ver todos los técnicos',
  },
  'no-history': {
    icon: ClipboardList,
    title: 'Aún no tienes historial',
    description: 'Aquí aparecerán tus servicios completados y su información.',
  },
  'no-schedule': {
    icon: Calendar,
    title: 'No hay servicios programados',
    description: 'No tienes servicios programados para hoy. Revisa el calendario para ver próximas citas.',
    actionLabel: 'Ver calendario',
  },
  'no-services': {
    icon: Wrench,
    title: 'No tienes servicios activos',
    description: 'Solicita un técnico cuando necesites ayuda con tus electrodomésticos.',
    actionLabel: 'Solicitar un Técnico',
  },
  'no-messages': {
    icon: MessageSquare,
    title: 'No hay mensajes',
    description: 'Aquí aparecerán tus conversaciones con el equipo técnico.',
  },
  'no-applications': {
    icon: FileText,
    title: 'No hay solicitudes',
    description: 'No hay solicitudes de técnicos pendientes de revisión.',
  },
  'no-warranties': {
    icon: Shield,
    title: 'No tienes garantías activas',
    description: 'Las garantías de tus servicios completados aparecerán aquí.',
  },
  'no-results': {
    icon: Search,
    title: 'Sin resultados',
    description: 'No se encontraron elementos con los filtros aplicados.',
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
        {/* Ilustración con icono Lucide */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-2xl" />
          <div className="relative w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {config.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Action */}
        {config.actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
          >
            {config.actionLabel}
          </Button>
        )}

        {/* Decorative dots */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-blue-500/30" />
          <div className="w-2 h-2 rounded-full bg-green-500/30" />
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

export function NoServicesEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState variant="no-services" onAction={onAction} />
}

export function NoMessagesEmptyState() {
  return <EmptyState variant="no-messages" />
}

export function NoApplicationsEmptyState() {
  return <EmptyState variant="no-applications" />
}

export function NoWarrantiesEmptyState() {
  return <EmptyState variant="no-warranties" />
}

export function NoResultsEmptyState() {
  return <EmptyState variant="no-results" />
}
