'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sparkles, Star, Shield, Clock } from 'lucide-react'

/**
 * Hero Section con Imagen de Fondo Centrada
 * - Imagen centrada dentro de los límites del contenedor
 * - Sin gradientes que opaquen la imagen
 * - Contenido superpuesto con buena legibilidad
 */
export default function HeroSection() {
  const scrollToForm = () => {
    const element = document.getElementById('formulario')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openAIChat = () => {
    window.dispatchEvent(
      new CustomEvent('openAIChat', {
        detail: { fromHero: true },
      })
    )
  }

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 bg-white"
    >
      {/* Imagen de fondo centrada - oculta en móviles */}
      <div className="hidden lg:flex absolute inset-0 z-0 items-center justify-center p-4 lg:p-8">
        <div className="relative w-full h-full max-w-[1200px] max-h-[900px] lg:translate-x-[2%]">
          <Image
            src="/hero/hogar_moderno_2.png"
            alt="Casa Inteligente"
            fill
            className="object-contain object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
        </div>
      </div>

      {/* Versión móvil de la imagen - posicionada arriba */}
      <div className="lg:hidden absolute inset-0 z-0 flex items-start justify-center pt-16">
        <div className="relative w-full h-full">
          <Image
            src="/hero/hero_mobil.jpeg"
            alt="Casa Inteligente"
            fill
            className="object-contain object-top"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Gradiente de opacidad para móviles - de transparente arriba a blanco abajo */}
      <div className="lg:hidden absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-white/60 to-white"></div>

      {/* Overlay gradiente para mejorar legibilidad del texto - de izquierda a derecha */}
      <div className="hidden lg:block absolute inset-0 z-[1] bg-gradient-to-r from-white from-20% via-white/25 to-transparent"></div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Columna de Contenido (Texto) */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-8 animate-in slide-in-from-left duration-700 fade-in">

            {/* Badge Premium */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm border border-[#E3F2FD] shadow-sm text-blue-700 text-sm font-semibold mx-auto lg:mx-0">
                <span>Bienvenido</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C3E50] leading-[1.15] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Reparaciones Inteligentes para tu Hogar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A50034] to-[#ff4d4d] mt-2 pb-2">
                  Pídelo ya!
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] font-medium">
                Plataforma digital para solicitar reparaciones de equipos con técnicos especializados, si eres técnico capacitado puedes ofrecer tus servicios en la plataforma.
                <span className="block mt-2 font-semibold text-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                  Garantía, seguridad y conocimiento en un solo lugar.
                </span>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="p-1 bg-slate-950 rounded-full">
                        <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-slate-700">Mejor Calificación</span>
                </div>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="p-1 bg-slate-400 rounded-full">
                         <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700">Garantía</span>
                </div>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="p-1 bg-slate-100 rounded-full">
                        <Clock className="w-4 h-4 text-slate-900" />
                    </div>
                    <span className="font-semibold text-slate-700">Atención lun/sab</span>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#A50034] hover:bg-[#c9003f] text-white text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 font-bold"
              >
                Solicitar Servicio
              </Button>
              <Button
                onClick={openAIChat}
                variant="outline"
                size="lg"
                className="bg-white/95 backdrop-blur-sm hover:bg-white text-[#2C3E50] border-2 border-gray-200 text-lg px-8 py-7 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold"
              >
                Hablar con IA
              </Button>
            </div>
          </div>

          {/* Columna derecha - Espacio vacío para que la imagen de fondo se vea */}
          <div className="hidden lg:block order-1 lg:order-2 h-[650px] w-full">
            {/* Este espacio permite que la imagen de fondo se aprecie */}
          </div>

        </div>
      </div>
    </section>
  )
}
