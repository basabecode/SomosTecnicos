import type { Metadata } from 'next'
import type React from 'react'

// Todas las rutas de registro son privadas al proceso de onboarding.
// noindex evita que Google las indexe aunque el robots.txt sea ignorado.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
