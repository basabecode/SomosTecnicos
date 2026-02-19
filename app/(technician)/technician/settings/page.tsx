/**
 * Página de Configuraciones - Panel Técnico
 * Datos reales desde BD, guardado funcional, cambio de contraseña, eliminar cuenta
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Bell,
  Shield,
  Smartphone,
  Globe,
  Lock,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface TechProfile {
  nombre: string
  apellido: string
  telefono: string
  ciudad: string
  email: string
  cedula: string
  especialidades: string[]
  zonaTrabajoArea: string
  idioma: string
}

interface NotifPrefs {
  trabajos: boolean
  emergencias: boolean
  recordatorios: boolean
  promocionales: boolean
}

interface AppPrefs {
  modoOscuro: boolean
  autoSync: boolean
  offlineMode: boolean
}

const SPECIALTY_OPTIONS = [
  'Electrodomésticos',
  'Aires Acondicionados',
  'Refrigeradores',
  'Lavadoras',
  'Hornos',
  'Microondas',
  'Lavaplatos',
  'Secadoras',
]

const AREA_OPTIONS = [
  'Norte de Bogotá',
  'Sur de Bogotá',
  'Centro de Bogotá',
  'Occidente de Bogotá',
  'Oriente de Bogotá',
]

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

// ─── Componente ───────────────────────────────────────────────────────────────

export default function TechnicianSettingsPage() {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingNotif, setSavingNotif] = useState(false)
  const [savingApp, setSavingApp] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  const [profile, setProfile] = useState<TechProfile>({
    nombre: '',
    apellido: '',
    telefono: '',
    ciudad: '',
    email: '',
    cedula: '',
    especialidades: [],
    zonaTrabajoArea: '',
    idioma: 'es',
  })

  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    trabajos: true,
    emergencias: true,
    recordatorios: true,
    promocionales: false,
  })

  const [appPrefs, setAppPrefs] = useState<AppPrefs>({
    modoOscuro: false,
    autoSync: true,
    offlineMode: false,
  })

  // Modal cambiar contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Modal eliminar cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  // ─── Cargar datos ────────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    try {
      const res = await apiFetch('/api/technicians/me/profile')
      if (!res.ok) return
      const json = await res.json()
      if (!json.success) return

      const d = json.data
      setProfile({
        nombre: d.nombre ?? '',
        apellido: d.apellido ?? '',
        telefono: d.telefono ?? '',
        ciudad: d.ciudad ?? '',
        email: d.email ?? '',
        cedula: d.cedula ?? '',
        especialidades: Array.isArray(d.especialidades) ? d.especialidades : [],
        zonaTrabajoArea: d.zonaTrabajoArea ?? '',
        idioma: d.idioma ?? 'es',
      })

      const prefs = (d.preferencias as Record<string, any>) ?? {}
      if (prefs.notificaciones) {
        setNotifPrefs(prev => ({ ...prev, ...prefs.notificaciones }))
      }
      if (prefs.app) {
        setAppPrefs(prev => ({ ...prev, ...prefs.app }))
      }
    } catch {
      // sin conexión
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // ─── Guardar información personal ────────────────────────────────────────────

  const handleSaveProfile = async () => {
    if (!profile.nombre.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido', variant: 'destructive' })
      return
    }
    setSavingProfile(true)
    try {
      const res = await apiFetch('/api/technicians/me/profile', {
        method: 'PUT',
        body: JSON.stringify({
          nombre: profile.nombre,
          apellido: profile.apellido,
          telefono: profile.telefono,
          ciudad: profile.ciudad,
          especialidades: profile.especialidades,
          zonaTrabajoArea: profile.zonaTrabajoArea,
          idioma: profile.idioma,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Perfil actualizado', description: 'Tu información personal fue guardada correctamente.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar', variant: 'destructive' })
    } finally {
      setSavingProfile(false)
    }
  }

  // ─── Guardar notificaciones ──────────────────────────────────────────────────

  const handleSaveNotifications = async () => {
    setSavingNotif(true)
    try {
      const res = await apiFetch('/api/technicians/me/profile', {
        method: 'PUT',
        body: JSON.stringify({
          preferencias: { notificaciones: notifPrefs, app: appPrefs },
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Notificaciones guardadas', description: 'Tus preferencias de notificación fueron actualizadas.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar', variant: 'destructive' })
    } finally {
      setSavingNotif(false)
    }
  }

  // ─── Guardar preferencias de app ─────────────────────────────────────────────

  const handleSaveAppPrefs = async () => {
    setSavingApp(true)
    try {
      const res = await apiFetch('/api/technicians/me/profile', {
        method: 'PUT',
        body: JSON.stringify({
          preferencias: { notificaciones: notifPrefs, app: appPrefs },
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Preferencias guardadas', description: 'Las preferencias de la app fueron actualizadas.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar', variant: 'destructive' })
    } finally {
      setSavingApp(false)
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

  // ─── Eliminar cuenta ─────────────────────────────────────────────────────────

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({ title: 'Error', description: 'Ingresa tu contraseña para confirmar', variant: 'destructive' })
      return
    }
    setDeletingAccount(true)
    try {
      const res = await apiFetch('/api/technicians/me/account', {
        method: 'DELETE',
        body: JSON.stringify({ password: deletePassword }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Cuenta desactivada', description: 'Tu cuenta ha sido desactivada. Serás redirigido.' })
      setTimeout(() => { window.location.href = '/login' }, 2000)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo eliminar la cuenta', variant: 'destructive' })
    } finally {
      setDeletingAccount(false)
    }
  }

  const toggleSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(specialty)
        ? prev.especialidades.filter(s => s !== specialty)
        : [...prev.especialidades, specialty],
    }))
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
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Configuraciones</h2>

      {/* ── Información Personal ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
          </CardTitle>
          <CardDescription>Actualiza tus datos de contacto. Los cambios se guardan en la base de datos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                value={profile.nombre}
                onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={profile.apellido}
                onChange={e => setProfile(p => ({ ...p, apellido: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" value={profile.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">El email no se puede cambiar</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={profile.telefono}
                onChange={e => setProfile(p => ({ ...p, telefono: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={profile.ciudad}
                onChange={e => setProfile(p => ({ ...p, ciudad: e.target.value }))}
                placeholder="Bogotá"
              />
            </div>
            <div className="space-y-2">
              <Label>Zona de trabajo preferida</Label>
              <Select
                value={profile.zonaTrabajoArea}
                onValueChange={v => setProfile(p => ({ ...p, zonaTrabajoArea: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una zona" />
                </SelectTrigger>
                <SelectContent>
                  {AREA_OPTIONS.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SPECIALTY_OPTIONS.map(specialty => (
                <div key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`spec-${specialty}`}
                    checked={profile.especialidades.includes(specialty)}
                    onChange={() => toggleSpecialty(specialty)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`spec-${specialty}`} className="text-sm font-normal cursor-pointer">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Idioma preferido</Label>
            <Select
              value={profile.idioma}
              onValueChange={v => setProfile(p => ({ ...p, idioma: v }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Save className="w-4 h-4 mr-2" />}
              Guardar información personal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Notificaciones ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>Controla qué notificaciones deseas recibir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'trabajos', label: 'Notificaciones de trabajos', desc: 'Cuando se asignen nuevos trabajos' },
            { key: 'emergencias', label: 'Notificaciones de emergencia', desc: 'Para trabajos urgentes' },
            { key: 'recordatorios', label: 'Recordatorios', desc: 'Recordatorios de citas próximas' },
            { key: 'promocionales', label: 'Notificaciones promocionales', desc: 'Promociones y noticias' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={notifPrefs[key as keyof NotifPrefs]}
                onCheckedChange={v => setNotifPrefs(p => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={handleSaveNotifications} disabled={savingNotif}>
              {savingNotif ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Guardar notificaciones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Preferencias de la App ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Preferencias de la App
          </CardTitle>
          <CardDescription>Ajusta el comportamiento de la aplicación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'modoOscuro', label: 'Modo oscuro', desc: 'Usar tema oscuro en la aplicación' },
            { key: 'autoSync', label: 'Sincronización automática', desc: 'Sincronizar datos automáticamente' },
            { key: 'offlineMode', label: 'Modo sin conexión', desc: 'Funcionalidad limitada sin internet' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={appPrefs[key as keyof AppPrefs]}
                onCheckedChange={v => setAppPrefs(p => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={handleSaveAppPrefs} disabled={savingApp}>
              {savingApp ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Guardar preferencias
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Privacidad y Seguridad ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacidad y Seguridad
          </CardTitle>
          <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Cambiar contraseña</h4>
            <p className="text-sm text-muted-foreground">
              Actualiza tu contraseña directamente desde aquí. Mínimo 8 caracteres.
            </p>
            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
              <Lock className="w-4 h-4 mr-2" />
              Cambiar contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Zona Peligrosa ─────────────────────────────────────────────────── */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Zona Peligrosa
          </CardTitle>
          <CardDescription>Acciones irreversibles sobre tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Desactivar tu cuenta te impedirá acceder a la plataforma. Deberás contactar al administrador para reactivarla.
          </p>
          <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Desactivar mi cuenta
          </Button>
        </CardContent>
      </Card>

      {/* ── Modal Cambiar Contraseña ─────────────────────────────────────────── */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña actual y la nueva contraseña. Mínimo 8 caracteres.
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

      {/* ── Modal Desactivar Cuenta ──────────────────────────────────────────── */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">¿Desactivar tu cuenta?</DialogTitle>
            <DialogDescription>
              Tu cuenta quedará inactiva y no podrás acceder a la plataforma. Ingresa tu contraseña para confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Contraseña de confirmación</Label>
              <Input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                placeholder="Tu contraseña actual"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deletingAccount}>
              {deletingAccount
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Trash2 className="w-4 h-4 mr-2" />}
              Desactivar cuenta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
