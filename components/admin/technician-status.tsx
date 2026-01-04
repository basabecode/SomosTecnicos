/**
 * Componente del Estado de Técnicos
 * Muestra técnicos activos y su estado actual
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  Wrench,
} from 'lucide-react'

interface Technician {
  id: number
  nombre: string
  telefono: string
  especialidades: string[]
  activo: boolean
  disponible: boolean
  ordenesCompletadas: number
  calificacionPromedio: number
  currentAssignment?: {
    order: {
      numeroOrden: string
      tipoElectrodomestico: string
      ciudad: string
    }
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getSpecialtyColor = (specialty: string) => {
  const colors = {
    nevera: 'bg-blue-100 text-blue-800',
    lavadora: 'bg-green-100 text-green-800',
    estufa: 'bg-orange-100 text-orange-800',
    aire_acondicionado: 'bg-cyan-100 text-cyan-800',
    general: 'bg-gray-100 text-gray-800',
  }
  return colors[specialty as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export function TechnicianStatus() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/technicians?limit=5', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Verificar que data.data sea un array
          setTechnicians(Array.isArray(data.data) ? data.data : [])
        } else {
          // Datos mock si la API no responde
          // Datos vacíos si la API no responde
          setTechnicians([])
        }
      } catch (error) {
        console.error('Error fetching technicians:', error)
        // Fallback a datos mock
        setTechnicians([])
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Técnicos</CardTitle>
          <CardDescription>Técnicos activos y disponibilidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Verificar que technicians sea un array válido
  const technicianArray = Array.isArray(technicians) ? technicians : []
  const activeTechnicians = technicianArray.filter(t => t.activo)
  const availableTechnicians = activeTechnicians.filter(t => t.disponible)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Estado de Técnicos</CardTitle>
          <CardDescription>
            {availableTechnicians.length} de {activeTechnicians.length}{' '}
            disponibles
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/technicians">
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {technicianArray.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No hay técnicos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {technicianArray.map((technician, index) => (
              <div key={technician.id}>
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/avatars/${technician.id}.jpg`} />
                    <AvatarFallback>
                      {getInitials(technician.nombre)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Technician Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {technician.nombre}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {technician.disponible ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Disponible
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            Ocupado
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Especialidades */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {technician.especialidades.slice(0, 3).map(specialty => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className={`text-xs ${getSpecialtyColor(specialty)}`}
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {technician.especialidades.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{technician.especialidades.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Wrench className="mr-1 h-3 w-3" />
                          {technician.ordenesCompletadas} órdenes
                        </span>
                        <span className="flex items-center">
                          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {technician.calificacionPromedio.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Current Assignment */}
                    {technician.currentAssignment && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <div className="text-xs text-blue-800">
                          <div className="flex items-center">
                            <Wrench className="mr-1 h-3 w-3" />
                            <span className="font-medium">
                              {technician.currentAssignment.order.numeroOrden}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>
                              {
                                technician.currentAssignment.order
                                  .tipoElectrodomestico
                              }{' '}
                              en {technician.currentAssignment.order.ciudad}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/technicians/${technician.id}`}>
                      Ver
                    </Link>
                  </Button>
                </div>

                {index < technicians.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
