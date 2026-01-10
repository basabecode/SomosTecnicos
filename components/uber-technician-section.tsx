'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Star } from 'lucide-react'

/**
 * Panel de Disponibilidad de Técnicos (Admin View)
 * - Muestra técnicos disponibles para asignación de servicios
 * - Utilizado para gestión y asignación de órdenes
 */

export default function UberTechnicianSection() {
  const [availableTechnicians, setAvailableTechnicians] = useState(12)

  useEffect(() => {
    // Simular números dinámicos de técnicos disponibles
    const interval = setInterval(() => {
      setAvailableTechnicians(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(8, Math.min(15, prev + change))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const technicians = [
    { name: 'Carlos M.', rating: 4.9, specialty: 'Neveras', available: true },
    { name: 'Ana L.', rating: 4.8, specialty: 'Lavadoras', available: true },
    { name: 'Miguel R.', rating: 5.0, specialty: 'Estufas', available: false },
    { name: 'Sofia P.', rating: 4.7, specialty: 'General', available: true },
  ]

  return (
    <Card className="border-0 shadow-md bg-white">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-[#2C3E50]">
              Disponibilidad de Técnicos
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Vista general de la flota de técnicos para asignación
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {availableTechnicians} Técnicos Activos
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicians.map((tech, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                tech.available
                  ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                  : 'border-gray-200 bg-gray-50/50 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-[#2C3E50]">
                  {tech.name}
                </div>
                <div className="flex items-center text-sm bg-white px-2 py-0.5 rounded border border-gray-100">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-[#2C3E50] font-medium">{tech.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                 <div className="text-sm font-medium text-gray-600 bg-white px-2 py-0.5 rounded inline-block border border-gray-100">
                  {tech.specialty}
                 </div>
                 <Badge
                    className={
                      tech.available
                        ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                    }
                  >
                    {tech.available ? 'Disponible' : 'Ocupado'}
                  </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
              <p className="text-sm font-medium text-blue-800">Panel de Asignación</p>
              <p className="text-blue-600 text-sm mt-1">
                Utiliza este panel para monitorear la carga de trabajo. Los técnicos "Disponibles" pueden recibir nuevas asignaciones inmediatas.
              </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
