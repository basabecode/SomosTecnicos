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
import { SuppressHydrationWarning } from '@/components/no-ssr'
import { Metadata } from 'next'
import { SPECIALTIES_CONFIG, SPECIALIST_BRANDS } from '@/lib/config/specialties'

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
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'SomosTécnicos',
            image: 'https://somostecnicos.com/img-3d/somos_tecnicos.png',
            '@id': 'https://somostecnicos.com',
            url: 'https://somostecnicos.com',
            telephone: '+573000000000',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Calle False 123',
              addressLocality: 'Bogotá',
              postalCode: '110111',
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
          }),
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
      </main>
      <Footer />

      {/* Asistente Virtual IA */}
      <AiChat />

      {/* Optimizaciones Mobile - botones sticky y widget chat */}
      <MobileOptimizations />
    </SuppressHydrationWarning>
  )
}
