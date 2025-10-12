/**
 * Página de Garantías - Portal Cliente
 * Gestión de garantías activas y reclamos según ley colombiana (90 días)
 */

'use client'

import { useState } from 'react'
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
  DialogTrigger,
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
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Star,
  Camera,
  Info,
  Plus,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

// Mock data para servicios con garantía
const warrantyServices = [
  {
    id: 'SRV-098',
    type: 'Reparación Refrigerador',
    completedDate: '2025-09-15T16:30:00',
    warrantyExpires: '2025-12-14T16:30:00',
    technician: 'Carlos Ruiz',
    rating: 5,
    cost: 150000,
    description: 'Reemplazo de compresor y termostato',
    partsReplaced: ['Compresor', 'Termostato', 'Filtro'],
    status: 'active',
    warrantyType: 'parts_and_labor',
  },
  {
    id: 'SRV-097',
    type: 'Instalación Lavaplatos',
    completedDate: '2025-08-20T11:45:00',
    warrantyExpires: '2025-11-18T11:45:00',
    technician: 'Juan Pérez',
    rating: 4,
    cost: 95000,
    description: 'Instalación completa con conexiones',
    partsReplaced: ['Mangueras', 'Conectores', 'Válvula'],
    status: 'active',
    warrantyType: 'installation',
  },
  {
    id: 'SRV-089',
    type: 'Reparación Lavadora',
    completedDate: '2025-06-10T14:20:00',
    warrantyExpires: '2025-09-08T14:20:00',
    technician: 'Ana López',
    rating: 5,
    cost: 120000,
    description: 'Cambio de motor y transmisión',
    partsReplaced: ['Motor', 'Transmisión', 'Correa'],
    status: 'expired',
    warrantyType: 'parts_and_labor',
  },
]

// Mock data para reclamos de garantía
const warrantyClaims: WarrantyClaim[] = [
  {
    id: 'WCL-001',
    serviceId: 'SRV-098',
    claimDate: '2025-10-05T10:30:00',
    status: 'under_review',
    description: 'El refrigerador volvió a presentar el mismo problema',
    response: null,
    scheduledDate: null,
  },
]

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
  const [selectedService, setSelectedService] = useState<
    (typeof warrantyServices)[0] | null
  >(null)
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false)
  const [claimDescription, setClaimDescription] = useState('')
  const [claimImages, setClaimImages] = useState<File[]>([])

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

      {/* Warranty Info */}
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
      </Card>

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
            <div className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No tienes garantías activas
              </p>
            </div>
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
                          {service.partsReplaced.join(', ')}
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
          <CardContent>
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
                    {selectedService.partsReplaced.join(', ')}
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
                  className="min-h-[100px] mt-2"
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
