import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | SomosTécnicos',
  description: 'Restablece tu contraseña de acceso a SomosTécnicos.',
  alternates: {
    canonical: '/reset-password',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
