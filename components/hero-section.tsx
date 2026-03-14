/**
 * Hero Section — Server Component
 *
 * Al ser Server Component, Next.js genera automáticamente el preload
 * con la URL correcta de /_next/image (no la del archivo crudo PNG) en el
 * HTML inicial, permitiendo que el browser descargue la imagen LCP lo antes
 * posible sin doble descarga.
 *
 * Solo los botones CTA se delegan a HeroCTAButtons ('use client') porque
 * necesitan el handler scrollToForm (acceso a document).
 */
import Image from 'next/image'
import { Star, Shield, Clock } from 'lucide-react'
import HeroCTAButtons from './hero-cta-buttons'

const TRUST_ITEMS = [
  { icon: Star,   iconClass: 'text-yellow-400 fill-yellow-400', label: 'Mejor Calificación' },
  { icon: Shield, iconClass: 'text-green-400',                  label: 'Garantía'           },
  { icon: Clock,  iconClass: 'text-blue-300',                   label: 'Lun – Sáb'          },
] as const

export default function HeroSection() {
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
        <div className="absolute inset-0 bg-linear-to-r from-black/25 via-black/15 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/15 to-black/15" />
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE/TABLET: foto portrait — object-top para ver personas
          ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero/hero_mobil.avif"
          alt="Técnico y cliente - SomosTécnicos"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/15 to-black/60" />
      </div>

      {/* ════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
          ════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-7">

          {/* Título + Descripción */}
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
            {TRUST_ITEMS.map(({ icon: Icon, iconClass, label }) => (
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

          {/* CTA Buttons — Client Component (necesita scrollToForm) */}
          <HeroCTAButtons />

        </div>
      </div>
    </section>
  )
}
