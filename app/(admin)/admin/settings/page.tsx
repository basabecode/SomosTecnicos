/**
 * Página de Configuración - Panel Admin
 * Configuraciones generales del sistema
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Save,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Estados para las configuraciones
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [autoAssignment, setAutoAssignment] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Configuración guardada',
        description: 'Los cambios se han aplicado correctamente.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Configuración General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configuración General</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  placeholder="SomosTécnicos"
                  defaultValue="SomosTécnicos"
                />
              </div>
              <div>
                <Label htmlFor="support-email">Email de Soporte</Label>
                <Input
                  id="support-email"
                  type="email"
                  placeholder="soporte@somostecnicos.com"
                  defaultValue="soporte@somostecnicos.com"
                />
              </div>
              <div>
                <Label htmlFor="support-phone">Teléfono de Soporte</Label>
                <Input
                  id="support-phone"
                  placeholder="+57 300 123 4567"
                  defaultValue="+57 300 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Input
                  id="timezone"
                  placeholder="America/Bogota"
                  defaultValue="America/Bogota"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company-address">Dirección de la Empresa</Label>
              <Textarea
                id="company-address"
                placeholder="Dirección completa..."
                defaultValue="Calle 123 #45-67, Bogotá, Colombia"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones de órdenes y asignaciones por email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones urgentes por SMS
                </p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Asignación Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Asignar automáticamente órdenes a técnicos disponibles
                </p>
              </div>
              <Switch
                checked={autoAssignment}
                onCheckedChange={setAutoAssignment}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Seguridad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-timeout">
                  Tiempo de Sesión (minutos)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  placeholder="60"
                  defaultValue="60"
                />
              </div>
              <div>
                <Label htmlFor="max-login-attempts">
                  Intentos Máximos de Login
                </Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  placeholder="5"
                  defaultValue="5"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Mantenimiento</Label>
                <p className="text-sm text-muted-foreground">
                  Activar modo mantenimiento para el sistema
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Integraciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maps-api-key">Google Maps API Key</Label>
                <Input
                  id="maps-api-key"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp-token">WhatsApp Business Token</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <Label htmlFor="smtp-server">Servidor SMTP</Label>
                <Input id="smtp-server" placeholder="smtp.gmail.com" />
              </div>
              <div>
                <Label htmlFor="smtp-port">Puerto SMTP</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Base de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Base de Datos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Backup Automático</p>
                <p className="text-sm text-muted-foreground">
                  Último backup: Hace 2 horas
                </p>
              </div>
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Crear Backup
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Limpiar Logs</p>
                <p className="text-sm text-muted-foreground">
                  Eliminar logs antiguos del sistema
                </p>
              </div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
