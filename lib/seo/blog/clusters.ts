import type { BlogCluster } from './types'

export const BLOG_CLUSTERS: Record<string, BlogCluster> = {
  neveras: {
    key: 'neveras',
    label: 'Cluster Neveras',
    description: 'Diagnóstico, mantenimiento y reparación de neveras y nevecónes en Cali.',
    pillarSlug: 'por-que-la-nevera-deja-de-enfriar',
    serviceSlug: 'reparacion-neveras-cali',
    serviceLabel: 'Reparación de Neveras en Cali',
    mainKeywords: [
      'reparación neveras cali',
      'nevera no enfría',
      'nevera pierde agua',
      'hielo en nevera',
    ],
    postSlugs: [
      'por-que-la-nevera-deja-de-enfriar',
      'nevera-no-enfria-pero-funciona',
      'nevera-pierde-agua',
      'nevera-hace-ruido',
      'hielo-en-la-nevera',
      'congelador-funciona-nevera-no',
    ],
  },
  televisores: {
    key: 'televisores',
    label: 'Cluster Televisores',
    description: 'Guías prácticas para diagnóstico y reparación de Smart TV y televisores.',
    serviceSlug: 'reparacion-televisores-cali',
    serviceLabel: 'Reparación de Televisores en Cali',
    mainKeywords: [
      'reparación televisores cali',
      'tv no enciende',
      'pantalla negra tv',
      'hdmi no funciona',
    ],
    postSlugs: [
      'televisor-no-enciende-causas-y-soluciones',
      'tv-enciende-pero-sin-imagen-ni-menu',
      'tv-sonido-pero-sin-imagen-backlight',
      'hdmi-no-funciona-tv-no-detecta-dispositivo',
      'tv-sobrecalentamiento-se-apaga-solucion',
    ],
  },
  lavadoras: {
    key: 'lavadoras',
    label: 'Cluster Lavadoras',
    description: 'Diagnóstico, mantenimiento y reparación de lavadoras de carga frontal y superior en Cali.',
    pillarSlug: 'lavadora-no-centrifuga',
    serviceSlug: 'reparacion-lavadoras-cali',
    serviceLabel: 'Reparación de Lavadoras en Cali',
    mainKeywords: [
      'reparación lavadoras cali',
      'lavadora no centrifuga',
      'lavadora no drena',
      'mantenimiento lavadora',
    ],
    postSlugs: [
      'lavadora-no-centrifuga',
      'lavadora-no-drena',
      'lavadora-hace-ruido',
      'lavadora-se-mueve',
      'lavadora-no-enciende',
      'lavadora-no-llena-agua',
      'lavadora-deja-manchas',
      'lavadora-huele-mal',
      'reparar-lavadora-o-comprar',
      'mantenimiento-lavadora-cada-cuanto',
    ],
  },
  secadoras: {
    key: 'secadoras',
    label: 'Cluster Secadoras',
    description: 'Diagnóstico, mantenimiento y reparación de secadoras de ropa en Cali.',
    pillarSlug: 'secadora-no-calienta',
    serviceSlug: 'reparacion-secadoras-cali',
    serviceLabel: 'Reparación de Secadoras en Cali',
    mainKeywords: [
      'reparación secadoras cali',
      'secadora no calienta',
      'secadora no seca bien',
      'mantenimiento secadora',
    ],
    postSlugs: [
      'secadora-no-calienta',
      'secadora-se-apaga-sola',
      'secadora-no-seca-bien-ropa-humeda',
      'secadora-hace-ruido-golpes-chirrido',
      'mantenimiento-secadora-ropa-cada-cuanto',
    ],
  },
  estufas: {
    key: 'estufas',
    label: 'Cluster Estufas y Hornos',
    description: 'Diagnóstico, seguridad y mantenimiento de estufas y hornos a gas en Cali.',
    pillarSlug: 'por-que-mi-estufa-de-gas-no-enciende',
    serviceSlug: 'reparacion-estufas-cali',
    serviceLabel: 'Reparación de Estufas en Cali',
    mainKeywords: [
      'reparación estufas cali',
      'estufa de gas no enciende',
      'llama amarilla estufa',
      'mantenimiento estufa gas',
    ],
    postSlugs: [
      'por-que-mi-estufa-de-gas-no-enciende',
      'llama-amarilla-estufa-gas-que-significa',
      'horno-no-calienta-bien-causas-y-solucion',
      'estufa-hace-ruido-al-encender-clic-continuo',
      'mantenimiento-estufa-horno-gas-cada-cuanto',
    ],
  },
  calentadores: {
    key: 'calentadores',
    label: 'Cluster Calentadores',
    description: 'Diagnóstico, mantenimiento y reparación de calentadores de agua a gas y eléctricos en Cali.',
    pillarSlug: 'senales-calentador-necesita-mantenimiento',
    serviceSlug: 'reparacion-calentadores-cali',
    serviceLabel: 'Reparación de Calentadores en Cali',
    mainKeywords: [
      'reparación calentadores cali',
      'calentador no calienta',
      'mantenimiento calentador agua',
      'calentador no enciende',
    ],
    postSlugs: [
      'senales-calentador-necesita-mantenimiento',
      'calentador-no-calienta-el-agua',
      'calentador-hace-ruido-golpes-o-silbidos',
      'calentador-no-enciende-soluciones',
      'calentador-electrico-vs-gas-cual-elegir',
      'mantenimiento-preventivo-calentador-de-agua',
    ],
  },
  redes: {
    key: 'redes',
    label: 'Cluster Redes y Computación',
    description: 'Soporte técnico, redes domésticas y mantenimiento de computadores en Cali.',
    pillarSlug: 'mantenimiento-preventivo-computador-empresa-cali',
    serviceSlug: 'reparacion-computadores-cali',
    serviceLabel: 'Soporte Técnico en Cali',
    mainKeywords: [
      'soporte técnico cali',
      'internet lento cali',
      'computador lento solución',
      'mantenimiento computadores empresa cali',
    ],
    postSlugs: [
      'internet-lento-en-casa-causas-y-soluciones',
      'computador-lento-causas-y-que-hacer',
      'wifi-no-conecta-diagnostico-paso-a-paso',
      'computador-no-enciende-que-hacer',
      'mantenimiento-preventivo-computador-empresa-cali',
    ],
  },
  electricidad: {
    key: 'electricidad',
    label: 'Cluster Electricidad',
    description: 'Seguridad eléctrica, diagnóstico de instalaciones y electricistas a domicilio en Cali.',
    pillarSlug: 'revision-electrica-domiciliaria-cali',
    serviceSlug: 'electricistas-cali',
    serviceLabel: 'Electricistas en Cali',
    mainKeywords: [
      'electricistas cali',
      'breaker se dispara',
      'revisión eléctrica cali',
      'instalación eléctrica dañada',
    ],
    postSlugs: [
      'breaker-se-cae-constantemente',
      'luces-parpadean-en-casa-causas',
      'tomacorriente-no-funciona-que-hacer',
      'senales-instalacion-electrica-danada',
      'revision-electrica-domiciliaria-cali',
    ],
  },
}

export const BLOG_CLUSTER_BY_SLUG: Record<string, string> = Object.values(BLOG_CLUSTERS)
  .reduce<Record<string, string>>((acc, cluster) => {
    cluster.postSlugs.forEach((slug) => {
      acc[slug] = cluster.key
    })
    return acc
  }, {})

export function getBlogClusterKey(slug: string): string | undefined {
  return BLOG_CLUSTER_BY_SLUG[slug]
}

// getRelatedBlogPosts está en index.ts para evitar dependencia circular con BLOG_POSTS
