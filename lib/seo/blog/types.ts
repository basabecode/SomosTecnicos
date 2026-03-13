/**
 * Tipos compartidos para todos los artículos del blog.
 */

export interface BlogFaq {
  q: string
  a: string
}

export interface BlogSection {
  heading: string
  paragraphs: string[]
  tips?: string[]      // Se muestra en caja verde: consejos prácticos
  warning?: string     // Se muestra en caja ámbar: alerta o situación urgente
  highlight?: string   // Se muestra en caja azul: dato o hecho relevante
}

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalPath: string
  heroImage: string
  heroImageAlt: string
  /** Imagen opcional para la tarjeta del listado de blog.
   * Si no se define, se usa heroImage como fallback. */
  cardImage?: string
  cardImageAlt?: string
  excerpt: string
  category: 'mantenimiento' | 'reparacion' | 'consejos' | 'guias'
  categoryLabel: string
  publishedAt: string
  readTime: number
  relatedServiceSlug?: string
  relatedServiceLabel?: string
  /** Metadatos SEO opcionales para arquitectura por clúster. */
  clusterKey?: string
  pillarSlug?: string
  searchIntent?: 'informacional' | 'comercial' | 'transaccional'
  funnelStage?: 'TOFU' | 'MOFU' | 'BOFU'
  relatedSlugs?: string[]
  sections: BlogSection[]
  faqs?: BlogFaq[]
}

export interface BlogCluster {
  key: string
  label: string
  description: string
  pillarSlug?: string
  serviceSlug?: string
  serviceLabel?: string
  mainKeywords: string[]
  postSlugs: string[]
}
