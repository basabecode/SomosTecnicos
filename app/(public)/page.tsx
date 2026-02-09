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
  title: 'Reparación de Electrodomésticos y Servicio Técnico Especializado',
  description: 'Solicita servicio técnico para electrodomésticos, electricidad, computadores y seguridad electrónica. Garantía certificada.',
}

export default function HomePage() {
  return (
    <SuppressHydrationWarning className="min-h-screen">
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
