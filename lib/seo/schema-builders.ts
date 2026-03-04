/**
 * Generadores de JSON-LD schemas para páginas de servicio y blog.
 * Cada función retorna un objeto schema listo para serializar con JSON.stringify.
 */

import type { ServicioSEOData } from './servicios-data'
import type { BlogPost } from './blog-data'

const BASE_URL = 'https://somostecnicos.com'
const BUSINESS_ID = 'https://somostecnicos.com'

function buildServiceSchema(data: ServicioSEOData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.h1,
    description: data.description,
    serviceType: data.schemaServiceType,
    url: `${BASE_URL}${data.canonicalPath}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'SomosTécnicos',
      '@id': BUSINESS_ID,
      telephone: '+573003094854',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle 3 # 72-45',
        addressLocality: 'Cali',
        postalCode: '760006',
        addressCountry: 'CO',
      },
    },
    areaServed: data.zones.map((zone) => ({
      '@type': 'City',
      name: zone,
    })),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceRange: '$$',
      priceCurrency: 'COP',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Servicios de ${data.h1}`,
      itemListElement: data.problems.map((problem, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: problem,
        },
      })),
    },
  }
}

function buildBreadcrumbSchema(data: ServicioSEOData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Servicios',
        item: `${BASE_URL}/servicios`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.h1,
        item: `${BASE_URL}${data.canonicalPath}`,
      },
    ],
  }
}

function buildServiceFaqSchema(data: ServicioSEOData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

/**
 * AggregateRating para páginas de servicio individual.
 * Datos reales: 4.8 estrellas sobre 214 reseñas verificadas en Google.
 */
function buildAggregateRatingSchema(data: ServicioSEOData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SomosTécnicos',
    '@id': BUSINESS_ID,
    url: `${BASE_URL}${data.canonicalPath}`,
    telephone: '+573003094854',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 3 # 72-45',
      addressLocality: 'Cali',
      addressRegion: 'Valle del Cauca',
      postalCode: '760006',
      addressCountry: 'CO',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '214',
      bestRating: '5',
      worstRating: '1',
    },
  }
}

export function buildServicioJsonLd(data: ServicioSEOData): object[] {
  return [
    buildServiceSchema(data),
    buildBreadcrumbSchema(data),
    buildServiceFaqSchema(data),
    buildAggregateRatingSchema(data),
  ]
}

/**
 * Genera los schemas JSON-LD para una página de artículo de blog.
 * Incluye Article, FAQPage (si tiene FAQs) y BreadcrumbList.
 */
export function buildBlogPostJsonLd(post: BlogPost): object[] {
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      url: `${BASE_URL}${post.canonicalPath}`,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      image: post.heroImage.startsWith('http')
        ? post.heroImage
        : `${BASE_URL}${post.heroImage}`,
      author: {
        '@type': 'Organization',
        name: 'Equipo Técnico SomosTécnicos',
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'SomosTécnicos',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}${post.canonicalPath}`,
      },
      keywords: post.keywords.join(', '),
      articleSection: post.categoryLabel,
      inLanguage: 'es-CO',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}${post.canonicalPath}` },
      ],
    },
  ]

  if (post.faqs && post.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    })
  }

  return schemas
}

/**
 * Genera el schema SiteNavigationElement para la navegación principal del sitio.
 * Ayuda a Google a entender la jerarquía de páginas y puede contribuir a mostrar
 * Sitelinks en los resultados de búsqueda.
 */
export function buildSiteNavigationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Navegación principal de SomosTécnicos',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Inicio',
        description: 'Servicio técnico a domicilio en Cali y alrededores',
        url: BASE_URL,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Servicios',
        description: 'Reparación de neveras, lavadoras, calentadores, estufas y más',
        url: `${BASE_URL}/servicios`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Sobre Nosotros',
        description: 'Técnicos certificados con años de experiencia en Cali',
        url: `${BASE_URL}/sobre-nosotros`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Contacto',
        description: 'Solicita tu servicio técnico o resuelve tus dudas',
        url: `${BASE_URL}/contacto`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Seguimiento de Órdenes',
        description: 'Consulta el estado de tu orden de servicio en tiempo real',
        url: `${BASE_URL}/admin-info`,
      },
    ],
  }
}
