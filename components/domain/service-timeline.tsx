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
              <div key={step.id} className="relative">
                <div className="flex gap-3 sm:gap-4">
                  {/* Icon circle - Estilo glassmorphic 3D */}
                  <div
                    className={cn(
                      'relative z-20 flex-shrink-0',
                      'w-12 h-12 sm:w-16 sm:h-16',
                      'rounded-full', '-ml-1', 'mt-4',
                      'flex items-center justify-center',
                      'transition-all duration-500',
                      status === 'completed' &&
                        'bg-checkmark-green text-white shadow-lg shadow-green-500/30',
                      status === 'current' &&
                        'text-white shadow-2xl',
                      status === 'upcoming' &&
                        'bg-surface-base border-2 border-border-light text-text-secondary'
                    )}
                    style={status === 'current' ? {
                      background: 'linear-gradient(135deg, #C41E3A 0%, #A50034 50%, #8B0028 100%)',
                      boxShadow: '0 10px 40px rgba(165, 0, 52, 0.6), inset 0 3px 10px rgba(255, 255, 255, 0.25), inset 0 -3px 10px rgba(0, 0, 0, 0.4)'
                    } : undefined}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-10 h-6 sm:w-8 sm:h-8" />
                    ) : (
                      <StepIcon className={cn(
                        'w-6 h-6 sm:w-8 sm:h-8',
                        status === 'current' && 'drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]'
                      )} />
                    )}

                    {/* Brillo superior en el círculo */}
                    {status === 'current' && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, transparent 50%)',
                          clipPath: 'ellipse(85% 45% at 50% 20%)'
                        }}
                      />
                    )}
                  </div>

                  {/* Resplandor animado para paso actual */}
                  {status === 'current' && (
                    <>
                      <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full opacity-50 blur-2xl animate-pulse z-10" style={{ background: '#A50034' }} />
                      <div className="absolute left-0 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full opacity-40 blur-3xl animate-ping z-10" style={{ background: '#C41E3A', animationDuration: '3s' }} />
                    </>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    {/* Barra horizontal roja glassmorphic para paso actual */}
                    {status === 'current' ? (
                      <div className="relative -ml-16 sm:-ml-20 mt-2">
                        {/* Barra principal con efecto 3D glassmorphic */}
                        <div
                          className="relative rounded-full pl-14 sm:pl-20 pr-5 sm:pr-7 py-4 sm:py-5 overflow-hidden"
                          style={{
                            background: 'linear-gradient(90deg, #C41E3A 0%, #A50034 50%, #C41E3A 100%)',
                            boxShadow: '0 15px 50px rgba(165, 0, 52, 0.6), 0 5px 15px rgba(0, 0, 0, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.25)'
                          }}
                        >
                          {/* Brillo superior glassmorphic */}
                          <div
                            className="absolute inset-x-0 top-0 h-1/2 rounded-t-full pointer-events-none"
                            style={{
                              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 100%)',
                              clipPath: 'ellipse(100% 65% at 50% 0%)'
                            }}
                          />

                          {/* Contenido */}
                          <div className="relative z-10 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base sm:text-xl font-bold text-white mb-1 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                {step.label}
                              </h4>
                              <p className="text-xs sm:text-sm text-white/95 font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                                {step.description}
                              </p>
                            </div>
                            <Badge
                              className="text-white border-white/50 font-semibold whitespace-nowrap shadow-lg text-xs sm:text-sm px-3 py-1.5 shrink-0"
                              style={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)'
                              }}
                            >
                              En Progreso
                            </Badge>
                          </div>

                          {/* Efecto de brillo animado que se mueve */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 4s ease-in-out infinite',
                              mixBlendMode: 'overlay'
                            }}
                          />

                          {/* Sombra inferior interna */}
                          <div
                            className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full pointer-events-none"
                            style={{
                              background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)'
                            }}
                          />
                        </div>

                        {/* Sombra difusa debajo de la barra */}
                        <div className="absolute inset-x-0 top-full h-10 blur-xl -z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(165, 0, 52, 0.3) 0%, transparent 100%)' }} />
                      </div>
                    ) : (
                      <div className="flex items-start justify-between mb-2 mt-2">
                        <div>
                          <h4
                            className={cn(
                              'text-sm sm:text-base font-[600] mb-1',
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
                      </div>
                    )}

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
