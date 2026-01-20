/**
 * Página de Asignaciones - Panel Técnico
 * Vista de trabajos asignados para técnicos
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from 'lucide-react'

interface Assignment {
  id: string
  orderId: string
  clientName: string
  clientPhone: string
  clientAddress: string
  serviceType: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'assigned' | 'in_progress' | 'completed' | 'on_hold'
  scheduledDate: string
  estimatedDuration: string
  description: string
  clientNotes?: string
  assignedDate: string
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    clientName: 'María García',
    clientPhone: '+57 300 123 4567',
    clientAddress: 'Calle 123 #45-67, Bogotá Norte',
    serviceType: 'Reparación Lavadora',
    priority: 'high',
    status: 'assigned',
    scheduledDate: '2024-01-17T09:00:00',
    estimatedDuration: '2 horas',
    description: 'Lavadora no centrifuga correctamente',
    clientNotes: 'Llamar antes de llegar. Portería requiere autorización.',
    assignedDate: '2024-01-16T14:30:00',
  },
  {
    id: '2',
    orderId: 'ORD-003',
    clientName: 'Ana Rodríguez',
    clientPhone: '+57 300 234 5678',
    clientAddress: 'Avenida 68 #23-45, Bogotá Centro',
    serviceType: 'Reparación Refrigerador',
    priority: 'urgent',
    status: 'in_progress',
    scheduledDate: '2024-01-16T10:00:00',
    estimatedDuration: '3 horas',
    description: 'Refrigerador no enfría, posible fuga de refrigerante',
    assignedDate: '2024-01-16T08:15:00',
  },
  {
    id: '3',
    orderId: 'ORD-005',
    clientName: 'Pedro Martínez',
    clientPhone: '+57 300 345 6789',
    clientAddress: 'Carrera 15 #78-90, Bogotá Sur',
    serviceType: 'Mantenimiento Aire Acondicionado',
    priority: 'medium',
    status: 'assigned',
    scheduledDate: '2024-01-17T14:00:00',
    estimatedDuration: '1.5 horas',
    description: 'Mantenimiento preventivo programado',
    assignedDate: '2024-01-16T16:45:00',
  },
]

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

const statusColors = {
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  on_hold: 'bg-gray-100 text-gray-800',
}

const statusIcons = {
  assigned: Clock,
  in_progress: PlayCircle,
  completed: CheckCircle,
  on_hold: XCircle,
}

export default function TechnicianAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch =
      assignment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || assignment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const openDetailDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsDetailDialogOpen(true)
  }

  const startJob = (assignmentId: string) => {
    // Logic to start the job
    console.log('Starting job:', assignmentId)
  }

  const completeJob = (assignmentId: string) => {
    // Logic to complete the job
    console.log('Completing job:', assignmentId)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mis Asignaciones</h2>
      </div>



      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, orden o servicio..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="assigned">Asignado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="on_hold">En Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Cards */}
      <div className="grid gap-4">
        {filteredAssignments.map(assignment => {
          const StatusIcon = statusIcons[assignment.status]
          const isToday =
            new Date(assignment.scheduledDate).toDateString() ===
            new Date().toDateString()

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
                      <h3 className="font-semibold">{assignment.orderId}</h3>
                      {isToday && <Badge variant="outline">Hoy</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assignment.serviceType}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={priorityColors[assignment.priority]}>
                      {assignment.priority === 'low' && 'Baja'}
                      {assignment.priority === 'medium' && 'Media'}
                      {assignment.priority === 'high' && 'Alta'}
                      {assignment.priority === 'urgent' && 'Urgente'}
                    </Badge>
                    <Badge className={statusColors[assignment.status]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {assignment.status === 'assigned' && 'Asignado'}
                      {assignment.status === 'in_progress' && 'En Progreso'}
                      {assignment.status === 'completed' && 'Completado'}
                      {assignment.status === 'on_hold' && 'En Espera'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="font-medium">{assignment.clientName}</p>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{assignment.clientPhone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{assignment.clientAddress}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(
                            assignment.scheduledDate
                          ).toLocaleDateString()}{' '}
                          -{' '}
                          {new Date(
                            assignment.scheduledDate
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          Duración estimada: {assignment.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{assignment.description}</p>

                  {assignment.clientNotes && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Nota del cliente:</strong>{' '}
                        {assignment.clientNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100/50 mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 min-w-[120px] active-tap bg-white/50"
                      onClick={() => openDetailDialog(assignment)}
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      Detalles
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[120px] active-tap border-green-200 text-green-700 hover:bg-green-50"
                      asChild
                    >
                      <a href={`tel:${assignment.clientPhone.replace(/\s+/g, '')}`}>
                        <Phone className="w-4 h-4 mr-1.5" />
                        Llamar
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-[120px] active-tap"
                    >
                      <Navigation className="w-4 h-4 mr-1.5" />
                      Navegar
                    </Button>

                    {assignment.status === 'assigned' && (
                      <Button
                        size="sm"
                        className="w-full active-tap bg-green-600 hover:bg-green-700 mt-2"
                        onClick={() => startJob(assignment.id)}
                      >
                        <PlayCircle className="w-4 h-4 mr-1.5" />
                        Iniciar Servicio
                      </Button>
                    )}

                    {assignment.status === 'in_progress' && (
                      <Button
                        size="sm"
                        className="w-full active-tap bg-[#A50034] hover:bg-[#8B002B] mt-2"
                        onClick={() => completeJob(assignment.id)}
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
        })}
      </div>

      {/* Assignment Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Detalles de Asignación - {selectedAssignment?.orderId}
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
                      <strong>Nombre:</strong> {selectedAssignment.clientName}
                    </p>
                    <p>
                      <strong>Teléfono:</strong>{' '}
                      {selectedAssignment.clientPhone}
                    </p>
                    <p>
                      <strong>Dirección:</strong>{' '}
                      {selectedAssignment.clientAddress}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Información del Servicio</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Tipo:</strong> {selectedAssignment.serviceType}
                    </p>
                    <p>
                      <strong>Fecha programada:</strong>{' '}
                      {new Date(
                        selectedAssignment.scheduledDate
                      ).toLocaleString()}
                    </p>
                    <p>
                      <strong>Duración estimada:</strong>{' '}
                      {selectedAssignment.estimatedDuration}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Descripción del Problema</h4>
                <p className="text-sm bg-gray-50 p-3 rounded">
                  {selectedAssignment.description}
                </p>
              </div>

              {selectedAssignment.clientNotes && (
                <div>
                  <h4 className="font-medium mb-2">Notas del Cliente</h4>
                  <p className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                    {selectedAssignment.clientNotes}
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
