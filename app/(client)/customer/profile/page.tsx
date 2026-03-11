'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  Star,
  CheckCircle,
  History,
  Loader2,
  Bell,
  Lock,
  Settings,
} from 'lucide-react'

export default function CustomerProfile() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    ciudad: user?.ciudad || '',
  })

  // Cargar datos frescos desde la API al montar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const json = await res.json()
        if (!json.success) return
        const d = json.data
        setFormData({
          nombre: d.nombre ?? '',
          apellido: d.apellido ?? '',
          email: d.email ?? '',
          telefono: d.telefono ?? '',
          direccion: d.direccion ?? '',
          ciudad: d.ciudad ?? '',
        })
      } catch {
        // mantener datos del contexto
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido', variant: 'destructive' })
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast({ title: 'Perfil actualizado', description: 'Tu información personal fue guardada correctamente.' })
      setIsEditing(false)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message ?? 'No se pudo guardar el perfil', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      ciudad: user?.ciudad || '',
    })
    setIsEditing(false)
  }

  // Real data for user stats
  const [userStats, setUserStats] = useState({
    totalServices: 0,
    completedServices: 0,
    activeServices: 0,
    averageRating: 0,
    memberSince: new Date().toISOString(),
    totalSpent: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/customer/stats')
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setUserStats(data.stats)
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholders/placeholder-user.avif" />
                    <AvatarFallback className="text-xl">
                      {`${formData.nombre?.[0] || ''}${
                        formData.apellido?.[0] || ''
                      }`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">
                      {formData.nombre} {formData.apellido}
                    </CardTitle>
                    <CardDescription>{formData.email}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información Personal</CardTitle>
                <Button
                  variant={isEditing ? 'destructive' : 'outline'}
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                >
                  {isEditing ? (
                    'Cancelar'
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={e => handleInputChange('nombre', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={e =>
                      handleInputChange('apellido', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={e => handleInputChange('telefono', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={e => handleInputChange('direccion', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={e => handleInputChange('ciudad', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats and Quick Info */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Servicios Completados</span>
                </div>
                <span className="font-bold">{userStats.completedServices}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total de Servicios</span>
                </div>
                <span className="font-bold">{userStats.totalServices}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Calificación Promedio</span>
                </div>
                <span className="font-bold">{userStats.averageRating}/5</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Miembro desde</span>
                </div>
                <span className="font-bold">
                  {new Date(userStats.memberSince).toLocaleDateString('es-CO')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Invertido</span>
                <span className="font-bold text-green-600">
                  ${userStats.totalSpent.toLocaleString('es-CO')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/customer/settings')}
              >
                <Lock className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/customer/settings')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Preferencias de Notificaciones
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/customer/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuración de Cuenta
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-600" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-600" />
                <span>{formData.telefono}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                <span>{formData.direccion}, {formData.ciudad}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
