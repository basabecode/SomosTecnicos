/**
 * Componente de Gráficos del Dashboard
 * Visualizaciones de tendencias y analíticas
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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  ordenesPorDia: Array<{ fecha: string; cantidad: number }>
  ordenesPorEstado: Array<{ estado: string; cantidad: number; porcentaje: number }>
  ordenesPorCiudad: Array<{ ciudad: string; cantidad: number }>
  ingresosPorMes: Array<{ mes: string; ingresos: number }>
}

const COLORS = {
  pendiente: '#f59e0b',
  asignado: '#3b82f6',
  en_proceso: '#8b5cf6',
  completado: '#10b981',
  cancelado: '#ef4444',
}

const CHART_COLORS = ['#A50034', '#0066CC', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

export function DashboardCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/dashboard/charts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setChartData(data.data)
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()

    // Auto-refresh cada 5 minutos
    const interval = setInterval(fetchChartData, 300000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!chartData) return null

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      {/* Gráfico de Órdenes por Día */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Órdenes</CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.ordenesPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getDate()}/${date.getMonth() + 1}`
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('es-CO')
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#A50034"
                strokeWidth={2}
                name="Órdenes"
                dot={{ fill: '#A50034', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Órdenes por Estado */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Estado</CardTitle>
          <CardDescription>Estado actual de órdenes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.ordenesPorEstado}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ estado, porcentaje }) =>
                  `${estado}: ${porcentaje.toFixed(1)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {chartData.ordenesPorEstado.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.estado as keyof typeof COLORS] || CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Órdenes por Ciudad */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes por Ciudad</CardTitle>
          <CardDescription>Top ciudades con más servicios</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.ordenesPorCiudad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ciudad" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#0066CC" name="Órdenes" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Ingresos por Mes */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.ingresosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('es-CO', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
