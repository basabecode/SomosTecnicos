/**
 * Reset Password Page - SomosTécnicos
 * Página para restablecer contraseña con token
 */

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Home
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenError, setTokenError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Validar token al cargar
  useEffect(() => {
    if (!token) {
      setTokenError('Token no proporcionado')
      setValidating(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`)
        const data = await response.json()

        if (data.valid) {
          setTokenValid(true)
          setUserEmail(data.email || '')
        } else {
          setTokenError(data.error || 'Token inválido')
        }
      } catch (err) {
        setTokenError('Error verificando el token')
      } finally {
        setValidating(false)
      }
    }

    verifyToken()
  }, [token])

  // Validar fortaleza de contraseña
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validatePassword(newPassword)) return

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || 'Error al restablecer la contraseña')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // Indicador de fortaleza de contraseña
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { label: '', color: '' }
    if (password.length < 6) return { label: 'Muy débil', color: 'text-red-600' }
    if (password.length < 8) return { label: 'Débil', color: 'text-orange-600' }
    if (password.length < 12) return { label: 'Buena', color: 'text-yellow-600' }
    return { label: 'Fuerte', color: 'text-green-600' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto min-h-screen">
        <div className="grid md:grid-cols-2 relative bg-white min-h-screen">
          {/* Botón Home - Mobile */}
          <Link href="/" className="md:hidden absolute top-4 right-4 z-50">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full active:bg-white/20 transition-colors">
              <Home className="h-5 w-5 text-white" />
            </div>
          </Link>

          {/* LADO IZQUIERDO - BRANDING */}
          <div className="hidden md:flex flex-col relative bg-gradient-to-br from-[#8B1538] via-primary to-[#2C3E50] overflow-hidden">
            <div className="absolute top-0 right-0 w-150 h-150 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-150 h-150 bg-black/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col h-full px-8 lg:px-16 py-6 lg:py-8 justify-between">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-4">
                  <Image
                    src="/img-3d/logo_modificado.jpeg"
                    alt="SomosTécnicos"
                    width={70}
                    height={70}
                    className="h-16 w-16 object-contain"
                    priority
                  />
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    SomosTécnicos
                  </h1>
                </div>

                <div className="space-y-4 max-w-xl">
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    Nueva Contraseña
                  </h2>
                  <p className="text-lg text-blue-100 font-medium leading-relaxed">
                    Crea una contraseña segura para proteger tu cuenta.
                  </p>
                </div>

                <div className="space-y-4 max-w-xl pt-4">
                  {[
                    "Mínimo 6 caracteres",
                    "Combina letras y números",
                    "Usa caracteres especiales para mayor seguridad"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white/90 text-sm lg:text-base">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center py-4 lg:py-6">
                <div className="relative w-full max-w-xs lg:max-w-md aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  <Image
                    src="/img-3d/tecnico_saludando_cliente.jpeg"
                    alt="Seguridad"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 320px, 448px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO / MÓVIL MAIN */}
          <div className="flex flex-col bg-white overflow-y-auto">
            {/* HEADER MÓVIL */}
            <div className="md:hidden bg-primary py-8 px-6 pt-16 flex flex-col items-center justify-center text-center relative shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/img-3d/logo_modificado.jpeg"
                  alt="SomosTécnicos"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
                <h1 className="text-2xl font-bold text-white tracking-tight">SomosTécnicos</h1>
              </div>
              <p className="text-white/90 text-base font-medium">Restablecer contraseña</p>
            </div>

            {/* CONTENEDOR FORMULARIO */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 w-full">
              <div className="w-full max-w-100 lg:max-w-[450px] animate-in fade-in slide-in-from-bottom-4 duration-500">

                {validating ? (
                  /* VALIDANDO TOKEN */
                  <div className="text-center space-y-6">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-[#6B7280] text-base">Verificando enlace...</p>
                  </div>
                ) : !tokenValid ? (
                  /* TOKEN INVÁLIDO */
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-10 h-10 text-red-600" />
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#111827]">
                        Enlace Inválido
                      </h2>
                      <p className="text-[#6B7280] text-base">
                        {tokenError}
                      </p>
                    </div>

                    <Link href="/forgot-password" className="block">
                      <Button className="w-full h-[54px] bg-primary hover:bg-primary/90 text-white font-semibold text-[17px] rounded-xl">
                        Solicitar Nuevo Enlace
                      </Button>
                    </Link>
                  </div>
                ) : success ? (
                  /* ÉXITO */
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#111827]">
                        ¡Contraseña Actualizada!
                      </h2>
                      <p className="text-[#6B7280] text-base">
                        Tu contraseña ha sido restablecida correctamente.
                      </p>
                      <p className="text-[#6B7280] text-sm">
                        Redirigiendo al login en 3 segundos...
                      </p>
                    </div>

                    <Link href="/login" className="block">
                      <Button className="w-full h-[54px] bg-primary hover:bg-primary/90 text-white font-semibold text-[17px] rounded-xl">
                        Ir al Login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  /* FORMULARIO */
                  <>
                    <div className="mb-8 lg:mb-10 text-center md:text-left">
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-2">
                        Nueva Contraseña
                      </h2>
                      <p className="text-[#6B7280] text-sm lg:text-base">
                        {userEmail && `Para: ${userEmail}`}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Nueva Contraseña */}
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium text-[#374151]">
                          Nueva Contraseña
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            id="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value)
                              validatePassword(e.target.value)
                            }}
                            required
                            disabled={loading}
                            className="h-13 pl-12 pr-12 bg-white border border-[#E5E7EB] rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {newPassword && (
                          <p className={`text-xs font-medium ${passwordStrength.color}`}>
                            Fortaleza: {passwordStrength.label}
                          </p>
                        )}
                        {passwordError && (
                          <p className="text-xs text-red-500">{passwordError}</p>
                        )}
                      </div>

                      {/* Confirmar Contraseña */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#374151]">
                          Confirmar Contraseña
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock className="h-5 w-5" />
                          </div>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="h-13 pl-12 pr-12 bg-white border border-[#E5E7EB] rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                        )}
                      </div>

                      {error && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700 rounded-xl">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="ml-2 font-medium">
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        className="w-full h-[54px] bg-primary hover:bg-primary/90 text-white font-semibold text-[17px] rounded-xl shadow-md transition-all active:scale-[0.98]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          <>
                            Restablecer Contraseña
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

