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

      <main className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="relative bg-[#1a0a0f] text-white py-16 overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0f] via-[#2d0a15] to-[#1a0a0f] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A50034]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10">
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
          </div>
        </section>

        {/* Tarjetas de contacto */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-3 text-center">
              Canales de Atención
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
              Elija el canal que prefiera. Atendemos de lunes a sábado de 8am a 6pm.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">

              {/* Teléfono */}
              <a
                href="tel:+573003094854"
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#A50034]/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-14 h-14 bg-[#A50034] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#c0003d] transition-colors">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Teléfono</p>
                <p className="text-base font-bold text-[#2C3E50] mb-1">+57 300 3094854</p>
                <p className="text-sm text-gray-500">Llamada directa</p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/573003094854?text=Hola%2C%20necesito%20servicio%20t%C3%A9cnico"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#25D366]/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#1ebe5d] transition-colors">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">WhatsApp</p>
                <p className="text-base font-bold text-[#2C3E50] mb-1">+57 300 3094854</p>
                <p className="text-sm text-gray-500">Respuesta inmediata</p>
              </a>

              {/* Email */}
              <a
                href="mailto:soporte@somostecnicos.com"
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-14 h-14 bg-[#2563EB] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#1d4ed8] transition-colors">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Correo</p>
                <p className="text-sm font-bold text-[#2C3E50] mb-1 break-all">soporte@somostecnicos.com</p>
                <p className="text-sm text-gray-500">Respuesta en 24 h</p>
              </a>

              {/* Horario */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-5">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Horario</p>
                <p className="text-base font-bold text-[#2C3E50] mb-1">Lun – Sáb</p>
                <p className="text-sm text-gray-500">8:00 am – 6:00 pm</p>
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
                  className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium shadow-sm hover:bg-[#A50034] hover:text-white hover:border-[#A50034] transition-colors duration-200 cursor-default min-h-[44px]"
                >
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
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
