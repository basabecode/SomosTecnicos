/**
 * Login Unificado - TecnoCity
 * Sistema de login profesional con detección automática de rol
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
  Eye,
  EyeOff,
  Wrench,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

export default function UnifiedLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

      // Manejar estado de técnico pendiente
      if (data.status === 'pending_approval') {
        setError(data.message || 'Tu solicitud está siendo revisada')
        setLoading(false)
        return
      }

      // Manejar estado de técnico rechazado
      if (data.status === 'rejected') {
        setError(data.message || 'Tu solicitud fue rechazada')
        setLoading(false)
        return
      }

      if (response.ok && data.success) {
        // Guardar tokens
        localStorage.setItem('accessToken', data.accessToken)
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }

        // Determinar dashboard según rol del servidor
        const userRole = data.user?.role || 'admin'

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
          case 'technician_manager':
            dashboardUrl = '/technician/dashboard'
            break
          case 'customer':
          case 'cliente':
            dashboardUrl = '/customer/dashboard'
            break
          default:
            dashboardUrl = '/admin/dashboard'
        }

        // Forzar redirección completa
        window.location.href = dashboardUrl
      } else {
        setError(data.message || data.error || 'Email o contraseña incorrectos')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Lado izquierdo - Branding e información */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Wrench className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TecnoCity
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Servicio Técnico Profesional
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-3 mt-8">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Bienvenido de vuelta
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Accede a tu panel de control y gestiona tus servicios de manera eficiente.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div className="p-2 bg-green-100 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Acceso Seguro</h3>
                <p className="text-sm text-gray-600">
                  Autenticación encriptada y protección de datos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Detección Automática</h3>
                <p className="text-sm text-gray-600">
                  El sistema identifica tu rol automáticamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multi-Rol</h3>
                <p className="text-sm text-gray-600">
                  Soporte para admin, técnicos y clientes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario de login */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-6">
              {/* Logo móvil */}
              <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Wrench className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    TecnoCity
                  </h1>
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Ingresa tus credenciales para acceder
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Contraseña
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Información</span>
                </div>
              </div>

              {/* Info adicional */}
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800 text-center">
                    <Shield className="inline h-3 w-3 mr-1" />
                    Conexión segura y encriptada
                  </p>
                </div>

                <p className="text-xs text-center text-gray-500">
                  ¿Necesitas ayuda?{' '}
                  <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
                    Contacta soporte
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer info */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Al iniciar sesión, aceptas nuestros{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
