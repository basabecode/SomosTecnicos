/**
 * UrgentOrderBanner - Componente de Signature
 * Banner visual para órdenes urgentes que requieren atención inmediata
 * Parte del sistema de diseño Workshop
 */

'use client'

import { AlertTriangle, Clock, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface UrgentOrderBannerProps {
  order: {
    id: string
    orderNumber: string
    cliente: string
    direccion: string
    distrito: string
    tipoServicio: string
    problema: string
    createdAt: string
    urgencia: 'alta' | 'media' | 'baja'
  }
  onAssign: (orderId: string) => void
  onViewDetails: (orderId: string) => void
}

export function UrgentOrderBanner({ order, onAssign, onViewDetails }: UrgentOrderBannerProps) {
  const timeElapsed = formatDistanceToNow(new Date(order.createdAt), {
    addSuffix: true,
    locale: es,
  })

  return (
    <div className="relative overflow-hidden rounded-lg border-l-4 border-stamp-red bg-stamp-red/5 p-3 sm:p-4 shadow-sm animate-pulse-urgent">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stamp-red/5 to-transparent animate-shimmer" />

      <div className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {/* Icon con animación */}
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-stamp-red/10">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-stamp-red animate-pulse" />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base sm:text-h3 font-[700] text-label-ink">
                  Orden Urgente #{order.orderNumber}
                </h3>
                <Badge className="workshop-badge-pending text-[10px] sm:text-xs">
                  {order.urgencia.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs sm:text-small text-text-secondary">
                {order.tipoServicio}
              </p>
            </div>

            {/* Tiempo transcurrido */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-stamp-red flex-shrink-0">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-small font-[600] whitespace-nowrap">
                {timeElapsed}
              </span>
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-small truncate">{order.cliente}</span>
            </div>

            <div className="flex items-start gap-2 text-text-secondary">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-small break-words">
                {order.direccion}, {order.distrito}
              </span>
            </div>

            <div className="mt-2 sm:mt-3 rounded-md bg-surface-raised border border-border-light p-2.5 sm:p-3">
              <p className="text-xs sm:text-small text-label-ink leading-relaxed">
                <span className="font-[600]">Problema:</span> {order.problema}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onAssign(order.id)}
              className="w-full sm:w-auto h-11 sm:h-10 bg-tool-orange hover:bg-tool-orange/90 text-white font-[600] shadow-md hover:shadow-lg transition-all duration-fast text-sm"
            >
              Asignar Técnico Ahora
            </Button>
            <Button
              variant="outline"
              onClick={() => onViewDetails(order.id)}
              className="w-full sm:w-auto h-11 sm:h-10 border-border-emphasis hover:bg-surface-overlay text-sm"
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
