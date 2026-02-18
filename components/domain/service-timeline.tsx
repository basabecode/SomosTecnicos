/**
 * ServiceTimeline - Componente de Signature
 * Timeline visual del progreso del servicio para clientes
 * Parte del sistema de diseño Workshop
 */

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

type ServiceStep = 'pendiente' | 'asignado' | 'en_camino' | 'en_proceso' | 'revisado' | 'esperando_repuestos' | 'reparado' | 'completado'

interface VisitReportInfo {
  diagnostico: string
  resultado: string
  costoTotal: number
  costoVisita?: number
  repuestos?: Array<{ nombre: string; cantidad: number; costoEstimado: number }>
  recomendaciones?: string
}

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
  visitReport?: VisitReportInfo
}

interface StepDef {
  id: ServiceStep
  label: string
  description: string
}

const allSteps: StepDef[] = [
  {
    id: 'pendiente',
    label: 'Solicitud Recibida',
    description: 'Tu solicitud ha sido registrada',
  },
  {
    id: 'asignado',
    label: 'Técnico Asignado',
    description: 'Hemos asignado un técnico especializado',
  },
  {
    id: 'en_camino',
    label: 'En Camino',
    description: 'El técnico está en camino a tu ubicación',
  },
  {
    id: 'en_proceso',
    label: 'Revisión en Curso',
    description: 'El técnico está revisando tu equipo',
  },
  {
    id: 'revisado',
    label: 'Diagnóstico Completado',
    description: 'El técnico ha completado el diagnóstico',
  },
  {
    id: 'esperando_repuestos',
    label: 'Esperando Repuestos',
    description: 'Se están gestionando las piezas necesarias',
  },
  {
    id: 'reparado',
    label: 'Reparado',
    description: 'Tu equipo ha sido reparado exitosamente',
  },
  {
    id: 'completado',
    label: 'Servicio Completado',
    description: 'Tu servicio ha sido finalizado',
  },
]

function buildVisibleSteps(currentStep: ServiceStep, visitReport?: VisitReportInfo): StepDef[] {
  // Siempre mostrar: pendiente, asignado, en_camino, en_proceso
  const base: ServiceStep[] = ['pendiente', 'asignado', 'en_camino', 'en_proceso']

  // Mostrar revisado si el estado actual es revisado o posterior, o si hay visitReport
  const postRevision: ServiceStep[] = ['revisado', 'esperando_repuestos', 'reparado', 'completado']
  const isPostRevision = postRevision.includes(currentStep) || visitReport

  if (isPostRevision) {
    base.push('revisado')
  }

  // Mostrar esperando_repuestos solo si el estado actual es ese, o el visitReport indica pendiente_repuesto
  if (
    currentStep === 'esperando_repuestos' ||
    visitReport?.resultado === 'pendiente_repuesto'
  ) {
    base.push('esperando_repuestos')
  }

  // Mostrar reparado si el estado actual es reparado o completado
  const postReparado: ServiceStep[] = ['reparado', 'completado']
  if (postReparado.includes(currentStep) || visitReport?.resultado === 'reparado') {
    base.push('reparado')
  }

  // Siempre mostrar completado como meta final
  base.push('completado')

  // Deduplicar y mantener orden
  const ordered: ServiceStep[] = ['pendiente', 'asignado', 'en_camino', 'en_proceso', 'revisado', 'esperando_repuestos', 'reparado', 'completado']
  const unique = ordered.filter(s => base.includes(s))

  return unique.map(id => allSteps.find(s => s.id === id)!).filter(Boolean)
}

