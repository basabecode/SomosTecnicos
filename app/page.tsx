import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import BrandsSlider from '@/components/brands-slider'
import ServiceTypes from '@/components/service-types'
import ServiceForm from '@/components/service-form'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'
import AIChat from '@/components/ai-chat'
import MobileOptimizations from '@/components/mobile-optimizations'
import UberTechnicianSection from '@/components/uber-technician-section'
import { SuppressHydrationWarning } from '@/components/no-ssr'

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
        {/* Sección Uber-Técnico */}
        <UberTechnicianSection />
        <FAQ />
      </main>
      <Footer />

      {/* Chat IA flotante - disponible en toda la página */}
      <AIChat />

      {/* Optimizaciones Mobile - botones sticky y widget chat */}
      <MobileOptimizations />
    </SuppressHydrationWarning>
  )
}
