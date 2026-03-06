import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | SomosTécnicos',
  description: 'Accede a tu cuenta de SomosTécnicos para realizar seguimiento a tus órdenes de servicio o gestionar tus reparaciones asignadas.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
