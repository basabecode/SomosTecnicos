'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, isSameDay, parseISO, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Navigation,
  Phone,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { EmptyState } from '@/components/domain'
import { cn } from '@/lib/utils'

// Tipos
interface Assignment {
  id: number
  orderNumber: string
  orderId: string
  cliente: string
  telefono: string
  direccion: string
  distrito: string
  tipoElectrodomestico: string
  problema: string
  urgencia: string
  fechaProgramada: string
  estado: string
  notas: string
}

export default function TechnicianSchedulePage() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos reales
  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/technicians/me/assignments')
      const data = await response.json()
      if (data.success) {
        setAssignments(data.assignments)
      }
    } catch (error) {
      console.error('Error cargando calendario:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  // Filtrar asignaciones para el día seleccionado
  const selectedDayAssignments = useMemo(() => {
    if (!date) return []
    return assignments.filter(a => {
      if (!a.fechaProgramada) return false
      return isSameDay(parseISO(a.fechaProgramada), date)
    }).sort((a, b) => {
        // Ordenar por hora
        return new Date(a.fechaProgramada).getTime() - new Date(b.fechaProgramada).getTime()
    })
  }, [date, assignments])

  // Identificar días con trabajo para decorar el calendario
  const bookedDays = useMemo(() => {
    const days: Date[] = []
    assignments.forEach(a => {
        if (a.fechaProgramada) {
            days.push(parseISO(a.fechaProgramada))
        }
    })
    return days
  }, [assignments])

  // Función para renderizar indicadores personalizados en el calendario
  // Nota: Shadcn Calendar usa react-day-picker. Los modificadores personalizados se manejan via componentes o classNames.
  // Aquí usaremos una lógica simple de "selected" nativa y modificadores para los puntos.

  return (
    <div className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Standard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
            Mi Agenda
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Gestión visual de tus servicios programados
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-muted-foreground">Hoy es</p>
                <p className="text-xl font-bold capitalize text-gray-900">
                    {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
            </div>
            <Button variant="outline" size="icon" onClick={fetchAssignments}>
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* COLUMNA IZQUIERDA: CALENDARIO */}
        <Card className="lg:col-span-4 xl:col-span-4">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>Selecciona un día para ver detalles</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex justify-center pb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={es}
              className="rounded-md border-0"
              modifiers={{
                booked: bookedDays
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '100%'
                }
              }}
            />
          </CardContent>

          {/* Leyenda */}
          <div className="px-6 pb-6 pt-0 border-t mt-4 border-dashed border-gray-100">
             <h4 className="text-xs font-semibold uppercase text-muted-foreground mt-4 mb-3">Referencias</h4>
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Urgencia Alta</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Completado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                    <span>Libre</span>
                </div>
             </div>
          </div>
        </Card>

        {/* COLUMNA DERECHA: AGENDA DEL DÍA (TIMELINE) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                        {date ? format(date, 'd') : '--'}
                    </span>
                    <span className="capitalize">
                        {date ? format(date, 'MMMM', { locale: es }) : 'Selecciona una fecha'}
                    </span>
                </h2>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                    {selectedDayAssignments.length} servicios programados
                </Badge>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin mb-3" />
                    <p>Sincronizando calendario...</p>
                </div>
            ) : selectedDayAssignments.length === 0 ? (
                <EmptyState variant="no-schedule" />
            ) : (
                <div className="space-y-4 relative">
                    {/* Línea de tiempo visual */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200 hidden md:block" />

                    {selectedDayAssignments.map((assignment, index) => {
                        const isDone = assignment.estado === 'completado'
                        const isHighPriority = assignment.urgencia === 'alta'

                        return (
                            <div key={assignment.id} className="relative pl-0 md:pl-16 group transition-all duration-300 hover:pl-16 md:hover:pl-20">
                                {/* Punto de tiempo (Timeline Dot) */}
                                <div className={cn(
                                    "absolute left-4 top-6 h-4 w-4 rounded-full border-4 border-white shadow-sm z-10 hidden md:block transition-colors",
                                    isDone ? "bg-green-500" : isHighPriority ? "bg-red-500" : "bg-blue-500"
                                )} />

                                {/* Hora Lateral */}
                                <div className="absolute left-0 top-6 text-xs font-bold text-muted-foreground w-16 text-right pr-6 hidden md:block">
                                    {assignment.fechaProgramada ? format(parseISO(assignment.fechaProgramada), 'HH:mm') : '--:--'}
                                </div>

                                <Card className={cn(
                                    "border-l-4 transition-all hover:shadow-lg",
                                    isDone ? "border-l-green-500 bg-green-50/30" :
                                    isHighPriority ? "border-l-red-500 bg-white" : "border-l-blue-500 bg-white"
                                )}>
                                    <CardContent className="p-5">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">

                                            {/* Detalles Principales */}
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={isHighPriority ? "destructive" : "secondary"} className="rounded-md">
                                                        {assignment.urgencia.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-xs font-mono text-muted-foreground">#{assignment.orderNumber}</span>
                                                    {isDone && (
                                                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1">
                                                            <CheckCircle2 className="h-3 w-3" /> Completado
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                    {assignment.tipoElectrodomestico}
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-gray-600 font-normal">{assignment.problema}</span>
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                                        <span>{assignment.direccion}, {assignment.distrito}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {assignment.fechaProgramada ? format(parseISO(assignment.fechaProgramada), 'h:mm a', { locale: es }) : 'Por coordinar'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed">
                                                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {assignment.cliente.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{assignment.cliente}</span>
                                                    <span className="text-xs text-muted-foreground ml-1">• {assignment.telefono}</span>
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex flex-row md:flex-col gap-2 justify-center md:border-l md:pl-4 border-gray-100">
                                                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${assignment.direccion}, ${assignment.distrito}`)}`} target="_blank">
                                                        <Navigation className="h-3 w-3 mr-2" />
                                                        Ruta
                                                    </a>
                                                </Button>
                                                <Button size="sm" variant="outline" className="flex-1" asChild>
                                                     <a href={`tel:${assignment.telefono}`}>
                                                        <Phone className="h-3 w-3 mr-2" />
                                                        Llamar
                                                     </a>
                                                </Button>
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>

      </div>
    </div>
  )
}
