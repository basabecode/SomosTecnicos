'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
  User,
  MapPin,
  Home,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  HomeIcon,
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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

// Tipos de electrodomésticos comunes
const ELECTRODOMESTICOS = [
  { value: 'nevera', label: 'Nevera / Refrigerador', icon: '❄️' },
  { value: 'lavadora', label: 'Lavadora', icon: '🧺' },
  { value: 'estufa', label: 'Estufa', icon: '🔥' },
  { value: 'microondas', label: 'Microondas', icon: '📻' },
  { value: 'aire_acondicionado', label: 'Aire Acondicionado', icon: '❄️' },
  { value: 'calentador', label: 'Calentador', icon: '🚿' },
  { value: 'secadora', label: 'Secadora', icon: '🌀' },
  { value: 'horno', label: 'Horno', icon: '🍕' },
  { value: 'lavavajillas', label: 'Lavavajillas', icon: '🍽️' },
  { value: 'televisor', label: 'Televisor', icon: '📺' },
]

// Schema de validación con Zod
const step1Schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().regex(/^(3)[0-9]{9}$/, 'Teléfono debe ser un número colombiano válido (10 dígitos)'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

const step2Schema = z.object({
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  ciudad: z.string().min(1, 'Debe seleccionar una ciudad'),
  barrio: z.string().optional(),
})

const step3Schema = z.object({
  electrodomesticos: z.array(z.string()).min(1, 'Selecciona al menos un electrodoméstico'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

export default function CustomerRegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    ciudad: '',
    barrio: '',
    electrodomesticos: [] as string[],
  })

  // Form para Step 1
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
  })

  // Form para Step 2
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      barrio: formData.barrio,
    },
  })

  // Form para Step 3
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      electrodomesticos: formData.electrodomesticos,
    },
  })

  const handleStep1Submit = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
    setError('')
  }

  const handleStep2Submit = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(3)
    setError('')
  }

  const handleStep3Submit = async (data: Step3Data) => {
    setLoading(true)
    setError('')

    const finalData = {
      ...formData,
      ...data,
      username: formData.email.split('@')[0], // Generar username del email
      isOnboarded: true, // Marcar como onboarded
    }

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Auto-login después del registro
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: finalData.email,
            password: finalData.password,
          }),
        })

        const loginData = await loginResponse.json()

        if (loginResponse.ok && loginData.success) {
          localStorage.setItem('accessToken', loginData.accessToken)
          if (loginData.refreshToken) {
            localStorage.setItem('refreshToken', loginData.refreshToken)
          }
          // Redirigir al dashboard del cliente
          window.location.href = '/customer/dashboard'
        } else {
          // Si falla el auto-login, redirigir a login manual
          router.push('/login?registered=true')
        }
      } else {
        setError(result.error || 'Error al registrar. Intenta nuevamente.')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
    setError('')
  }

  const toggleElectrodomestico = (value: string) => {
    const current = form3.getValues('electrodomesticos')
    const updated = current.includes(value)
      ? current.filter((e) => e !== value)
      : [...current, value]
    form3.setValue('electrodomesticos', updated)
  }

  const steps = [
    { num: 1, label: 'Datos Básicos', icon: User },
    { num: 2, label: 'Ubicación', icon: MapPin },
    { num: 3, label: 'Preferencias', icon: Home },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#E3F2FD] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón Volver al Inicio */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-all"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C3E50] leading-[1.15] tracking-tight mb-2">
            Registro de Cliente
          </h1>
          <p className="text-lg text-[#64748B]">
            Completa tu perfil en 3 sencillos pasos
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= s.num
                        ? 'bg-[#A50034] border-[#A50034] text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${currentStep >= s.num ? 'text-[#A50034]' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 -mt-6">
                    <div
                      className={`h-full transition-all ${
                        currentStep > s.num ? 'bg-[#A50034]' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#2C3E50]">
              {currentStep === 1 && 'Paso 1: Datos Básicos'}
              {currentStep === 2 && 'Paso 2: Ubicación'}
              {currentStep === 3 && 'Paso 3: Preferencias'}
            </CardTitle>
            <CardDescription className="text-[#64748B]">
              {currentStep === 1 && 'Ingresa tu información personal'}
              {currentStep === 2 && 'Cuéntanos dónde te encuentras'}
              {currentStep === 3 && '¿Qué electrodomésticos tienes en casa?'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Datos Básicos */}
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={form1.handleSubmit(handleStep1Submit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        {...form1.register('nombre')}
                        placeholder="Juan"
                        disabled={loading}
                      />
                      {form1.formState.errors.nombre && (
                        <p className="text-sm text-red-600">{form1.formState.errors.nombre.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        {...form1.register('apellido')}
                        placeholder="Pérez"
                        disabled={loading}
                      />
                      {form1.formState.errors.apellido && (
                        <p className="text-sm text-red-600">{form1.formState.errors.apellido.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form1.register('email')}
                      placeholder="juan.perez@example.com"
                      disabled={loading}
                    />
                    {form1.formState.errors.email && (
                      <p className="text-sm text-red-600">{form1.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      {...form1.register('telefono')}
                      placeholder="3001234567"
                      maxLength={10}
                      disabled={loading}
                    />
                    {form1.formState.errors.telefono && (
                      <p className="text-sm text-red-600">{form1.formState.errors.telefono.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        {...form1.register('password')}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      {form1.formState.errors.password && (
                        <p className="text-sm text-red-600">{form1.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...form1.register('confirmPassword')}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      {form1.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600">{form1.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-[#A50034] hover:bg-[#c9003f] text-white px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Ubicación */}
              {currentStep === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={form2.handleSubmit(handleStep2Submit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      {...form2.register('direccion')}
                      placeholder="Calle 123 #45-67"
                      disabled={loading}
                    />
                    {form2.formState.errors.direccion && (
                      <p className="text-sm text-red-600">{form2.formState.errors.direccion.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Select
                      onValueChange={(value) => form2.setValue('ciudad', value)}
                      defaultValue={form2.getValues('ciudad')}
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
                    {form2.formState.errors.ciudad && (
                      <p className="text-sm text-red-600">{form2.formState.errors.ciudad.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barrio">Barrio (Opcional)</Label>
                    <Input
                      id="barrio"
                      {...form2.register('barrio')}
                      placeholder="Chapinero"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#A50034] hover:bg-[#c9003f] text-white px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: Preferencias */}
              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={form3.handleSubmit(handleStep3Submit)}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label>¿Qué electrodomésticos tienes en casa? *</Label>
                    <p className="text-sm text-gray-600">
                      Esto nos ayudará a ofrecerte un mejor servicio
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ELECTRODOMESTICOS.map((electro) => {
                        const isChecked = form3.watch('electrodomesticos').includes(electro.value)
                        return (
                          <div
                            key={electro.value}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox
                              id={electro.value}
                              checked={isChecked}
                              onCheckedChange={() => toggleElectrodomestico(electro.value)}
                            />
                            <label
                              htmlFor={electro.value}
                              className="text-sm font-medium leading-none cursor-pointer flex-1 flex items-center gap-2"
                            >
                              <span>{electro.icon}</span>
                              {electro.label}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                    {form3.formState.errors.electrodomesticos && (
                      <p className="text-sm text-red-600">{form3.formState.errors.electrodomesticos.message}</p>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#27AE60] hover:bg-[#219150] text-white px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Completar Registro
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#64748B]">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-[#A50034] hover:text-[#c9003f] font-medium transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
