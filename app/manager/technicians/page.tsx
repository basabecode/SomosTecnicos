/**
 * Página de Técnicos - Panel Manager
 * Gestión de técnicos bajo supervisión del manager
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
  Search,
  Filter,
  Plus,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

interface Technician {
  id: string
  name: string
  email: string
  phone: string
  specialties: string[]
  location: string
  status: 'active' | 'inactive' | 'busy' | 'available'
  rating: number
  totalJobs: number
  completedJobs: number
  currentJobs: number
  joinDate: string
  lastSeen: string
}

const mockTechnicians: Technician[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@somostecnicos.com',
    phone: '+57 300 123 4567',
    specialties: ['Electrodomésticos', 'Aires Acondicionados'],
    location: 'Norte de Bogotá',
    status: 'active',
    rating: 4.8,
    totalJobs: 45,
    completedJobs: 42,
    currentJobs: 3,
    joinDate: '2023-06-15',
    lastSeen: '2024-01-16T10:30:00',
  },
  {
    id: '2',
    name: 'Ana López',
    email: 'ana@somostecnicos.com',
    phone: '+57 300 234 5678',
    specialties: ['Lavadoras', 'Refrigeradores'],
    location: 'Sur de Bogotá',
    status: 'busy',
    rating: 4.6,
    totalJobs: 38,
    completedJobs: 36,
    currentJobs: 2,
    joinDate: '2023-08-20',
    lastSeen: '2024-01-16T09:15:00',
  },
  {
    id: '3',
    name: 'Carlos Ruiz',
    email: 'carlos@somostecnicos.com',
    phone: '+57 300 345 6789',
    specialties: ['Hornos', 'Microondas'],
    location: 'Centro de Bogotá',
    status: 'available',
    rating: 4.2,
    totalJobs: 28,
    completedJobs: 25,
    currentJobs: 1,
    joinDate: '2023-09-10',
    lastSeen: '2024-01-16T08:45:00',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  busy: 'bg-yellow-100 text-yellow-800',
  available: 'bg-blue-100 text-blue-800',
}

const statusIcons = {
  active: CheckCircle,
  inactive: XCircle,
  busy: AlertCircle,
  available: CheckCircle,
}

export default function TechniciansPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')

  const filteredTechnicians = mockTechnicians.filter(tech => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tech.status === statusFilter
    const matchesLocation =
      locationFilter === 'all' || tech.location.includes(locationFilter)

    return matchesSearch && matchesStatus && matchesLocation
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Gestión de Técnicos
        </h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Técnico
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Técnicos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTechnicians.length}</div>
            <p className="text-xs text-muted-foreground">En tu equipo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTechnicians.filter(t => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Técnicos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTechnicians.filter(t => t.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">Listos para asignar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                mockTechnicians.reduce((acc, t) => acc + t.rating, 0) /
                mockTechnicians.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Calificación general
            </p>
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
                  placeholder="Buscar técnicos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="busy">Ocupado</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las zonas</SelectItem>
                <SelectItem value="Norte">Norte</SelectItem>
                <SelectItem value="Sur">Sur</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
                <SelectItem value="Occidente">Occidente</SelectItem>
                <SelectItem value="Oriente">Oriente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Technicians Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Técnicos ({filteredTechnicians.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Técnico</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Trabajos</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map(tech => {
                const StatusIcon = statusIcons[tech.status]
                return (
                  <TableRow key={tech.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {tech.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {tech.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{tech.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{tech.phone}</span>
                        </div>
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
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{tech.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[tech.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {tech.status === 'active' && 'Activo'}
                        {tech.status === 'inactive' && 'Inactivo'}
                        {tech.status === 'busy' && 'Ocupado'}
                        {tech.status === 'available' && 'Disponible'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">
                          {tech.rating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {tech.completedJobs}/{tech.totalJobs}
                        </p>
                        <p className="text-muted-foreground">
                          {tech.currentJobs} activos
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(tech.lastSeen).toLocaleDateString()}
                        <br />
                        <span className="text-muted-foreground">
                          {new Date(tech.lastSeen).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
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
    </div>
  )
}
