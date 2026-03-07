import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronRight, Clock } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { BARRIOS_LIST } from '@/lib/seo/barrios-data'

const BASE_URL = 'https://somostecnicos.com'

export const metadata: Metadata = {
  title: 'Servicio Técnico por Barrios en Cali | SomosTécnicos',
  description:
    'Servicio técnico a domicilio en todos los barrios de Cali: Pance, Ciudad Jardín, Tequendama, Chipichape, Norte y Sur. Técnicos certificados. Diagnóstico $50.000.',
  keywords: [
    'servicio técnico barrios cali',
    'técnico domicilio pance cali',
    'técnico domicilio ciudad jardín',
    'reparación electrodomésticos norte cali',
    'servicio técnico chipichape cali',
  ],
  alternates: { canonical: '/barrios' },
  openGraph: {
    title: 'Servicio Técnico por Barrios en Cali | SomosTécnicos',
    description: 'Técnicos certificados a domicilio en todos los barrios de Cali.',
    url: `${BASE_URL}/barrios`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

export default function BarriosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F9FA]">
        {/* Hero */}
        <section className="bg-white border-b border-[#E8EAED]">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-700">Barrios</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Cobertura por barrios en Cali
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Técnicos a domicilio en toda la ciudad. Selecciona tu barrio para ver
              tiempos de respuesta y los servicios más solicitados en tu zona.
            </p>
          </div>
        </section>

        {/* Barrios grid */}
        <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BARRIOS_LIST.map((barrio) => (
              <Link
                key={barrio.slug}
                href={`/barrios/${barrio.slug}`}
                className="group bg-white rounded-xl border border-[#E8EAED] p-5
                           hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {barrio.name}
                    </h2>
                    <p className="text-xs text-slate-400 truncate">{barrio.zone}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {barrio.intro.split('.')[0]}.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{barrio.responseTime}</span>
                  </div>
                  <span className="text-xs text-slate-400">Estrato {barrio.stratum}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-14">
          <div className="bg-primary rounded-2xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">¿No ves tu barrio en la lista?</h2>
            <p className="text-red-200 text-sm mb-6">
              Cubrimos toda la ciudad de Cali y municipios cercanos. Contáctanos y confirmamos cobertura de inmediato.
            </p>
            <a
              href="https://wa.me/573003094854?text=Hola,%20quiero%20saber%20si%20tienen%20cobertura%20en%20mi%20barrio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold
                         px-6 py-3 rounded-full text-sm hover:bg-red-50 transition-colors"
            >
              Consultar cobertura por WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
