/**
 * Componente de Estadísticas del Técnico con Auto-refresh
 * Muestra métricas personales del técnico
 */

'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Wrench,
  MapPin,
  Clock,
  CheckCircle,
  TrendingUp,
  Star,
} from 'lucide-react'

interface TechnicianStats {
  pending: number
  inProgress: number
  completedToday: number
  completedWeek: number
  completedMonth: number
  averageRating: number
  totalCompleted: number
  zona: string
}

export function TechnicianStatsCards() {
  const [stats, setStats] = useState<TechnicianStats | null>(null)
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
      const response = await fetch('/api/technicians/me/stats', {
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
      console.error('Error fetching technician stats:', error)
      setError('No se pudieron cargar las estadísticas')

      // Si no hay datos previos, inicializar en ceros
      if (!stats) {
        setStats({
          pending: 0,
          inProgress: 0,
          completedToday: 0,
          completedWeek: 0,
          completedMonth: 0,
          averageRating: 0,
          totalCompleted: 0,
          zona: 'Sin asignar'
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

  if (loading && !stats) {
    return (
      <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide snap-x">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="min-w-40 md:min-w-0 snap-start shrink-0">
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

  if (!stats) return null

  return (
    <div className="space-y-2">
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

      <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide snap-x">
        {/* Pendientes */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.pending}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Por iniciar hoy
            </p>
          </CardContent>
        </Card>

        {/* En Progreso */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              En Progreso
            </CardTitle>
            <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Servicios activos
            </p>
          </CardContent>
        </Card>

        {/* Completados */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Finalizados hoy</p>
          </CardContent>
        </Card>

        {/* Zona */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Zona</CardTitle>
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-lg font-bold truncate">{stats.zona}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Área de cobertura
            </p>
          </CardContent>
        </Card>

        {/* Calificación */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Calificación</CardTitle>
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.averageRating.toFixed(1)} ⭐
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Promedio</p>
          </CardContent>
        </Card>

        {/* Total Completados */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Servicios completados</p>
          </CardContent>
        </Card>

        {/* Completados Semana */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Esta Semana</CardTitle>
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.completedWeek}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Últimos 7 días</p>
          </CardContent>
        </Card>

        {/* Completados Mes */}
        <Card className="min-w-40 md:min-w-0 snap-start shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Este Mes</CardTitle>
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.completedMonth}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Últimos 30 días</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

