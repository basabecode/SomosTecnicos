import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MessageCircle } from 'lucide-react'
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
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/#formulario"
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
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden"
                >
                  <div className="relative h-48 bg-white overflow-hidden">
                    <Image
                      src={servicio.heroImage}
                      alt={servicio.heroImageAlt}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#2C3E50] text-lg mb-2 group-hover:text-primary transition-colors">
                      {servicio.h1}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {servicio.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm mt-4">
                      Ver servicio <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿No encuentras tu servicio? Llámanos
            </h2>
            <p className="text-white/80 mb-8">
              Atendemos todo tipo de reparaciones técnicas a domicilio en Cali. Lunes a sábado de 8am a 6pm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                href="/#formulario"
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
