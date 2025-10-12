'use client'

import { Button } from '@/components/ui/button'

/**
 * Hero Section Optimizado - Mejoras UX/UI 2025
 * - Headlines convincentes con diferenciadores
 * - Trust indicators y badges de confianza
 * - CTAs jerárquicos (principal + secundario)
 * - Badge de respuesta rápida
 * - Modelo Uber-técnico destacado
 */
export default function HeroSection() {
  const scrollToForm = () => {
    const element = document.getElementById('formulario')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openAIChat = () => {
    // Disparar evento personalizado para abrir el chat IA con contexto del hero
    window.dispatchEvent(
      new CustomEvent('openAIChat', {
        detail: { fromHero: true },
      })
    )
  }

  const callNow = () => {
    window.location.href = 'tel:+573001234567'
  }

  return (
    <section
      id="hero"
      className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] via-white to-[#E3F2FD] pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge de respuesta rápida */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-800 text-sm font-medium mb-6 animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Respuesta en menos de 15 minutos
          </div>

          {/* Headline mejorado */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2C3E50] mb-4 leading-tight">
            Solicitud Inteligente de
            <span className="block text-[#A50034]">
              Reparaciones de Electrodomésticos
            </span>
          </h1>

          {/* Subheadline diferenciador */}
          <p className="text-lg sm:text-xl text-[#7F8C8D] mb-8 max-w-3xl mx-auto leading-relaxed">
            Tecnología que conecta clientes con técnicos en tiempo real, en toda
            Colombia.
            <span className="block mt-2 font-semibold text-[#2C3E50]">
              Como Uber, pero para reparar tus electrodomésticos
            </span>
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm">
            <div className="flex items-center text-[#2C3E50]">
              <span className="text-yellow-500 mr-1">⭐⭐⭐⭐⭐</span>
              <span className="font-semibold">4.8/5 en 500+ reparaciones</span>
            </div>
            <div className="flex items-center text-[#2C3E50]">
              <span className="text-green-500 mr-1">✓</span>
              <span className="font-semibold">Garantía de 3 meses</span>
            </div>
            <div className="flex items-center text-[#2C3E50]">
              <span className="text-blue-500 mr-1">🔧</span>
              <span className="font-semibold">Técnicos certificados 24/7</span>
            </div>
          </div>

          {/* CTAs Jerárquicos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {/* CTA Principal */}
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-[#A50034] hover:bg-[#E74C3C] text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 min-w-[250px]"
            >
              Solicitar Servicio Ahora
            </Button>

            {/* CTA Secundario - Asistente IA TecnoCity */}
            <Button
              onClick={openAIChat}
              variant="outline"
              size="lg"
              className="bg-[#A50034] hover:bg-[#E74C3C] text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 min-w-[250px]"
            >
              Asistente IA TecnoCity
            </Button>
          </div>

          {/* CTA Terciario - Llamada directa */}
          <div className="flex justify-center">
            <Button
              onClick={callNow}
              variant="ghost"
              className="text-[#2C3E50] hover:text-[#A50034] text-base px-6 py-3 hover:bg-transparent"
            >
              <span className="mr-2">📞</span>O llama directamente: +57 300 123
              4567
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative element mejorado */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
