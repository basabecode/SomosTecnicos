/**
 * ServiceTimeline - Componente de Signature
 * Timeline visual del progreso del servicio para clientes
 * Parte del sistema de diseño Workshop
 */

'use client'

import { Check, Clock, User, Wrench, CheckCircle, Package } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ServiceStep = 'pendiente' | 'asignado' | 'en_camino' | 'en_proceso' | 'completado'

interface ServiceTimelineProps {
  currentStep: ServiceStep
  order: {
    id: string
    orderNumber: string
    createdAt: string
    technician?: {
      nombre: string
      foto?: string
      telefono?: string
    }
    estimatedArrival?: string
    startedAt?: string
    completedAt?: string
  }
}

const steps: Array<{
  id: ServiceStep
  label: string
  icon: typeof Clock
  description: string
}> = [
  {
    id: 'pendiente',
    label: 'Solicitud Recibida',
    icon: Package,
    description: 'Tu solicitud ha sido registrada',
  },
  {
    id: 'asignado',
    label: 'Técnico Asignado',
    icon: User,
    description: 'Hemos asignado un técnico especializado',
  },
  {
    id: 'en_camino',
    label: 'En Camino',
    icon: Clock,
    description: 'El técnico está en camino a tu ubicación',
  },
  {
    id: 'en_proceso',
    label: 'Reparación en Curso',
    icon: Wrench,
    description: 'El técnico está trabajando en tu equipo',
  },
  {
    id: 'completado',
    label: 'Servicio Completado',
    icon: CheckCircle,
    description: 'Tu servicio ha sido finalizado',
  },
]

const stepOrder: ServiceStep[] = ['pendiente', 'asignado', 'en_camino', 'en_proceso', 'completado']

export function ServiceTimeline({ currentStep, order }: ServiceTimelineProps) {
  const currentStepIndex = stepOrder.indexOf(currentStep)

  const getStepStatus = (stepId: ServiceStep): 'completed' | 'current' | 'upcoming' => {
    const stepIndex = stepOrder.indexOf(stepId)
    if (stepIndex < currentStepIndex) return 'completed'
    if (stepIndex === currentStepIndex) return 'current'
    return 'upcoming'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="workshop-card p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-h3 font-[700] text-label-ink mb-1">
          Estado de tu Servicio
        </h3>
        <p className="text-xs sm:text-small text-text-secondary">
          Orden #{order.orderNumber}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-border-light" />

        {/* Steps */}
        <div className="space-y-6 sm:space-y-8">
          {steps.map((step) => {
            const status = getStepStatus(step.id)
            const StepIcon = step.icon

            return (
              <div key={step.id} className="relative flex gap-3 sm:gap-4">
                {/* Icon circle */}
                <div
                  className={cn(
                    'relative z-10 flex-shrink-0',
                    'w-8 h-8 sm:w-12 sm:h-12',
                    'rounded-full',
                    'flex items-center justify-center',
                    'transition-all duration-normal',
                    status === 'completed' &&
                      'bg-checkmark-green text-white',
                    status === 'current' &&
                      'bg-tool-orange text-white animate-pulse shadow-lg shadow-tool-orange/30',
                    status === 'upcoming' &&
                      'bg-surface-base border-2 border-border-light text-text-secondary'
                  )}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Glow effect for current step */}
                {status === 'current' && (
                  <div className="absolute inset-0 rounded-full bg-tool-orange opacity-20 blur-md animate-pulse" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4
                        className={cn(
                          'text-sm sm:text-base font-[600] mb-1',
                          status === 'current' && 'text-tool-orange',
                          status === 'completed' && 'text-label-ink',
                          status === 'upcoming' && 'text-text-secondary'
                        )}
                      >
                        {step.label}
                      </h4>
                      <p
                        className={cn('text-small', {
                          'text-text-secondary': status !== 'upcoming',
                          'text-text-tertiary': status === 'upcoming',
                        })}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Status badge */}
                    {status === 'current' && (
                      <Badge className="bg-tool-orange/10 text-tool-orange border-tool-orange/30">
                        En Progreso
                      </Badge>
                    )}
                  </div>

                  {/* Additional info per step */}
                  {step.id === 'asignado' && order.technician && status !== 'upcoming' && (
                    <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-lg bg-assigned-blue/5 border border-assigned-blue/20">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-assigned-blue">
                          <AvatarImage src={order.technician.foto} />
                          <AvatarFallback className="bg-assigned-blue/10 text-assigned-blue font-[600] text-xs sm:text-sm">
                            {getInitials(order.technician.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-small font-[600] text-label-ink truncate">
                            {order.technician.nombre}
                          </p>
                          <p className="text-[10px] sm:text-tiny text-text-secondary">
                            Técnico asignado
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.id === 'en_camino' && order.estimatedArrival && status === 'current' && (
                    <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-lg bg-tool-orange/5 border border-tool-orange/20">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tool-orange flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-small font-[600] text-tool-orange">
                            Llegada estimada
                          </p>
                          <p className="text-xs sm:text-small text-text-secondary">
                            {order.estimatedArrival}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.id === 'completado' && order.completedAt && status === 'completed' && (
                    <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-lg bg-checkmark-green/5 border border-checkmark-green/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-checkmark-green flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-small font-[600] text-checkmark-green">
                            Finalizado
                          </p>
                          <p className="text-xs sm:text-small text-text-secondary">
                            {new Date(order.completedAt).toLocaleString('es-CO', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer - Next action */}
      {currentStep !== 'completado' && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border-light">
          <div className="flex items-center gap-2 text-xs sm:text-small text-text-secondary">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="leading-relaxed">
              {currentStep === 'pendiente' && 'Estamos buscando el mejor técnico para ti...'}
              {currentStep === 'asignado' && 'El técnico se pondrá en contacto contigo pronto'}
              {currentStep === 'en_camino' && 'Prepara el área de trabajo para el técnico'}
              {currentStep === 'en_proceso' && 'El técnico está trabajando en tu equipo'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
