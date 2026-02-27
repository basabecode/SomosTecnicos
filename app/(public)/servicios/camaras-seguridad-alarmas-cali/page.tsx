import { Metadata } from 'next'
import { SERVICIOS_DATA } from '@/lib/seo/servicios-data'
import { buildServicioJsonLd } from '@/lib/seo/schema-builders'
import ServicioPageLayout from '../_components/ServicioPageLayout'

const data = SERVICIOS_DATA['camaras-seguridad-alarmas-cali']

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  keywords: data.keywords,
  alternates: { canonical: data.canonicalPath },
  openGraph: {
    title: data.metaTitle,
    description: data.metaDescription,
    url: `https://somostecnicos.com${data.canonicalPath}`,
    type: 'website',
    locale: 'es_CO',
    siteName: 'SomosTécnicos',
  },
  robots: { index: true, follow: true },
}

export default function CamarasSeguridadAlarmasCaliPage() {
  return <ServicioPageLayout data={data} jsonLd={buildServicioJsonLd(data)} />
}
