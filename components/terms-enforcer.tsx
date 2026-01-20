'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useTermsAcceptance } from '@/hooks/use-terms-acceptance'
import { TermsModal } from '@/components/terms-modal'

export function TermsEnforcer({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)

  // Ignorar rutas públicas donde no se requiere aceptación
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/terminos-y-condiciones') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/img_3d')

  // Identificar userId y role para el hook
  const userId = user?.id?.toString()
  // Mapear roles al tipo esperado por el hook
  // Asumiendo que user.role viene del contexto de auth
  const userType = user?.role === 'technician' ? 'technician' :
                   user?.role === 'admin' ? 'admin' : 'customer'

  const { hasAcceptedTerms, isLoading, acceptTerms } = useTermsAcceptance(userId)

  useEffect(() => {
    // Si el usuario está logueado, no es una ruta pública, ya terminó de cargar la verificación
    // y NO ha aceptado los términos => mostrar modal
    if (user && !isPublicRoute && !isLoading && hasAcceptedTerms === false) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [user, isPublicRoute, isLoading, hasAcceptedTerms])

  const handleAccept = () => {
    if (userId) {
      acceptTerms(userId, userType)
      setShowModal(false)
    }
  }

  // Si debe mostrar el modal, renderizamos el modal "encima" de todo
  // PERO seguimos renderizando los children para que no se vea la pantalla blanca
  return (
    <>
      {children}

      <TermsModal
        open={showModal}
        onOpenChange={(open) => {
          // No permitir cerrar si es obligatorio
          if (!open && !hasAcceptedTerms) {
            return
          }
          setShowModal(open)
        }}
        mode="accept"
        requireAcceptance={true}
        onAccept={handleAccept}
      />
    </>
  )
}
