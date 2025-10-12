/**
 * Dashboard Principal del Cliente
 * Vista general de servicios y promociones
 */

'use client'

import { type ComponentType, type SVGProps } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import OrderTrackingDashboard from '@/components/dashboard/order-tracking-dashboard'
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
} from 'lucide-react'

// Tipos para el estado de servicios
type ServiceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

interface ActiveService {
  id: string
  type: string
  status: ServiceStatus
  technician: string
  technicianPhone: string
  scheduledDate: string
  estimatedDuration: string
  address: string
  description: string
  progress?: number
  lastUpdate?: string
}

// Mock data para servicios activos
const activeServices: ActiveService[] = [
  {
    id: 'SRV-001',
    type: 'Reparación Lavadora',
    status: 'in_progress',
    technician: 'Juan Pérez',
    technicianPhone: '+57 300 123 4567',
    scheduledDate: '2025-10-07T14:00:00',
    estimatedDuration: '2 horas',
    address: 'Calle 123 #45-67, Bogotá Norte',
    description: 'Lavadora no centrifuga correctamente',
    progress: 75,
    lastUpdate: '2025-10-07T13:30:00',
  },
  {
    id: 'SRV-002',
    type: 'Mantenimiento Aire Acondicionado',
    status: 'scheduled',
    technician: 'Ana López',
    technicianPhone: '+57 300 234 5678',
    scheduledDate: '2025-10-08T09:00:00',
    estimatedDuration: '1.5 horas',
    address: 'Calle 123 #45-67, Bogotá Norte',
    description: 'Mantenimiento preventivo programado',
  },
]

// Mock data para historial reciente
const recentServices = [
  {
    id: 'SRV-098',
    type: 'Reparación Refrigerador',
    completedDate: '2025-09-25T16:30:00',
    technician: 'Carlos Ruiz',
    rating: 5,
    cost: 150000,
    warrantyExpires: '2025-12-24T16:30:00',
  },
  {
    id: 'SRV-097',
    type: 'Instalación Lavaplatos',
    completedDate: '2025-09-10T11:45:00',
    technician: 'Juan Pérez',
    rating: 4,
    cost: 95000,
    warrantyExpires: '2025-12-09T11:45:00',
  },
]

// Promociones y publicidad
const promotions = [
  {
    id: 'promo-1',
    title: '20% OFF en Mantenimientos',
    description: 'Descuento especial en mantenimientos preventivos',
    discount: 20,
    validUntil: '2025-10-31',
    image: '/placeholder.jpg',
    category: 'Mantenimiento',
  },
  {
    id: 'promo-2',
    title: 'Electrodomésticos Samsung',
    description: 'Nueva línea de electrodomésticos con garantía extendida',
    discount: 15,
    validUntil: '2025-11-15',
    image: '/placeholder.jpg',
    category: 'Productos',
  },
  {
    id: 'promo-3',
    title: 'Plan de Mantenimiento Anual',
    description: 'Contrata el plan anual y ahorra hasta 30%',
    discount: 30,
    validUntil: '2025-12-31',
    image: '/placeholder.jpg',
    category: 'Planes',
  },
]

const statusColors: Record<ServiceStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

type StatusIconComponent = ComponentType<SVGProps<SVGSVGElement>>

const statusIcons: Record<ServiceStatus, StatusIconComponent> = {
  scheduled: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  cancelled: AlertCircle,
}

