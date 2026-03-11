'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Wrench, ArrowRight, Home, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#E3F2FD]">
      {/* Header con botón de volver */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-[#2C3E50] hover:text-primary transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            <Link
              href="/login"
              className="text-sm text-[#64748B] hover:text-primary transition-colors"
            >
              ¿Ya tienes cuenta? <span className="font-semibold">Inicia sesión</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/img-3d/logo_modificado.avif"
              alt="SomosTécnicos"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2C3E50] leading-tight tracking-tight mb-4">
            Únete a <span className="text-primary">SomosTécnicos</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto">
            Selecciona el tipo de cuenta que deseas crear para comenzar
          </p>
        </div>

        {/* Opciones de Registro */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Opción: Cliente */}
          <Card className="group border-2 border-gray-100 hover:border-primary transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-[#c9003f]" />
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Users className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#2C3E50]">
                Soy Cliente
              </CardTitle>
              <CardDescription className="text-base">
                Solicita servicios técnicos profesionales a domicilio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 mb-6">
                {[
                  'Solicita reparaciones en minutos',
                  'Seguimiento en tiempo real',
                  'Técnicos certificados y calificados',
                  'Garantía en todos los servicios',
                  'Historial completo de servicios',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register/customer" className="block">
                <Button className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all group">
                  Registrarme como Cliente
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Opción: Técnico */}
          <Card className="group border-2 border-gray-100 hover:border-[#2C3E50] transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#2C3E50] to-[#34495E]" />
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 w-20 h-20 rounded-2xl bg-[#2C3E50]/10 flex items-center justify-center group-hover:bg-[#2C3E50] transition-colors">
                <Wrench className="w-10 h-10 text-[#2C3E50] group-hover:text-white transition-colors" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#2C3E50]">
                Soy Técnico
              </CardTitle>
              <CardDescription className="text-base">
                Ofrece tus servicios profesionales y crece tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 mb-6">
                {[
                  'Recibe solicitudes de trabajo',
                  'Gestiona tu agenda digital',
                  'Aumenta tus ingresos',
                  'Perfil profesional verificado',
                  'Pagos seguros y puntuales',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-[#2C3E50] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register/technician" className="block">
                <Button className="w-full h-12 bg-[#2C3E50] hover:bg-[#34495E] text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all group">
                  Registrarme como Técnico
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-[#64748B]">
            Al registrarte, aceptas nuestros{' '}
            <Link href="/terminos-y-condiciones" className="text-primary hover:underline font-medium">
              Términos y Condiciones
            </Link>
          </p>
          <p className="text-xs text-[#9CA3AF]">
            © 2026 SomosTécnicos. Plataforma de servicios técnicos profesionales.
          </p>
        </div>
      </div>
    </div>
  )
}
