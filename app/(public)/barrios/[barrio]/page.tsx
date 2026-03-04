import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, ChevronRight, CheckCircle, Phone, Wrench, Star } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { BARRIOS_DATA, BARRIOS_LIST } from '@/lib/seo/barrios-data'
import { SERVICIOS_LIST } from '@/lib/seo/servicios-data'

const BASE_URL = 'https://somostecnicos.com'

interface Props {
  params: Promise<{ barrio: string }>
}

export function generateStaticParams() {
  return Object.keys(BARRIOS_DATA).map((barrio) => ({ barrio }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { barrio: barrioSlug } = await params
  const barrio = BARRIOS_DATA[barrioSlug]
  if (!barrio) return {}

  return {
    title: barrio.metaTitle,
    description: barrio.metaDescription,
    alternates: { canonical: `/barrios/${barrio.slug}` },
    openGraph: {
      title: barrio.metaTitle,
      description: barrio.metaDescription,
      url: `${BASE_URL}/barrios/${barrio.slug}`,
      type: 'website',
      locale: 'es_CO',
      siteName: 'SomosTécnicos',
    },
    robots: { index: true, follow: true },
  }
}

export default async function BarrioPage({ params }: Props) {
  const { barrio: barrioSlug } = await params
  const barrio = BARRIOS_DATA[barrioSlug]
  if (!barrio) notFound()

  // JSON-LD: LocalBusiness con área de servicio específica
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SomosTécnicos',
    '@id': BASE_URL,
    url: `${BASE_URL}/barrios/${barrio.slug}`,
    telephone: '+573003094854',
    description: barrio.metaDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 3 # 72-45',
      addressLocality: 'Cali',
      addressRegion: 'Valle del Cauca',
      postalCode: '760006',
      addressCountry: 'CO',
    },
    areaServed: [
      { '@type': 'City', name: 'Cali' },
      ...barrio.zones.map((z) => ({ '@type': 'Neighborhood', name: z })),
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '214',
      bestRating: '5',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '19:00',
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Barrios', item: `${BASE_URL}/barrios` },
      { '@type': 'ListItem', position: 3, name: barrio.name, item: `${BASE_URL}/barrios/${barrio.slug}` },
    ],
  }

  const otherBarrios = BARRIOS_LIST.filter((b) => b.slug !== barrio.slug)

  // Only show services that make sense (not cameras/computers for location pages)
  const relevantServices = SERVICIOS_LIST.filter((s) =>
    !['camaras-seguridad-alarmas-cali', 'tecnico-computadores-redes-cali'].includes(s.slug)
  ).slice(0, 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }} />
      <Header />

      <main className="min-h-screen bg-[#F8F9FA]">
        {/* Hero */}
        <section className="bg-[#A50034] text-white">
          <div className="max-w-5xl mx-auto px-4 pt-8 pb-12">
            {/* Breadcrumb */}
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-red-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/barrios" className="hover:text-white transition-colors">Barrios</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{barrio.name}</span>
            </nav>

            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-red-300 flex-shrink-0" />
              <span className="text-red-200 text-sm">{barrio.zone}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              {barrio.h1}
            </h1>
            <p className="text-red-100 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              {barrio.intro}
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Clock, label: barrio.responseTime, sublabel: 'Tiempo de respuesta' },
                { icon: Star, label: '4.8 / 5', sublabel: '214 reseñas Google' },
                { icon: CheckCircle, label: '30 días', sublabel: 'Garantía en reparaciones' },
              ].map(({ icon: Icon, label, sublabel }) => (
                <div key={sublabel} className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-3">
                  <Icon className="w-4 h-4 text-red-200 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm leading-none">{label}</p>
                    <p className="text-red-300 text-xs mt-0.5">{sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contexto local — contenido único por barrio */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Lo que más reparan los técnicos en {barrio.name}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {barrio.localContext}
              </p>
              <ul className="space-y-2">
                {barrio.topServices.map((srv) => (
                  <li key={srv} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {srv}
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios disponibles */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Servicios disponibles en {barrio.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relevantServices.map((servicio) => (
                  <Link
                    key={servicio.slug}
                    href={`/servicios/${servicio.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#E8EAED]
                               hover:border-[#A50034] hover:bg-red-50/30 transition-all group"
                  >
                    <Wrench className="w-4 h-4 text-slate-400 group-hover:text-[#A50034] flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#A50034] transition-colors">
                      {servicio.h1}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Zonas cubiertas */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Zonas y sectores que cubrimos
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Además de {barrio.name}, atendemos los siguientes sectores aledaños:
              </p>
              <div className="flex flex-wrap gap-2">
                {barrio.zones.map((zone) => (
                  <span
                    key={zone}
                    className="px-3 py-1 bg-slate-50 border border-[#E8EAED] rounded-full text-xs text-slate-700"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>

            {/* Tipo de vivienda / contexto */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Electrodomésticos más comunes en {barrio.name}
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Tipo de vivienda: </span>
                  {barrio.housingType}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Electrodomésticos frecuentes: </span>
                  {barrio.commonAppliances}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* CTA principal */}
            <div className="bg-[#A50034] rounded-xl p-5 text-white text-center sticky top-6">
              <Wrench className="w-6 h-6 text-red-200 mx-auto mb-3" />
              <p className="font-bold mb-1">¿Necesitas un técnico en {barrio.name}?</p>
              <p className="text-red-200 text-xs mb-4 leading-relaxed">
                Diagnóstico $50.000 · Se abona a la reparación si la apruebas en el mes.
              </p>
              <a
                href="https://wa.me/573003094854?text=Hola,%20necesito%20un%20técnico%20en%20mi%20domicilio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-[#A50034]
                           font-semibold px-4 py-3 rounded-full text-sm hover:bg-red-50 transition-colors mb-2"
              >
                Solicitar por WhatsApp
              </a>
              <a
                href="tel:+573003094854"
                className="flex items-center justify-center gap-2 border border-white/30
                           text-white font-semibold px-4 py-2.5 rounded-full text-sm
                           hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Llamar ahora
              </a>
            </div>

            {/* Otros barrios */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-5">
              <p className="text-sm font-semibold text-slate-700 mb-3">Otros barrios que cubrimos</p>
              <ul className="space-y-2">
                {otherBarrios.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/barrios/${b.slug}`}
                      className="flex items-center gap-2 text-sm text-[#A50034] hover:underline"
                    >
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
