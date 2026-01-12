/**
 * Página Principal de Reportes - Panel Admin
 * Selección de tipos de reportes disponibles
 */

'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  ClipboardList,
  TrendingUp,
  Calendar,
  PieChart,
  BarChart3,
  FileText,
  Target,
} from 'lucide-react'

const reportTypes = [
  {
    title: 'Reportes de Técnicos',
    description: 'Rendimiento, calificaciones y estadísticas de técnicos',
    icon: Users,
    href: '/admin/reports/technicians',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Reportes de Órdenes',
    description: 'Análisis de órdenes de servicio y tendencias',
    icon: ClipboardList,
    href: '/admin/reports/orders',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Reportes Financieros',
    description: 'Ingresos, gastos y análisis financiero',
    icon: TrendingUp,
    href: '/admin/reports/financial',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  {
    title: 'Reportes Mensuales',
    description: 'Resúmenes y estadísticas mensuales',
    icon: Calendar,
    href: '/admin/reports/monthly',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Análisis de Rendimiento',
    description: 'KPIs y métricas de rendimiento general',
    icon: Target,
    href: '/admin/reports/performance',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'Reportes Personalizados',
    description: 'Crear reportes a medida con filtros específicos',
    icon: FileText,
    href: '/admin/reports/custom',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
]

const quickStats = [
  {
    title: 'Órdenes Este Mes',
    value: '127',
    change: '+12%',
    changeType: 'positive',
    icon: ClipboardList,
  },
  {
    title: 'Ingresos Este Mes',
    value: '$42,350',
    change: '+8%',
    changeType: 'positive',
    icon: TrendingUp,
  },
  {
    title: 'Satisfacción Cliente',
    value: '4.8/5',
    change: '+0.3',
    changeType: 'positive',
    icon: Target,
  },
  {
    title: 'Técnicos Activos',
    value: '12',
    change: '0',
    changeType: 'neutral',
    icon: Users,
  },
]

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Reportes y Análisis
        </h2>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}
              >
                {stat.change} vs mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div>
        <h3 className="text-lg font-medium mb-4">Tipos de Reportes</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report, index) => (
            <Card
              key={index}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {report.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href={report.href}>Ver Reporte</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Reporte mensual generado</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Nuevo técnico agregado al sistema
                </p>
                <p className="text-xs text-muted-foreground">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Actualización de datos financieros
                </p>
                <p className="text-xs text-muted-foreground">Ayer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
