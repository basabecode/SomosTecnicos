/**
 * Página de Asignaciones - Panel Admin
 * Vista completa de todas las asignaciones del sistema
 */

'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Calendar, User, MapPin, Clock, Search, Filter } from 'lucide-react'

interface Assignment {
  id: string
  orderNumber: string
  clientName: string
  technicianName: string
  technicianId: string
  assignedDate: string
  scheduledDate: string
  status: 'assigned' | 'in_progress' | 'completed' | 'canceled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  location: string
  estimatedDuration: string
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    clientName: 'María García',
    technicianName: 'Juan Pérez',
    technicianId: 'TECH-001',
    assignedDate: '2024-01-15',
    scheduledDate: '2024-01-16',
    status: 'assigned',
    priority: 'high',
    location: 'Bogotá',
    estimatedDuration: '2 horas',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    clientName: 'Carlos Rodríguez',
    technicianName: 'Ana López',
    technicianId: 'TECH-002',
    assignedDate: '2024-01-14',
    scheduledDate: '2024-01-15',
    status: 'in_progress',
    priority: 'medium',
    location: 'Medellín',
    estimatedDuration: '1.5 horas',
  },
]

const statusColors = {
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

export default function AdminAssignments() {
  const [assignments] = useState<Assignment[]>(mockAssignments)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAssignments = assignments.filter(
    assignment =>
      assignment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Asignaciones</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Nueva Asignación
          </Button>
        </div>
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Activas ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completadas Hoy
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">+3 vs ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Técnicos Activos
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">De 15 total</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar asignaciones..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Asignaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Duración Est.</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map(assignment => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.orderNumber}
                  </TableCell>
                  <TableCell>{assignment.clientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>{assignment.technicianName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.scheduledDate}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[assignment.status]}>
                      {assignment.status === 'assigned' && 'Asignado'}
                      {assignment.status === 'in_progress' && 'En Progreso'}
                      {assignment.status === 'completed' && 'Completado'}
                      {assignment.status === 'canceled' && 'Cancelado'}
                    </Badge>
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
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{assignment.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.estimatedDuration}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
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
