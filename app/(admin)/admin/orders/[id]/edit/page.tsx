/**
 * Página de Edición de Orden
 * Permite actualizar los detalles de una orden existente
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

// Constantes para selects (pueden venir de un archivo compartido o constantes)
const APPLIANCE_TYPES = [
  { value: 'nevera', label: 'Nevera' },
  { value: 'lavadora', label: 'Lavadora' },
  { value: 'secadora', label: 'Secadora' },
  { value: 'aire_acondicionado', label: 'Aire Acondicionado' },
  { value: 'estufa', label: 'Estufa' },
  { value: 'horno', label: 'Horno' },
  { value: 'calentador', label: 'Calentador' },
  { value: 'otro', label: 'Otro' }
]

const SERVICE_TYPES = [
  { value: 'reparacion', label: 'Reparación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'revision', label: 'Revisión / Diagnóstico' }
]

const URGENCY_LEVELS = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' }
]

interface OrderData {
  id: string
  numeroOrden: string
  nombre: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  tipoElectrodomestico: string
  marca: string
  modelo: string
  año: number
  tipoServicio: string
  descripcionProblema: string
  urgencia: string
  fechaPreferida: string
  horario: string
  comentarios: string
}

export default function EditOrderPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const orderId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<OrderData>>({})

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('accessToken')
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) throw new Error('Error al cargar la orden')

        const data = await response.json()
        const order = data.data

        // Preparamos los datos para el formulario
        setFormData({
          id: order.id,
          numeroOrden: order.numeroOrden,
          nombre: order.nombre,
          telefono: order.telefono,
          email: order.email,
          direccion: order.direccion,
          ciudad: order.ciudad,
          tipoElectrodomestico: order.tipoElectrodomestico,
          marca: order.marca || '',
          modelo: order.modelo || '',
          año: order.año || undefined,
          tipoServicio: order.tipoServicio,
          descripcionProblema: order.descripcionProblema || '',
          urgencia: order.urgencia,
          fechaPreferida: order.fechaPreferida ? new Date(order.fechaPreferida).toISOString().slice(0, 16) : '', // formato datetime-local
          horario: order.horario || '',
          comentarios: order.comentarios || ''
        })

      } catch (error) {
        console.error('Error fetching order:', error)
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información de la orden.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, toast])

  const handleInputChange = (field: keyof OrderData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      const token = localStorage.getItem('accessToken')

      const payload = {
        ...formData,
        año: formData.año ? Number(formData.año) : undefined,
        // Convertimos fechaPreferida a ISO string si existe
        fechaPreferida: formData.fechaPreferida ? new Date(formData.fechaPreferida).toISOString() : undefined
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar la orden')
      }

      toast({
        title: 'Orden actualizada',
        description: 'La información de la orden se ha guardado correctamente.'
      })

      router.push(`/admin/orders/${orderId}`)

    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar la orden',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'technician_manager']}>
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/admin/orders/${orderId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Orden</h1>
            <p className="text-muted-foreground text-sm">
              {formData.numeroOrden} - {formData.nombre}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">

            {/* Información del Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
                <CardDescription>Datos de contacto y ubicación</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre || ''}
                    onChange={e => handleInputChange('nombre', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={e => handleInputChange('telefono', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={e => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                    {/* Nota: Idealmente esto sería un select con las ciudades disponibles */}
                  <Input
                    id="ciudad"
                    value={formData.ciudad || ''}
                    onChange={e => handleInputChange('ciudad', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion || ''}
                    onChange={e => handleInputChange('direccion', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Información del Electrodoméstico */}
            <Card>
              <CardHeader>
                <CardTitle>Electrodoméstico</CardTitle>
                <CardDescription>Detalles del equipo a reparar</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoElectrodomestico">Tipo</Label>
                  <Select
                    value={formData.tipoElectrodomestico}
                    onValueChange={val => handleInputChange('tipoElectrodomestico', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLIANCE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={formData.marca || ''}
                    onChange={e => handleInputChange('marca', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo || ''}
                    onChange={e => handleInputChange('modelo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="año">Año (Aprox)</Label>
                  <Input
                    id="año"
                    type="number"
                    value={formData.año || ''}
                    onChange={e => handleInputChange('año', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Detalles del Servicio */}
            <Card>
              <CardHeader>
                <CardTitle>Servicio</CardTitle>
                <CardDescription>Problema y prioridad</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
                  <Select
                    value={formData.tipoServicio}
                    onValueChange={val => handleInputChange('tipoServicio', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgencia">Urgencia</Label>
                  <Select
                    value={formData.urgencia}
                    onValueChange={val => handleInputChange('urgencia', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="descripcionProblema">Descripción del Problema</Label>
                  <Textarea
                    id="descripcionProblema"
                    value={formData.descripcionProblema || ''}
                    onChange={e => handleInputChange('descripcionProblema', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fechaPreferida">Fecha Preferida</Label>
                    <Input
                        id="fechaPreferida"
                        type="datetime-local"
                        value={formData.fechaPreferida || ''}
                        onChange={e => handleInputChange('fechaPreferida', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                    <Input
                        id="comentarios"
                        value={formData.comentarios || ''}
                        onChange={e => handleInputChange('comentarios', e.target.value)}
                    />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>

          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
