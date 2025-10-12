/**
 * Dashboard para Técnicos
 * Vista específica para técnicos con sus asignaciones y herramientas
 */

import { Suspense } from 'react'
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
  Wrench,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Navigation,
  Star,
  Calendar,
} from 'lucide-react'

export default function TechnicianDashboard() {
  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Panel de Técnico
          </h2>
          <p className="text-muted-foreground">
            Tus asignaciones y herramientas de trabajo
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Disponible
          </Badge>
          <Badge variant="secondary">Técnico</Badge>
        </div>
      </div>

      {/* Estado Actual */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Hoy</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 completado, 2 pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Estimado
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5h</div>
            <p className="text-xs text-muted-foreforeground">
              Tiempo total restante
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Promedio este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Mes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +8 desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Próximas Asignaciones */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximas Asignaciones</CardTitle>
            <CardDescription>Servicios programados para hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 'ORD-123',
                  cliente: 'María González',
                  tipo: 'Nevera',
                  problema: 'No enfría correctamente',
                  direccion: 'Calle 45 #23-12, Medellín',
                  hora: '10:00 AM',
                  urgencia: 'Alta',
                  telefono: '+57 300 123 4567',
                },
                {
                  id: 'ORD-124',
                  cliente: 'Carlos Pérez',
                  tipo: 'Lavadora',
                  problema: 'No centrifuga',
                  direccion: 'Carrera 70 #34-56, Medellín',
                  hora: '2:00 PM',
                  urgencia: 'Media',
                  telefono: '+57 301 234 5678',
                },
                {
                  id: 'ORD-125',
                  cliente: 'Ana Rodríguez',
                  tipo: 'Aire Acondicionado',
                  problema: 'No enciende',
                  direccion: 'Calle 10 Sur #45-23, Envigado',
                  hora: '4:30 PM',
                  urgencia: 'Baja',
                  telefono: '+57 302 345 6789',
                },
              ].map((service, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{service.id}</h4>
                        <Badge
                          variant="outline"
                          className={
                            service.urgencia === 'Alta'
                              ? 'border-red-200 text-red-700'
                              : service.urgencia === 'Media'
                              ? 'border-orange-200 text-orange-700'
                              : 'border-green-200 text-green-700'
                          }
                        >
                          {service.urgencia}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.cliente}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{service.hora}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.tipo}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Problema:</strong> {service.problema}
                    </p>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        {service.direccion}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="default">
                      <Navigation className="h-4 w-4 mr-1" />
                      Navegar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Llamar
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panel de Control */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Panel de Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado Actual */}
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Disponible</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Listo para el próximo servicio
              </p>
            </div>

            {/* Acciones Rápidas */}
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Horario Completo
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reportar Problema
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Inventario Herramientas
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Mis Estadísticas
              </Button>
            </div>

            {/* Información Adicional */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zona Asignada:</span>
                <span className="font-medium">Medellín Centro</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Especialidades:</span>
                <span className="font-medium">Neveras, Lavadoras</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Último Servicio:</span>
                <span className="font-medium">Hace 2 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
