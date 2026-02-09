/**
 * NextJobCard - Componente de Signature
 * Card hero para mostrar el próximo trabajo del técnico
 * Parte del sistema de diseño Workshop
 */

'use client'

import { MapPin, Phone, Navigation, Clock, Wrench, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NextJobCardProps {
  assignment: {
    id: number
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
  }
  onNavigate: () => void
  onCall: () => void
  onStart: () => void
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

export function NextJobCard({ assignment, onNavigate, onCall, onStart }: NextJobCardProps) {
  const urgency = urgencyConfig[assignment.urgencia]
  const UrgencyIcon = urgency.icon

  // Calcular ETA (simplificado - en producción vendría del backend)
  const eta = assignment.fechaProgramada
    ? new Date(assignment.fechaProgramada).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Por definir'

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-tool-orange/20 bg-gradient-to-br from-tool-orange/5 via-surface-card to-surface-card shadow-lg">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-tool-orange/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-tool-orange flex-shrink-0" />
              <h3 className="text-lg sm:text-h2 font-[700] text-label-ink truncate">
                Próximo Servicio
              </h3>
            </div>
            <p className="text-xs sm:text-small text-text-secondary font-mono">
              #{assignment.orderNumber}
            </p>
          </div>

          {/* Urgency badge */}
          <Badge className={cn('flex items-center gap-1 sm:gap-1.5 flex-shrink-0', urgency.color)}>
            <UrgencyIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] sm:text-xs">{urgency.label}</span>
          </Badge>
        </div>

        {/* ETA prominente */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-tool-orange/10 border border-tool-orange/30">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-tiny font-[600] text-tool-orange uppercase tracking-wide mb-1">
                Hora programada
              </p>
              <p className="text-3xl sm:text-hero font-[800] text-tool-orange font-mono tracking-tight">
                {eta}
              </p>
            </div>
            {assignment.estimatedDuration && (
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] sm:text-tiny text-text-secondary uppercase tracking-wide mb-1">
                  Duración est.
                </p>
                <p className="text-xl sm:text-h3 font-[700] text-label-ink">
                  {assignment.estimatedDuration}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cliente info */}
        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-assigned-blue/10 flex items-center justify-center">
              <span className="text-xs sm:text-body font-[700] text-assigned-blue">
                {assignment.cliente.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-body font-[600] text-label-ink mb-0.5 truncate">
                {assignment.cliente}
              </p>
              <p className="text-xs sm:text-small text-text-secondary truncate">
                {assignment.tipoElectrodomestico}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-surface-overlay border border-border-light">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-text-secondary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-small text-label-ink font-[500] break-words">
                {assignment.direccion}
              </p>
              <p className="text-xs sm:text-small text-text-secondary">
                {assignment.distrito}
              </p>
            </div>
          </div>

          {/* Problema */}
          <div className="p-2.5 sm:p-3 rounded-lg bg-pending-amber/5 border border-pending-amber/20">
            <p className="text-[10px] sm:text-tiny font-[600] text-pending-amber uppercase tracking-wide mb-1">
              Problema Reportado
            </p>
            <p className="text-xs sm:text-small text-label-ink leading-relaxed">
              {assignment.problema}
            </p>
          </div>
        </div>

        {/* Actions - Botones grandes (44px+ touch targets) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Button
            onClick={onNavigate}
            className="h-12 sm:h-14 bg-tool-orange hover:bg-tool-orange/90 text-white font-[700] shadow-lg shadow-tool-orange/20 transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Navigation className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Navegar
          </Button>
          <Button
            onClick={onCall}
            variant="outline"
            className="h-12 sm:h-14 border-2 border-border-emphasis hover:bg-surface-overlay font-[600] text-sm sm:text-base"
          >
            <Phone className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Llamar
          </Button>
        </div>

        <Button
          onClick={onStart}
          className="w-full h-12 sm:h-14 mt-2 sm:mt-3 bg-checkmark-green hover:bg-checkmark-green/90 text-white font-[700] shadow-lg shadow-checkmark-green/20 text-sm sm:text-base"
        >
          <Wrench className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Iniciar Servicio
        </Button>
      </div>

      {/* Bottom hint */}
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-surface-overlay border-t border-border-light">
        <p className="text-[10px] sm:text-tiny text-text-tertiary text-center">
          Desliza hacia abajo para ver más asignaciones
        </p>
      </div>
    </div>
  )
}
