/**
 * TechnicianCard - Componente de Signature
 * Tarjeta visual para mostrar técnico con estado en tiempo real
 * Parte del sistema de diseño Workshop
 */

'use client'

import { MapPin, Wrench, Clock, Navigation } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TechnicianCardProps {
  technician: {
    id: number
    nombre: string
    foto?: string
    estado: 'disponible' | 'ocupado' | 'en_descanso' | 'offline'
    zona: string
    especialidades: string[]
    ubicacionActual?: {
      lat: number
      lng: number
    }
    proximaOrden?: {
      orderNumber: string
      cliente: string
      hora: string
    }
  }
  onAssign?: (technicianId: number) => void
  onViewDetails?: (technicianId: number) => void
  compact?: boolean
}

const statusConfig = {
  disponible: {
    label: 'Disponible',
    color: 'bg-checkmark-green',
    borderColor: 'border-checkmark-green',
    textColor: 'text-checkmark-green',
    pulse: true,
  },
  ocupado: {
    label: 'En Servicio',
    color: 'bg-assigned-blue',
    borderColor: 'border-assigned-blue',
    textColor: 'text-assigned-blue',
    pulse: false,
  },
  en_descanso: {
    label: 'En Descanso',
    color: 'bg-pending-amber',
    borderColor: 'border-pending-amber',
    textColor: 'text-pending-amber',
    pulse: false,
  },
  offline: {
    label: 'Desconectado',
    color: 'bg-label-faded',
    borderColor: 'border-label-faded',
    textColor: 'text-label-faded',
    pulse: false,
  },
}

export function TechnicianCard({
  technician,
  onAssign,
  onViewDetails,
  compact = false,
}: TechnicianCardProps) {
  const status = statusConfig[technician.estado]
  const initials = technician.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (compact) {
    return (
      <div className="workshop-card p-2.5 sm:p-3 hover:shadow-md transition-all duration-fast">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar con estado */}
          <div className="relative shrink-0">
            <Avatar className={`h-8 w-8 sm:h-10 sm:w-10 border-2 ${status.borderColor} ${status.pulse ? 'animate-pulse' : ''}`}>
              <AvatarImage src={technician.foto} alt={technician.nombre} />
              <AvatarFallback className="bg-surface-overlay text-label-ink font-[600] text-xs sm:text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ${status.color} border-2 border-white ${status.pulse ? 'animate-pulse' : ''}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-small font-[600] text-label-ink truncate">
              {technician.nombre}
            </p>
            <p className="text-[10px] sm:text-tiny text-text-tertiary truncate">
              {technician.zona}
            </p>
          </div>

          {/* Estado badge */}
          <Badge variant="outline" className={`text-[10px] sm:text-tiny ${status.textColor} border-current shrink-0`}>
            {status.label}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="workshop-card p-3 sm:p-4 hover:shadow-md transition-all duration-fast">
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* Avatar con estado */}
        <div className="relative shrink-0">
          <Avatar className={`h-12 w-12 sm:h-16 sm:w-16 border-3 ${status.borderColor} ${status.pulse ? 'animate-pulse' : ''}`}>
            <AvatarImage src={technician.foto} alt={technician.nombre} />
            <AvatarFallback className="bg-surface-overlay text-label-ink font-[700] text-sm sm:text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full ${status.color} border-2 border-white ${status.pulse ? 'animate-pulse' : ''}`} />
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-h3 font-[700] text-label-ink mb-1 truncate">
            {technician.nombre}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2 text-text-secondary mb-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="text-xs sm:text-small truncate">{technician.zona}</span>
          </div>
          <Badge className={`${status.textColor} border-current text-[10px] sm:text-xs`} variant="outline">
            <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${status.color} mr-1 sm:mr-1.5 ${status.pulse ? 'animate-pulse' : ''}`} />
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Especialidades */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Wrench className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-tool-orange" />
          <span className="text-[10px] sm:text-tiny font-[600] text-text-secondary uppercase tracking-wide">
            Especialidades
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {technician.especialidades.map((esp, index) => (
            <span
              key={index}
              className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-surface-overlay border border-border-light text-[10px] sm:text-tiny text-label-ink"
            >
              {esp}
            </span>
          ))}
        </div>
      </div>

      {/* Próxima orden (si existe) */}
      {technician.proximaOrden && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-md bg-assigned-blue/5 border border-assigned-blue/20">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-assigned-blue" />
            <span className="text-[10px] sm:text-tiny font-[600] text-assigned-blue uppercase tracking-wide">
              Próximo Servicio
            </span>
          </div>
          <p className="text-xs sm:text-small text-label-ink font-[600]">
            #{technician.proximaOrden.orderNumber}
          </p>
          <p className="text-xs sm:text-small text-text-secondary truncate">
            {technician.proximaOrden.cliente}
          </p>
          <p className="text-[10px] sm:text-tiny text-text-tertiary mt-1">
            {technician.proximaOrden.hora}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-2">
        {onAssign && technician.estado === 'disponible' && (
          <Button
            onClick={() => onAssign(technician.id)}
            className="flex-1 h-10 sm:h-9 bg-tool-orange hover:bg-tool-orange/90 text-white font-[600] text-sm"
          >
            Asignar Orden
          </Button>
        )}
        {onViewDetails && (
          <Button
            onClick={() => onViewDetails(technician.id)}
            variant="outline"
            className="flex-1 h-10 sm:h-9 border-border-emphasis text-sm"
          >
            Ver Detalles
          </Button>
        )}
        {technician.ubicacionActual && (
          <Button
            variant="outline"
            className="h-10 sm:h-9 border-border-emphasis"
            asChild
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${technician.ubicacionActual.lat},${technician.ubicacionActual.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

