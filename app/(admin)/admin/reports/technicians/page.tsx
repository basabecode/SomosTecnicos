/**
 * Página de Reportes de Técnicos - Panel Admin
 * Reportes y estadísticas detalladas de técnicos
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Clock,
  Star,
  TrendingUp,
  Download,
  Calendar,
  Award,
  AlertTriangle,
} from 'lucide-react'

interface TechnicianReport {
  id: string
  name: string
  email: string
  specialties: string[]
  totalOrders: number
  completedOrders: number
  averageRating: number
  averageCompletionTime: string
  activeAssignments: number
  earnings: number
  status: 'active' | 'inactive' | 'on_leave'
  lastActivity: string
}

// Datos simulados (Placeholder)
const mockTechnicians: TechnicianReport[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@somostecnicos.com',
    specialties: ['Electrodomésticos', 'Aires Acondicionados'],
    totalOrders: 45,
    completedOrders: 42,
    averageRating: 4.8,
    averageCompletionTime: '2.5 horas',
    activeAssignments: 3,
    earnings: 1250000,
    status: 'active',
    lastActivity: '2024-01-16T10:30:00',
  },
  {
    id: '2',
    name: 'Ana López',
    email: 'ana@somostecnicos.com',
    specialties: ['Lavadoras', 'Refrigeradores'],
    totalOrders: 38,
    completedOrders: 36,
    averageRating: 4.6,
    averageCompletionTime: '3.1 horas',
    activeAssignments: 2,
    earnings: 980000,
    status: 'active',
    lastActivity: '2024-01-16T09:15:00',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  on_leave: 'bg-yellow-100 text-yellow-800',
}

export default function TechniciansReport() {
  const [timeRange, setTimeRange] = useState('30d')
  const [sortBy, setSortBy] = useState('rating')
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    promedioCalificacion: 0,
    tiempoPromedio: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const response = await fetch('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            setStats({
              total: data.data.tecnicos?.total || 0,
              activos: data.data.tecnicos?.activos || 0,
              promedioCalificacion: data.data.negocio?.satisfaccionPromedio || 0,
              tiempoPromedio: data.data.negocio?.tiempoPromedioResolucion || 0
            })
          }
        }
      } catch (error) {
        console.error('Error fetching technician stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Reportes de Técnicos
        </h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
              <SelectItem value="1y">1 año</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Técnicos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
            <p className="text-xs text-muted-foreground">Registrados en sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Técnicos Activos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.activos}</div>
            <p className="text-xs text-muted-foreground">Disponibles ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.promedioCalificacion.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              General del equipo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.tiempoPromedio} días</div>
            <p className="text-xs text-muted-foreground">
              De resolución
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Top Performers (Demo)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTechnicians
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3)
                .map((tech, index) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-yellow-800">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tech.completedOrders} órdenes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{tech.averageRating}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Más Eficientes (Demo)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTechnicians
                .sort(
                  (a, b) =>
                    parseFloat(a.averageCompletionTime) -
                    parseFloat(b.averageCompletionTime)
                )
                .slice(0, 3)
                .map((tech, index) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tech.completedOrders} completadas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {tech.averageCompletionTime}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Requieren Atención (Demo)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Datos de atención no disponibles
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reporte Detallado</CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Calificación</SelectItem>
                <SelectItem value="orders">Órdenes</SelectItem>
                <SelectItem value="earnings">Ingresos</SelectItem>
                <SelectItem value="efficiency">Eficiencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4 mb-4 bg-yellow-50 text-yellow-800 text-sm">
            Nota: La tabla a continuación muestra datos simulados. El reporte detallado estará disponible próximamente.
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Técnico</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Órdenes Totales</TableHead>
                <TableHead>Completadas</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Tiempo Prom.</TableHead>
                <TableHead>Activas</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTechnicians.map(tech => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tech.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tech.specialties.map((specialty, index) => (
                        <Badge
                          key={`${tech.id}-${specialty}-${index}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {tech.totalOrders}
                  </TableCell>
                  <TableCell className="text-center">
                    {tech.completedOrders}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{tech.averageRating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tech.averageCompletionTime}</TableCell>
                  <TableCell className="text-center">
                    {tech.activeAssignments}
                  </TableCell>
                  <TableCell>${tech.earnings.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[tech.status]}>
                      {tech.status === 'active' && 'Activo'}
                      {tech.status === 'inactive' && 'Inactivo'}
                      {tech.status === 'on_leave' && 'En Licencia'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(tech.lastActivity).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
