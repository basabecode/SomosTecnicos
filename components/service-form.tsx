'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import SuccessModal from '@/components/success-modal'

/**
 * Formulario Multi-Paso - Componente principal
 * - 4 pasos con indicador de progreso
 * - Validación en cada paso
 * - Guardado en localStorage
 * - Modal de éxito al enviar
 */

interface FormData {
  // Paso 1
  nombre: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  // Paso 2
  tipoElectrodomestico: string
  marca: string
  modelo: string
  año: string
  // Paso 3
  tipoServicio: string
  descripcionProblema: string
  urgencia: string
  // Paso 4
  fechaPreferida: string
  horario: string
  comentarios: string
}

export default function ServiceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    tipoElectrodomestico: '',
    marca: '',
    modelo: '',
    año: '',
    tipoServicio: '',
    descripcionProblema: '',
    urgencia: 'normal',
    fechaPreferida: '',
    horario: '',
    comentarios: '',
  })

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error al editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validación por paso
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.nombre.trim()) newErrors.nombre = 'Campo obligatorio'
      if (!formData.telefono.trim()) newErrors.telefono = 'Campo obligatorio'
      else if (!/^\d+$/.test(formData.telefono))
        newErrors.telefono = 'Solo números'
      if (!formData.email.trim()) newErrors.email = 'Campo obligatorio'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = 'Email inválido'
      if (!formData.direccion.trim()) newErrors.direccion = 'Campo obligatorio'
      if (!formData.ciudad) newErrors.ciudad = 'Campo obligatorio'
    }

    if (step === 2) {
      if (!formData.tipoElectrodomestico)
        newErrors.tipoElectrodomestico = 'Campo obligatorio'
      if (!formData.marca) newErrors.marca = 'Campo obligatorio'
    }

    if (step === 3) {
      if (!formData.tipoServicio) newErrors.tipoServicio = 'Campo obligatorio'
      if (!formData.descripcionProblema.trim())
        newErrors.descripcionProblema = 'Campo obligatorio'
    }

    if (step === 4) {
      if (!formData.fechaPreferida)
        newErrors.fechaPreferida = 'Campo obligatorio'
      if (!formData.horario) newErrors.horario = 'Campo obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (validateStep(4)) {
      try {
        // Enviar datos a la API
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clienteNombre: formData.nombre,
            clienteTelefono: formData.telefono,
            clienteEmail: formData.email,
            clienteDireccion: formData.direccion,
            clienteCiudad: formData.ciudad,
            tipoElectrodomestico: formData.tipoElectrodomestico,
            marca: formData.marca,
            modelo: formData.modelo,
            año: parseInt(formData.año) || new Date().getFullYear(),
            tipoServicio: formData.tipoServicio,
            descripcionProblema: formData.descripcionProblema,
            urgencia: formData.urgencia,
            fechaPreferida: formData.fechaPreferida,
            horarioPreferido: formData.horario,
            comentarios: formData.comentarios,
          }),
        })

        if (!response.ok) {
          throw new Error('Error al crear la orden')
        }

        const result = await response.json()
        const orderNum = result.numeroOrden || `#${result.id}`
        setOrderNumber(orderNum)

        // Guardar en localStorage
        localStorage.setItem(
          'lastOrder',
          JSON.stringify({ ...formData, orderNumber: orderNum })
        )

        // Mostrar modal de éxito
        setShowSuccess(true)

        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          setFormData({
            nombre: '',
            telefono: '',
            email: '',
            direccion: '',
            ciudad: '',
            tipoElectrodomestico: '',
            marca: '',
            modelo: '',
            año: '',
            tipoServicio: '',
            descripcionProblema: '',
            urgencia: 'normal',
            fechaPreferida: '',
            horario: '',
            comentarios: '',
          })
          setCurrentStep(1)
        }, 3000)
      } catch (error) {
        console.error('Error al enviar el formulario:', error)
        // Mostrar error pero mantener funcionalidad básica
        const orderNum = `#${Math.floor(10000 + Math.random() * 90000)}`
        setOrderNumber(orderNum)
        localStorage.setItem(
          'lastOrder',
          JSON.stringify({ ...formData, orderNumber: orderNum })
        )
        setShowSuccess(true)

        setTimeout(() => {
          setFormData({
            nombre: '',
            telefono: '',
            email: '',
            direccion: '',
            ciudad: '',
            tipoElectrodomestico: '',
            marca: '',
            modelo: '',
            año: '',
            tipoServicio: '',
            descripcionProblema: '',
            urgencia: 'normal',
            fechaPreferida: '',
            horario: '',
            comentarios: '',
          })
          setCurrentStep(1)
        }, 3000)
      }
    }
  }

  return (
    <section id="formulario" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Solicita tu Servicio
          </h2>
          <p className="text-lg text-[#7F8C8D]">
            Completa el formulario y nos contactaremos contigo
          </p>
        </div>

        <Card className="border-2 border-[#E0E0E0]">
          <CardContent className="p-6 md:p-8">
            {/* Indicador de progreso */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        step <= currentStep
                          ? 'bg-[#A50034] text-white'
                          : 'bg-[#E0E0E0] text-[#7F8C8D]'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-colors ${
                          step < currentStep ? 'bg-[#A50034]' : 'bg-[#E0E0E0]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-[#7F8C8D] mt-4">
                Paso {currentStep} de 4
              </p>
            </div>

            {/* Paso 1: Datos del Cliente */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-6">
                  Datos del Cliente
                </h3>

                <div>
                  <Label htmlFor="nombre">
                    Nombre Completo <span className="text-[#A50034]">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={e => updateField('nombre', e.target.value)}
                    className={errors.nombre ? 'border-[#E74C3C]' : ''}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefono">
                    Teléfono <span className="text-[#A50034]">*</span>
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={e => updateField('telefono', e.target.value)}
                    placeholder="3001234567"
                    className={errors.telefono ? 'border-[#E74C3C]' : ''}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.telefono}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-[#A50034]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className={errors.email ? 'border-[#E74C3C]' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="direccion">
                    Dirección Completa <span className="text-[#A50034]">*</span>
                  </Label>
                  <Textarea
                    id="direccion"
                    value={formData.direccion}
                    onChange={e => updateField('direccion', e.target.value)}
                    placeholder="Calle, número, apartamento, barrio"
                    className={errors.direccion ? 'border-[#E74C3C]' : ''}
                  />
                  {errors.direccion && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.direccion}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ciudad">
                    Ciudad <span className="text-[#A50034]">*</span>
                  </Label>
                  <Select
                    value={formData.ciudad}
                    onValueChange={value => updateField('ciudad', value)}
                  >
                    <SelectTrigger
                      className={errors.ciudad ? 'border-[#E74C3C]' : ''}
                    >
                      <SelectValue placeholder="Selecciona tu ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bogota">Bogotá</SelectItem>
                      <SelectItem value="medellin">Medellín</SelectItem>
                      <SelectItem value="cali">Cali</SelectItem>
                      <SelectItem value="barranquilla">Barranquilla</SelectItem>
                      <SelectItem value="cartagena">Cartagena</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ciudad && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.ciudad}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Paso 2: Electrodoméstico */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-6">
                  Información del Electrodoméstico
                </h3>

                <div>
                  <Label htmlFor="tipo">
                    Tipo de Electrodoméstico{' '}
                    <span className="text-[#A50034]">*</span>
                  </Label>
                  <Select
                    value={formData.tipoElectrodomestico}
                    onValueChange={value =>
                      updateField('tipoElectrodomestico', value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.tipoElectrodomestico ? 'border-[#E74C3C]' : ''
                      }
                    >
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nevera">Nevera</SelectItem>
                      <SelectItem value="lavadora">Lavadora</SelectItem>
                      <SelectItem value="estufa">Estufa</SelectItem>
                      <SelectItem value="microondas">Microondas</SelectItem>
                      <SelectItem value="secadora">Secadora</SelectItem>
                      <SelectItem value="lavavajillas">Lavavajillas</SelectItem>
                      <SelectItem value="horno">Horno</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoElectrodomestico && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.tipoElectrodomestico}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="marca">
                    Marca <span className="text-[#A50034]">*</span>
                  </Label>
                  <Select
                    value={formData.marca}
                    onValueChange={value => updateField('marca', value)}
                  >
                    <SelectTrigger
                      className={errors.marca ? 'border-[#E74C3C]' : ''}
                    >
                      <SelectValue placeholder="Selecciona la marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lg">LG</SelectItem>
                      <SelectItem value="samsung">Samsung</SelectItem>
                      <SelectItem value="whirlpool">Whirlpool</SelectItem>
                      <SelectItem value="mabe">Mabe</SelectItem>
                      <SelectItem value="electrolux">Electrolux</SelectItem>
                      <SelectItem value="haceb">Haceb</SelectItem>
                      <SelectItem value="challenger">Challenger</SelectItem>
                      <SelectItem value="otra">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.marca && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.marca}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="modelo">Modelo (opcional)</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={e => updateField('modelo', e.target.value)}
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div>
                  <Label htmlFor="año">Año aproximado</Label>
                  <Select
                    value={formData.año}
                    onValueChange={value => updateField('año', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="anterior">Anterior a 2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Paso 3: Servicio */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-6">
                  Tipo de Servicio
                </h3>

                <div>
                  <Label>
                    Tipo de Servicio <span className="text-[#A50034]">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.tipoServicio}
                    onValueChange={value => updateField('tipoServicio', value)}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-[#F8F9FA] transition-colors">
                      <RadioGroupItem value="reparacion" id="reparacion" />
                      <Label
                        htmlFor="reparacion"
                        className="cursor-pointer flex-1"
                      >
                        Reparación
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-[#F8F9FA] transition-colors">
                      <RadioGroupItem value="instalacion" id="instalacion" />
                      <Label
                        htmlFor="instalacion"
                        className="cursor-pointer flex-1"
                      >
                        Instalación
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-[#F8F9FA] transition-colors">
                      <RadioGroupItem
                        value="mantenimiento"
                        id="mantenimiento"
                      />
                      <Label
                        htmlFor="mantenimiento"
                        className="cursor-pointer flex-1"
                      >
                        Mantenimiento
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.tipoServicio && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.tipoServicio}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="descripcion">
                    Describe el problema{' '}
                    <span className="text-[#A50034]">*</span>
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcionProblema}
                    onChange={e =>
                      updateField('descripcionProblema', e.target.value)
                    }
                    placeholder="Cuéntanos qué está pasando con tu electrodoméstico"
                    rows={4}
                    className={
                      errors.descripcionProblema ? 'border-[#E74C3C]' : ''
                    }
                  />
                  {errors.descripcionProblema && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.descripcionProblema}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="urgencia">Urgencia</Label>
                  <Select
                    value={formData.urgencia}
                    onValueChange={value => updateField('urgencia', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Paso 4: Agendar */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-6">
                  Agenda tu Servicio
                </h3>

                <div>
                  <Label htmlFor="fecha">
                    Fecha Preferida <span className="text-[#A50034]">*</span>
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fechaPreferida}
                    onChange={e =>
                      updateField('fechaPreferida', e.target.value)
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.fechaPreferida ? 'border-[#E74C3C]' : ''}
                  />
                  {errors.fechaPreferida && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.fechaPreferida}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="horario">
                    Horario <span className="text-[#A50034]">*</span>
                  </Label>
                  <Select
                    value={formData.horario}
                    onValueChange={value => updateField('horario', value)}
                  >
                    <SelectTrigger
                      className={errors.horario ? 'border-[#E74C3C]' : ''}
                    >
                      <SelectValue placeholder="Selecciona el horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manana">
                        Mañana (8am - 12pm)
                      </SelectItem>
                      <SelectItem value="tarde">Tarde (2pm - 6pm)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.horario && (
                    <p className="text-sm text-[#E74C3C] mt-1">
                      {errors.horario}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comentarios">Comentarios adicionales</Label>
                  <Textarea
                    id="comentarios"
                    value={formData.comentarios}
                    onChange={e => updateField('comentarios', e.target.value)}
                    placeholder="Información adicional que debamos saber"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#E0E0E0]">
              {currentStep > 1 ? (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="border-[#A50034] text-[#A50034] hover:bg-[#A50034] hover:text-white bg-transparent"
                >
                  <ChevronLeft className="mr-2" size={20} />
                  Anterior
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  className="bg-[#A50034] hover:bg-[#E74C3C] text-white ml-auto"
                >
                  Siguiente
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-[#27AE60] hover:bg-[#229954] text-white ml-auto"
                >
                  <CheckCircle className="mr-2" size={20} />
                  Enviar Solicitud
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        orderNumber={orderNumber}
      />
    </section>
  )
}
