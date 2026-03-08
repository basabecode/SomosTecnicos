'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { APPLIANCE_TYPES, SERVICE_TYPES, URGENCY_LEVELS } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

type CreateOrderPayload = {
  nombre: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  tipoElectrodomestico: string
  tipoServicio: string
  descripcionProblema: string
  urgencia: string
  marca?: string
  modelo?: string
  año?: number
  fechaPreferida?: string
  horario?: string
  comentarios?: string
}

const APPLIANCE_OPTIONS = [
  APPLIANCE_TYPES.NEVERA,
  APPLIANCE_TYPES.LAVADORA,
  APPLIANCE_TYPES.SECADORA,
  APPLIANCE_TYPES.ESTUFA,
  APPLIANCE_TYPES.HORNO,
  APPLIANCE_TYPES.MICROONDAS,
  APPLIANCE_TYPES.LAVAVAJILLAS,
  APPLIANCE_TYPES.AIRE_ACONDICIONADO,
  APPLIANCE_TYPES.CALENTADOR,
  APPLIANCE_TYPES.OTROS,
]

const SERVICE_OPTIONS = [
  SERVICE_TYPES.REPARACION,
  SERVICE_TYPES.MANTENIMIENTO,
  SERVICE_TYPES.INSTALACION,
  SERVICE_TYPES.DIAGNOSTICO,
  SERVICE_TYPES.LIMPIEZA,
]

const URGENCY_OPTIONS = [
  URGENCY_LEVELS.BAJA,
  URGENCY_LEVELS.MEDIA,
  URGENCY_LEVELS.ALTA,
]

export default function AdminCreateOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<CreateOrderPayload>({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: 'Cali',
    tipoElectrodomestico: APPLIANCE_TYPES.LAVADORA,
    tipoServicio: SERVICE_TYPES.REPARACION,
    descripcionProblema: '',
    urgencia: URGENCY_LEVELS.MEDIA,
    marca: '',
    modelo: '',
    horario: '',
    comentarios: '',
  })

  const updateField = (key: keyof CreateOrderPayload, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const payload = {
        ...form,
        año: form.año ? Number(form.año) : undefined,
        fechaPreferida: form.fechaPreferida
          ? new Date(form.fechaPreferida).toISOString()
          : undefined,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'No se pudo crear la orden')
      }

      toast({
        title: 'Orden creada',
        description: `Se creó ${data.data.orderNumber}.`,
      })
      router.push(`/admin/orders/${data.data.id}`)
    } catch (error) {
      toast({
        title: 'Error al crear orden',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado al crear la orden.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'technician_manager']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Nueva Orden</h1>
            <p className="text-sm text-muted-foreground">
              Crea una orden manual para cliente desde el portal administrativo.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/orders">Volver</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos del servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del cliente</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={e => updateField('nombre', e.target.value)}
                  required
                  minLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={form.telefono}
                  onChange={e => updateField('telefono', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={form.ciudad}
                  onChange={e => updateField('ciudad', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={form.direccion}
                  onChange={e => updateField('direccion', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Electrodoméstico</Label>
                <Select
                  value={form.tipoElectrodomestico}
                  onValueChange={value => updateField('tipoElectrodomestico', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLIANCE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de servicio</Label>
                <Select
                  value={form.tipoServicio}
                  onValueChange={value => updateField('tipoServicio', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Urgencia</Label>
                <Select
                  value={form.urgencia}
                  onValueChange={value => updateField('urgencia', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaPreferida">Fecha preferida</Label>
                <Input
                  id="fechaPreferida"
                  type="date"
                  value={form.fechaPreferida || ''}
                  onChange={e => updateField('fechaPreferida', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={form.marca || ''}
                  onChange={e => updateField('marca', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={form.modelo || ''}
                  onChange={e => updateField('modelo', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anio">Año</Label>
                <Input
                  id="anio"
                  type="number"
                  min={1980}
                  max={new Date().getFullYear() + 1}
                  value={form.año ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, año: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descripcionProblema">Descripción del problema</Label>
                <Textarea
                  id="descripcionProblema"
                  value={form.descripcionProblema}
                  onChange={e => updateField('descripcionProblema', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="comentarios">Comentarios internos</Label>
                <Textarea
                  id="comentarios"
                  value={form.comentarios || ''}
                  onChange={e => updateField('comentarios', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando orden...' : 'Crear orden'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
