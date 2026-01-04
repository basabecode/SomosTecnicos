/**
 * Dashboard Principal del Cliente
 * Vista general de servicios y promociones
 */

'use client'

import { type ComponentType, type SVGProps, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import OrderTrackingDashboard from '@/components/dashboard/order-tracking-dashboard'
import { useAuth } from '@/contexts/auth-context'
import {
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Plus,
  Shield,
  Zap,
  Users,
  Gift,
  Percent,
  ShoppingCart,
  ArrowRight,
  Loader2,
  RefreshCw,
} from 'lucide-react'

// Tipos para el estado de servicios
type ServiceStatus = 'pendiente' | 'asignado' | 'en_proceso' | 'completado' | 'cancelado'

interface Order {
  id: string
  orderNumber: string
  tipoServicio: string
  estado: ServiceStatus
  fechaPreferida: string
  direccion: string
  descripcionProblema: string
  costoEstimado?: number
  costoFinal?: number
  assignments: {
    technician: {
      nombre: string
      telefono: string
    }
  }[]
  createdAt: string
}

// Promociones y publicidad (Estático por ahora, idealmente vendría de un CMS)
const promotions = [
  {
    id: 'promo-1',
    title: '20% OFF en Mantenimientos',
    description: 'Descuento especial en mantenimientos preventivos',
    discount: 20,
    validUntil: '2025-12-31',
    category: 'Mantenimiento',
  },
  {
    id: 'promo-2',
    title: 'Plan de Mantenimiento Anual',
    description: 'Contrata el plan anual y ahorra hasta 30%',
    discount: 30,
    validUntil: '2025-12-31',
    category: 'Planes',
  },
]

const statusColors: Record<ServiceStatus, string> = {
  pendiente: 'bg-orange-100 text-orange-800',
  asignado: 'bg-blue-100 text-blue-800',
  en_proceso: 'bg-purple-100 text-purple-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

const statusLabels: Record<ServiceStatus, string> = {
  pendiente: 'Pendiente',
  asignado: 'Técnico Asignado',
  en_proceso: 'En Reparación',
  completado: 'Finalizado',
  cancelado: 'Cancelado',
}

type StatusIconComponent = ComponentType<SVGProps<SVGSVGElement>>

const statusIcons: Record<ServiceStatus, StatusIconComponent> = {
  pendiente: Clock,
  asignado: Users,
  en_proceso: AlertCircle,
  completado: CheckCircle,
  cancelado: AlertCircle,
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/orders?limit=10', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
           setOrders(data.data.orders)
        } else {
           setError('Error al cargar servicios')
        }
      } else {
        setError('No se pudieron cargar los servicios')
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Filtrar servicios activos e históricos
  const activeServices = orders.filter(o => ['pendiente', 'asignado', 'en_proceso'].includes(o.estado))
  const historyServices = orders.filter(o => ['completado', 'cancelado'].includes(o.estado))

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
           <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
           <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
     )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#A50034] to-[#2C3E50] bg-clip-text text-transparent">
            ¡Hola, {user?.nombre || 'Cliente'}! 👋
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Gestiona tus reparaciones TecnoCity
          </p>
        </div>
        <div className="flex items-center gap-2">
             <Button variant="outline" size="icon" onClick={fetchOrders} title="Recargar datos">
                <RefreshCw className="h-4 w-4" />
             </Button>
            <Button asChild className="active-tap shadow-lg shadow-primary/20 bg-[#A50034] h-12 rounded-xl">
            <Link href="/customer/request">
                <Plus className="w-5 h-5 mr-2" />
                Nueva Solicitud
            </Link>
            </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Servicios Activos
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices.length}</div>
            <p className="text-xs text-muted-foreground">En proceso actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Historial Total
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Solicitudes realizadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Servicios Activos</span>
              </CardTitle>
              <CardDescription>Tus reparaciones en curso</CardDescription>
            </CardHeader>
            <CardContent>
              {activeServices.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-4">
                    No tienes servicios activos en este momento.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/customer/request">Solicitar un Técnico</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeServices.map(service => {
                    const StatusIcon = statusIcons[service.estado] || Clock
                    const technician = service.assignments[0]?.technician

                    return (
                      <div key={service.id} className="native-card p-5 bg-white/60 border border-white/20 shadow-sm transition-all active-tap rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{service.tipoServicio}</h3> // Note: type might be missing in API response if it mapped to tipoServicio
                             <p className="text-sm text-muted-foreground font-mono">
                              #{service.orderNumber}
                            </p>
                             <p className="text-sm font-medium mt-1">{service.tipoServicio}</p>
                          </div>
                          <Badge className={statusColors[service.estado]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusLabels[service.estado]}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm mt-4">
                          {technician ? (
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>Técnico: <strong>{technician.nombre}</strong></span>
                            </div>
                          ) : (
                             <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-orange-600">Esperando asignación de técnico</span>
                             </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              Fecha: {new Date(service.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="bg-muted/30 p-2 rounded text-xs text-muted-foreground">
                             {service.descripcionProblema}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                          {technician && (
                             <Button variant="secondary" size="sm" className="flex-1 rounded-xl active-tap h-9" asChild>
                                <a href={`tel:${technician.telefono?.replace(/\s+/g, '')}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                Llamar
                                </a>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="flex-1 rounded-xl active-tap h-9" asChild>
                            <Link href={`/customer/messages?orderId=${service.id}`}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Chat
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Historial Reciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
                {historyServices.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                        No hay historial de servicios finalizados.
                    </div>
                ) : (
                  <div className="space-y-4">
                    {historyServices.slice(0, 3).map(service => (
                      <div key={service.id} className="border rounded-lg p-4 flex justify-between items-center">
                         <div>
                            <p className="font-medium">{service.tipoServicio}</p>
                            <p className="text-xs text-muted-foreground">{new Date(service.createdAt).toLocaleDateString()}</p>
                         </div>
                         <Badge variant="outline">{statusLabels[service.estado]}</Badge>
                      </div>
                    ))}
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Promotions & Ads */}
        <div className="space-y-6">
          {/* Order Tracking */}
          <OrderTrackingDashboard />

          {/* Promotions & Advertising */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Ofertas Especiales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.map(promo => (
                  <div
                    key={promo.id}
                    className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-sm">
                            {promo.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {promo.description}
                        </p>
                        <Button size="sm" className="w-full" variant="secondary">
                          Ver Oferta
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
