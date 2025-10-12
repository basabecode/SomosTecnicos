'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Wrench, Settings, PenTool as Tool } from 'lucide-react'

/**
 * Tipos de Servicio Optimizados - UX/UI 2025
 * - Diferenciación visual por colores
 * - CTAs que llevan al formulario
 * - Badges con tiempos y garantías
 * - Hover mejorado con escalado
 */
export default function ServiceTypes() {
  const scrollToForm = () => {
    const element = document.getElementById('formulario')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const services = [
    {
      icon: Wrench,
      title: 'Reparación',
      description: 'Diagnóstico y reparación a domicilio',
      badge: 'solicitud 2 min',
      color: '#A50034', // Rojo principal del hero
      bgColor: 'bg-[#A50034]',
      bgLight: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-[#A50034]',
    },
    {
      icon: Settings,
      title: 'Instalación',
      description: 'Instalación profesional garantizada',
      badge: 'Pro',
      color: '#2C3E50', // Azul oscuro del hero
      bgColor: 'bg-[#2C3E50]',
      bgLight: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-[#2C3E50]',
    },
    {
      icon: Tool,
      title: 'Mantenimiento',
      description: 'Previene futuras averías',
      badge: 'Preventivo',
      color: '#27AE60', // Verde de confianza
      bgColor: 'bg-[#27AE60]',
      bgLight: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-[#27AE60]',
    },
  ]

  return (
    <section id="servicios" className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
            Nuestros Servicios
          </h2>
          <p className="text-base text-[#7F8C8D] max-w-xl mx-auto">
            Soluciones completas para todos tus electrodomésticos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className={`${service.borderColor} border-2 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer group ${service.bgLight}`}
                onClick={scrollToForm}
              >
                <CardContent className="p-4 text-center relative">
                  {/* Badge superior */}
                  <div
                    className={`absolute -top-1 -right-1 ${service.bgColor} text-white px-2 py-1 text-xs font-bold rounded-bl-lg`}
                  >
                    {service.badge}
                  </div>

                  {/* Icono con animación */}
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${service.bgColor} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Título */}
                  <h3
                    className={`text-lg font-bold mb-2 ${service.textColor} group-hover:text-[#2C3E50] transition-colors`}
                  >
                    {service.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-[#7F8C8D] text-sm leading-relaxed mb-3 group-hover:text-[#2C3E50] transition-colors">
                    {service.description}
                  </p>

                  {/* CTA Button */}
                  <div
                    className={`inline-flex items-center ${service.textColor} font-semibold text-xs group-hover:text-[#A50034] transition-colors`}
                  >
                    Solicitar ahora
                    <svg
                      className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