export default function CustomerDashboard() {
  const isWarrantyActive = (expiryDate: string) => {
    return new Date(expiryDate) > new Date()
  }

  const getWarrantyDaysLeft = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            ¡Hola, María! 👋
          </h1>
          <p className="text-muted-foreground">
            Bienvenida a tu portal de servicios TecnoCity
          </p>
        </div>
        <Button asChild>
          <Link href="/customer/request">
            <Plus className="w-4 h-4 mr-2" />
            Solicitar Servicio
          </Link>
        </Button>
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
            <p className="text-xs text-muted-foreground">En progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Servicios
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Desde marzo 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= 4.8
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Garantías Activas
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                recentServices.filter(s => isWarrantyActive(s.warrantyExpires))
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">90 días cada una</p>
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
            </CardHeader>
            <CardContent>
              {activeServices.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No tienes servicios activos
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/customer/request">Solicitar Servicio</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeServices.map(service => {
                    const StatusIcon = statusIcons[service.status]
                    return (
                      <div key={service.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{service.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {service.id}
                            </p>
                          </div>
                          <Badge className={statusColors[service.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {service.status === 'scheduled' && 'Programado'}
                            {service.status === 'in_progress' && 'En Progreso'}
                            {service.status === 'completed' && 'Completado'}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>Técnico: {service.technician}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {new Date(
                                service.scheduledDate
                              ).toLocaleDateString()}{' '}
                              -{' '}
                              {new Date(
                                service.scheduledDate
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{service.address}</span>
                          </div>
                        </div>

                        <p className="text-sm mt-2">{service.description}</p>

                        {service.progress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progreso</span>
                              <span>{service.progress}%</span>
                            </div>
                            <Progress
                              value={service.progress}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-1" />
                            Llamar Técnico
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Mensajes
                          </Button>
                          <Button variant="outline" size="sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            Rastrear
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Services & Warranty */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Servicios Recientes y Garantías</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentServices.map(service => {
                  const warrantyActive = isWarrantyActive(
                    service.warrantyExpires
                  )
                  const daysLeft = getWarrantyDaysLeft(service.warrantyExpires)

                  return (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{service.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= service.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm">({service.rating})</span>
                          </div>
                          <p className="text-sm font-medium">
                            ${service.cost.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Completado:{' '}
                            {new Date(
                              service.completedDate
                            ).toLocaleDateString()}
                          </p>
                          <p>Técnico: {service.technician}</p>
                        </div>

                        <div className="text-right">
                          {warrantyActive ? (
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-green-500" />
                              <div className="text-sm">
                                <p className="text-green-600 font-medium">
                                  Garantía Activa
                                </p>
                                <p className="text-muted-foreground">
                                  {daysLeft} días restantes
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-gray-400" />
                              <div className="text-sm">
                                <p className="text-muted-foreground">
                                  Garantía Expirada
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Nuevo Servicio
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {warrantyActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Reclamar Garantía
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Promotions & Ads */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/customer/request">
                  <Plus className="w-4 h-4 mr-2" />
                  Solicitar Servicio
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/customer/warranty">
                  <Shield className="w-4 h-4 mr-2" />
                  Reclamar Garantía
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/customer/messages">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mensajes
                </Link>
              </Button>
            </CardContent>
          </Card>

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
                        {promo.category === 'Mantenimiento' && (
                          <Zap className="w-6 h-6 text-primary" />
                        )}
                        {promo.category === 'Productos' && (
                          <ShoppingCart className="w-6 h-6 text-primary" />
                        )}
                        {promo.category === 'Planes' && (
                          <Calendar className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-sm">
                            {promo.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            <Percent className="w-3 h-3 mr-1" />
                            {promo.discount}% OFF
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {promo.description}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Válido hasta:{' '}
                          {new Date(promo.validUntil).toLocaleDateString()}
                        </p>
                        <Button size="sm" className="w-full">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Ver Oferta
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Productos Destacados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <img
                    src="/placeholder.jpg"
                    alt="Lavadora Samsung"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-sm mb-1">
                    Lavadora Samsung 20kg
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Tecnología EcoBubble con garantía extendida
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">$1,299,000</span>
                    <Button size="sm">Ver Más</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <img
                    src="/placeholder.jpg"
                    alt="Aire Acondicionado LG"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-sm mb-1">
                    Aire Acondicionado LG Inverter
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Ahorro energético con instalación incluida
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">$899,000</span>
                    <Button size="sm">Ver Más</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
