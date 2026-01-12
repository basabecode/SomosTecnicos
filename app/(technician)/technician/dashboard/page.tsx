'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Wrench,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Navigation,
  Star,
  Calendar,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Assignment {
  id: number
  orderNumber: string
  orderId: string
  cliente: string
  telefono: string
  direccion: string
  distrito: string
  tipoElectrodomestico: string
  problema: string
  urgencia: string
  fechaProgramada: string
  estado: string
  notas: string
}

interface TechStats {
  pending: number
  inProgress: number
  completedToday: number
}

interface TechnicianProfile {
  id: number
  nombre: string
  especialidades: string[]
  zona: string
}

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [stats, setStats] = useState<TechStats>({ pending: 0, inProgress: 0, completedToday: 0 })
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null)
  const [error, setError] = useState('')

  const fetchAssignments = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/technicians/me/assignments')
      const data = await response.json()

      if (data.success) {
        setAssignments(data.assignments)
        setStats(data.stats)
        setTechnician(data.technician)
      } else {
        setError(data.error || 'Error cargando asignaciones')
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar estado
  const updateStatus = async (assignmentId: number, orderId: string, newStatus: string) => {
    try {
      // Usar endpoint de asignación para cambiar estado
      const response = await fetch(`/api/technicians/me/assignments/${assignmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        // Recargar datos para reflejar cambios
        // Nota: fetchAssignments pone loading=true, lo que hará parpadear la UI.
        // Podríamos optimizarlo, pero para v1 está bien.
        fetchAssignments()
      } else {
        alert('Error actualizando estado: ' + (data.error || 'Desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al actualizar estado')
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando tu panel de trabajo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Atención requerida</h3>
        <p className="text-gray-600 max-w-md mb-6">{error}</p>
        <Button onClick={fetchAssignments}>
          <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Hola, {technician?.nombre || user?.nombre}
          </h2>
          <p className="text-muted-foreground">
            {assignments.length > 0
              ? `Tienes ${assignments.length} servicios asignados para hoy`
              : 'No tienes servicios pendientes por ahora'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            En línea
          </Badge>
          <Button size="sm" variant="ghost" onClick={fetchAssignments}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Estado Actual */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Por iniciar hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Progreso
            </CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Servicios activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Finalizados hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zona</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{technician?.zona || 'Sin asignar'}</div>
            <p className="text-xs text-muted-foreground">
              Área de cobertura
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        {/* Próximas Asignaciones */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Próximas Asignaciones</CardTitle>
            <CardDescription>Servicios programados ordenados por prioridad</CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
                <div className="text-center py-10">
                    <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground">No tienes asignaciones pendientes.</p>
                </div>
            ) : (
                <div className="space-y-4">
                {assignments.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 space-y-3 bg-card hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                        <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{service.orderNumber}</h4>
                            <Badge
                            variant="outline"
                            className={
                                service.urgencia === 'alta'
                                ? 'border-red-200 text-red-700 bg-red-50'
                                : service.urgencia === 'media'
                                ? 'border-orange-200 text-orange-700 bg-orange-50'
                                : 'border-green-200 text-green-700 bg-green-50'
                            }
                            >
                            {service.urgencia.toUpperCase()}
                            </Badge>
                             <Badge variant="secondary" className="text-xs">
                                {service.estado.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-sm text-foreground font-medium mt-1">
                            {service.cliente}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="text-sm font-medium">
                            {service.fechaProgramada ? format(new Date(service.fechaProgramada), 'HH:mm', { locale: es }) : 'Por definir'}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {service.tipoElectrodomestico}
                        </p>
                        </div>
                    </div>

                    <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                        <p className="text-sm">
                        <strong>Problema:</strong> {service.problema}
                        </p>
                        <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground break-words">
                            {service.direccion} - {service.distrito}
                        </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="default" className="flex-1 sm:flex-none" asChild>
                            <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${service.direccion}, ${service.distrito}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                                <Navigation className="h-4 w-4 mr-1" />
                                Ir
                            </a>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 sm:flex-none" asChild>
                            <a href={`tel:${service.telefono.replace(/\s+/g, '')}`}>
                            <Phone className="h-4 w-4 mr-1" />
                            Llamar
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            variant={service.estado === 'en_proceso' ? "secondary" : "outline"}
                            className="flex-1 sm:flex-none"
                            onClick={() => {
                                const nextStatus = service.estado === 'asignado' ? 'en_proceso' : 'completado'
                                updateStatus(service.id, service.orderId, nextStatus)
                            }}
                        >
                        {service.estado === 'en_proceso' ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Finalizar
                            </>
                        ) : (
                            <>
                                <Wrench className="h-4 w-4 mr-1" />
                                Iniciar
                            </>
                        )}
                        </Button>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de Control Lateral */}
        <Card className="col-span-1 lg:col-span-3 h-fit">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">Resumen de Cuenta</h4>
                 <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                        <span>Especialidades:</span>
                        <span className="font-medium text-right">{technician?.especialidades.join(', ') || 'General'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Zona:</span>
                        <span className="font-medium">{technician?.zona || 'Sin zona'}</span>
                    </div>
                 </div>
             </div>

            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/technician/schedule">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Mi Calendario
                </Link>
              </Button>

              <Button className="w-full justify-start" variant="outline" onClick={() => alert("Reportar problema")}>
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                Reportar Incidencia
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
