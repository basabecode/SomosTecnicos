/**
 * Página de Servicios Activos - Portal Cliente
 * Vista de servicios en progreso, cotizaciones pendientes y programados
 */

'use client'

import { useState, useEffect } from 'react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  Loader2,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Wrench,
  PackageSearch,
} from 'lucide-react'

// Formato de pesos colombianos: $50.000
const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

// Interface de la orden raw de la API
interface OrderRaw {
  id: string
  orderNumber: string
  estado: string
  tipoServicio: string
  tipoElectrodomestico: string
  descripcionProblema: string
  direccion: string
  fechaPreferida: string | null
  costoEstimado: number | null
  costoFinal: number | null
  createdAt: string
  updatedAt: string
  assignments?: {
    estado: string
    technician?: {
      nombre: string
      telefono: string
      calificacionPromedio?: number
    } | null
    notasTecnico?: string | null
  }[]
  visitReports?: {
    diagnostico: string
    resultado: string
    costoVisita: number
    costoReparacion: number | null
    costoRepuestos: number | null
    costoTotal: number
    recomendaciones?: string | null
  }[]
}

interface Service {
  id: string          // orderNumber (display)
  orderId: string     // id interno de la BD
  rawEstado: string   // estado real de la BD
  uiStatus: string    // estado mapeado para UI
  type: string
  technician: { name: string; phone: string; rating: number }
  scheduledDate: string
  address: string
  description: string
  progress: number
  lastUpdate: string
  // Costos
  costoEstimado: number | null
  costoFinal: number | null
  // Diagnóstico del técnico (de visitReports o historial)
  diagnosticoTecnico?: string
}

// ── Mapeo de estados ──────────────────────────────────────────────────────────

const STATUS_META: Record<string, {
  color: string
  icon: React.ElementType
  label: string
}> = {
  pendiente:           { color: 'bg-gray-100 text-gray-800',   icon: Clock,        label: 'Pendiente' },
  asignado:            { color: 'bg-blue-100 text-blue-800',   icon: Calendar,     label: 'Asignado' },
  en_camino:           { color: 'bg-indigo-100 text-indigo-800', icon: PlayCircle, label: 'Técnico en camino' },
  revisado:            { color: 'bg-cyan-100 text-cyan-800',   icon: Wrench,       label: 'Revisado' },
  cotizado:            { color: 'bg-amber-100 text-amber-800', icon: DollarSign,   label: 'Cotización pendiente' },
  en_proceso:          { color: 'bg-yellow-100 text-yellow-800', icon: PlayCircle, label: 'En proceso' },
  esperando_repuestos: { color: 'bg-orange-100 text-orange-800', icon: PackageSearch, label: 'Esperando repuestos' },
  reparado:            { color: 'bg-green-100 text-green-800', icon: CheckCircle,  label: 'Reparado' },
  entregado:           { color: 'bg-teal-100 text-teal-800',   icon: CheckCircle,  label: 'Entregado' },
  completado:          { color: 'bg-green-100 text-green-800', icon: CheckCircle,  label: 'Completado' },
  cancelado:           { color: 'bg-red-100 text-red-800',     icon: XCircle,      label: 'Cancelado' },
  reagendado:          { color: 'bg-purple-100 text-purple-800', icon: Calendar,   label: 'Reagendado' },
}

const getStatusMeta = (estado: string) =>
  STATUS_META[estado] ?? { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: estado }

// ── Componente principal ──────────────────────────────────────────────────────

