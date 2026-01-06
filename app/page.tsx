import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import BrandsSlider from '@/components/brands-slider'
import ServiceTypes from '@/components/service-types'
import ServiceForm from '@/components/service-form'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'
import MobileOptimizations from '@/components/mobile-optimizations'
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
        <FAQ />
      </main>
      <Footer />


      {/* Optimizaciones Mobile - botones sticky y widget chat */}
      <MobileOptimizations />
    </SuppressHydrationWarning>
  )
}
