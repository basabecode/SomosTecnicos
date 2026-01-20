'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sparkles, Star, Shield, Clock } from 'lucide-react'

/**
 * Hero Section Optimizado - Mejoras Visuales 3D
 * - Layout de dos columnas para mayor impacto visual
 * - Integración de imagen 3D de alta calidad
 * - Tipografía y espaciado mejorados
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
      className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] via-white to-[#E3F2FD] overflow-hidden pt-16"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-50 to-transparent opacity-50 -z-0" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-pink-50 to-transparent opacity-50 -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Columna de Contenido (Texto) */}
          <div className="text-center lg:text-left order-2 lg:order-1 space-y-8 animate-in slide-in-from-left duration-700 fade-in">

            {/* Badge Premium */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-[#E3F2FD] shadow-sm text-blue-700 text-sm font-semibold mx-auto lg:mx-0">
                <span>Servicio Web</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C3E50] leading-[1.15] tracking-tight">
                Reparaciones Inteligentes para tu Hogar
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A50034] to-[#ff4d4d] mt-2 pb-2">
                  Pídelo ya!
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Plataforma digital para solicitar reparaciones de electrodomésticos con técnicos certificados.
                <span className="block mt-2 font-medium text-[#2C3E50]">
                  Garantía, seguridad y conocimiento en un solo lugar.
                </span>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="p-1 bg-slate-950 rounded-full">
                        <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-slate-700">Mejor Calificación</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="p-1 bg-slate-400 rounded-full">
                         <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700">Garantía</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
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
                className="bg-white hover:bg-gray-50 text-[#2C3E50] border-2 border-gray-200 text-lg px-8 py-7 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold"
              >
                Hablar con IA
              </Button>
            </div>
          </div>

          {/* Columna de Imagen (3D) */}
          <div className="relative order-1 lg:order-2 h-[350px] md:h-[500px] lg:h-[650px] w-full flex items-center justify-center animate-in zoom-in-50 duration-1000 fade-in slide-in-from-right-10">
            {/* Aura/Glow effect behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-200/40 via-purple-100/30 to-pink-100/40 rounded-full blur-[80px] -z-10" />

            <div className="relative w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/img_3d/tecnico_con_lavadora.png"
                  alt="Técnico profesional reparando electrodoméstico"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
