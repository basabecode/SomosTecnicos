/**
 * Componente de Estadísticas del Dashboard
 * Tarjetas con métricas principales del negocio
 */

'use client'

import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Wrench,
} from 'lucide-react'
import { MetricCard, MetricGrid } from '@/components/layout/metric-card'

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
    fetchStats()
    const interval = setInterval(() => fetchStats(true), 30000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  if (loading) {
    return (
      <MetricGrid>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 md:p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-16 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg ml-3" />
            </div>
          </div>
        ))}
      </MetricGrid>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-4">
      {/* Indicador de última actualización */}
      {lastUpdate && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Última actualización: {lastUpdate.toLocaleTimeString('es-CO')}</span>
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

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <MetricGrid>
        <MetricCard
          title="Total Órdenes"
          value={stats.ordenes.total}
          description="Histórico total"
          icon={ShoppingCart}
          iconColor="primary"
        />
        <MetricCard
          title="Pendientes"
          value={stats.ordenes.pendientes}
          description="Requieren asignación"
          icon={Clock}
          iconColor="warning"
        />
        <MetricCard
          title="En Proceso"
          value={stats.ordenes.enProceso}
          description="Técnicos trabajando"
          icon={Wrench}
          iconColor="info"
        />
        <MetricCard
          title="Completadas"
          value={stats.ordenes.completadasMes}
          description="Este mes"
          icon={CheckCircle}
          iconColor="success"
        />
        <MetricCard
          title="Técnicos"
          value={`${stats.tecnicos.activos}/${stats.tecnicos.total}`}
          description="Activos / Total"
          icon={Users}
          iconColor="primary"
        />
        <MetricCard
          title="Hoy"
          value={stats.ordenes.completadasHoy}
          description="Completadas hoy"
          icon={Calendar}
          iconColor="success"
        />
        <MetricCard
          title="Ingresos"
          value={formatCurrency(stats.negocio.ingresosMes)}
          description="Este mes"
          icon={DollarSign}
          iconColor="success"
        />
        <MetricCard
          title="Tiempo Promedio"
          value={`${stats.negocio.tiempoPromedioResolucion} días`}
          description="Por servicio"
          icon={TrendingUp}
          iconColor="primary"
        />
      </MetricGrid>
    </div>
  )
}
