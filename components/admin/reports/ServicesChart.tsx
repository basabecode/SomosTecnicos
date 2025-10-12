/**
 * 🥧 TecnoCity - Gráfico de Distribución de Servicios
 * =================================================
 *
 * Componente especializado para mostrar distribución de tipos de servicio
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { PieChartIcon } from 'lucide-react'
import {
  ServiceTypeStats,
  formatCurrency,
  getServiceColor,
  SERVICE_COLORS,
} from './types'

// =============================================
// PROPS INTERFACE
// =============================================

interface ServicesChartProps {
  data: ServiceTypeStats[]
  loading?: boolean
  chartType?: 'pie' | 'bar'
  metric?: 'count' | 'revenue' | 'satisfaction'
}

// =============================================
// TOOLTIP PERSONALIZADO PARA PIE CHART
// =============================================

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2 capitalize">
          {data.type.replace('_', ' ')}
        </p>
        <div className="space-y-1 text-sm">
          <p>
            Órdenes: <span className="font-medium">{data.count}</span>
          </p>
          <p>
            Ingresos:{' '}
            <span className="font-medium">{formatCurrency(data.revenue)}</span>
          </p>
          <p>
            Satisfacción:{' '}
            <span className="font-medium">
              {data.satisfaction.toFixed(1)}/5.0
            </span>
          </p>
          <p>
            Tiempo promedio:{' '}
            <span className="font-medium">{data.averageTime}min</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

// =============================================
// TOOLTIP PARA BAR CHART
// =============================================

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0]
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2 capitalize">{label.replace('_', ' ')}</p>
        <p style={{ color: entry.color }} className="text-sm">
          {entry.dataKey === 'revenue'
            ? formatCurrency(entry.value)
            : entry.value}
        </p>
      </div>
    )
  }
  return null
}

// =============================================
// COMPONENTE DE LEYENDA PERSONALIZADA
// =============================================

const CustomLegend = ({
  data,
  metric,
}: {
  data: ServiceTypeStats[]
  metric: string
}) => (
  <div className="grid grid-cols-2 gap-2 mt-4">
    {data.map((item, index) => (
      <div key={item.type} className="flex items-center gap-2 text-sm">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: getServiceColor(item.type) }}
        />
        <div className="flex-1 min-w-0">
          <p className="capitalize truncate">{item.type.replace('_', ' ')}</p>
          <p className="text-xs text-muted-foreground">
            {metric === 'revenue'
              ? formatCurrency(item.revenue)
              : metric === 'satisfaction'
              ? `${item.satisfaction.toFixed(1)}/5`
              : `${item.count} órdenes`}
          </p>
        </div>
      </div>
    ))}
  </div>
)

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export function ServicesChart({
  data,
  loading = false,
  chartType = 'pie',
  metric = 'count',
}: ServicesChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Distribución de Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Cargando distribución...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Preparar datos según la métrica seleccionada
  const chartData = data.map(item => ({
    ...item,
    name: item.type.replace('_', ' '),
    value:
      metric === 'revenue'
        ? item.revenue
        : metric === 'satisfaction'
        ? item.satisfaction
        : item.count,
  }))

  const getMetricLabel = () => {
    switch (metric) {
      case 'revenue':
        return 'Ingresos por Servicio'
      case 'satisfaction':
        return 'Satisfacción por Servicio'
      default:
        return 'Distribución de Servicios'
    }
  }

  const renderPieChart = () => (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getServiceColor(entry.type)}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend data={data} metric={metric} />
    </div>
  )

  const renderBarChart = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip content={<BarTooltip />} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getServiceColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  // Calcular estadísticas resumidas
  const totalServices = data.reduce((sum, item) => sum + item.count, 0)
  const avgSatisfaction =
    data.reduce((sum, item) => sum + item.satisfaction, 0) / data.length
  const topService = data.reduce(
    (top, current) => (current.count > top.count ? current : top),
    data[0]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            {getMetricLabel()}
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {totalServices} servicios
            </Badge>
            <Badge variant="outline" className="text-xs">
              ⭐ {avgSatisfaction.toFixed(1)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartType === 'pie' ? renderPieChart() : renderBarChart()}

        {/* Insights rápidos */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium capitalize">
              {topService?.type.replace('_', ' ')}
            </span>{' '}
            es el servicio más solicitado con{' '}
            <span className="font-medium">{topService?.count} órdenes</span> y
            una satisfacción de{' '}
            <span className="font-medium">
              {topService?.satisfaction.toFixed(1)}/5
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
