/**
 * Componente de Órdenes Recientes
 * Lista las últimas órdenes con información relevante
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Clock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Wrench,
} from 'lucide-react'

interface Order {
  id: string
  numeroOrden: string
  nombre: string
  telefono: string
  ciudad: string
  tipoElectrodomestico: string
  tipoServicio: string
  estado: string
  urgencia: string
  createdAt: string
  assignment?: {
    technician: {
      nombre: string
    }
  }
}

const statusColors = {
  pendiente: 'bg-orange-100 text-orange-800',
  asignado: 'bg-blue-100 text-blue-800',
  en_proceso: 'bg-purple-100 text-purple-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

const statusLabels = {
  pendiente: 'Pendiente',
  asignado: 'Asignado',
  en_proceso: 'En Proceso',
  completado: 'Completado',
  cancelado: 'Cancelado',
}

const urgencyColors = {
  baja: 'text-green-600',
  media: 'text-orange-600',
  alta: 'text-red-600',
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pendiente':
      return <Clock className="h-4 w-4" />
    case 'en_proceso':
      return <Wrench className="h-4 w-4" />
    case 'completado':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelado':
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/orders?page=1&limit=5', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data.data.orders)
        } else {
          // Datos mock si la API no responde
          // Datos vacíos si la API no responde
          setOrders([])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        // Fallback a datos mock
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Recientes</CardTitle>
          <CardDescription>Últimas órdenes de servicio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`
    } else if (diffInMinutes < 1440) {
      return `Hace ${Math.floor(diffInMinutes / 60)} h`
    } else {
      return date.toLocaleDateString('es-CO')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Órdenes Recientes</CardTitle>
          <CardDescription>Últimas órdenes de servicio</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">
            Ver todas <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No hay órdenes recientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={order.id}>
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div
                    className={`rounded-full p-2 ${
                      statusColors[order.estado as keyof typeof statusColors]
                    }`}
                  >
                    <StatusIcon status={order.estado} />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {order.numeroOrden} - {order.nombre}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`${
                          statusColors[
                            order.estado as keyof typeof statusColors
                          ]
                        } text-xs`}
                      >
                        {
                          statusLabels[
                            order.estado as keyof typeof statusLabels
                          ]
                        }
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {order.tipoElectrodomestico} - {order.tipoServicio}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {order.ciudad}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {order.telefono}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-medium ${
                              urgencyColors[
                                order.urgencia as keyof typeof urgencyColors
                              ]
                            }`}
                          >
                            {order.urgencia.toUpperCase()}
                          </span>
                          <span>•</span>
                          <span>{formatTime(order.createdAt)}</span>
                        </div>
                      </div>

                      {order.assignment && (
                        <div className="flex items-center text-blue-600">
                          <Wrench className="mr-1 h-3 w-3" />
                          Técnico: {order.assignment.technician.nombre}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>Ver</Link>
                  </Button>
                </div>

                {index < orders.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
