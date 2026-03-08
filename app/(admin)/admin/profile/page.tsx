/**
 * Página de Perfil - Panel Admin
 * Muestra y permite editar la información personal del administrador autenticado.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Lock,
  Save,
  Loader2,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AdminProfile {
  id: number
  nombre: string
  apellido: string | null
  telefono: string | null
  email: string
  username: string
  role: string
  activo: boolean
  createdAt: string
  lastLogin: string | null
}

// ─── Helper fetch con token desde cookie ──────────────────────────────────────

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = document.cookie
    .split('; ')
    .find(r => r.startsWith('auth-token='))
    ?.split('=')[1] || localStorage.getItem('accessToken') || ''

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  return fetch(url, { ...options, headers })
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProfilePage() {
  const { toast } = useToast()

  // Datos del perfil
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Formulario de información personal
  const [formData, setFormData] = useState({ nombre: '', apellido: '', telefono: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  // Formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [savingPassword, setSavingPassword] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ─── Cargar perfil ─────────────────────────────────────────────────────────

  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true)
    try {
      const res = await apiFetch('/api/auth/me')
      if (!res.ok) throw new Error('Error al cargar el perfil')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setProfile(json.data)
      setFormData({
        nombre: json.data.nombre || '',
        apellido: json.data.apellido || '',
        telefono: json.data.telefono || '',
      })
    } catch (err) {
      toast({ title: 'Error', description: 'No se pudo cargar el perfil', variant: 'destructive' })
    } finally {
      setLoadingProfile(false)
    }
  }, [toast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // ─── Guardar información personal ──────────────────────────────────────────

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido', variant: 'destructive' })
      return
    }
    setSavingProfile(true)
    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim() || null,
          telefono: formData.telefono.trim() || null,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setProfile(prev => prev ? { ...prev, ...json.data } : prev)
      toast({ title: 'Perfil actualizado', description: 'Los cambios se guardaron correctamente' })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'No se pudo actualizar el perfil', variant: 'destructive' })
    } finally {
      setSavingProfile(false)
    }
  }

  // ─── Cambiar contraseña ────────────────────────────────────────────────────

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast({ title: 'Error', description: 'Completa todos los campos', variant: 'destructive' })
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'Las contraseñas nuevas no coinciden', variant: 'destructive' })
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast({ title: 'Error', description: 'La contraseña debe tener al menos 8 caracteres', variant: 'destructive' })
      return
    }
    setSavingPassword(true)
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast({ title: 'Contraseña actualizada', description: 'Tu contraseña se cambió correctamente' })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'No se pudo cambiar la contraseña', variant: 'destructive' })
    } finally {
      setSavingPassword(false)
    }
  }

  // ─── Iniciales para avatar ─────────────────────────────────────────────────

  const initials = profile
    ? `${profile.nombre?.[0] || ''}${profile.apellido?.[0] || ''}`.toUpperCase() || 'AD'
    : 'AD'

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    manager: 'Gerente',
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Administra tu información personal y seguridad</p>
      </div>

      {/* ── Avatar + resumen ── */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-gray-900 truncate">
                {profile?.nombre} {profile?.apellido}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Mail className="h-3.5 w-3.5" />
                  {profile?.email}
                </span>
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {roleLabel[profile?.role || ''] || profile?.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Información personal ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Información personal
          </CardTitle>
          <CardDescription>Actualiza tu nombre y datos de contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={e => setFormData(p => ({ ...p, apellido: e.target.value }))}
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="pl-9 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400">El correo no puede modificarse desde aquí</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={e => setFormData(p => ({ ...p, telefono: e.target.value }))}
                  placeholder="+57 300 000 0000"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={savingProfile} className="gap-2">
                {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Cambiar contraseña ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" />
            Cambiar contraseña
          </CardTitle>
          <CardDescription>Usa una contraseña segura de al menos 8 caracteres</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordData.newPassword &&
                passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={savingPassword}
                variant="outline"
                className="gap-2"
              >
                {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Cambiar contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

