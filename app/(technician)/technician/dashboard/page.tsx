'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { NextJobCard, NoAssignmentsEmptyState } from '@/components/domain'

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
  status?: 'disponible' | 'ocupado' | 'en_descanso' | 'offline'
}

export default function TechnicianDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [stats, setStats] = useState<TechStats>({ pending: 0, inProgress: 0, completedToday: 0 })
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null)
  const [error, setError] = useState('')

  // Handlers para NextJobCard
  const handleNavigate = () => {
    const nextAssignment = assignments[0]
    if (nextAssignment?.direccion) {
      const address = encodeURIComponent(`${nextAssignment.direccion}, ${nextAssignment.distrito}`)
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
    }
  }

  const handleCall = () => {
    const nextAssignment = assignments[0]
    if (nextAssignment?.telefono) {
      window.location.href = `tel:${nextAssignment.telefono.replace(/\s+/g, '')}`
    }
  }

  const handleStartService = async () => {
    const nextAssignment = assignments[0]
    if (nextAssignment) {
      await updateStatus(nextAssignment.id, nextAssignment.orderId, 'en_proceso')
    }
  }

  const fetchAssignments = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/technicians/me/assignments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      const token = localStorage.getItem('accessToken')
      // Usar endpoint de asignación para cambiar estado
      const response = await fetch(`/api/technicians/me/assignments/${assignmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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

  const updateTechnicianStatus = async (status: string) => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/technicians/me/status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        })

        if (response.ok) {
            const data = await response.json()
             if (technician) {
                 setTechnician({
                     ...technician,
                     status: data.data.status
                 })
             }
        } else {
             const errorData = await response.json().catch(() => ({ error: 'Error parsing JSON' }))
             console.error('Failed to update status:', {
                 status: response.status,
                 statusText: response.statusText,
                 data: errorData
             })
             alert(`Error al actualizar estado: ${errorData.error || response.statusText}`)
        }
      } catch (error) {
          console.error('Error updating status:', error)
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
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-8 pt-4 sm:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#A50034] to-[#2C3E50] bg-clip-text text-transparent">
            Panel del Técnico
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
            Bienvenido, {technician?.nombre || user?.nombre || 'Técnico'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
           <div className="flex gap-2">
              <Button
                variant={technician?.status === 'disponible' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateTechnicianStatus('disponible')}
                className="flex-1 sm:flex-none h-9 text-xs sm:text-sm"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Disponible
              </Button>
              <Button
                variant={technician?.status === 'en_descanso' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateTechnicianStatus('en_descanso')}
                className="flex-1 sm:flex-none h-9 text-xs sm:text-sm"
              >
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                Descanso
              </Button>
           </div>

           <div className="flex items-center justify-between sm:justify-start gap-2 text-[10px] sm:text-xs text-muted-foreground">
             <span className="flex items-center flex-1 sm:flex-none">
               <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-1.5 ${
                 technician?.status === 'disponible' ? 'bg-green-500 animate-pulse' :
                 technician?.status === 'ocupado' ? 'bg-blue-500' : 'bg-orange-500'
               }`}></div>
                Estado: {
                  technician?.status === 'disponible' ? 'Disponible' :
                  technician?.status === 'ocupado' ? 'En servicio' : 'En pausa'
                }
             </span>
             <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-6 sm:w-6 flex-shrink-0" onClick={fetchAssignments}>
               <RefreshCw className="h-3 w-3" />
             </Button>
           </div>
        </div>
      </div>

      {/* Estado Actual - Scrollable on mobile */}
      <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-hide snap-x">
        <Card className="min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.pending}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Por iniciar hoy
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              En Progreso
            </CardTitle>
            <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Servicios activos
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Finalizados hoy</p>
          </CardContent>
        </Card>

        <Card className="min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Zona</CardTitle>
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-lg font-bold truncate">{technician?.zona || 'Sin asignar'}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Área de cobertura
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-4 sm:gap-4 md:grid-cols-1 lg:grid-cols-7">
        {/* Próximas Asignaciones */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Mis Asignaciones</CardTitle>
            <CardDescription>
              {assignments.length > 0
                ? `${assignments.length} servicio${assignments.length > 1 ? 's' : ''} programado${assignments.length > 1 ? 's' : ''}`
                : 'No hay servicios pendientes'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
                <NoAssignmentsEmptyState />
            ) : (
                <div className="space-y-6">
                  {/* Hero - Próximo Servicio */}
                  {assignments[0] && (
                    <NextJobCard
                      assignment={{
                        id: assignments[0].id,
                        orderNumber: assignments[0].orderNumber,
                        cliente: assignments[0].cliente,
                        telefono: assignments[0].telefono,
                        direccion: assignments[0].direccion,
                        distrito: assignments[0].distrito,
                        tipoElectrodomestico: assignments[0].tipoElectrodomestico,
                        problema: assignments[0].problema,
                        urgencia: assignments[0].urgencia as 'alta' | 'media' | 'baja',
                        fechaProgramada: assignments[0].fechaProgramada,
                        estimatedDuration: '2h', // Estimado por defecto
                      }}
                      onNavigate={handleNavigate}
                      onCall={handleCall}
                      onStart={handleStartService}
                    />
                  )}

                  {/* Resto de asignaciones - Lista compacta */}
                  {assignments.length > 1 && (
                    <div className="space-y-3">
                      <h4 className="text-small font-[600] text-text-secondary uppercase tracking-wide">
                        Siguientes Servicios ({assignments.length - 1})
                      </h4>
                      {assignments.slice(1).map((service) => (
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
