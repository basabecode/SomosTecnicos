/**
 * Provider wrapper para asegurar renderizado del lado del cliente
 */

'use client'

import { AuthProvider } from '@/contexts/auth-context'

interface ClientAuthProviderProps {
  children: React.ReactNode
}

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return <AuthProvider>{children}</AuthProvider>
}
