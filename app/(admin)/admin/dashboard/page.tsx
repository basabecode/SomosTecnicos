/**
 * Dashboard Principal del Panel Administrativo
 * Vista general con estadísticas, órdenes recientes y estado de técnicos
 */

'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/contexts/auth-context'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentOrders } from '@/components/admin/recent-orders'
import { TechnicianStatus } from '@/components/admin/technician-status'
import Link from 'next/link'
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
import { TechnicianAvailabilitySection } from '@/components/admin/technician-availability'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { DashboardActions } from '@/components/admin/dashboard-export'
import { EmptyState } from '@/components/domain'

// Componente de actividad reciente
function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Tareas comunes del sistema</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 grid-cols-2 md:gap-4">
        <Button className="h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-sm" variant="default" asChild>
          <Link href="/admin/orders">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            <span>Nueva Orden</span>
          </Link>
        </Button>
        <Button className="h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-sm" variant="outline" asChild>
            <Link href="/admin/technicians">
                <Users className="h-5 w-5 md:h-6 md:w-6" />
                <span>Asignar Técnico</span>
            </Link>
        </Button>
        <Button className="h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-sm" variant="outline" asChild>
            <Link href="/admin/orders?view=calendar">
                <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Programar Servicio</span>
                <span className="sm:hidden">Programar</span>
            </Link>
        </Button>
        <Button className="h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-sm" variant="outline" asChild>
            <Link href="/admin/reports">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Ver Reportes</span>
                <span className="sm:hidden">Reportes</span>
            </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// Alertas del sistema
function SystemAlerts() {
  const [alertsData, setAlertsData] = useState<{
    pendientes: number
    asignadas: number
    urgentes: number
    vencidas: number
    technicianApplications: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setAlertsData({
            pendientes: data.data.ordenes.pendientes,
            asignadas: data.data.ordenes.asignadas, // Usamos asignadas como proxy de "programados"
            urgentes: data.data.alertas.ordenesUrgentes,
            vencidas: data.data.alertas.ordenesVencidas,
            technicianApplications: data.data.alertas.technicianApplicationsPending
          })
        }
      } catch (error) {
        console.error('Error fetching alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas del Sistema</CardTitle>
          <CardDescription>Cargando notificaciones...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg"></div>
             ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si no hay datos, mostrar estado vacío o datos por defecto seguros
  const data = alertsData || { pendientes: 0, asignadas: 0, urgentes: 0, vencidas: 0, technicianApplications: 0 }

  const alerts = [
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Órdenes Pendientes',
      message: `${data.pendientes} órdenes esperando asignación de técnico`,
      action: 'Asignar Técnicos',
      href: '/admin/orders?status=pendiente',
      show: data.pendientes > 0
    },
    {
      type: 'info',
      icon: Users,
      title: 'Solicitudes de Técnicos',
      message: `${data.technicianApplications} técnicos esperando aprobación`,
      action: 'Revisar',
      href: '/admin/applications?estado=pendiente',
      show: data.technicianApplications > 0
    },
    {
      type: 'critical',
      icon: AlertTriangle,
      title: 'Órdenes Urgentes/Vencidas',
      message: `${data.urgentes} urgentes y ${data.vencidas} vencidas`,
      action: 'Atender Ahora',
      href: '/admin/orders?urgency=alta',
      show: data.urgentes > 0 || data.vencidas > 0
    },
    {
      type: 'info',
      icon: Clock,
      title: 'Servicios Asignados',
      message: `${data.asignadas} servicios en cola de atención`,
      action: 'Ver Calendario',
      href: '/admin/orders?status=asignado',
      show: true
    },
  ].filter(a => a.show)

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50'
      case 'critical':
        return 'border-red-200 bg-red-50'
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
      case 'critical':
        return 'text-red-600'
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
        <CardDescription>Notificaciones importantes en tiempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <EmptyState variant="no-results" className="p-4" />
          ) : (
            alerts.map((alert, index) => {
              const Icon = alert.icon
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <Icon
                      className={`h-5 w-5 shrink-0 ${getIconColor(alert.type)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {alert.message}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs w-full sm:w-auto" asChild>
                      <Link href={alert.href}>
                        {alert.action}
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })
          )}
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
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header - Responsive */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Resumen general del sistema de servicio técnico
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DashboardActions />
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs md:text-sm">
              <CheckCircle className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Sistema Operativo</span>
              <span className="sm:hidden">Activo</span>
            </Badge>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <DashboardStats />

        {/* Grid Principal */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {/* Órdenes Recientes */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <RecentOrders />
          </div>

          {/* Estado de Técnicos */}
          <div className="order-1 lg:order-2">
            <TechnicianStatus />
          </div>
        </div>

        {/* Panel de Asignación / Mapa de Técnicos */}
            <TechnicianAvailabilitySection />

        {/* Gráficos y Visualizaciones */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Analíticas y Tendencias</h2>
            <p className="text-sm text-muted-foreground">
              Visualización de datos y métricas del sistema
            </p>
          </div>
          <DashboardCharts />
        </div>

        {/* Fila Inferior */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {/* Acciones Rápidas */}
          <QuickActions />

          {/* Alertas del Sistema */}
          <SystemAlerts />
        </div>
      </div>
    </ProtectedRoute>
  )
}

