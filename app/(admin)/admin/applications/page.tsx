/**
 * Panel de Administración - Solicitudes de Técnicos
 * Permite revisar, aprobar y rechazar solicitudes
 */

'use client'

import { useState, useEffect } from 'react'
import { EmptyState } from '@/components/domain'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Eye,
  FileText,
  Download,
} from 'lucide-react'

interface TechnicianApplication {
  id: string
  nombre: string
  apellido: string
  cedula: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  especialidades: string[]
  zonaPreferida: string
  experienciaAnios?: number
  documentosUrl?: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  motivoRechazo?: string
  createdAt: string
  updatedAt: string
}

const ESPECIALIDADES_LABELS: Record<string, string> = {
  'nevera': 'Nevera',
  'congelador': 'Congelador',
  'lavadora': 'Lavadora',
  'secadora': 'Secadora',
  'estufa': 'Estufa',
  'horno': 'Horno',
  'microondas': 'Microondas',
  'lavavajillas': 'Lavavajillas',
  'aire_acondicionado': 'Aire Acondicionado',
  'calentador': 'Calentador',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<TechnicianApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pendiente')
  const [selectedApp, setSelectedApp] = useState<TechnicianApplication | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generatedCredentials, setGeneratedCredentials] = useState<any>(null)

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/admin/applications?estado=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setApplications(data.data)
      } else {
        setError(data.error || 'Error al cargar solicitudes')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedApp) return

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/admin/applications/${selectedApp.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(`Solicitud aprobada. Credenciales enviadas a ${selectedApp.email}`)
        setGeneratedCredentials(data.credentials)
        setShowApproveDialog(false)
        fetchApplications()
      } else {
        setError(data.error || 'Error al aprobar solicitud')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedApp || !rejectReason.trim()) {
      setError('Debe proporcionar un motivo de rechazo')
      return
    }

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/admin/applications/${selectedApp.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo: rejectReason })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Solicitud rechazada. Email enviado al solicitante.')
        setShowRejectDialog(false)
        setRejectReason('')
        fetchApplications()
      } else {
        setError(data.error || 'Error al rechazar solicitud')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error de conexión')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>
      case 'aprobado':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobado</Badge>
      case 'rechazado':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Rechazado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Técnicos</h1>
        <p className="text-gray-600 mt-1">Revisa y gestiona las solicitudes de nuevos técnicos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.estado === 'pendiente').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.estado === 'aprobado').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(a => a.estado === 'rechazado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-64">
              <Label>Estado</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="aprobado">Aprobadas</SelectItem>
                  <SelectItem value="rechazado">Rechazadas</SelectItem>
                  <SelectItem value="all">Todas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {generatedCredentials && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Credenciales generadas:</strong><br />
            Usuario: <code className="bg-blue-100 px-2 py-1 rounded">{generatedCredentials.username}</code><br />
            Contraseña temporal: <code className="bg-blue-100 px-2 py-1 rounded">{generatedCredentials.tempPassword}</code>
          </AlertDescription>
        </Alert>
      )}

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes ({applications.length})</CardTitle>
          <CardDescription>
            {filter === 'pendiente' && 'Solicitudes pendientes de revisión'}
            {filter === 'aprobado' && 'Solicitudes aprobadas'}
            {filter === 'rechazado' && 'Solicitudes rechazadas'}
            {(filter === 'all' || !filter) && 'Todas las solicitudes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState variant="no-applications" />
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {app.nombre} {app.apellido}
                        </h3>
                        {getStatusBadge(app.estado)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {app.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {app.telefono}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {app.ciudad} - {app.zonaPreferida}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(app.createdAt).toLocaleDateString('es-CO')}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {app.especialidades.map((esp) => (
                          <Badge key={esp} variant="outline" className="text-xs">
                            {ESPECIALIDADES_LABELS[esp] || esp}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApp(app)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>

                      {app.estado === 'pendiente' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedApp(app)
                              setShowApproveDialog(true)
                            }}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedApp(app)
                              setShowRejectDialog(true)
                            }}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Nombre Completo</Label>
                  <p className="font-medium">{selectedApp.nombre} {selectedApp.apellido}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Cédula</Label>
                  <p className="font-medium">{selectedApp.cedula}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Teléfono</Label>
                  <p className="font-medium">{selectedApp.telefono}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Dirección</Label>
                  <p className="font-medium">{selectedApp.direccion}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Ciudad</Label>
                  <p className="font-medium">{selectedApp.ciudad}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Zona Preferida</Label>
                  <p className="font-medium">{selectedApp.zonaPreferida}</p>
                </div>
                {selectedApp.experienciaAnios && (
                  <div>
                    <Label className="text-gray-600">Experiencia</Label>
                    <p className="font-medium">{selectedApp.experienciaAnios} años</p>
                  </div>
                )}

                {selectedApp.documentosUrl && (
                  <div className="col-span-2 mt-4 pt-4 border-t">
                    <Label className="text-gray-600 mb-2 block">Documentos Adjuntos</Label>
                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-blue-900">Documentación de Soporte</p>
                        <p className="text-xs text-blue-700">Cédula y Certificados.pdf</p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="border-blue-200 hover:bg-white hover:text-blue-700">
                        <a href={selectedApp.documentosUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Ver / Descargar
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-gray-600">Especialidades</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApp.especialidades.map((esp) => (
                    <Badge key={esp} variant="outline">
                      {ESPECIALIDADES_LABELS[esp] || esp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Estado</Label>
                <div className="mt-2">{getStatusBadge(selectedApp.estado)}</div>
              </div>

              {selectedApp.motivoRechazo && (
                <div>
                  <Label className="text-gray-600">Motivo de Rechazo</Label>
                  <p className="text-red-600 mt-1">{selectedApp.motivoRechazo}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas aprobar esta solicitud?
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="py-4">
              <p className="mb-2">
                <strong>Técnico:</strong> {selectedApp.nombre} {selectedApp.apellido}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {selectedApp.email}
              </p>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Se crearán las credenciales de acceso y se enviarán por email al técnico.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Aprobar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Proporciona un motivo para el rechazo. Este mensaje será enviado al solicitante.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {selectedApp && (
              <p>
                <strong>Técnico:</strong> {selectedApp.nombre} {selectedApp.apellido}
              </p>
            )}
            <div>
              <Label htmlFor="rejectReason">Motivo del Rechazo *</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej: No cumple con los requisitos de experiencia mínima..."
                rows={4}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 10 caracteres</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || rejectReason.trim().length < 10}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Rechazar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
