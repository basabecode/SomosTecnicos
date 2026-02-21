import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | SomosTécnicos',
  description: 'Solicita el restablecimiento de tu contraseña en SomosTécnicos.',
  alternates: {
    canonical: '/forgot-password',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
