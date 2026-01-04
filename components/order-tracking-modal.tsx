'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Package, Calendar, User, CheckCircle, Clock } from 'lucide-react'
import { trackOrder } from '@/app/actions/track-order'

interface OrderTrackingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OrderTrackingModal({ isOpen, onClose }: OrderTrackingModalProps) {
  const [orderNumber, setOrderNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await trackOrder(orderNumber)
      if (response.success) {
        setResult(response.order)
      } else {
        setError(response.error || 'Error desconocido')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      asignado: 'bg-blue-100 text-blue-800',
      en_proceso: 'bg-purple-100 text-purple-800',
      en_camino: 'bg-indigo-100 text-indigo-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seguimiento de Orden</DialogTitle>
          <DialogDescription>
            Ingrese su número de orden para consultar el estado actual.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleTrack} className="space-y-4 py-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ej: ORD-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !orderNumber.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        {error && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
                {error}
            </div>
        )}

        {result && (
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{result.numero}</h3>
                    <p className="text-sm text-muted-foreground">{result.servicio}</p>
                </div>
                <Badge className={getStatusColor(result.estado)}>
                    {result.estado.toUpperCase().replace('_', ' ')}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div className="flex items-center gap-2 text-slate-600">
                    <Package className="h-4 w-4" />
                    <span>{result.marca}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(result.fecha).toLocaleDateString()}</span>
                </div>
                 <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>Act: {new Date(result.ultimaActualizacion).toLocaleDateString()}</span>
                </div>

                {result.tecnico && (
                     <div className="flex items-center gap-2 text-slate-600">
                        <User className="h-4 w-4" />
                        <span>Téc: {result.tecnico}</span>
                    </div>
                )}
            </div>

            {result.estado === 'completado' ? (
                 <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-2 bg-green-50 p-2 rounded">
                    <CheckCircle className="h-4 w-4" />
                    <span>¡Servicio Completado!</span>
                </div>
            ) : (
                <div className="mt-4 pt-3 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{
                                width: result.estado === 'pendiente' ? '10%' :
                                       result.estado === 'asignado' ? '30%' :
                                       result.estado === 'en_camino' ? '50%' :
                                       result.estado === 'en_proceso' ? '75%' :
                                       result.estado === 'completado' ? '100%' : '0%'
                            }}
                        ></div>
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">Progreso del servicio</p>
                </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
