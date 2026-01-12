import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro de Clientes',
  description: 'Crea tu cuenta en SomosTécnicos para gestionar tus reparaciones, hacer seguimiento en tiempo real y acceder a técnicos certificados.',
}

export default function RegisterCustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
