import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Phone, MessageCircle, MapPin, ChevronRight } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ServiceProcess from '@/components/service-process'
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
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-400 mb-6">
                  <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-200">{data.h1}</span>
                </nav>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  {data.h1}
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {data.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/?equipo=${getEquipoIdFromSlug(data.slug)}#electrodomesticos`}
                    className="inline-flex items-center justify-center gap-2 bg-[#A50034] hover:bg-[#c0003d] text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Solicitar Servicio
                  </Link>
                  <a
                    href="tel:+573003094854"
                    className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    +57 300 3094854
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
                  <CheckCircle className="w-5 h-5 text-[#A50034] shrink-0 mt-0.5" />
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
                    <span className="text-[#A50034] group-open:rotate-45 transition-transform shrink-0 text-xl leading-none">+</span>
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
        <section className="py-16 bg-[#A50034] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Listo para Resolver el Problema?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Solicite su servicio en línea o llámenos. Atendemos de lunes a sábado de 8am a 6pm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/?equipo=${getEquipoIdFromSlug(data.slug)}#electrodomesticos`}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#A50034] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Solicitar Servicio Ahora
              </Link>
              <a
                href="tel:+573003094854"
                className="inline-flex items-center justify-center gap-2 border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-4 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                +57 300 3094854
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