export default function CustomerServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmReject, setConfirmReject] = useState<{ orderId: string; orderNumber: string } | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchServices = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/orders?limit=30', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const mapped: Service[] = data.data.orders.map((order: OrderRaw) => {
            const activeAssignment = order.assignments?.find(a =>
              ['asignado', 'en_camino', 'en_proceso', 'completado'].includes(a.estado)
            ) ?? order.assignments?.[0]

            const latestVisitReport = order.visitReports?.[0]

            return {
              id: order.orderNumber,
              orderId: order.id,
              rawEstado: order.estado,
              uiStatus: order.estado, // usamos el estado real directamente
              type: `${order.tipoServicio} — ${order.tipoElectrodomestico}`,
              technician: {
                name: activeAssignment?.technician?.nombre ?? 'Por asignar',
                phone: activeAssignment?.technician?.telefono ?? '',
                rating: activeAssignment?.technician?.calificacionPromedio ?? 0,
              },
              scheduledDate: order.fechaPreferida ?? order.createdAt,
              address: order.direccion,
              description: order.descripcionProblema,
              progress:
                order.estado === 'en_proceso' ? 60
                : order.estado === 'reparado' || order.estado === 'completado' ? 100
                : order.estado === 'asignado' ? 20
                : order.estado === 'en_camino' ? 40
                : 0,
              lastUpdate: order.updatedAt,
              costoEstimado: order.costoEstimado ? Number(order.costoEstimado) : null,
              costoFinal: order.costoFinal ? Number(order.costoFinal) : null,
              diagnosticoTecnico: latestVisitReport?.diagnostico ?? activeAssignment?.notasTecnico ?? undefined,
            }
          })
          setServices(mapped)
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  // ── Aprobar / Rechazar cotización ──────────────────────────────────────────

  const handleQuoteDecision = async (orderId: string, action: 'approve' | 'reject') => {
    setActionLoading(`${orderId}-${action}`)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (res.ok) {
        await fetchServices()
        setIsDetailDialogOpen(false)
        setConfirmReject(null)
      } else {
        const err = await res.json()
        alert(err.error ?? 'Error al procesar la acción')
      }
    } catch {
      alert('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setActionLoading(null)
    }
  }

  // ── Filtros ────────────────────────────────────────────────────────────────

  const filteredServices = services.filter(s => {
    const matchSearch =
      s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.rawEstado === statusFilter
    return matchSearch && matchStatus
  })

  const cotizacionesPendientes = services.filter(s => s.rawEstado === 'cotizado').length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Cargando tus servicios...</p>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Mis Servicios</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Estado y seguimiento de tus servicios
          </p>
        </div>
        <Button onClick={fetchServices} size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Banner de cotizaciones pendientes */}
      {cotizacionesPendientes > 0 && (
        <Card className="border-2 border-amber-400 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                {cotizacionesPendientes === 1
                  ? 'Tienes 1 cotización esperando tu respuesta'
                  : `Tienes ${cotizacionesPendientes} cotizaciones esperando tu respuesta`}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Revisa las tarjetas marcadas en ámbar y aprueba o rechaza cada cotización.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">En total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{cotizacionesPendientes}</div>
            <p className="text-xs text-muted-foreground">Esperan tu aprobación</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => ['en_proceso', 'asignado', 'en_camino'].includes(s.rawEstado)).length}
            </div>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => ['completado', 'reparado', 'entregado'].includes(s.rawEstado)).length}
            </div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por tipo o número de orden..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-50 h-9 text-sm">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="cotizado">Cotización pendiente</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="asignado">Asignado</SelectItem>
                <SelectItem value="en_camino">Técnico en camino</SelectItem>
                <SelectItem value="en_proceso">En proceso</SelectItem>
                <SelectItem value="reparado">Reparado</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de servicios */}
      <div className="space-y-4">
        {filteredServices.map(service => {
          const meta = getStatusMeta(service.rawEstado)
          const StatusIcon = meta.icon
          const isCotizado = service.rawEstado === 'cotizado'

          return (
            <Card
              key={service.id}
              className={isCotizado ? 'border-2 border-amber-400 shadow-md' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg leading-tight">{service.type}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Orden: {service.id}</p>
                  </div>
                  <Badge className={`${meta.color} shrink-0 flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {meta.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Datos básicos */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{service.technician.name}</span>
                      {service.technician.rating > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                          <Star className="w-3 h-3 fill-current" />
                          {service.technician.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{new Date(service.scheduledDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="line-clamp-1">{service.address}</span>
                    </div>
                  </div>

                  {/* Costo */}
                  <div className="space-y-1 text-sm">
                    {service.costoFinal !== null ? (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Costo final</p>
                        <p className="text-xl font-bold text-green-800 mt-0.5">{formatCOP(service.costoFinal)}</p>
                      </div>
                    ) : service.costoEstimado !== null ? (
                      <div className={`p-3 rounded-lg border ${isCotizado ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`text-xs font-medium uppercase tracking-wide ${isCotizado ? 'text-amber-700' : 'text-gray-600'}`}>
                          {isCotizado ? 'Cotización recibida' : 'Costo estimado'}
                        </p>
                        <p className={`text-xl font-bold mt-0.5 ${isCotizado ? 'text-amber-800' : 'text-gray-800'}`}>
                          {formatCOP(service.costoEstimado)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Panel de aprobación de cotización */}
                {isCotizado && service.costoEstimado !== null && (
                  <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 text-sm">El técnico envió una cotización de {formatCOP(service.costoEstimado)}</p>
                        {service.diagnosticoTecnico && (
                          <p className="text-xs text-amber-700 mt-1 line-clamp-2">
                            <strong>Diagnóstico:</strong> {service.diagnosticoTecnico}
                          </p>
                        )}
                        <p className="text-xs text-amber-700 mt-1.5">
                          Si rechazas, se cobrará únicamente el costo de la visita técnica.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                        disabled={actionLoading === `${service.orderId}-approve`}
                        onClick={() => handleQuoteDecision(service.orderId, 'approve')}
                      >
                        {actionLoading === `${service.orderId}-approve`
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <ThumbsUp className="w-3.5 h-3.5" />
                        }
                        Aprobar cotización
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 gap-1.5"
                        disabled={actionLoading === `${service.orderId}-reject`}
                        onClick={() => setConfirmReject({ orderId: service.orderId, orderNumber: service.id })}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Progress bar para servicios en proceso */}
                {['en_proceso', 'en_camino', 'asignado'].includes(service.rawEstado) && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progreso del servicio</span>
                      <span>{service.progress}%</span>
                    </div>
                    <Progress value={service.progress} className="h-2" />
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedService(service); setIsDetailDialogOpen(true) }}>
                    Ver detalles
                  </Button>
                  {service.technician.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${service.technician.phone}`}>
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        Llamar técnico
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/customer/messages?orderId=${service.orderId}`}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Mensajes
                    </a>
                  </Button>
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
            <Button onClick={() => (window.location.href = '/customer/request')}>
              Solicitar Nuevo Servicio
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de detalle */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Servicio — {selectedService?.id}</DialogTitle>
            <DialogDescription>Información completa y seguimiento</DialogDescription>
          </DialogHeader>

          {selectedService && (() => {
            const meta = getStatusMeta(selectedService.rawEstado)
            const StatusIcon = meta.icon
            const isCotizadoDetail = selectedService.rawEstado === 'cotizado'

            return (
              <div className="space-y-5 mt-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">Información del Servicio</h4>
                    <div className="space-y-1.5 text-sm">
                      <p><strong>Tipo:</strong> {selectedService.type}</p>
                      <p className="flex items-center gap-2">
                        <strong>Estado:</strong>
                        <Badge className={`${meta.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />{meta.label}
                        </Badge>
                      </p>
                      <p><strong>Descripción:</strong> {selectedService.description}</p>
                      <p><strong>Dirección:</strong> {selectedService.address}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">Técnico</h4>
                    <div className="space-y-1.5 text-sm">
                      <p><strong>Nombre:</strong> {selectedService.technician.name}</p>
                      {selectedService.technician.phone && (
                        <p><strong>Teléfono:</strong> {selectedService.technician.phone}</p>
                      )}
                      {selectedService.technician.rating > 0 && (
                        <p className="flex items-center gap-1">
                          <strong>Calificación:</strong>
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current ml-1" />
                          {selectedService.technician.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Costos en el detalle */}
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">Costos (COP)</h4>
                  {selectedService.costoFinal !== null ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      <div>
                        <p className="text-xs text-green-700 font-medium">Costo final del servicio</p>
                        <p className="text-2xl font-bold text-green-800">{formatCOP(selectedService.costoFinal)}</p>
                      </div>
                    </div>
                  ) : selectedService.costoEstimado !== null ? (
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isCotizadoDetail ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'}`}>
                      <DollarSign className={`h-5 w-5 shrink-0 ${isCotizadoDetail ? 'text-amber-600' : 'text-gray-500'}`} />
                      <div>
                        <p className={`text-xs font-medium ${isCotizadoDetail ? 'text-amber-700' : 'text-gray-600'}`}>
                          {isCotizadoDetail ? 'Cotización del técnico' : 'Costo estimado'}
                        </p>
                        <p className={`text-2xl font-bold ${isCotizadoDetail ? 'text-amber-800' : 'text-gray-800'}`}>
                          {formatCOP(selectedService.costoEstimado)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aún no se ha definido el costo del servicio.</p>
                  )}
                </div>

                {/* Diagnóstico técnico si existe */}
                {selectedService.diagnosticoTecnico && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wide">Diagnóstico Técnico</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg border">{selectedService.diagnosticoTecnico}</p>
                  </div>
                )}

                {/* Acciones de cotización en el detalle */}
                {isCotizadoDetail && selectedService.costoEstimado !== null && (
                  <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-amber-900">
                      ¿Apruebas la cotización de {formatCOP(selectedService.costoEstimado)}?
                    </p>
                    <p className="text-xs text-amber-700">
                      Si rechazas se cobrará únicamente la visita técnica.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                        disabled={actionLoading === `${selectedService.orderId}-approve`}
                        onClick={() => handleQuoteDecision(selectedService.orderId, 'approve')}
                      >
                        {actionLoading === `${selectedService.orderId}-approve`
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <ThumbsUp className="w-3.5 h-3.5" />
                        }
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 gap-1.5"
                        disabled={actionLoading === `${selectedService.orderId}-reject`}
                        onClick={() => setConfirmReject({ orderId: selectedService.orderId, orderNumber: selectedService.id })}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Cerrar</Button>
                  {selectedService.technician.phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${selectedService.technician.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />Llamar técnico
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Confirmación de rechazo */}
      <AlertDialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar la cotización?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por rechazar la cotización de la orden <strong>{confirmReject?.orderNumber}</strong>.
              Al rechazar, se cobrará únicamente el costo de la visita técnica y el servicio será cancelado.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => confirmReject && handleQuoteDecision(confirmReject.orderId, 'reject')}
            >
              Sí, rechazar cotización
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
