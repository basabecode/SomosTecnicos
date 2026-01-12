/**
 * Página para Crear Nuevo Técnico
 * Formulario completo para registrar técnicos
 */

'use client'

import { TechnicianForm } from '@/components/admin/technician-form'
import { ProtectedRoute } from '@/contexts/auth-context'

function CreateTechnicianContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TechnicianForm />
    </div>
  )
}

export default function CreateTechnicianPage() {
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
      <CreateTechnicianContent />
    </ProtectedRoute>
  )
}
