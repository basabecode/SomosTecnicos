/**
 * 📈 SomosTécnicos - Gráfico de Órdenes en el Tiempo
 * =============================================
 *
 * Componente especializado para mostrar la evolución temporal de órdenes
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import {
  OrderStats,
  formatChartDate,
  formatCurrency,
  CHART_COLORS,
} from './types'

// =============================================
// PROPS INTERFACE
// =============================================

interface OrdersChartProps {
  data: OrderStats[]
  loading?: boolean
  chartType?: 'bar' | 'line' | 'area'
  showRevenue?: boolean
}

// =============================================
// TOOLTIP PERSONALIZADO
// =============================================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{formatChartDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.dataKey === 'revenue' ? (
              <>
                <span className="capitalize">
                  {entry.dataKey === 'revenue' ? 'Ingresos' : entry.dataKey}:
                </span>{' '}
                <span className="font-medium">
                  {formatCurrency(entry.value)}
                </span>
              </>
            ) : (
              <>
                <span className="capitalize">
                  {entry.dataKey === 'total'
                    ? 'Total'
                    : entry.dataKey === 'completed'
                    ? 'Completadas'
                    : entry.dataKey === 'pending'
                    ? 'Pendientes'
                    : entry.dataKey === 'cancelled'
                    ? 'Canceladas'
                    : entry.dataKey}
                  :
                </span>{' '}
                <span className="font-medium">{entry.value}</span>
              </>
            )}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export function OrdersChart({
  data,
  loading = false,
  chartType = 'bar',
  showRevenue = false,
}: OrdersChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolución de Órdenes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Cargando datos del gráfico...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatChartDate}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              name="Total"
              dot={{ fill: CHART_COLORS[0], strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke={CHART_COLORS[1]}
              strokeWidth={2}
              name="Completadas"
              dot={{ fill: CHART_COLORS[1], strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke={CHART_COLORS[2]}
              strokeWidth={2}
              name="Pendientes"
              dot={{ fill: CHART_COLORS[2], strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatChartDate}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              stroke={CHART_COLORS[1]}
              fill={CHART_COLORS[1]}
              fillOpacity={0.7}
              name="Completadas"
            />
            <Area
              type="monotone"
              dataKey="pending"
              stackId="1"
              stroke={CHART_COLORS[2]}
              fill={CHART_COLORS[2]}
              fillOpacity={0.7}
              name="Pendientes"
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              stackId="1"
              stroke={CHART_COLORS[3]}
              fill={CHART_COLORS[3]}
              fillOpacity={0.7}
              name="Canceladas"
            />
          </AreaChart>
        )

      default: // bar
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatChartDate}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="completed"
              fill={CHART_COLORS[1]}
              name="Completadas"
            />
            <Bar dataKey="pending" fill={CHART_COLORS[2]} name="Pendientes" />
            <Bar dataKey="cancelled" fill={CHART_COLORS[3]} name="Canceladas" />
            {showRevenue && (
              <Bar
                dataKey="revenue"
                fill={CHART_COLORS[4]}
                name="Ingresos"
                yAxisId="right"
              />
            )}
          </BarChart>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Evolución de Órdenes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
