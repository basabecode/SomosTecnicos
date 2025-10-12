'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Star, Shield, Zap, Users } from 'lucide-react'

/**
 * Sección Uber-Técnico - Modelo de Negocio
 * - Concepto "Como Uber, pero para técnicos"
 * - Disponibilidad en tiempo real
 * - Sistema de puntuaciones y garantías
 * - Indicadores de confianza y rapidez
 */

export default function UberTechnicianSection() {
  const [availableTechnicians, setAvailableTechnicians] = useState(12)
  const [activeOrders, setActiveOrders] = useState(8)

  useEffect(() => {
    // Simular números dinámicos de técnicos disponibles
    const interval = setInterval(() => {
      setAvailableTechnicians(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(8, Math.min(15, prev + change))
      })
      setActiveOrders(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(3, Math.min(12, prev + change))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: MapPin,
      title: 'Técnicos Cerca de Ti',
      description: 'Encuentra técnicos disponibles en tu zona en tiempo real',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Clock,
      title: 'Llegada en 30 min',
      description: 'Como Uber, pero para reparar tus electrodomésticos',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: Star,
      title: 'Sistema de Puntuación',
      description: 'Califica a tu técnico y ve reseñas de otros clientes',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      icon: Shield,
      title: 'Garantía 3 Meses',
      description: 'Todos los servicios incluyen garantía extendida',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ]

  const technicians = [
    { name: 'Carlos M.', rating: 4.9, specialty: 'Neveras', available: true },
    { name: 'Ana L.', rating: 4.8, specialty: 'Lavadoras', available: true },
    { name: 'Miguel R.', rating: 5.0, specialty: 'Estufas', available: false },
    { name: 'Sofia P.', rating: 4.7, specialty: 'General', available: true },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#F8F9FA] to-[#E3F2FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#A50034]/10 border border-[#A50034]/20 text-[#A50034] text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Tecnología que conecta
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Como Uber, pero para Técnicos
          </h2>
          <p className="text-lg text-[#7F8C8D] max-w-3xl mx-auto">
            Solicita, rastrea y califica a tu técnico. La forma más moderna y
            confiable de reparar tus electrodomésticos.
          </p>
        </div>

        {/* Stats en tiempo real */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#A50034] mb-1">
                {availableTechnicians}
              </div>
              <div className="text-sm text-[#7F8C8D]">Técnicos Disponibles</div>
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-2 animate-pulse"></div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#A50034] mb-1">
                {activeOrders}
              </div>
              <div className="text-sm text-[#7F8C8D]">Servicios Activos</div>
              <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-2 animate-pulse"></div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#A50034] mb-1">4.8★</div>
              <div className="text-sm text-[#7F8C8D]">
                Calificación Promedio
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#A50034] mb-1">
                15min
              </div>
              <div className="text-sm text-[#7F8C8D]">Tiempo Respuesta</div>
            </CardContent>
          </Card>
        </div>

        {/* Features principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${feature.bg}`}
                  >
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-[#2C3E50] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#7F8C8D] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Panel de técnicos disponibles */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C3E50]">
                Técnicos Disponibles Ahora
              </h3>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                En línea
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicians.map((tech, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    tech.available
                      ? 'border-green-200 bg-green-50 hover:border-green-300'
                      : 'border-gray-200 bg-gray-50 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-[#2C3E50]">
                      {tech.name}
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-[#2C3E50]">{tech.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-[#7F8C8D] mb-2">
                    {tech.specialty}
                  </div>
                  <Badge
                    className={
                      tech.available
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {tech.available ? 'Disponible' : 'Ocupado'}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center text-blue-800">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-medium">¿Cómo funciona?</span>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                1. Solicitas el servicio → 2. Te asignamos el técnico más
                cercano → 3. Rastreas su llegada → 4. Calificas el servicio
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
