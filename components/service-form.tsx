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

interface OptimizedFormData {
  tipoElectrodomestico: string
  descripcionProblema: string
  nombre: string
  telefono: string
  direccion: string
  email?: string
  urgencia: string
}

const electrodomesticos = [
  {
    id: 'nevera',
    label: 'Nevera / Nevecon',
    image: '/electrodomesticos/nevecon lg1.jpg',
    description: 'Reparación y mantenimiento de refrigeración'
  },
  {
    id: 'lavadora',
    label: 'Lavadora',
    image: '/electrodomesticos/lavadora blanca lg1.jpg',
    description: 'Carga frontal y superior'
  },
  {
    id: 'secadora',
    label: 'Secadora',
    image: '/electrodomesticos/lavadora carga superior lg.jpg',
    description: 'Secadoras a gas y eléctricas'
  },
  {
    id: 'estufa',
    label: 'Estufa / Horno',
    image: '/electrodomesticos/estufa empotrar 1.jpg',
    description: 'Estufas de empotrar y hornos'
  },
  {
    id: 'calentador',
    label: 'Calentador',
    image: '/electrodomesticos/calentador challenger.jpg',
    description: 'Calentadores de paso y acumulación'
  },
  {
    id: 'televisor',
    label: 'Televisor',
    image: '/img_3d/tecnico_revisando_televisor_lcd.PNG',
    description: 'LED, LCD, Smart TV y 4K'
  }
]

const problemasSugeridos: Record<string, string[]> = {
  nevera: [
    'No enfría',
    'Hace ruido extraño',
    'Gotea agua',
    'No prende',
    'Congela los alimentos',
    'Mantenimiento preventivo',
    'Instalación'
  ],
  lavadora: [
    'No enciende',
    'No gira el tambor',
    'No drena el agua',
    'Vibra demasiado',
    'Mancha la ropa',
    'Mantenimiento preventivo',
    'Instalación'
  ],
  secadora: [
    'No calienta',
    'No gira',
    'Hace mucho ruido',
    'Se apaga sola',
    'No enciende',
    'Mantenimiento preventivo',
    'Instalación'
  ],
  estufa: [
    'Llama muy baja',
    'No prende el quemador',
    'Olor a gas',
    'Horno no calienta',
    'Chispa no funciona',
    'Mantenimiento general',
    'Instalación'
  ],
  calentador: [
    'No calienta el agua',
    'Se apaga repentinamente',
    'Fuga de agua',
    'Explosiones al encender',
    'Poca presión',
    'Mantenimiento anual',
    'Instalación'
  ],
  televisor: [
    'Pantalla negra con sonido',
    'No enciende',
    'Imagen distorsionada',
    'Sin conexión Wifi',
    'Puertos HDMI no funcionan',
    'Pantalla rota',
    'Instalación'
  ]
}

