/**
 * Dashboard para Manager/Admin
 * Vista específica para administradores con funciones de coordinación
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
import {
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Clock,
} from 'lucide-react'

export default function ManagerDashboard() {
  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Panel de Manager
          </h2>
          <p className="text-muted-foreground">
            Vista de coordinación y supervisión de técnicos
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Manager
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Técnicos Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asignaciones Hoy
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 completadas, 5 pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +5% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              -0.3h desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Técnicos en Campo */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Técnicos en Campo</CardTitle>
            <CardDescription>
              Estado actual de los técnicos activos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Juan Pérez',
                  status: 'En servicio',
                  location: 'Medellín Centro',
                  time: '2h 30m',
                },
                {
                  name: 'María García',
                  status: 'Disponible',
                  location: 'Poblado',
                  time: '-',
                },
                {
                  name: 'Carlos López',
                  status: 'En servicio',
                  location: 'Envigado',
                  time: '1h 15m',
                },
                {
                  name: 'Ana Rodríguez',
                  status: 'En tránsito',
                  location: 'Bello',
                  time: '20m',
                },
              ].map((tech, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tech.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        tech.status === 'Disponible' ? 'default' : 'secondary'
                      }
                      className={
                        tech.status === 'Disponible'
                          ? 'bg-green-100 text-green-800'
                          : tech.status === 'En servicio'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }
                    >
                      {tech.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {tech.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Gestionar Técnicos</p>
                    <p className="text-xs text-muted-foreground">
                      Ver y asignar técnicos
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Programar Servicios</p>
                    <p className="text-xs text-muted-foreground">
                      Coordinar horarios
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Reportes</p>
                    <p className="text-xs text-muted-foreground">
                      Ver estadísticas
                    </p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Configuración</p>
                    <p className="text-xs text-muted-foreground">
                      Ajustes del equipo
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
