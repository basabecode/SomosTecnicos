import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle,
  Users,
  Star,
  Clock,
  Shield,
  Phone,
  MessageCircle,
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import PageBreadcrumb from '@/components/page-breadcrumb'

export const metadata: Metadata = {
  title: 'Sobre Nosotros | SomosTécnicos – Servicio Técnico en Cali',
  description:
    'Conoce a SomosTécnicos, empresa de servicio técnico a domicilio en Cali con más de 5 años de experiencia. Técnicos certificados, garantía y cobertura en toda la ciudad.',
  keywords: [
    'sobre nosotros somostecnicos',
    'empresa servicio técnico cali',
    'técnicos certificados cali',
    'reparación electrodomésticos cali',
    'quiénes somos somostecnicos',
  ],
  alternates: { canonical: '/sobre-nosotros' },
  openGraph: {
    title:
      'Sobre Nosotros | SomosTécnicos – Empresa de Servicio Técnico en Cali',
    description:
      'Más de 5 años llevando soluciones técnicas a los hogares de Cali. Técnicos certificados, garantía en todos los servicios y cobertura en toda la ciudad.',
    url: 'https://somostecnicos.com/sobre-nosotros',
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SomosTécnicos',
  url: 'https://somostecnicos.com',
  '@id': 'https://somostecnicos.com/#organization',
  logo: 'https://somostecnicos.com/img-3d/diseño-Logos-sinFondo.png',
  description:
    'Empresa de servicio técnico a domicilio en Cali, Colombia. Reparación de electrodomésticos, electricidad, computación y seguridad electrónica con más de 5 años de experiencia.',
  foundingDate: '2021',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle 3 # 72-45',
    addressLocality: 'Cali',
    postalCode: '760006',
    addressCountry: 'CO',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+573003094854',
    email: 'soporte@somostecnicos.com',
    contactType: 'customer service',
    areaServed: 'CO-VAC',
    availableLanguage: 'Spanish',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '08:00',
      closes: '18:00',
    },
  },
  sameAs: [
    'https://facebook.com/somostecnicos',
    'https://instagram.com/somostecnicos',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://somostecnicos.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Sobre Nosotros',
      item: 'https://somostecnicos.com/sobre-nosotros',
    },
  ],
}

const stats = [
  { label: 'Años de experiencia', value: '5+', icon: Clock },
  { label: 'Servicios completados', value: '2.000+', icon: CheckCircle },
  { label: 'Técnicos en la plataforma', value: '30+', icon: Users },
  { label: 'Calificación promedio', value: '4.8★', icon: Star },
]

const values = [
  {
    title: 'Transparencia',
    description:
      'Presupuesto claro antes de comenzar. Sin costos ocultos ni sorpresas al finalizar el servicio.',
  },
  {
    title: 'Garantía real',
    description:
      'Respaldamos cada reparación con garantía escrita: 30 días en electrodomésticos, 60 en computación y 90 en electricidad y seguridad.',
  },
  {
    title: 'Puntualidad',
    description:
      'Confirmamos la cita y llegamos en el horario acordado. Sabemos que su tiempo es valioso.',
  },
  {
    title: 'Técnicos certificados',
    description:
      'Todos nuestros técnicos pasan por verificación de identidad, evaluación técnica y formación continua.',
  },
  {
    title: 'Cobertura completa',
    description:
      'Llegamos a toda Cali y municipios del Valle del Cauca: Yumbo, Jamundí, Palmira y Candelaria.',
  },
  {
    title: 'Innovación digital',
    description:
      'Plataforma digital para solicitar, rastrear y calificar su servicio en tiempo real desde cualquier dispositivo.',
  },
]

