/**
 * Login Unificado - TecnoCity
 * Sistema de login que detecta automáticamente el rol del usuario
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
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Wrench,
  Shield,
  Settings,
  Users,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

// Tipos de usuario y sus configuraciones
const USER_TYPES = {
  admin: {
    icon: Shield,
    name: 'Administrador',
    color: 'bg-red-100 text-red-800 border-red-200',
    dashboard: '/admin/dashboard',
    description: 'Panel completo de administración',
  },
  manager: {
    icon: Settings,
    name: 'Gerente',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    dashboard: '/manager/dashboard',
    description: 'Gestión de operaciones',
  },
  technician: {
    icon: Wrench,
    name: 'Técnico',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    dashboard: '/technician/dashboard',
    description: 'Órdenes de trabajo asignadas',
  },
  customer: {
    icon: User,
    name: 'Cliente',
    color: 'bg-green-100 text-green-800 border-green-200',
    dashboard: '/customer/dashboard',
    description: 'Seguimiento de servicios',
  },
}

export default function UnifiedLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [detectedUserType, setDetectedUserType] = useState<string | null>(null)
  const router = useRouter()

  // Detectar tipo de usuario basado en el email (preview)
  const detectUserType = (email: string) => {
    if (!email) return null

    const emailLower = email.toLowerCase()

    if (emailLower.includes('admin')) return 'admin'
    if (emailLower.includes('manager') || emailLower.includes('gerente'))
      return 'manager'
    if (emailLower.includes('tecnico') || emailLower.includes('technician'))
      return 'technician'

    // Por defecto, si no coincide con patrones admin/manager/technician, es customer
    return 'customer'
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setDetectedUserType(detectUserType(newEmail))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Guardar tokens
        localStorage.setItem('accessToken', data.accessToken)
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }

        // Determinar dashboard según rol del servidor (prioritario)
        const userRole = data.user?.role || detectedUserType || 'admin'

        // Debugging en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Login exitoso:', {
            userRole,
            serverRole: data.user?.role,
            detectedType: detectedUserType,
            email: data.user?.email,
          })
        }

        // Mapear roles correctamente
        let dashboardUrl = '/admin/dashboard' // Default fallback

        switch (userRole) {
          case 'admin':
          case 'super_admin':
            dashboardUrl = '/admin/dashboard'
            break
          case 'manager':
          case 'gerente':
            dashboardUrl = '/manager/dashboard'
            break
          case 'technician':
          case 'tecnico':
            dashboardUrl = '/technician/dashboard'
            break
          case 'customer':
          case 'cliente':
            dashboardUrl = '/customer/dashboard'
            break
          default:
            // Para usuarios admin por defecto
            dashboardUrl = '/admin/dashboard'
        }

        console.log('🎯 Redirigiendo a:', dashboardUrl)

        // Limpiar error y redirigir
        setError('')

        // Forzar redirección completa
        window.location.href = dashboardUrl
      } else {
        setError(data.message || 'Email o contraseña incorrectos')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Función para llenar credenciales de prueba
  const fillTestCredentials = (userType: 'admin' | 'customer') => {
    if (userType === 'admin') {
      setEmail('admin@servicio-tecnico.com')
      setPassword('Admin123!')
    } else {
      setEmail('cliente.demo@tecnocity.com')
      setPassword('Cliente123!')
    }
    setDetectedUserType(userType)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Lado izquierdo - Información */}
        <div className="space-y-6 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔧 TecnoCity
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              **Sistema Inteligente de Login**
            </p>
            <p className="text-lg text-gray-500 mt-2">
              Ingresa tu email y automáticamente detectaremos tu rol
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(USER_TYPES).map(([key, type]) => {
              const Icon = type.icon
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border"
                >
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{type.name}</h3>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Vista previa del tipo de usuario detectado */}
          {detectedUserType && (
            <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Tipo de usuario detectado:
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {(() => {
                  const Icon =
                    USER_TYPES[detectedUserType as keyof typeof USER_TYPES]
                      ?.icon
                  return Icon ? <Icon className="h-4 w-4" /> : null
                })()}
                <Badge
                  className={
                    USER_TYPES[detectedUserType as keyof typeof USER_TYPES]
                      ?.color
                  }
                >
                  {
                    USER_TYPES[detectedUserType as keyof typeof USER_TYPES]
                      ?.name
                  }
                </Badge>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {
                    USER_TYPES[detectedUserType as keyof typeof USER_TYPES]
                      ?.dashboard
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Lado derecho - Formulario de login */}
        <div className="space-y-6">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Iniciar Sesión
              </CardTitle>
              <CardDescription>
                Detectamos automáticamente tu tipo de cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-12 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Botones de prueba */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                🧪 Cuentas de Prueba
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Haz clic para usar credenciales de prueba
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillTestCredentials('admin')}
                  className="justify-start h-auto p-3 border-red-200 hover:bg-red-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Shield className="h-4 w-4 text-red-600" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Administrador</div>
                      <div className="text-xs text-gray-600">
                        admin@servicio-tecnico.com
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fillTestCredentials('customer')}
                  className="justify-start h-auto p-3 border-green-200 hover:bg-green-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <User className="h-4 w-4 text-green-600" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">Cliente Demo</div>
                      <div className="text-xs text-gray-600">
                        cliente.demo@tecnocity.com
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
