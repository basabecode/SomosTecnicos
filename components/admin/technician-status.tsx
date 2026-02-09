/**
 * Componente del Estado de Técnicos
 * Muestra técnicos activos y su estado actual
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { TechnicianCard } from '@/components/domain/technician-card'

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
  const router = useRouter()
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

  const handleViewTechnician = (technicianId: number) => {
    router.push(`/admin/technicians/${technicianId}`)
  }

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

  // Mapear técnicos al formato esperado por TechnicianCard
  const mappedTechnicians = technicianArray.map(tech => ({
    id: tech.id,
    nombre: tech.nombre,
    foto: `/avatars/${tech.id}.jpg`,
    estado: (tech.disponible ? 'disponible' : 'ocupado') as 'disponible' | 'ocupado' | 'en_descanso' | 'offline',
    zona: '', // No disponible en este endpoint
    especialidades: tech.especialidades,
    proximaOrden: tech.currentAssignment ? {
      orderNumber: tech.currentAssignment.order.numeroOrden,
      cliente: tech.currentAssignment.order.tipoElectrodomestico,
      hora: tech.currentAssignment.order.ciudad,
    } : undefined,
  }))

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
          <div className="space-y-3">
            {mappedTechnicians.map((technician) => (
              <TechnicianCard
                key={technician.id}
                technician={technician}
                onViewDetails={handleViewTechnician}
                compact={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