export function ServiceTimeline({ currentStep, order, visitReport }: ServiceTimelineProps) {
  const visibleSteps = buildVisibleSteps(currentStep, visitReport)
  const stepOrder = visibleSteps.map(s => s.id)
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
    <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Estado de tu Servicio
        </h3>
        <p className="text-sm text-gray-500">
          Orden #{order.orderNumber}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-2">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-200" />

        {/* Steps */}
        <div className="space-y-8">
          {visibleSteps.map((step) => {
            const status = getStepStatus(step.id)

            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Status Indicator (Simple Dot) */}
                <div className={cn(
                  "relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-[3px] box-content bg-white",
                  status === 'completed' && "border-primary bg-primary w-2.5 h-2.5 mt-1.5 mx-[5px]", // Filled dot for completed
                  status === 'current' && "border-primary w-3 h-3 mt-1 mr-[1px] ml-[1px]", // Ring for current
                  status === 'upcoming' && "border-gray-200 w-2.5 h-2.5 mt-1.5 mx-[5px]" // Grey dot for upcoming
                )}>
                    {status === 'completed' && (
                        <div className="w-full h-full rounded-full bg-primary" />
                    )}
                    {status === 'current' && (
                        <div className="absolute inset-1 rounded-full bg-primary" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="mb-1">
                    <h4
                      className={cn(
                        'text-base leading-none mb-1',
                        status === 'current' ? 'font-semibold text-gray-900' :
                        status === 'completed' ? 'font-medium text-gray-700' : 'font-normal text-gray-400'
                      )}
                    >
                      {step.label}
                    </h4>
                    <p
                      className={cn('text-sm', {
                        'text-gray-600': status === 'current',
                        'text-gray-500': status === 'completed',
                        'text-gray-400': status === 'upcoming',
                      })}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Additional info per step - rendered cleanly */}
                  {step.id === 'asignado' && order.technician && status !== 'upcoming' && (
                    <div className="mt-3 flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100 max-w-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.technician.foto} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(order.technician.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.technician.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Técnico asignado
                        </p>
                      </div>
                    </div>
                  )}

                  {step.id === 'en_camino' && order.estimatedArrival && status === 'current' && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md inline-block">
                        Llegada estimada: <span className="font-medium">{order.estimatedArrival}</span>
                    </div>
                  )}

                  {step.id === 'revisado' && visitReport && status !== 'upcoming' && (
                    <div className="mt-3 bg-gray-50 p-4 rounded-md border border-gray-100 text-sm space-y-2">
                      <div>
                         <span className="font-medium text-gray-900">Diagnóstico:</span>
                         <p className="text-gray-600 mt-1">{visitReport.diagnostico}</p>
                      </div>
                      {visitReport.costoTotal > 0 && (
                        <div className="text-gray-900 font-medium">
                          Costo: {formatCurrency(visitReport.costoTotal)}
                        </div>
                      )}
                    </div>
                  )}

                  {step.id === 'esperando_repuestos' && visitReport?.repuestos && status !== 'upcoming' && (
                    <div className="mt-3 bg-orange-50/50 p-3 rounded-md border border-orange-100 text-sm">
                      <p className="font-medium text-gray-900 mb-1">Repuestos:</p>
                      <ul className="text-gray-600 space-y-1 pl-4 list-disc">
                        {visitReport.repuestos.map((r, i) => (
                          <li key={i}>
                            {r.nombre} (x{r.cantidad})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.id === 'completado' && order.completedAt && status === 'completed' && (
                    <div className="mt-2 text-sm text-green-600">
                        Finalizado el {new Date(order.completedAt).toLocaleDateString('es-CO')}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer - Minimal notification */}
      {currentStep !== 'completado' && currentStep !== 'reparado' && (
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
               {currentStep === 'pendiente' && 'Esperando asignación...'}
               {currentStep === 'asignado' && 'Tu técnico se contactará pronto.'}
               {currentStep === 'en_camino' && 'Tu técnico está en ruta.'}
               {currentStep === 'en_proceso' && 'Servicio en curso.'}
               {currentStep === 'revisado' && 'Revisa el diagnóstico arriba.'}
               {currentStep === 'esperando_repuestos' && 'Gestionando repuestos.'}
            </p>
        </div>
      )}
    </div>
  )
}
