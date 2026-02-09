'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sparkles, Star, Shield, Clock, Wrench, Zap } from 'lucide-react'

/**
 * Hero Section con Diseño Distintivo y Animaciones Orquestadas
 * - Tipografía personalizada (Outfit + Plus Jakarta Sans)
 * - Staggered reveals para entrada dramática
 * - Elementos visuales memorables (patrón de herramientas)
 * - Micro-interacciones y efectos de hover creativos
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
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-br from-white via-blue-50/30 to-slate-50"
    >
      {/* Patrón de herramientas decorativo - Elemento memorable - Responsive */}
      <div className="absolute inset-0 z-0 opacity-[0.06] lg:opacity-[0.03] pointer-events-none">
        {/* Mobile: Iconos más pequeños y mejor posicionados */}
        <div className="absolute top-10 left-4 lg:top-20 lg:left-10 animate-float-slow">
          <Wrench className="w-12 h-12 lg:w-24 lg:h-24 text-[#A50034] rotate-45" />
        </div>
        <div className="absolute top-24 right-4 lg:top-40 lg:right-20 animate-float-slower">
          <Zap className="w-16 h-16 lg:w-32 lg:h-32 text-[#2C3E50] -rotate-12" />
        </div>
        <div className="absolute bottom-40 left-8 lg:bottom-32 lg:left-1/4 animate-float-slow">
          <Shield className="w-14 h-14 lg:w-28 lg:h-28 text-[#A50034] rotate-12" />
        </div>
        <div className="absolute bottom-24 right-8 lg:bottom-20 lg:right-1/3 animate-float-slower">
          <Sparkles className="w-10 h-10 lg:w-20 lg:h-20 text-[#2C3E50] -rotate-45" />
        </div>
      </div>

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

      {/* Gradiente de opacidad para móviles - Más sutil para ver el fondo */}
      <div className="lg:hidden absolute inset-0 z-[1] bg-gradient-to-b from-transparent from-10% via-white/40 via-60% to-white"></div>

      {/* Overlay gradiente para mejorar legibilidad del texto */}
      <div className="hidden lg:block absolute inset-0 z-[1] bg-gradient-to-r from-white from-20% via-white/25 to-transparent"></div>

      {/* Contenido principal con animaciones orquestadas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Columna de Contenido (Texto) - Staggered Animation */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-8">

            {/* Badge Premium - Animación delay 0ms */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm border border-[#E3F2FD] shadow-sm text-blue-700 text-sm font-semibold mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                <span>Bienvenido a SomosTécnicos</span>
            </div>

            {/* Título Principal - Animación delay 100ms */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C3E50] leading-[1.15] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Reparaciones Inteligentes para tu Hogar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A50034] via-[#ff4d4d] to-[#A50034] mt-2 pb-2 animate-gradient-x">
                  ¡Pídelo ya!
                </span>
              </h1>

              {/* Descripción - Animación delay 200ms */}
              <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] font-medium animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Plataforma digital para solicitar reparaciones de equipos con técnicos especializados, si eres técnico capacitado puedes ofrecer tus servicios en la plataforma.
                <span className="block mt-2 font-semibold text-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                  Garantía, seguridad y conocimiento en un solo lugar.
                </span>
              </p>
            </div>

            {/* Trust Indicators - Animación delay 300ms */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <div className="p-1 bg-slate-950 rounded-full group-hover:scale-110 transition-transform">
                        <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-slate-700">Mejor Calificación</span>
                </div>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <div className="p-1 bg-slate-400 rounded-full group-hover:scale-110 transition-transform">
                         <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700">Garantía</span>
                </div>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    <div className="p-1 bg-slate-100 rounded-full group-hover:scale-110 transition-transform">
                        <Clock className="w-4 h-4 text-slate-900" />
                    </div>
                    <span className="font-semibold text-slate-700">Atención lun/sab</span>
                </div>
            </div>

            {/* Botones de Acción - Animación delay 400ms */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#A50034] hover:bg-[#c9003f] text-white text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 hover:scale-105 font-bold group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Solicitar Servicio
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c9003f] to-[#A50034] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
              <Button
                onClick={openAIChat}
                variant="outline"
                size="lg"
                className="bg-white/95 backdrop-blur-sm hover:bg-white text-[#2C3E50] border-2 border-gray-200 hover:border-[#A50034] text-lg px-8 py-7 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 font-semibold group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:text-[#A50034] transition-colors" />
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
