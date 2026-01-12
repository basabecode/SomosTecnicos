'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Mail,
  Phone,
  Shield,
  Eye,
  Globe,
  Palette,
  Clock,
  Save,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
} from 'lucide-react'

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  serviceUpdates: boolean
  promotions: boolean
  reminders: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  shareDataWithPartners: boolean
  allowAnalytics: boolean
}

export default function CustomerSettings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    serviceUpdates: true,
    promotions: false,
    reminders: true,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    shareDataWithPartners: false,
    allowAnalytics: true,
  })

  const [language, setLanguage] = useState('es')
  const [timezone, setTimezone] = useState('America/Bogota')
  const [theme, setTheme] = useState('light')

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePrivacyChange = (
    key: keyof PrivacySettings,
    value: boolean | string
  ) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // Aquí se guardarían las configuraciones
    console.log('Guardando configuraciones:', {
      notifications,
      privacy,
      language,
      timezone,
      theme,
    })
  }

  const handleExportData = () => {
    // Lógica para exportar datos del usuario
    console.log('Exportando datos del usuario...')
  }

  const handleDeleteAccount = () => {
    // Lógica para eliminar cuenta (con confirmación)
    console.log('Iniciando proceso de eliminación de cuenta...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Personaliza tu experiencia y gestiona tu privacidad
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>
              Controla cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">
                  Notificaciones por Email
                </Label>
                <p className="text-sm text-gray-600">
                  Recibir actualizaciones por correo electrónico
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={value =>
                  handleNotificationChange('emailNotifications', value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">Notificaciones SMS</Label>
                <p className="text-sm text-gray-600">
                  Recibir mensajes de texto importantes
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={notifications.smsNotifications}
                onCheckedChange={value =>
                  handleNotificationChange('smsNotifications', value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Notificaciones Push</Label>
                <p className="text-sm text-gray-600">
                  Recibir notificaciones en el navegador
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={value =>
                  handleNotificationChange('pushNotifications', value)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="service-updates">
                  Actualizaciones de Servicio
                </Label>
                <p className="text-sm text-gray-600">
                  Notificaciones sobre el estado de tus servicios
                </p>
              </div>
              <Switch
                id="service-updates"
                checked={notifications.serviceUpdates}
                onCheckedChange={value =>
                  handleNotificationChange('serviceUpdates', value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="promotions">Promociones y Ofertas</Label>
                <p className="text-sm text-gray-600">
                  Recibir información sobre descuentos
                </p>
              </div>
              <Switch
                id="promotions"
                checked={notifications.promotions}
                onCheckedChange={value =>
                  handleNotificationChange('promotions', value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders">Recordatorios</Label>
                <p className="text-sm text-gray-600">
                  Recordatorios de citas y mantenimiento
                </p>
              </div>
              <Switch
                id="reminders"
                checked={notifications.reminders}
                onCheckedChange={value =>
                  handleNotificationChange('reminders', value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacidad y Seguridad</CardTitle>
            </div>
            <CardDescription>
              Controla tu privacidad y la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profile-visibility">Visibilidad del Perfil</Label>
              <Select
                value={privacy.profileVisibility}
                onValueChange={(value: 'public' | 'private') =>
                  handlePrivacyChange('profileVisibility', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                Controla quién puede ver tu información básica
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compartir Datos con Socios</Label>
                <p className="text-sm text-gray-600">
                  Permitir compartir datos para mejorar servicios
                </p>
              </div>
              <Switch
                checked={privacy.shareDataWithPartners}
                onCheckedChange={value =>
                  handlePrivacyChange('shareDataWithPartners', value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Analytics</Label>
                <p className="text-sm text-gray-600">
                  Ayudar a mejorar la plataforma con datos anónimos
                </p>
              </div>
              <Switch
                checked={privacy.allowAnalytics}
                onCheckedChange={value =>
                  handlePrivacyChange('allowAnalytics', value)
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Seguridad de la Cuenta</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Configurar 2FA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Sesiones Activas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Preferencias</CardTitle>
            </div>
            <CardDescription>
              Personaliza la apariencia y comportamiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Caracas">
                    Caracas (GMT-4)
                  </SelectItem>
                  <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <CardTitle>Gestión de Datos</CardTitle>
            </div>
            <CardDescription>Controla tus datos personales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Mis Datos
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Importar Configuración
            </Button>

            <Separator />

            <div className="space-y-2">
              <Label className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Zona Peligrosa
              </Label>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta
              </Button>
              <p className="text-xs text-gray-600">
                Esta acción no se puede deshacer. Todos tus datos serán
                eliminados permanentemente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Guardar Configuración</h3>
              <p className="text-sm text-gray-600">
                Los cambios se aplicarán inmediatamente
              </p>
            </div>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
