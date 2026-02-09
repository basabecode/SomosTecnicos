/**
 * Página de Gestión de Técnicos
 * Lista, gestiona y supervisa todos los técnicos del sistema
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/contexts/auth-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Activity,
} from 'lucide-react'

interface Technician {
  id: number
  nombre: string
  telefono: string
  email: string
  ciudad: string
  especialidades: string[]
  disponible: boolean
  estado: 'activo' | 'inactivo' | 'ocupado' | 'descanso'
  calificacionPromedio: number | string | null
  ordenesCompletadas: number | string | null
  fechaRegistro: string
  ultimaActividad?: string
  asignacionActual?: {
    orderId: string
    numeroOrden: string
    cliente: string
    fechaAsignacion: string
  }
}

const estadoColors = {
  activo: 'bg-green-100 text-green-800 border-green-200',
  ocupado: 'bg-blue-100 text-blue-800 border-blue-200',
  inactivo: 'bg-red-100 text-red-800 border-red-200',
  descanso: 'bg-yellow-100 text-yellow-800 border-yellow-200',
}

const estadoIcons = {
  activo: CheckCircle,
  ocupado: Activity,
  inactivo: XCircle,
  descanso: Clock,
}

const estadoLabels = {
  activo: 'Disponible',
  ocupado: 'Ocupado',
  inactivo: 'Inactivo',
  descanso: 'En Descanso',
}

const especialidadColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
]

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Real-time stats
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    ocupados: 0,
    descanso: 0,
    inactivos: 0
  })

  // Fetch stats separately to avoid pagination limits
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/technicians/availability', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.stats) {
          const s = data.stats
          // Calculate inactivos (technicians not in any active state)
          // Or use the count from difference if total is accurate
          const calculatedInactivos = Math.max(0, s.total - (s.disponibles + s.ocupados + s.descanso))

          setStats({
            total: s.total,
            disponibles: s.disponibles,
            ocupados: s.ocupados,
            descanso: s.descanso,
            inactivos: calculatedInactivos
          })
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchTechnicians()
    // Trigger stats fetch when filters change (though stats are usually global)
    // If stats should filter by city/search, we'd need to pass params to stats API too.
    // For now, assuming global stats as per dashboard.
  }, [currentPage, statusFilter, cityFilter, availabilityFilter, searchTerm])

  // Poll for stats real-time
  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // 30 seconds polling
    return () => clearInterval(interval)
  }, [])

  const fetchTechnicians = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })

      if (statusFilter !== 'all') params.append('estado', statusFilter)
      if (cityFilter !== 'all') params.append('ciudad', cityFilter)
      if (availabilityFilter !== 'all')
        params.append('disponible', availabilityFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/technicians?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setTechnicians(data.data.technicians || data.data)
          setTotalPages(data.data.pagination?.totalPages || 1)
          setTotalItems(
            data.data.pagination?.totalItems ||
              (data.data.technicians || data.data).length
          )
        }
      } else {
        console.error('Error fetching technicians:', response.status)
        setTechnicians([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      console.error('Error fetching technicians:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) {
      return 'Hace menos de 1 hora'
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
    } else {
      return formatDate(dateString)
    }
  }

  const renderStars = (rating: number | string | null | undefined) => {
    const stars = []
    const validRating = Number(rating) || 0
    const fullStars = Math.floor(validRating)
    const hasHalfStar = validRating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-full-${i}`} className="text-yellow-400">
          ★
        </span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="star-half" className="text-yellow-400">
          ☆
        </span>
      )
    }

    const emptyStars = 5 - Math.ceil(validRating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`star-empty-${i}`} className="text-gray-300">
          ★
        </span>
      )
    }

    return stars
  }

  const cities = Array.from(new Set(technicians.map(t => t.ciudad)))

  return (
    <ProtectedRoute
      requiredRoles={['super_admin', 'admin', 'technician_manager']}
    >
      <div className="space-y-6">
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
              Gestión de Técnicos
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Administra y supervisa el equipo de técnicos
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto h-9 text-xs sm:text-sm" size="sm">
            <Link href="/admin/technicians/create">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Nuevo Técnico
            </Link>
          </Button>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.disponibles}
                  </p>
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.ocupados}
                  </p>
                  <p className="text-xs text-muted-foreground">Ocupados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.descanso}
                  </p>
                  <p className="text-xs text-muted-foreground">En Descanso</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {stats.inactivos}
                  </p>
                  <p className="text-xs text-muted-foreground">Inactivos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtra y busca técnicos específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, teléfono, email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-9 text-sm">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="ocupado">Ocupado</SelectItem>
                  <SelectItem value="descanso">En Descanso</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full md:w-48 h-9 text-sm">
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={`city-${city}`} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={availabilityFilter}
                onValueChange={setAvailabilityFilter}
              >
                <SelectTrigger className="w-full md:w-48 h-9 text-sm">
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Disponibles</SelectItem>
                  <SelectItem value="false">No Disponibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Técnicos */}
        <Card>
          <CardHeader>
            <CardTitle>Técnicos ({totalItems})</CardTitle>
            <CardDescription>
              Lista completa del equipo de técnicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={`param-skeleton-${i}`} className="flex items-center space-x-4 p-4">
                    <div className="w-32 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="w-28 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="w-24 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="w-16 h-4 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No se encontraron técnicos
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Técnico</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Especialidades</TableHead>
                      <TableHead>Calificación</TableHead>
                      <TableHead>Órdenes</TableHead>
                      <TableHead>Última Actividad</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicians.map(technician => {
                      const EstadoIcon =
                        estadoIcons[technician.estado] || CheckCircle
                      return (
                        <TableRow key={`tech-row-${technician.id}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {technician.nombre}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Phone className="mr-1 h-3 w-3" />
                                {technician.telefono}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {technician.ciudad}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge
                                variant="outline"
                                className={
                                  estadoColors[technician.estado] ||
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }
                              >
                                <EstadoIcon className="mr-1 h-3 w-3" />
                                {estadoLabels[technician.estado] ||
                                  'Desconocido'}
                              </Badge>
                              {technician.asignacionActual && (
                                <div className="text-xs text-muted-foreground">
                                  Asignado a{' '}
                                  {technician.asignacionActual.numeroOrden}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {technician.especialidades
                                .slice(0, 3)
                                .map((especialidad, index) => (
                                  <Badge
                                    key={`badge-spec-${technician.id}-${especialidad}-${index}`}
                                    variant="secondary"
                                    className={`text-xs capitalize ${
                                      especialidadColors[
                                        index % especialidadColors.length
                                      ]
                                    }`}
                                  >
                                    {especialidad}
                                  </Badge>
                                ))}
                              {technician.especialidades.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{technician.especialidades.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {renderStars(technician.calificacionPromedio)}
                              </div>
                              <span className="text-sm font-medium">
                                {Number(
                                  technician.calificacionPromedio || 0
                                ).toFixed(1)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium text-lg">
                                {Number(technician.ordenesCompletadas) || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                completadas
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {technician.ultimaActividad
                                ? formatDateTime(technician.ultimaActividad)
                                : 'Sin actividad'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/technicians/${technician.id}`}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver perfil
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/technicians/${technician.id}/edit`}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {technician.disponible ? (
                                  <DropdownMenuItem>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Marcar No Disponible
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Marcar Disponible
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/technicians/${technician.id}/schedule`}
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Ver Horarios
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * 10 + 1} a{' '}
              {Math.min(currentPage * 10, totalItems)} de {totalItems} técnicos
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
