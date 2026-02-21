import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro de Técnico | SomosTécnicos',
  description: 'Únete a SomosTécnicos como técnico profesional y ofrece tus servicios de reparación a domicilio en Colombia.',
  openGraph: {
    title: 'Registro de Técnico | SomosTécnicos',
    description: 'Ofrece tus servicios técnicos a domicilio. Regístrate como técnico profesional en SomosTécnicos.',
    url: 'https://somostecnicos.com/register/technician',
    type: 'website',
  },
  alternates: {
    canonical: '/register/technician',
  },
  robots: {
    // Bloqueada en robots.txt; se agrega noindex como segunda capa de seguridad
    index: false,
    follow: false,
  },
}
