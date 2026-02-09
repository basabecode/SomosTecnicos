/**
 * Página de Configuraciones - Panel Técnico
 * Configuraciones personales para técnicos
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
  User,
  Bell,
  MapPin,
  Clock,
  Shield,
  Smartphone,
  Settings,
  FileText,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function TechnicianSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // Personal Information
    name: 'Juan Pérez',
    email: 'juan@somostecnicos.com',
    phone: '+57 300 123 4567',
    address: 'Calle 123 #45-67, Bogotá',
    emergencyContact: '+57 300 987 6543',

    // Work Preferences
    specialties: ['Electrodomésticos', 'Aires Acondicionados'],
    preferredArea: 'Norte de Bogotá',
    maxJobsPerDay: '6',
    workingHoursStart: '08:00',
    workingHoursEnd: '17:00',

    // Notifications
    jobNotifications: true,
    emergencyNotifications: true,
    reminderNotifications: true,
    promotionalNotifications: false,

    // App Preferences
    darkMode: false,
    autoSync: true,
    offlineMode: false,
  })

  const handleSave = (section: string) => {
    toast({
      title: 'Configuración guardada',
      description: `Los cambios en ${section} han sido guardados exitosamente.`,
    })
  }

  const specialtyOptions = [
    'Electrodomésticos',
    'Aires Acondicionados',
    'Refrigeradores',
    'Lavadoras',
    'Hornos',
    'Microondas',
    'Lavaplatos',
    'Secadoras',
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Configuraciones</h2>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Información Personal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                <Input
                  id="emergencyContact"
                  value={settings.emergencyContact}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      emergencyContact: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>

            <Button onClick={() => handleSave('Información Personal')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Work Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Preferencias de Trabajo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {specialtyOptions.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={specialty}
                      checked={settings.specialties.includes(specialty)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSettings(prev => ({
                            ...prev,
                            specialties: [...prev.specialties, specialty],
                          }))
                        } else {
                          setSettings(prev => ({
                            ...prev,
                            specialties: prev.specialties.filter(
                              s => s !== specialty
                            ),
                          }))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={specialty} className="text-sm">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preferredArea">Área preferida</Label>
                <Select
                  value={settings.preferredArea}
                  onValueChange={value =>
                    setSettings(prev => ({
                      ...prev,
                      preferredArea: value,
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
              <div className="space-y-2">
                <Label htmlFor="maxJobs">Máximo trabajos por día</Label>
                <Input
                  id="maxJobs"
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxJobsPerDay}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      maxJobsPerDay: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

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

            <Button onClick={() => handleSave('Preferencias de Trabajo')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
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
                  <Label>Notificaciones de trabajos</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones cuando se asignen nuevos trabajos
                  </p>
                </div>
                <Switch
                  checked={settings.jobNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      jobNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de emergencia</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones para trabajos urgentes
                  </p>
                </div>
                <Switch
                  checked={settings.emergencyNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      emergencyNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir recordatorios de citas próximas
                  </p>
                </div>
                <Switch
                  checked={settings.reminderNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      reminderNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones promocionales</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir información sobre promociones y noticias
                  </p>
                </div>
                <Switch
                  checked={settings.promotionalNotifications}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      promotionalNotifications: checked,
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

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Preferencias de la App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Usar tema oscuro en la aplicación
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      darkMode: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronización automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar datos automáticamente con el servidor
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      autoSync: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo sin conexión</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir trabajo sin conexión a internet (funcionalidad
                    limitada)
                  </p>
                </div>
                <Switch
                  checked={settings.offlineMode}
                  onCheckedChange={checked =>
                    setSettings(prev => ({
                      ...prev,
                      offlineMode: checked,
                    }))
                  }
                />
              </div>
            </div>

            <Button onClick={() => handleSave('Preferencias de la App')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacidad y Seguridad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Opciones de ubicación y tracking eliminadas - no se usarán en el proyecto */}
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Cambiar contraseña</h4>
                <p className="text-sm text-muted-foreground">
                  Para cambiar tu contraseña, contacta al administrador del
                  sistema.
                </p>
                <Button variant="outline">
                  Solicitar cambio de contraseña
                </Button>
              </div>
            </div>

            <Button onClick={() => handleSave('Privacidad y Seguridad')}>
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Help and Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Ayuda y Soporte</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline">Manual de Usuario</Button>
                <Button variant="outline">Contactar Soporte</Button>
                <Button variant="outline">Reportar Problema</Button>
                <Button variant="outline">Términos y Condiciones</Button>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Versión de la app:</strong> 2.1.0
                  </p>
                  <p>
                    <strong>Última actualización:</strong> 15 de enero, 2024
                  </p>
                  <p>
                    <strong>Soporte técnico:</strong> soporte@somostecnicos.com
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
