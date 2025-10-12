/**
 * Página de Solicitud de Servicio - Portal Cliente
 * Formulario para solicitar nuevos servicios
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Camera,
  FileText,
  CheckCircle,
  Home,
  Wrench,
  Zap,
  Snowflake,
  Flame,
  Droplets,
  Settings,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

const serviceTypes = [
  {
    id: 'lavadora',
    name: 'Reparación Lavadora',
    icon: Droplets,
    description: 'Problemas de lavado, centrifugado, drenaje',
    estimatedTime: '2-3 horas',
    basePrice: 80000,
  },
  {
    id: 'refrigerador',
    name: 'Reparación Refrigerador',
    icon: Snowflake,
    description: 'No enfría, ruidos extraños, fugas',
    estimatedTime: '2-4 horas',
    basePrice: 120000,
  },
  {
    id: 'aire_acondicionado',
    name: 'Aire Acondicionado',
    icon: Snowflake,
    description: 'Mantenimiento, reparación, instalación',
    estimatedTime: '1.5-3 horas',
    basePrice: 100000,
  },
  {
    id: 'horno',
    name: 'Reparación Horno',
    icon: Flame,
    description: 'Problemas de calentamiento, timer',
    estimatedTime: '1.5-2.5 horas',
    basePrice: 90000,
  },
  {
    id: 'microondas',
    name: 'Reparación Microondas',
    icon: Zap,
    description: 'No calienta, problemas eléctricos',
    estimatedTime: '1-2 horas',
    basePrice: 70000,
  },
  {
    id: 'lavaplatos',
    name: 'Lavaplatos',
    icon: Droplets,
    description: 'Instalación, reparación, mantenimiento',
    estimatedTime: '2-3 horas',
    basePrice: 85000,
  },
  {
    id: 'otros',
    name: 'Otros Electrodomésticos',
    icon: Settings,
    description: 'Otros aparatos del hogar',
    estimatedTime: '1.5-3 horas',
    basePrice: 75000,
  },
]

const timeSlots = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
]

const priorities = [
  { id: 'low', label: 'Baja', description: 'No es urgente', surcharge: 0 },
  {
    id: 'medium',
    label: 'Media',
    description: 'Moderadamente urgente',
    surcharge: 0,
  },
  { id: 'high', label: 'Alta', description: 'Urgente', surcharge: 20000 },
  {
    id: 'urgent',
    label: 'Crítica',
    description: 'Muy urgente (mismo día)',
    surcharge: 50000,
  },
]

export default function RequestServicePage() {
  const { toast } = useToast()
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('medium')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [serviceRequestNumber, setServiceRequestNumber] = useState('')

  const selectedServiceData = serviceTypes.find(s => s.id === selectedService)
  const selectedPriorityData = priorities.find(p => p.id === selectedPriority)

  const totalCost = selectedServiceData
    ? selectedServiceData.basePrice + (selectedPriorityData?.surcharge || 0)
    : 0

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - images.length)
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !description.trim()
    ) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    // Simular envío del formulario
    setTimeout(() => {
      const requestNumber =
        'SRV-' + Math.random().toString(36).substr(2, 6).toUpperCase()
      setServiceRequestNumber(requestNumber)
      setIsSubmitting(false)
      setIsSuccessModalOpen(true)

      // Reset form
      setSelectedService('')
      setSelectedDate(undefined)
      setSelectedTime('')
      setSelectedPriority('medium')
      setDescription('')
      setImages([])
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Solicitar Servicio
          </h1>
          <p className="text-muted-foreground">
            Describe tu problema y programa una visita técnica
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Service Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="w-5 h-5" />
                <span>Tipo de Servicio</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {serviceTypes.map(service => {
                  const ServiceIcon = service.icon
                  return (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedService === service.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ServiceIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {service.estimatedTime}
                            </span>
                            <span className="text-sm font-medium">
                              Desde ${service.basePrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Problem Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Descripción del Problema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">
                  Describe detalladamente el problema *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Ej: La lavadora no centrifuga bien, hace ruido extraño y deja la ropa muy húmeda..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-[100px] mt-2"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Fotos del Problema (Opcional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Sube hasta 3 fotos para ayudar al técnico a entender mejor el
                  problema
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <div className="flex flex-wrap gap-2">
                  {images.map((image, index) => (
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
                  {images.length < 3 && (
                    <label
                      htmlFor="image-upload"
                      className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Programar Visita</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Fecha Preferida *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal mt-2 ${
                          !selectedDate && 'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, 'PPP', { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={date =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time-slot">Horario Preferido *</Label>
                  <Select
                    value={selectedTime}
                    onValueChange={setSelectedTime}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <Label>Prioridad del Servicio</Label>
                <div className="grid gap-2 mt-2">
                  {priorities.map(priority => (
                    <div
                      key={priority.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedPriority === priority.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPriority(priority.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {priority.label}
                            </span>
                            {priority.surcharge > 0 && (
                              <Badge variant="secondary">
                                +${priority.surcharge.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {priority.description}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedPriority === priority.id
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary & Contact */}
        <div className="space-y-6">
          {/* Service Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedServiceData ? (
                <>
                  <div className="flex items-start space-x-3">
                    <selectedServiceData.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">
                        {selectedServiceData.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedServiceData.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Servicio base:</span>
                      <span>
                        ${selectedServiceData.basePrice.toLocaleString()}
                      </span>
                    </div>
                    {selectedPriorityData?.surcharge &&
                      selectedPriorityData.surcharge > 0 && (
                        <div className="flex justify-between">
                          <span>Recargo por urgencia:</span>
                          <span>
                            +${selectedPriorityData.surcharge.toLocaleString()}
                          </span>
                        </div>
                      )}
                    <div className="border-t pt-2 font-medium flex justify-between">
                      <span>Total estimado:</span>
                      <span>${totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>
                      * El costo final puede variar según el diagnóstico del
                      técnico
                    </p>
                    <p>
                      * Tiempo estimado: {selectedServiceData.estimatedTime}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Selecciona un tipo de servicio para ver el resumen
                </p>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Información de Contacto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Nombre</Label>
                <p className="text-sm font-medium mt-1">María García</p>
              </div>
              <div>
                <Label>Teléfono</Label>
                <p className="text-sm font-medium mt-1">+57 300 123 4567</p>
              </div>
              <div>
                <Label>Dirección</Label>
                <p className="text-sm font-medium mt-1">
                  Calle 123 #45-67, Bogotá Norte
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Cambiar Dirección
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting || !selectedService || !selectedDate || !selectedTime
            }
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Enviando Solicitud...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Solicitar Servicio
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Al solicitar el servicio, aceptas nuestros términos y condiciones
          </p>
        </div>
      </form>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">
              ¡Solicitud Enviada!
            </DialogTitle>
            <DialogDescription className="text-center">
              Tu solicitud de servicio ha sido recibida exitosamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium">Número de Solicitud</p>
              <p className="text-2xl font-bold text-primary">
                {serviceRequestNumber}
              </p>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Te contactaremos en las próximas 2 horas</p>
              <p>• Recibirás confirmación por SMS y email</p>
              <p>• Puedes hacer seguimiento en &quot;Mis Servicios&quot;</p>
            </div>
            <Button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
