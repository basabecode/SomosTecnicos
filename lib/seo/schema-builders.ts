/**
 * Generadores de JSON-LD schemas para páginas de servicio.
 * Cada función retorna un objeto schema listo para serializar con JSON.stringify.
 */

import type { ServicioSEOData } from './servicios-data'

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

export function buildServicioJsonLd(data: ServicioSEOData): object[] {
  return [
    buildServiceSchema(data),
    buildBreadcrumbSchema(data),
    buildServiceFaqSchema(data),
  ]
}
