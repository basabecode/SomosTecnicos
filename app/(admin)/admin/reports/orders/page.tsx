/**
 * Página de Reportes de Órdenes
 * Análisis detallado de las órdenes de servicio
 */

'use client'

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

// Datos simulados para el reporte (idealmente vendrían de una API)
const orderStats = [
  {
    title: 'Total Órdenes',
    value: '1,245',
    description: 'Histórico total',
    icon: ClipboardList,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Completadas',
    value: '1,100',
    description: '88% de efectividad',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Canceladas',
    value: '45',
    description: '3.6% de tasa de cancelación',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    title: 'Pendientes',
    value: '100',
    description: 'En cola de atención',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
]

const ordersByServiceType = [
  { type: 'Reparación de Neveras', count: 450, percentage: 36 },
  { type: 'Mantenimiento de Lavadoras', count: 320, percentage: 25 },
  { type: 'Instalación de Aires', count: 280, percentage: 22 },
  { type: 'Reparación de Estufas', count: 195, percentage: 17 },
]

export default function OrderReportsPage() {
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
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
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
        {/* Desglose por Tipo de Servicio */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Órdenes por Tipo de Servicio</CardTitle>
            <CardDescription>
              Distribución de servicios solicitados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordersByServiceType.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas y Problemas Comunes */}
        <Card className="col-span-4">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Problemas Frecuentes
             </CardTitle>
             <CardDescription>
                Motivos principales de cancelación o retraso
             </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-orange-50 border-orange-100">
                    <h4 className="font-semibold text-orange-800 text-sm">Falta de Repuestos</h4>
                    <p className="text-xs text-orange-600 mt-1">15 órdenes retrasadas este mes por falta de stock en repuestos de neveras Samsung.</p>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 border-red-100">
                    <h4 className="font-semibold text-red-800 text-sm">Cliente Ausente</h4>
                    <p className="text-xs text-red-600 mt-1">8 visitas fallidas porque el cliente no estaba en el domicilio.</p>
                </div>
                 <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                    <h4 className="font-semibold text-blue-800 text-sm">Reprogramaciones</h4>
                    <p className="text-xs text-blue-600 mt-1">12% de las órdenes fueron reprogramadas por solicitud del cliente.</p>
                </div>
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
