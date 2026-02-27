import { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, Clock, MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Contacto | SomosTécnicos – Servicio Técnico en Cali',
  description: 'Contáctanos para servicio técnico a domicilio en Cali. Llama al +57 300 3094854 o escríbenos por WhatsApp. Atención lunes a sábado de 8am a 6pm.',
  keywords: [
    'contacto somostecnicos',
    'teléfono servicio técnico cali',
    'whatsapp técnico cali',
    'horario servicio técnico cali',
    'contactar técnico electrodomésticos cali',
  ],
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: 'Contacto | SomosTécnicos – Servicio Técnico a Domicilio en Cali',
    description: 'Llámanos al +57 300 3094854 o solicita tu servicio en línea. Técnicos certificados en Cali y alrededores. Lunes a sábado de 8am a 6pm.',
    url: 'https://somostecnicos.com/contacto',
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://somostecnicos.com',
  name: 'SomosTécnicos',
  telephone: '+573003094854',
  email: 'soporte@somostecnicos.com',
  url: 'https://somostecnicos.com/contacto',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle 3 # 72-45',
    addressLocality: 'Cali',
    postalCode: '760006',
    addressCountry: 'CO',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Cali' },
    { '@type': 'City', name: 'Yumbo' },
    { '@type': 'City', name: 'Jamundí' },
    { '@type': 'City', name: 'Palmira' },
    { '@type': 'City', name: 'Candelaria' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+573003094854',
    email: 'soporte@somostecnicos.com',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://somostecnicos.com' },
    { '@type': 'ListItem', position: 2, name: 'Contacto', item: 'https://somostecnicos.com/contacto' },
  ],
}

const zones = ['Cali', 'Yumbo', 'Jamundí', 'Palmira', 'Candelaria', 'Norte de Cali', 'Sur de Cali', 'Oeste de Cali']

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([contactSchema, breadcrumbSchema]) }}
      />

      <Header />

      <main>
        {/* Hero */}
        <section className="bg-[#1a0a0f] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-200">Contacto</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Contacta a SomosTécnicos en Cali
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Estamos disponibles de lunes a sábado de 8am a 6pm para atender tu solicitud de servicio técnico a domicilio.
            </p>
          </div>
        </section>

        {/* Tarjetas de contacto */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

              {/* Teléfono */}
              <a
                href="tel:+573003094854"
                className="group bg-gray-50 border border-gray-100 hover:border-[#A50034]/30 hover:bg-[#A50034]/5 rounded-2xl p-6 text-center transition-all"
              >
                <div className="w-12 h-12 bg-[#A50034]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A50034]/20 transition-colors">
                  <Phone className="w-6 h-6 text-[#A50034]" />
                </div>
                <h2 className="font-bold text-[#2C3E50] mb-1">Teléfono</h2>
                <p className="text-[#A50034] font-semibold">+57 300 3094854</p>
                <p className="text-gray-500 text-sm mt-1">Toca para llamar</p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/573003094854?text=Hola%2C%20necesito%20servicio%20t%C3%A9cnico"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-50 border border-gray-100 hover:border-green-300 hover:bg-green-50 rounded-2xl p-6 text-center transition-all"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="font-bold text-[#2C3E50] mb-1">WhatsApp</h2>
                <p className="text-green-600 font-semibold">+57 300 3094854</p>
                <p className="text-gray-500 text-sm mt-1">Escríbenos ahora</p>
              </a>

              {/* Email */}
              <a
                href="mailto:soporte@somostecnicos.com"
                className="group bg-gray-50 border border-gray-100 hover:border-blue-300 hover:bg-blue-50 rounded-2xl p-6 text-center transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="font-bold text-[#2C3E50] mb-1">Email</h2>
                <p className="text-blue-600 font-semibold text-sm">soporte@somostecnicos.com</p>
                <p className="text-gray-500 text-sm mt-1">Respuesta en 24h</p>
              </a>

              {/* Horario */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="font-bold text-[#2C3E50] mb-1">Horario</h2>
                <p className="text-gray-700 font-semibold">Lun – Sáb</p>
                <p className="text-amber-600 font-semibold">8:00 am – 6:00 pm</p>
              </div>
            </div>

            {/* CTA principal */}
            <div className="bg-[#1a0a0f] text-white rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                ¿Prefieres solicitar el servicio en línea?
              </h2>
              <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                Completa el formulario con los datos de tu electrodoméstico y te asignamos el técnico disponible más cercano.
              </p>
              <Link
                href="/#formulario"
                className="inline-flex items-center justify-center gap-2 bg-[#A50034] hover:bg-[#c0003d] text-white font-bold px-10 py-4 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Solicitar Servicio Ahora
              </Link>
            </div>
          </div>
        </section>

        {/* Zonas de cobertura */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-4">
              Zonas de Cobertura en Cali y Alrededores
            </h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
              Llegamos a su hogar en Cali y los municipios vecinos del Valle del Cauca.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {zones.map((zone) => (
                <span
                  key={zone}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#A50034]" />
                  {zone}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-6">
              ¿Está en otra zona? Llámenos al{' '}
              <a href="tel:+573003094854" className="text-[#A50034] font-semibold hover:underline">
                +57 300 3094854
              </a>{' '}
              y verificamos cobertura.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
