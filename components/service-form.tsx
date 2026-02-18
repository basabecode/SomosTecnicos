'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MapPin,
  Phone,
  User,
  AlertCircle
} from 'lucide-react'
import SuccessModal from '@/components/success-modal'
import { Badge } from '@/components/ui/badge'
import { SpecialtyConfig, SPECIALTIES_CONFIG } from '@/lib/config/specialties'

interface OptimizedFormData {
  tipoElectrodomestico: string
  descripcionProblema: string
  nombre: string
  telefono: string
  direccion: string
  email?: string
  urgencia: string
}

interface ServiceFormProps {
  config?: SpecialtyConfig
}

export default function ServiceForm({ config = SPECIALTIES_CONFIG.ELECTRODOMESTICOS }: ServiceFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Color theme from config
  const primaryColor = config.color
  const primaryColorClass = `text-[${primaryColor}]`
  const primaryBgClass = `bg-[${primaryColor}]`

  // Custom styles for dynamic colors since Tailwind arbitrary values might not interpolate well with variables in class names sometimes
  // We will use inline styles for the specific dynamic colors where Tailwind isn't enough or for simplicity with dynamic values
  const textStyle = { color: primaryColor }
  const bgStyle = { backgroundColor: primaryColor }
  const borderStyle = { borderColor: primaryColor }
  const ringStyle = { '--tw-ring-color': primaryColor } as React.CSSProperties

  const [formData, setFormData] = useState<OptimizedFormData>({
    tipoElectrodomestico: '',
    descripcionProblema: '',
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    urgencia: 'normal',
  })

  // Reset form when config changes (e.g. switching tabs if we had them, OR if rendered in different sections)
  useEffect(() => {
    // Optional: Reset logic if needed when props change significantly
  }, [config])

  // Escuchar evento del AIChat para pre-llenar el formulario
  useEffect(() => {
    const handleOpenServiceForm = (event: any) => {
      const { tipoElectrodomestico, descripcionProblema, urgencia, fromAI } = event.detail || {}

      if (fromAI) {
        setFormData(prev => ({
          ...prev,
          tipoElectrodomestico: tipoElectrodomestico || prev.tipoElectrodomestico,
          descripcionProblema: descripcionProblema || prev.descripcionProblema,
          urgencia: urgencia || prev.urgencia,
        }))

        if (tipoElectrodomestico && descripcionProblema) {
          setCurrentStep(3)
        }
      }
    }

    window.addEventListener('openServiceForm', handleOpenServiceForm)
    return () => window.removeEventListener('openServiceForm', handleOpenServiceForm)
  }, [])

  const updateField = (field: keyof OptimizedFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.tipoElectrodomestico) {
        newErrors.tipoElectrodomestico = 'Por favor selecciona una opción'
      }
    }

    if (step === 2) {
      if (!formData.descripcionProblema.trim()) {
        newErrors.descripcionProblema = 'Por favor describe el problema'
      }
    }

    if (step === 3) {
      if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido'
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'WhatsApp requerido'
      } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
        newErrors.telefono = 'Número inválido'
      }
      if (!formData.direccion.trim())
        newErrors.direccion = 'Dirección requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const selectElectrodomestico = (tipo: string) => {
    updateField('tipoElectrodomestico', tipo)
    setTimeout(() => {
        setCurrentStep(2)
    }, 400)
  }

  const selectProblema = (problema: string) => {
    updateField('descripcionProblema', problema)
  }

  const handleSubmit = async () => {
    // Prevenir múltiples submits (doble click)
    if (isSubmitting) {
      return
    }

    if (validateStep(3)) {
      setIsSubmitting(true)

      try {
        // Generar idempotency key único para esta solicitud
        const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': idempotencyKey
          },
          body: JSON.stringify({
            clienteNombre: formData.nombre,
            clienteTelefono: formData.telefono,
            clienteEmail: formData.email || '',
            clienteDireccion: formData.direccion,
            clienteCiudad: 'Bogotá',
            tipoElectrodomestico: formData.tipoElectrodomestico,
            marca: 'No especificada',
            modelo: 'No especificado',
            año: new Date().getFullYear(),
            tipoServicio: 'reparacion',
            descripcionProblema: formData.descripcionProblema,
            urgencia: formData.urgencia,
            fechaPreferida: new Date().toISOString().split('T')[0],
            horarioPreferido: 'AM',
            comentarios: `Especialidad: ${config.title}`,
          }),
        })

        if (!response.ok) throw new Error('Error al crear la orden')

        const result = await response.json()
        const orderNum = result.numeroOrden || `#${result.id}`
        setOrderNumber(orderNum)

        localStorage.setItem(
          'lastOrder',
          JSON.stringify({ ...formData, orderNumber: orderNum })
        )
        setShowSuccess(true)

        setTimeout(() => {
          setFormData({
            tipoElectrodomestico: '',
            descripcionProblema: '',
            nombre: '',
            telefono: '',
            direccion: '',
            email: '',
            urgencia: 'normal',
          })
          setCurrentStep(1)
          setIsSubmitting(false)
        }, 3000)
      } catch (error) {
        console.error('Error:', error)
        setIsSubmitting(false)
        // toast.error('Hubo un error al crear la orden. Por favor intenta de nuevo.')
      }
    }
  }

  const progressPercentage = (currentStep / 3) * 100

  return (
    <section
      id={config.id}
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 border-b border-gray-100"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <Badge variant="outline" className="mb-4" style={{ ...textStyle, ...borderStyle }}>
            Solicitud En Línea
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] mb-4 tracking-tight">
            {config.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {config.description}
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                <span style={currentStep >= 1 ? textStyle : {}}>1. Equipo</span>
                <span style={currentStep >= 2 ? textStyle : {}}>2. Falla</span>
                <span style={currentStep >= 3 ? textStyle : {}}>3. Datos</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%`, backgroundColor: primaryColor }}
                />
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm ring-1 ring-gray-100 max-w-4xl mx-auto">
          <CardContent className="p-0">

            {/* Form Content */}
            <div className="p-6 md:p-12 relative min-h-[400px]">

                    {/* Step 1: Selección Visual con Fotos */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                             <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                                    ¿Qué equipo necesitas reparar, instalar o mantener?
                                </h3>
                                <p className="text-gray-500">Selecciona una opción para continuar</p>
                             </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {config.items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => selectElectrodomestico(item.id)}
                                        className={`
                                            group relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300
                                            hover:shadow-xl bg-white
                                            ${formData.tipoElectrodomestico === item.id
                                                ? 'ring-4 scale-[1.02]'
                                                : 'border-transparent hover:border-gray-200 shadow-sm'}
                                        `}
                                        style={
                                          formData.tipoElectrodomestico === item.id
                                          ? { ...borderStyle, ...ringStyle, '--tw-ring-opacity': '0.1' } as React.CSSProperties
                                          : {}
                                        }
                                    >
                                        {/* Image Container */}
                                        <div className="aspect-square relative p-4 bg-white flex items-center justify-center">
                                            <Image
                                                src={item.image}
                                                alt={item.label}
                                                fill
                                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                quality={90}
                                            />
                                        </div>

                                        {/* Label Overlay */}
                                        <div className="text-center p-3 border-t bg-gray-50 group-hover:bg-white transition-colors">
                                            <h4 className="font-bold text-[#2C3E50] text-sm md:text-base">{item.label}</h4>
                                        </div>

                                        {/* Checked Indicator */}
                                        {formData.tipoElectrodomestico === item.id && (
                                            <div
                                              className="absolute top-3 right-3 text-white rounded-full p-1.5 shadow-md z-10 animate-in zoom-in"
                                              style={bgStyle}
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.tipoElectrodomestico && (
                                <p className="text-red-500 text-sm mt-4 text-center items-center gap-2">
                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                    {errors.tipoElectrodomestico}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 2: Descripción y Sugerencias */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 max-w-2xl mx-auto">
                             <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-[#2C3E50]">
                                    Describe el problema
                                </h3>
                                <p className="text-gray-500">
                                  Cuéntanos qué le pasa a tu {config.items.find(e => e.id === formData.tipoElectrodomestico)?.label || 'equipo'}
                                </p>
                             </div>

                            {formData.tipoElectrodomestico && config.problems[formData.tipoElectrodomestico] && (
                                <div>
                                    <Label className="text-gray-500 mb-3 block text-center">Problemas comunes (selecciona uno)</Label>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {config.problems[formData.tipoElectrodomestico].map((prob, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className={`rounded-full px-4 h-auto py-2 border transition-all`}
                                                style={
                                                  formData.descripcionProblema === prob
                                                  ? { ...borderStyle, ...bgStyle, color: 'white' }
                                                  : {}
                                                }
                                                onClick={() => selectProblema(prob)}
                                            >
                                                {prob}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="problema" className="text-[#2C3E50] font-semibold text-lg mb-2 block">
                                    Detalle del problema
                                </Label>
                                <Textarea
                                    id="problema"
                                    value={formData.descripcionProblema}
                                    onChange={(e) => updateField('descripcionProblema', e.target.value)}
                                    placeholder="Describe brevemente qué está pasando con tu equipo..."
                                    className="min-h-[150px] text-base resize-none border-gray-200 focus:ring-opacity-20 p-4 rounded-xl"
                                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                />
                                {errors.descripcionProblema && (
                                    <p className="text-red-500 text-sm mt-2">{errors.descripcionProblema}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact Info */}
                    {currentStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 max-w-2xl mx-auto">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-[#2C3E50]">
                                    Datos de Contacto
                                </h3>
                                <p className="text-gray-500">Para confirmar tu visita técnica</p>
                             </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="flex items-center gap-2 text-gray-700">
                                        <User className="w-4 h-4" style={textStyle} /> Nombre completo
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => updateField('nombre', e.target.value)}
                                        className="h-12 border-gray-200 rounded-lg focus:ring-1"
                                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                        placeholder="Ej: María González"
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono" className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4" style={textStyle} /> WhatsApp / Celular
                                    </Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={(e) => updateField('telefono', e.target.value)}
                                        className="h-12 border-gray-200 rounded-lg focus:ring-1"
                                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                        placeholder="Ej: 300 123 4567"
                                        type="tel"
                                    />
                                    {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion" className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="w-4 h-4" style={textStyle} /> Dirección de visita
                                </Label>
                                <Input
                                    id="direccion"
                                    value={formData.direccion}
                                    onChange={(e) => updateField('direccion', e.target.value)}
                                    className="h-12 border-gray-200 rounded-lg focus:ring-1"
                                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                    placeholder="Ej: Calle 123 # 45-67, Apto 501"
                                />
                                {errors.direccion && <p className="text-red-500 text-xs">{errors.direccion}</p>}
                            </div>

                            <div className="pt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-500 flex items-start gap-3 border border-gray-100">
                                <AlertCircle className="w-5 h-5 shrink-0" style={textStyle} />
                                <p>
                                    Al enviar esta solicitud, aceptas ser contactado vía WhatsApp o llamada para confirmar la visita técnica. Tus datos están seguros con nosotros.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100 max-w-2xl mx-auto">
                        {currentStep > 1 ? (
                            <Button variant="ghost" onClick={prevStep} className="text-gray-500 hover:text-[#2C3E50]">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        ) : <div></div>}

                        {currentStep < 3 && currentStep > 1 ? (
                             <Button
                                onClick={nextStep}
                                className="text-white px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
                                style={bgStyle}
                            >
                                Continuar <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : null}

                         {currentStep === 3 && (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-[#27AE60] hover:bg-[#219150] text-white px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Procesando...' : 'Agendar Visita'} <CheckCircle className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>

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
