'use client'

import { useState, useEffect, useCallback } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Bell,
  Shield,
  Globe,
  Palette,
  Save,
  Trash2,
  AlertTriangle,
  User,
  Lock,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ProfileData {
  nombre: string
  apellido: string
  telefono: string
  direccion: string
  ciudad: string
  email: string
  username: string
}

interface NotifPrefs {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  serviceUpdates: boolean
  promotions: boolean
  reminders: boolean
}

interface PrivacyPrefs {
  profileVisibility: 'public' | 'private'
  shareDataWithPartners: boolean
  allowAnalytics: boolean
}

// ─── Helpers de fetch ─────────────────────────────────────────────────────────

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

  const res = await fetch(url, { ...options, headers })
  return res
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CustomerSettings() {
  const { toast } = useToast()

  // Estado de carga
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingNotif, setSavingNotif] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  // Datos del perfil
  const [profile, setProfile] = useState<ProfileData>({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    email: '',
    username: '',
  })

  // Preferencias
  const [notifications, setNotifications] = useState<NotifPrefs>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    serviceUpdates: true,
    promotions: false,
    reminders: true,
  })

  const [privacy, setPrivacy] = useState<PrivacyPrefs>({
    profileVisibility: 'private',
    shareDataWithPartners: false,
    allowAnalytics: true,
  })

  const [language, setLanguage] = useState('es')
  const [timezone, setTimezone] = useState('America/Bogota')
  const [theme, setTheme] = useState('light')

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

  // ─── Cargar datos desde la API ──────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    try {
      const res = await apiFetch('/api/auth/me')
      if (!res.ok) return
      const json = await res.json()
      if (!json.success) return

      const d = json.data
      setProfile({
        nombre: d.nombre ?? '',
        apellido: d.apellido ?? '',
        telefono: d.telefono ?? '',
        direccion: d.direccion ?? '',
        ciudad: d.ciudad ?? '',
        email: d.email ?? '',
        username: d.username ?? '',
      })

      const prefs = (d.preferencias as Record<string, any>) ?? {}
      if (prefs.notificaciones) {
        setNotifications(prev => ({ ...prev, ...prefs.notificaciones }))
      }
      if (prefs.privacidad) {
        setPrivacy(prev => ({ ...prev, ...prefs.privacidad }))
      }
      if (prefs.idioma) setLanguage(prefs.idioma)
      if (prefs.zonaHoraria) setTimezone(prefs.zonaHoraria)
      if (prefs.tema) setTheme(prefs.tema)
    } catch {
      // sin conexión: mantener valores vacíos
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // ─── Guardar información personal ───────────────────────────────────────────

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
          direccion: profile.direccion,
          ciudad: profile.ciudad,
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

  // ─── Guardar notificaciones ──────────────────────────────────────────────────

  const handleSaveNotifications = async () => {
    setSavingNotif(true)
    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({
          preferencias: { notificaciones: notifications },
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

  // ─── Guardar preferencias (idioma, zona, tema, privacidad) ──────────────────

  const handleSavePreferences = async () => {
    setSavingPrefs(true)
    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({
          preferencias: {
            notificaciones: notifications,
            privacidad: privacy,
            idioma: language,
            zonaHoraria: timezone,
            tema: theme,
          },
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Preferencias guardadas', description: 'Tus preferencias fueron actualizadas.' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar', variant: 'destructive' })
    } finally {
      setSavingPrefs(false)
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
      const res = await apiFetch('/api/customer/account', {
        method: 'DELETE',
        body: JSON.stringify({ password: deletePassword }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Cuenta eliminada', description: 'Tu cuenta ha sido eliminada. Serás redirigido.' })
      setTimeout(() => { window.location.href = '/' }, 2000)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo eliminar la cuenta', variant: 'destructive' })
    } finally {
      setDeletingAccount(false)
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Personaliza tu experiencia y gestiona tu privacidad</p>
      </div>

      {/* ── Información Personal ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Información Personal</CardTitle>
          </div>
          <CardDescription>Edita tus datos de contacto. Se guardan en la base de datos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={profile.nombre}
                onChange={e => setProfile(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={profile.apellido}
                onChange={e => setProfile(p => ({ ...p, apellido: e.target.value }))}
                placeholder="Tu apellido"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" value={profile.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">El email no se puede cambiar desde aquí</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={profile.telefono}
                onChange={e => setProfile(p => ({ ...p, telefono: e.target.value }))}
                placeholder="+57 300 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={profile.direccion}
                onChange={e => setProfile(p => ({ ...p, direccion: e.target.value }))}
                placeholder="Calle 123 #45-67"
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
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar información personal
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Notificaciones ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>Controla cómo y cuándo recibir notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: 'emailNotifications', label: 'Notificaciones por Email', desc: 'Recibir actualizaciones por correo electrónico' },
              { key: 'smsNotifications', label: 'Notificaciones SMS', desc: 'Recibir mensajes de texto importantes' },
              { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Recibir notificaciones en el navegador' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{label}</Label>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <Switch
                  checked={notifications[key as keyof NotifPrefs] as boolean}
                  onCheckedChange={v => setNotifications(p => ({ ...p, [key]: v }))}
                />
              </div>
            ))}

            <Separator />

            {[
              { key: 'serviceUpdates', label: 'Actualizaciones de Servicio', desc: 'Notificaciones sobre el estado de tus servicios' },
              { key: 'promotions', label: 'Promociones y Ofertas', desc: 'Recibir información sobre descuentos' },
              { key: 'reminders', label: 'Recordatorios', desc: 'Recordatorios de citas y mantenimiento' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{label}</Label>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <Switch
                  checked={notifications[key as keyof NotifPrefs] as boolean}
                  onCheckedChange={v => setNotifications(p => ({ ...p, [key]: v }))}
                />
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={handleSaveNotifications} disabled={savingNotif}>
                {savingNotif ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar notificaciones
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Privacidad y Seguridad ──────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacidad y Seguridad</CardTitle>
            </div>
            <CardDescription>Controla tu privacidad y la seguridad de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Visibilidad del Perfil</Label>
              <Select
                value={privacy.profileVisibility}
                onValueChange={(v: 'public' | 'private') =>
                  setPrivacy(p => ({ ...p, profileVisibility: v }))
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
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compartir Datos con Socios</Label>
                <p className="text-sm text-gray-600">Permitir compartir datos para mejorar servicios</p>
              </div>
              <Switch
                checked={privacy.shareDataWithPartners}
                onCheckedChange={v => setPrivacy(p => ({ ...p, shareDataWithPartners: v }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Analytics</Label>
                <p className="text-sm text-gray-600">Ayudar a mejorar la plataforma con datos anónimos</p>
              </div>
              <Switch
                checked={privacy.allowAnalytics}
                onCheckedChange={v => setPrivacy(p => ({ ...p, allowAnalytics: v }))}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Seguridad de la Cuenta</Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPasswordModal(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Preferencias ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Preferencias</CardTitle>
            </div>
            <CardDescription>Personaliza la apariencia y el idioma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Idioma</Label>
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
              <Label>Zona Horaria</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Caracas">Caracas (GMT-4)</SelectItem>
                  <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tema</Label>
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

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={handleSavePreferences} disabled={savingPrefs}>
                {savingPrefs ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar preferencias
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Zona Peligrosa ─────────────────────────────────────────────────── */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-600">Zona Peligrosa</CardTitle>
            </div>
            <CardDescription>Acciones irreversibles sobre tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Eliminar tu cuenta borrará permanentemente todos tus datos, historial de servicios y no se puede deshacer.
              </p>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar mi cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={changingPassword}>
              {changingPassword ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Actualizar contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal Eliminar Cuenta ────────────────────────────────────────────── */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">¿Eliminar tu cuenta?</DialogTitle>
            <DialogDescription>
              Esta acción es <strong>irreversible</strong>. Se eliminarán todos tus datos,
              historial de servicios y no podrás recuperarlos. Ingresa tu contraseña para confirmar.
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
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deletingAccount}>
              {deletingAccount ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Eliminar cuenta definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
