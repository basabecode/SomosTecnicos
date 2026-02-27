import { Metadata } from 'next'
import InfoView from './info-view'

export const metadata: Metadata = {
  title: 'Guía de Usuario y Cobertura | SomosTécnicos',
  description: 'Aprenda a usar la plataforma SomosTécnicos para solicitar reparaciones a domicilio en Cali y municipios cercanos. Valide su perfil de Cliente, Técnico o Administrador.',
  keywords: [
    'somostecnicos plataforma',
    'cómo solicitar servicio técnico',
    'mantenimiento neveras cali',
    'servicio tecnico haceb cali',
    'servicio tecnico samsung cali',
    'trabajo para tecnicos cali',
    'app reparaciones cali',
    'soporte tecnico a domicilio cali',
    'guía de usuario somostecnicos',
    'validar tecnico cali',
    'cobertura somostecnicos',
    'reparación estufas cali',
    'instalacion calentadores cali'
  ],
  openGraph: {
    title: 'Guía de Usuario y Cobertura - SomosTécnicos',
    description: 'Plataforma de servicios técnicos domiciliarios en Cali y municipios cercanos. Conectamos usuarios con técnicos certificados.',
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
