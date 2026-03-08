/**
 * Forgot Password Page - SomosTécnicos
 * Página de solicitud de recuperación de contraseña
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Home
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Error al procesar la solicitud')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto min-h-screen">
        <div className="grid md:grid-cols-2 relative bg-white min-h-screen">
          {/* Botón Volver - Desktop */}
          <Link href="/login" className="hidden md:flex absolute top-6 right-6 z-50 group">
            <Button
              variant="ghost"
              className="text-[#2C3E50] hover:text-primary hover:bg-gray-50 transition-all border border-gray-200 hover:border-primary/30 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Volver al Login
            </Button>
          </Link>

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
                    Recupera tu Acceso
                  </h2>
                  <p className="text-lg text-blue-100 font-medium leading-relaxed">
                    Te ayudaremos a restablecer tu contraseña de forma segura.
                  </p>
                </div>

                <div className="space-y-4 max-w-xl pt-4">
                  {[
                    "Proceso simple y seguro",
                    "Enlace de recuperación enviado a tu email",
                    "Válido por 1 hora para tu protección"
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
              <p className="text-white/90 text-base font-medium">Recupera tu contraseña</p>
            </div>

            {/* CONTENEDOR FORMULARIO */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 w-full">
              <div className="w-full max-w-100 lg:max-w-[450px] animate-in fade-in slide-in-from-bottom-4 duration-500">

                {success ? (
                  /* MENSAJE DE ÉXITO */
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#111827]">
                        ¡Revisa tu Email!
                      </h2>
                      <p className="text-[#6B7280] text-base">
                        Si el correo <strong>{email}</strong> está registrado, recibirás instrucciones para restablecer tu contraseña.
                      </p>
                    </div>

                    <Alert className="bg-blue-50 border-blue-200 text-left">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="ml-2 text-blue-800 text-sm">
                        El enlace expirará en 1 hora. Si no recibes el correo, revisa tu carpeta de spam.
                      </AlertDescription>
                    </Alert>

                    <Link href="/login" className="block">
                      <Button className="w-full h-[54px] bg-primary hover:bg-primary/90 text-white font-semibold text-[17px] rounded-xl">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Volver al Login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  /* FORMULARIO */
                  <>
                    <div className="mb-8 lg:mb-10 text-center md:text-left">
                      <h2 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-2">
                        ¿Olvidaste tu Contraseña?
                      </h2>
                      <p className="text-[#6B7280] text-sm lg:text-base">
                        Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-[#374151]">
                          Correo Electrónico
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Mail className="h-5 w-5" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="h-13 pl-12 bg-white border border-[#E5E7EB] rounded-xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
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
                        disabled={loading}
                        className="w-full h-[54px] bg-primary hover:bg-primary/90 text-white font-semibold text-[17px] rounded-xl shadow-md transition-all active:scale-[0.98]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar Instrucciones
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-8 text-center">
                      <Link
                        href="/login"
                        className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Login
                      </Link>
                    </div>
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