export default function SobreNosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, breadcrumbSchema]),
        }}
      />

      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero - Split Design */}
        <section className="relative overflow-hidden flex flex-col lg:block">
          {/* Fondos absolutos solo para Desktop (LG y superiores) */}
          <div className="absolute inset-y-0 left-0 hidden lg:block w-1/2 bg-[#1a0a0f]">
            <div className="absolute inset-0 bg-linear-to-br from-[#1a0a0f] via-[#2d0a15] to-[#1a0a0f] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
          </div>
          {/* Fondo blanco a la derecha con el borde rojo separador exacto al 50% de la pantalla */}
          <div className="absolute inset-y-0 right-0 hidden lg:block w-1/2 bg-white border-l-2 border-primary" />

          {/* Contenedor centralizado y responsivo */}
          <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-8 relative z-10 w-full grow">
            <div className="grid lg:grid-cols-2">
              {/* Lado Contenido (Izquierda - Oscuro) */}
              <div className="py-16 px-4 sm:px-6 lg:px-0 lg:pr-12 text-white bg-[#1a0a0f] lg:bg-transparent relative shadow-none">
                {/* Degradados decorativos en mobile que imitan al de desktop */}
                <div className="absolute inset-0 bg-linear-to-br from-[#1a0a0f] via-[#2d0a15] to-[#1a0a0f] pointer-events-none lg:hidden" />

                <div className="relative z-10">
                  <PageBreadcrumb
                    variant="dark"
                    showHomeIcon
                    className="mb-6"
                    items={[
                      { label: 'Inicio', href: '/' },
                      { label: 'Sobre Nosotros' },
                    ]}
                  />
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    Llevamos soluciones técnicas a tu hogar en Cali
                  </h1>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    SomosTécnicos es una plataforma digital de servicios
                    técnicos a domicilio en Cali, Valle del Cauca. Conectamos
                    hogares y empresas con técnicos certificados en
                    electrodomésticos, electricidad, computación y seguridad
                    electrónica.
                  </p>
                </div>
              </div>

              {/* Lado Imagen (Derecha - Blanco centralizado) */}
              <div className="py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center bg-white lg:bg-transparent border-t-2 border-primary lg:border-t-0">
                <div className="relative w-full max-w-125 aspect-video flex items-center justify-center">
                  <Image
                    src="/img-3d/diseño-Logos-sinFondo.png"
                    alt="SomosTécnicos - Servicio técnico a domicilio en Cali"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quiénes somos */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-6">
              ¿Quiénes Somos?
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                SomosTécnicos nació en Cali en 2021 con una misión clara: hacer
                que el servicio técnico a domicilio sea confiable, transparente
                y accesible para todos los hogares del Valle del Cauca.
              </p>
              <p>
                Identificamos que el mayor problema de los hogares al necesitar
                un técnico no era encontrar uno, sino confiar en él. Los
                presupuestos inflados, los trabajos mal realizados y la falta de
                garantía eran quejas constantes. Creamos SomosTécnicos para
                resolverlo.
              </p>
              <p>
                Nuestra plataforma digital permite solicitar el servicio en
                línea, hacer seguimiento en tiempo real del estado de su
                reparación y calificar al técnico al finalizar. Toda la
                información queda registrada y respaldada por nuestra garantía
                escrita.
              </p>
              <p>
                Hoy contamos con más de 30 técnicos certificados cubriendo Cali,
                Yumbo, Jamundí, Palmira y Candelaria, y hemos completado más de
                2.000 servicios con una calificación promedio de 4.8 sobre 5.
              </p>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-[#2C3E50] mb-3">
                  Nuestra Misión
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Brindar servicios técnicos confiables, transparentes y de alta
                  calidad a los hogares y empresas de Cali y el Valle del Cauca,
                  conectando clientes con técnicos certificados a través de
                  tecnología innovadora.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-[#2C3E50] mb-3">
                  Nuestra Visión
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Ser la plataforma de servicios técnicos más confiable de
                  Colombia, expandiendo nuestra cobertura a las principales
                  ciudades del país y estableciendo el estándar de calidad en el
                  sector.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-10 text-center">
              Nuestros Valores
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(val => (
                <div
                  key={val.title}
                  className="bg-gray-50 hover:bg-white rounded-xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <h3 className="font-bold text-[#2C3E50] group-hover:text-primary transition-colors">
                      {val.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#2C3E50] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Necesitas un servicio técnico en Cali?
            </h2>
            <p className="text-white/80 mb-8">
              Solicita tu servicio en línea o llámanos. Atendemos de lunes a
              sábado de 8am a 6pm.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/#formulario"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold px-8 py-4 rounded-lg transition-colors"
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
