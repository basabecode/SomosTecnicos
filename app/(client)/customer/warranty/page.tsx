/**
 * Página de Garantías - Portal Cliente
 * Gestión de garantías activas y reclamos según ley colombiana (90 días)
 */

'use client'

import { useState, useEffect } from 'react'
import { EmptyState } from '@/components/domain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Shield,
  Clock,
  AlertTriangle,
  FileText,
  Star,
  Camera,
  Info,
  Plus,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

// Tipos para el estado de reclamos
type ClaimStatus = 'under_review' | 'approved' | 'rejected' | 'completed'

interface WarrantyClaim {
  id: string
  serviceId: string
  claimDate: string
  status: ClaimStatus
  description: string
  response: string | null
  scheduledDate: string | null
}

interface WarrantyService {
    id: string
    type: string
    completedDate: string
    warrantyExpires: string
    technician: string
    rating: number
    cost: number
    description: string
    partsReplaced: string[]
    status: 'active' | 'expiring' | 'expired'
    warrantyType: string
}

const getWarrantyStatus = (expiryDate: string) => {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 0)
    return { status: 'expired', daysLeft: 0, color: 'bg-red-100 text-red-800' }
  if (diffDays <= 7)
    return {
      status: 'expiring',
      daysLeft: diffDays,
      color: 'bg-yellow-100 text-yellow-800',
    }
  return {
    status: 'active',
    daysLeft: diffDays,
    color: 'bg-green-100 text-green-800',
  }
}

