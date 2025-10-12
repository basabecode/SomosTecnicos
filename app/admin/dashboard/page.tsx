/**
 * Dashboard Principal del Panel Administrativo
 * Vista general con estadísticas, órdenes recientes y estado de técnicos
 */

import { Suspense } from 'react'
import { ProtectedRoute } from '@/contexts/auth-context'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentOrders } from '@/components/admin/recent-orders'
import { TechnicianStatus } from '@/components/admin/technician-status'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react'

// Componente de carga para las estadísticas
function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente de carga para las tarjetas
function CardLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2"></div>
        <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
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

// Componente de actividad reciente
function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Tareas comunes del sistema</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Button className="h-20 flex-col gap-2" variant="outline">
          <ShoppingCart className="h-6 w-6" />
          <span>Nueva Orden</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Users className="h-6 w-6" />
          <span>Asignar Técnico</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Calendar className="h-6 w-6" />
          <span>Programar Servicio</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <TrendingUp className="h-6 w-6" />
          <span>Ver Reportes</span>
        </Button>
      </CardContent>
    </Card>
  )
}

// Alertas del sistema
function SystemAlerts() {
  const alerts = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Órdenes Pendientes',
      message: '12 órdenes esperando asignación de técnico',
      action: 'Asignar Técnicos',
    },
    {
      type: 'info',
      icon: Clock,
      title: 'Servicios Programados',
      message: '8 servicios programados para hoy',
      action: 'Ver Calendario',
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Objetivo Mensual',
      message: '85% del objetivo de ingresos alcanzado',
      action: 'Ver Detalles',
    },
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-orange-600'
      case 'info':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas del Sistema</CardTitle>
        <CardDescription>Notificaciones importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alert.icon
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    className={`h-5 w-5 mt-0.5 ${getIconColor(alert.type)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    {alert.action}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute
      requiredRoles={['super_admin', 'admin', 'technician_manager']}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Resumen general del sistema de servicio técnico
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="mr-1 h-3 w-3" />
              Sistema Operativo
            </Badge>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <Suspense fallback={<StatsLoading />}>
          <DashboardStats />
        </Suspense>

        {/* Grid Principal */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Órdenes Recientes */}
          <div className="lg:col-span-2">
            <Suspense fallback={<CardLoading />}>
              <RecentOrders />
            </Suspense>
          </div>

          {/* Estado de Técnicos */}
          <div>
            <Suspense fallback={<CardLoading />}>
              <TechnicianStatus />
            </Suspense>
          </div>
        </div>

        {/* Fila Inferior */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Acciones Rápidas */}
          <QuickActions />

          {/* Alertas del Sistema */}
          <SystemAlerts />
        </div>
      </div>
    </ProtectedRoute>
  )
}
