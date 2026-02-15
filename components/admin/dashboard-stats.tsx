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
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStats = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true)
      }
      setError(null)

      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
        setLastUpdate(new Date())
      } else {
        throw new Error('Error al obtener estadísticas')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('No se pudieron cargar las estadísticas')

      // Si no hay datos previos, inicializar en ceros
      if (!stats) {
        setStats({
          ordenes: { total: 0, pendientes: 0, asignadas: 0, enProceso: 0, completadasHoy: 0, completadasMes: 0, vencidas: 0, urgentes: 0 },
          tecnicos: { total: 0, activos: 0, disponibles: 0, ocupados: 0 },
          negocio: { ingresosMes: 0, tasaCompletacion: 0, tiempoPromedioResolucion: 0, satisfaccionPromedio: 0 },
          alertas: { ordenesVencidas: 0, ordenesUrgentes: 0 },
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Carga inicial
    fetchStats()

    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      fetchStats(true)
    }, 30000)

    return () => clearInterval(interval)
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

  if (!stats) return null // Shouldn't happen due to default init

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Indicador de última actualización */}
      {lastUpdate && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}
          </span>
          <button
            onClick={() => fetchStats(true)}
            className="hover:text-foreground transition-colors flex items-center gap-1"
            disabled={loading}
          >
            <TrendingUp className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      )}

      {/* Mensaje de error si existe */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

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
             Histórico total
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
          <p className="text-xs text-muted-foreground">Nuevas hoy</p>
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
      <Card key="avg-time">
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
    </div>
  )
}
