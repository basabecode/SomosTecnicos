'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Star, Shield, Clock } from 'lucide-react'

/**
 * Hero Section — Foto realista de fondo + contenido premium
 * Mobile/Tablet : portrait background + gradiente descendente
 * Desktop       : landscape background object-cover + gradiente izquierdo fuerte
 */
export default function HeroSection() {
  const scrollToForm = () => {
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
  }

  const WA_URL =
    'https://wa.me/573003094854?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios'

  return (
    <section
      id="hero"
      className="relative h-[88vh] min-h-[38rem] max-h-screen flex items-center overflow-hidden pt-16 bg-black isolate"
    >
      {/* ════════════════════════════════════════════════════════
          DESKTOP: foto realista landscape — contenida sin desborde
          ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
        <Image
          src="/hero/img-realista-hero-desktop-2.png"
          alt="Técnico profesional y cliente en hogar moderno - SomosTécnicos"
          fill
          className="object-cover object-[55%_38%]"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Gradiente izquierdo suave — deja respirar la foto */}
        <div className="absolute inset-0 bg-linear-to-r from-black/25 via-black/15 to-transparent" />
        {/* Vignette sutil top/bottom */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/15 to-black/15" />
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE/TABLET: foto portrait — object-top para ver personas
          ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero/hero-movil-realista.png"
          alt="Técnico y cliente - SomosTécnicos"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Overlay equilibrado — foto visible, texto legible */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/15 to-black/60" />
      </div>

      {/* ════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
          ════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-7">

          {/* Título + Descripción — drop-shadow sigue el contorno de las letras, sin caja visible */}
          <div
            className="space-y-4 animate-fade-in-up"
            style={{
              animationDelay: '100ms',
              filter: 'drop-shadow(0 0 18px rgba(0,0,0,0.65)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
            }}
          >
            <h1 className="text-[clamp(1.75rem,6vw,3rem)] lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] tracking-tight text-white">
              Reparaciones Inteligentes para tu Hogar
              <span className="block mt-2 pb-2 animate-gradient-x text-transparent bg-clip-text bg-linear-to-r from-[#ff6b6b] via-[#ff4d4d] to-[#ff8a8a]">
                ¡Pídelo ya!
              </span>
            </h1>

            <p
              className="text-base sm:text-lg lg:text-base xl:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium text-white/95"
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
            className="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3 text-sm animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            {[
              { icon: Star,   iconClass: 'text-yellow-400 fill-yellow-400', label: 'Mejor Calificación' },
              { icon: Shield, iconClass: 'text-green-400',                  label: 'Garantía'           },
              { icon: Clock,  iconClass: 'text-blue-300',                   label: 'Lun – Sáb'          },
            ].map(({ icon: Icon, iconClass, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-2.5 lg:px-4 lg:py-2.5 rounded-xl border border-white/20 hover:-translate-y-0.5 transition-transform duration-200 min-h-10"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
              >
                <Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Botones de Acción — altura consistente en ambos */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-0 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <Button
              onClick={scrollToForm}
              className="w-full sm:w-auto h-13 bg-primary hover:bg-primary/90 active:scale-95 text-white text-base font-bold px-8 rounded-xl shadow-[0_0_22px_rgba(165,0,52,0.55)] hover:shadow-[0_0_32px_rgba(165,0,52,0.75)] transition-all duration-150 hover:-translate-y-0.5 group relative overflow-hidden"
            >
              <span className="relative z-10">Agendar servicio</span>
              <div className="absolute inset-0 bg-linear-to-r from-[#c9003f] to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-13 bg-white/10 backdrop-blur-[10px] hover:bg-white/18 active:scale-95 text-white border border-white/30 hover:border-white/55 text-base font-semibold px-8 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Solicitud rápida
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
