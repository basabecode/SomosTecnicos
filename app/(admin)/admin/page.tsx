/**
 * Página de redirección para /admin
 * Redirige automáticamente al dashboard de administrador
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir inmediatamente al dashboard
    router.replace('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo al panel de administración...</p>
      </div>
    </div>
  )
}