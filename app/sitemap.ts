import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://somostecnicos.com'

  // Fecha base para las páginas (última actualización real del sitio)
  const lastUpdate = new Date('2026-02-15')
  const olderUpdate = new Date('2026-02-01')

  return [
    {
      url: baseUrl,
      lastModified: lastUpdate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin-info`,
      lastModified: lastUpdate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: olderUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: olderUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      lastModified: olderUpdate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
