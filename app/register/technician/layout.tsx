import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Únete como Técnico Certificado',
  description: 'Forma parte del equipo de SomosTécnicos. Regístrate, envía tu documentación y comienza a recibir solicitudes de servicios técnicos en tu zona.',
}

export default function RegisterTechnicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
