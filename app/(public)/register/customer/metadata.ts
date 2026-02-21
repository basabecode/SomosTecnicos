import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro de Cliente | SomosTécnicos',
  description: 'Regístrate gratis en SomosTécnicos y accede a técnicos certificados para reparación de electrodomésticos a domicilio. Servicio rápido, confiable y con garantía.',
  keywords: [
    'registro cliente',
    'crear cuenta somostecnicos',
    'registrarse servicio técnico',
    'solicitar reparación',
    'técnicos certificados',
    'registro gratis',
  ],
  openGraph: {
    title: 'Registro de Cliente | SomosTécnicos',
    description: 'Únete a SomosTécnicos y accede a técnicos expertos para reparación de electrodomésticos.',
    url: 'https://somostecnicos.com/register/customer',
    type: 'website',
  },
  alternates: {
    // Canónica propia: esta página tiene contenido específico para clientes
    canonical: '/register/customer',
  },
  robots: {
    // Bloqueada en robots.txt; se agrega noindex como segunda capa de seguridad
    index: false,
    follow: false,
  },
}
