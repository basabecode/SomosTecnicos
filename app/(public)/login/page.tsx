/**
 * Login - SomosTécnicos
 * Rediseño: Precision Workshop — panel oscuro + formulario quirúrgico
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Eye,
  EyeOff,
  Wrench,
  AlertCircle,
  Loader2,
  Home,
  Mail,
  Lock,
  ArrowRight,
  Edit2,
  XCircle,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { TermsLink } from '@/components/terms-link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, login: authLogin } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role || 'admin'
      let dashboardUrl = '/admin/dashboard'

      switch (userRole) {
        case 'admin':
        case 'super_admin': dashboardUrl = '/admin/dashboard'; break
        case 'manager':
        case 'gerente': dashboardUrl = '/manager/dashboard'; break
        case 'technician':
        case 'tecnico':
        case 'technician_manager': dashboardUrl = '/technician/dashboard'; break
        case 'customer':
        case 'cliente': dashboardUrl = '/customer/dashboard'; break
        default: dashboardUrl = '/admin/dashboard'
      }

      router.replace(dashboardUrl)
    }
  }, [isAuthenticated, user, router])

  const validateForm = () => {
    let isValid = true
    setEmailError('')
    setPasswordError('')

    if (!email) {
      setEmailError('El correo electrónico es requerido')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Por favor ingresa un correo válido')
      isValid = false
    }

    if (!password) {
      setPasswordError('La contraseña es requerida')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    const result = await authLogin(email, password)

    if (result.success && result.user) {
        // Redirection is handled by useEffect when isAuthenticated becomes true
        // But we can also redirect here for immediate feedback if needed,
        // essentially relying on state update spread is safer.
        // However, useAuth handles state update, so we just wait for useEffect or do manual push.
        // For smoother UX, let's let useEffect handle it or push here to match legacy logic.

        const userRole = result.user.role || 'admin'
        let dashboardUrl = '/admin/dashboard'

        switch (userRole) {
          case 'admin':
          case 'super_admin': dashboardUrl = '/admin/dashboard'; break
          case 'manager':
          case 'gerente': dashboardUrl = '/manager/dashboard'; break
          case 'technician':
          case 'tecnico':
          case 'technician_manager': dashboardUrl = '/technician/dashboard'; break
          case 'customer':
          case 'cliente': dashboardUrl = '/customer/dashboard'; break
          default: dashboardUrl = '/admin/dashboard'
        }

        router.push(dashboardUrl) // Use router.push instead of window.location.href for SPA feel
    } else {
        setError(result.error || 'Credenciales incorrectas. Verifica tu correo y contraseña.')
        setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row relative">

      {/* ══════════════════════════════════════════
          PANEL IZQUIERDO — Taller oscuro (md+)
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col w-5/12 xl:w-[42%] relative bg-[#2d1420] overflow-hidden">

        {/* Halos ambientales */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-st-primary/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/4 left-0 w-60 h-60 bg-rose-950/30 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-10">

          {/* Logo — contenedor unificado estilo píldora */}
          <div className="mb-12">
            <div className="inline-flex items-center bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.25)] border border-white/10 overflow-hidden pl-2 pr-4 py-2 gap-0">
              {/* Ícono ST — cuadrado recortado */}
              <div className="w-10 h-10 flex-shrink-0 relative overflow-hidden rounded-xl">
                <Image
                  src="/img-3d/logo_modificado.jpeg"
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              {/* Separador visual sutil */}
              <div className="w-px h-6 bg-gray-200 mx-3 flex-shrink-0" />
              {/* Wordmark — sin fondo extra, objeto contenido */}
              <div className="relative h-7 w-[148px] flex-shrink-0">
                <Image
                  src="/img-3d/logotipo_somostecnicos_nuevo.jpg"
                  alt="SomosTécnicos"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Titular */}
          <div className="mb-10">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-st-primary mb-3">
              Portal de acceso
            </p>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.05] font-display mb-4">
              Todo bajo<br />control.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Gestiona servicios, coordina técnicos y da seguimiento a cada orden desde un solo lugar.
            </p>
          </div>

          {/* Foto — anclada al fondo */}
          <div className="flex-1 flex items-end">
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/8" style={{ aspectRatio: '4/3' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1420] via-transparent to-transparent z-10" />
              <Image
                src="/img-3d/tecnico_saludando_cliente.jpeg"
                alt="Técnico certificado SomosTécnicos"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 42vw, 45vw"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <p className="text-white font-semibold text-sm">Confianza y Calidad</p>
                <p className="text-gray-400 text-xs mt-0.5">Tu satisfacción es nuestra prioridad</p>
              </div>
            </div>
          </div>

        </div>

        {/* Divisor rojo — umbral de acceso */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-st-primary/40 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════
          PANEL DERECHO — Espacio del formulario
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">

        {/* Header móvil (< md) */}
        <div className="md:hidden relative bg-[#2d1420] px-6 pt-14 pb-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d1420] via-[#3d1a2a] to-[#2d1420] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo píldora — móvil */}
            <div className="inline-flex items-center bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.3)] overflow-hidden pl-1.5 pr-3 py-1.5 gap-0 mb-2">
              <div className="w-7 h-7 flex-shrink-0 relative overflow-hidden rounded-lg">
                <Image
                  src="/img-3d/logo_modificado.jpeg"
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="w-px h-4 bg-gray-200 mx-2 flex-shrink-0" />
              <div className="relative h-5 w-[110px] flex-shrink-0">
                <Image
                  src="/img-3d/logotipo_somostecnicos_nuevo.jpg"
                  alt="SomosTécnicos"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm">Portal de acceso</p>
          </div>
        </div>

        {/* Botón Inicio — desktop */}
        <Link href="/" className="hidden md:flex absolute top-6 right-6 z-50">
          <Button
            variant="ghost"
            className="h-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-sm gap-2 border border-gray-200"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Button>
        </Link>

        {/* Botón Inicio — móvil */}
        <Link href="/" className="md:hidden absolute top-4 right-4 z-50">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full active:bg-white/20 transition-colors">
            <Home className="h-5 w-5 text-white" />
          </div>
        </Link>

        {/* Área del formulario */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 md:px-10 lg:px-16">
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Encabezado */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-[1.75rem] font-bold text-gray-900 font-display mb-1">
                Iniciar sesión
              </h1>
              <p className="text-gray-500 text-sm">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Campo email */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Correo Electrónico
                  </Label>
                  {email && !isEditingEmail && (
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                      className="text-xs text-st-primary font-medium flex items-center gap-1 hover:underline"
                    >
                      <Edit2 className="w-3 h-3" /> Cambiar
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setIsEditingEmail(true)
                      if (emailError) setEmailError('')
                    }}
                    required
                    disabled={loading}
                    className={`h-11 pl-10 text-sm rounded-lg border transition-all ${
                      emailError
                        ? 'border-red-400 focus-visible:ring-red-200'
                        : 'border-gray-200 focus-visible:border-st-primary focus-visible:ring-st-primary/15'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-left-1">
                    <XCircle className="w-3 h-3 flex-shrink-0" /> {emailError}
                  </p>
                )}
              </div>

              {/* Campo contraseña */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${passwordError ? 'text-red-400' : 'text-gray-400'}`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError('')
                    }}
                    required
                    disabled={loading}
                    className={`h-11 pl-10 pr-11 text-sm rounded-lg border transition-all ${
                      passwordError
                        ? 'border-red-400 focus-visible:ring-red-200'
                        : 'border-gray-200 focus-visible:border-st-primary focus-visible:ring-st-primary/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-left-1">
                    <XCircle className="w-3 h-3 flex-shrink-0" /> {passwordError}
                  </p>
                )}
                <div className="flex justify-end pt-0.5">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Error general */}
              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-700 rounded-lg py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <AlertDescription className="ml-2 text-sm font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {/* Botón submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-st-primary hover:bg-st-primary-hover text-white font-semibold text-sm rounded-lg transition-all active:scale-[0.98] mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Ingresar <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Registro */}
            <p className="mt-6 text-center text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="text-st-primary font-semibold hover:underline cursor-pointer"
              >
                Regístrate gratis
              </button>
            </p>

            {/* Footer legal */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex justify-center gap-5 text-xs text-gray-400">
                <TermsLink className="hover:text-gray-600 transition-colors" showIcon={false}>
                  Términos
                </TermsLink>
                <span aria-hidden="true">·</span>
                <TermsLink className="hover:text-gray-600 transition-colors" showIcon={false}>
                  Privacidad
                </TermsLink>
              </div>
              <p className="mt-3 text-center text-[11px] text-gray-300">
                © 2026 SomosTécnicos. Todos los derechos reservados.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MODAL — Selección de registro
      ══════════════════════════════════════════ */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
            <div className="bg-[#1a0a0f] px-6 py-5 text-center">
              <h2 className="text-xl font-bold text-white font-display mb-1">Únete a SomosTécnicos</h2>
              <p className="text-gray-400 text-xs">Selecciona tu perfil para continuar</p>
            </div>

            {/* Opciones */}
            <div className="p-5 space-y-3">
              <Link
                href="/register/customer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-st-primary hover:bg-red-50/30 transition-all duration-200"
                onClick={() => setIsRegisterModalOpen(false)}
              >
                <div className="p-2.5 bg-st-primary/10 rounded-lg group-hover:bg-st-primary transition-colors flex-shrink-0">
                  <Users className="w-5 h-5 text-st-primary group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Soy Cliente</p>
                  <p className="text-gray-400 text-xs">Solicita servicios técnicos expertos</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-st-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>

              <Link
                href="/register/technician"
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsRegisterModalOpen(false)}
              >
                <div className="p-2.5 bg-gray-100 rounded-lg group-hover:bg-[#2C3E50] transition-colors flex-shrink-0">
                  <Wrench className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Soy Técnico</p>
                  <p className="text-gray-400 text-xs">Únete a nuestra red de profesionales</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            </div>

            {/* Footer modal */}
            <div className="px-5 pb-5 text-center">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
