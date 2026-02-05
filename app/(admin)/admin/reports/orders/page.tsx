/**
 * Página de Reportes de Órdenes
 * Análisis detallado de las órdenes de servicio
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { RecentOrders } from '@/components/admin/recent-orders'

export default function OrderReportsPage() {
  const [stats, setStats] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0,
    enProceso: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const response = await fetch('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.ordenes) {
            setStats({
              total: data.data.ordenes.total || 0,
              completadas: data.data.ordenes.completadasMes || 0,
              pendientes: data.data.ordenes.pendientes || 0,
              enProceso: data.data.ordenes.enProceso || 0
            })
          }
        }
      } catch (error) {
        console.error('Error fetching order stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const orderStats = [
    {
      title: 'Total Órdenes',
      value: loading ? '...' : stats.total.toString(),
      description: 'Histórico total',
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completadas (Mes)',
      value: loading ? '...' : stats.completadas.toString(),
      description: 'Órdenes finalizadas este mes',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'En Proceso',
      value: loading ? '...' : stats.enProceso.toString(),
      description: 'Actualmente en atención',
      icon: AlertTriangle, // Usar AlertTriangle o Activity
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pendientes',
      value: loading ? '...' : stats.pendientes.toString(),
      description: 'En cola de atención',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  // Mock data for charts kept as placeholder until API endpoint exists
  const ordersByServiceType = [
    { type: 'Reparación de Neveras', count: 0, percentage: 0 },
    { type: 'Mantenimiento de Lavadoras', count: 0, percentage: 0 },
    { type: 'Instalación de Aires', count: 0, percentage: 0 },
    { type: 'Reparación de Estufas', count: 0, percentage: 0 },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Reporte de Órdenes</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Este Mes
          </Button>
          <Button>Exportar PDF</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Desglose por Tipo de Servicio (Placeholder) */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Órdenes por Tipo de Servicio</CardTitle>
            <CardDescription>
              Distribución de servicios (Próximamente)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Datos detallados no disponibles
            </div>
          </CardContent>
        </Card>

        {/* Alertas y Problemas Comunes (Placeholder) */}
        <Card className="col-span-4">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Problemas Frecuentes
             </CardTitle>
             <CardDescription>
                Motivos principales de cancelación (Próximamente)
             </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Análisis de problemas en desarrollo
            </div>
          </CardContent>
        </Card>
      </div>

       {/* Lista de Órdenes Recientes (Reusando componente existente) */}
       <div className="grid gap-4">
           <RecentOrders />
       </div>
    </div>
  )
}
