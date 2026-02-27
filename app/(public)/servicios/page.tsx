import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Phone, MessageCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { SERVICIOS_LIST } from '@/lib/seo/servicios-data'

export const metadata: Metadata = {
  title: 'Servicios Técnicos en Cali | SomosTécnicos',
  description: 'Servicios técnicos a domicilio en Cali: reparación de neveras, lavadoras, secadoras, estufas, calentadores, televisores, electricidad, computadores y seguridad electrónica.',
  keywords: [
    'servicios técnicos cali',
    'reparación electrodomésticos cali',
    'técnico domicilio cali',
    'servicio técnico cali',
    'electricista cali',
    'cámaras seguridad cali',
  ],
  alternates: { canonical: '/servicios' },
  openGraph: {
    title: 'Servicios Técnicos a Domicilio en Cali | SomosTécnicos',
    description: 'Reparación de electrodomésticos, electricidad, computación y seguridad electrónica en Cali con técnicos certificados y garantía incluida.',
    url: 'https://somostecnicos.com/servicios',
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Servicios Técnicos en Cali',
  description: 'Lista de servicios técnicos a domicilio disponibles en Cali, Colombia.',
  url: 'https://somostecnicos.com/servicios',
  itemListElement: SERVICIOS_LIST.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.h1,
    url: `https://somostecnicos.com${s.canonicalPath}`,
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://somostecnicos.com' },
    { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://somostecnicos.com/servicios' },
  ],
}

export default function ServiciosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListSchema, breadcrumbSchema]) }}
      />

      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="bg-[#1a0a0f] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-200">Servicios</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Servicios Técnicos a Domicilio en Cali
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Técnicos certificados para reparación de electrodomésticos, electricidad, computadores y seguridad electrónica. Atendemos en Cali y alrededores con garantía incluida.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/#formulario"
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
          </div>
        </section>

        {/* Grid de servicios */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-10 text-center">
              Nuestros Servicios en Cali
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICIOS_LIST.map((servicio) => (
                <Link
                  key={servicio.slug}
                  href={servicio.canonicalPath}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A50034]/30 transition-all overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={servicio.heroImage}
                      alt={servicio.heroImageAlt}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#2C3E50] text-lg mb-2 group-hover:text-[#A50034] transition-colors">
                      {servicio.h1}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {servicio.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[#A50034] font-semibold text-sm mt-4">
                      Ver servicio <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#A50034] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿No encuentras tu servicio? Llámanos
            </h2>
            <p className="text-white/80 mb-8">
              Atendemos todo tipo de reparaciones técnicas a domicilio en Cali. Lunes a sábado de 8am a 6pm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/#formulario"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#A50034] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Solicitar Servicio
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
