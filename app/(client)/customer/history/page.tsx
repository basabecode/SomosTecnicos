'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistoryService {
  id: string
  orderNumber: string
  serviceType: string
  appliance: string
  brand: string
  model: string
  status: string
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

export default function CustomerHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled'>('all')
  const [services, setServices] = useState<HistoryService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      // Fetch all orders, filtering for completed/cancelled could be done API side but let's fetch recent
      // The API supports status filter, but we want "history" which implies completed/cancelled usually,
      // but the UI filter allows "all". Let's fetch a reasonable limit.
      const response = await fetch('/api/orders?limit=50', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
           const mappedServices: HistoryService[] = data.data.orders.map((order: any) => {
              // Find active technician from assignments
              const activeAssignment = order.assignments?.find((a: any) =>
                ['asignado', 'en_proceso', 'completado'].includes(a.estado)
              ) || order.assignments?.[0];

              const technicianName = activeAssignment?.technician?.nombre || 'Sin asignar';

              // Mock warranty logic (3 months from creation or completion)
              const date = new Date(order.createdAt);
              const warrantyExpires = new Date(date);
              warrantyExpires.setMonth(date.getMonth() + 3);
              const isWarrantyActive = new Date() < warrantyExpires && order.estado === 'completado';

              return {
                id: order.id,
                orderNumber: order.orderNumber,
                serviceType: order.tipoServicio,
                appliance: order.tipoElectrodomestico,
                brand: order.marca || 'N/A',
                model: order.modelo || 'N/A',
                status: order.estado,
                technician: technicianName,
                date: order.createdAt,
                completedDate: order.estado === 'completado' ? order.updatedAt : undefined,
                cost: Number(order.costoFinal) || Number(order.costoEstimado) || 0,
                rating: undefined, // Rating logic would need another table/field
                description: order.descripcionProblema,
                warranty: {
                  active: isWarrantyActive,
                  expiresAt: warrantyExpires.toISOString()
                }
              }
           });
           setServices(mappedServices);
        }
      }
    } catch (err) {
      console.error(err)
      setError('Error cargando el historial')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.technician.toLowerCase().includes(searchTerm.toLowerCase())

    // Map internal status to filter
    const isCompleted = service.status === 'completado';
    const isCancelled = service.status === 'cancelado';

    let matchesStatus = true;
    if (statusFilter === 'completed') matchesStatus = isCompleted;
    if (statusFilter === 'cancelled') matchesStatus = isCancelled;

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completado':
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
      case 'cancelado':
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
        return (
           <Badge variant="outline" className="bg-gray-100 text-gray-700">
             {status.replace('_', ' ')}
           </Badge>
        )
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

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando historial...</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          Historial de Servicios
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Revisa todos tus servicios técnicos anteriores
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="py-3 md:py-6">
          <CardTitle className="text-base md:text-lg">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs md:text-sm">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Número de orden, electrodoméstico, marca..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs md:text-sm">Estado</Label>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="h-9 text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('completed')}
                  className="h-9 text-xs"
                >
                  Completados
                </Button>
                <Button
                  variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('cancelled')}
                  className="h-9 text-xs"
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
                          : service.status === 'completado' ? 'Garantía Vencida' : 'Garantía Pendiente'}
                      </p>
                      {service.status === 'completado' && (
                        <p className="text-xs text-gray-600">
                            Vence:{' '}
                            {new Date(
                            service.warranty.expiresAt
                            ).toLocaleDateString('es-CO')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                    {service.status === 'completado' && (
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
              {services.filter(s => s.status === 'completado').length}
            </p>
            <p className="text-sm text-gray-600">Servicios Completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {(
                services
                  .filter(s => s.rating)
                  .reduce((acc, s) => acc + (s.rating || 0), 0) /
                  (services.filter(s => s.rating).length || 1)
              ).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Calificación Promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Badge className="h-8 w-8 bg-blue-100 text-blue-600 mx-auto mb-2 flex items-center justify-center">
              $
            </Badge>
            <p className="text-2xl font-bold">
              $
              {services
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
