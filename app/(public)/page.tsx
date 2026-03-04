import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import BrandsSlider from '@/components/brands-slider'
import ServiceTypes from '@/components/service-types'
import ServiceForm from '@/components/service-form'
import ServiceProcess from '@/components/service-process'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'
import MobileOptimizations from '@/components/mobile-optimizations'
import AiChat from '@/components/ai-chat'
import SitelinksNav from '@/components/sitelinks-nav'
import { SuppressHydrationWarning } from '@/components/no-ssr'
import { Metadata } from 'next'
import { SPECIALTIES_CONFIG, SPECIALIST_BRANDS } from '@/lib/config/specialties'
import { buildSiteNavigationSchema } from '@/lib/seo/schema-builders'
import { BLOG_POSTS } from '@/lib/seo/blog-data'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SomosTécnicos | Servicio Técnico a Domicilio en Cali y sus alrededores',
  description: 'Servicio técnico experto para electrodomésticos a domicilio. Reparación de neveras, lavadoras, secadoras y calentadores. Técnicos certificados, garantía y seguimiento en tiempo real.',
  keywords: [
    'servicio técnico',
    'reparación electrodomésticos',
    'mantenimiento neveras',
    'arreglo lavadoras',
    'técnico secadoras',
    'reparación calentadores',
    'instalación cámaras seguridad',
    'electricista domicilio',
    'cali',
    'somostecnicos',
    'técnicos certificados',
    'reparación a domicilio',
  ],
  openGraph: {
    title: 'SomosTécnicos | Servicio Técnico a Domicilio',
    description: 'Expertos en reparación de electrodomésticos con seguimiento en vivo. Confianza y rapidez en la puerta de tu hogar.',
    url: 'https://somostecnicos.com',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <SuppressHydrationWarning className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'SomosTécnicos',
              image: 'https://somostecnicos.com/img-3d/somos_tecnicos.png',
              '@id': 'https://somostecnicos.com',
              url: 'https://somostecnicos.com',
              telephone: '+573003094854',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Calle 3 # 72-45',
                addressLocality: 'Cali',
                postalCode: '760006',
                addressCountry: 'CO',
              },
              priceRange: '$$',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  opens: '08:00',
                  closes: '18:00',
                },
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '47',
                bestRating: '5',
                worstRating: '1',
              },
              sameAs: [
                'https://facebook.com/somostecnicos',
                'https://instagram.com/somostecnicos',
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Servicios de Reparación y Mantenimiento',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Reparación de Neveras y Nevecones',
                      description: 'Mantenimiento preventivo y correctivo para refrigeración doméstica.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Reparación de Lavadoras',
                      description: 'Servicio técnico para lavadoras carga frontal y superior.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Mantenimiento de Secadoras',
                      description: 'Reparación de secadoras a gas y eléctricas.',
                    },
                  },
                   {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Reparación de Calentadores',
                      description: 'Mantenimiento de calentadores de paso y acumulación.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Servicios de Electricidad',
                      description: 'Instalaciones eléctricas residenciales y comerciales.',
                    },
                  },
                   {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Seguridad Electrónica',
                      description: 'Instalación y mantenimiento de cámaras CCTV y alarmas.',
                    },
                  }
                ],
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: 'Servicio Técnico Profesional en su Hogar | SomosTécnicos',
              description: 'Expertos en soluciones técnicas integrales a domicilio para lavadoras, neveras, calentadores y más.',
              thumbnailUrl: 'https://somostecnicos.com/video/postal-video.png',
              uploadDate: '2026-02-23T08:00:00+00:00',
              contentUrl: 'https://somostecnicos.com/video/video_reparacion_ok.mp4',
              embedUrl: 'https://somostecnicos.com',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '¿Cuál es el costo del servicio técnico a domicilio?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'La visita de diagnóstico tiene un costo de $50.000 pesos. El precio de la reparación varía según la complejidad, los repuestos y la tecnología del equipo — no existe tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, esos $50.000 se abonan al total.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cuánto tiempo tarda la reparación?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Depende del problema. Reparaciones simples como cambio de piezas comunes se realizan el mismo día. Reparaciones complejas o que requieren repuestos especiales pueden tomar entre 2 y 3 días hábiles. Instalaciones de seguridad o redes pueden tomar 1 a 2 días según la complejidad.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué servicios técnicos ofrecen en Cali?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ofrecemos reparación de electrodomésticos (neveras, lavadoras, secadoras, estufas, hornos, calentadores, televisores), servicios de electricidad residencial y comercial (cableado, tableros, iluminación), soporte técnico en computadores y redes, e instalación de sistemas de seguridad electrónica (cámaras CCTV, alarmas, control de acceso).',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué marcas de electrodomésticos atienden?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Atendemos todas las marcas de electrodomésticos: LG, Samsung, Whirlpool, Mabe, Electrolux, Haceb, Challenger, Frigidaire, y más. En especialidades técnicas también trabajamos con Schneider y Legrand (electricidad), HP, Dell, Lenovo y Apple (computación), Hikvision y Dahua (seguridad).',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Tienen garantía en sus reparaciones?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sí, ofrecemos garantía en todos nuestros servicios: 30 días en reparaciones de electrodomésticos, 90 días en instalaciones eléctricas y de seguridad electrónica, y 60 días en servicios de computación y redes. Si el problema vuelve dentro del período de garantía, lo atendemos sin costo adicional.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cómo puedo pagar el servicio técnico?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Aceptamos pago en efectivo y transferencias bancarias. El pago se realiza al finalizar el servicio, una vez usted esté satisfecho con el trabajo realizado.',
                  },
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'SomosTécnicos',
              url: 'https://somostecnicos.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://somostecnicos.com/?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            },
            buildSiteNavigationSchema(),
          ]),
        }}
      />
      <Header />
      <main>
        <HeroSection />
        {/* Slider de marcas - Electrodomésticos */}
        <BrandsSlider className="bg-blue-50/30" />

        <ServiceTypes />

        {/* Sección: Electrodomésticos y Especialidades */}
        <div id="formulario">
          <ServiceForm config={SPECIALTIES_CONFIG.ELECTRODOMESTICOS} />
        </div>

        {/* Slider de marcas - Especialistas */}
        <BrandsSlider
          title="Marcas Especializadas"
          description="Soporte técnico certificado para las mejores marcas de tecnología"
          brands={SPECIALIST_BRANDS}
          className="bg-slate-50"
        />

        {/* Proceso de Servicio - Cómo funciona */}
        <ServiceProcess />
        <FAQ />

        {/* ── Blog preview ─────────────────────────────────────────── */}
        {(() => {
          const posts = Object.values(BLOG_POSTS).slice(0, 3)
          const CATEGORY_COLORS: Record<string, string> = {
            mantenimiento: 'bg-blue-50 text-blue-700',
            reparacion: 'bg-red-50 text-red-700',
            consejos: 'bg-green-50 text-green-700',
            guias: 'bg-purple-50 text-purple-700',
          }
          return (
            <section className="bg-white py-14 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between mb-8 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#A50034] mb-1">
                      Blog técnico
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      Consejos de nuestros técnicos
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#A50034] hover:underline flex-shrink-0"
                  >
                    Ver todos <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Grid vertical: 1 col mobile, 3 col desktop  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group rounded-xl border border-[#E8EAED] overflow-hidden bg-white
                                 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                    <div className="relative h-56 md:h-48 bg-white overflow-hidden border-b border-[#E8EAED]">
                        <Image
                          src={post.heroImage}
                          alt={post.heroImageAlt}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-600'}`}>
                            {post.categoryLabel}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />{post.readTime} min
                          </span>
                        </div>
                        <p className="text-sm md:text-[13px] font-semibold text-slate-900 leading-snug
                                      group-hover:text-[#A50034] transition-colors line-clamp-2">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="hidden md:block text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 text-center sm:hidden">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A50034] hover:underline"
                  >
                    Ver todos los artículos <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          )
        })()}

        <SitelinksNav />
      </main>
      <Footer />

      {/* Asistente Virtual IA */}
      <AiChat />

      {/* Optimizaciones Mobile - botones sticky y widget chat */}
      <MobileOptimizations />
    </SuppressHydrationWarning>
  )
}
