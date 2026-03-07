'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/domain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  Phone,
  Navigation,
  FileText,
  MessageCircle,
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

const priorityColors: Record<string, string> = {
  baja: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800',
}

const statusColors: Record<string, string> = {
  assigned: 'bg-blue-100 text-blue-800',
  asignado: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  en_proceso: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  completado: 'bg-green-100 text-green-800',
  on_hold: 'bg-gray-100 text-gray-800',
  pendiente: 'bg-orange-100 text-orange-800',
}

const statusIcons: Record<string, any> = {
  assigned: Clock,
  asignado: Clock,
  in_progress: PlayCircle,
  en_proceso: PlayCircle,
  completed: CheckCircle,
  completado: CheckCircle,
  on_hold: XCircle,
}

export default function TechnicianAssignmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [error, setError] = useState('')

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

  useEffect(() => {
    fetchAssignments()
  }, [])

  const updateStatus = async (assignmentId: number, orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken')
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
        fetchAssignments()
      } else {
        alert('Error actualizando estado: ' + (data.error || 'Desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al actualizar estado')
    }
  }

  const startJob = async (assignment: Assignment) => {
    if (confirm('¿Deseas iniciar este servicio?')) {
        await updateStatus(assignment.id, assignment.orderId, 'en_proceso')
        router.push(`/technician/assignments/${assignment.id}/execute`)
    }
  }

  const completeJob = (assignment: Assignment) => {
    router.push(`/technician/assignments/${assignment.id}/execute`)
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch =
      assignment.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tipoElectrodomestico.toLowerCase().includes(searchTerm.toLowerCase())

    // Normalize status for filtering (API returns Spanish status usually)
    const normalizedStatus = assignment.estado === 'asignado' ? 'assigned' :
                             assignment.estado === 'en_proceso' ? 'in_progress' :
                             assignment.estado === 'completado' ? 'completed' :
                             assignment.estado;

    const matchesStatus =
      statusFilter === 'all' || normalizedStatus === statusFilter || assignment.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const openDetailDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsDetailDialogOpen(true)
  }

  if (loading && assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando asignaciones...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-6">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Mis Asignaciones</h2>
        <Button variant="outline" size="sm" onClick={fetchAssignments}>
            <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="py-3 md:py-6">
          <CardTitle className="text-base md:text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, orden o servicio..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px] h-9 text-sm">
                    <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="assigned">Asignado</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Cards */}
      <div className="grid gap-4">
        {filteredAssignments.length === 0 ? (
          <EmptyState variant="no-assignments" />
        ) : (
        filteredAssignments.map(assignment => {
          const StatusIcon = statusIcons[assignment.estado] || Clock
          const isToday = assignment.fechaProgramada &&
            new Date(assignment.fechaProgramada).toDateString() === new Date().toDateString()

          return (
            <Card
              key={assignment.id}
              className={`native-card overflow-hidden transition-all duration-300 ${
                isToday ? 'ring-1 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{assignment.orderNumber}</h3>
                        {isToday && <Badge variant="outline">Hoy</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assignment.tipoElectrodomestico}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={priorityColors[assignment.urgencia] || 'bg-gray-100'}>
                      {assignment.urgencia?.toUpperCase() || 'NORMAL'}
                    </Badge>
                    <Badge className={statusColors[assignment.estado] || 'bg-gray-100'}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {assignment.estado.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="font-medium">{assignment.cliente}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{assignment.telefono}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{assignment.direccion}, {assignment.distrito}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {assignment.fechaProgramada ? format(new Date(assignment.fechaProgramada), 'PP p', { locale: es }) : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm italic text-gray-600 bg-muted/30 p-2 rounded">{assignment.problema}</p>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100/50 mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 min-w-[100px]"
                      onClick={() => openDetailDialog(assignment)}
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      Detalles
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[100px] text-green-700 hover:bg-green-50"
                      asChild
                    >
                      <a href={`tel:${assignment.telefono?.replace(/\s+/g, '')}`}>
                        <Phone className="w-4 h-4 mr-1.5" />
                        Llamar
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[100px] text-green-600 hover:bg-green-50"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${assignment.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${assignment.cliente}, soy su técnico de SomosTécnicos.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                         <MessageCircle className="w-4 h-4 mr-1.5" />
                         Chat
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[100px]"
                      asChild
                    >
                       <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${assignment.direccion}, ${assignment.distrito}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="w-4 h-4 mr-1.5" />
                        Ir
                      </a>
                    </Button>

                    {assignment.estado === 'asignado' && (
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-green-600 hover:bg-green-700"
                        onClick={() => startJob(assignment)}
                      >
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        Iniciar Servicio
                      </Button>
                    )}

                    {assignment.estado === 'en_proceso' && (
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-primary hover:bg-primary/90"
                        onClick={() => completeJob(assignment)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Finalizar Trabajo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        }))}
      </div>

      {/* Assignment Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Detalles de Asignación - {selectedAssignment?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Información completa de la orden de servicio
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nombre:</strong> {selectedAssignment.cliente}
                    </p>
                    <p>
                      <strong>Teléfono:</strong>{' '}
                      {selectedAssignment.telefono}
                    </p>
                    <p>
                      <strong>Dirección:</strong>{' '}
                      {selectedAssignment.direccion}
                    </p>
                     <p>
                      <strong>Ciudad/Barrio:</strong>{' '}
                      {selectedAssignment.distrito}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Información del Servicio</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Tipo:</strong> {selectedAssignment.tipoElectrodomestico}
                    </p>
                    <p>
                      <strong>Urgencia:</strong> {selectedAssignment.urgencia}
                    </p>
                    <p>
                      <strong>Fecha programada:</strong>{' '}
                      {selectedAssignment.fechaProgramada ? new Date(
                        selectedAssignment.fechaProgramada
                      ).toLocaleString() : 'Sin fecha'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Descripción del Problema</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {selectedAssignment.problema}
                </p>
              </div>

              {selectedAssignment.notas && (
                <div>
                  <h4 className="font-medium mb-2">Notas de Asignación</h4>
                  <p className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                    {selectedAssignment.notas}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