export default function ServiceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<OptimizedFormData>({
    tipoElectrodomestico: '',
    descripcionProblema: '',
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    urgencia: 'normal',
  })

  // Escuchar evento del AIChat para pre-llenar el formulario
  useEffect(() => {
    const handleOpenServiceForm = (event: any) => {
      const { tipoElectrodomestico, descripcionProblema, urgencia, fromAI } = event.detail || {}

      if (fromAI) {
        // Pre-llenar el formulario con los datos del AIChat
        setFormData(prev => ({
          ...prev,
          tipoElectrodomestico: tipoElectrodomestico || prev.tipoElectrodomestico,
          descripcionProblema: descripcionProblema || prev.descripcionProblema,
          urgencia: urgencia || prev.urgencia,
        }))

        // Avanzar al paso 3 (datos de contacto) si ya tenemos electrodoméstico y problema
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
        newErrors.tipoElectrodomestico = 'Por favor selecciona un electrodoméstico'
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
    if (validateStep(3)) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            comentarios: '',
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
        }, 3000)
      } catch (error) {
        console.error('Error:', error)
        const orderNum = `DEMO-${Math.floor(1000 + Math.random() * 9000)}`
        setOrderNumber(orderNum)
        setShowSuccess(true)
      }
    }
  }

  const progressPercentage = (currentStep / 3) * 100

  return (
    <section
      id="formulario"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <Badge variant="outline" className="mb-4 border-[#A50034] text-[#A50034]">
            Solicitud En Línea
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] mb-4 tracking-tight">
            Agenda tu Técnico
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sección para la solicitud de tu servicio, para ello debes completar los siguientes campos:          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                <span className={currentStep >= 1 ? 'text-[#A50034]' : ''}>1. Equipo</span>
                <span className={currentStep >= 2 ? 'text-[#A50034]' : ''}>2. Falla</span>
                <span className={currentStep >= 3 ? 'text-[#A50034]' : ''}>3. Datos</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#A50034] transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm ring-1 ring-gray-100 max-w-4xl mx-auto">
          <CardContent className="p-0">

            {/* Form Content - Center Aligned - No left column */}
            <div className="p-6 md:p-12 relative min-h-[400px]">

                    {/* Step 1: Selección Visual con Fotos */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in zoom-in-95 duration-500">
                             <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">
                                    ¿Qué equipo necesitas reparar, instalar o hacer mantenimiento?
                                </h3>
                                <p className="text-gray-500">Selecciona una opción para continuar</p>
                             </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {electrodomesticos.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => selectElectrodomestico(item.id)}
                                        className={`
                                            group relative cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300
                                            hover:shadow-xl bg-white
                                            ${formData.tipoElectrodomestico === item.id
                                                ? 'border-[#A50034] ring-4 ring-[#A50034]/10 scale-[1.02]'
                                                : 'border-transparent hover:border-gray-200 shadow-sm'}
                                        `}
                                    >
                                        {/* Image Container - object-contain for full visibility */}
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
                                            <div className="absolute top-3 right-3 bg-[#A50034] text-white rounded-full p-1.5 shadow-md z-10 animate-in zoom-in">
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
                                <p className="text-gray-500">Cuéntanos qué le pasa a tu {electrodomesticos.find(e => e.id === formData.tipoElectrodomestico)?.label || 'equipo'}</p>
                             </div>

                            {formData.tipoElectrodomestico && problemasSugeridos[formData.tipoElectrodomestico] && (
                                <div>
                                    <Label className="text-gray-500 mb-3 block text-center">Problemas comunes (selecciona uno)</Label>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {problemasSugeridos[formData.tipoElectrodomestico].map((prob, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className={`rounded-full px-4 h-auto py-2 border transition-all ${
                                                    formData.descripcionProblema === prob
                                                    ? 'border-[#A50034] bg-[#A50034] text-white hover:bg-[#A50034]/90 hover:text-white'
                                                    : 'hover:border-[#A50034] hover:text-[#A50034]'
                                                }`}
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
                                    className="min-h-[150px] text-base resize-none border-gray-200 focus:border-[#A50034] focus:ring-[#A50034]/20 p-4 rounded-xl"
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
                                        <User className="w-4 h-4 text-[#A50034]" /> Nombre completo
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => updateField('nombre', e.target.value)}
                                        className="h-12 border-gray-200 focus:border-[#A50034] rounded-lg"
                                        placeholder="Ej: María González"
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono" className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-[#A50034]" /> WhatsApp / Celular
                                    </Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={(e) => updateField('telefono', e.target.value)}
                                        className="h-12 border-gray-200 focus:border-[#A50034] rounded-lg"
                                        placeholder="Ej: 300 123 4567"
                                        type="tel"
                                    />
                                    {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion" className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-[#A50034]" /> Dirección de visita
                                </Label>
                                <Input
                                    id="direccion"
                                    value={formData.direccion}
                                    onChange={(e) => updateField('direccion', e.target.value)}
                                    className="h-12 border-gray-200 focus:border-[#A50034] rounded-lg"
                                    placeholder="Ej: Calle 123 # 45-67, Apto 501"
                                />
                                {errors.direccion && <p className="text-red-500 text-xs">{errors.direccion}</p>}
                            </div>

                            <div className="pt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-500 flex items-start gap-3 border border-gray-100">
                                <AlertCircle className="w-5 h-5 text-[#A50034] shrink-0" />
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
                                className="bg-[#A50034] hover:bg-[#c9003f] text-white px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                Continuar <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : null}

                         {currentStep === 3 && (
                            <Button
                                onClick={handleSubmit}
                                className="bg-[#27AE60] hover:bg-[#219150] text-white px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                Agendar Visita <CheckCircle className="w-4 h-4 ml-2" />
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
