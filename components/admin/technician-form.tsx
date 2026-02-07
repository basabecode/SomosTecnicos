/**
 * Formulario CRUD para Técnicos
 * Componente reutilizable para crear y editar técnicos
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/components/notifications/notification-system'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Wrench,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

// Tipos de especialidades disponibles
const TECHNICIAN_SPECIALTIES = {
  // Electrodomésticos
  nevera: 'Nevera/Refrigerador',
  congelador: 'Congelador',
  lavadora: 'Lavadora',
  secadora: 'Secadora',
  estufa: 'Estufa/Cocina',
  horno: 'Horno Microondas',
  televisor: 'Televisor',
  equipo_sonido: 'Equipo de Sonido',
  aire_acondicionado: 'Aire Acondicionado',
  calentador: 'Calentador de Agua',

  // Nuevas Especialidades
  electricidad: 'Electricista / Redes Eléctricas',
  computacion: 'Soporte de Computadores',
  redes: 'Redes y Telecomunicaciones',
  seguridad_electronica: 'Cámaras y Seguridad',

  otros: 'Otros Electrodomésticos',
}

// Ciudades disponibles
const CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Manizales',
]

interface TechnicianData {
  id: number
  nombre: string
  telefono: string
  email: string
  cedula: string
  especialidades: string[]
  zonaTrabajoArea?: string | null
  activo: boolean
  disponible: boolean
}

interface TechnicianFormProps {
  technician?: TechnicianData
  isEditing?: boolean
  onSuccess?: () => void
  onCancel?: () => void
}

interface FormData {
  nombre: string
  telefono: string
  email: string
  cedula: string
  especialidades: string[]
  zonaTrabajoArea: string
  activo: boolean
  disponible: boolean
}

interface FormErrors {
  [key: string]: string
}

export function TechnicianForm({
  technician,
  isEditing = false,
  onSuccess,
  onCancel,
}: TechnicianFormProps) {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    telefono: '',
    email: '',
    cedula: '',
    especialidades: [],
    zonaTrabajoArea: '',
    activo: true,
    disponible: true,
  })

  // Pre-llenar datos si estamos editando
  useEffect(() => {
    if (isEditing && technician) {
      setFormData({
        nombre: technician.nombre || '',
        telefono: technician.telefono || '',
        email: technician.email || '',
        cedula: technician.cedula || '',
        especialidades: technician.especialidades || [],
        zonaTrabajoArea: technician.zonaTrabajoArea || '',
        activo: technician.activo ?? true,
        disponible: technician.disponible ?? true,
      })
    }
  }, [isEditing, technician])

  // Validación básica del formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!/^\+57\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato: +57XXXXXXXXXX (10 dígitos después de +57)'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Validar cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida'
    } else if (!/^\d{8,12}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener entre 8 y 12 dígitos'
    }

    // Validar especialidades
    if (formData.especialidades.length === 0) {
      newErrors.especialidades = 'Debe seleccionar al menos una especialidad'
    }

    // Validar zona de trabajo
    if (!formData.zonaTrabajoArea.trim()) {
      newErrors.zonaTrabajoArea = 'La zona de trabajo es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar cambios en especialidades
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      especialidades: checked
        ? [...prev.especialidades, specialty]
        : prev.especialidades.filter(s => s !== specialty),
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setError('Por favor, corrige los errores del formulario')
      return
    }

    if (isEditing && !technician) {
      setError('No se encontró información del técnico a editar')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('accessToken')
      const url = isEditing
        ? `/api/technicians/${technician!.id}`
        : '/api/technicians'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const successMessage = isEditing
          ? 'Técnico actualizado exitosamente'
          : 'Técnico creado exitosamente'

        setSuccess(successMessage)

        // Notificación toast
        addNotification({
          type: 'success',
          category: 'technician',
          title: isEditing ? 'Técnico Actualizado' : 'Técnico Creado',
          message: `${formData.nombre} ha sido ${
            isEditing ? 'actualizado' : 'registrado'
          } exitosamente`,
          duration: 4000,
        })

        // Callback de éxito
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500)
        } else {
          // Redirigir después de 1.5 segundos
          setTimeout(() => {
            router.push('/admin/technicians')
          }, 1500)
        }
      } else {
        const errorMessage = data.error || 'Error al procesar la solicitud'
        setError(errorMessage)

        // Notificación de error
        addNotification({
          type: 'error',
          category: 'technician',
          title: isEditing ? 'Error al Actualizar' : 'Error al Crear',
          message: errorMessage,
          duration: 6000,
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = 'Error de conexión. Inténtalo de nuevo.'
      setError(errorMessage)

      // Notificación de error de conexión
      addNotification({
        type: 'error',
        category: 'system',
        title: 'Error de Conexión',
        message: errorMessage,
        duration: 6000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Manejar cancelación
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/admin/technicians')
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {isEditing ? 'Editar Técnico' : 'Crear Nuevo Técnico'}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? 'Modifica la información del técnico'
            : 'Completa todos los campos para registrar un nuevo técnico'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alertas */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Información Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Información Personal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre completo */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan Carlos Pérez"
                  value={formData.nombre}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, nombre: e.target.value }))
                  }
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Cédula */}
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cedula"
                    type="text"
                    placeholder="12345678"
                    value={formData.cedula}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, cedula: e.target.value }))
                    }
                    className={`pl-10 ${errors.cedula ? 'border-red-500' : ''}`}
                    disabled={isEditing} // No permitir cambiar cédula al editar
                  />
                </div>
                {errors.cedula && (
                  <p className="text-sm text-red-500">{errors.cedula}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+573001234567"
                    value={formData.telefono}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        telefono: e.target.value,
                      }))
                    }
                    className={`pl-10 ${
                      errors.telefono ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-sm text-red-500">{errors.telefono}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tecnico@email.com"
                    value={formData.email}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, email: e.target.value }))
                    }
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Laboral */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Información Laboral</h3>
            </div>

            {/* Zona de trabajo */}
            <div className="space-y-2">
              <Label htmlFor="zonaTrabajoArea">Zona de Trabajo *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={formData.zonaTrabajoArea}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, zonaTrabajoArea: value }))
                  }
                >
                  <SelectTrigger
                    className={`pl-10 ${
                      errors.zonaTrabajoArea ? 'border-red-500' : ''
                    }`}
                  >
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.zonaTrabajoArea && (
                <p className="text-sm text-red-500">{errors.zonaTrabajoArea}</p>
              )}
            </div>

            {/* Especialidades */}
            <div className="space-y-3">
              <Label>Especialidades * (selecciona al menos una)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(TECHNICIAN_SPECIALTIES).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.especialidades.includes(key)}
                      onCheckedChange={checked =>
                        handleSpecialtyChange(key, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={key}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.especialidades && (
                <p className="text-sm text-red-500">{errors.especialidades}</p>
              )}

              {/* Mostrar especialidades seleccionadas */}
              {formData.especialidades.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.especialidades.map(specialty => (
                    <Badge key={specialty} variant="secondary">
                      {
                        TECHNICIAN_SPECIALTIES[
                          specialty as keyof typeof TECHNICIAN_SPECIALTIES
                        ]
                      }
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Estado del Técnico */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado del Técnico</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={checked =>
                    setFormData(prev => ({
                      ...prev,
                      activo: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  Técnico Activo
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disponible"
                  checked={formData.disponible}
                  onCheckedChange={checked =>
                    setFormData(prev => ({
                      ...prev,
                      disponible: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="disponible" className="cursor-pointer">
                  Disponible para Asignaciones
                </Label>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Un técnico debe estar &quot;Activo&quot; para poder recibir
              asignaciones. &quot;Disponible&quot; indica si puede recibir
              nuevas órdenes en este momento.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditing
                ? 'Actualizar Técnico'
                : 'Crear Técnico'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
