import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Dominio canónico principal (debe coincidir con el dominio real del servidor)
  const baseUrl = 'https://somostecnicos.com'

  // Fechas de última modificación real del contenido
  const today = new Date('2026-02-20')
  const lastWeek = new Date('2026-02-15')
  const lastMonth = new Date('2026-02-01')

  return [
    // Página principal – máxima prioridad SEO
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // Guía de usuario y cobertura – contenido público con keywords valiosas
    {
      url: `${baseUrl}/admin-info`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Términos y condiciones – contenido legal estable
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      lastModified: lastMonth,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // 💡 TODO: Agregar aquí páginas de contenido cuando se creen:
    // - /servicios (lista de servicios)
    // - /blog (artículos)
    // - /contacto
    // - /sobre-nosotros
    // - /faq
    //
    // EXCLUIR SIEMPRE del sitemap:
    // - /login, /register → autenticación (no aportan valor SEO)
    // - /forgot-password, /reset-password → transaccionales (noindex)
    // - /admin/*, /customer/*, /technician/* → portales privados
  ]
}
