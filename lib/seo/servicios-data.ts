/**
 * Fuente de verdad centralizada para las 9 páginas de servicio SEO.
 * Todos los datos de metadata, schemas y contenido se extraen de aquí.
 */

export interface ServicioFAQ {
  q: string
  a: string
}

export interface ServicioSEOData {
  slug: string
  h1: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalPath: string
  heroImage: string
  heroImageAlt: string
  description: string
  problems: string[]
  brands: string[]
  faqs: ServicioFAQ[]
  zones: string[]
  schemaServiceType: string
}

const ZONES = ['Cali', 'Yumbo', 'Jamundí', 'Palmira', 'Candelaria', 'Norte de Cali', 'Sur de Cali', 'Oeste de Cali']

export const SERVICIOS_DATA: Record<string, ServicioSEOData> = {
  'reparacion-neveras-cali': {
    slug: 'reparacion-neveras-cali',
    h1: 'Reparación de Neveras en Cali a Domicilio',
    metaTitle: 'Reparación Neveras Cali | Técnico a Domicilio',
    metaDescription: 'Técnico en neveras a domicilio en Cali. Reparamos LG, Samsung, Mabe, Haceb. No enfría, gotea, hace ruido. Garantía 30 días. Llámanos al +57 300 3094854.',
    keywords: ['reparación neveras cali', 'arreglo nevera cali', 'técnico neveras cali', 'nevera no enfría cali', 'servicio técnico nevera cali', 'reparar nevera a domicilio cali'],
    canonicalPath: '/servicios/reparacion-neveras-cali',
    heroImage: '/hero-servicios/servicio-tecnico-neveras-nevecones-lg.png',
    heroImageAlt: 'Técnico reparando nevera LG en Cali',
    description: 'Servicio técnico especializado en reparación y mantenimiento de neveras y nevecones a domicilio en Cali y sus alrededores. Atendemos todas las marcas con técnicos certificados y garantía incluida.',
    problems: [
      'Nevera no enfría o enfría poco',
      'Acumula escarcha o hielo en exceso',
      'Hace ruido extraño o vibra mucho',
      'Gotea agua en la parte interior o exterior',
      'No enciende o se apaga sola',
      'Mantenimiento preventivo y limpieza de condensador',
    ],
    brands: ['LG', 'Samsung', 'Whirlpool', 'Mabe', 'Electrolux', 'Haceb', 'Challenger', 'Frigidaire'],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar una nevera en Cali?',
        a: 'La visita de diagnóstico tiene un costo de $50.000 pesos. El precio de la reparación varía según la complejidad, los repuestos requeridos y la tecnología del equipo — no existe tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Qué marcas de neveras reparan?',
        a: 'Reparamos todas las marcas: LG, Samsung, Whirlpool, Mabe, Electrolux, Haceb, Challenger, Frigidaire y más. Contamos con repuestos originales y técnicos especializados.',
      },
      {
        q: '¿Cuánto tiempo tarda la reparación de una nevera?',
        a: 'La mayoría de reparaciones se completan el mismo día. En casos que requieren repuestos especiales puede tomar 2-3 días hábiles. Siempre le informamos el tiempo estimado antes de comenzar.',
      },
      {
        q: '¿Tienen garantía en la reparación de neveras?',
        a: 'Sí, ofrecemos 30 días de garantía en reparaciones de neveras. Si el problema vuelve dentro del período de garantía, lo atendemos sin costo adicional.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Appliance Repair',
  },

  'reparacion-lavadoras-cali': {
    slug: 'reparacion-lavadoras-cali',
    h1: 'Reparación de Lavadoras en Cali a Domicilio',
    metaTitle: 'Reparación Lavadoras Cali | Carga Frontal y Superior',
    metaDescription: 'Técnico en lavadoras en Cali. Carga frontal y superior. No gira, no drena, vibra, no enciende. LG, Samsung, Whirlpool. Garantía incluida. Servicio a domicilio.',
    keywords: ['reparación lavadoras cali', 'técnico lavadoras cali', 'lavadora no gira cali', 'arreglo lavadora cali', 'lavadora no drena cali', 'servicio técnico lavadora cali'],
    canonicalPath: '/servicios/reparacion-lavadoras-cali',
    heroImage: '/hero-servicios/lavadora_lg_1.png',
    heroImageAlt: 'Técnico reparando lavadora en Cali',
    description: 'Reparamos lavadoras de carga frontal y superior de todas las marcas a domicilio en Cali. Técnicos certificados con experiencia en diagnóstico y reparación de fallas eléctricas y mecánicas.',
    problems: [
      'Lavadora no enciende o no arranca',
      'No gira el tambor durante el lavado',
      'No drena el agua correctamente',
      'Vibra o hace ruido excesivo durante el centrifugado',
      'Deja la ropa con manchas o sin lavar bien',
      'Mantenimiento preventivo y limpieza de filtros',
    ],
    brands: ['LG', 'Samsung', 'Whirlpool', 'Mabe', 'Electrolux', 'Haceb', 'Challenger'],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar una lavadora en Cali?',
        a: 'La visita de diagnóstico cuesta $50.000 pesos. El precio de la reparación varía según la falla, los repuestos y la tecnología de la lavadora — no hay tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Reparan lavadoras de carga frontal y superior?',
        a: 'Sí, reparamos ambos tipos: lavadoras de carga frontal (horizontal) y de carga superior (top load). Tenemos técnicos especializados en las principales marcas del mercado colombiano.',
      },
      {
        q: '¿Cuánto tiempo tarda la reparación de una lavadora?',
        a: 'En la mayoría de los casos, la reparación se hace el mismo día. Si se requieren repuestos especiales, puede tomar entre 2 y 3 días hábiles. Le notificaremos el tiempo exacto tras el diagnóstico.',
      },
      {
        q: '¿Tienen garantía en la reparación de lavadoras?',
        a: 'Ofrecemos 30 días de garantía en todas las reparaciones de lavadoras. Si el problema persiste o regresa dentro del período de garantía, lo solucionamos sin costo adicional.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Appliance Repair',
  },

  'reparacion-secadoras-cali': {
    slug: 'reparacion-secadoras-cali',
    h1: 'Reparación de Secadoras en Cali a Domicilio',
    metaTitle: 'Reparación Secadoras Cali | Gas y Eléctricas',
    metaDescription: 'Técnico en secadoras en Cali. A gas y eléctricas. No calienta, no gira, hace ruido. LG, Samsung, Whirlpool. Servicio a domicilio con garantía de 30 días.',
    keywords: ['reparación secadoras cali', 'técnico secadoras cali', 'secadora no calienta cali', 'arreglo secadora cali', 'secadora no gira cali'],
    canonicalPath: '/servicios/reparacion-secadoras-cali',
    heroImage: '/hero-servicios/secadora-lg-2.png',
    heroImageAlt: 'Técnico reparando secadora en Cali',
    description: 'Reparamos secadoras a gas y eléctricas de todas las marcas a domicilio en Cali. Diagnóstico rápido y reparación el mismo día en la mayoría de casos.',
    problems: [
      'Secadora no calienta el aire',
      'No gira el tambor',
      'Hace ruido excesivo durante el ciclo',
      'Se apaga sola antes de terminar',
      'No enciende o no arranca',
      'Demora demasiado en secar la ropa',
    ],
    brands: ['LG', 'Samsung', 'Whirlpool', 'Mabe', 'Electrolux', 'Haceb'],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar una secadora en Cali?',
        a: 'La visita técnica de diagnóstico cuesta $50.000 pesos. El precio varía según la falla y los repuestos requeridos — no hay tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Reparan secadoras a gas y eléctricas?',
        a: 'Sí, trabajamos con ambos tipos de secadoras. Contamos con técnicos especializados en sistemas de calefacción a gas y resistencias eléctricas.',
      },
      {
        q: '¿Cuánto tiempo tarda la reparación?',
        a: 'La mayoría de reparaciones se realizan el mismo día. En casos que requieren repuestos especiales, el tiempo puede extenderse entre 2 y 3 días hábiles.',
      },
      {
        q: '¿Tienen garantía en la reparación de secadoras?',
        a: 'Sí, 30 días de garantía en todas las reparaciones. Si el problema regresa dentro del período de garantía, lo atendemos sin costo.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Appliance Repair',
  },

  'reparacion-estufas-hornos-cali': {
    slug: 'reparacion-estufas-hornos-cali',
    h1: 'Reparación de Estufas y Hornos en Cali',
    metaTitle: 'Reparación Estufas y Hornos Cali | A Domicilio',
    metaDescription: 'Técnico en estufas y hornos en Cali. Llama baja, quemador no prende, olor a gas, horno no calienta. Mabe, Haceb, Challenger. Diagnóstico a domicilio.',
    keywords: ['reparación estufas cali', 'arreglo estufa gas cali', 'técnico estufas cali', 'reparación hornos cali', 'estufa no prende cali', 'servicio técnico estufas cali'],
    canonicalPath: '/servicios/reparacion-estufas-hornos-cali',
    heroImage: '/hero-servicios/estufa-de-empotrar-challenger-alpha-gris-y-negro-582x512cm-de-gas-natural-con-cuatro-quemadores_2.png',
    heroImageAlt: 'Técnico reparando estufa empotrable en Cali',
    description: 'Servicio técnico en estufas a gas, eléctricas y de inducción, y hornos de empotrar en Cali. Diagnóstico y reparación segura con técnicos certificados en gas y electricidad.',
    problems: [
      'Llama muy baja o irregular en los quemadores',
      'Quemador no prende con la chispa',
      'Olor a gas al encender o en reposo',
      'Horno no calienta o no mantiene temperatura',
      'Termostato dañado o inexacto',
      'Mantenimiento preventivo de estufas a gas',
    ],
    brands: ['Mabe', 'Haceb', 'Challenger', 'Whirlpool', 'Samsung', 'Electrolux', 'Indurama'],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar una estufa a gas en Cali?',
        a: 'La visita técnica de diagnóstico cuesta $50.000 pesos. El precio varía según la falla y los repuestos — no hay tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Es seguro reparar estufas a gas en casa?',
        a: 'Sí, cuando lo hace un técnico certificado. Nuestros técnicos están capacitados en instalaciones a gas y cumplen con todas las normas de seguridad vigentes en Colombia.',
      },
      {
        q: '¿Reparan estufas de empotrar y hornos eléctricos?',
        a: 'Sí, trabajamos con estufas empotrables, hornos eléctricos y a gas, y microondas de todas las marcas principales del mercado colombiano.',
      },
      {
        q: '¿Cuál es el tiempo de reparación de una estufa?',
        a: 'La mayoría de reparaciones de estufas se hacen el mismo día. Si se requieren repuestos específicos, puede tomar entre 1 y 3 días hábiles.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Appliance Repair',
  },

  'reparacion-calentadores-cali': {
    slug: 'reparacion-calentadores-cali',
    h1: 'Reparación de Calentadores en Cali a Domicilio',
    metaTitle: 'Reparación Calentadores Cali | Paso y Acumulación',
    metaDescription: 'Técnico en calentadores en Cali. De paso y acumulación. No calienta agua, se apaga, fuga, explosiones al encender. Challenger, Haceb. Garantía incluida.',
    keywords: ['reparación calentadores cali', 'técnico calentadores cali', 'calentador no calienta agua cali', 'arreglo calentador gas cali', 'instalación calentador cali', 'calentador paso cali'],
    canonicalPath: '/servicios/reparacion-calentadores-cali',
    heroImage: '/hero-servicios/calentador-bosch.png',
    heroImageAlt: 'Técnico reparando calentador de paso en Cali',
    description: 'Reparamos e instalamos calentadores de paso y de acumulación a gas y eléctricos en Cali. Técnicos certificados para diagnóstico seguro y reparaciones con garantía.',
    problems: [
      'Calentador no calienta el agua',
      'Se apaga solo durante el uso',
      'Fuga de agua en el equipo',
      'Explosiones o encendido irregular',
      'Poca presión de agua caliente',
      'Instalación de calentadores nuevos',
    ],
    brands: ['Challenger', 'Haceb', 'Rheem', 'A.O. Smith', 'Lorenzetti', 'Bosch'],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar un calentador en Cali?',
        a: 'La visita técnica de diagnóstico cuesta $50.000 pesos. El precio varía según la falla, el modelo y los repuestos — no hay tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Reparan calentadores de paso y de acumulación?',
        a: 'Sí, trabajamos con ambos tipos: calentadores de paso (instantáneos) y de acumulación (tanque), tanto a gas como eléctricos.',
      },
      {
        q: '¿También instalan calentadores nuevos?',
        a: 'Sí, realizamos instalaciones de calentadores nuevos con todas las conexiones de gas o eléctricas necesarias, cumpliendo las normas de seguridad colombianas.',
      },
      {
        q: '¿Cuál es la garantía en reparación de calentadores?',
        a: 'Ofrecemos 30 días de garantía en las reparaciones de calentadores. Si el problema persiste, lo solucionamos sin costo adicional.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Appliance Repair',
  },

  'reparacion-televisores-cali': {
    slug: 'reparacion-televisores-cali',
    h1: 'Reparación de Televisores en Cali a Domicilio',
    metaTitle: 'Reparación Televisores Cali | LED, LCD, Smart TV',
    metaDescription: 'Técnico en televisores en Cali. LED, LCD, Smart TV, 4K. Pantalla negra, no enciende, imagen distorsionada, sin WiFi. LG, Samsung, Sony. Servicio a domicilio.',
    keywords: ['reparación televisores cali', 'arreglo tv cali', 'técnico televisores cali', 'tv pantalla negra cali', 'reparar smart tv cali', 'técnico tv led cali'],
    canonicalPath: '/servicios/reparacion-televisores-cali',
    heroImage: '/hero-servicios/televisor-oled-lg.png',
    heroImageAlt: 'Técnico reparando televisor LED en Cali',
    description: 'Reparamos televisores LED, LCD, OLED y Smart TV de todas las marcas a domicilio en Cali. Diagnóstico de tarjetas electrónicas, pantallas, backlights y sistemas de conectividad.',
    problems: [
      'Pantalla negra con sonido',
      'No enciende o no da señal',
      'Imagen distorsionada, rayas o manchas',
      'Sin conexión WiFi o Bluetooth',
      'Audio sin imagen o imagen sin audio',
      'Pantalla con líneas horizontales o verticales',
    ],
    brands: ['LG', 'Samsung', 'Sony', 'Panasonic', 'TCL', 'Hisense', 'Kalley'],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar un televisor en Cali?',
        a: 'La visita de diagnóstico cuesta $50.000 pesos. El precio varía según la falla (backlight, tarjeta de poder, pantalla) y la tecnología del equipo — no hay tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Reparan Smart TV y televisores 4K?',
        a: 'Sí, trabajamos con Smart TV de todas las plataformas (webOS, Tizen, Android TV) y televisores 4K y QLED de las principales marcas.',
      },
      {
        q: '¿Vale la pena reparar un televisor antiguo?',
        a: 'Depende de la falla y el valor del equipo. Hacemos el diagnóstico y le informamos el costo para que pueda decidir si conviene reparar o reemplazar el televisor.',
      },
      {
        q: '¿Cuánto tiempo tarda la reparación de un televisor?',
        a: 'El diagnóstico es inmediato. Reparaciones simples (backlight, fusibles) se hacen el mismo día. Reparaciones de pantalla o tarjetas pueden tomar entre 3 y 7 días.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Electronics Repair',
  },

  'electricista-a-domicilio-cali': {
    slug: 'electricista-a-domicilio-cali',
    h1: 'Electricista a Domicilio en Cali',
    metaTitle: 'Electricista Cali | A Domicilio | SomosTécnicos',
    metaDescription: 'Electricista certificado a domicilio en Cali. Cortocircuitos, tableros, cableado, instalaciones, breakers. Schneider, Legrand. Presupuesto sin costo. Atención urgente.',
    keywords: ['electricista cali', 'electricista a domicilio cali', 'instalaciones eléctricas cali', 'tablero eléctrico cali', 'cortocircuito cali', 'electricista certificado cali'],
    canonicalPath: '/servicios/electricista-a-domicilio-cali',
    heroImage: '/especialistas/electricista2.jpg',
    heroImageAlt: 'Electricista certificado realizando instalación eléctrica en Cali',
    description: 'Electricistas certificados a domicilio en Cali para instalaciones eléctricas residenciales y comerciales, reparación de tableros, cableado y mantenimiento preventivo. Cumplimos el Reglamento Técnico de Instalaciones Eléctricas RETIE.',
    problems: [
      'Cortocircuito o sin energía en sectores del hogar',
      'Instalación eléctrica nueva (puntos, tomas, interruptores)',
      'Breakers que se caen o se recalientan',
      'Olor a quemado en tomacorrientes o cables',
      'Mantenimiento de tablero eléctrico',
      'Instalación de luces LED y sistemas de iluminación',
    ],
    brands: ['Schneider Electric', 'Legrand', 'Siemens', 'ABB', 'General Electric', 'Eaton'],
    faqs: [
      {
        q: '¿Cuánto cuesta un electricista a domicilio en Cali?',
        a: 'El precio depende del tipo de trabajo (instalación, cortocircuito, tablero, etc.) — no hay tarifa fija. La visita de diagnóstico cuesta $50.000 pesos; si apruebas el trabajo dentro del mes siguiente, ese valor se abona al total.',
      },
      {
        q: '¿Los electricistas cumplen normas RETIE?',
        a: 'Sí, todos nuestros técnicos están capacitados y certificados en el Reglamento Técnico de Instalaciones Eléctricas (RETIE) vigente en Colombia.',
      },
      {
        q: '¿Atienden emergencias eléctricas en Cali?',
        a: 'Sí, atendemos situaciones urgentes como cortocircuitos, incendios eléctricos o pérdida total de energía. Contáctenos al +57 300 3094854 para atención prioritaria.',
      },
      {
        q: '¿Hacen instalaciones eléctricas completas?',
        a: 'Sí, realizamos instalaciones eléctricas completas para viviendas nuevas, remodelaciones, oficinas y locales comerciales. Entregamos certificado de instalación.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Electrician',
  },

  'tecnico-computadores-redes-cali': {
    slug: 'tecnico-computadores-redes-cali',
    h1: 'Técnico en Computadores y Redes en Cali',
    metaTitle: 'Técnico Computadores Redes Cali | PC y Portátiles',
    metaDescription: 'Técnico en computadores en Cali. PC lentos, virus, pantalla azul, formateo, WiFi, impresoras. HP, Dell, Lenovo, Apple. Servicio a domicilio en Cali.',
    keywords: ['técnico computadores cali', 'reparación pc cali', 'técnico portátiles cali', 'formateo computador cali', 'redes wifi cali', 'soporte técnico computadores cali'],
    canonicalPath: '/servicios/tecnico-computadores-redes-cali',
    heroImage: '/hero-servicios/redes-computaciones.png',
    heroImageAlt: 'Técnico reparando computador portátil en Cali',
    description: 'Soporte técnico en computadores de escritorio, portátiles y redes a domicilio en Cali. Reparación de hardware, eliminación de virus, formateo, configuración de redes WiFi e impresoras.',
    problems: [
      'Computador lento o con virus/malware',
      'No enciende o pantalla azul (BSOD)',
      'Formateo e instalación de sistema operativo',
      'Problemas de Internet y WiFi',
      'Impresora no funciona o no imprime',
      'Configuración de redes domésticas y empresariales',
    ],
    brands: ['HP', 'Dell', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Samsung', 'Cisco', 'TP-Link'],
    faqs: [
      {
        q: '¿Cuánto cuesta el técnico de computadores a domicilio en Cali?',
        a: 'La visita de diagnóstico cuesta $50.000 pesos. El precio varía según el servicio requerido (formateo, virus, hardware, redes) — no hay tarifa fija. Si apruebas el trabajo dentro del mes siguiente al diagnóstico, los $50.000 se abonan al total.',
      },
      {
        q: '¿Atienden computadores Mac y Windows?',
        a: 'Sí, trabajamos con equipos Windows (HP, Dell, Lenovo, Asus, Acer) y computadores Apple Mac. Tenemos técnicos especializados en ambas plataformas.',
      },
      {
        q: '¿Cuánto tarda un formateo de computador?',
        a: 'Un formateo completo con instalación de Windows y drivers básicos tarda entre 2 y 4 horas. Si necesita instalar programas adicionales, puede tomar más tiempo.',
      },
      {
        q: '¿Garantía en servicios de computación?',
        a: 'Ofrecemos 60 días de garantía en servicios de computación y redes. Si el problema regresa dentro de ese período, lo atendemos sin costo.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Computer Repair',
  },

  'camaras-seguridad-alarmas-cali': {
    slug: 'camaras-seguridad-alarmas-cali',
    h1: 'Instalación de Cámaras de Seguridad en Cali',
    metaTitle: 'Cámaras Seguridad Alarmas Cali | CCTV | SomosTécnicos',
    metaDescription: 'Instalación y mantenimiento de cámaras CCTV, alarmas y control de acceso en Cali. Hikvision, Dahua, ZKTeco. Monitoreo desde tu celular. Diagnóstico gratis.',
    keywords: ['cámaras seguridad cali', 'instalación CCTV cali', 'alarmas cali', 'control de acceso cali', 'sistema de seguridad cali', 'cámaras vigilancia cali'],
    canonicalPath: '/servicios/camaras-seguridad-alarmas-cali',
    heroImage: '/hero-servicios/nvr-camaras-seguridad.png',
    heroImageAlt: 'Instalación de cámaras de seguridad CCTV en Cali',
    description: 'Instalación, configuración y mantenimiento de sistemas de seguridad electrónica en Cali: cámaras CCTV, alarmas perimetrales, control de acceso y citofones. Monitoreo remoto desde su celular.',
    problems: [
      'Instalación de cámaras CCTV y DVR/NVR',
      'Monitoreo remoto desde celular o PC',
      'Cámaras sin imagen o que no graban',
      'Instalación de alarmas perimetrales',
      'Control de acceso por huella o tarjeta',
      'Mantenimiento y actualización de sistemas existentes',
    ],
    brands: ['Hikvision', 'Dahua', 'ZKTeco', 'Bosch', 'Axis', 'Paradox', 'DSC'],
    faqs: [
      {
        q: '¿Cuánto cuesta instalar cámaras de seguridad en Cali?',
        a: 'El precio depende del número de cámaras, tipo de equipo y área a cubrir. Hacemos visita de diagnóstico sin costo para elaborar un presupuesto detallado y personalizado.',
      },
      {
        q: '¿Puedo ver las cámaras desde mi celular?',
        a: 'Sí, instalamos sistemas con visualización remota en tiempo real desde cualquier dispositivo móvil o computador con Internet. Incluye configuración completa de la app.',
      },
      {
        q: '¿Qué tipo de cámaras instalan?',
        a: 'Instalamos cámaras IP, analógicas HD, domo, tipo bala, PTZ y de reconocimiento facial. Trabajamos con las marcas más reconocidas: Hikvision, Dahua y Axis.',
      },
      {
        q: '¿Cuánto tiempo tarda la instalación?',
        a: 'Un sistema básico de 4 cámaras con DVR se instala en medio día. Sistemas más grandes o en varios pisos pueden tomar 1 a 2 días. Incluimos capacitación en el uso del sistema.',
      },
    ],
    zones: ZONES,
    schemaServiceType: 'Security System Installation',
  },
}

export const SERVICIOS_LIST = Object.values(SERVICIOS_DATA)
