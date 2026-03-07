/**
 * Componente BackToHome
 * Botón universal para regresar a la página principal
 */

'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

interface BackToHomeProps {
  className?: string
  variant?: 'default' | 'button' | 'minimal'
}

export function BackToHome({
  className = '',
  variant = 'default',
}: BackToHomeProps) {
  const baseClasses = 'flex items-center gap-2 transition-colors'

  const variants = {
    default: 'text-sm text-gray-600 hover:text-primary',
    button:
      'bg-white hover:bg-gray-50 text-gray-700 hover:text-primary px-4 py-2 border border-gray-300 rounded-md shadow-sm',
    minimal: 'text-xs text-gray-500 hover:text-primary',
  }

  return (
    <Link
      href="/"
      className={`${baseClasses} ${variants[variant]} ${className}`}
      title="Volver a la página principal"
    >
      <Home size={variant === 'minimal' ? 14 : 16} />
      <span>Volver al Inicio</span>
    </Link>
  )
}
