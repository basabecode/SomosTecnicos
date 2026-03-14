'use client'

/**
 * Botones CTA del Hero — único fragmento que necesita 'use client'.
 * Separado del HeroSection para que el resto (imágenes, texto) sea
 * Server Component y Next.js pueda generar el preload correcto de LCP
 * con la URL real de /_next/image en el HTML inicial.
 */

const WA_URL =
  'https://wa.me/573003094854?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios'

export default function HeroCTAButtons() {
  const scrollToForm = () => {
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-0 animate-fade-in-up"
      style={{ animationDelay: '400ms' }}
    >
      <button
        onClick={scrollToForm}
        className="w-full sm:w-auto h-13 bg-primary hover:bg-primary/90 active:scale-95 text-white text-base font-bold px-8 rounded-xl shadow-[0_0_22px_rgba(165,0,52,0.55)] hover:shadow-[0_0_32px_rgba(165,0,52,0.75)] transition-all duration-150 hover:-translate-y-0.5 group relative overflow-hidden"
      >
        <span className="relative z-10">Agendar servicio</span>
        <div className="absolute inset-0 bg-linear-to-r from-[#c9003f] to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-13 bg-white/10 backdrop-blur-[10px] hover:bg-white/18 active:scale-95 text-white border border-white/30 hover:border-white/55 text-base font-semibold px-8 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Solicitud rápida
      </a>
    </div>
  )
}
