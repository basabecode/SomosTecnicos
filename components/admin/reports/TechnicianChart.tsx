/**
 * 👷 TecnoCity - Gráfico de Rendimiento de Técnicos
 * ===============================================
 *
 * Componente para mostrar métricas de performance de técnicos
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts'
import { Users, Star, Clock, TrendingUp } from 'lucide-react'
import {
  TechnicianPerformance,
  formatCurrency,
  formatResponseTime,
  CHART_COLORS,
} from './types'

// =============================================
// PROPS INTERFACE
// =============================================

interface TechnicianChartProps {
  data: TechnicianPerformance[]
  loading?: boolean
  chartType?: 'bar' | 'scatter' | 'table'
  metric?: 'jobs' | 'earnings' | 'rating' | 'efficiency'
}

// =============================================
// TOOLTIP PERSONALIZADO
// =============================================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{data.name}</p>
        <div className="space-y-1 text-sm">
          <p>
            Trabajos completados:{' '}
            <span className="font-medium">{data.completedJobs}</span>
          </p>
          <p>
            Calificación:{' '}
            <span className="font-medium">
              {data.averageRating.toFixed(1)}/5.0
            </span>
          </p>
          <p>
            Ingresos:{' '}
            <span className="font-medium">
              {formatCurrency(data.totalEarnings)}
            </span>
          </p>
          <p>
            Eficiencia:{' '}
            <span className="font-medium">{data.efficiency.toFixed(1)}%</span>
          </p>
          <p>
            Tiempo respuesta:{' '}
            <span className="font-medium">
              {formatResponseTime(data.responseTime)}
            </span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

// =============================================
// COMPONENTE DE TABLA DE TÉCNICOS
// =============================================

const TechniciansTable = ({ data }: { data: TechnicianPerformance[] }) => (
  <div className="space-y-3">
    {data.map((tech, index) => (
      <div
        key={tech.id}
        className="flex items-center justify-between p-3 border rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              #{index + 1}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {tech.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <p className="font-medium text-sm">{tech.name}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{tech.completedJobs} trabajos</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {tech.averageRating.toFixed(1)}
              </span>
              <span>{formatResponseTime(tech.responseTime)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">
              {formatCurrency(tech.totalEarnings)}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  tech.efficiency >= 95
                    ? 'default'
                    : tech.efficiency >= 85
                    ? 'secondary'
                    : 'outline'
                }
                className="text-xs"
              >
                {tech.efficiency.toFixed(1)}% eficiencia
              </Badge>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export function TechnicianChart({
  data,
  loading = false,
  chartType = 'bar',
  metric = 'jobs',
}: TechnicianChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Rendimiento de Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Cargando datos de técnicos...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ordenar datos según la métrica seleccionada
  const sortedData = [...data].sort((a, b) => {
    switch (metric) {
      case 'earnings':
        return b.totalEarnings - a.totalEarnings
      case 'rating':
        return b.averageRating - a.averageRating
      case 'efficiency':
        return b.efficiency - a.efficiency
      default:
        return b.completedJobs - a.completedJobs
    }
  })

  const getMetricLabel = () => {
    switch (metric) {
      case 'earnings':
        return 'Ingresos por Técnico'
      case 'rating':
        return 'Calificación Promedio'
      case 'efficiency':
        return 'Eficiencia por Técnico'
      default:
        return 'Trabajos Completados'
    }
  }

  const getMetricValue = (tech: TechnicianPerformance) => {
    switch (metric) {
      case 'earnings':
        return tech.totalEarnings
      case 'rating':
        return tech.averageRating
      case 'efficiency':
        return tech.efficiency
      default:
        return tech.completedJobs
    }
  }

  const chartData = sortedData.map(tech => ({
    ...tech,
    value: getMetricValue(tech),
    shortName: tech.name.split(' ')[0], // Solo primer nombre para el eje X
  }))

  const renderBarChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis
            dataKey="shortName"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  const renderScatterChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis
            type="number"
            dataKey="completedJobs"
            name="Trabajos Completados"
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            type="number"
            dataKey="averageRating"
            name="Calificación"
            domain={[4.0, 5.0]}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={chartData} fill={CHART_COLORS[1]} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )

  // Calcular estadísticas del equipo
  const totalJobs = data.reduce((sum, tech) => sum + tech.completedJobs, 0)
  const avgRating =
    data.reduce((sum, tech) => sum + tech.averageRating, 0) / data.length
  const topPerformer = sortedData[0]
  const avgEfficiency =
    data.reduce((sum, tech) => sum + tech.efficiency, 0) / data.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {getMetricLabel()}
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {data.length} técnicos
            </Badge>
            <Badge variant="outline" className="text-xs">
              ⭐ {avgRating.toFixed(1)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartType === 'table' ? (
          <TechniciansTable data={sortedData} />
        ) : chartType === 'scatter' ? (
          renderScatterChart()
        ) : (
          renderBarChart()
        )}

        {/* Estadísticas del equipo */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold">{totalJobs}</p>
            <p className="text-xs text-muted-foreground">Total trabajos</p>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
            <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">
              Calificación promedio
            </p>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold">{avgEfficiency.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Eficiencia promedio</p>
          </div>

          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xl font-bold truncate">
              {topPerformer?.name.split(' ')[0]}
            </p>
            <p className="text-xs text-muted-foreground">Top performer</p>
          </div>
        </div>

        {/* Insight del top performer */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{topPerformer?.name}</span> lidera con{' '}
            <span className="font-medium">
              {topPerformer?.completedJobs} trabajos completados
            </span>
            ,{' '}
            <span className="font-medium">
              {topPerformer?.efficiency.toFixed(1)}% de eficiencia
            </span>{' '}
            y{' '}
            <span className="font-medium">
              {topPerformer?.averageRating.toFixed(1)}/5 de calificación
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
