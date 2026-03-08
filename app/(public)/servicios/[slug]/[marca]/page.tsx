import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Phone, Wrench, AlertTriangle, Star, Clock } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import PageBreadcrumb from '@/components/page-breadcrumb'
import {
  SERVICE_MARCA_COMBOS,
  MARCAS_DATA,
  getComboKey,
  getMarcasForService,
  COMBOS_LIST,
} from '@/lib/seo/marcas-data'
import { SERVICIOS_DATA } from '@/lib/seo/servicios-data'
import { BLOG_POSTS } from '@/lib/seo/blog-data'

const BASE_URL = 'https://somostecnicos.com'

interface Props {
  params: Promise<{ slug: string; marca: string }>
}

export function generateStaticParams() {
  return COMBOS_LIST.map((combo) => ({
    slug: combo.serviceSlug,
    marca: combo.marcaSlug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, marca } = await params
  const combo = SERVICE_MARCA_COMBOS[getComboKey(slug, marca)]
  if (!combo) return {}

  return {
    title: combo.metaTitle,
    description: combo.metaDescription,
    alternates: { canonical: `/servicios/${slug}/${marca}` },
    openGraph: {
      title: combo.metaTitle,
      description: combo.metaDescription,
      url: `${BASE_URL}/servicios/${slug}/${marca}`,
      type: 'website',
      locale: 'es_CO',
      siteName: 'SomosTécnicos',
    },
    robots: { index: true, follow: true },
  }
}

export default async function ServicioMarcaPage({ params }: Props) {
  const { slug, marca: marcaSlug } = await params
  const comboKey = getComboKey(slug, marcaSlug)
  const combo = SERVICE_MARCA_COMBOS[comboKey]
  const marcaData = MARCAS_DATA[marcaSlug]
  const servicioData = SERVICIOS_DATA[slug]

  if (!combo || !marcaData || !servicioData) notFound()

  const relatedBlog = combo.relatedBlogSlug ? BLOG_POSTS[combo.relatedBlogSlug] : null
  const otherMarcas = getMarcasForService(slug).filter((m) => m !== marcaSlug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: combo.h1,
    description: combo.metaDescription,
    url: `${BASE_URL}/servicios/${slug}/${marcaSlug}`,
    brand: { '@type': 'Brand', name: marcaData.name },
    provider: {
      '@type': 'LocalBusiness',
      name: 'SomosTécnicos',
      '@id': BASE_URL,
      telephone: '+573003094854',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cali',
        addressRegion: 'Valle del Cauca',
        addressCountry: 'CO',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '214',
        bestRating: '5',
      },
    },
    areaServed: { '@type': 'City', name: 'Cali' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      description: 'Diagnóstico $50.000, abonables si apruebas la reparación dentro del mes.',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${BASE_URL}/servicios` },
      { '@type': 'ListItem', position: 3, name: servicioData.h1, item: `${BASE_URL}/servicios/${slug}` },
      { '@type': 'ListItem', position: 4, name: `${marcaData.name}`, item: `${BASE_URL}/servicios/${slug}/${marcaSlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }} />
      <Header />

      <main className="min-h-screen bg-[#F8F9FA]">
        {/* Hero */}
        <section className="bg-white border-b border-[#E8EAED]">
          <div className="max-w-5xl mx-auto px-4 pt-8 pb-10">
            {/* Breadcrumb */}
            <PageBreadcrumb
              variant="light"
              showHomeIcon
              className="mb-5"
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Servicios', href: '/servicios' },
                { label: servicioData.h1, href: `/servicios/${slug}` },
                { label: marcaData.name },
              ]}
            />

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-red-50 text-primary text-xs font-semibold rounded-full">
                {marcaData.name}
              </span>
              <span className="text-slate-400 text-xs">{marcaData.origin}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
              {combo.h1}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-6">
              {combo.intro}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Star, label: '4.8 / 5', sub: '214 reseñas' },
                { icon: Clock, label: 'Mismo día', sub: 'Diagnóstico' },
                { icon: CheckCircle, label: '30 días', sub: 'Garantía' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={sub} className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-[#E8EAED]">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-slate-900 font-semibold text-sm leading-none">{label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* Fallas frecuentes */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Fallas frecuentes en {combo.serviceName} {marcaData.name}
              </h2>
              <ul className="space-y-3">
                {combo.failures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nota técnica */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                Nota técnica
              </p>
              <p className="text-sm text-blue-900 leading-relaxed">{combo.repairNote}</p>
            </div>

            {/* Info de la marca */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Repuestos y cobertura — {marcaData.name}
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Disponibilidad de repuestos: </span>
                  <span className="text-slate-600">{marcaData.availability}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Rango de precio: </span>
                  <span className="text-slate-600">{marcaData.priceRange}</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900">{marcaData.warrantyNote}</p>
                </div>
              </div>
            </div>

            {/* Proceso */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Cómo funciona el servicio</h2>
              <ol className="space-y-4">
                {[
                  { step: '1', title: 'Diagnóstico a domicilio', desc: 'El técnico va a tu casa, evalúa el equipo y te entrega la cotización. Costo: $50.000.' },
                  { step: '2', title: 'Cotización sin compromiso', desc: 'Recibes el desglose completo: mano de obra y repuestos. Tú decides si procedes.' },
                  { step: '3', title: 'Reparación el mismo día', desc: 'Si tienes el repuesto disponible, la mayoría de reparaciones se completan en la misma visita.' },
                  { step: '4', title: '30 días de garantía', desc: 'La reparación queda garantizada. Si el mismo problema regresa, lo atendemos sin costo.' },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">{step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Artículo relacionado */}
            {relatedBlog && (
              <Link
                href={`/blog/${relatedBlog.slug}`}
                className="flex items-start gap-4 bg-white rounded-xl border border-[#E8EAED] p-5
                           hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Artículo relacionado</p>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {relatedBlog.title}
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* CTA */}
            <div className="bg-primary rounded-xl p-5 text-white text-center sticky top-6">
              <Wrench className="w-6 h-6 text-red-200 mx-auto mb-3" />
              <p className="font-bold mb-1">{combo.serviceName} {marcaData.name} en Cali</p>
              <p className="text-red-200 text-xs mb-4 leading-relaxed">
                Diagnóstico $50.000 · Abonables si apruebas en el mes · Garantía 30 días
              </p>
              <a
                href="https://wa.me/573003094854?text=Hola,%20necesito%20técnico%20para%20mi%20equipo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-primary
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

            {/* Servicio principal */}
            <div className="bg-white rounded-xl border border-[#E8EAED] p-5">
              <p className="text-xs text-slate-400 mb-2">Ver página del servicio</p>
              <Link
                href={`/servicios/${slug}`}
                className="text-sm font-semibold text-primary hover:underline block"
              >
                {servicioData.h1} →
              </Link>
            </div>

            {/* Otras marcas */}
            {otherMarcas.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E8EAED] p-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Otras marcas que reparamos
                </p>
                <ul className="space-y-2">
                  {otherMarcas.map((m) => {
                    const md = MARCAS_DATA[m]
                    return (
                      <li key={m}>
                        <Link
                          href={`/servicios/${slug}/${m}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {combo.serviceName} {md?.name} →
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
