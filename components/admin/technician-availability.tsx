'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Star } from 'lucide-react'

/**
 * Panel de Disponibilidad de Técnicos (Admin View)
 * - Muestra técnicos disponibles para asignación de servicios
 * - Utilizado para gestión y asignación de órdenes en tiempo real
 */

export function TechnicianAvailabilitySection() {
  const [technicians, setTechnicians] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, disponibles: 0, ocupados: 0, descanso: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/technicians/availability', {
          headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
          const data = await response.json()
          setTechnicians(data.technicians)
          setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Polling cada 30 segundos para actualización casi en tiempo real
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
      switch (status) {
          case 'disponible':
              return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Disponible</Badge>
          case 'ocupado':
              return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">Ocupado</Badge>
          case 'en_descanso':
             return <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">Descanso</Badge>
          default:
             return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">Offline</Badge>
      }
  }

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'disponible': return 'border-green-200 bg-green-50/50 hover:border-green-300'
          case 'ocupado': return 'border-blue-200 bg-blue-50/50 hover:border-blue-300'
          case 'en_descanso': return 'border-orange-200 bg-orange-50/50 hover:border-orange-300'
          default: return 'border-gray-200 bg-gray-50/50 opacity-75'
      }
  }

  return (
    <Card className="border-0 shadow-md bg-white">
      <CardHeader className="pb-4 border-b">
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl font-bold text-[#2C3E50]">
              Disponibilidad de Técnicos
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-500">
              Vista general de la flota de técnicos
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
             <Badge className="bg-green-100 text-green-800 border-green-200 px-2 md:px-3 py-1 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                {stats.disponibles} Disponibles
             </Badge>
             <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-2 md:px-3 py-1 text-xs">
                {stats.ocupados} Ocupados
             </Badge>
             <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-2 md:px-3 py-1 text-xs">
                {stats.descanso} En Descanso
             </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {loading ? (
             <div className="text-center py-8 text-gray-500">Cargando disponibilidad...</div>
        ) : technicians.length === 0 ? (
             <div className="text-center py-8 text-gray-500">No hay técnicos activos registrados.</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {technicians.map((tech) => (
                <div
                key={tech.id}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all ${getStatusColor(tech.status)}`}
                >
                <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="font-semibold text-sm md:text-base text-[#2C3E50] truncate flex-1 min-w-0">
                    {tech.name}
                    </div>
                    <div className="flex items-center text-xs md:text-sm bg-white px-1.5 md:px-2 py-0.5 rounded border border-gray-100 flex-shrink-0">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-[#2C3E50] font-medium">{tech.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="text-xs md:text-sm font-medium text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-100 truncate flex-1 min-w-0" title={tech.specialty}>
                        {tech.specialty}
                    </div>
                    <div className="flex-shrink-0">
                        {getStatusBadge(tech.status)}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex flex-col sm:flex-row items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-blue-800">Panel de Asignación Manual</p>
              <p className="text-blue-600 text-xs md:text-sm mt-1">
                Utiliza este panel para monitorear la carga de trabajo y asignar técnicos de manera estratégica.
              </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
