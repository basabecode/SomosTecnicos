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

  const WA_URL =
    'https://wa.me/573003094854?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios'

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 bg-[#1a1a2e]"
    >
      {/* ═══════════════════════════════════════════════════════ */}
      {/* DESKTOP: Imagen de fondo optimizada (No pixelada)       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:block absolute inset-0 z-0 bg-[#4a0418]">
        <div className="relative h-full w-full mx-auto">
          <Image
            src="/hero/casa-moderna2.avif"
            alt="Smart Home Background"
            fill
            className="object-contain object-right"
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          {/* Degradado para fundir suavemente la imagen con el fondo sólido a la izquierda */}
          <div className="absolute inset-y-0 left-0 w-[60%] bg-linear-to-r from-[#4a0418] via-[#4a0418] to-transparent"></div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MOBILE/TABLET: Imagen completa + overlay oscuro        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden absolute inset-0 z-0">
        <Image
          src="/hero/hero_mobil.avif"
          alt="Técnico y cliente - SomosTécnicos"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        {/* Overlay oscuro para Móvil */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/15 to-black/60"></div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CONTENIDO PRINCIPAL                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Columna de Contenido */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            {/* Título Principal */}
            <div
              className="space-y-4 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <h1 className="text-[clamp(1.75rem,6vw,3rem)] lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
                Reparaciones Inteligentes para tu Hogar
                <span className="block mt-2 pb-2 animate-gradient-x text-transparent bg-clip-text bg-linear-to-r from-[#ff6b6b] via-[#ff4d4d] to-[#ff8a8a] text-shadow-none">
                  ¡Pídelo ya!
                </span>
              </h1>

              {/* Descripción */}
              <p
                className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in-up text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
                style={{ animationDelay: '200ms' }}
              >
                Plataforma digital para solicitar servicio técnico
                especializados, si eres técnico capacitado puedes ofrecer tus
                servicios en la plataforma.
                <span className="block mt-2 font-semibold text-white">
                  Garantía, seguridad y conocimiento en un solo lugar.
                </span>
              </p>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 text-sm animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-lg border border-white/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-11">
                <div className="p-1 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <span className="font-semibold text-white">
                  Mejor Calificación
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-lg border border-white/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-11">
                <div className="p-1 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span className="font-semibold text-white">Garantía</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2.5 rounded-lg border border-white/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-h-11">
                <div className="p-1 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4 text-blue-300" />
                </div>
                <span className="font-semibold text-white">
                  Atención lun/sab
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <Button
                onClick={scrollToForm}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 active:scale-95 active:shadow-none text-white text-base sm:text-lg px-8 py-4 lg:py-3.5 rounded-xl shadow-[0_0_20px_rgba(165,0,52,0.6)] lg:shadow-lg hover:shadow-2xl transition-all duration-150 hover:-translate-y-1 font-bold group relative overflow-hidden min-h-14 lg:min-h-0 h-auto"
              >
                <span className="relative z-10">Agendar servicio</span>
                <div className="absolute inset-0 bg-linear-to-r from-[#c9003f] to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 active:bg-white/30 active:scale-95 text-white border-2 border-white/30 hover:border-white/60 text-base sm:text-lg px-8 py-4 lg:py-3.5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-150 hover:-translate-y-1 font-semibold min-h-14 lg:min-h-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Solicitud rápida
              </a>
            </div>
          </div>

          {/* Columna derecha vacía para equilibrar el grid si es necesario, o eliminada si el diseño es centrado */}
          {/* Mantenemos el grid de 2 columnas para que el texto ocupe la mitad izquierda y deje ver la imagen a la derecha */}
          <div className="hidden lg:block h-162.5 w-full"></div>
        </div>
      </div>
    </section>
  )
}
