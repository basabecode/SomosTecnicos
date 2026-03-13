import type { BlogPost } from './types'

export const electricidadPosts: Record<string, BlogPost> = {
  'breaker-se-cae-constantemente': {
    slug: 'breaker-se-cae-constantemente',
    title: 'Breaker se cae constantemente: causas y qué debes hacer',
    metaTitle: 'Breaker Se Cae Constantemente: Causas y Solución | SomosTécnicos',
    metaDescription: 'Si el breaker o interruptor se dispara repetidamente, hay un problema eléctrico real. Aprende las causas más frecuentes y cuándo es urgente llamar al electricista.',
    keywords: [
      'breaker se cae constantemente',
      'interruptor eléctrico se dispara',
      'breaker que se dispara',
      'cortacircuitos salta seguido',
      'problemas eléctricos Cali',
    ],
    canonicalPath: '/blog/breaker-se-cae-constantemente',
    heroImage: '/blog/electricidad/breaker-se-cae.avif',
    heroImageAlt: 'caja de breakers eléctricos doméstica con uno de los interruptores en posición disparada',
    cardImage: '/blog/electricidad/breaker-se-cae.avif',
    cardImageAlt: 'Tablero eléctrico con breaker disparado en posición media',
    excerpt: 'Un breaker que se dispara una vez puede ser un pico de consumo. Uno que se dispara repetidamente indica un problema real en el circuito que no debe ignorarse.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-12',
    readTime: 4,
    relatedServiceSlug: 'electricista-a-domicilio-cali',
    relatedServiceLabel: 'Electricista a Domicilio en Cali',
    sections: [
      {
        heading: 'La función del breaker y por qué se dispara',
        paragraphs: [
          'El breaker (interruptor termomagnético) es el dispositivo de seguridad eléctrica más importante del hogar. Su función es interrumpir el circuito automáticamente cuando detecta una corriente mayor a la que el cableado puede soportar de forma segura.',
          'Cuando un breaker se dispara, está haciendo exactamente su trabajo. El problema es la causa que generó esa corriente excesiva.',
        ],
      },
      {
        heading: 'Causa 1: Sobrecarga del circuito',
        paragraphs: [
          'La causa más frecuente de un breaker que se dispara es la sobrecarga: se están conectando demasiados electrodomésticos en el mismo circuito, y la suma de su consumo supera la capacidad del breaker.',
          'La solución inmediata es desconectar algunos equipos. La solución definitiva es analizar el consumo del circuito y considerar añadir circuitos adicionales si el hogar lo requiere.',
        ],
        tips: [
          'Suma las potencias (en vatios) de todos los equipos conectados al circuito. Un breaker de 15A a 120V soporta máximo 1.800 vatios de forma continua.',
          'Los electrodomésticos de alta potencia (aire acondicionado, ducha eléctrica, horno eléctrico) deben tener su propio circuito dedicado.',
          'Las extensiones eléctricas sobrecargadas son una de las causas más frecuentes de incendios eléctricos domésticos.',
        ],
      },
      {
        heading: 'Causa 2: Cortocircuito en el cableado o un electrodoméstico',
        paragraphs: [
          'Un cortocircuito ocurre cuando el cable vivo (fase) hace contacto directo con el neutro o con tierra, generando una corriente altísima que dispara el breaker inmediatamente.',
          'Para identificar si el problema es un electrodoméstico específico: desconecta todos los equipos del circuito y restablece el breaker. Luego conecta los equipos uno por uno — cuando el breaker se dispare de nuevo, el último equipo conectado es el problema.',
        ],
        warning: 'Si el breaker se dispara inmediatamente al restablecerlo sin nada conectado, el cortocircuito está en el cableado de la pared. Esto requiere electricista — no intentes usar ese circuito.',
      },
      {
        heading: 'Causa 3: Breaker desgastado',
        paragraphs: [
          'Los breakers tienen una vida útil. Con el tiempo, el mecanismo interno se desgasta y el breaker puede empezar a dispararse a corrientes más bajas de lo especificado — incluso con cargas normales.',
          'Un breaker desgastado generalmente tiene más de 15-20 años de uso, o ha sufrido muchos disparos por sobrecarga o cortocircuito. La solución es el reemplazo del breaker.',
        ],
      },
      {
        heading: 'Causa 4: Humedad en el tablero eléctrico',
        paragraphs: [
          'La humedad dentro de la caja de breakers puede generar corrientes de fuga que disparan el breaker o, peor aún, que generen arcos eléctricos que son un riesgo de incendio.',
          'Si hay signos de humedad (condensación, óxido en los tornillos, manchas de humedad en el interior de la caja) requiere revisión técnica urgente.',
        ],
      },
      {
        heading: 'Causa 5: Breaker subdimensionado',
        paragraphs: [
          'Si en el hogar se añadieron equipos de alto consumo (aire acondicionado, ducha eléctrica de alta potencia, calentador eléctrico) sin actualizar el circuito, puede ser que el breaker instalado no tenga la capacidad suficiente para la carga actual.',
          'La solución no es simplemente poner un breaker de mayor amperaje — el cableado también debe tener la sección correcta para soportar esa corriente.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Es peligroso "bloquear" un breaker que se dispara para que no se caiga?',
        a: 'Sí, es extremadamente peligroso. Bloquear un breaker en posición ON elimina la protección del circuito — si hay un cortocircuito o sobrecarga, el cableado puede sobrecalentarse y causar un incendio. Nunca bloquees ni "puentees" un breaker.',
      },
      {
        q: '¿Con qué frecuencia debo revisar mi tablero eléctrico?',
        a: 'La revisión técnica del tablero eléctrico se recomienda cada 5 años en instalaciones relativamente nuevas, y cada 2-3 años en instalaciones de más de 15 años. Cualquier señal de anomalía (breakers que se caen, calor en el tablero, olor a quemado) es motivo de revisión inmediata.',
      },
    ],
  },

  'luces-parpadean-en-casa-causas': {
    slug: 'luces-parpadean-en-casa-causas',
    title: 'Luces que parpadean en casa: causas eléctricas y cuándo preocuparse',
    metaTitle: 'Luces Parpadean en Casa: Causas Eléctricas | SomosTécnicos',
    metaDescription: 'El parpadeo de luces no siempre es un problema de bombillas. Puede indicar conexiones sueltas o fluctuaciones de voltaje. Aprende a identificar el origen.',
    keywords: [
      'luces parpadean en casa',
      'luces que titilan',
      'luces intermitentes causas',
      'fluctuación de voltaje hogar',
      'problemas eléctricos iluminación Colombia',
    ],
    canonicalPath: '/blog/luces-parpadean-en-casa-causas',
    heroImage: '/blog/electricidad/luces-parpadean-hogar.avif',
    heroImageAlt: 'lámpara LED parpadeando en habitación oscura indicando problema eléctrico en el circuito',
    cardImage: '/blog/electricidad/luces-parpadean-hogar.avif',
    cardImageAlt: 'Luz LED parpadeando en habitación con problema eléctrico',
    excerpt: 'El parpadeo ocasional puede ser la bombilla. El parpadeo frecuente, especialmente cuando arranca un electrodoméstico, indica un problema en el sistema eléctrico.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-12',
    readTime: 4,
    relatedServiceSlug: 'electricista-a-domicilio-cali',
    relatedServiceLabel: 'Electricista a Domicilio en Cali',
    sections: [
      {
        heading: 'No todo parpadeo es igual',
        paragraphs: [
          'Hay tres tipos de parpadeo que tienen causas completamente diferentes: el parpadeo de una sola lámpara, el parpadeo de un circuito específico y el parpadeo de toda la casa simultáneamente. Identificar cuál es el tuyo dirige el diagnóstico.',
        ],
      },
      {
        heading: 'Parpadeo en una sola lámpara: problema de la bombilla o la luminaria',
        paragraphs: [
          'Si solo una lámpara parpadea y las demás están bien, el problema es casi siempre de esa bombilla o de su portalámparas. Las bombillas LED de baja calidad son especialmente propensas al parpadeo.',
          'Prueba reemplazando la bombilla con otra de buena calidad del mismo tipo. Si el parpadeo persiste con bombilla nueva, el problema está en el portalámparas o en el switch.',
        ],
        tips: [
          'Las bombillas LED incompatibles con dimmers (reguladores de intensidad) siempre parpadean. Usa bombillas específicamente marcadas como "dimmable".',
          'Un portalámparas con el contacto oxidado o deformado puede causar parpadeo intermitente.',
          'Aprieta ligeramente la bombilla — un contacto flojo también genera parpadeo.',
        ],
      },
      {
        heading: 'Parpadeo cuando arranca un electrodoméstico: caída de voltaje',
        paragraphs: [
          'Si las luces parpadean cuando enciende el aire acondicionado, la lavadora, la nevera o cualquier motor eléctrico, es un comportamiento de caída momentánea de voltaje (voltage sag). Los motores consumen mucha corriente al arrancar y eso puede reducir brevemente el voltaje en el circuito.',
          'Un parpadeo muy leve y breve al arrancar un equipo de motor es normal. Un parpadeo pronunciado o que dura más de 2-3 segundos indica que el circuito no tiene capacidad suficiente o hay una conexión deficiente.',
        ],
      },
      {
        heading: 'Parpadeo en toda la casa: neutro suelto (emergencia)',
        paragraphs: [
          'Si las luces de toda la casa parpadean simultáneamente, especialmente si el parpadeo sigue un patrón donde unas se encienden más y otras menos, la causa puede ser un neutro suelto en el tablero principal.',
          'Un neutro suelto es una falla seria que puede causar voltajes inestables en toda la instalación, lo que puede dañar electrodomésticos sensibles y representa un riesgo de incendio.',
        ],
        warning: 'Si las luces parpadean en toda la casa simultáneamente y algunos electrodomésticos muestran comportamiento inusual (televisor que se reinicia, nevera que hace sonidos extraños), llama a un electricista urgentemente — no esperes.',
      },
      {
        heading: 'Causa externa: fluctuaciones del proveedor de energía',
        paragraphs: [
          'En algunos sectores de Cali y del Valle del Cauca, las fluctuaciones de voltaje de la red de distribución pueden causar parpadeo en los hogares. Si el parpadeo ocurre al mismo tiempo en varios vecinos, la causa es externa.',
          'En este caso, un regulador de voltaje o un UPS puede proteger los equipos sensibles. El problema externo debe reportarse a la empresa distribuidora.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Las luces que parpadean pueden dañar los electrodomésticos?',
        a: 'El parpadeo por sí mismo generalmente no daña los electrodomésticos. Sin embargo, si el parpadeo es síntoma de fluctuaciones de voltaje severas (neutro suelto, variaciones de la red), esas variaciones sí pueden dañar electrodomésticos sensibles como neveras, televisores y computadores.',
      },
      {
        q: '¿Cuánto cuesta revisar una instalación eléctrica por parpadeo de luces en Cali?',
        a: 'El diagnóstico incluye la visita técnica e identificación de la causa. El costo de la reparación depende de lo que se encuentre: desde un cambio de switch hasta reparación del neutro en el tablero. Siempre cotizamos antes de intervenir.',
      },
    ],
  },

  'tomacorriente-no-funciona-que-hacer': {
    slug: 'tomacorriente-no-funciona-que-hacer',
    title: 'Tomacorriente que no funciona: qué verificar y cuándo llamar al electricista',
    metaTitle: 'Tomacorriente No Funciona: Diagnóstico | SomosTécnicos',
    metaDescription: 'Un tomacorriente sin corriente puede tener una causa simple o un problema de cableado. Aprende a identificarlo y cuándo es necesario el electricista.',
    keywords: [
      'tomacorriente no funciona',
      'enchufe sin corriente',
      'tomacorriente muerto',
      'toma de corriente dañado',
      'arreglar tomacorriente Cali',
    ],
    canonicalPath: '/blog/tomacorriente-no-funciona-que-hacer',
    heroImage: '/blog/electricidad/tomacorriente-no-funciona.avif',
    heroImageAlt: 'tomacorriente con señales de quemado y chispas causadas por cortocircuito eléctrico',
    cardImage: '/blog/electricidad/tomacorriente-no-funciona.avif',
    cardImageAlt: 'Tomacorriente dañado con marcas de quemado en pared doméstica',
    excerpt: 'Un tomacorriente que deja de funcionar puede tener causas desde simples (breaker disparado) hasta que requieren electricista (cableado dañado). Este diagnóstico te orienta.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-13',
    readTime: 4,
    relatedServiceSlug: 'electricista-a-domicilio-cali',
    relatedServiceLabel: 'Electricista a Domicilio en Cali',
    sections: [
      {
        heading: 'Un tomacorriente muerto no siempre es el tomacorriente',
        paragraphs: [
          'Antes de asumir que el tomacorriente está dañado, hay verificaciones simples que resuelven la mayoría de los casos sin necesidad de electricista.',
        ],
      },
      {
        heading: 'Paso 1: Revisa el tablero de breakers',
        paragraphs: [
          'Lo primero es verificar que el breaker del circuito al que pertenece el tomacorriente no esté disparado. Un breaker disparado queda en una posición intermedia — no está completamente en ON ni en OFF.',
          'Si encuentras un breaker en posición intermedia: ponlo completamente en OFF primero, luego en ON. Si vuelve a dispararse inmediatamente, hay un cortocircuito en ese circuito.',
        ],
        tips: [
          'En muchas instalaciones, no todos los tomacorrientes de un cuarto están en el mismo breaker — revisa el mapa del tablero si lo tienes.',
          'Algunas instalaciones tienen breakers secundarios en el baño o la cocina, además del tablero principal.',
        ],
      },
      {
        heading: 'Paso 2: Busca un tomacorriente GFCI en el área',
        paragraphs: [
          'Los tomacorrientes GFCI (Ground Fault Circuit Interrupter) son los que tienen dos botones pequeños en el centro — generalmente etiquetados TEST y RESET. Se instalan típicamente en baños, cocinas y áreas exteriores.',
          'Un tomacorriente GFCI disparado corta la energía no solo de sí mismo sino de otros tomacorrientes conectados al mismo circuito. Si un tomacorriente en el baño se disparó, puede ser la razón por la que el tomacorriente del corredor no funciona.',
          'Para resetear: presiona el botón RESET del tomacorriente GFCI. Si no vuelve a tener energía, prueba con los GFCI en otros cuartos.',
        ],
      },
      {
        heading: 'Paso 3: Prueba el tomacorriente con un tester',
        paragraphs: [
          'Si el breaker está bien y no hay GFCI disparados, el siguiente paso es probar si el tomacorriente tiene voltaje. Un tester de tomacorrientes (disponible en ferreterías por menos de $10.000 pesos) te indica si hay voltaje y si el circuito está correctamente conectado.',
          'Si el tester no indica voltaje, el problema está en el cableado o en el tomacorriente mismo — requiere electricista.',
        ],
      },
      {
        heading: 'Cuándo llamar al electricista',
        paragraphs: [
          'Llama al electricista en estos casos:',
        ],
        warning: 'Llama al electricista si: hay marcas de quemado alrededor del tomacorriente, si el tomacorriente hace chispas al conectar un aparato, si hay olor a quemado en el área, si el tomacorriente o la placa están calientes al tacto, o si el problema apareció después de una tormenta eléctrica.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo reemplazar un tomacorriente yo mismo?',
        a: 'Técnicamente es posible si tienes conocimientos básicos de electricidad y sigues los procedimientos de seguridad (cortar el breaker, verificar con tester antes de tocar). Sin embargo, en Colombia la instalación eléctrica debe cumplir con la NTC 2050 y las reparaciones realizadas por personas no certificadas pueden invalidar el seguro del hogar.',
      },
      {
        q: '¿Cuánto cuesta reparar o reemplazar un tomacorriente en Cali?',
        a: 'El reemplazo de un tomacorriente sencillo es una de las reparaciones eléctricas más económicas. El costo incluye el material y la mano de obra. Si hay que reparar el cableado detrás del tomacorriente, el costo es mayor y depende de la extensión del daño.',
      },
    ],
  },

  'senales-instalacion-electrica-danada': {
    slug: 'senales-instalacion-electrica-danada',
    title: 'Señales de instalación eléctrica dañada que no debes ignorar',
    metaTitle: 'Señales de Instalación Eléctrica Dañada | SomosTécnicos',
    metaDescription: 'Una instalación eléctrica deteriorada es la principal causa de incendios domésticos. Conoce las señales de alerta antes de que sea tarde.',
    keywords: [
      'señales instalación eléctrica dañada',
      'instalación eléctrica vieja Colombia',
      'cableado eléctrico deteriorado',
      'revisión eléctrica hogar Cali',
      'peligros eléctricos domésticos',
    ],
    canonicalPath: '/blog/senales-instalacion-electrica-danada',
    heroImage: '/blog/electricidad/instalacion-electrica-dañada.avif',
    heroImageAlt: 'cable eléctrico con aislamiento deteriorado y quemado expuesto dentro de una pared de hogar',
    cardImage: '/blog/electricidad/instalacion-electrica-dañada.avif',
    cardImageAlt: 'Cableado eléctrico deteriorado con aislamiento dañado encontrado en pared doméstica',
    excerpt: 'En Colombia, una gran proporción de incendios domésticos tiene origen eléctrico. La mayoría son prevenibles con revisiones periódicas, especialmente en viviendas con más de 15 años de construcción.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-13',
    readTime: 5,
    relatedServiceSlug: 'electricista-a-domicilio-cali',
    relatedServiceLabel: 'Electricista a Domicilio en Cali',
    sections: [
      {
        heading: 'El riesgo eléctrico que no se ve',
        paragraphs: [
          'Una instalación eléctrica deteriorada generalmente no da señales obvias hasta que falla de forma crítica. El cableado con aislamiento dañado dentro de las paredes puede generar arcos eléctricos durante años antes de causar un incendio.',
          'Sin embargo, hay señales que sí son visibles o detectables si sabes qué buscar. Identificarlas a tiempo puede evitar consecuencias graves.',
        ],
      },
      {
        heading: 'Señal 1: Tomacorrientes o switches que se calientan',
        paragraphs: [
          'Un tomacorriente o un switch que se siente tibio o caliente al tacto (incluso sin tener nada conectado) indica resistencia eléctrica excesiva en las conexiones — posiblemente por cables sueltos, oxidados o subdimensionados.',
          'Esta es una señal de riesgo de incendio. Las conexiones con resistencia alta generan calor que puede encender el material combustible dentro de las paredes.',
        ],
        warning: 'Si un tomacorriente o switch está caliente al tacto, no lo uses hasta que sea revisado por un electricista. Es una señal de riesgo inmediato.',
      },
      {
        heading: 'Señal 2: Olor a quemado sin fuente visible',
        paragraphs: [
          'Un olor a quemado o a plástico caliente que aparece sin causa obvia (sin cocinar, sin electrodoméstico funcionando cerca) puede indicar que el cableado dentro de las paredes está sobrecalentándose.',
          'Este olor puede aparecer y desaparecer — lo que no significa que el problema haya desaparecido. Requiere inspección profesional urgente.',
        ],
      },
      {
        heading: 'Señal 3: Tablero con breakers o fusibles obsoletos',
        paragraphs: [
          'Las viviendas construidas antes de los años 2000 en Colombia pueden tener tableros con fusibles de cuchilla (tapones) en lugar de breakers modernos. Estos sistemas son más difíciles de operar correctamente y menos seguros.',
          'También existen tableros con breakers de fabricación obsoleta que pueden fallar al no dispararse cuando deben, lo que elimina la protección del circuito.',
        ],
      },
      {
        heading: 'Señal 4: Chispas al conectar o desconectar aparatos',
        paragraphs: [
          'Una pequeña chispa muy breve al conectar un aparato con motor (nevera, lavadora) puede ser normal. Sin embargo, chispas frecuentes, grandes o acompañadas de ruido indican un problema real en el tomacorriente o en el aparato.',
          'Si las chispas ocurren en múltiples tomacorrientes, el problema puede estar en el neutro general de la instalación.',
        ],
      },
      {
        heading: 'Señal 5: Instalación sin polo a tierra',
        paragraphs: [
          'El polo a tierra es el tercer conductor (el orificio redondo en los tomacorrientes modernos) que protege contra descargas eléctricas accidentales. Las instalaciones más antiguas no tienen polo a tierra.',
          'Sin polo a tierra, los electrodomésticos con fallas internas pueden transmitir la descarga al usuario. Es especialmente importante en baños, cocinas y zonas húmedas.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cada cuánto se debe revisar la instalación eléctrica de una vivienda en Colombia?',
        a: 'La Norma Técnica Colombiana NTC 2050 recomienda revisión cada 5 años para instalaciones relativamente nuevas y cada 3 años para instalaciones de más de 25 años. Cualquier señal de anomalía justifica una revisión inmediata.',
      },
      {
        q: '¿Es obligatorio que un electricista tenga certificación para trabajar en Colombia?',
        a: 'Sí. En Colombia, los trabajos de instalación y reparación eléctrica deben ser realizados por personas con el certificado CONTE (Certificado de Operario de Trabajos Eléctricos) o equivalente, según lo establece el Reglamento Técnico de Instalaciones Eléctricas (RETIE).',
      },
    ],
  },

  'revision-electrica-domiciliaria-cali': {
    slug: 'revision-electrica-domiciliaria-cali',
    title: 'Revisión eléctrica domiciliaria en Cali: qué incluye y cuánto cuesta',
    metaTitle: 'Revisión Eléctrica Domiciliaria Cali | SomosTécnicos',
    metaDescription: 'Una revisión eléctrica completa puede prevenir incendios y accidentes. Conoce qué incluye el servicio, cada cuánto hacerlo y los costos en Cali.',
    keywords: [
      'revisión eléctrica domiciliaria Cali',
      'electricista a domicilio Cali',
      'inspección eléctrica hogar Colombia',
      'mantenimiento eléctrico residencial Cali',
      'certificación eléctrica vivienda',
    ],
    canonicalPath: '/blog/revision-electrica-domiciliaria-cali',
    heroImage: '/blog/electricidad/revision-electrica-preventivo.avif',
    heroImageAlt: 'electricista certificado revisando tablero de breakers en hogar colombiano con equipos de medición',
    cardImage: '/blog/electricidad/revision-electrica-preventivo.avif',
    cardImageAlt: 'Electricista revisando instalación eléctrica en vivienda de Cali Colombia',
    excerpt: 'Una revisión eléctrica domiciliaria evalúa el tablero, el cableado, los tomacorrientes y la conexión a tierra. Es la mejor inversión para prevenir accidentes en el hogar.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-14',
    readTime: 5,
    relatedServiceSlug: 'electricista-a-domicilio-cali',
    relatedServiceLabel: 'Electricista a Domicilio en Cali',
    sections: [
      {
        heading: 'Por qué las viviendas en Cali necesitan revisión eléctrica',
        paragraphs: [
          'Cali tiene un parque inmobiliario diverso: desde edificios nuevos con instalaciones modernas hasta casas con más de 40 años de construcción cuyo cableado nunca ha sido revisado. En estas últimas, el deterioro del aislamiento por el tiempo, la humedad y la adición de cargas eléctricas mayores (aire acondicionado, electrodomésticos modernos) puede convertir la instalación en un riesgo real.',
          'Adicionalmente, muchas viviendas han sido ampliadas o remodeladas de forma informal, lo que puede resultar en instalaciones improvisadas que no cumplen con las normas de seguridad.',
        ],
      },
      {
        heading: 'Qué incluye una revisión eléctrica completa',
        paragraphs: [
          'Una revisión técnica profesional es mucho más que verificar que los interruptores funcionen:',
        ],
        highlight: 'La revisión eléctrica domiciliaria incluye: inspección visual del tablero de breakers (estado, marca, capacidad), verificación de voltaje en todos los circuitos, prueba de continuidad del polo a tierra, medición de aislamiento del cableado, inspección de tomacorrientes y switches, verificación de la carga total de cada circuito vs la capacidad del breaker, y entrega de informe técnico escrito con hallazgos y recomendaciones.',
      },
      {
        heading: '¿Cuándo es obligatoria la revisión?',
        paragraphs: [
          'Hay situaciones donde la revisión eléctrica es especialmente importante:',
        ],
        tips: [
          'Al comprar o arrendar una vivienda: el historial de la instalación puede ser desconocido.',
          'Después de una reforma o ampliación: verificar que las nuevas instalaciones sean seguras y cumplan con RETIE.',
          'Cuando hay señales de alerta: tomacorrientes calientes, olor a quemado, breakers que se caen frecuentemente.',
          'Instalaciones de más de 15-20 años sin revisión previa.',
          'Al añadir equipos de alta potencia: aire acondicionado, ducha eléctrica, calentador eléctrico.',
        ],
      },
      {
        heading: 'Normativa aplicable en Colombia',
        paragraphs: [
          'Las instalaciones eléctricas residenciales en Colombia deben cumplir con el Reglamento Técnico de Instalaciones Eléctricas (RETIE) y la Norma Técnica Colombiana NTC 2050, que es la adaptación del National Electrical Code de EE.UU. al contexto colombiano.',
          'El RETIE establece las condiciones mínimas de seguridad que deben tener las instalaciones eléctricas para proteger a las personas, los bienes y el medio ambiente.',
        ],
      },
      {
        heading: 'Nuestro servicio de revisión eléctrica en Cali',
        paragraphs: [
          'Realizamos revisiones eléctricas domiciliarias a lo largo de toda la ciudad de Cali. El servicio incluye la visita técnica, la revisión completa y la entrega de un informe escrito con los hallazgos.',
          'Si se encuentran problemas que requieren corrección, entregamos la cotización antes de proceder. No realizamos trabajos sin consentimiento previo del cliente.',
        ],
        tips: [
          'El informe técnico puede usarse como soporte ante arrendadores, aseguradoras o entidades financieras.',
          'Las correcciones necesarias pueden hacerse en la misma visita si son menores, o en visitas posteriores para trabajos más extensos.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta la revisión eléctrica domiciliaria en Cali?',
        a: 'El costo de la revisión depende del tamaño de la vivienda y el número de circuitos a evaluar. Para una vivienda de tamaño estándar (3-4 cuartos), el costo incluye la visita, la revisión completa y el informe técnico. Contacta para obtener la tarifa exacta según tu caso.',
      },
      {
        q: '¿La revisión eléctrica genera algún certificado?',
        a: 'Sí. Al final de la revisión entregamos un informe técnico firmado por el electricista certificado. Este documento detalla el estado de la instalación, los hallazgos y las recomendaciones. Es equivalente a una certificación del estado de la instalación en el momento de la revisión.',
      },
    ],
  },
}
