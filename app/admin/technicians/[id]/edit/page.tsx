/**
 * Página para Editar Técnico Existente
 * Carga los datos del técnico y permite editarlos
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TechnicianForm } from '@/components/admin/technician-form'
import { ProtectedRoute } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function EditTechnicianPage() {
  const params = useParams()
  const router = useRouter()
  const [technician, setTechnician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const technicianId = params.id

  useEffect(() => {
    if (technicianId) {
      fetchTechnician()
    }
  }, [technicianId])

  const fetchTechnician = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`/api/technicians/${technicianId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTechnician(data.data)
        } else {
          setError(data.error || 'Error al cargar el técnico')
        }
      } else if (response.status === 404) {
        setError('Técnico no encontrado')
      } else {
        setError('Error al cargar los datos del técnico')
      }
    } catch (error) {
      console.error('Error fetching technician:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push('/admin/technicians')
  }

  const handleCancel = () => {
    router.push('/admin/technicians')
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>

          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>

          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="mt-6 flex gap-3">
                <Button onClick={fetchTechnician}>Reintentar</Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/technicians')}
                >
                  Volver a la Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        {technician && (
          <TechnicianForm
            technician={technician}
            isEditing={true}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
