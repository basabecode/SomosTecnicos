import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/', '/technician/', '/api/', '/customer/'],
    },
    // ✅ CORRECCIÓN: Usar www.somostecnicos.com (tu dominio principal)
    sitemap: 'https://www.somostecnicos.com/sitemap.xml',
    // ❌ ANTES: sitemap: 'https://somostecnicos.com/sitemap.xml' (sin www)
  }
}
