import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // ✅ CORRECCIÓN #1: Usar www.somostecnicos.com (tu dominio principal)
  const baseUrl = 'https://www.somostecnicos.com'

  // Fecha base para las páginas (última actualización real del sitio)
  const lastUpdate = new Date('2026-02-15')
  const olderUpdate = new Date('2026-02-01')

  return [
    // ✅ Página principal (SIEMPRE incluir)
    {
      url: baseUrl,
      lastModified: lastUpdate,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ✅ Términos y condiciones (contenido legal - OK indexar)
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      lastModified: olderUpdate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    // ❌ ELIMINADAS: Páginas administrativas y de autenticación
    // NO incluir: /login, /register, /admin-info
    // Razón: No aportan valor SEO y confunden a Google

    // 💡 TODO: Agregar aquí tus páginas de contenido real cuando las crees:
    // - Servicios que ofreces
    // - Blog/artículos
    // - Páginas de productos
    // - Sobre nosotros / Contacto
    // - FAQ

    // Ejemplo (descomenta cuando tengas estas páginas):
    /*
    {
      url: `${baseUrl}/servicios`,
      lastModified: lastUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: lastUpdate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: olderUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    */
  ]
}
