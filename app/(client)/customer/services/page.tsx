/**
 * Página de Servicios Activos - Portal Cliente
 * Vista de servicios en progreso y programados
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  User,
  RefreshCw,
} from 'lucide-react'

// Mock data para servicios del cliente
const customerServices = [
  {
    id: 'SRV-001',
    type: 'Reparación Lavadora',
    status: 'in_progress',
    priority: 'high',
    technician: {
      name: 'Juan Pérez',
      phone: '+57 300 123 4567',
      rating: 4.8,
      photo: '/placeholder-user.jpg',
    },
    scheduledDate: '2025-10-07T14:00:00',
    estimatedDuration: '2 horas',
    actualStartTime: '2025-10-07T14:15:00',
    address: 'Calle 123 #45-67, Bogotá Norte',
    description: 'Lavadora no centrifuga correctamente',
    progress: 75,
    lastUpdate: '2025-10-07T15:30:00',
    cost: 120000,
    parts: ['Correa de transmisión', 'Rodamientos'],
    notes: [
      { time: '14:15', message: 'Técnico llegó al sitio' },
      { time: '14:30', message: 'Diagnóstico inicial completado' },
      { time: '15:00', message: 'Iniciando reemplazo de partes' },
      { time: '15:30', message: 'Instalación de nueva correa completada' },
    ],
  },
  {
    id: 'SRV-002',
    type: 'Mantenimiento Aire Acondicionado',
    status: 'scheduled',
    priority: 'medium',
    technician: {
      name: 'Ana López',
      phone: '+57 300 234 5678',
      rating: 4.6,
      photo: '/placeholder-user.jpg',
    },
    scheduledDate: '2025-10-08T09:00:00',
    estimatedDuration: '1.5 horas',
    address: 'Calle 123 #45-67, Bogotá Norte',
    description: 'Mantenimiento preventivo programado',
    cost: 85000,
    parts: ['Filtros', 'Refrigerante R410A'],
  },
  {
    id: 'SRV-003',
    type: 'Reparación Refrigerador',
    status: 'confirmed',
    priority: 'urgent',
    technician: {
      name: 'Carlos Ruiz',
      phone: '+57 300 345 6789',
      rating: 4.2,
      photo: '/placeholder-user.jpg',
    },
    scheduledDate: '2025-10-07T16:00:00',
    estimatedDuration: '3 horas',
    address: 'Calle 123 #45-67, Bogotá Norte',
    description: 'Refrigerador no enfría, posible fuga de refrigerante',
    cost: 180000,
    parts: ['Compresor', 'Termostato', 'Refrigerante'],
  },
]

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  on_hold: 'bg-gray-100 text-gray-800',
}

const statusIcons = {
  scheduled: Calendar,
  confirmed: CheckCircle,
  in_progress: PlayCircle,
  completed: CheckCircle,
  cancelled: XCircle,
  on_hold: Clock,
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

export default function CustomerServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedService, setSelectedService] = useState<
    (typeof customerServices)[0] | null
  >(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredServices = customerServices.filter(service => {
    const matchesSearch =
      service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || service.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openDetailDialog = (service: (typeof customerServices)[0]) => {
    setSelectedService(service)
    setIsDetailDialogOpen(true)
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      scheduled: 'Programado',
      confirmed: 'Confirmado',
      in_progress: 'En Progreso',
      completed: 'Completado',
      cancelled: 'Cancelado',
      on_hold: 'En Espera',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getPriorityText = (priority: string) => {
    const priorityMap = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    }
    return priorityMap[priority as keyof typeof priorityMap] || priority
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Mis Servicios</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Estado y seguimiento de tus servicios activos
          </p>
        </div>
        <Button onClick={() => window.location.reload()} size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Servicios
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerServices.length}</div>
            <p className="text-xs text-muted-foreground">En mi lista</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerServices.filter(s => s.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">Trabajando ahora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programados</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                customerServices.filter(
                  s => s.status === 'scheduled' || s.status === 'confirmed'
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Próximos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerServices.filter(s => s.priority === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Atención prioritaria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] h-9 text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="scheduled">Programado</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map(service => {
          const StatusIcon =
            statusIcons[service.status as keyof typeof statusIcons]
          const isToday =
            new Date(service.scheduledDate).toDateString() ===
            new Date().toDateString()

          return (
            <Card
              key={service.id}
              className={`${isToday ? 'border-primary shadow-md' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{service.type}</h3>
                      {isToday && (
                        <Badge
                          variant="outline"
                          className="bg-primary text-primary-foreground"
                        >
                          Hoy
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.id}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge
                      className={
                        priorityColors[
                          service.priority as keyof typeof priorityColors
                        ]
                      }
                    >
                      {getPriorityText(service.priority)}
                    </Badge>
                    <Badge
                      className={
                        statusColors[
                          service.status as keyof typeof statusColors
                        ]
                      }
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {getStatusText(service.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Service Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {service.technician.name}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm">
                            {service.technician.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(service.scheduledDate).toLocaleDateString()}{' '}
                          -{' '}
                          {new Date(service.scheduledDate).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Duración: {service.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{service.address}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm mb-3">{service.description}</p>
                      <p className="text-sm font-medium mb-2">
                        Costo estimado: ${service.cost.toLocaleString()}
                      </p>
                      {service.parts && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Partes incluidas:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {service.parts.map((part, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {part}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for In Progress Services */}
                  {service.status === 'in_progress' && service.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso del servicio</span>
                        <span>{service.progress}%</span>
                      </div>
                      <Progress value={service.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Última actualización:{' '}
                        {new Date(service.lastUpdate!).toLocaleTimeString()}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailDialog(service)}
                    >
                      Ver Detalles
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${service.technician.phone}`}>
                        <Phone className="w-4 h-4 mr-1" />
                        Llamar Técnico
                      </a>
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <a href="/customer/messages">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Mensajes
                      </a>
                    </Button>

                    {(service.status === 'scheduled' ||
                      service.status === 'confirmed') && (
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Reprogramar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay servicios</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron servicios con los filtros aplicados'
                : 'No tienes servicios activos en este momento'}
            </p>
            <Button
              onClick={() => (window.location.href = '/customer/request')}
            >
              Solicitar Nuevo Servicio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Service Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Detalles del Servicio - {selectedService?.id}
            </DialogTitle>
            <DialogDescription>
              Información completa y seguimiento del servicio
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              {/* Service Overview */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Información del Servicio</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Tipo:</strong> {selectedService.type}
                    </p>
                    <p>
                      <strong>Estado:</strong>
                      <Badge
                        className={`ml-2 ${
                          statusColors[
                            selectedService.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {getStatusText(selectedService.status)}
                      </Badge>
                    </p>
                    <p>
                      <strong>Prioridad:</strong>
                      <Badge
                        className={`ml-2 ${
                          priorityColors[
                            selectedService.priority as keyof typeof priorityColors
                          ]
                        }`}
                      >
                        {getPriorityText(selectedService.priority)}
                      </Badge>
                    </p>
                    <p>
                      <strong>Descripción:</strong>{' '}
                      {selectedService.description}
                    </p>
                    <p>
                      <strong>Costo:</strong> $
                      {selectedService.cost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Técnico Asignado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedService.technician.photo}
                        alt={selectedService.technician.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {selectedService.technician.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>
                            {selectedService.technician.rating} estrellas
                          </span>
                        </div>
                      </div>
                    </div>
                    <p>
                      <strong>Teléfono:</strong>{' '}
                      {selectedService.technician.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div>
                <h4 className="font-medium mb-3">Programación</h4>
                <div className="grid gap-2 text-sm">
                  <p>
                    <strong>Fecha programada:</strong>{' '}
                    {new Date(selectedService.scheduledDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Duración estimada:</strong>{' '}
                    {selectedService.estimatedDuration}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {selectedService.address}
                  </p>
                  {selectedService.actualStartTime && (
                    <p>
                      <strong>Hora real de inicio:</strong>{' '}
                      {new Date(
                        selectedService.actualStartTime
                      ).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Parts */}
              {selectedService.parts && (
                <div>
                  <h4 className="font-medium mb-3">Partes y Materiales</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.parts.map((part, index) => (
                      <Badge key={index} variant="secondary">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Notes */}
              {selectedService.notes && (
                <div>
                  <h4 className="font-medium mb-3">Seguimiento del Servicio</h4>
                  <div className="space-y-2">
                    {selectedService.notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-2 bg-muted/50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{note.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {note.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Cerrar
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar Técnico
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
