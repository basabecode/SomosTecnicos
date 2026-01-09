/**
 * Formulario de Registro de Técnicos
 * Página pública para que los técnicos envíen sus solicitudes
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Briefcase,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { TECHNICIAN_SPECIALTIES } from '@/lib/constants'

// Ciudades principales de Colombia
const CIUDADES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Cúcuta',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Pasto',
  'Manizales',
  'Neiva',
  'Villavicencio',
  'Armenia',
  'Valledupar',
  'Montería',
  'Sincelejo',
  'Popayán',
  'Tunja',
  'Otra'
]

// Zonas de trabajo
const ZONAS = [
  'Norte',
  'Sur',
  'Centro',
  'Oriente',
  'Occidente',
  'Todas las zonas'
]

// Especialidades con nombres legibles
const ESPECIALIDADES = [
  { value: TECHNICIAN_SPECIALTIES.NEVERA, label: 'Nevera / Refrigerador' },
  { value: TECHNICIAN_SPECIALTIES.CONGELADOR, label: 'Congelador' },
  { value: TECHNICIAN_SPECIALTIES.LAVADORA, label: 'Lavadora' },
  { value: TECHNICIAN_SPECIALTIES.SECADORA, label: 'Secadora' },
  { value: TECHNICIAN_SPECIALTIES.ESTUFA, label: 'Estufa' },
  { value: TECHNICIAN_SPECIALTIES.HORNO, label: 'Horno' },
  { value: TECHNICIAN_SPECIALTIES.MICROONDAS, label: 'Microondas' },
  { value: TECHNICIAN_SPECIALTIES.LAVAVAJILLAS, label: 'Lavavajillas' },
  { value: TECHNICIAN_SPECIALTIES.AIRE_ACONDICIONADO, label: 'Aire Acondicionado' },
  { value: TECHNICIAN_SPECIALTIES.CALENTADOR, label: 'Calentador' },
]

interface FormData {
  nombre: string
  apellido: string
  cedula: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  especialidades: string[]
  zonaPreferida: string
  experienciaAnios: string
}

export default function TechnicianRegistrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    especialidades: [],
    zonaPreferida: '',
    experienciaAnios: ''
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(specialty)
        ? prev.especialidades.filter(s => s !== specialty)
        : [...prev.especialidades, specialty]
    }))
    setError('')
  }

  const validateStep1 = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es requerido')
      return false
    }
    if (!formData.cedula.trim()) {
      setError('La cédula es requerida')
      return false
    }
    if (!/^\d{7,10}$/.test(formData.cedula)) {
      setError('La cédula debe tener entre 7 y 10 dígitos')
      return false
    }
    if (!formData.email.trim()) {
      setError('El email es requerido')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El formato del email es inválido')
      return false
    }
    if (!formData.telefono.trim()) {
      setError('El teléfono es requerido')
      return false
    }
    if (!/^(3)[0-9]{9}$/.test(formData.telefono.replace(/\s/g, ''))) {
      setError('El teléfono debe ser un número colombiano válido (10 dígitos, comenzando con 3)')
      return false
    }
    if (!formData.direccion.trim()) {
      setError('La dirección es requerida')
      return false
    }
    if (!formData.ciudad) {
      setError('Debe seleccionar una ciudad')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (formData.especialidades.length === 0) {
      setError('Debe seleccionar al menos una especialidad')
      return false
    }
    if (!formData.zonaPreferida) {
      setError('Debe seleccionar una zona de trabajo')
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/technician/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          experienciaAnios: formData.experienciaAnios ? parseInt(formData.experienciaAnios) : undefined
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Error al enviar la solicitud')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              ¡Solicitud Enviada!
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Tu solicitud ha sido recibida exitosamente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">📧 Revisa tu correo</h3>
              <p className="text-blue-800 text-sm">
                Hemos enviado un email de confirmación a <strong>{formData.email}</strong>
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 mb-3">⏰ Próximos Pasos</h3>
              <ol className="text-yellow-800 text-sm space-y-2 list-decimal list-inside">
                <li>Nuestro equipo revisará tu solicitud en 24-48 horas</li>
                <li>Verificaremos tus datos y experiencia</li>
                <li>Te contactaremos por email con la decisión</li>
                <li>Si eres aprobado, recibirás tus credenciales de acceso</li>
              </ol>
            </div>

            <div className="text-center pt-4">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TecnoCity
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Únete a Nuestro Equipo de Técnicos
          </h2>
          <p className="text-gray-600">
            Completa el formulario para enviar tu solicitud
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Datos Personales', icon: UserCheck },
              { num: 2, label: 'Experiencia', icon: Briefcase },
              { num: 3, label: 'Revisión', icon: FileText },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      step >= s.num
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      step > s.num ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">
              {step === 1 && 'Paso 1: Datos Personales'}
              {step === 2 && 'Paso 2: Experiencia Profesional'}
              {step === 3 && 'Paso 3: Revisión y Envío'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Ingresa tu información personal'}
              {step === 2 && 'Cuéntanos sobre tu experiencia'}
              {step === 3 && 'Revisa tu información antes de enviar'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Data */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Juan"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        placeholder="Pérez"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cedula">Cédula *</Label>
                      <Input
                        id="cedula"
                        value={formData.cedula}
                        onChange={(e) => handleInputChange('cedula', e.target.value.replace(/\D/g, ''))}
                        placeholder="1234567890"
                        maxLength={10}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value.replace(/\D/g, ''))}
                        placeholder="3001234567"
                        maxLength={10}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="juan.perez@example.com"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      placeholder="Calle 123 #45-67"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Select
                      value={formData.ciudad}
                      onValueChange={(value) => handleInputChange('ciudad', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {CIUDADES.map((ciudad) => (
                          <SelectItem key={ciudad} value={ciudad}>
                            {ciudad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Experience */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Especialidades * (Selecciona al menos una)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ESPECIALIDADES.map((esp) => (
                        <div
                          key={esp.value}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSpecialtyToggle(esp.value)}
                        >
                          <Checkbox
                            id={esp.value}
                            checked={formData.especialidades.includes(esp.value)}
                            onCheckedChange={() => handleSpecialtyToggle(esp.value)}
                          />
                          <label
                            htmlFor={esp.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {esp.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zonaPreferida">Zona de Trabajo Preferida *</Label>
                    <Select
                      value={formData.zonaPreferida}
                      onValueChange={(value) => handleInputChange('zonaPreferida', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {ZONAS.map((zona) => (
                          <SelectItem key={zona} value={zona}>
                            {zona}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienciaAnios">Años de Experiencia (Opcional)</Label>
                    <Input
                      id="experienciaAnios"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experienciaAnios}
                      onChange={(e) => handleInputChange('experienciaAnios', e.target.value)}
                      placeholder="5"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Resumen de tu Solicitud</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nombre Completo</p>
                        <p className="font-medium">{formData.nombre} {formData.apellido}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cédula</p>
                        <p className="font-medium">{formData.cedula}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium">{formData.telefono}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ciudad</p>
                        <p className="font-medium">{formData.ciudad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Zona Preferida</p>
                        <p className="font-medium">{formData.zonaPreferida}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Especialidades</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.especialidades.map((esp) => {
                          const especialidad = ESPECIALIDADES.find(e => e.value === esp)
                          return (
                            <span
                              key={esp}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {especialidad?.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {formData.experienciaAnios && (
                      <div>
                        <p className="text-sm text-gray-600">Experiencia</p>
                        <p className="font-medium">{formData.experienciaAnios} años</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Al enviar esta solicitud, recibirás un email de confirmación.
                      Nuestro equipo revisará tu información en 24-48 horas y te contactaremos con la decisión.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Siguiente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="ml-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Enviar Solicitud
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
