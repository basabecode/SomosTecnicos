/**
 * Página de Perfil Detallado del Técnico
 * Muestra información completa y estadísticas del técnico
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Wrench,
  Activity,
  Users,
  TrendingUp,
} from 'lucide-react'

interface Assignment {
  id: number
  estado: string
  fechaAsignacion: string
  fechaProgramada?: string
  fechaCompletado?: string
  order: {
    id: number
    numeroOrden: string
    nombre: string
    telefono: string
    tipoElectrodomestico: string
    tipoServicio: string
    ciudad: string
    direccion: string
    fechaCreacion: string
  }
}

interface TechnicianDetail {
  id: number
  nombre: string
  telefono: string
  email: string
  cedula: string
  especialidades: string[]
  zonaTrabajoArea: string
  activo: boolean
  disponible: boolean
  calificacionPromedio?: number
  ordenesCompletadas?: number
  fechaRegistro: string
  ultimaActividad?: string
  assignments: Assignment[]
}

const TECHNICIAN_SPECIALTIES = {
  nevera: 'Nevera/Refrigerador',
  lavadora: 'Lavadora',
  secadora: 'Secadora',
  estufa: 'Estufa/Cocina',
  horno: 'Horno Microondas',
  televisor: 'Televisor',
  equipo_sonido: 'Equipo de Sonido',
  aire_acondicionado: 'Aire Acondicionado',
  calentador: 'Calentador de Agua',
  otros: 'Otros Electrodomésticos',
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendiente: { variant: 'secondary' as const, label: 'Pendiente' },
    asignado: { variant: 'default' as const, label: 'Asignado' },
    en_progreso: { variant: 'default' as const, label: 'En Progreso' },
    completado: { variant: 'default' as const, label: 'Completado' },
    cancelado: { variant: 'destructive' as const, label: 'Cancelado' },
  }

  return (
    statusConfig[status as keyof typeof statusConfig] || {
      variant: 'secondary' as const,
      label: status,
    }
  )
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TechnicianDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [technician, setTechnician] = useState<TechnicianDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const technicianId = params.id

  useEffect(() => {
    if (technicianId) {
      fetchTechnician()
    }
  }, [technicianId])

  const fetchTechnician = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/technicians/${technicianId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTechnician(data.data)
        } else {
          setError(data.error || 'Error al cargar el técnico')
        }
      } else if (response.status === 404) {
        setError('Técnico no encontrado')
      } else {
        setError('Error al cargar los datos del técnico')
      }
    } catch (error) {
      console.error('Error fetching technician:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-24 mb-4" />
          </div>

          <div className="grid gap-6">
            {/* Header skeleton */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="mt-6 flex gap-3">
                <Button onClick={fetchTechnician}>Reintentar</Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/technicians')}
                >
                  Volver a la Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (!technician) {
    return null
  }

  const activeAssignments =
    technician.assignments?.filter(a =>
      ['asignado', 'en_progreso'].includes(a.estado)
    ) || []

  const completedAssignments =
    technician.assignments?.filter(a => a.estado === 'completado') || []

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <Button asChild>
            <Link href={`/admin/technicians/${technicianId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Técnico
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Información Principal */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`/avatars/${technician.id}.jpg`} />
                  <AvatarFallback className="text-xl">
                    {getInitials(technician.nombre)}
                  </AvatarFallback>
                </Avatar>

                {/* Información básica */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{technician.nombre}</h1>
                    <p className="text-muted-foreground">
                      Técnico especializado en servicio de electrodomésticos
                    </p>
                  </div>

                  {/* Estados */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={technician.activo ? 'default' : 'secondary'}
                    >
                      {technician.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Badge
                      variant={
                        technician.disponible ? 'default' : 'destructive'
                      }
                    >
                      {technician.disponible ? 'Disponible' : 'No Disponible'}
                    </Badge>
                    {activeAssignments.length > 0 && (
                      <Badge variant="outline">
                        {activeAssignments.length} asignación(es) activa(s)
                      </Badge>
                    )}
                  </div>

                  {/* Información de contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{technician.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{technician.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>Cédula: {technician.cedula}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{technician.zonaTrabajoArea}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {technician.ordenesCompletadas || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Órdenes Completadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {technician.calificacionPromedio?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Calificación
                    </p>
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
                      {activeAssignments.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Asignaciones Activas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.floor(
                        (Date.now() -
                          new Date(technician.fechaRegistro).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Días Registrado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Especialidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Especialidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technician.especialidades.map(specialty => (
                  <Badge key={specialty} variant="outline">
                    {TECHNICIAN_SPECIALTIES[
                      specialty as keyof typeof TECHNICIAN_SPECIALTIES
                    ] || specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asignaciones Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Asignaciones Recientes
              </CardTitle>
              <CardDescription>
                Últimas 10 asignaciones del técnico
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!technician.assignments ||
              technician.assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay asignaciones registradas
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Orden</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Asignado</TableHead>
                        <TableHead>Completado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {technician.assignments.slice(0, 10).map(assignment => {
                        const statusBadge = getStatusBadge(assignment.estado)
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">
                              {assignment.order.numeroOrden}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {assignment.order.nombre}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {assignment.order.ciudad}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {assignment.order.tipoElectrodomestico}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {assignment.order.tipoServicio}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDateTime(assignment.fechaAsignacion)}
                            </TableCell>
                            <TableCell>
                              {assignment.fechaCompletado
                                ? formatDateTime(assignment.fechaCompletado)
                                : '-'}
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

          {/* Información Adicional */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información de Registro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Registrado: {formatDate(technician.fechaRegistro)}
                  </span>
                </div>
                {technician.ultimaActividad && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Última actividad:{' '}
                      {formatDateTime(technician.ultimaActividad)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Trabajos completados:</span>
                  <span className="font-medium">
                    {completedAssignments.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trabajos activos:</span>
                  <span className="font-medium">
                    {activeAssignments.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tasa de finalización:</span>
                  <span className="font-medium">
                    {technician.assignments && technician.assignments.length > 0
                      ? Math.round(
                          (completedAssignments.length /
                            technician.assignments.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
