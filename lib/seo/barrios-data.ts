/**
 * Datos para landing pages de barrios de Cali.
 * Cada entrada provee contenido ÚNICO para evitar thin-content.
 * Patrón: "Servicio técnico en [barrio], Cali" — Locations playbook.
 */

export interface BarrioData {
  slug: string
  name: string
  zone: string             // Zona/sector de Cali
  stratum: string          // Estrato predominante
  landmarks: string[]      // Puntos de referencia del barrio
  zones: string[]          // Sub-zonas o barrios aledaños cubiertos
  housingType: string      // Tipo de vivienda predominante
  commonAppliances: string // Electrodomésticos más comunes en el sector
  responseTime: string     // Tiempo de respuesta estimado
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string            // Párrafo único de intro
  localContext: string     // Dato local específico del barrio
  topServices: string[]    // Servicios más solicitados en ese barrio
}

export const BARRIOS_DATA: Record<string, BarrioData> = {
  'sur-cali': {
    slug: 'sur-cali',
    name: 'Sur de Cali',
    zone: 'Sur — Comunas 17, 18 y 19',
    stratum: '3, 4 y 5',
    landmarks: [
      'Centro Comercial Único Cali',
      'Clínica Fundación Valle del Lili',
      'Parque del Amor',
      'Av. Cañasgordas',
      'Centro Comercial Palmetto',
    ],
    zones: [
      'El Ingenio', 'La Flora', 'Capri', 'Los Farallones',
      'Caney', 'Mojica', 'Barrio Departamental', 'Nápoles',
      'Quintas de Don Simón', 'La Hacienda',
    ],
    housingType: 'Casas de dos plantas, conjuntos cerrados y apartamentos de estrato 3 a 5. Alta densidad residencial.',
    commonAppliances: 'Neveras de dos puertas (Haceb, LG, Mabe), lavadoras automáticas de carga superior, calentadores a gas de paso, estufas a gas de 4 y 6 puestos.',
    responseTime: '20–40 minutos',
    metaTitle: 'Técnico Electrodomésticos Sur de Cali | SomosTécnicos',
    metaDescription: 'Servicio técnico a domicilio en el Sur de Cali: El Ingenio, La Flora, Caney, Capri y más. Reparamos neveras, lavadoras, calentadores y estufas. Diagnóstico $50.000.',
    h1: 'Servicio Técnico a Domicilio en el Sur de Cali',
    intro: 'SomosTécnicos cubre toda la zona sur de Cali con técnicos asignados específicamente a las comunas 17, 18 y 19. Conocemos el tejido residencial del sector: desde casas de barrio con electrodomésticos nacionales hasta conjuntos cerrados con equipos de última generación.',
    localContext: 'El sur de Cali concentra una alta densidad de estufas a gas de 4 y 6 puestos — el electrodoméstico que más llamados genera en la zona. La limpieza de quemadores, revisión de chisperos y ajuste de válvulas es el servicio más frecuente. También atendemos neveras Haceb y Mabe con amplia disponibilidad de repuestos el mismo día.',
    topServices: [
      'Reparación de estufas a gas',
      'Mantenimiento de neveras',
      'Reparación de lavadoras',
      'Reparación de calentadores a gas',
    ],
  },

  'ciudad-jardin': {
    slug: 'ciudad-jardin',
    name: 'Ciudad Jardín',
    zone: 'Sur — Ladera y Corredor Cañasgordas',
    stratum: '5 y 6',
    landmarks: [
      'Mall Jardín Plaza',
      'Universidad Icesi',
      'Av. Cañasgordas',
      'Club Campestre de Cali',
      'Centro Comercial Cosmocentro',
    ],
    zones: [
      'Ciudad Jardín', 'Lili', 'Santa Anita', 'La Hacienda Norte',
      'Urbanización Los Álamos', 'El Refugio', 'Prados de Varsovia',
    ],
    housingType: 'Casas de estrato 5–6 con jardín, conjuntos residenciales cerrados y apartamentos de lujo en edificios modernos.',
    commonAppliances: 'Neveras side-by-side y puerta francesa (Samsung, LG, Whirlpool), lavadoras de carga frontal, calentadores de acumulación, televisores Smart de 55"+, aires acondicionados.',
    responseTime: '25–40 minutos',
    metaTitle: 'Técnico Electrodomésticos Ciudad Jardín, Cali | SomosTécnicos',
    metaDescription: 'Servicio técnico a domicilio en Ciudad Jardín, Cali. Reparamos neveras, lavadoras, calentadores y televisores premium. Técnicos certificados. Diagnóstico $50.000.',
    h1: 'Servicio Técnico a Domicilio en Ciudad Jardín, Cali',
    intro: 'Atendemos Ciudad Jardín y sus urbanizaciones con técnicos especializados en electrodomésticos de alta gama. El sector concentra los hogares con mayor densidad de equipos inverter, sistemas No Frost y smart appliances de Cali — tecnologías que requieren diagnóstico electrónico especializado que muchos técnicos del mercado no pueden realizar.',
    localContext: 'Ciudad Jardín tiene una alta concentración de neveras side-by-side y puerta francesa con dispensador de agua y hielo — equipos que requieren mantenimiento especializado del sistema de filtración y del compresor inverter. También atendemos frecuentemente lavadoras de carga frontal con falla en el sello de tambor, muy común en equipos con más de 5 años de uso intensivo.',
    topServices: [
      'Reparación neveras side-by-side y puerta francesa',
      'Diagnóstico electrónico equipos inverter',
      'Reparación lavadoras de carga frontal',
      'Mantenimiento calentadores de acumulación',
    ],
  },

  tequendama: {
    slug: 'tequendama',
    name: 'Tequendama',
    zone: 'Sur Centro — Entre Alameda y San Fernando',
    stratum: '4 y 5',
    landmarks: [
      'Parque Tequendama',
      'Avenida Colombia',
      'Hotel Dann Carlton',
      'Carrera 56',
      'Clínica Versalles',
    ],
    zones: [
      'Tequendama', 'San Fernando', 'Miraflores', 'Barrio Campestre',
      'La Merced', 'Barrio Bolivia', 'Santa Isabel',
    ],
    housingType: 'Casas clásicas caleñas de una y dos plantas, edificios de apartamentos de los años 70–90 y algunas construcciones modernas.',
    commonAppliances: 'Neveras de dos puertas estándar, lavadoras de carga superior, calentadores a gas de paso, estufas a gas, televisores.',
    responseTime: '15–25 minutos',
    metaTitle: 'Técnico Electrodomésticos en Tequendama y San Fernando, Cali | SomosTécnicos',
    metaDescription: 'Servicio técnico a domicilio en Tequendama y San Fernando, Cali. Reparamos neveras, lavadoras, calentadores y estufas. Técnicos certificados con 30 días de garantía.',
    h1: 'Servicio Técnico a Domicilio en Tequendama y San Fernando, Cali',
    intro: 'Tequendama y San Fernando son dos de los barrios con mayor tradición residencial del sur de Cali. Atendemos toda la zona con tiempos de respuesta entre 15 y 25 minutos. Las casas clásicas del sector presentan características particulares — instalaciones eléctricas de época, calentadores de más de 10 años y neveras de marcas nacionales — con las que nuestro equipo tiene amplia experiencia.',
    localContext: 'En Tequendama y San Fernando es frecuente encontrar calentadores a gas con 10 o más años de antigüedad. El mantenimiento preventivo de estos equipos — limpieza de quemadores, verificación de válvulas, revisión del piloto — es crítico para la seguridad del hogar y puede extender su vida útil varios años más. También tenemos disponibilidad de repuestos para marcas descontinuadas comunes en el sector.',
    topServices: [
      'Mantenimiento preventivo calentadores antiguos',
      'Reparación de neveras nacionales (Haceb, Challenger)',
      'Revisión eléctrica de electrodomésticos',
      'Reparación de estufas y quemadores',
    ],
  },

  chipichape: {
    slug: 'chipichape',
    name: 'Chipichape',
    zone: 'Norte — Comunas 2 y 5',
    stratum: '4 y 5',
    landmarks: [
      'Centro Comercial Chipichape',
      'Holguines Trade Center',
      'Av. 6N',
      'Calle 52N',
      'Parque Lineal El Vallado',
    ],
    zones: [
      'Chipichape', 'Versalles', 'Normandía', 'Álamos',
      'Alameda del Río', 'Quintas de Don Simón Norte', 'El Limonar Norte',
    ],
  housingType: 'Conjuntos de apartamentos modernos (2000–2020), torres residenciales de 8 a 20 pisos con cuartos de servicio integrados.',
    commonAppliances: 'Neveras de dos puertas (LG, Samsung, Haceb), lavadoras automáticas frontales y de carga superior, calentadores a gas de paso, aires acondicionados tipo split.',
    responseTime: '15–30 minutos',
    metaTitle: 'Técnico Electrodomésticos en Chipichape, Cali | SomosTécnicos',
    metaDescription: 'Servicio técnico a domicilio en Chipichape y Versalles, Cali. Reparamos neveras, lavadoras, calentadores y aires acondicionados. Diagnóstico $50.000 abonables.',
    h1: 'Servicio Técnico a Domicilio en Chipichape y Versalles, Cali',
    intro: 'Chipichape y Versalles son dos de los sectores con mayor crecimiento residencial del norte de Cali. Atendemos toda la zona con un tiempo de respuesta promedio de 20 minutos. La alta concentración de conjuntos cerrados modernos y torres de apartamentos nos permite optimizar rutas y responder rápidamente.',
    localContext: 'Los apartamentos modernos de Chipichape y Versalles tienen calentadores de paso a gas instalados en cuartos de ropas pequeños — espacios que requieren técnicos certificados en gas para trabajar con seguridad. Además, la alta densidad de lavadoras de carga frontal en torres residenciales modernas hace que la falla de rodamientos y el sello de tambor sea el servicio más solicitado del sector.',
    topServices: [
      'Reparación calentadores en cuartos de servicio',
      'Reparación lavadoras de carga frontal',
      'Reparación neveras LG y Samsung',
      'Mantenimiento aires acondicionados split',
    ],
  },

  norte: {
    slug: 'norte',
    name: 'Norte de Cali',
    zone: 'Norte — Comunas 4, 6 y 7',
    stratum: '3, 4 y 5',
    landmarks: [
      'Av. 3N y Av. 6N',
      'Terminal de Transportes Norte',
      'Clínica Imbanaco',
      'Centro Comercial La 14 de Calima',
      'Estadio Pascual Guerrero',
    ],
    zones: [
      'Granada', 'Centenario', 'Floralia', 'Porvenir',
      'La Base', 'Multicentro', 'San Bosco', 'La Merced Norte',
      'Juanambú', 'Bello Horizonte',
    ],
    housingType: 'Mezcla de casas de barrio, conjuntos cerrados de estrato 3–4 y edificios de apartamentos de distintas épocas.',
    commonAppliances: 'Neveras estándar y de dos puertas de varias marcas, lavadoras de carga superior, calentadores a gas, televisores, estufas a gas.',
    responseTime: '15–35 minutos',
    metaTitle: 'Técnico Electrodomésticos Norte de Cali | SomosTécnicos',
    metaDescription: 'Servicio técnico a domicilio en el Norte de Cali: Granada, Floralia, Centenario, Juanambú y más. Reparamos neveras, lavadoras, calentadores y estufas. Diagnóstico $50.000.',
    h1: 'Servicio Técnico a Domicilio en el Norte de Cali',
    intro: 'El norte de Cali es una de las zonas de mayor cobertura de SomosTécnicos. Con técnicos basados en el sector, cubrimos desde Granada hasta Floralia con tiempos de respuesta que promedian 20 minutos. La diversidad de viviendas en la zona — desde casas de barrio hasta edificios modernos — nos ha dado experiencia con una amplia variedad de electrodomésticos y marcas.',
    localContext: 'El norte de Cali tiene una mezcla particular: barrios con casas de más de 20 años donde los electrodomésticos de marcas nacionales son los más comunes (Haceb, Challenger, Mabe), y conjuntos nuevos con equipos de última generación. Tenemos disponibilidad inmediata de repuestos para ambos perfiles, lo que nos permite resolver la mayoría de reparaciones el mismo día de la visita.',
    topServices: [
      'Reparación de neveras (todas las marcas)',
      'Reparación de lavadoras',
      'Mantenimiento calentadores a gas',
      'Reparación de estufas y quemadores',
    ],
  },

  pance: {
    slug: 'pance',
    name: 'Pance',
    zone: 'Corregimiento de Pance — Sur extremo',
    stratum: '5 y 6',
    landmarks: [
      'Parque Natural Farallones de Cali',
      'Vereda El Pance',
      'Conjunto Los Samanes',
      'La Rivera del Pance',
      'Vía al Mar (Pance)',
    ],
    zones: [
      'Pance', 'La Cascada', 'Los Samanes', 'Ciudad Campestre',
      'El Retiro', 'La Rivera del Pance', 'Urbanización La Hacienda de Pance',
    ],
    housingType: 'Condominios campestres, casas de alto estándar con amplios jardines, conjuntos cerrados con portería 24/7 y áreas comunes.',
    commonAppliances: 'Neveras de puerta francesa y side-by-side (Samsung Family Hub, LG InstaView), lavadoras de carga frontal premium, calentadores de acumulación eléctrico y a gas, televisores Smart de 65"+, aires acondicionados multi-split.',
    responseTime: '40–60 minutos',
    metaTitle: 'Técnico Electrodomésticos en Pance, Cali | SomosTécnicos',
    metaDescription: 'Servicio técnico a domicilio en Pance, Cali. Especialistas en electrodomésticos premium: neveras side-by-side, lavadoras frontales, calentadores. Diagnóstico $50.000.',
    h1: 'Servicio Técnico a Domicilio en Pance, Cali',
    intro: 'Pance es el sector residencial de más alto estándar de Cali y uno donde la especialización técnica marca la diferencia. Atendemos todos los condominios y conjuntos del corregimiento con técnicos que tienen certificación y equipos para trabajar con electrodomésticos premium: compresores inverter, sistemas No Frost de última generación, Smart TVs y calentadores de alto rendimiento.',
    localContext: 'Los hogares de Pance tienen una alta concentración de neveras side-by-side con dispensador de agua y hielo, y lavadoras de carga frontal de 14–17 kg con tecnología inverter — equipos que la mayoría de técnicos del mercado no pueden diagnosticar correctamente sin el software especializado. Nuestro equipo cuenta con las herramientas de diagnóstico para LG ThinQ y Samsung SmartThings, lo que nos diferencia en este sector.',
    topServices: [
      'Reparación neveras side-by-side y Family Hub',
      'Diagnóstico equipos inverter LG y Samsung',
      'Reparación lavadoras frontales premium',
      'Mantenimiento calentadores de acumulación',
    ],
  },
}

export const BARRIOS_LIST = Object.values(BARRIOS_DATA)
