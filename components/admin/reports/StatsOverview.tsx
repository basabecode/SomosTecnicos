/**
 * 📊 SomosTécnicos - Tarjetas de Estadísticas Resumidas
 * ===============================================
 *
 * Componente para mostrar métricas clave en formato de tarjetas
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  DollarSign,
} from 'lucide-react'
import { ReportData, formatCurrency, formatPercentage } from './types'

// =============================================
// PROPS INTERFACE
// =============================================

interface StatsOverviewProps {
  data: ReportData['monthlyStats']
  loading?: boolean
}

// =============================================
// COMPONENTE DE MÉTRICA INDIVIDUAL
// =============================================

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  format?: 'number' | 'currency' | 'percentage'
  description?: string
}

function MetricCard({
  title,
  value,
  change,
  icon,
  format = 'number',
  description,
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val

    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return formatPercentage(val)
      default:
        return val.toLocaleString('es-CO')
    }
  }

  const getTrendIcon = () => {
    if (change === undefined) return null
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getTrendColor = () => {
    if (change === undefined) return 'text-muted-foreground'
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{formatValue(value)}</div>

          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span>
                {change > 0 ? '+' : ''}
                {formatPercentage(change)}
              </span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export function StatsOverview({ data, loading = false }: StatsOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calcular métricas derivadas
  const completionRate =
    data.totalOrders > 0 ? (data.completedOrders / data.totalOrders) * 100 : 0

  const cancellationRate =
    data.totalOrders > 0
      ? ((data.cancelledOrders || 0) / data.totalOrders) * 100
      : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* 📊 Total de Órdenes */}
      <MetricCard
        title="Total de Órdenes"
        value={data.totalOrders}
        change={data.growth}
        icon={<ShoppingBag className="h-4 w-4" />}
        description="Este mes"
      />

      {/* ✅ Órdenes Completadas */}
      <MetricCard
        title="Órdenes Completadas"
        value={data.completedOrders}
        icon={<CheckCircle className="h-4 w-4" />}
        description={`${formatPercentage(completionRate)} de tasa de éxito`}
      />

      {/* ⏰ Órdenes Activas */}
      <MetricCard
        title="Órdenes Activas"
        value={data.activeOrders}
        icon={<Clock className="h-4 w-4" />}
        description="En proceso actualmente"
      />

      {/* 💰 Ingresos Totales */}
      <MetricCard
        title="Ingresos Totales"
        value={data.totalRevenue}
        change={data.growth}
        icon={<DollarSign className="h-4 w-4" />}
        format="currency"
        description="Este mes"
      />
    </div>
  )
}

// =============================================
// COMPONENTE DE MÉTRICAS SECUNDARIAS
// =============================================

interface SecondaryStatsProps {
  data: ReportData['monthlyStats']
  loading?: boolean
}

export function SecondaryStats({ data, loading = false }: SecondaryStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const completionRate =
    data.totalOrders > 0 ? (data.completedOrders / data.totalOrders) * 100 : 0

  const cancellationRate =
    data.totalOrders > 0
      ? ((data.cancelledOrders || 0) / data.totalOrders) * 100
      : 0

  const avgRevenuePerOrder =
    data.completedOrders > 0 ? data.totalRevenue / data.completedOrders : 0

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      {/* ⭐ Calificación Promedio */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Calificación Promedio
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {data.averageRating.toFixed(1)}
                </span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <Badge
              variant={data.averageRating >= 4.5 ? 'default' : 'secondary'}
            >
              {data.averageRating >= 4.5
                ? 'Excelente'
                : data.averageRating >= 4.0
                ? 'Bueno'
                : 'Regular'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 📈 Tasa de Finalización */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Tasa de Finalización
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {formatPercentage(completionRate)}
                </span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <Badge variant={completionRate >= 85 ? 'default' : 'secondary'}>
              {completionRate >= 85
                ? 'Óptimo'
                : completionRate >= 70
                ? 'Bueno'
                : 'Mejorable'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 💰 Ingreso Promedio por Orden */}
      <Card>
        <CardContent className="p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Ingreso Promedio/Orden
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {formatCurrency(avgRevenuePerOrder)}
              </span>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Basado en {data.completedOrders} órdenes completadas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
