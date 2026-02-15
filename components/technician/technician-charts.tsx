/**
 * Componente de Gráficos de Rendimiento del Técnico
 * Visualizaciones de desempeño personal
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TechnicianChartData {
  serviciosPorDia: Array<{ fecha: string; cantidad: number }>
  serviciosPorTipo: Array<{ tipo: string; cantidad: number }>
  calificacionesPorMes: Array<{ mes: string; calificacion: number }>
}

export function TechnicianPerformanceCharts() {
  const [chartData, setChartData] = useState<TechnicianChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/technicians/me/charts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setChartData(data.data)
        }
      } catch (error) {
        console.error('Error fetching technician chart data:', error)
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
        {[...Array(3)].map((_, i) => (
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
      {/* Gráfico de Servicios por Día */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Mi Rendimiento Diario</CardTitle>
          <CardDescription>Servicios completados en los últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.serviciosPorDia}>
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
                stroke="#0066CC"
                strokeWidth={2}
                name="Servicios"
                dot={{ fill: '#0066CC', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Servicios por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios por Tipo</CardTitle>
          <CardDescription>Distribución de electrodomésticos atendidos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.serviciosPorTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#A50034" name="Servicios" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Calificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Calificaciones</CardTitle>
          <CardDescription>Promedio mensual de calificaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.calificacionesPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} ⭐`, 'Calificación']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calificacion"
                stroke="#10b981"
                strokeWidth={2}
                name="Calificación"
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
