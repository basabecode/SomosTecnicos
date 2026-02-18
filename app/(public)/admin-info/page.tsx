import { Metadata } from 'next'
import InfoView from './info-view'

export const metadata: Metadata = {
  title: 'Guía de Usuario y Cobertura | SomosTécnicos Colombia',
  description: 'Aprenda a usar la plataforma SomosTécnicos para solicitar reparaciones en Bogotá, Medellín, Cali y toda Colombia. Valide su perfil de Cliente, Técnico o Administrador.',
  keywords: [
    'somostecnicos colombia',
    'reparación electrodomésticos bogota',
    'técnico lavadoras medellin',
    'mantenimiento neveras cali',
    'servicio tecnico haceb',
    'servicio tecnico samsung',
    'trabajo para tecnicos colombia',
    'app reparaciones',
    'soporte tecnico a domicilio',
    'guía de usuario somostecnicos',
    'validar tecnico',
    'cobertura nacional',
    'reparación estufas',
    'instalacion calentadores'
  ],
  openGraph: {
    title: 'Guía de Usuario y Cobertura - SomosTécnicos',
    description: 'Plataforma líder en servicios técnicos domiciliarios en Colombia. Conectamos usuarios con expertos certificados.',
    url: 'https://somostecnicos.com/admin-info',
    siteName: 'SomosTécnicos',
    locale: 'es_CO',
    type: 'website',
  },
  alternates: {
    canonical: '/admin-info',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function AdminInfoPage() {
  return <InfoView />
}
