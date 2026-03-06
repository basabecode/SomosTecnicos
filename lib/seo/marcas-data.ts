/**
 * Datos para landing pages Marca × Servicio.
 * Patrón: "Reparación [Electrodoméstico] [Marca] en Cali"
 * Solo combinaciones con demanda de búsqueda real.
 */

export interface MarcaData {
  slug: string             // Slug de la marca, ej: 'lg'
  name: string             // Nombre display, ej: 'LG'
  origin: string           // País de origen
  priceRange: string       // Rango de precio en Colombia
  availability: string     // Disponibilidad de repuestos en Cali
  commonFailures: string[] // Fallas más frecuentes en esta marca
  techNote: string         // Nota técnica para el técnico / cliente
  warrantyNote: string     // Nota sobre garantía del fabricante
}

export interface ServiceMarcaCombo {
  serviceSlug: string      // Slug del servicio, ej: 'reparacion-neveras-cali'
  serviceName: string      // Nombre corto, ej: 'Neveras'
  marcaSlug: string        // Slug de la marca
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  failures: string[]       // Fallas específicas marca+electrodoméstico
  repairNote: string       // Nota de reparación específica
  relatedBlogSlug?: string // Artículo de blog relacionado
}

// ── Marcas ────────────────────────────────────────────────────────────────────

export const MARCAS_DATA: Record<string, MarcaData> = {
  lg: {
    slug: 'lg',
    name: 'LG',
    origin: 'Corea del Sur',
    priceRange: 'Media-alta a Premium',
    availability: 'Excelente — repuestos originales disponibles el mismo día en Cali',
    commonFailures: [
      'Compresor inverter (garantía extendida de LG)',
      'Tarjeta principal (falla eléctrica)',
      'Sensor de temperatura descalibrado',
      'Motor Direct Drive en lavadoras (dura más, pero costoso al fallar)',
    ],
    techNote: 'Los equipos LG Inverter requieren diagnóstico con software LG ThinQ para leer los códigos de error del compresor. Sin este diagnóstico, hay riesgo de cambiar piezas que no necesitan reemplazo.',
    warrantyNote: 'LG Colombia ofrece 1 año de garantía general y garantía especial de 10 años en el compresor inverter. Verifica si tu equipo tiene garantía vigente antes de contratar servicio externo.',
  },
  samsung: {
    slug: 'samsung',
    name: 'Samsung',
    origin: 'Corea del Sur',
    priceRange: 'Media-alta a Premium',
    availability: 'Excelente — repuestos originales disponibles el mismo día en Cali',
    commonFailures: [
      'Sensor "Ice Maker" en modelos side-by-side',
      'Tarjeta de control (voltaje fluctuante)',
      'Filtro de agua (sin cambio periódico)',
      'Digital Inverter Motor en lavadoras',
    ],
    techNote: 'Los Samsung Smart Appliances (Family Hub, Bespoke) tienen diagnóstico a través de la app SmartThings. Nuestros técnicos están certificados para leer los logs de error de estos modelos.',
    warrantyNote: 'Samsung Colombia ofrece 1 año de garantía general. Para compresores Digital Inverter, la garantía es de 10 años en piezas (solo mano de obra fuera del primer año).',
  },
  haceb: {
    slug: 'haceb',
    name: 'Haceb',
    origin: 'Colombia (Medellín)',
    priceRange: 'Económica a Media',
    availability: 'Excelente — marca nacional con amplia disponibilidad de repuestos en todo Colombia',
    commonFailures: [
      'Termostato descalibrado en neveras',
      'Resistencia calefactora en lavadoras',
      'Piloto y quemadores en calentadores a gas',
      'Válvulas de gas en estufas',
    ],
    techNote: 'Haceb es la marca con mayor volumen de reparaciones que realizamos en Cali. La disponibilidad de repuestos originales y genéricos compatibles es inmediata, lo que permite resolver la mayoría de fallas el mismo día.',
    warrantyNote: 'Haceb ofrece 1 año de garantía desde la compra. Para reclamar, debes contactar directamente al distribuidor autorizado en Cali.',
  },
  mabe: {
    slug: 'mabe',
    name: 'Mabe',
    origin: 'México',
    priceRange: 'Económica a Media',
    availability: 'Buena — repuestos genéricos compatibles disponibles en Cali',
    commonFailures: [
      'Compresor de larga duración (pocas fallas antes de los 8 años)',
      'Sello de puerta deteriorado',
      'Temporizador en lavadoras antiguas',
      'Quemadores y chisperos en estufas',
    ],
    techNote: 'Los equipos Mabe son mecánicamente simples y muy reparables. La mayoría de fallas comunes tienen solución el mismo día con repuestos disponibles en Cali.',
    warrantyNote: 'Mabe Colombia ofrece 1 año de garantía. El servicio técnico autorizado en Cali puede ser demorado — una alternativa es servicio independiente certificado.',
  },
  whirlpool: {
    slug: 'whirlpool',
    name: 'Whirlpool',
    origin: 'Estados Unidos',
    priceRange: 'Media a Premium',
    availability: 'Buena — algunos repuestos originales requieren 2-5 días de espera',
    commonFailures: [
      'Módulo de control electrónico',
      'Sello de tambor en lavadoras frontales',
      'Compresor (falla poco frecuente pero costosa)',
      'Dispensador de agua e hielo',
    ],
    techNote: 'Whirlpool tiene buena construcción mecánica pero los repuestos originales no siempre están disponibles de inmediato en Cali. Contamos con proveedores para conseguirlos en 2-3 días hábiles.',
    warrantyNote: 'Whirlpool Colombia ofrece 1 año de garantía. Para equipos en garantía, recomendamos contactar primero al servicio técnico autorizado.',
  },
  challenger: {
    slug: 'challenger',
    name: 'Challenger',
    origin: 'Colombia',
    priceRange: 'Económica',
    availability: 'Muy buena — marca nacional con repuestos en Cali',
    commonFailures: [
      'Termostato en neveras',
      'Motor de lavadoras de carga superior',
      'Resistencia en duchas eléctricas',
      'Tarjeta de control en televisores',
    ],
    techNote: 'Challenger es la marca de electrodomésticos más accesible de Colombia y una de las más reparables. La simplicidad mecánica de sus equipos facilita el diagnóstico y reduce los tiempos de reparación.',
    warrantyNote: 'Challenger ofrece 1 año de garantía. Es una de las pocas marcas con centros de servicio propios en Cali.',
  },
}

