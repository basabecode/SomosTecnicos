'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Download,
  Eye,
} from 'lucide-react'

interface HistoryService {
  id: string
  orderNumber: string
  serviceType: string
  appliance: string
  brand: string
  model: string
  status: 'completed' | 'cancelled'
  technician: string
  date: string
  completedDate?: string
  cost: number
  rating?: number
  description: string
  warranty: {
    active: boolean
    expiresAt: string
  }
}

const mockHistoryServices: HistoryService[] = [
  {
    id: 'HIST-001',
    orderNumber: 'ORD-2024-0123',
    serviceType: 'Reparación',
    appliance: 'Lavadora',
    brand: 'LG',
    model: 'WM3488HW',
    status: 'completed',
    technician: 'Carlos Mendoza',
    date: '2024-01-15',
    completedDate: '2024-01-16',
    cost: 280000,
    rating: 5,
    description: 'Reparación de bomba de drenaje y reemplazo de mangueras',
    warranty: {
      active: true,
      expiresAt: '2024-04-16',
    },
  },
  {
    id: 'HIST-002',
    orderNumber: 'ORD-2024-0089',
    serviceType: 'Mantenimiento',
    appliance: 'Nevera',
    brand: 'Samsung',
    model: 'RF23R6201SR',
    status: 'completed',
    technician: 'Ana Rodríguez',
    date: '2023-12-10',
    completedDate: '2023-12-10',
    cost: 150000,
    rating: 4,
    description: 'Mantenimiento preventivo y limpieza de condensador',
    warranty: {
      active: false,
      expiresAt: '2024-03-10',
    },
  },
  {
    id: 'HIST-003',
    orderNumber: 'ORD-2023-0567',
    serviceType: 'Reparación',
    appliance: 'Microondas',
    brand: 'Panasonic',
    model: 'NN-SB428S',
    status: 'cancelled',
    technician: 'Juan Torres',
    date: '2023-11-20',
    cost: 0,
    description: 'Servicio cancelado por cliente - equipo irreparable',
    warranty: {
      active: false,
      expiresAt: '2024-02-20',
    },
  },
]

export default function CustomerHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'cancelled'
  >('all')

  const filteredServices = mockHistoryServices.filter(service => {
    const matchesSearch =
      service.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.technician.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || service.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return null
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Historial de Servicios
        </h1>
        <p className="text-gray-600 mt-2">
          Revisa todos tus servicios técnicos anteriores
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Número de orden, electrodoméstico, marca..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('completed')}
                >
                  Completados
                </Button>
                <Button
                  variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('cancelled')}
                >
                  Cancelados
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron servicios
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros de búsqueda
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredServices.map(service => (
            <Card key={service.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {service.appliance} {service.brand} {service.model}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Orden #{service.orderNumber} • {service.serviceType}
                    </CardDescription>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-600">Técnico</Label>
                    <p className="font-medium">{service.technician}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">
                      Fecha de Solicitud
                    </Label>
                    <p className="font-medium">
                      {new Date(service.date).toLocaleDateString('es-CO')}
                    </p>
                  </div>

                  {service.completedDate && (
                    <div>
                      <Label className="text-xs text-gray-600">
                        Fecha de Finalización
                      </Label>
                      <p className="font-medium">
                        {new Date(service.completedDate).toLocaleDateString(
                          'es-CO'
                        )}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-gray-600">Costo Total</Label>
                    <p className="font-medium text-green-600">
                      ${service.cost.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-xs text-gray-600">
                    Descripción del Servicio
                  </Label>
                  <p className="text-sm mt-1">{service.description}</p>
                </div>

                {service.rating && (
                  <div>
                    <Label className="text-xs text-gray-600">
                      Tu Calificación
                    </Label>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(service.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {service.rating}/5
                      </span>
                    </div>
                  </div>
                )}

                {/* Warranty Info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {service.warranty.active ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {service.warranty.active
                          ? 'Garantía Activa'
                          : 'Garantía Vencida'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Vence:{' '}
                        {new Date(
                          service.warranty.expiresAt
                        ).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    {service.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Factura
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {mockHistoryServices.filter(s => s.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Servicios Completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {(
                mockHistoryServices
                  .filter(s => s.rating)
                  .reduce((acc, s) => acc + (s.rating || 0), 0) /
                  mockHistoryServices.filter(s => s.rating).length || 0
              ).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Calificación Promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Badge className="h-8 w-8 bg-blue-100 text-blue-600 mx-auto mb-2 flex items-center justify-center">
              $
              {Math.floor(
                mockHistoryServices.reduce((acc, s) => acc + s.cost, 0) / 1000
              )}
              K
            </Badge>
            <p className="text-2xl font-bold">
              $
              {mockHistoryServices
                .reduce((acc, s) => acc + s.cost, 0)
                .toLocaleString('es-CO')}
            </p>
            <p className="text-sm text-gray-600">Total Invertido</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
