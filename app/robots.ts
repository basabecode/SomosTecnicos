import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/', '/technician/', '/api/', '/customer/'],
    },
    sitemap: 'https://somostecnicos.com/sitemap.xml',
  }
}
