import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Dominio canónico principal (debe coincidir con el dominio real del servidor)
  const baseUrl = 'https://somostecnicos.com'

  // Fechas de última modificación real del contenido.
  // IMPORTANTE: actualizar manualmente cuando se hagan cambios significativos en cada sección.
  // NO usar new Date() aquí: decirle a Google que todo cambió "hoy" cada día es una señal engañosa.
  const today = new Date('2026-02-27')      // homepage y páginas de servicio (última actualización SEO)
  const lastWeek = new Date('2026-02-15')   // contacto, sobre-nosotros, admin-info
  const lastMonth = new Date('2026-02-01')  // términos y condiciones (contenido legal estable)

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

    // Hub de servicios
    {
      url: `${baseUrl}/servicios`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Páginas de servicio individuales
    {
      url: `${baseUrl}/servicios/reparacion-neveras-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/reparacion-lavadoras-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios/reparacion-calentadores-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/servicios/reparacion-estufas-hornos-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/servicios/reparacion-secadoras-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/servicios/electricista-a-domicilio-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/reparacion-televisores-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/tecnico-computadores-redes-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/servicios/camaras-seguridad-alarmas-cali`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.75,
    },

    // Páginas de soporte
    {
      url: `${baseUrl}/contacto`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // EXCLUIR SIEMPRE del sitemap:
    // - /login, /register → autenticación (no aportan valor SEO)
    // - /forgot-password, /reset-password → transaccionales (noindex)
    // - /admin/*, /customer/*, /technician/* → portales privados
  ]
}
