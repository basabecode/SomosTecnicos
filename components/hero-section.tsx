'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sparkles, Star, Shield, Clock, Wrench } from 'lucide-react'

/**
 * Hero Section con Diseño Distintivo y Animaciones Orquestadas
 * Mobile/Tablet: Imagen de fondo completa con overlay oscuro + texto blanco
 * Desktop: Layout split con imagen a la derecha
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
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 lg:bg-gradient-to-br lg:from-white lg:via-blue-50/30 lg:to-slate-50 bg-[#1a1a2e]"
    >



      {/* DESKTOP: Imagen de fondo */}
      <div className="hidden lg:flex absolute inset-0 z-0 items-center justify-center p-4 lg:p-8">
        <div className="relative w-full h-full max-w-[1200px] max-h-[900px] lg:translate-x-[2%]">
          <Image
            src="/hero/hogar_moderno_2.png"
            alt="Casa Inteligente"
            fill
            className="object-contain object-center"
            priority
            sizes="1200px"
          />
        </div>
      </div>

      {/* DESKTOP: Overlay gradiente izquierdo */}
      <div className="hidden lg:block absolute inset-0 z-[1] bg-gradient-to-r from-white from-20% via-white/25 to-transparent"></div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE/TABLET: Imagen completa + overlay oscuro        */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Imagen móvil - object-cover para llenar todo el fondo */}
      <div className="lg:hidden absolute inset-0 z-0">
        <Image
          src="/hero/hero_mobil.jpeg"
          alt="Técnico y cliente - SomosTécnicos"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlay gradiente oscuro para móvil:
          - Arriba: semi-transparente → la imagen se ve claramente
          - Centro: transición suave
          - Abajo: más oscuro → texto legible */}
      <div className="lg:hidden absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/50 to-black/75"></div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONTENIDO PRINCIPAL                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Columna de Contenido */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-6 sm:space-y-8">

            {/* Título Principal */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h1 className="text-[clamp(1.75rem,6vw,3rem)] lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white lg:text-[#2C3E50] [text-shadow:0_2px_16px_rgba(0,0,0,0.6)] lg:[text-shadow:0_2px_8px_rgba(0,0,0,0.3)]">
                Reparaciones Inteligentes para tu Hogar
                <span className="block mt-2 pb-2 animate-gradient-x text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b6b] via-[#ff4d4d] to-[#ff8a8a] lg:from-[#A50034] lg:via-[#ff4d4d] lg:to-[#A50034]">
                  ¡Pídelo ya!
                </span>
              </h1>

              {/* Descripción */}
              <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up text-white/90 lg:text-black [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] lg:[text-shadow:0_1px_4px_rgba(0,0,0,0.2)]" style={{ animationDelay: '200ms' }}>
                Plataforma digital para solicitar reparaciones de equipos con técnicos especializados, si eres técnico capacitado puedes ofrecer tus servicios en la plataforma.
                <span className="block mt-2 font-semibold text-white lg:text-black">
                  Garantía, seguridad y conocimiento en un solo lugar.
                </span>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2 bg-white/15 lg:bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-lg border border-white/20 lg:border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[44px]">
                    <div className="p-1 bg-white/20 lg:bg-slate-950 rounded-full group-hover:scale-110 transition-transform">
                        <Star className="w-4 h-4 text-yellow-400 lg:text-white fill-yellow-400 lg:fill-white" />
                    </div>
                    <span className="font-semibold text-white lg:text-slate-700">Mejor Calificación</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 lg:bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-lg border border-white/20 lg:border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[44px]">
                    <div className="p-1 bg-white/20 lg:bg-slate-400 rounded-full group-hover:scale-110 transition-transform">
                         <Shield className="w-4 h-4 text-green-400 lg:text-white" />
                    </div>
                    <span className="font-semibold text-white lg:text-slate-700">Garantía</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 lg:bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-lg border border-white/20 lg:border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-[44px]">
                    <div className="p-1 bg-white/20 lg:bg-slate-100 rounded-full group-hover:scale-110 transition-transform">
                        <Clock className="w-4 h-4 text-blue-300 lg:text-slate-900" />
                    </div>
                    <span className="font-semibold text-white lg:text-slate-700">Atención lun/sab</span>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2 sm:pt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#A50034] hover:bg-[#c9003f] active:scale-95 active:shadow-none text-white text-base sm:text-lg px-8 py-7 rounded-xl shadow-[0_0_20px_rgba(165,0,52,0.6)] lg:shadow-lg hover:shadow-2xl transition-all duration-150 hover:-translate-y-1 font-bold group relative overflow-hidden min-h-[52px]"
              >
                <span className="relative z-10">
                  Solicitar Servicio
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c9003f] to-[#A50034] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
              <Button
                onClick={openAIChat}
                variant="outline"
                size="lg"
                className="bg-white/10 lg:bg-white/95 backdrop-blur-sm hover:bg-white/20 lg:hover:bg-white active:bg-white/30 active:scale-95 text-white lg:text-[#2C3E50] border-2 border-white/30 lg:border-gray-200 hover:border-white/60 lg:hover:border-[#A50034] text-base sm:text-lg px-8 py-7 rounded-xl shadow-sm hover:shadow-lg transition-all duration-150 hover:-translate-y-1 font-semibold group min-h-[52px]"
              >
                Hablar con IA
              </Button>
            </div>
          </div>

          {/* Columna derecha - Espacio para imagen desktop */}
          <div className="hidden lg:block order-1 lg:order-2 h-[650px] w-full">
            {/* Este espacio permite que la imagen de fondo se aprecie */}
          </div>

        </div>
      </div>
    </section>
  )
}

