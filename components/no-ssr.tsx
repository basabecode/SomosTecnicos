/**
 * Componente NoSSR para evitar problemas de hidratación
 * Especialmente útil para componentes que pueden ser afectados por extensiones del navegador
 */

'use client'

import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
}

export function NoSSR({ children }: NoSSRProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

/**
 * Hook para detectar si estamos en el cliente
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Componente wrapper que suprime warnings de hidratación
 * Útil para elementos que pueden ser modificados por extensiones del navegador
 */
interface SuppressHydrationWarningProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function SuppressHydrationWarning({
  children,
  className = '',
  ...props
}: SuppressHydrationWarningProps) {
  return (
    <div className={className} suppressHydrationWarning {...props}>
      {children}
    </div>
  )
}
