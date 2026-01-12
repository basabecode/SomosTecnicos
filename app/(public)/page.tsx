import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import BrandsSlider from '@/components/brands-slider'
import ServiceTypes from '@/components/service-types'
import ServiceForm from '@/components/service-form'
import ServiceProcess from '@/components/service-process'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'
import MobileOptimizations from '@/components/mobile-optimizations'
import { SuppressHydrationWarning } from '@/components/no-ssr'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reparación de Electrodomésticos a Domicilio',
  description: 'Solicita servicio técnico para lavadoras, neveras, estufas y más. Seguimiento en tiempo real y garantía certificada.',
}

export default function HomePage() {
  return (
    <SuppressHydrationWarning className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        {/* Slider de marcas integrado */}
        <BrandsSlider />
        <ServiceTypes />
        <ServiceForm />
        {/* Proceso de Servicio - Cómo funciona */}
        <ServiceProcess />
        {/* Sección Uber-Técnico */}
        <FAQ />
      </main>
      <Footer />


      {/* Optimizaciones Mobile - botones sticky y widget chat */}
      <MobileOptimizations />
    </SuppressHydrationWarning>
  )
}
