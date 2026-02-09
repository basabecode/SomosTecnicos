'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  ClipboardList,
  TrendingUp,
  Calendar,
  PieChart,
  Target,
  FileText,
} from 'lucide-react'

// Tipos de reportes disponibles
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

export default function ReportsPage() {
  const [stats, setStats] = useState({
    ordenesMes: 0,
    ingresosMes: 0,
    satisfaccion: 0,
    tecnicosActivos: 0
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
          if (data.data) {
            setStats({
              ordenesMes: data.data.ordenes?.completadasMes || 0,
              ingresosMes: data.data.negocio?.ingresosMes || 0,
              satisfaccion: data.data.negocio?.satisfaccionPromedio || 0,
              tecnicosActivos: data.data.tecnicos?.activos || 0
            })
          }
        }
      } catch (error) {
        console.error('Error fetching report stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const quickStats = [
    {
      title: 'Órdenes Este Mes',
      value: loading ? '...' : stats.ordenesMes.toString(),
      icon: ClipboardList,
    },
    {
      title: 'Ingresos Este Mes',
      value: loading ? '...' : formatCurrency(stats.ingresosMes),
      icon: TrendingUp,
    },
    {
      title: 'Satisfacción Cliente',
      value: loading ? '...' : `${Number(stats.satisfaccion).toFixed(1)}/5`,
      icon: Target,
    },
    {
      title: 'Técnicos Activos',
      value: loading ? '...' : stats.tecnicosActivos.toString(),
      icon: Users,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
          Reportes y Análisis
        </h2>
      </div>

      {/* Quick Stats */}
      {/* Quick Stats - Scrollable on mobile */}
      <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide snap-x">
        {quickStats.map((stat, index) => (
          <Card key={index} className="min-w-[200px] md:min-w-0 snap-start flex-shrink-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div>
        <h3 className="text-lg font-medium mb-4">Tipos de Reportes</h3>
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide snap-x">
          {reportTypes.map((report, index) => (
            <Card
              key={index}
              className="group hover:shadow-md transition-shadow min-w-[260px] md:min-w-0 snap-start flex-shrink-0"
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
    </div>
  )
}
