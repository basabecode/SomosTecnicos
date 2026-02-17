/**
 * Página de Asignación de Técnico
 * Permite asignar un técnico a una orden específica
 * Incluye filtrado inteligente por ciudad de la orden
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProtectedRoute } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  Briefcase,
  CheckCircle,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Order {
  id: string
  numeroOrden: string
  ciudad: string
  direccion: string
  tipoElectrodomestico: string
  tipoServicio: string
  fechaPreferida: string
  urgencia: string
  nombre: string
  assignments?: {
    id: number
    estado: string
    technician: {
      id: number
      nombre: string
    }
  }[]
}

interface Technician {
  id: number
  nombre: string
  especialidades: string[]
  zonaTrabajoArea: string
  calificacionPromedio: number
  disponible: boolean
  activo: boolean
  ordenesCompletadas: number
}

export default function AssignTechnicianPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [ignoreCity, setIgnoreCity] = useState(false)

  // Estados de filtrado
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | null>(null)

  // Estados del formulario de asignación
  const [notes, setNotes] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')

        // 1. Obtener detalles de la orden
        const orderRes = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!orderRes.ok) throw new Error('Error al cargar la orden')
        const orderData = await orderRes.json()
        setOrder(orderData.data)

        // Inicializar fecha programada con la preferida si existe
        if (orderData.data.fechaPreferida) {
            setScheduledDate(new Date(orderData.data.fechaPreferida).toISOString().slice(0, 16))
        }

        fetchTechnicians(token, orderData.data.ciudad)

      } catch (error) {
        console.error('Error:', error)
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información necesaria.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchData()
    }
  }, [orderId, toast])

  const fetchTechnicians = async (token: string | null, city: string) => {
      try {
        const cityFilter = ignoreCity ? '' : (city || '')
        const techRes = await fetch(`/api/technicians?activo=true&disponible=true&ciudad=${encodeURIComponent(cityFilter)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (techRes.ok) {
          const techData = await techRes.json()
          setTechnicians(techData.data.technicians)
        }
      } catch (error) {
        console.error("Error fetching technicians", error)
      }
  }

  // Effect to refetch when ignoreCity changes
  useEffect(() => {
      if (order) {
          const token = localStorage.getItem('accessToken')
          fetchTechnicians(token, order.ciudad)
      }
  }, [ignoreCity, order])


  const handleAssign = async () => {
    if (!selectedTechnicianId) {
      toast({
        title: 'Selección requerida',
        description: 'Por favor selecciona un técnico para asignar.',
        variant: 'destructive'
      })
      return
    }

    let isReassign = false;
    const currentAssignment = order?.assignments?.find(a => ['asignado', 'en_proceso'].includes(a.estado));

    if (currentAssignment) {
        const confirmReassign = window.confirm(
            `Esta orden ya está asignada al técnico ${currentAssignment.technician.nombre}. \n¿Estás seguro de que deseas reasignarla? El técnico actual será notificado.`
        );
        if (!confirmReassign) return;
        isReassign = true;
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch(`/api/orders/${orderId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          technicianId: selectedTechnicianId,
          notasAsignacion: notes,
          fechaProgramada: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
          reassign: isReassign
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Asignación exitosa',
          description: `La orden ha sido asignada correctamente.`
        })
        router.push('/admin/orders')
      } else {
        throw new Error(result.error || 'Error en la asignación')
      }

    } catch (error) {
        console.error('Assign error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo asignar el técnico.',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Filtrado local de técnicos
  const filteredTechnicians = technicians.filter(tech =>
    tech.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.especialidades.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return <div className="p-8 text-center">Cargando información...</div>
  }

  if (!order) {
    return (
        <div className="p-8 text-center space-y-4">
            <h2 className="text-xl font-bold">Orden no encontrada</h2>
            <Button asChild variant="outline">
                <Link href="/admin/orders">Volver al listado</Link>
            </Button>
        </div>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'technician_manager']}>
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Asignar Técnico</h1>
            <p className="text-muted-foreground text-sm">
              Orden #{order.numeroOrden} - {order.tipoElectrodomestico}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna Izquierda: Información de Orden y Formulario */}
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalles de la Orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium">Ubicación:</span>
                  <div className="flex items-start gap-2 text-gray-900">
                    <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
                    <p>{order.direccion}, {order.ciudad}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium">Servicio:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {order.tipoServicio}
                    </Badge>
                    <Badge className={
                      order.urgencia === 'alta' ? 'bg-red-100 text-red-800' :
                      order.urgencia === 'media' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }>
                      {order.urgencia}
                    </Badge>
                  </div>
                </div>

                {order.assignments && order.assignments.some(a => ['asignado', 'en_proceso'].includes(a.estado)) && (
                   <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs shadow-sm">
                      <p className="font-bold mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Orden ya asignada
                      </p>
                      <p>Técnico actual: <strong>{order.assignments.find(a => ['asignado', 'en_proceso'].includes(a.estado))?.technician.nombre}</strong></p>
                      <p className="mt-1 opacity-90">Si asignas otro técnico, se realizará un reemplazo y se notificará a ambos.</p>
                   </div>
                )}

                <div className={`p-3 rounded-lg text-xs flex gap-2 ${ignoreCity ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'}`}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>
                        {ignoreCity
                            ? "Mostrando TODOS los técnicos disponibles (ignorando ciudad)."
                            : <>El sistema está mostrando técnicos disponibles en <strong>{order.ciudad}</strong>.</>
                        }
                    </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuración de Asignación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fecha Programada</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="datetime-local"
                      className="pl-9"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notas para el técnico</Label>
                  <Textarea
                    placeholder="Instrucciones especiales, códigos de acceso, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="h-32"
                  />
                </div>

                <Button
                  className="w-full bg-[#A50034] hover:bg-[#8B002B]"
                  onClick={handleAssign}
                  disabled={submitting || !selectedTechnicianId}
                >
                  {submitting ? 'Asignando...' : 'Confirmar Asignación'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Lista de Técnicos */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar técnico por nombre o especialidad..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredTechnicians.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed p-6">
                    <p className="text-muted-foreground mb-4">No se encontraron técnicos disponibles en {order.ciudad}.</p>
                    <Button
                        variant="outline"
                        onClick={() => setIgnoreCity(true)}
                        className="text-primary hover:text-primary/90"
                    >
                        Ver todos los técnicos (ignorando ciudad)
                    </Button>
                </div>
              ) : (
                <>
                    {ignoreCity && (
                        <div className="flex justify-end mb-2">
                             <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIgnoreCity(false)}
                                className="text-muted-foreground text-xs"
                            >
                                Filtrar solo por {order.ciudad}
                            </Button>
                        </div>
                    )}
                    {filteredTechnicians.map((tech) => (
                      <div
                        key={tech.id}
                        className={`
                          relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md
                          ${selectedTechnicianId === tech.id
                            ? 'border-[#A50034] bg-red-50/30 ring-1 ring-[#A50034]'
                            : 'border-border bg-white hover:border-gray-300'
                          }
                        `}
                        onClick={() => setSelectedTechnicianId(tech.id)}
                      >
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.nombre}`} />
                          <AvatarFallback>{tech.nombre.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{tech.nombre}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                 <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                 <span className="font-medium">{Number(tech.calificacionPromedio || 0).toFixed(1)}</span>
                                 <span className="text-gray-300">|</span>
                                 <Briefcase className="h-3.5 w-3.5" />
                                 <span>{tech.ordenesCompletadas} órdenes</span>
                              </div>
                            </div>
                            {selectedTechnicianId === tech.id && (
                              <div className="bg-[#A50034] text-white p-1 rounded-full">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {tech.especialidades.map(spec => (
                              <Badge key={spec} variant="secondary" className="text-xs bg-gray-100 text-gray-600 font-normal">
                                {spec}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                             Zona: {tech.zonaTrabajoArea}
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
