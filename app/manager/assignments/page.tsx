/**
 * Página de Asignaciones - Panel Manager
 * Gestión de asignaciones de trabajos a técnicos
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
  Plus,
  Clock,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
} from 'lucide-react'

interface Assignment {
  id: string
  orderId: string
  clientName: string
  clientAddress: string
  serviceType: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  technicianId?: string
  technicianName?: string
  scheduledDate: string
  createdDate: string
  estimatedDuration: string
  description: string
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    clientName: 'María García',
    clientAddress: 'Calle 123 #45-67, Bogotá',
    serviceType: 'Reparación Lavadora',
    priority: 'high',
    status: 'assigned',
    technicianId: '1',
    technicianName: 'Juan Pérez',
    scheduledDate: '2024-01-17T09:00:00',
    createdDate: '2024-01-16T14:30:00',
    estimatedDuration: '2 horas',
    description: 'Lavadora no centrifuga correctamente',
  },
  {
    id: '2',
    orderId: 'ORD-002',
    clientName: 'Carlos López',
    clientAddress: 'Carrera 45 #12-34, Bogotá',
    serviceType: 'Mantenimiento Aire Acondicionado',
    priority: 'medium',
    status: 'pending',
    scheduledDate: '2024-01-17T14:00:00',
    createdDate: '2024-01-16T16:45:00',
    estimatedDuration: '1.5 horas',
    description: 'Mantenimiento preventivo programado',
  },
  {
    id: '3',
    orderId: 'ORD-003',
    clientName: 'Ana Rodríguez',
    clientAddress: 'Avenida 68 #23-45, Bogotá',
    serviceType: 'Reparación Refrigerador',
    priority: 'urgent',
    status: 'in_progress',
    technicianId: '2',
    technicianName: 'Ana López',
    scheduledDate: '2024-01-16T10:00:00',
    createdDate: '2024-01-16T08:15:00',
    estimatedDuration: '3 horas',
    description: 'Refrigerador no enfría, posible fuga de refrigerante',
  },
]

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusIcons = {
  pending: Clock,
  assigned: UserCheck,
  in_progress: AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch =
      assignment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || assignment.status === statusFilter
    const matchesPriority =
      priorityFilter === 'all' || assignment.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Gestión de Asignaciones
        </h2>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Asignación
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Asignaciones
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Esperan asignación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter(a => a.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">En ejecución</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAssignments.filter(a => a.priority === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
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
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="assigned">Asignado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Asignaciones ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Duración Est.</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map(assignment => {
                const StatusIcon = statusIcons[assignment.status]
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            assignment.createdDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.clientName}</p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{assignment.clientAddress}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{assignment.serviceType}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.technicianName ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-sm">
                            {assignment.technicianName}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline">Sin asignar</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[assignment.priority]}>
                        {assignment.priority === 'low' && 'Baja'}
                        {assignment.priority === 'medium' && 'Media'}
                        {assignment.priority === 'high' && 'Alta'}
                        {assignment.priority === 'urgent' && 'Urgente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[assignment.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {assignment.status === 'pending' && 'Pendiente'}
                        {assignment.status === 'assigned' && 'Asignado'}
                        {assignment.status === 'in_progress' && 'En Progreso'}
                        {assignment.status === 'completed' && 'Completado'}
                        {assignment.status === 'cancelled' && 'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          {new Date(
                            assignment.scheduledDate
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground">
                          {new Date(
                            assignment.scheduledDate
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{assignment.estimatedDuration}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                        {assignment.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            Asignar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Asignación</DialogTitle>
            <DialogDescription>
              Crear una nueva asignación de trabajo para un técnico.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Funcionalidad de asignación en desarrollo...
            </p>
            <Button onClick={() => setIsAssignDialogOpen(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