const statusColors: Record<ClaimStatus, string> = {
  under_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

export default function WarrantyPage() {
  const { toast } = useToast()
  const [selectedService, setSelectedService] = useState<WarrantyService | null>(null)
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false)
  const [claimDescription, setClaimDescription] = useState('')
  const [claimImages, setClaimImages] = useState<File[]>([])

  const [warrantyServices, setWarrantyServices] = useState<WarrantyService[]>([])
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWarranties = async () => {
    setLoading(true)
    try {
        const token = localStorage.getItem('accessToken')
        const response = await fetch('/api/orders?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success) {
                const services: WarrantyService[] = data.data.orders
                    .filter((order: any) => order.estado === 'completado')
                    .map((order: any) => {
                        const completedDate = new Date(order.updatedAt || order.createdAt)
                        const expiryDate = new Date(completedDate)
                        expiryDate.setDate(expiryDate.getDate() + 90) // 90 days warranty

                        // Find technician
                        const assignment = order.assignments?.find((a: any) => a.estado === 'completado')
                        const technicianName = assignment?.technician?.nombre || 'Técnico'

                        return {
                            id: order.orderNumber,
                            type: `${order.tipoServicio} - ${order.tipoElectrodomestico}`,
                            completedDate: completedDate.toISOString(),
                            warrantyExpires: expiryDate.toISOString(),
                            technician: technicianName,
                            rating: 0, // Not in API
                            cost: Number(order.costoFinal) || 0,
                            description: order.descripcionProblema,
                            partsReplaced: [], // Not in API
                            status: getWarrantyStatus(expiryDate.toISOString()).status as any,
                            warrantyType: 'parts_and_labor'
                        }
                    })
                setWarrantyServices(services)
            }
        }
    } catch (error) {
        console.error("Error fetching warranties:", error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarranties()
  }, [])

  const activeWarranties = warrantyServices.filter(service => {
    const warranty = getWarrantyStatus(service.warrantyExpires)
    return warranty.status !== 'expired'
  })

  const expiredWarranties = warrantyServices.filter(service => {
    const warranty = getWarrantyStatus(service.warrantyExpires)
    return warranty.status === 'expired'
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - claimImages.length)
      setClaimImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setClaimImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleClaimSubmit = () => {
    if (!selectedService || !claimDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor describe el problema que presentas.',
        variant: 'destructive',
      })
      return
    }

    // Simular envío del reclamo
    toast({
      title: 'Reclamo Enviado',
      description: `Tu reclamo de garantía para ${selectedService.type} ha sido enviado. Te contactaremos en 24-48 horas.`,
    })

    setIsClaimDialogOpen(false)
    setClaimDescription('')
    setClaimImages([])
    setSelectedService(null)
  }

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-100">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Cargando garantías...</p>
          </div>
      )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Garantías</h1>
          <p className="text-muted-foreground">
            Gestiona tus garantías de servicio (90 días según ley colombiana)
          </p>
        </div>
      </div>

      {/* Warranty Info
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span>Información sobre Garantías</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">
                🇨🇴 Ley Colombiana de Garantías
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  • <strong>90 días</strong> de garantía obligatoria
                </li>
                <li>• Cubre defectos de mano de obra</li>
                <li>• Incluye partes instaladas</li>
                <li>• Servicio gratuito si es el mismo problema</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">¿Cuándo Reclamar?</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• El mismo problema persiste</li>
                <li>• Defecto en partes instaladas</li>
                <li>• Mala calidad en el trabajo realizado</li>
                <li>• Dentro de los 90 días calendario</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>*/}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Garantías Activas
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeWarranties.length}
            </div>
            <p className="text-xs text-muted-foreground">Servicios cubiertos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reclamos Activos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {warrantyClaims.length}
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Garantías Expiradas
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {expiredWarranties.length}
            </div>
            <p className="text-xs text-muted-foreground">Fuera de cobertura</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Warranties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Garantías Activas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeWarranties.length === 0 ? (
            <EmptyState variant="no-warranties" />
          ) : (
            <div className="space-y-4">
              {activeWarranties.map(service => {
                const warranty = getWarrantyStatus(service.warrantyExpires)
                return (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{service.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.id}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {service.description}
                        </p>
                      </div>
                      <Badge className={warranty.color}>
                        <Shield className="w-3 h-3 mr-1" />
                        {warranty.daysLeft} días restantes
                      </Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 text-sm mb-4">
                      <div>
                        <p>
                          <strong>Técnico:</strong> {service.technician}
                        </p>
                        <p>
                          <strong>Fecha del servicio:</strong>{' '}
                          {new Date(service.completedDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Vencimiento:</strong>{' '}
                          {new Date(
                            service.warrantyExpires
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Costo:</strong> $
                          {service.cost.toLocaleString()}
                        </p>
                        <p>
                          <strong>Calificación:</strong>
                          <span className="inline-flex items-center ml-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= service.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </span>
                        </p>
                        <p>
                          <strong>Partes:</strong>{' '}
                          {(service.partsReplaced && service.partsReplaced.length > 0) ? service.partsReplaced.join(', ') : 'Ninguna'}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedService(service)
                          setIsClaimDialogOpen(true)
                        }}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Reclamar Garantía
                      </Button>
                      <Button variant="outline">Ver Detalles</Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Claims */}
      {warrantyClaims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-yellow-600" />
              <span>Reclamos en Proceso</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {/* Desktop Table - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Fecha del Reclamo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warrantyClaims.map(claim => {
                    const service = warrantyServices.find(
                      s => s.id === claim.serviceId
                    )
                    return (
                      <TableRow key={claim.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{service?.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {claim.serviceId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(claim.claimDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[claim.status]}>
                            {claim.status === 'under_review' && 'En Revisión'}
                            {claim.status === 'approved' && 'Aprobado'}
                            {claim.status === 'rejected' && 'Rechazado'}
                            {claim.status === 'completed' && 'Completado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm truncate">{claim.description}</p>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards - Hidden on desktop */}
            <div className="md:hidden space-y-3 p-3">
              {warrantyClaims.map(claim => {
                const service = warrantyServices.find(
                  s => s.id === claim.serviceId
                )
                return (
                  <div
                    key={claim.id}
                    className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-base">{service?.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {claim.serviceId}
                        </p>
                      </div>
                      <Badge className={statusColors[claim.status]}>
                        {claim.status === 'under_review' && 'En Revisión'}
                        {claim.status === 'approved' && 'Aprobado'}
                        {claim.status === 'rejected' && 'Rechazado'}
                        {claim.status === 'completed' && 'Completado'}
                      </Badge>
                    </div>

                    {/* Claim Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha del reclamo:</span>
                        <span className="font-medium">
                          {new Date(claim.claimDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-muted-foreground text-xs mb-1">Descripción:</p>
                        <p className="text-sm">{claim.description}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalles
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Warranties */}
      {expiredWarranties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-red-600" />
              <span>Garantías Expiradas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiredWarranties.map(service => (
                <div
                  key={service.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{service.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Expiró el{' '}
                        {new Date(service.warrantyExpires).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-100 text-red-800 mb-2">
                        Expirada
                      </Badge>
                      <br />
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Nuevo Servicio
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warranty Claim Dialog */}
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reclamar Garantía</DialogTitle>
            <DialogDescription>
              Describe el problema que estás experimentando con tu{' '}
              {selectedService?.type}
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">
              {/* Service Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedService.type}</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <strong>Servicio ID:</strong> {selectedService.id}
                  </p>
                  <p>
                    <strong>Fecha del servicio:</strong>{' '}
                    {new Date(
                      selectedService.completedDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Técnico:</strong> {selectedService.technician}
                  </p>
                  <p>
                    <strong>Partes instaladas:</strong>{' '}
                    {(selectedService.partsReplaced && selectedService.partsReplaced.length > 0) ? selectedService.partsReplaced.join(', ') : 'Ninguna'}
                  </p>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <Label htmlFor="claim-description">
                  Describe el problema *
                </Label>
                <Textarea
                  id="claim-description"
                  placeholder="Describe detalladamente qué problema está presentando el electrodoméstico. ¿Es el mismo problema que se reparó anteriormente?"
                  value={claimDescription}
                  onChange={e => setClaimDescription(e.target.value)}
                  className="min-h-25 mt-2"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Fotos del Problema (Opcional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Sube fotos que muestren el problema actual
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="claim-image-upload"
                />
                <div className="flex flex-wrap gap-2">
                  {claimImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {claimImages.length < 3 && (
                    <label
                      htmlFor="claim-image-upload"
                      className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Importante</p>
                    <p className="text-yellow-700">
                      Los reclamos de garantía son evaluados por nuestro equipo
                      técnico. Si el problema no está relacionado con nuestro
                      trabajo anterior, se aplicará el costo de una nueva
                      visita.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleClaimSubmit}
                  disabled={!claimDescription.trim()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Enviar Reclamo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsClaimDialogOpen(false)
                    setClaimDescription('')
                    setClaimImages([])
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
