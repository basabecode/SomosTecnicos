'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, CheckCircle, XCircle, Package } from 'lucide-react'

/**
 * Seguimiento de Orden - Versión Dashboard Cliente
 * - Componente compacto para usar en dashboard
 * - Input para número de orden
 * - Búsqueda con API real
 * - Muestra estado en formato compacto
 */
export default function OrderTrackingDashboard() {
  const [orderNumber, setOrderNumber] = useState('')
  const [searchResult, setSearchResult] = useState<{
    found: boolean
    message: string
    details?: any
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setSearchResult({
        found: false,
        message: 'Por favor ingresa un número de orden',
      })
      return
    }

    setIsLoading(true)
    try {
      // Buscar la orden por número de orden
      const cleanOrderNumber = orderNumber.trim().replace('#', '')
      const response = await fetch(
        `/api/orders/search?numeroOrden=${cleanOrderNumber}`
      )

      if (!response.ok) {
        throw new Error('Orden no encontrada')
      }

      const order = await response.json()

      // Obtener técnico asignado si existe
      const tecnicoAsignado = order.assignments?.[0]?.technician

      // Mapear estados a mensajes amigables
      const statusMessages: Record<string, string> = {
        pendiente: 'En cola de asignación',
        asignada: `Técnico: ${tecnicoAsignado?.nombre || 'Pendiente'}`,
        en_proceso: `En proceso - ${tecnicoAsignado?.nombre || 'No asignado'}`,
        completada: 'Servicio completado ✓',
        cancelada: 'Orden cancelada',
      }

      setSearchResult({
        found: true,
        message: statusMessages[order.estado] || order.estado,
        details: {
          cliente: order.clienteNombre,
          tipo: order.tipoElectrodomestico,
          fecha: order.created_at,
          estado: order.estado,
          tecnico: tecnicoAsignado?.nombre || 'Por asignar',
        },
      })
    } catch (error) {
      setSearchResult({
        found: false,
        message: 'Orden no encontrada. Verifica el número.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-[#E0E0E0] h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
          <Package size={20} className="text-primary" />
          Estado de Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ej: #12345"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSearch}
            size="sm"
            className="bg-primary hover:bg-primary/80 text-white px-3"
            disabled={isLoading}
          >
            <Search size={16} />
          </Button>
        </div>

        {searchResult && (
          <div
            className={`p-3 rounded-lg flex items-start gap-2 text-sm animate-fade-in ${
              searchResult.found
                ? 'bg-[#27AE60]/10 border border-[#27AE60]/30'
                : 'bg-[#E74C3C]/10 border border-[#E74C3C]/30'
            }`}
          >
            {searchResult.found ? (
              <CheckCircle
                className="text-[#27AE60] shrink-0 mt-0.5"
                size={18}
              />
            ) : (
              <XCircle
                className="text-[#E74C3C] shrink-0 mt-0.5"
                size={18}
              />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`font-medium ${
                  searchResult.found ? 'text-[#27AE60]' : 'text-[#E74C3C]'
                }`}
              >
                {searchResult.found ? 'Encontrado:' : 'Error:'}
              </p>
              <p className="text-[#2C3E50] text-xs">{searchResult.message}</p>

              {/* Detalles adicionales si se encontró la orden */}
              {searchResult.found && searchResult.details && (
                <div className="mt-2 space-y-1 text-xs text-[#7F8C8D]">
                  <p>
                    <span className="font-medium">Cliente:</span>{' '}
                    {searchResult.details.cliente}
                  </p>
                  <p>
                    <span className="font-medium">Equipo:</span>{' '}
                    {searchResult.details.tipo}
                  </p>
                  <p>
                    <span className="font-medium">Técnico:</span>{' '}
                    {searchResult.details.tecnico}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-[#7F8C8D] text-center">
          Ingresa el número enviado por correo o WhatsApp
        </p>
      </CardContent>
    </Card>
  )
}

