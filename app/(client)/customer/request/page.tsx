/**
 * Página de Solicitud de Servicio - Portal Cliente
 * Formulario para solicitar nuevos servicios
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
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
  ArrowUp,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

  /* Services data without basePrice */
  const serviceTypes = [
    {
      id: 'reparacion_lavadora',
      name: 'Reparación Lavadora',
      icon: Droplets,
      description: 'Problemas de lavado, centrifugado, drenaje',
      estimatedTime: '2-3 horas',
      applianceType: 'lavadora',
      serviceType: 'reparacion'
    },
    {
      id: 'reparacion_refrigerador',
      name: 'Reparación Refrigerador',
      icon: Snowflake,
      description: 'No enfría, ruidos extraños, fugas',
      estimatedTime: '2-4 horas',
      applianceType: 'nevera',
      serviceType: 'reparacion'
    },
    {
      id: 'mantenimiento_aire',
      name: 'Aire Acondicionado',
      icon: Snowflake,
      description: 'Mantenimiento, reparación, instalación',
      estimatedTime: '1.5-3 horas',
      applianceType: 'aire_acondicionado',
      serviceType: 'mantenimiento'
    },
    {
      id: 'reparacion_horno',
      name: 'Reparación Horno',
      icon: Flame,
      description: 'Problemas de calentamiento, timer',
      estimatedTime: '1.5-2.5 horas',
      applianceType: 'horno',
      serviceType: 'reparacion'
    },
    {
      id: 'reparacion_microondas',
      name: 'Reparación Microondas',
      icon: Zap,
      description: 'No calienta, problemas eléctricos',
      estimatedTime: '1-2 horas',
      applianceType: 'microondas',
      serviceType: 'reparacion'
    },
    {
      id: 'instalacion_lavaplatos',
      name: 'Lavaplatos',
      icon: Droplets,
      description: 'Instalación, reparación, mantenimiento',
      estimatedTime: '2-3 horas',
      applianceType: 'lavavajillas',
      serviceType: 'instalacion'
    },
    {
      id: 'otros_servicios',
      name: 'Otros Electrodomésticos',
      icon: Settings,
      description: 'Otros aparatos del hogar',
      estimatedTime: '1.5-3 horas',
      applianceType: 'otros',
      serviceType: 'diagnostico'
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
    { id: 'baja', label: 'Baja', description: 'No es urgente', surcharge: 0 },
    {
      id: 'media',
      label: 'Media',
      description: 'Moderadamente urgente',
      surcharge: 0,
    },
    { id: 'alta', label: 'Alta', description: 'Urgente', surcharge: 0 }, // Removed surcharge
  ]

  export default function RequestServicePage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [selectedService, setSelectedService] = useState('')
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState('')
    const [selectedPriority, setSelectedPriority] = useState('media')

    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [serviceRequestNumber, setServiceRequestNumber] = useState('')

    const selectedServiceData = serviceTypes.find(s => s.id === selectedService)

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

      try {
        const token = localStorage.getItem('accessToken')

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            // Información del Cliente
            nombre: user?.nombre || 'Cliente',
            telefono: user?.telefono || '',
            email: user?.email || '',
            direccion: user?.direccion || '',
            ciudad: user?.ciudad || '',
            customerId: user?.id,

            // Información del Electrodoméstico y Servicio
            tipoElectrodomestico: selectedServiceData?.applianceType || 'otros',
            tipoServicio: selectedServiceData?.serviceType || 'diagnostico',
            descripcionProblema: description,
            urgencia: selectedPriority,

            // Programación
            fechaPreferida: selectedDate?.toISOString(),
            horario: selectedTime,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al crear la solicitud')
        }

        setServiceRequestNumber(data.data.orderNumber)
        setIsSuccessModalOpen(true)

        // Reset form
        setSelectedService('')
        setSelectedDate(undefined)
        setSelectedTime('')
        setSelectedPriority('medium')
        setDescription('')

      } catch (error) {
        console.error('Error submitting order:', error)
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'No se pudo enviar la solicitud. Intenta nuevamente.',
          variant: 'destructive',
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
              Solicitar Servicio
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
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
                        className={`native-card p-5 cursor-pointer transition-all duration-200 active-tap ${
                          selectedService === service.id
                            ? 'ring-2 ring-primary bg-primary/5 shadow-md scale-[1.02]'
                            : 'border border-gray-100 hover:border-primary/30'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                               selectedService === service.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                          }`}>
                            <ServiceIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold transition-colors ${selectedService === service.id ? 'text-primary' : 'text-gray-900'}`}>
                                {service.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <Badge variant="secondary" className="bg-gray-50 text-[10px] h-5">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.estimatedTime}
                              </Badge>
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
                    className="min-h-25 mt-2"
                    required
                  />
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

                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-3">
                         <div className="bg-blue-100 p-2 rounded-full">
                           <FileText className="w-4 h-4 text-blue-600" />
                         </div>
                         <div>
                           <p className="text-sm font-semibold text-gray-900">Costo de la Visita</p>
                           <p className="text-sm text-gray-600 mt-1">
                             Las revisiones dentro de la ciudad tienen un costo de <span className="font-bold text-primary">$50.000 COP</span>
                           </p>
                         </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>
                        * El costo final puede variar según el diagnóstico y repuestos necesarios.
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
                  <p className="text-sm font-medium mt-1">{user?.nombre} {user?.apellido}</p>
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <p className="text-sm font-medium mt-1">{user?.telefono || 'No registrado'}</p>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <p className="text-sm font-medium mt-1">
                    {user?.direccion || 'No registrada'}
                  </p>
                </div>
                <div>
                  <Label>Ciudad</Label>
                  <p className="text-sm font-medium mt-1">
                    {user?.ciudad || 'No registrada'}
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
              className="w-full h-14 text-lg font-bold rounded-2xl active-tap bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
              disabled={
                isSubmitting || !selectedService || !selectedDate || !selectedTime
              }
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-5 h-5 mr-3 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Solicitar Visita Ahora
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Al solicitar el servicio, aceptas nuestros términos y condiciones
            </p>
          </div>
        </form>

        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>

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
