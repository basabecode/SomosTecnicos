/**
 * NextJobCard - Componente de Signature
 * Card hero para mostrar el próximo trabajo del técnico
 * Parte del sistema de diseño Workshop
 */

'use client'

import { useState } from 'react'
import { MapPin, Phone, Navigation, Clock, Wrench, AlertTriangle, Play, Pause, CheckCircle, FileText, Loader2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NextJobCardProps {
  assignment: {
    id: number
    orderId?: string
    orderNumber: string
    cliente: string
    telefono: string
    direccion: string
    distrito: string
    tipoElectrodomestico: string
    problema: string
    urgencia: 'alta' | 'media' | 'baja'
    fechaProgramada?: string
    estimatedDuration?: string
    estado?: string
  }
  onNavigate: () => void
  onCall: () => void
  onStart: () => void
  onPause?: () => void
  onComplete?: () => void
  onReport?: () => void
}

const urgencyConfig = {
  alta: {
    label: 'URGENTE',
    color: 'bg-stamp-red/10 text-stamp-red border-stamp-red/30',
    icon: AlertTriangle,
  },
  media: {
    label: 'MEDIA',
    color: 'bg-pending-amber/10 text-pending-amber border-pending-amber/30',
    icon: Clock,
  },
  baja: {
    label: 'BAJA',
    color: 'bg-checkmark-green/10 text-checkmark-green border-checkmark-green/30',
    icon: Clock,
  },
}

export function NextJobCard({ assignment, onNavigate, onCall, onStart, onPause, onComplete, onReport }: NextJobCardProps) {
  const urgency = urgencyConfig[assignment.urgencia]
  const UrgencyIcon = urgency.icon
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Determinar estado: si ya está en_proceso, mostrar botones de acción
  const isInProgress = assignment.estado === 'en_proceso'

  // Calcular ETA (simplificado - en producción vendría del backend)
  const eta = assignment.fechaProgramada
    ? new Date(assignment.fechaProgramada).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Por definir'

  const handleStart = async () => {
    setLoadingAction('start')
    try {
      await onStart()
    } finally {
      setLoadingAction(null)
    }
  }

  const handlePause = async () => {
    if (!onPause) return
    setLoadingAction('pause')
    try {
      await onPause()
    } finally {
      setLoadingAction(null)
    }
  }

  const handleComplete = async () => {
    if (!onComplete) return
    setLoadingAction('complete')
    try {
      await onComplete()
    } finally {
      setLoadingAction(null)
    }
  }

  const handleWhatsApp = () => {
    if (!assignment.telefono) return
    const cleanPhone = assignment.telefono.replace(/\D/g, '')
    // Asumiendo código de país 57 para Colombia si no lo tiene
    const phoneWithCode = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`
    window.open(`https://wa.me/${phoneWithCode}`, '_blank')
  }

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-tool-orange/20 bg-gradient-to-br from-tool-orange/5 via-surface-card to-surface-card shadow-lg">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-tool-orange/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="p-4 sm:p-6">
        {/* Header - Prioridad y Tiempos */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="min-w-0 flex-1">
             <div className="flex items-center gap-2 mb-1">
               <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-tool-orange/10 text-tool-orange">
                 <Wrench className="h-4 w-4" />
               </span>
               <div>
                  <h3 className="text-base sm:text-lg font-bold text-label-ink leading-tight">
                    {isInProgress ? 'Servicio en Curso' : 'Próximo Servicio'}
                  </h3>
                   <p className="text-xs text-text-secondary font-mono">
                    #{assignment.orderNumber}
                  </p>
               </div>
             </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <Badge className={cn('flex items-center gap-1', urgency.color)}>
              <UrgencyIcon className="h-3 w-3" />
              <span>{urgency.label}</span>
            </Badge>
             {isInProgress && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                EN CURSO
              </Badge>
            )}
          </div>
        </div>

        {/* Info Principal - Hora */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-lg bg-surface-overlay border border-border-light flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-1">Programado</p>
                <p className="text-2xl font-bold text-label-ink font-mono">{eta}</p>
            </div>
            {assignment.estimatedDuration && (
                 <div className="p-3 rounded-lg bg-surface-overlay border border-border-light flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-1">Duración Est.</p>
                    <p className="text-xl font-semibold text-label-ink">{assignment.estimatedDuration}</p>
                </div>
            )}
        </div>

        {/* Detalles del Cliente y Servicio */}
        <div className="space-y-4 mb-6">
           {/* Cliente */}
           <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-assigned-blue/10 flex items-center justify-center text-assigned-blue font-bold text-sm">
                 {assignment.cliente.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-label-ink truncate">{assignment.cliente}</p>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                   <MapPin className="h-3 w-3" />
                   <span className="truncate">{assignment.direccion}, {assignment.distrito}</span>
                </div>
              </div>
           </div>

           {/* Problema */}
           <div className="bg-pending-amber/5 border border-pending-amber/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                 <AlertTriangle className="h-3.5 w-3.5 text-pending-amber" />
                 <span className="text-xs font-bold text-pending-amber uppercase">Problema Reportado</span>
              </div>
              <p className="text-sm text-label-ink leading-relaxed">
                 {assignment.problema} - <span className="font-medium">{assignment.tipoElectrodomestico}</span>
              </p>
           </div>
        </div>

        {/* Acciones de Contacto y Navegación */}
        <div className="grid grid-cols-3 gap-2 mb-3">
           <Button
             onClick={onNavigate}
             variant="outline"
             className="h-10 flex flex-col gap-0.5 items-center justify-center text-xs border-border-emphasis hover:bg-surface-overlay hover:text-tool-orange transition-colors"
           >
             <Navigation className="h-4 w-4" />
             <span>Navegar</span>
           </Button>
           <Button
             onClick={onCall}
             variant="outline"
             className="h-10 flex flex-col gap-0.5 items-center justify-center text-xs border-border-emphasis hover:bg-surface-overlay hover:text-assigned-blue transition-colors"
           >
             <Phone className="h-4 w-4" />
             <span>Llamar</span>
           </Button>
           <Button
             onClick={handleWhatsApp}
             variant="outline"
             className="h-10 flex flex-col gap-0.5 items-center justify-center text-xs border-border-emphasis hover:bg-surface-overlay hover:text-green-600 transition-colors"
           >
             <MessageCircle className="h-4 w-4" />
             <span>WhatsApp</span>
           </Button>
        </div>

        {/* Control del Servicio (Inicio/Pausa/Fin) */}
        <div className="space-y-2">
            {!isInProgress ? (
               <Button
                 onClick={handleStart}
                 disabled={loadingAction === 'start'}
                 className="w-full h-12 bg-tool-orange hover:bg-tool-orange/90 text-white font-bold text-base shadow-md shadow-tool-orange/20 transition-all hover:scale-[1.01]"
               >
                  {loadingAction === 'start' ? (
                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                     <Play className="mr-2 h-5 w-5 fill-current" />
                  )}
                  Iniciar Servicio
               </Button>
            ) : (
               <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handlePause}
                    disabled={loadingAction === 'pause'}
                    variant="outline"
                    className="h-12 border-2 border-pending-amber/50 text-pending-amber hover:bg-pending-amber/10 font-bold"
                  >
                     {loadingAction === 'pause' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     ) : (
                        <Pause className="mr-2 h-4 w-4 fill-current" />
                     )}
                     Pausar
                  </Button>

                  <Button
                    onClick={handleComplete}
                    disabled={loadingAction === 'complete'}
                    className="h-12 bg-checkmark-green hover:bg-checkmark-green/90 text-white font-bold shadow-md shadow-checkmark-green/20"
                  >
                     {loadingAction === 'complete' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                     )}
                     Finalizar
                  </Button>
               </div>
            )}

            {/* Opción secundaria para informe si es necesario, o visualización de estado */}
            {isInProgress && onReport && (
                <Button
                    onClick={onReport}
                    variant="ghost"
                    className="w-full h-8 text-xs text-text-secondary hover:text-label-ink"
                >
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Ver/Editar Informe de Visita
                </Button>
            )}
        </div>

      </div>

      {/* Footer Hint */}
      <div className="px-4 py-2 bg-surface-overlay border-t border-border-light text-center">
        <p className="text-[10px] text-text-tertiary">
          {isInProgress
            ? 'Recuerda llenar el informe antes de finalizar'
            : 'Desliza para ver más asignaciones'}
        </p>
      </div>
    </div>
  )
}

