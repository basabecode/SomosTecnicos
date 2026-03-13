import type { BlogPost } from './types'

export const secadorasPosts: Record<string, BlogPost> = {
  'secadora-no-calienta': {
    slug: 'secadora-no-calienta',
    title: 'Secadora no calienta: 5 causas y cómo solucionarlas',
    metaTitle: 'Secadora No Calienta: 5 Causas y Soluciones | SomosTécnicos',
    metaDescription: '¿Tu secadora gira pero no calienta? Descubre las causas más comunes y cuáles puedes resolver tú mismo sin llamar al técnico.',
    keywords: [
      'secadora no calienta',
      'secadora gira pero no seca',
      'elemento calefactor secadora',
      'fusible térmico secadora',
      'reparación secadora Cali',
    ],
    canonicalPath: '/blog/secadora-no-calienta',
    heroImage: '/blog/secadoras/secadora-no-calienta-1.avif',
    heroImageAlt: 'elemento calefactor de secadora eléctrica expuesto durante reparación',
    cardImage: '/blog/secadoras/secadora-no-calienta-1.avif',
    cardImageAlt: 'Elemento calefactor de secadora con bobinas visibles',
    excerpt: 'Una secadora que gira normalmente pero deja la ropa fría tiene el problema en el sistema de calentamiento, no en el motor. Estas son las 5 causas más comunes.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-04',
    readTime: 4,
    relatedServiceSlug: 'reparacion-secadoras-cali',
    relatedServiceLabel: 'Reparación de Secadoras en Cali',
    sections: [
      {
        heading: 'El motor gira pero el calor no llega',
        paragraphs: [
          'Cuando una secadora gira normalmente pero la ropa sale fría o apenas tibia al terminar el ciclo, el problema suele estar en el sistema de calentamiento y no en el motor.',
          'Esto es en realidad una buena noticia: significa que la mayor parte del equipo funciona bien. El diagnóstico se reduce a unos pocos componentes que son los responsables de generar y distribuir el calor.',
        ],
      },
      {
        heading: 'Causa 1: Elemento calefactor (resistencia) quemado',
        paragraphs: [
          'El elemento calefactor es la resistencia que genera el calor dentro de la secadora. Con el tiempo, los ciclos de calentamiento y enfriamiento desgastan el filamento metálico hasta que se rompe.',
          'Un elemento quemado generalmente no tiene reparación — se reemplaza. Es el componente más común en fallas de calentamiento en secadoras eléctricas.',
        ],
        tips: [
          'Un elemento quemado suele verse con puntos negros o con el filamento visiblemente cortado.',
          'Se puede probar con un multímetro midiendo continuidad en los terminales del elemento.',
          'El reemplazo es posible en la mayoría de marcas con piezas originales o compatibles.',
        ],
      },
      {
        heading: 'Causa 2: Termostato de seguridad disparado',
        paragraphs: [
          'El termostato de seguridad es un componente que corta el calentamiento si la secadora supera la temperatura máxima segura. En muchos modelos puede dispararse sin dar señal visible.',
          'Un termostato disparado puede resetearse manualmente en algunos modelos, pero si se disparó por sobrecalentamiento (filtro tapado, ducto bloqueado), la causa raíz debe resolverse primero.',
        ],
      },
      {
        heading: 'Causa 3: Fusible térmico fundido',
        paragraphs: [
          'El fusible térmico (thermal fuse) es un componente de seguridad de un solo uso. Una vez que se funde por sobrecalentamiento, ya no conduce electricidad y debe reemplazarse.',
          'A diferencia del termostato, el fusible térmico no se puede resetear. Si se fundió, la secadora no calentará hasta que se cambie. Es económico y accesible para técnicos.',
        ],
        warning: 'Si el fusible se funde por segunda vez, hay un problema de fondo (ventilación bloqueada o termostato defectuoso) que debe resolverse o el nuevo fusible también se dañará.',
      },
      {
        heading: 'Causa 4: Tarjeta de control defectuosa',
        paragraphs: [
          'En secadoras modernas con control electrónico, la tarjeta principal gestiona el ciclo de calentamiento. Una falla en la tarjeta puede hacer que el motor funcione pero el circuito de calentamiento no se active.',
          'Este diagnóstico requiere equipo de medición y conocimiento técnico. Es la causa menos frecuente pero la más costosa de reparar.',
        ],
      },
      {
        heading: 'Causa 5: Válvula solenoide de gas bloqueada (secadoras a gas)',
        paragraphs: [
          'Las secadoras a gas tienen válvulas solenoides que regulan el flujo de gas hacia el quemador. Si una válvula falla, el quemador no se activa aunque el equipo funcione eléctricamente.',
          'Este componente solo aplica a secadoras a gas, que son menos comunes en Colombia pero existen en algunos hogares con instalaciones importadas o de uso mixto.',
        ],
      },
      {
        heading: '¿Cuándo debes llamar a un técnico?',
        paragraphs: [
          'Hay pasos básicos que puedes verificar antes de llamar:',
        ],
        tips: [
          'Limpia el filtro de pelusa completamente — un filtro tapado puede disparar la seguridad térmica.',
          'Revisa que el ducto de ventilación exterior no esté aplastado ni bloqueado.',
          'Verifica que el disyuntor (breaker) de la secadora esté completamente en ON — a veces queda a medias.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Por qué la secadora calienta a veces y otras no?',
        a: 'El calentamiento intermitente suele indicar un termostato defectuoso o un elemento calefactor con un punto de ruptura que se abre con el calor. Requiere revisión técnica para diagnóstico definitivo.',
      },
      {
        q: '¿Cuánto cuesta reparar una secadora que no calienta en Cali?',
        a: 'Depende del componente dañado. El reemplazo de fusible térmico o termostato es la reparación más económica. El elemento calefactor tiene un costo intermedio. La tarjeta de control es el componente más costoso. Hacemos diagnóstico antes de cotizar.',
      },
      {
        q: '¿Vale la pena reparar una secadora que no calienta?',
        a: 'Si el equipo tiene menos de 10 años, la reparación generalmente es más económica que el reemplazo. Para equipos más antiguos, el diagnóstico técnico te ayuda a tomar la mejor decisión.',
      },
    ],
  },

  'secadora-se-apaga-sola': {
    slug: 'secadora-se-apaga-sola',
    title: '¿Por qué mi secadora se apaga sola antes de terminar?',
    metaTitle: 'Secadora Se Apaga Sola: Causas y Solución | SomosTécnicos',
    metaDescription: 'Si tu secadora se detiene antes de terminar el ciclo, puede ser por sobrecalentamiento o sensor dañado. Aprende a identificar el problema.',
    keywords: [
      'secadora se apaga sola',
      'secadora se detiene en el ciclo',
      'secadora sobrecalentamiento',
      'secadora para antes de terminar',
      'secadora apaga sola solución',
    ],
    canonicalPath: '/blog/secadora-se-apaga-sola',
    heroImage: '/blog/secadoras/secadora-se-apaga-sola.avif',
    heroImageAlt: 'filtro de pelusa de secadora lleno de acumulación gris',
    cardImage: '/blog/secadoras/secadora-se-apaga-sola.avif',
    cardImageAlt: 'Filtro de pelusa de secadora con acumulación que bloquea el flujo de aire',
    excerpt: 'Una secadora que se detiene antes de terminar genera ropa húmeda y ciclos incompletos. Las causas van desde una obstrucción simple hasta un sensor defectuoso.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-04',
    readTime: 4,
    relatedServiceSlug: 'reparacion-secadoras-cali',
    relatedServiceLabel: 'Reparación de Secadoras en Cali',
    sections: [
      {
        heading: 'Ciclo incompleto: el diagnóstico más frustrante',
        paragraphs: [
          'Una secadora que se detiene antes de terminar el ciclo genera ropa húmeda, ciclos incompletos y la sensación de que el equipo tiene falla intermitente — lo que hace más difícil reproducir el problema frente al técnico.',
          'Sin embargo, en la mayoría de los casos hay una causa clara y detectable. Lo importante es seguir una secuencia lógica de verificación.',
        ],
      },
      {
        heading: 'Causa más frecuente: filtro de pelusa obstruido',
        paragraphs: [
          'El filtro de pelusa es la causa número uno de paradas prematuras. Cuando está tapado, el flujo de aire interno se reduce, la temperatura sube por encima del límite de seguridad y el termostato o el sensor térmico detiene el ciclo automáticamente.',
          'La solución es simple: limpia el filtro completamente (no solo retira la capa superficial) y verifica que el alojamiento del filtro también esté limpio.',
        ],
        tips: [
          'Limpia el filtro después de cada ciclo de secado, no solo cuando se vea lleno.',
          'Cada 3 meses, lava el filtro con agua tibia para remover la acumulación de residuos de suavizante.',
          'Revisa el interior del alojamiento del filtro con una linterna — la pelusa también se acumula adentro.',
        ],
      },
      {
        heading: 'Causa 2: Ducto de ventilación tapado o aplastado',
        paragraphs: [
          'El ducto que lleva el aire caliente húmedo hacia el exterior puede acumular pelusa con el tiempo o aplastarse si la secadora se empujó demasiado contra la pared.',
          'Un ducto bloqueado provoca exactamente el mismo efecto que un filtro tapado: temperatura interna excesiva y parada por seguridad. La diferencia es que esta causa es menos obvia porque el ducto está detrás del equipo.',
        ],
        warning: 'Los ductos de secadora bloqueados son una de las principales causas de incendios en electrodomésticos de lavandería. Si el ducto tiene más de 5 años sin limpieza, es recomendable una revisión.',
      },
      {
        heading: 'Causa 3: Sensor de humedad sucio o dañado',
        paragraphs: [
          'Las secadoras modernas con ciclo automático usan sensores de humedad (dos barras metálicas dentro del tambor) para detectar cuándo la ropa está seca. Si los sensores están cubiertos de residuos de suavizante o están dañados, la secadora puede creer que la ropa ya está seca y detener el ciclo prematuramente.',
          'Limpiar los sensores con alcohol isopropílico aplicado con un paño puede resolver este problema sin necesidad de técnico.',
        ],
      },
      {
        heading: 'Causa 4: Motor con sobrecarga térmica por carga excesiva',
        paragraphs: [
          'Cargar la secadora por encima de su capacidad nominal hace que el motor trabaje más de lo diseñado. Cuando el motor supera su temperatura de trabajo, el protector térmico interno lo apaga para evitar daño.',
          'Después de que el motor se enfría (15-20 minutos), la secadora puede volver a funcionar. Pero el problema se repetirá si la carga no se reduce.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿La secadora se apaga sola si la carga es muy pequeña?',
        a: 'Sí, en secadoras con sensor de humedad automático. Si la carga es muy pequeña o está mezclada con prendas de distintos materiales, el sensor puede confundirse y detener el ciclo antes de tiempo. Usa el ciclo temporizador manual para cargas pequeñas o mixtas.',
      },
      {
        q: '¿Es peligroso que la secadora se apague sola?',
        a: 'La parada automática es una función de seguridad diseñada para prevenir sobrecalentamiento e incendios. En sí misma no es peligrosa. Lo preocupante es la causa que la activa, especialmente si es el ducto bloqueado.',
      },
    ],
  },

  'secadora-no-seca-bien-ropa-humeda': {
    slug: 'secadora-no-seca-bien-ropa-humeda',
    title: 'Secadora deja la ropa húmeda: diagnóstico paso a paso',
    metaTitle: 'Secadora Deja Ropa Húmeda: Causas y Solución | SomosTécnicos',
    metaDescription: 'Ropa que sale húmeda o tarda el doble en secar tiene solución. Sigue este diagnóstico y descubre si puedes resolverlo antes de llamar al técnico.',
    keywords: [
      'secadora no seca bien',
      'ropa sale húmeda de la secadora',
      'secadora tarda mucho en secar',
      'por qué la ropa no se seca',
      'secadora ropa húmeda Cali',
    ],
    canonicalPath: '/blog/secadora-no-seca-bien-ropa-humeda',
    heroImage: '/blog/secadoras/secadora-no-seca-bien.avif',
    heroImageAlt: 'técnico revisando el ducto de escape de una secadora con linterna',
    cardImage: '/blog/secadoras/secadora-no-seca-bien.avif',
    cardImageAlt: 'Ropa húmeda saliendo de secadora junto a ducto de ventilación revisado',
    excerpt: 'Si la ropa sale húmeda de la secadora o el ciclo tarda más del doble de lo normal, hay una causa identificable. Este diagnóstico paso a paso te ayuda a encontrarla.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-05',
    readTime: 4,
    relatedServiceSlug: 'reparacion-secadoras-cali',
    relatedServiceLabel: 'Reparación de Secadoras en Cali',
    sections: [
      {
        heading: 'Ropa húmeda al terminar: un ciclo que no cumple su función',
        paragraphs: [
          'Si la secadora completa su ciclo pero la ropa sigue húmeda o tarda el doble de lo normal, el equipo está consumiendo energía sin dar resultados. Esto puede costar más que la reparación misma si se deja sin solucionar.',
          'Las causas se dividen en dos grupos: problemas de ventilación (los más comunes y fáciles de resolver) y fallas de calentamiento (que requieren técnico).',
        ],
      },
      {
        heading: 'Paso 1: Verifica la ventilación exterior',
        paragraphs: [
          'El ducto de ventilación es el camino por donde el aire húmedo sale de la secadora hacia el exterior. Si está bloqueado — por pelusa acumulada, un animal que hizo nido o simplemente por estar aplastado — el aire húmedo se queda dentro del tambor y la ropa no se seca.',
          'Ve al punto donde el ducto sale al exterior (generalmente una rejilla en la pared o en el techo) y verifica que el aire caliente fluya libremente cuando la secadora está funcionando.',
        ],
        tips: [
          'La longitud máxima recomendada del ducto es 5 metros para ductos rectos. Cada codo adicional equivale a 1.5 metros.',
          'Usa ducto rígido de metal, no de plástico flexible arrugado — el plástico acumula pelusa en los pliegues.',
          'Limpia el ducto internamente con un cepillo flexible al menos una vez al año.',
        ],
      },
      {
        heading: 'Paso 2: Revisa si la lavadora centrifugó correctamente',
        paragraphs: [
          'Si la lavadora no centrifugó bien, la ropa llega a la secadora con el doble de agua de la que debería. La secadora puede funcionar perfectamente y aun así no lograr secar ropa que está casi empapada.',
          'Una forma de verificar: antes de meter la ropa en la secadora, toma una prenda y estrújala. Si sale agua, la lavadora no centrifugó suficiente.',
        ],
      },
      {
        heading: 'Paso 3: Verifica la carga y el tipo de prendas',
        paragraphs: [
          'Una carga excesiva no permite que el aire caliente circule libremente entre las prendas. Los artículos grandes como cobijas, almohadas y edredones necesitan espacio adicional para que el aire llegue a todos los puntos.',
          'Mezclar prendas muy gruesas (jeans, toallas) con prendas ligeras también produce resultados inconsistentes — las gruesas quedan húmedas mientras las ligeras se sobresecan.',
        ],
      },
      {
        heading: 'Paso 4: Resistencia calefactora funcionando parcialmente',
        paragraphs: [
          'En algunos casos, el elemento calefactor funciona pero con capacidad reducida — uno de varios segmentos se rompe mientras los demás siguen funcionando. El resultado es menos calor del necesario, ciclos más largos y ropa que nunca termina de secarse del todo.',
          'Este diagnóstico requiere medir la resistencia eléctrica del elemento con un multímetro. Si la medición está fuera del rango especificado, el elemento debe reemplazarse.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto debe tardar una secadora normal en secar ropa?',
        a: 'Una carga estándar de ropa de algodón (3-4 kg) debe secar en 45-60 minutos a temperatura normal. Una carga de toallas puede tardar 60-75 minutos. Si tarda más de 90 minutos regularmente, hay un problema de ventilación o de calentamiento.',
      },
      {
        q: '¿Es mejor usar ciclo de aire frío que de aire caliente para ciertas prendas?',
        a: 'El ciclo de aire frío (solo ventilación sin calor) es adecuado para prendas muy delicadas como lana o seda. Para ropa de algodón, sintéticos y telas de uso diario, el ciclo de calor es el adecuado y mucho más eficiente en tiempo.',
      },
    ],
  },

  'secadora-hace-ruido-golpes-chirrido': {
    slug: 'secadora-hace-ruido-golpes-chirrido',
    title: 'Secadora hace ruido: qué significa cada sonido y cómo repararlo',
    metaTitle: 'Secadora Hace Ruido: Causas y Reparación | SomosTécnicos',
    metaDescription: 'Golpes, chirridos o vibración fuerte en tu secadora indican piezas desgastadas. Identifica el ruido y descubre si necesitas técnico.',
    keywords: [
      'secadora hace ruido',
      'secadora hace golpes',
      'secadora chirría al girar',
      'ruido en secadora reparación',
      'reparación secadora ruidos Cali',
    ],
    canonicalPath: '/blog/secadora-hace-ruido-golpes-chirrido',
    heroImage: '/blog/secadoras/secadora-hace-ruido.avif',
    heroImageAlt: 'interior de secadora con la tapa trasera removida mostrando correa y rodillos',
    cardImage: '/blog/secadoras/secadora-hace-ruido.avif',
    cardImageAlt: 'Interior de secadora mostrando correa del tambor, rodillos y polea tensora',
    excerpt: 'El tipo de ruido que hace una secadora indica exactamente qué pieza está fallando. Identificarlo correctamente evita diagnósticos innecesarios.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-05',
    readTime: 4,
    relatedServiceSlug: 'reparacion-secadoras-cali',
    relatedServiceLabel: 'Reparación de Secadoras en Cali',
    sections: [
      {
        heading: 'El sonido como diagnóstico',
        paragraphs: [
          'Una secadora con ruido no es solo molesta — es un aviso de que una pieza está fallando. Lo interesante es que el tipo de ruido es muy específico: cada componente mecánico produce un patrón de sonido diferente cuando se desgasta.',
          'Identificar correctamente el ruido permite ir al técnico con el diagnóstico ya hecho, lo que reduce el tiempo y el costo de la reparación.',
        ],
      },
      {
        heading: 'Golpe rítmico sincronizado con la rotación: correa del tambor',
        paragraphs: [
          'Si escuchas un golpe o thump que se repite de forma rítmica, sincronizado con cada vuelta del tambor, la causa más probable es la correa del tambor desgastada o parcialmente rota.',
          'La correa envuelve el tambor y lo conecta con el motor. Cuando se desgasta, desarrolla puntos planos o grietas que generan el golpe característico al pasar por la polea.',
        ],
        tips: [
          'Un golpe rítmico que empeora progresivamente indica correa que se está rompiendo.',
          'Un golpe fuerte repentino seguido de un tambor que no gira: la correa se rompió completamente.',
          'La correa es una de las reparaciones más económicas en secadoras.',
        ],
      },
      {
        heading: 'Chirrido constante durante toda la operación: rodillos de soporte',
        paragraphs: [
          'Los rodillos de soporte son los componentes que sostienen el tambor desde abajo. Con el tiempo, los cojinetes internos de los rodillos se desgastan y comienzan a generar un chirrido constante durante todo el ciclo.',
          'A diferencia del golpe de la correa, el chirrido de los rodillos es continuo y no sigue el ritmo de la rotación del tambor. Se intensifica cuando la carga es mayor.',
        ],
      },
      {
        heading: 'Golpes irregulares dentro del tambor: objeto extraño',
        paragraphs: [
          'Si los golpes son irregulares — no siguen ningún ritmo fijo — lo más probable es que haya un objeto extraño dentro del tambor: una moneda, un botón metálico, una hebilla o una piedra de abrigo.',
          'Antes de llamar al técnico, revisa el interior del tambor y las juntas de la puerta. Monedas y objetos metálicos suelen quedar atrapados entre el tambor y la carcasa frontal.',
        ],
      },
      {
        heading: 'Vibración grave y resonante: cojinetes del eje del motor',
        paragraphs: [
          'Una vibración grave que se siente más que se escucha, especialmente en la parte baja del equipo, indica desgaste en los cojinetes del eje del motor. Este es el diagnóstico menos frecuente pero de mayor impacto.',
          'Los cojinetes del motor son más costosos de reemplazar que la correa o los rodillos, y requieren desmontaje completo del motor. En equipos muy antiguos, puede ser más económico evaluar el reemplazo del equipo.',
        ],
        warning: 'Si hay olor a goma quemada junto con el ruido, o si el tambor se detiene pero el motor sigue sonando, apaga la secadora inmediatamente y no la uses hasta que sea revisada por un técnico.',
      },
    ],
    faqs: [
      {
        q: '¿La secadora puede hacer ruido por estar desnivelada?',
        a: 'Sí. Una secadora desnivelada puede vibrar y golpear contra el piso o la pared, produciendo ruidos que semejan una falla interna. Antes de llamar al técnico, verifica que las cuatro patas estén apoyadas y nivela el equipo ajustando las patas regulables.',
      },
      {
        q: '¿Cuánto dura la correa del tambor de una secadora?',
        a: 'En condiciones normales, la correa del tambor dura entre 8 y 15 años. El uso excesivo, la sobrecarga del tambor y las cargas desbalanceadas aceleran el desgaste.',
      },
    ],
  },

  'mantenimiento-secadora-ropa-cada-cuanto': {
    slug: 'mantenimiento-secadora-ropa-cada-cuanto',
    title: 'Mantenimiento de secadora: cada cuánto hacerlo y qué incluye',
    metaTitle: 'Mantenimiento de Secadora: Guía Completa | SomosTécnicos',
    metaDescription: 'Evita averías costosas con el mantenimiento correcto de tu secadora. Guía completa con frecuencias, costos y cuándo conviene reparar vs. comprar.',
    keywords: [
      'mantenimiento secadora de ropa',
      'cada cuánto limpiar secadora',
      'reparar o comprar secadora nueva',
      'servicio técnico secadora Cali',
      'mantenimiento preventivo secadora',
    ],
    canonicalPath: '/blog/mantenimiento-secadora-ropa-cada-cuanto',
    heroImage: '/blog/secadoras/secadora-limpiando-mantenimiento.avif',
    heroImageAlt: 'técnico realizando mantenimiento preventivo de secadora en hogar colombiano',
    cardImage: '/blog/secadoras/secadora-limpiando-mantenimiento.avif',
    cardImageAlt: 'Técnico limpiando ductos internos de secadora con cepillo en hogar colombiano',
    excerpt: 'Sin mantenimiento regular, una secadora acumula pelusa en ductos internos — la causa número uno de incendios en electrodomésticos de lavandería. Guía completa de frecuencias.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-06',
    readTime: 5,
    relatedServiceSlug: 'reparacion-secadoras-cali',
    relatedServiceLabel: 'Reparación de Secadoras en Cali',
    sections: [
      {
        heading: 'La pelusa silenciosa: el riesgo que nadie ve',
        paragraphs: [
          'La acumulación de pelusa en el ducto de la secadora es la causa número uno de incendios en electrodomésticos de lavandería, según estudios de seguridad del hogar. A diferencia de otras fallas, este problema no da señales claras hasta que ya es grave.',
          'Además del riesgo de incendio, una secadora sin mantenimiento consume hasta un 30% más de energía que una limpia, porque el motor y el sistema de calentamiento trabajan contra la obstrucción.',
        ],
      },
      {
        heading: 'Tareas de mantenimiento diario y mensual',
        paragraphs: [
          'Hay tareas que dependen del usuario y que marcan la diferencia entre un equipo que dura 15 años y uno que falla a los 5:',
        ],
        tips: [
          'Después de cada ciclo: limpiar el filtro de pelusa completamente, no solo retirar la capa superficial.',
          'Cada mes: verificar que el ducto de salida no esté aplastado y que la rejilla exterior no tenga obstrucciones.',
          'Cada 3 meses: lavar el filtro de pelusa con agua tibia para remover residuos de suavizante que el sacudido no elimina.',
        ],
      },
      {
        heading: 'Mantenimiento técnico: cada cuánto y qué incluye',
        paragraphs: [
          'Más allá de las tareas del usuario, la secadora necesita revisión técnica periódica para componentes que no son accesibles sin desmontaje.',
          'Se recomienda servicio técnico cada 12 a 18 meses para equipos de uso doméstico normal (3-4 ciclos semanales). Para uso intensivo (lavandería familiar grande o uso semiprofesional), la frecuencia recomendada es cada 8-12 meses.',
        ],
        highlight: 'Un mantenimiento preventivo completo incluye: limpieza de ductos internos, revisión del elemento calefactor, verificación de rodillos y correa, limpieza del área del motor y prueba de los sensores de temperatura.',
      },
      {
        heading: '¿Reparar o comprar una secadora nueva?',
        paragraphs: [
          'La regla general es: si el costo de reparación supera el 50% del valor de una secadora equivalente nueva, considera el reemplazo. Sin embargo, hay factores adicionales:',
        ],
        tips: [
          'Secadora de menos de 7 años: generalmente conviene reparar.',
          'Entre 7 y 12 años: depende del componente dañado y el costo de reparación.',
          'Más de 12 años: evalúa el reemplazo, especialmente si es la segunda reparación mayor.',
        ],
      },
      {
        heading: 'Señales de que tu secadora necesita revisión ahora',
        paragraphs: [
          'No esperes a que el equipo falle completamente. Estas señales indican que el mantenimiento es urgente:',
        ],
        warning: 'Llama al técnico si: el tiempo de secado aumentó progresivamente en los últimos meses, si hay olor a quemado al usar la secadora, si escuchas ruidos que antes no existían, o si la secadora vibra más de lo normal.',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta el mantenimiento preventivo de una secadora en Cali?',
        a: 'El mantenimiento preventivo completo (limpieza de ductos internos y externos, revisión de componentes, prueba de funcionamiento) tiene un costo que le comunicamos al momento de agendar. Siempre informamos antes de ejecutar cualquier trabajo adicional.',
      },
      {
        q: '¿Con qué frecuencia debo limpiar el ducto de la secadora?',
        a: 'El ducto de ventilación debe limpiarse internamente al menos una vez al año. Si el ducto tiene más de 3 metros de longitud o tiene varios codos, la frecuencia recomendada es cada 6 meses.',
      },
      {
        q: '¿Puedo limpiar el ducto de la secadora yo mismo?',
        a: 'La parte accesible del ducto (los primeros 30-50 cm desde la secadora y la rejilla exterior) se puede limpiar sin herramientas especiales. Para la limpieza completa del ducto interno, especialmente en instalaciones largas, se recomienda el kit de cepillo flexible o el servicio técnico.',
      },
    ],
  },
}
