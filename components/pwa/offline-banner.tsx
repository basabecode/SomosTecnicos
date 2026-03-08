'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/**
 * OfflineBanner — PWA
 * Detecta pérdida de conexión y muestra un aviso fijo en la parte superior.
 * Solo se monta en cliente (no SSR). Se oculta automáticamente al recuperar conexión.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Leer estado inicial de red
    setOffline(!navigator.onLine)

    const handleOffline = () => {
      setOffline(true)
      setVisible(true)
    }

    const handleOnline = () => {
      // Breve retraso antes de ocultar para que el usuario vea la recuperación
      setOffline(false)
      setTimeout(() => setVisible(false), 2500)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  // Si nunca fue offline, no renderizar nada
  if (!offline && !visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={offline ? 'Sin conexión a internet' : 'Conexión restaurada'}
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-center gap-2
        px-4 py-2.5 text-sm font-medium text-center
        transition-all duration-300
        ${offline
          ? 'bg-amber-400 text-amber-950'
          : 'bg-green-500 text-white'
        }
      `}
      style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      {offline
        ? 'Sin conexión — mostrando datos guardados'
        : '¡Conexión restaurada!'}
    </div>
  )
}
