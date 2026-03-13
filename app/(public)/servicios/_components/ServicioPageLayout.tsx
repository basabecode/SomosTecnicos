import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, MessageCircle, MapPin } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ServiceProcess from '@/components/service-process'
import PageBreadcrumb from '@/components/page-breadcrumb'
import type { ServicioSEOData } from '@/lib/seo/servicios-data'

interface ServicioPageLayoutProps {
  data: ServicioSEOData
  jsonLd: object[]
}

const getEquipoIdFromSlug = (slug: string) => {
  if (slug.includes('nevera')) return 'nevera'
  if (slug.includes('lavadora')) return 'lavadora'
  if (slug.includes('secadora')) return 'secadora'
  if (slug.includes('estufa') || slug.includes('horno')) return 'estufa'
  if (slug.includes('calentador')) return 'calentador'
  if (slug.includes('televisor') || slug.includes('tv')) return 'televisor'
  if (slug.includes('electricista')) return 'electricidad_general'
  if (slug.includes('computador') || slug.includes('redes')) return 'sistemas_general'
  if (slug.includes('camara') || slug.includes('alarma') || slug.includes('seguridad')) return 'seguridad_general'
  return ''
}

export default function ServicioPageLayout({ data, jsonLd }: ServicioPageLayoutProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="pt-16 md:pt-20">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative bg-[#1a0a0f] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Texto */}
              <div>
                {/* Breadcrumb */}
                <PageBreadcrumb
                  variant="dark"
                  showHomeIcon
                  className="mb-6"
                  items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Servicios', href: '/servicios' },
                    { label: data.h1 },
                  ]}
                />

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {data.h1}
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {data.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    href={`/?equipo=${getEquipoIdFromSlug(data.slug)}#electrodomesticos`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold px-8 py-4 rounded-lg transition-colors min-h-14"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Agendar servicio
                  </Link>
                  <a
                    href="https://wa.me/573003094854?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-lg transition-colors min-h-14"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Solicitud rápida
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Técnicos certificados
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Garantía incluida
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Servicio a domicilio
                  </span>
                </div>
              </div>

              {/* Imagen con destello de luz */}
              <div className="relative aspect-square max-w-md mx-auto lg:max-w-none w-full">
                {/* Destello central blanco */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-white rounded-full blur-[80px] lg:blur-[120px] opacity-30 pointer-events-none z-0"></div>

                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt}
                  fill
                  className="object-contain relative z-10"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Problemas que reparamos ───────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-3 text-center">
              Problemas que Reparamos
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
              Diagnóstico preciso y solución el mismo día en la mayoría de los casos.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.problems.map((problem) => (
                <div
                  key={problem}
                  className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4"
                >
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{problem}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Marcas que atendemos ──────────────────────────────── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-3 text-center">
              Marcas que Atendemos
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
              Trabajamos con todas las marcas. Repuestos originales y compatibles garantizados.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {data.brands.map((brand) => (
                <span
                  key={brand}
                  className="bg-white border border-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full text-sm shadow-sm"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cómo funciona ─────────────────────────────────────── */}
        <ServiceProcess />

        {/* ── Zonas de cobertura ────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-3 text-center">
              Cobertura en Cali y Alrededores
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
              Llegamos a su hogar en Cali y los municipios del Valle del Cauca.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {data.zones.map((zone) => (
                <span
                  key={zone}
                  className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-3 text-center">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Las dudas más comunes sobre nuestro servicio.
            </p>
            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-semibold text-[#2C3E50] list-none">
                    <span>{faq.q}</span>
                    <span className="text-primary group-open:rotate-45 transition-transform shrink-0 text-xl leading-none">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────────── */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Listo para Resolver el Problema?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Solicite su servicio en línea o llámenos. Atendemos de lunes a sábado de 8am a 6pm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href={`/?equipo=${getEquipoIdFromSlug(data.slug)}#electrodomesticos`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-colors min-h-14"
              >
                <MessageCircle className="w-5 h-5" />
                Agendar servicio
              </Link>
              <a
                href="https://wa.me/573003094854?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-4 rounded-lg transition-colors min-h-14"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Solicitud rápida
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
