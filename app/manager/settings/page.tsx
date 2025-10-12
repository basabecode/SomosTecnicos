/**
 * Página de Configuraciones - Panel Manager
 * Configuraciones específicas para managers
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings,
  Bell,
  Users,
  Clock,
  MapPin,
  Shield,
  Calendar,
  Mail,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ManagerSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Team Management
    maxAssignmentsPerTechnician: '5',
    autoAssignOrders: false,
    requireApprovalForUrgent: true,

    // Notifications
    emailNotifications: true,
    assignmentNotifications: true,
    completionNotifications: false,
    overdueNotifications: true,

    // Working Hours
    workingHoursStart: '08:00',
    workingHoursEnd: '18:00',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],

    // Service Areas
    defaultServiceArea: 'Norte de Bogotá',
    maxTravelTime: '45',

    // Performance
    targetCompletionTime: '2.0',
    minimumRating: '4.0',
  })

  const handleSave = (section: string) => {
    toast({
      title: 'Configuración guardada',
      description: `Los cambios en ${section} han sido guardados exitosamente.`,
    })
  }

  const workingDaysOptions = [
    { id: 'monday', label: 'Lunes' },
    { id: 'tuesday', label: 'Martes' },
    { id: 'wednesday', label: 'Miércoles' },
    { id: 'thursday', label: 'Jueves' },
    { id: 'friday', label: 'Viernes' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuraciones</h2>
      </div>

      <div className="grid gap-6">
        {/* Team Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Gestión del Equipo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxAssignments">
                  Máximo asignaciones por técnico
                </Label>
                <Input
                  id="maxAssignments"
                  type="number"
                  value={settings.maxAssignmentsPerTechnician}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      maxAssignmentsPerTechnician: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTravelTime">
                  Tiempo máximo de viaje (minutos)
                </Label>
                <Input
                  id="maxTravelTime"
                  type="number"
                  value={settings.maxTravelTime}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      maxTravelTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Asignación automática de órdenes</Label>
                  <p className="text-sm text-muted-foreground">
                    Asignar automáticamente órdenes a técnicos disponibles
                  </p>
                </div>
                <Switch
                  checked={settings.autoAssignOrders}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      autoAssignOrders: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Requerir aprobación para órdenes urgentes</Label>
                  <p className="text-sm text-muted-foreground">
                    Las órdenes urgentes requieren tu aprobación antes de
                    asignar
                  </p>
                </div>
                <Switch
                  checked={settings.requireApprovalForUrgent}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      requireApprovalForUrgent: checked,
                    }))
                  }
                />
              </div>
            </div>

            <Button onClick={() => handleSave('Gestión del Equipo')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones importantes por correo electrónico
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nuevas asignaciones</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando se creen nuevas asignaciones
                  </p>
                </div>
                <Switch
                  checked={settings.assignmentNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      assignmentNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Órdenes completadas</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando los técnicos completen órdenes
                  </p>
                </div>
                <Switch
                  checked={settings.completionNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      completionNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Órdenes vencidas</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar sobre órdenes que excedan el tiempo estimado
                  </p>
                </div>
                <Switch
                  checked={settings.overdueNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      overdueNotifications: checked,
                    }))
                  }
                />
              </div>
            </div>

            <Button onClick={() => handleSave('Notificaciones')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Horarios de Trabajo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora de inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.workingHoursStart}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      workingHoursStart: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora de finalización</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.workingHoursEnd}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      workingHoursEnd: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Días de trabajo</Label>
              <div className="grid grid-cols-4 gap-2">
                {workingDaysOptions.map(day => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={day.id}
                      checked={settings.workingDays.includes(day.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSettings(prev => ({
                            ...prev,
                            workingDays: [...prev.workingDays, day.id],
                          }))
                        } else {
                          setSettings(prev => ({
                            ...prev,
                            workingDays: prev.workingDays.filter(
                              d => d !== day.id
                            ),
                          }))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={day.id} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => handleSave('Horarios de Trabajo')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Service Area Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Área de Servicio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceArea">Área de servicio por defecto</Label>
              <Select
                value={settings.defaultServiceArea}
                onValueChange={value =>
                  setSettings(prev => ({
                    ...prev,
                    defaultServiceArea: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Norte de Bogotá">
                    Norte de Bogotá
                  </SelectItem>
                  <SelectItem value="Sur de Bogotá">Sur de Bogotá</SelectItem>
                  <SelectItem value="Centro de Bogotá">
                    Centro de Bogotá
                  </SelectItem>
                  <SelectItem value="Occidente de Bogotá">
                    Occidente de Bogotá
                  </SelectItem>
                  <SelectItem value="Oriente de Bogotá">
                    Oriente de Bogotá
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => handleSave('Área de Servicio')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Performance Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Objetivos de Rendimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetTime">
                  Tiempo objetivo de completación (horas)
                </Label>
                <Input
                  id="targetTime"
                  type="number"
                  step="0.1"
                  value={settings.targetCompletionTime}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      targetCompletionTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minRating">Calificación mínima aceptable</Label>
                <Input
                  id="minRating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={settings.minimumRating}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      minimumRating: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <Button onClick={() => handleSave('Objetivos de Rendimiento')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
