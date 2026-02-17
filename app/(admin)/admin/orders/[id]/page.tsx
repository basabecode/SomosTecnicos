/**
 * Página de Detalles de Orden
 * Vista completa de una orden específica con toda la información
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProtectedRoute } from '@/contexts/auth-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Edit,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Wrench,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  UserCheck,
  Truck,
  Settings,
  ClipboardCheck,
} from 'lucide-react'


interface OrderDetail {
  id: string
  numeroOrden: string
  nombre: string
  telefono: string
  email: string
  ciudad: string
  direccion: string
  tipoElectrodomestico: string
  tipoServicio: string
  estado: string
  urgencia: string
  descripcionProblema: string
  createdAt: string
  updatedAt: string
  assignments: {
    id: number
    assignedAt: string
    technician: {
      id: number
      nombre: string
      telefono: string
      especialidades: string[]
    }
  }[]
  costoEstimado?: number
  costoFinal?: number
  fechaVisita?: string
  horaVisita?: string
  notasInternas?: string
  observacionesTecnico?: string
  estatusHistorial?: Array<{
    estado: string
    fecha: string
    usuario: string
    notas?: string
  }>
}


const statusColors = {
  pendiente: 'bg-orange-100 text-orange-800 border-orange-200',
  asignado: 'bg-blue-100 text-blue-800 border-blue-200',
  en_camino: 'bg-purple-100 text-purple-800 border-purple-200',
  revisado: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  cotizado: 'bg-pink-100 text-pink-800 border-pink-200',
  en_proceso: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  esperando_repuestos: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reparado: 'bg-teal-100 text-teal-800 border-teal-200',
  entregado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completado: 'bg-green-100 text-green-800 border-green-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
  reagendado: 'bg-gray-100 text-gray-800 border-gray-200',
}

const statusIcons = {
  pendiente: Clock,
  asignado: UserCheck,
  en_camino: Truck,
  revisado: ClipboardCheck,
  cotizado: DollarSign,
  en_proceso: Settings,
  esperando_repuestos: AlertTriangle,
  reparado: Wrench,
  entregado: CheckCircle,
  completado: CheckCircle,
  cancelado: XCircle,
  reagendado: Calendar,
}

const statusLabels = {
  pendiente: 'Pendiente',
  asignado: 'Asignado',
  en_camino: 'En Camino',
  revisado: 'Revisado',
  cotizado: 'Cotizado',
  en_proceso: 'En Proceso',
  esperando_repuestos: 'Esperando Repuestos',
  reparado: 'Reparado',
  entregado: 'Entregado',
  completado: 'Completado',
  cancelado: 'Cancelado',
  reagendado: 'Reagendado',
}

const urgencyColors = {
  baja: 'text-green-600',
  media: 'text-orange-600',
  alta: 'text-red-600',
}

const urgencyLabels = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNotes, setStatusNotes] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchOrderDetail(params.id as string)
    }
  }, [params.id])

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.data)
        setNewStatus(data.data.estado)
      } else {
        // Mock data para demostración
        const mockOrder: OrderDetail = {
          id: orderId,
          numeroOrden: `ORD-${orderId.padStart(3, '0')}`,
          nombre: 'María García Rodríguez',
          telefono: '+573001234567',
          email: 'maria.garcia@email.com',
          ciudad: 'Bogotá',
          direccion: 'Calle 123 #45-67, Apartamento 302, Chapinero',
          tipoElectrodomestico: 'nevera',
          tipoServicio: 'reparacion',
          estado: 'en_proceso',
          urgencia: 'alta',
          descripcionProblema:
            'La nevera no enfría correctamente. Hace ruidos extraños y se escucha como si el motor trabajara de más. El problema comenzó hace 3 días.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          assignments: [{
            id: 1,
            assignedAt: new Date(Date.now() - 43200000).toISOString(),
            technician: {
              id: 1,
              nombre: 'Juan Carlos Pérez',
              telefono: '+573005551234',
              especialidades: ['nevera', 'lavadora', 'estufa'],
            },
          }],
          costoEstimado: 180000,
          fechaVisita: '2024-01-15',
          horaVisita: '14:00',
          notasInternas:
            'Cliente prefiere horarios de tarde. Apartamento en segundo piso.',
          observacionesTecnico:
            'Problema con el termostato. Requiere repuesto específico para modelo Samsung.',
          estatusHistorial: [
            {
              estado: 'pendiente',
              fecha: new Date(Date.now() - 86400000).toISOString(),
              usuario: 'Sistema',
              notas: 'Orden creada automáticamente',
            },
            {
              estado: 'asignado',
              fecha: new Date(Date.now() - 43200000).toISOString(),
              usuario: 'Admin',
              notas: 'Asignado a Juan Carlos Pérez por especialidad en neveras',
            },
            {
              estado: 'en_proceso',
              fecha: new Date(Date.now() - 3600000).toISOString(),
              usuario: 'Juan Carlos Pérez',
              notas: 'Iniciando diagnóstico en sitio',
            },
          ],
        }
        setOrder(mockOrder)
        setNewStatus(mockOrder.estado)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!order || !newStatus || newStatus === order.estado) return

    try {
      setUpdatingStatus(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          estado: newStatus,
          notas: statusNotes,
        }),
      })

      if (response.ok) {
        // Actualizar orden localmente
        setOrder(prev =>
          prev
            ? {
                ...prev,
                estado: newStatus,
                updatedAt: new Date().toISOString(),
                estatusHistorial: [
                  ...(prev.estatusHistorial || []),
                  {
                    estado: newStatus,
                    fecha: new Date().toISOString(),
                    usuario: 'Admin',
                    notas: statusNotes || undefined,
                  },
                ],
              }
            : null
        )
        setStatusNotes('')
      } else {
        // Mock update para demostración
        setOrder(prev =>
          prev
            ? {
                ...prev,
                estado: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : null
        )
        setStatusNotes('')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <ProtectedRoute
        requiredRoles={['super_admin', 'admin', 'technician_manager']}
      >
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-muted rounded mb-2"></div>
            <div className="h-4 w-96 bg-muted rounded"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!order) {
    return (
      <ProtectedRoute
        requiredRoles={['super_admin', 'admin', 'technician_manager']}
      >
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Orden no encontrada</h2>
          <p className="text-muted-foreground">
            La orden solicitada no existe o no tienes permisos para verla.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Órdenes
            </Link>
          </Button>
        </div>
      </ProtectedRoute>
    )
  }

  const StatusIcon = statusIcons[order.estado as keyof typeof statusIcons]

  return (
    <ProtectedRoute
      requiredRoles={['super_admin', 'admin', 'technician_manager']}
    >
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header - Responsive */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
            <Button variant="ghost" asChild className="w-fit">
              <Link href="/admin/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {order.numeroOrden}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Orden creada el {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge
              variant="outline"
              className={`${
                statusColors[order.estado as keyof typeof statusColors]
              } text-sm px-3 py-1 w-fit`}
            >
              <StatusIcon className="mr-1 h-4 w-4" />
              {statusLabels[order.estado as keyof typeof statusLabels]}
            </Badge>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/admin/orders/${order.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-lg font-semibold">{order.nombre}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </label>
                  <p className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    {order.telefono}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="flex items-center text-sm break-all">
                    <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{order.email}</span>
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Ciudad
                </label>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {order.ciudad}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Dirección
                </label>
                <p>{order.direccion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Información del Servicio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="mr-2 h-5 w-5" />
                Información del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Electrodoméstico
                  </label>
                  <p className="capitalize font-semibold">
                    {order.tipoElectrodomestico}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tipo de Servicio
                  </label>
                  <p className="capitalize font-semibold">
                    {order.tipoServicio}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Urgencia
                </label>
                <Badge
                  variant="outline"
                  className={`${
                    urgencyColors[order.urgencia as keyof typeof urgencyColors]
                  } border-current`}
                >
                  {urgencyLabels[order.urgencia as keyof typeof urgencyLabels]}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción del Problema
                </label>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {order.descripcionProblema}
                </p>
              </div>
              {order.fechaVisita && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de Visita
                    </label>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(order.fechaVisita)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Hora
                    </label>
                    <p className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {order.horaVisita}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Técnico */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center text-lg font-semibold">
                <UserCheck className="mr-2 h-5 w-5" />
                Técnico Asignado
              </CardTitle>
              <Button variant="outline" size="sm" asChild className="ml-auto bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
                  <Link href={`/admin/orders/${order.id}/assign`}>
                  {(() => {
                    const activeAssignment = order.assignments?.find(a => ['asignado', 'en_proceso'].includes(order.estado)) || order.assignments?.[0];
                    return activeAssignment ? (
                    <>
                      <Edit className="mr-2 h-3 w-3" />
                      Cambiar
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-3 w-3" />
                      Asignar
                    </>
                  )
                  })()}
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {(() => {
                 const activeAssignment = order.assignments?.find(a => ['asignado', 'en_proceso'].includes(order.estado)) || order.assignments?.[0];
                 const tech = activeAssignment?.technician;

                 return tech ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre
                    </label>
                    <p className="text-lg font-semibold">
                      {tech.nombre}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Teléfono
                    </label>
                    <p className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {tech.telefono}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Especialidades
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tech.especialidades.map(
                        (especialidad, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {especialidad}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  {activeAssignment && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                        Asignado el
                        </label>
                        <p>{formatDateTime(activeAssignment.assignedAt)}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed">
                  <UserCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">No hay técnico asignado a esta orden.</p>
                  <Button variant="link" asChild className="mt-1 text-[#A50034]">
                     <Link href={`/admin/orders/${order.id}/assign`}>Asignar ahora</Link>
                  </Button>
                </div>
              )
              })()}
            </CardContent>
          </Card>

          {/* Información de Costos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Información de Costos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.costoEstimado && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Costo Estimado
                  </label>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(order.costoEstimado)}
                  </p>
                </div>
              )}
              {order.costoFinal && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Costo Final
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(order.costoFinal)}
                  </p>
                </div>
              )}
              {!order.costoEstimado && !order.costoFinal && (
                <p className="text-muted-foreground">
                  Sin información de costos disponible
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actualizar Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Actualizar Estado</CardTitle>
            <CardDescription>
              Cambia el estado de la orden y agrega notas si es necesario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Nuevo Estado</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="asignado">Asignado</SelectItem>
                    <SelectItem value="en_camino">En Camino</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="esperando_repuestos">
                      Esperando Repuestos
                    </SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="reagendado">Reagendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={updatingStatus || newStatus === order.estado}
                className="w-full mt-2"
              >
                {updatingStatus ? 'Actualizando...' : 'Actualizar Estado'}
              </Button>
            </div>
            <div>
              <label className="text-sm font-medium">
                Notas del Cambio (Opcional)
              </label>
              <Textarea
                placeholder="Agrega notas sobre el cambio de estado..."
                value={statusNotes}
                onChange={e => setStatusNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas y Observaciones */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {order.notasInternas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Notas Internas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {order.notasInternas}
                </p>
              </CardContent>
            </Card>
          )}

          {order.observacionesTecnico && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Observaciones del Técnico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {order.observacionesTecnico}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Historial de Estados */}
        {order.estatusHistorial && order.estatusHistorial.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de Estados</CardTitle>
              <CardDescription>
                Registro cronológico de todos los cambios de estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.estatusHistorial.map((historial, index) => {
                  const HistoriaIcon =
                    statusIcons[historial.estado as keyof typeof statusIcons]
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full flex-shrink-0 ${
                          statusColors[
                            historial.estado as keyof typeof statusColors
                          ]
                        }`}
                      >
                        <HistoriaIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div>
                            <p className="font-medium text-sm md:text-base">
                              {
                                statusLabels[
                                  historial.estado as keyof typeof statusLabels
                                ]
                              }
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              por {historial.usuario}
                            </p>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                            {formatDateTime(historial.fecha)}
                          </p>
                        </div>
                        {historial.notas && (
                          <p className="text-sm mt-1 bg-muted p-2 rounded">
                            {historial.notas}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
