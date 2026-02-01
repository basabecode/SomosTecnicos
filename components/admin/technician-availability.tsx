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
              return <Badge className="bg-green-100 text-green-800 border-green-200">Disponible</Badge>
          case 'ocupado':
              return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Ocupado</Badge>
          case 'en_descanso':
             return <Badge className="bg-orange-100 text-orange-800 border-orange-200">En Descanso</Badge>
          default:
             return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Offline</Badge>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-[#2C3E50]">
              Disponibilidad de Técnicos
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Vista general de la flota de técnicos para asignación coordinada
            </CardDescription>
          </div>
          <div className="flex gap-2">
             <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {stats.disponibles} Disponibles
             </Badge>
             <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                {stats.ocupados} Ocupados
             </Badge>
             <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-3 py-1">
                {stats.descanso} En Descanso
             </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
             <div className="text-center py-8 text-gray-500">Cargando disponibilidad...</div>
        ) : technicians.length === 0 ? (
             <div className="text-center py-8 text-gray-500">No hay técnicos activos registrados.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technicians.map((tech) => (
                <div
                key={tech.id}
                className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(tech.status)}`}
                >
                <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-[#2C3E50]">
                    {tech.name}
                    </div>
                    <div className="flex items-center text-sm bg-white px-2 py-0.5 rounded border border-gray-100">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-[#2C3E50] font-medium">{tech.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="text-sm font-medium text-gray-600 bg-white px-2 py-0.5 rounded inline-block border border-gray-100 truncate max-w-[100px]" title={tech.specialty}>
                        {tech.specialty}
                    </div>
                    {getStatusBadge(tech.status)}
                </div>
                </div>
            ))}
            </div>
        )}

        <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
              <p className="text-sm font-medium text-blue-800">Panel de Asignación Manual</p>
              <p className="text-blue-600 text-sm mt-1">
                Utiliza este panel para monitorear la carga de trabajo y asignar técnicos de manera estratégica según su disponibilidad.
              </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
