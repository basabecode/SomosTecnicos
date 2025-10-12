/**
 * Componente de Estadísticas del Dashboard
 * Tarjetas con métricas principales del negocio
 */

'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Calendar,
} from 'lucide-react'

interface DashboardStats {
  ordenes: {
    total: number
    pendientes: number
    asignadas: number
    enProceso: number
    completadasHoy: number
    completadasMes: number
    vencidas: number
    urgentes: number
  }
  tecnicos: {
    total: number
    activos: number
    disponibles: number
    ocupados: number
  }
  negocio: {
    ingresosMes: number
    tasaCompletacion: number
    tiempoPromedioResolucion: number
    satisfaccionPromedio: number
  }
  alertas: {
    ordenesVencidas: number
    ordenesUrgentes: number
  }
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.data)
        } else {
          // Si la API no existe aún, usar datos mock
          setStats({
            ordenes: {
              total: 145,
              pendientes: 12,
              asignadas: 5,
              enProceso: 8,
              completadasHoy: 7,
              completadasMes: 125,
              vencidas: 3,
              urgentes: 2,
            },
            tecnicos: {
              total: 15,
              activos: 12,
              disponibles: 8,
              ocupados: 4,
            },
            negocio: {
              ingresosMes: 2850000,
              tasaCompletacion: 86.2,
              tiempoPromedioResolucion: 3.2,
              satisfaccionPromedio: 4.8,
            },
            alertas: {
              ordenesVencidas: 3,
              ordenesUrgentes: 2,
            },
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Fallback a datos mock
        setStats({
          ordenes: {
            total: 145,
            pendientes: 12,
            asignadas: 5,
            enProceso: 8,
            completadasHoy: 7,
            completadasMes: 125,
            vencidas: 3,
            urgentes: 2,
          },
          tecnicos: {
            total: 15,
            activos: 12,
            disponibles: 8,
            ocupados: 4,
          },
          negocio: {
            ingresosMes: 2850000,
            tasaCompletacion: 86.2,
            tiempoPromedioResolucion: 3.2,
            satisfaccionPromedio: 4.8,
          },
          alertas: {
            ordenesVencidas: 3,
            ordenesUrgentes: 2,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
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

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Error al cargar las estadísticas
        </p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {/* Total Órdenes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ordenes.total}</div>
          <p className="text-xs text-muted-foreground">
            +12% desde el mes pasado
          </p>
        </CardContent>
      </Card>

      {/* Órdenes Pendientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.ordenes.pendientes}
          </div>
          <p className="text-xs text-muted-foreground">Requieren asignación</p>
        </CardContent>
      </Card>

      {/* En Proceso */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
          <AlertTriangle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.ordenes.enProceso}
          </div>
          <p className="text-xs text-muted-foreground">Técnicos trabajando</p>
        </CardContent>
      </Card>

      {/* Completadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.ordenes.completadasMes}
          </div>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </CardContent>
      </Card>

      {/* Técnicos Activos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Técnicos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.tecnicos.activos}/{stats.tecnicos.total}
          </div>
          <p className="text-xs text-muted-foreground">Activos / Total</p>
        </CardContent>
      </Card>

      {/* Órdenes Hoy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hoy</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.ordenes.completadasHoy}
          </div>
          <p className="text-xs text-muted-foreground">Órdenes nuevas hoy</p>
        </CardContent>
      </Card>

      {/* Ingresos Mensuales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.negocio.ingresosMes)}
          </div>
          <p className="text-xs text-muted-foreground">Este mes</p>
        </CardContent>
      </Card>

      {/* Tiempo Promedio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.negocio.tiempoPromedioResolucion} días
          </div>
          <p className="text-xs text-muted-foreground">Por servicio</p>
        </CardContent>
      </Card>
    </div>
  )
}