// ── Combinaciones Servicio × Marca ────────────────────────────────────────────

export const SERVICE_MARCA_COMBOS: Record<string, ServiceMarcaCombo> = {
  // ── NEVERAS ───────────────────────────────────────────────────────────────
  'reparacion-neveras-cali--lg': {
    serviceSlug: 'reparacion-neveras-cali',
    serviceName: 'Neveras',
    marcaSlug: 'lg',
    metaTitle: 'Reparación Neveras LG en Cali | SomosTécnicos',
    metaDescription: 'Reparación de neveras LG en Cali: No Frost, side-by-side, puerta francesa e InstaView. Técnicos certificados con diagnóstico LG ThinQ. Diagnóstico $50.000.',
    h1: 'Reparación de Neveras LG en Cali',
    intro: 'Reparamos neveras LG de todas las líneas en Cali: desde los modelos básicos de dos puertas hasta los sistemas No Frost, side-by-side, puerta francesa e InstaView con compresor inverter. Contamos con diagnóstico especializado para equipos LG y acceso a repuestos originales el mismo día.',
    failures: [
      'Nevera LG no enfría — compresor inverter o sensor de temperatura',
      'Nevera LG hace mucho ruido — compresor o ventilador del evaporador',
      'LG No Frost acumula escarcha — defrost heater o termostato de deshielo',
      'Dispensador de agua LG no funciona — válvula solenoide o filtro tapado',
      'Pantalla LG InstaView no enciende — tarjeta de control o alimentación',
      'LG side-by-side no hace hielo — sensor Ice Maker o compresor',
    ],
    repairNote: 'Las neveras LG inverter requieren diagnóstico con software especializado para leer los códigos de error del compresor. Sin este diagnóstico, hay riesgo de remplazar piezas incorrectas. Todos nuestros técnicos están equipados para hacer este diagnóstico.',
    relatedBlogSlug: 'por-que-la-nevera-deja-de-enfriar',
  },
  'reparacion-neveras-cali--samsung': {
    serviceSlug: 'reparacion-neveras-cali',
    serviceName: 'Neveras',
    marcaSlug: 'samsung',
    metaTitle: 'Reparación Neveras Samsung en Cali | SomosTécnicos',
    metaDescription: 'Reparación de neveras Samsung en Cali: Family Hub, Bespoke, side-by-side y French Door. Diagnóstico SmartThings. Técnicos certificados. Diagnóstico $50.000.',
    h1: 'Reparación de Neveras Samsung en Cali',
    intro: 'Reparamos todas las líneas de neveras Samsung en Cali, incluyendo los modelos más avanzados con tecnología Bespoke y Family Hub. Contamos con acceso al diagnóstico SmartThings para leer los códigos de error de los equipos más recientes.',
    failures: [
      'Nevera Samsung no enfría — compresor Digital Inverter o tarjeta de control',
      'Samsung Family Hub pantalla no enciende — tarjeta principal o alimentación',
      'Nevera Samsung acumula escarcha — sistema de deshielo o sensor',
      'Dispensador de agua Samsung falla — filtro tapado o válvula solenoide',
      'Nevera Samsung hace ruido — ventilador del evaporador o condensador',
      'Ice Maker Samsung no produce hielo — sensor, válvula o temperatura',
    ],
    repairNote: 'Los modelos Samsung con tecnología Digital Inverter tienen un diagnóstico diferente al de compresores convencionales. Es importante no intentar reparar el compresor sin diagnóstico previo — el resultado puede ser un daño mayor.',
    relatedBlogSlug: 'por-que-la-nevera-deja-de-enfriar',
  },
  'reparacion-neveras-cali--haceb': {
    serviceSlug: 'reparacion-neveras-cali',
    serviceName: 'Neveras',
    marcaSlug: 'haceb',
    metaTitle: 'Reparación Neveras Haceb en Cali | SomosTécnicos',
    metaDescription: 'Reparación de neveras Haceb en Cali. Repuestos originales disponibles. Fallas de termostato, compresor, sello y gas. Diagnóstico $50.000 abonables.',
    h1: 'Reparación de Neveras Haceb en Cali',
    intro: 'Haceb es la marca de neveras que más reparamos en Cali. La amplia disponibilidad de repuestos originales y genéricos compatibles nos permite resolver la mayoría de fallas el mismo día de la visita. Atendemos modelos de una puerta, dos puertas y No Frost.',
    failures: [
      'Nevera Haceb no enfría — termostato, compresor o sello de puerta',
      'Haceb congela todo — termostato descalibrado',
      'Nevera Haceb hace ruido — compresor o ventilador',
      'Sello de puerta Haceb dañado — desgaste por uso o temperatura',
      'Nevera Haceb no arranca — compresor o relay de arranque',
      'Consumo eléctrico alto en Haceb — condensador sucio o sello deteriorado',
    ],
    repairNote: 'Haceb tiene una de las mejores redes de distribución de repuestos en Colombia. Para equipos con más de 10 años, también contamos con repuestos genéricos compatibles que ofrecen buena durabilidad a menor costo.',
    relatedBlogSlug: 'por-que-la-nevera-deja-de-enfriar',
  },
  'reparacion-neveras-cali--mabe': {
    serviceSlug: 'reparacion-neveras-cali',
    serviceName: 'Neveras',
    marcaSlug: 'mabe',
    metaTitle: 'Reparación Neveras Mabe en Cali | SomosTécnicos',
    metaDescription: 'Reparación de neveras Mabe en Cali. Fallas de compresor, termostato, sello y gas. Repuestos disponibles. Diagnóstico $50.000 abonables a la reparación.',
    h1: 'Reparación de Neveras Mabe en Cali',
    intro: 'Reparamos neveras Mabe de todas las referencias en Cali. Los equipos Mabe son conocidos por su robustez mecánica — cuando fallan, generalmente es en componentes accesibles como el termostato, el sello de puerta o el relay de arranque, lo que hace que las reparaciones sean más económicas que en marcas con tecnología más compleja.',
    failures: [
      'Nevera Mabe no enfría — sello de puerta o termostato (causa más frecuente)',
      'Mabe congela todo en el refrigerador — termostato fuera de calibración',
      'Nevera Mabe hace ruido — condensador sucio o compresor al final de vida útil',
      'No arranca — relay de arranque dañado (pieza de bajo costo)',
      'Acumulación de agua debajo — drenaje tapado',
      'Gas refrigerante bajo — fuga en el sistema',
    ],
    repairNote: 'La mayoría de fallas en neveras Mabe son resolubles el mismo día. El termostato y el relay de arranque son las piezas que más se solicitan — las tenemos en stock permanente.',
    relatedBlogSlug: 'por-que-la-nevera-deja-de-enfriar',
  },

  // ── LAVADORAS ──────────────────────────────────────────────────────────────
  'reparacion-lavadoras-cali--lg': {
    serviceSlug: 'reparacion-lavadoras-cali',
    serviceName: 'Lavadoras',
    marcaSlug: 'lg',
    metaTitle: 'Reparación Lavadoras LG en Cali | SomosTécnicos',
    metaDescription: 'Reparación de lavadoras LG en Cali: carga frontal y superior, tecnología Direct Drive e Inverter. Técnicos certificados. Diagnóstico $50.000 abonables.',
    h1: 'Reparación de Lavadoras LG en Cali',
    intro: 'Reparamos lavadoras LG de carga frontal y carga superior en Cali. La tecnología Direct Drive de LG es más silenciosa y eficiente, pero cuando falla el motor requiere diagnóstico especializado. Contamos con los equipos para realizar este diagnóstico correctamente.',
    failures: [
      'Lavadora LG no centrifuga — motor Direct Drive o tarjeta de control',
      'LG frontal vibra fuerte — rodamientos o sello de tambor desgastado',
      'Error UE en LG — ropa desequilibrada o rodamientos',
      'LG no drena — filtro de bomba tapado o bomba dañada',
      'Lavadora LG no enciende — tarjeta de control o alimentación',
      'LG tarda mucho en lavar — sensor de nivel o válvula de agua',
    ],
    repairNote: 'El motor Direct Drive de LG tiene garantía de 10 años en muchos modelos — verifica si tu equipo está en garantía antes de pagar la reparación. Para equipos fuera de garantía, el diagnóstico con software LG es indispensable para no cambiar el motor innecesariamente.',
    relatedBlogSlug: 'mantenimiento-lavadora-cada-cuanto',
  },
  'reparacion-lavadoras-cali--samsung': {
    serviceSlug: 'reparacion-lavadoras-cali',
    serviceName: 'Lavadoras',
    marcaSlug: 'samsung',
    metaTitle: 'Reparación Lavadoras Samsung en Cali | SomosTécnicos',
    metaDescription: 'Reparación de lavadoras Samsung en Cali: carga frontal y superior, Digital Inverter. Técnicos certificados. Diagnóstico $50.000 abonables a la reparación.',
    h1: 'Reparación de Lavadoras Samsung en Cali',
    intro: 'Reparamos lavadoras Samsung de todas las referencias en Cali. Los modelos con motor Digital Inverter ofrecen mayor eficiencia, pero requieren diagnóstico especializado cuando presentan fallas. Atendemos tanto lavadoras de carga frontal como de carga superior.',
    failures: [
      'Error 5E o SE Samsung — bomba de drenaje tapada o dañada',
      'Lavadora Samsung vibra — rodamientos o nivelación incorrecta',
      'No centrifuga Samsung — motor inverter o tarjeta de control',
      'Samsung no toma agua — válvula de entrada o filtro de manguera',
      'Error 4E Samsung — presión de agua baja o válvula',
      'Sello de tambor frontal Samsung — desgaste normal a los 5-7 años',
    ],
    repairNote: 'Los errores 5E y SE son los más frecuentes en lavadoras Samsung en Cali — normalmente se resuelven limpiando el filtro de la bomba, una operación que el usuario puede hacer con nuestra guía. Llámanos y te orientamos antes de programar una visita.',
    relatedBlogSlug: 'mantenimiento-lavadora-cada-cuanto',
  },
  'reparacion-lavadoras-cali--haceb': {
    serviceSlug: 'reparacion-lavadoras-cali',
    serviceName: 'Lavadoras',
    marcaSlug: 'haceb',
    metaTitle: 'Reparación Lavadoras Haceb en Cali | SomosTécnicos',
    metaDescription: 'Reparación de lavadoras Haceb en Cali. Repuestos originales disponibles. Fallas de motor, rodamientos, bomba y más. Diagnóstico $50.000 abonables.',
    h1: 'Reparación de Lavadoras Haceb en Cali',
    intro: 'Haceb es una de las marcas de lavadoras con mayor presencia en hogares caleños. Sus equipos de carga superior son conocidos por la durabilidad y la facilidad de reparación — contamos con amplio stock de repuestos originales y genéricos para todas las referencias.',
    failures: [
      'Lavadora Haceb no centrifuga — motor, correa o temporizador',
      'Haceb no drena — bomba de desagüe o manguera doblada',
      'Lavadora Haceb golpea fuerte — piezas de amortiguación o nivelación',
      'No agita — correa o sistema de transmisión',
      'Haceb pierde agua — sello de bomba o mangueras',
      'No enciende — tapa o sistema de bloqueo de seguridad',
    ],
    repairNote: 'Las lavadoras Haceb de carga superior tienen un diseño mecánico robusto y predecible. La mayoría de fallas tienen solución el mismo día con piezas disponibles en Cali.',
    relatedBlogSlug: 'mantenimiento-lavadora-cada-cuanto',
  },

  // ── CALENTADORES ──────────────────────────────────────────────────────────
  'reparacion-calentadores-cali--haceb': {
    serviceSlug: 'reparacion-calentadores-cali',
    serviceName: 'Calentadores',
    marcaSlug: 'haceb',
    metaTitle: 'Reparación Calentadores Haceb en Cali | SomosTécnicos',
    metaDescription: 'Reparación de calentadores Haceb en Cali: paso y acumulación. Fallas de quemadores, válvulas y piloto. Técnicos certificados en gas. Diagnóstico $50.000.',
    h1: 'Reparación de Calentadores Haceb en Cali',
    intro: 'Haceb fabrica los calentadores a gas más vendidos en Colombia. Reparamos calentadores Haceb de paso y de acumulación en Cali con técnicos certificados en instalaciones de gas — un requisito de seguridad que todo técnico que trabaje en este tipo de equipos debe cumplir.',
    failures: [
      'Calentador Haceb no enciende — piloto, termopar o válvula de gas',
      'Agua caliente Haceb no alcanza temperatura — quemadores sucios o válvula',
      'Haceb pierde agua — conexiones o tanque con corrosión',
      'Calentador Haceb hace ruido — sedimentos o quemadores',
      'Piloto Haceb se apaga solo — termopar desgastado',
      'No hay agua caliente suficiente — capacidad del equipo o sedimentos',
    ],
    repairNote: 'El termopar es la pieza que más falla en calentadores Haceb con más de 5 años de uso — es una pieza de bajo costo que resuelve el problema de piloto que se apaga solo. La tenemos en stock permanente.',
    relatedBlogSlug: 'senales-calentador-necesita-mantenimiento',
  },
  'reparacion-calentadores-cali--challenger': {
    serviceSlug: 'reparacion-calentadores-cali',
    serviceName: 'Calentadores',
    marcaSlug: 'challenger',
    metaTitle: 'Reparación Calentadores Challenger en Cali | SomosTécnicos',
    metaDescription: 'Reparación de calentadores Challenger en Cali. Técnicos certificados en gas. Fallas de quemadores, válvulas, piloto y termopar. Diagnóstico $50.000.',
    h1: 'Reparación de Calentadores Challenger en Cali',
    intro: 'Reparamos calentadores Challenger de paso y eléctricos en Cali. Challenger es una de las marcas de calentadores más económicas del mercado colombiano, y su diseño sencillo hace que la mayoría de fallas sean reparables con bajo costo y piezas disponibles localmente.',
    failures: [
      'Calentador Challenger no enciende — válvula de gas o termopar',
      'Agua fría con Challenger — quemadores obstruidos o válvula de gas',
      'Challenger gotea agua — empaques de conexiones o soldadura',
      'Piloto se apaga constantemente — termopar o corriente de aire',
      'Calentador Challenger hace explosiones al encender — acumulación de gas (emergencia)',
      'Poca presión de agua caliente — filtro de entrada obstruido',
    ],
    repairNote: 'Si el calentador Challenger hace explosiones o detonaciones al encender, es una emergencia — abre ventanas, no uses llamas ni interruptores y llama de inmediato. Este síntoma indica acumulación de gas y requiere revisión urgente.',
    relatedBlogSlug: 'senales-calentador-necesita-mantenimiento',
  },
}

// Helper para construir el slug de combinación
export function getComboKey(serviceSlug: string, marcaSlug: string): string {
  return `${serviceSlug}--${marcaSlug}`
}

// Obtener todas las marcas disponibles para un servicio
export function getMarcasForService(serviceSlug: string): string[] {
  return Object.values(SERVICE_MARCA_COMBOS)
    .filter((c) => c.serviceSlug === serviceSlug)
    .map((c) => c.marcaSlug)
}

// Obtener todos los servicios disponibles para una marca
export function getServicesForMarca(marcaSlug: string): string[] {
  return Object.values(SERVICE_MARCA_COMBOS)
    .filter((c) => c.marcaSlug === marcaSlug)
    .map((c) => c.serviceSlug)
}

export const COMBOS_LIST = Object.values(SERVICE_MARCA_COMBOS)
