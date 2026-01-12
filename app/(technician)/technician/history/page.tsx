/**
 * Página de Historial - Panel Técnico
 * Historial de trabajos completados por el técnico
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Clock,
  Star,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
  Award,
  DollarSign,
  Eye,
} from 'lucide-react'

interface CompletedJob {
  id: string
  orderId: string
  clientName: string
  clientAddress: string
  serviceType: string
  completedDate: string
  duration: string
  rating: number
  clientFeedback?: string
  earnings: number
  parts?: string[]
  notes: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

const mockCompletedJobs: CompletedJob[] = [
  {
    id: '1',
    orderId: 'ORD-098',
    clientName: 'María González',
    clientAddress: 'Calle 45 #12-34, Bogotá Norte',
    serviceType: 'Reparación Lavadora',
    completedDate: '2024-01-15T16:30:00',
    duration: '2.5 horas',
    rating: 5,
    clientFeedback: 'Excelente servicio, muy profesional y rápido',
    earnings: 85000,
    parts: ['Correa de transmisión', 'Rodamientos'],
    notes: 'Cambio de correa y rodamientos. Cliente muy satisfecho.',
    priority: 'high',
  },
  {
    id: '2',
    orderId: 'ORD-097',
    clientName: 'Carlos Pérez',
    clientAddress: 'Carrera 68 #23-45, Bogotá Centro',
    serviceType: 'Mantenimiento Aire Acondicionado',
    completedDate: '2024-01-14T14:15:00',
    duration: '1.5 horas',
    rating: 4,
    clientFeedback: 'Buen trabajo, el aire quedó funcionando bien',
    earnings: 65000,
    parts: ['Filtros', 'Refrigerante R410A'],
    notes:
      'Mantenimiento preventivo completo. Recomendé cambio de filtros cada 3 meses.',
    priority: 'medium',
  },
  {
    id: '3',
    orderId: 'ORD-096',
    clientName: 'Ana Rodríguez',
    clientAddress: 'Avenida 19 #78-90, Bogotá Sur',
    serviceType: 'Reparación Refrigerador',
    completedDate: '2024-01-13T11:45:00',
    duration: '3.2 horas',
    rating: 5,
    clientFeedback: 'Técnico muy conocedor, solucionó el problema rápidamente',
    earnings: 120000,
    parts: ['Compresor', 'Termostato'],
    notes: 'Reemplazo de compresor dañado. Pruebas de funcionamiento exitosas.',
    priority: 'urgent',
  },
  {
    id: '4',
    orderId: 'ORD-095',
    clientName: 'Luis Martínez',
    clientAddress: 'Calle 127 #15-67, Bogotá Norte',
    serviceType: 'Reparación Horno Microondas',
    completedDate: '2024-01-12T09:30:00',
    duration: '1.8 horas',
    rating: 4,
    earnings: 75000,
    notes: 'Reparación de magnetrón. Funcionamiento normal restaurado.',
    priority: 'medium',
  },
  {
    id: '5',
    orderId: 'ORD-094',
    clientName: 'Patricia López',
    clientAddress: 'Carrera 45 #89-12, Bogotá Occidente',
    serviceType: 'Instalación Lavaplatos',
    completedDate: '2024-01-11T15:20:00',
    duration: '2.0 horas',
    rating: 5,
    clientFeedback: 'Instalación perfecta, muy limpio el trabajo',
    earnings: 95000,
    parts: ['Mangueras', 'Conectores'],
    notes: 'Instalación completa con pruebas de funcionamiento.',
    priority: 'low',
  },
]

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

export default function TechnicianHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredJobs = mockCompletedJobs.filter(job => {
    const matchesSearch =
      job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(searchTerm.toLowerCase())

    if (timeFilter === 'all') return matchesSearch

    const jobDate = new Date(job.completedDate)
    const now = new Date()

    switch (timeFilter) {
      case '7d':
        return (
          matchesSearch &&
          now.getTime() - jobDate.getTime() <= 7 * 24 * 60 * 60 * 1000
        )
      case '30d':
        return (
          matchesSearch &&
          now.getTime() - jobDate.getTime() <= 30 * 24 * 60 * 60 * 1000
        )
      case '90d':
        return (
          matchesSearch &&
          now.getTime() - jobDate.getTime() <= 90 * 24 * 60 * 60 * 1000
        )
      default:
        return matchesSearch
    }
  })

  const openDetailDialog = (job: CompletedJob) => {
    setSelectedJob(job)
    setIsDetailDialogOpen(true)
  }

  // Calculate summary stats
  const totalEarnings = filteredJobs.reduce((sum, job) => sum + job.earnings, 0)
  const averageRating =
    filteredJobs.reduce((sum, job) => sum + job.rating, 0) / filteredJobs.length
  const totalHours = filteredJobs.reduce((sum, job) => {
    const hours = parseFloat(job.duration)
    return sum + (isNaN(hours) ? 0 : hours)
  }, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Historial de Trabajos
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trabajos Completados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              En el período seleccionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= averageRating
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              En el período seleccionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Trabajadas
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Tiempo total invertido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, orden o servicio..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el tiempo</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Rendimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Promedio por trabajo:</span>
                <span className="font-medium">
                  ${(totalEarnings / filteredJobs.length).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tiempo promedio:</span>
                <span className="font-medium">
                  {(totalHours / filteredJobs.length).toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Trabajos con 5 estrellas:</span>
                <span className="font-medium">
                  {filteredJobs.filter(j => j.rating === 5).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Servicios Destacados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockCompletedJobs
                .filter(job => job.rating === 5)
                .slice(0, 3)
                .map(job => (
                  <div key={job.id} className="text-sm">
                    <p className="font-medium">{job.serviceType}</p>
                    <p className="text-muted-foreground">{job.clientName}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(
                filteredJobs.reduce((acc, job) => {
                  acc[job.serviceType] = (acc[job.serviceType] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([service, count]) => (
                <div key={service} className="flex justify-between text-sm">
                  <span>{service}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs History Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historial Detallado ({filteredJobs.length} trabajos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha Completada</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map(job => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.orderId}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.clientAddress}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{job.serviceType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(job.completedDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">
                        {new Date(job.completedDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{job.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= job.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        ({job.rating})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${job.earnings.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[job.priority]}>
                      {job.priority === 'low' && 'Baja'}
                      {job.priority === 'medium' && 'Media'}
                      {job.priority === 'high' && 'Alta'}
                      {job.priority === 'urgent' && 'Urgente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailDialog(job)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Detalles del Trabajo - {selectedJob?.orderId}
            </DialogTitle>
            <DialogDescription>
              Información completa del trabajo completado
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nombre:</strong> {selectedJob.clientName}
                    </p>
                    <p>
                      <strong>Dirección:</strong> {selectedJob.clientAddress}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Información del Trabajo</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Servicio:</strong> {selectedJob.serviceType}
                    </p>
                    <p>
                      <strong>Completado:</strong>{' '}
                      {new Date(selectedJob.completedDate).toLocaleString()}
                    </p>
                    <p>
                      <strong>Duración:</strong> {selectedJob.duration}
                    </p>
                    <p>
                      <strong>Ingresos:</strong> $
                      {selectedJob.earnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Calificación del Cliente</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= selectedJob.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">({selectedJob.rating}/5)</span>
                </div>
                {selectedJob.clientFeedback && (
                  <p className="text-sm bg-gray-50 p-3 rounded italic">
                    “{selectedJob.clientFeedback}”
                  </p>
                )}
              </div>

              {selectedJob.parts && selectedJob.parts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Partes Utilizadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.parts.map((part, index) => (
                      <Badge key={index} variant="secondary">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Notas del Técnico</h4>
                <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                  {selectedJob.notes}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
