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
import { ServiceTimeline, NoHistoryEmptyState } from '@/components/domain'
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
type ServiceStatus = 'pendiente' | 'asignado' | 'en_camino' | 'en_proceso' | 'revisado' | 'cotizado' | 'esperando_repuestos' | 'reparado' | 'entregado' | 'completado' | 'cancelado' | 'reagendado'

interface VisitReportData {
  id: number
  diagnostico: string
  resultado: string
  costoVisita: number
  costoReparacion?: number
  costoRepuestos?: number
  costoTotal: number
  repuestos?: Array<{ nombre: string; cantidad: number; costoEstimado: number }>
  recomendaciones?: string
  createdAt: string
}

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
  fechaCompletado?: string
  assignments: {
    estado: string
    technician: {
      nombre: string
      telefono: string
    }
  }[]
  visitReports?: VisitReportData[]
  createdAt: string
}

// Promociones y publicidad
const promotions: any[] = []

const statusColors: Record<ServiceStatus, string> = {
  pendiente: 'bg-orange-100 text-orange-800',
  asignado: 'bg-blue-100 text-blue-800',
  en_camino: 'bg-indigo-100 text-indigo-800',
  en_proceso: 'bg-purple-100 text-purple-800',
  revisado: 'bg-teal-100 text-teal-800',
  cotizado: 'bg-cyan-100 text-cyan-800',
  esperando_repuestos: 'bg-amber-100 text-amber-800',
  reparado: 'bg-lime-100 text-lime-800',
  entregado: 'bg-green-100 text-green-800',
  completado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
  reagendado: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<ServiceStatus, string> = {
  pendiente: 'Pendiente',
  asignado: 'Técnico Asignado',
  en_camino: 'Técnico en Camino',
  en_proceso: 'Revisión en Curso',
  revisado: 'Diagnóstico Listo',
  cotizado: 'Cotizado',
  esperando_repuestos: 'Esperando Repuestos',
  reparado: 'Reparado',
  entregado: 'Entregado',
  completado: 'Finalizado',
  cancelado: 'Cancelado',
  reagendado: 'Reagendado',
}

type StatusIconComponent = ComponentType<SVGProps<SVGSVGElement>>

const statusIcons: Record<ServiceStatus, StatusIconComponent> = {
  pendiente: Clock,
  asignado: Users,
  en_camino: Clock,
  en_proceso: AlertCircle,
  revisado: CheckCircle,
  cotizado: CheckCircle,
  esperando_repuestos: Clock,
  reparado: CheckCircle,
  entregado: CheckCircle,
  completado: CheckCircle,
  cancelado: AlertCircle,
  reagendado: Clock,
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
  const terminalStates = ['completado', 'cancelado']
  const activeServices = orders.filter(o => !terminalStates.includes(o.estado))
  const historyServices = orders.filter(o => terminalStates.includes(o.estado))

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
           <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
           <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
     )
  }

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-8 pt-4 sm:pt-6">
      {/* Welcome Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#A50034] to-[#2C3E50] bg-clip-text text-transparent">
            ¡Hola, {user?.nombre || 'Cliente'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
            Gestiona tus reparaciones con SomosTécnicos
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchOrders} title="Recargar datos" className="h-10 w-10 sm:h-9 sm:w-9">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Servicios Activos
            </CardTitle>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{activeServices.length}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">En proceso actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Historial Total
            </CardTitle>
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Solicitudes realizadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column - Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Servicios Activos</span>
              </CardTitle>
              <CardDescription>Seguimiento de tus reparaciones en curso</CardDescription>
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
                <div className="space-y-6">
                  {activeServices.map(service => {
                    const activeAssignment = service.assignments.find(a => ['asignado', 'en_proceso', 'completado'].includes(a.estado as any)) || service.assignments[0]
                    const technician = activeAssignment?.technician

                    // Mapear estado de orden a paso del timeline
                    const stepMap: Record<string, string> = {
                      pendiente: 'pendiente',
                      asignado: 'asignado',
                      en_camino: 'en_camino',
                      en_proceso: 'en_proceso',
                      revisado: 'revisado',
                      cotizado: 'revisado',
                      esperando_repuestos: 'esperando_repuestos',
                      reparado: 'reparado',
                      entregado: 'completado',
                      completado: 'completado',
                      reagendado: 'asignado',
                    }
                    const currentStep = stepMap[service.estado] || 'pendiente'

                    // Obtener datos del visit report si existe
                    const latestReport = service.visitReports?.[0]
                    const visitReportData = latestReport ? {
                      diagnostico: latestReport.diagnostico,
                      resultado: latestReport.resultado,
                      costoTotal: Number(latestReport.costoTotal) || 0,
                      costoVisita: Number(latestReport.costoVisita) || 0,
                      repuestos: latestReport.repuestos as any,
                      recomendaciones: latestReport.recomendaciones || undefined,
                    } : undefined

                    return (
                      <div key={service.id} className="space-y-4">
                        <ServiceTimeline
                          currentStep={currentStep as any}
                          order={{
                            id: service.id,
                            orderNumber: service.orderNumber,
                            createdAt: service.createdAt,
                            technician: technician ? {
                              nombre: technician.nombre,
                              telefono: technician.telefono,
                            } : undefined,
                            estimatedArrival: service.fechaPreferida ?
                              new Date(service.fechaPreferida).toLocaleTimeString('es-CO', {
                                hour: '2-digit',
                                minute: '2-digit',
                              }) : undefined,
                            completedAt: service.fechaCompletado || undefined,
                          }}
                          visitReport={visitReportData}
                        />

                        {/* Acciones rápidas */}
                        <div className="flex gap-3">
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
                    <NoHistoryEmptyState />
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
