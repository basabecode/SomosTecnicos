/**
 * Página de Configuración - Panel Admin
 * Datos reales desde BD (SystemSetting + AdminUser), guardado funcional,
 * cambio de contraseña e información personal.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Save,
  RefreshCw,
  User,
  Lock,
  Loader2,
  Database,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SystemSettings {
  company_name: string
  support_email: string
  support_phone: string
  company_address: string
  timezone: string
  email_notifications: string
  sms_notifications: string
  auto_assignment: string
  session_timeout: string
  max_login_attempts: string
  maintenance_mode: string
  maps_api_key: string
  whatsapp_token: string
  smtp_server: string
  smtp_port: string
}

interface AdminProfile {
  nombre: string
  apellido: string
  telefono: string
  email: string
  username: string
  role: string
}

// ─── Helper fetch ─────────────────────────────────────────────────────────────

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = document.cookie
    .split('; ')
    .find(r => r.startsWith('auth-token='))
    ?.split('=')[1]

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  return fetch(url, { ...options, headers })
}

const DEFAULT_SETTINGS: SystemSettings = {
  company_name: 'SomosTécnicos',
  support_email: 'soporte@somostecnicos.com',
  support_phone: '+57 300 123 4567',
  company_address: 'Calle 123 #45-67, Bogotá, Colombia',
  timezone: 'America/Bogota',
  email_notifications: 'true',
  sms_notifications: 'false',
  auto_assignment: 'true',
  session_timeout: '60',
  max_login_attempts: '5',
  maintenance_mode: 'false',
  maps_api_key: '',
  whatsapp_token: '',
  smtp_server: 'smtp.gmail.com',
  smtp_port: '587',
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AdminSettings() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [savingSystem, setSavingSystem] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Configuraciones del sistema
  const [sysSettings, setSysSettings] = useState<SystemSettings>(DEFAULT_SETTINGS)

  // Perfil del admin
  const [profile, setProfile] = useState<AdminProfile>({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    username: '',
    role: '',
  })

  // Modal cambiar contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // ─── Cargar datos ────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [settingsRes, profileRes] = await Promise.all([
        apiFetch('/api/admin/settings'),
        apiFetch('/api/auth/me'),
      ])

      if (settingsRes.ok) {
        const json = await settingsRes.json()
        if (json.success && json.data) {
          setSysSettings(prev => ({ ...prev, ...json.data }))
        }
      }

      if (profileRes.ok) {
        const json = await profileRes.json()
        if (json.success && json.data) {
          const d = json.data
          setProfile({
            nombre: d.nombre ?? '',
            apellido: d.apellido ?? '',
            telefono: d.telefono ?? '',
            email: d.email ?? '',
            username: d.username ?? '',
            role: d.role ?? '',
          })
        }
      }
    } catch {
      // sin conexión
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ─── Helpers booleanos ────────────────────────────────────────────────────────

  const getBool = (key: keyof SystemSettings) => sysSettings[key] === 'true'
  const setBool = (key: keyof SystemSettings, val: boolean) =>
    setSysSettings(prev => ({ ...prev, [key]: val ? 'true' : 'false' }))

  // ─── Guardar configuraciones del sistema ─────────────────────────────────────

  const handleSaveSystem = async () => {
    setSavingSystem(true)
    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(sysSettings),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Configuración guardada', description: 'Los cambios se han aplicado correctamente.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar la configuración', variant: 'destructive' })
    } finally {
      setSavingSystem(false)
    }
  }

  // ─── Guardar perfil del admin ────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    if (!profile.nombre.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido', variant: 'destructive' })
      return
    }
    setSavingProfile(true)
    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({
          nombre: profile.nombre,
          apellido: profile.apellido,
          telefono: profile.telefono,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Perfil actualizado', description: 'Tu información personal fue guardada correctamente.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar el perfil', variant: 'destructive' })
    } finally {
      setSavingProfile(false)
    }
  }

  // ─── Cambiar contraseña ──────────────────────────────────────────────────────

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({ title: 'Error', description: 'Todos los campos son requeridos', variant: 'destructive' })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: 'Error', description: 'Las contraseñas nuevas no coinciden', variant: 'destructive' })
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast({ title: 'Error', description: 'La contraseña debe tener al menos 8 caracteres', variant: 'destructive' })
      return
    }

    setChangingPassword(true)
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordForm),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Contraseña actualizada', description: 'Tu contraseña fue cambiada correctamente.' })
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo cambiar la contraseña', variant: 'destructive' })
    } finally {
      setChangingPassword(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-3 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Configuración</h2>
        <Button onClick={handleSaveSystem} disabled={savingSystem} size="sm">
          {savingSystem
            ? <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
            : <Save className="w-3.5 h-3.5 mr-2" />}
          Guardar configuración del sistema
        </Button>
      </div>

      <div className="space-y-6">
        {/* ── Información Personal del Admin ──────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Mi Información Personal
            </CardTitle>
            <CardDescription>Actualiza tus datos de administrador</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="admin-nombre">Nombre *</Label>
                <Input
                  id="admin-nombre"
                  value={profile.nombre}
                  onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="admin-apellido">Apellido</Label>
                <Input
                  id="admin-apellido"
                  value={profile.apellido}
                  onChange={e => setProfile(p => ({ ...p, apellido: e.target.value }))}
                  placeholder="Tu apellido"
                />
              </div>
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" value={profile.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
              </div>
              <div>
                <Label htmlFor="admin-phone">Teléfono</Label>
                <Input
                  id="admin-phone"
                  value={profile.telefono}
                  onChange={e => setProfile(p => ({ ...p, telefono: e.target.value }))}
                  placeholder="+57 300 000 0000"
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSaveProfile} disabled={savingProfile} variant="outline">
                {savingProfile
                  ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  : <Save className="w-4 h-4 mr-2" />}
                Guardar información personal
              </Button>
              <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                <Lock className="w-4 h-4 mr-2" />
                Cambiar contraseña
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Configuración General ──────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración General
            </CardTitle>
            <CardDescription>Parámetros generales de la empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  value={sysSettings.company_name}
                  onChange={e => setSysSettings(p => ({ ...p, company_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="support-email">Email de Soporte</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={sysSettings.support_email}
                  onChange={e => setSysSettings(p => ({ ...p, support_email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="support-phone">Teléfono de Soporte</Label>
                <Input
                  id="support-phone"
                  value={sysSettings.support_phone}
                  onChange={e => setSysSettings(p => ({ ...p, support_phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Input
                  id="timezone"
                  value={sysSettings.timezone}
                  onChange={e => setSysSettings(p => ({ ...p, timezone: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company-address">Dirección de la Empresa</Label>
              <Textarea
                id="company-address"
                value={sysSettings.company_address}
                onChange={e => setSysSettings(p => ({ ...p, company_address: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Notificaciones ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones del Sistema
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
                checked={getBool('email_notifications')}
                onCheckedChange={v => setBool('email_notifications', v)}
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
                checked={getBool('sms_notifications')}
                onCheckedChange={v => setBool('sms_notifications', v)}
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
                checked={getBool('auto_assignment')}
                onCheckedChange={v => setBool('auto_assignment', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Seguridad ──────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  min="5"
                  max="480"
                  value={sysSettings.session_timeout}
                  onChange={e => setSysSettings(p => ({ ...p, session_timeout: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="max-login-attempts">Intentos Máximos de Login</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  min="1"
                  max="10"
                  value={sysSettings.max_login_attempts}
                  onChange={e => setSysSettings(p => ({ ...p, max_login_attempts: e.target.value }))}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Mantenimiento</Label>
                <p className="text-sm text-muted-foreground">
                  Activar modo mantenimiento bloquea el acceso a usuarios no administradores
                </p>
              </div>
              <Switch
                checked={getBool('maintenance_mode')}
                onCheckedChange={v => setBool('maintenance_mode', v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Integraciones ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Integraciones
            </CardTitle>
            <CardDescription>Claves de APIs externas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maps-api-key">Google Maps API Key</Label>
                <Input
                  id="maps-api-key"
                  type="password"
                  value={sysSettings.maps_api_key}
                  onChange={e => setSysSettings(p => ({ ...p, maps_api_key: e.target.value }))}
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp-token">WhatsApp Business Token</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  value={sysSettings.whatsapp_token}
                  onChange={e => setSysSettings(p => ({ ...p, whatsapp_token: e.target.value }))}
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <Label htmlFor="smtp-server">Servidor SMTP</Label>
                <Input
                  id="smtp-server"
                  value={sysSettings.smtp_server}
                  onChange={e => setSysSettings(p => ({ ...p, smtp_server: e.target.value }))}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="smtp-port">Puerto SMTP</Label>
                <Input
                  id="smtp-port"
                  value={sysSettings.smtp_port}
                  onChange={e => setSysSettings(p => ({ ...p, smtp_port: e.target.value }))}
                  placeholder="587"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Base de Datos ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Backup Automático</p>
                <p className="text-sm text-muted-foreground">
                  Genera un backup de la base de datos
                </p>
              </div>
              <Button variant="outline" disabled>
                <Database className="w-4 h-4 mr-2" />
                Crear Backup
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Limpiar Logs</p>
                <p className="text-sm text-muted-foreground">
                  Eliminar logs anteriores a 90 días
                </p>
              </div>
              <Button variant="outline" disabled>
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botón guardar al final */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSystem} disabled={savingSystem}>
            {savingSystem
              ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              : <Save className="w-4 h-4 mr-2" />}
            Guardar toda la configuración
          </Button>
        </div>
      </div>

      {/* ── Modal Cambiar Contraseña ─────────────────────────────────────────── */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña actual y la nueva. Mínimo 8 caracteres.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Contraseña actual</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                placeholder="Tu contraseña actual"
              />
            </div>
            <div className="space-y-2">
              <Label>Nueva contraseña</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar nueva contraseña</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repite la nueva contraseña"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Actualizar contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
