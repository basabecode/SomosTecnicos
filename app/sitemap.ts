import { MetadataRoute } from 'next'
import { SERVICIOS_LIST } from '@/lib/seo/servicios-data'
import { BLOG_POSTS_LIST } from '@/lib/seo/blog-data'
import { BARRIOS_LIST } from '@/lib/seo/barrios-data'

export default function sitemap(): MetadataRoute.Sitemap {
  // Dominio canónico principal (debe coincidir con el dominio real del servidor)
  const baseUrl = 'https://somostecnicos.com'

  // Fechas de última modificación real del contenido estático
  const today = new Date('2026-03-04')
  const lastWeek = new Date('2026-02-26')
  const lastMonth = new Date('2026-02-01')

  // 1. Rutas Estáticas Core
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/admin-info`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  // 2. Rutas Dinámicas de Servicios (SEO Programático)
  const serviceRoutes: MetadataRoute.Sitemap = SERVICIOS_LIST.map((service) => ({
    url: `${baseUrl}${service.canonicalPath}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9, // Alta prioridad a las páginas de servicio locales
  }))

  // 3. Rutas Dinámicas de Barrios (SEO Programático)
  const barrioRoutes: MetadataRoute.Sitemap = BARRIOS_LIST.map((barrio) => ({
    url: `${baseUrl}/barrios/${barrio.slug}`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 4. Rutas Dinámicas de Blog (Marketing de Contenidos)
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS_LIST.map((post) => ({
    url: `${baseUrl}${post.canonicalPath}`,
    // Usamos la fecha de publicación del post real si está disponible
    lastModified: new Date(post.publishedAt || today),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  // Unir todas las rutas
  return [...staticRoutes, ...serviceRoutes, ...barrioRoutes, ...blogRoutes]
}
