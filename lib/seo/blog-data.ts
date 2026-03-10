/**
 * Fuente de verdad centralizada para todos los artículos del blog.
 * Mismo patrón que servicios-data.ts para mantener consistencia.
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
  sections: BlogSection[]
  faqs?: BlogFaq[]
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  'por-que-la-nevera-deja-de-enfriar': {
    slug: 'por-que-la-nevera-deja-de-enfriar',
    title: '¿Por qué tu nevera deja de enfriar? Causas comunes y cómo prevenirlas',
    metaTitle: '¿Por qué la Nevera no Enfría? Causas y Soluciones | SomosTécnicos',
    metaDescription: 'Descubre las causas más frecuentes por las que una nevera deja de enfriar: condensador sucio, sello de puerta, gas refrigerante y más. Consejos prácticos de nuestros técnicos en Cali.',
    keywords: [
      'nevera no enfría solución',
      'por qué nevera no enfría',
      'causas nevera no refrigera',
      'mantenimiento nevera cali',
      'nevera hace ruido cali',
      'nevera se daña frecuente',
    ],
    canonicalPath: '/blog/por-que-la-nevera-deja-de-enfriar',
    heroImage: '/electrodomesticos/nevecon lg1.jpg',
    heroImageAlt: 'Técnico revisando nevera que no enfría en Cali',
    cardImage: '/hero-servicios/nevecones-neveras-refrigeracion-hero-cali.png',
    cardImageAlt: 'Nevera LG nevecón para reparación en Cali',
    excerpt: 'Cuando la nevera deja de enfriar, los alimentos se pierden en pocas horas. Conoce las causas más frecuentes y qué puedes revisar tú mismo antes de llamar a un técnico.',
    category: 'mantenimiento',
    categoryLabel: 'Mantenimiento',
    publishedAt: '2026-03-03',
    readTime: 5,
    relatedServiceSlug: 'reparacion-neveras-cali',
    relatedServiceLabel: 'Reparación de Neveras en Cali',
    sections: [
      {
        heading: '¿Por qué es importante actuar rápido?',
        paragraphs: [
          'Una nevera que pierde capacidad de enfriamiento no solo representa una molestia: en pocas horas los alimentos frescos comienzan a deteriorarse, y lo que pudo ser una reparación sencilla puede convertirse en una avería mayor si se ignora.',
          'La buena noticia es que muchas de las causas más frecuentes tienen solución fácil, y en algunos casos ni siquiera requieren la visita de un técnico. Aquí te explicamos qué puede estar pasando y cómo actuar.',
        ],
      },
      {
        heading: 'Las causas más frecuentes',
        paragraphs: [
          'La mayoría de los problemas de enfriamiento en neveras se originan en uno de estos cinco puntos:',
          '**Condensador sucio.** La parte trasera de la nevera tiene un serpentín metálico que disipa el calor. Cuando se acumula polvo y suciedad en ese componente, la nevera trabaja el doble y enfría menos. Es la causa número uno que vemos en Cali.',
          '**Sello de puerta dañado.** La goma que rodea el borde de la puerta mantiene el frío adentro. Con el tiempo se deforma, agrieta o pierde su elasticidad. Si sientes corriente de aire frío al pasar la mano por el borde con la puerta cerrada, este es el problema.',
          '**Termostato descalibrado.** El termostato controla cuándo el compresor se enciende y apaga. Si se descalibra, la nevera puede no alcanzar la temperatura programada aunque el compresor esté funcionando.',
          '**Gas refrigerante bajo.** El refrigerante es el fluido que circula por el sistema y absorbe el calor de los alimentos. Si hay una fuga, la nevera pierde capacidad de enfriamiento de forma gradual. Este problema siempre requiere un técnico certificado.',
          '**Ventilador del evaporador bloqueado.** En neveras con sistema No Frost, un pequeño ventilador distribuye el aire frío por los compartimentos. Si se bloquea con hielo o se daña, algunas zonas de la nevera dejan de enfriar aunque el compresor funcione bien.',
        ],
      },
      {
        heading: 'Lo que puedes revisar antes de llamar a un técnico',
        paragraphs: [
          'Antes de programar una visita, te recomendamos revisar estos puntos por tu cuenta. En muchos casos, con estos pasos se resuelve el problema:',
        ],
        tips: [
          'Verifica que el enchufe esté bien conectado y que el breaker no se haya caído.',
          'Revisa la temperatura configurada en el panel: debe estar entre 3 y 5°C para el refrigerador y -18°C para el congelador.',
          'Aleja la nevera de la pared al menos 10 cm y limpia el condensador trasero con un cepillo suave o aspiradora.',
          'Prueba el sello de la puerta: cierra un papel entre la puerta y el marco; si lo puedes sacar sin resistencia, el sello está dañado.',
          'Revisa si hay acumulación excesiva de escarcha en el congelador — podría indicar que el ciclo de deshielo no está funcionando.',
        ],
      },
      {
        heading: 'Cuándo sí necesitas un técnico',
        paragraphs: [
          'Hay situaciones en las que intentar reparar por cuenta propia puede empeorar el daño o representar un riesgo. Contacta a un técnico certificado si:',
        ],
        warning: 'Llama a un técnico si el compresor no arranca, hay agua en el piso debajo de la nevera, escuchas golpes fuertes o crujidos, o si la nevera tiene menos de 10 años y el problema persiste después de los chequeos básicos.',
      },
      {
        heading: 'Mantenimiento preventivo: cómo evitar la falla',
        paragraphs: [
          'Una nevera bien mantenida puede durar entre 15 y 20 años. Estos hábitos simples marcan una gran diferencia:',
        ],
        tips: [
          'Limpia el condensador trasero cada 6 meses — especialmente en hogares con mascotas.',
          'No sobrecarges la nevera: el aire frío necesita circular entre los alimentos.',
          'Deja enfriar los alimentos calientes antes de guardarlos.',
          'Mantén la nevera alejada de fuentes de calor como la estufa o la luz solar directa.',
          'Programa una revisión profesional cada 2 años para verificar el nivel de gas y el estado del compresor.',
        ],
        highlight: 'Un mantenimiento preventivo anual puede costar mucho menos que una reparación de compresor, cuyo precio en Cali puede superar los $300.000 pesos.',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta que un técnico revise mi nevera en Cali?',
        a: 'La visita de diagnóstico cuesta $50.000 pesos. El precio de la reparación varía según la complejidad, los repuestos y la tecnología del equipo — no existe tarifa fija. Si apruebas la reparación dentro del mes siguiente al diagnóstico, esos $50.000 se abonan al total.',
      },
      {
        q: '¿Es normal que la nevera haga ruido?',
        a: 'Sí, un sonido suave de motor o burbujeo es normal. Lo que no es normal: golpes, crujidos fuertes, zumbidos intermitentes o ruidos que se vuelven progresivamente más intensos.',
      },
      {
        q: '¿Cada cuánto necesita mantenimiento profesional una nevera?',
        a: 'Recomendamos una revisión técnica cada 2 años, o antes si notas que el compresor trabaja continuamente sin alcanzar la temperatura, o si los consumos de energía aumentaron sin explicación.',
      },
    ],
  },

  'mantenimiento-lavadora-cada-cuanto': {
    slug: 'mantenimiento-lavadora-cada-cuanto',
    title: 'Mantenimiento de lavadora: cuándo hacerlo y por qué es clave para su duración',
    metaTitle: 'Mantenimiento Lavadora: Cuándo y Cómo Hacerlo | SomosTécnicos Cali',
    metaDescription: 'Guía completa de mantenimiento de lavadoras: señales de alerta, limpieza mensual, mantenimiento profesional y cada cuánto se recomienda. Consejos de técnicos en Cali.',
    keywords: [
      'mantenimiento lavadora cali',
      'cada cuánto limpiar lavadora',
      'lavadora mal olor ropa',
      'vida útil lavadora colombia',
      'cuidado lavadora carga frontal',
      'limpieza tambor lavadora',
    ],
    canonicalPath: '/blog/mantenimiento-lavadora-cada-cuanto',
    heroImage: '/electrodomesticos/lavadora carga superior lg.jpg',
    heroImageAlt: 'Lavadora de carga frontal limpia y en buen estado',
    cardImage: '/hero-servicios/lavadora-blanca-lg.png',
    cardImageAlt: 'Lavadora LG carga superior para reparación en Cali',
    excerpt: 'La lavadora es uno de los electrodomésticos más usados en el hogar, pero también uno de los que menos mantenimiento reciben. Aprende a cuidarla para que dure el doble.',
    category: 'mantenimiento',
    categoryLabel: 'Mantenimiento',
    publishedAt: '2026-03-03',
    readTime: 4,
    relatedServiceSlug: 'reparacion-lavadoras-cali',
    relatedServiceLabel: 'Reparación de Lavadoras en Cali',
    sections: [
      {
        heading: 'El error más común: usar sin dar mantenimiento',
        paragraphs: [
          'La lavadora trabaja duro: en un hogar colombiano promedio lava entre 4 y 7 ciclos por semana. Sin embargo, la mayoría de propietarios solo recuerdan darle mantenimiento cuando ya tiene un problema visible.',
          'La realidad es que una lavadora sin mantenimiento acumula residuos de jabón, cal, bacterias y pelusas en lugares que no se ven. Esto no solo afecta el lavado de la ropa, sino que genera desgaste prematuro en los rodamientos, bombas y mangueras.',
          'Una lavadora que recibe mantenimiento regular puede durar entre 12 y 15 años. Una que no lo recibe, raramente supera los 7.',
        ],
      },
      {
        heading: 'Señales de que tu lavadora te está pidiendo atención',
        paragraphs: [
          'Tu lavadora te da señales antes de fallar completamente. Aprende a reconocerlas:',
        ],
        tips: [
          'La ropa sale con mal olor después del lavado — señal de bacterias en el tambor o el filtro.',
          'Los ciclos tardan más de lo normal — posible problema en la bomba de agua o los sensores.',
          'Vibra o se desplaza sola durante el centrifugado — rodamientos desgastados o nivel desnivelado.',
          'Deja manchas blanquecinas en ropa oscura — exceso de residuo de jabón acumulado.',
          'Hace ruidos extraños (chirridos, golpes) — posibles objetos atrapados o piezas desgastadas.',
          'El agua no drena completamente — filtro tapado o bomba con problemas.',
        ],
      },
      {
        heading: 'Mantenimiento mensual que puedes hacer en casa',
        paragraphs: [
          'Estas rutinas simples no requieren herramientas ni conocimientos técnicos y marcan una gran diferencia:',
        ],
        tips: [
          'Ciclo de limpieza: una vez al mes, corre un ciclo vacío con agua caliente y una taza de vinagre blanco. Elimina bacterias y residuos de jabón del tambor.',
          'Limpia el filtro de pelusas: en lavadoras de carga superior suele ser accesible desde adentro. En carga frontal, revisa el panel frontal inferior.',
          'Deja la puerta abierta: después de cada lavado, deja la puerta o tapa entreabierta para que el tambor ventile y no acumule humedad ni malos olores.',
          'Revisa las mangueras: una vez al mes, verifica que no haya humedad o goteos en las conexiones traseras.',
          'No sobrecargues: llenar la lavadora al máximo en cada ciclo desgasta rodamientos y motor más rápido.',
        ],
        highlight: 'Usa la cantidad de detergente indicada — más jabón no lava mejor, pero sí obstruye el sistema de drenaje con el tiempo.',
      },
      {
        heading: '¿Qué solo puede hacer un técnico especializado?',
        paragraphs: [
          'Hay partes del mantenimiento que requieren desmontaje del equipo, herramientas específicas y conocimiento técnico:',
          'La limpieza profunda de los rodamientos y el eje del tambor, la revisión del sistema eléctrico y las resistencias, el diagnóstico y reemplazo de correas, y la verificación de la bomba de drenaje son trabajos que un técnico certificado puede hacer de manera segura y sin riesgo de dañar otros componentes.',
        ],
        warning: 'No intentes desmontar el tambor ni el panel trasero sin experiencia. Una conexión mal ubicada puede causar un corto eléctrico o dejar la lavadora sin garantía de fábrica.',
      },
      {
        heading: '¿Cada cuánto tiempo se recomienda el mantenimiento profesional?',
        paragraphs: [
          'La frecuencia depende del uso:',
          'Para un hogar con uso normal (4-5 ciclos por semana), recomendamos mantenimiento profesional cada 18 meses. Si la lavadora lava más de 7 ciclos semanales o hay niños pequeños en casa con mucha ropa, lo ideal es cada 12 meses.',
          'El mantenimiento profesional incluye limpieza completa del tambor y carcasa interna, revisión de rodamientos y correas, calibración de sensores de carga y temperatura, y verificación del sistema eléctrico.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto dura una lavadora con buen mantenimiento?',
        a: 'Una lavadora que recibe mantenimiento regular puede durar entre 12 y 15 años. Sin mantenimiento, el promedio baja a 6-8 años. La diferencia está principalmente en el estado de los rodamientos y la bomba de drenaje.',
      },
      {
        q: '¿Por qué mi ropa huele mal después de lavarla?',
        a: 'La causa más común es la acumulación de bacterias y residuos de jabón en el tambor, especialmente en lavadoras de carga frontal. Realiza un ciclo de limpieza con vinagre blanco y deja siempre la puerta abierta entre lavados. Si el problema persiste, puede ser el filtro o la junta de la puerta.',
      },
      {
        q: '¿Cuánto cuesta el mantenimiento profesional de una lavadora en Cali?',
        a: 'El costo de la visita de diagnóstico es de $50.000 pesos. Un mantenimiento preventivo completo varía según el tipo de lavadora y las tareas necesarias. Le damos la cotización exacta tras el diagnóstico.',
      },
    ],
  },

  'senales-calentador-necesita-mantenimiento': {
    slug: 'senales-calentador-necesita-mantenimiento',
    title: '5 señales de que tu calentador de agua necesita mantenimiento (y cuándo es urgente)',
    metaTitle: '5 Señales de que tu Calentador Necesita Mantenimiento | SomosTécnicos',
    metaDescription: 'Aprende a identificar cuándo tu calentador de agua necesita mantenimiento antes de que falle. Señales de alerta, vida útil recomendada y cuándo llamar a un técnico en Cali.',
    keywords: [
      'mantenimiento calentador agua cali',
      'señales calentador dañado',
      'calentador hace ruido solución',
      'vida útil calentador colombia',
      'calentador eficiente gas',
      'calentador agua preventivo cali',
    ],
    canonicalPath: '/blog/senales-calentador-necesita-mantenimiento',
    heroImage: '/blog/seguridad/mantenimiento-calentador.PNG',
    heroImageAlt: 'Calentador de agua a gas en buen estado de mantenimiento',
    cardImage: '/blog/seguridad/mantenimiento-calentador.PNG',
    cardImageAlt: 'Ilustración de mantenimiento preventivo para calentador de agua',
    excerpt: 'El calentador es el electrodoméstico más olvidado del hogar. Sin mantenimiento, no solo pierde eficiencia sino que puede volverse un riesgo. Conoce las 5 señales clave.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-03',
    readTime: 4,
    relatedServiceSlug: 'reparacion-calentadores-cali',
    relatedServiceLabel: 'Reparación de Calentadores en Cali',
    sections: [
      {
        heading: 'El electrodoméstico más olvidado del hogar',
        paragraphs: [
          'El calentador de agua trabaja en silencio, escondido en un cuarto de ropas o una bodega, y la mayoría de las personas solo lo recuerdan cuando el agua fría les llega en la ducha.',
          'Sin embargo, un calentador sin mantenimiento no solo consume más gas o energía de lo necesario: en casos extremos puede representar riesgos reales para el hogar. La buena noticia es que el equipo siempre da señales antes de fallar.',
        ],
      },
      {
        heading: 'Señal 1: El agua ya no calienta como antes',
        paragraphs: [
          'Si antes te duchaba con una perilla al 50% y ahora necesitas abrirla al máximo para lograr la misma temperatura, el calentador está perdiendo eficiencia.',
          'Las causas más comunes son la acumulación de sedimentos calcáreos en el fondo del tanque (en calentadores de acumulación) o la degradación de los quemadores (en calentadores de paso). Ambas tienen solución con mantenimiento preventivo.',
        ],
      },
      {
        heading: 'Señal 2: Escuchas ruidos dentro del equipo',
        paragraphs: [
          'Sonidos como burbujeo fuerte, golpes metálicos o crujidos al calentar el agua son señales de sedimentación. Cuando el calcio y los minerales del agua se acumulan en el fondo del tanque, el calentamiento se vuelve irregular y ruidoso.',
          'Este problema es especialmente común en Cali y el Valle del Cauca, donde el agua tiene un nivel moderado de dureza mineral.',
        ],
        tips: [
          'Un sonido suave de burbujeo es normal.',
          'Golpes o explosiones al encender: requiere atención inmediata.',
          'Crujidos que van aumentando: señal de sedimentos avanzados.',
        ],
      },
      {
        heading: 'Señal 3: Ves óxido o el agua tiene color extraño',
        paragraphs: [
          'Si el agua caliente sale con un leve color amarillento, rojizo o con partículas visibles, puede estar indicando corrosión interna del tanque o de las tuberías de conexión.',
          'Este problema requiere revisión técnica urgente, ya que el agua contaminada puede afectar tuberías y accesorios del baño, y en casos avanzados indica que el tanque necesita reemplazo.',
        ],
        warning: 'Si el agua sale con color o tiene olor metálico, no la uses para cocinar ni beber. Contacta a un técnico para diagnóstico inmediato.',
      },
      {
        heading: 'Señal 4: Hay pequeñas goteras cerca al equipo',
        paragraphs: [
          'Manchas de humedad en la pared detrás del calentador, goteos en las conexiones de entrada o salida del agua, o humedad en el piso debajo del equipo son señales de fugas.',
          'Las microfugas en las conexiones suelen ser de fácil reparación si se atienden a tiempo. Ignorarlas puede llevar a daños en la estructura de la vivienda y al deterioro acelerado del equipo.',
        ],
      },
      {
        heading: 'Señal 5: Tu calentador tiene más de 8 años sin revisión',
        paragraphs: [
          'La vida útil promedio de un calentador de paso a gas es de 10 a 12 años. La de un calentador de acumulación es de 8 a 10 años. Sin embargo, sin mantenimiento preventivo estos plazos se reducen considerablemente.',
          'Si tu equipo tiene más de 8 años y nunca ha tenido una revisión técnica, existe una alta probabilidad de que los quemadores, la válvula de gas o las conexiones internas ya presenten desgaste significativo.',
        ],
        highlight: 'Una revisión profesional cada 2 años puede extender la vida útil de tu calentador hasta en un 40% y reducir el consumo de gas hasta un 20%.',
      },
      {
        heading: '¿Cuándo es una emergencia? Actúa de inmediato si...',
        paragraphs: [
          'Hay situaciones que no admiten espera:',
        ],
        warning: 'Llama a un técnico de inmediato si percibes olor a gas cerca del calentador, si el equipo hace explosiones al encender, si hay goteo visible de agua que no puedes controlar, o si el piloto se apaga constantemente sin razón aparente. En caso de olor fuerte a gas, abre ventanas y no enciendas interruptores.',
      },
      {
        heading: 'Recomendaciones de mantenimiento preventivo',
        paragraphs: [
          'Seguir estas recomendaciones puede ahorrarte una reparación costosa y prolongar la vida de tu equipo:',
        ],
        tips: [
          'Revisión profesional cada 2 años: limpieza de quemadores, verificación de válvulas y presión.',
          'Temperatura ideal: configura el calentador entre 50°C y 55°C. Más alto no es más eficiente y sí más costoso.',
          'No lo dejes encendido toda la noche si no lo usas — apágalo antes de dormir.',
          'En calentadores de acumulación: purgar los sedimentos del fondo al menos una vez al año.',
          'Revisa visualmente las conexiones cada 6 meses buscando humedad o decoloración.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto dura un calentador de agua en Colombia?',
        a: 'Un calentador de paso a gas dura entre 10 y 12 años con mantenimiento regular. Uno de acumulación entre 8 y 10 años. Sin mantenimiento estos plazos se reducen significativamente.',
      },
      {
        q: '¿Es peligroso un calentador que gotea?',
        a: 'Depende del origen de la gotera. Una gotera en las conexiones de agua generalmente es de fácil reparación. Si hay humedad en el tanque mismo o en las conexiones de gas, requiere atención urgente. Ante la duda, llama a un técnico.',
      },
      {
        q: '¿Cuánto cuesta el mantenimiento de un calentador en Cali?',
        a: 'La visita de diagnóstico cuesta $50.000 pesos. Un mantenimiento preventivo completo varía según el tipo y marca del equipo. Le informamos el costo exacto antes de proceder.',
      },
    ],
  },

  'reparar-o-cambiar-electrodomestico': {
    slug: 'reparar-o-cambiar-electrodomestico',
    title: '¿Reparar o cambiar tu electrodoméstico? Una guía honesta para tomar la mejor decisión',
    metaTitle: '¿Reparar o Cambiar Electrodoméstico? Guía Práctica | SomosTécnicos',
    metaDescription: 'Guía honesta para decidir si vale la pena reparar o cambiar tu nevera, lavadora, calentador o televisor. Incluye regla del 50%, vida útil por equipo y factores clave.',
    keywords: [
      'reparar o cambiar nevera cali',
      'cuándo cambiar electrodoméstico',
      'vida útil electrodomésticos colombia',
      'vale la pena reparar lavadora',
      'costos reparación electrodomésticos cali',
      'guía compra electrodoméstico usado',
    ],
    canonicalPath: '/blog/reparar-o-cambiar-electrodomestico',
    heroImage: '/electrodomesticos/nevecon lg1.jpg',
    heroImageAlt: 'Técnico evaluando si vale la pena reparar un electrodoméstico',
    cardImage: '/hero-servicios/nevera-mabe-servicio-domicilio.png',
    cardImageAlt: 'Técnico evaluando si vale la pena reparar un electrodoméstico',
    excerpt: '¿Tu nevera se dañó y no sabes si repararla o comprar una nueva? Te explicamos cómo tomar esa decisión de manera inteligente, sin presiones y con información real.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-03',
    readTime: 6,
    sections: [
      {
        heading: 'La pregunta que todos nos hacemos en algún momento',
        paragraphs: [
          'El electrodoméstico falla, el técnico llega y da el diagnóstico. Y entonces viene la pregunta inevitable: ¿vale la pena repararlo o es mejor comprarlo nuevo?',
          'Es una decisión que mezcla economía, comodidad y hasta emociones — porque a veces uno se encariña con el equipo de 12 años que nunca había dado problemas. Aquí te damos una guía honesta para decidir bien.',
        ],
      },
      {
        heading: 'La regla del 50%: un buen punto de partida',
        paragraphs: [
          'En el mundo de los electrodomésticos existe una regla práctica ampliamente usada por técnicos y asesores de consumidor: si el costo de la reparación supera el 50% del valor de un equipo equivalente nuevo, generalmente conviene más cambiar.',
          'Por ejemplo, si una nevera similar nueva cuesta $1.800.000 pesos, y la reparación del compresor cuesta $1.100.000 pesos, matemáticamente conviene más invertir en un equipo nuevo con garantía de fábrica.',
          'Sin embargo, esta regla es un punto de partida, no una verdad absoluta. Hay otros factores importantes.',
        ],
        highlight: 'Regla del 50%: si la reparación cuesta más del 50% del valor del equipo nuevo equivalente, evalúa seriamente el cambio.',
      },
      {
        heading: 'Guía por tipo de electrodoméstico',
        paragraphs: [
          '**Neveras y nevecones:** Vida útil promedio: 15-20 años. Si el equipo tiene menos de 10 años y la falla no es de compresor, casi siempre vale la pena reparar. Si el compresor falla en un equipo de más de 12 años, evalúa el cambio.',
          '**Lavadoras:** Vida útil promedio: 10-15 años. Si la falla es mecánica (rodamientos, bomba, correa) en un equipo de menos de 8 años, repara. Si hay múltiples fallas consecutivas en un equipo viejo, es señal de desgaste general.',
          '**Calentadores:** Vida útil promedio: 10-12 años. Si el equipo supera los 10 años y tiene una falla mayor (intercambiador, cámara de combustión), considera el cambio. Las reparaciones menores siempre valen.',
          '**Televisores:** La decisión depende fuertemente de si la pantalla está dañada. Una pantalla rota en un TV de 40 pulgadas puede costar más que un equipo nuevo. Problemas de tarjeta o backlight suelen ser económicamente viables de reparar.',
          '**Estufas:** Son equipos muy durables (15-20 años). Casi siempre vale la pena reparar salvo que el cuerpo esté físicamente dañado o los quemadores estén completamente deteriorados.',
        ],
      },
      {
        heading: 'Otros factores que inclinan la balanza',
        paragraphs: [
          'Además del costo, considera estos puntos antes de decidir:',
        ],
        tips: [
          '¿Existen repuestos? Si la marca descontinuó el modelo, conseguir piezas será costoso y difícil.',
          '¿Es la primera falla importante? Un equipo que falló por primera vez merece una segunda oportunidad.',
          '¿Ha fallado repetidamente en el último año? Múltiples fallas indican desgaste generalizado.',
          '¿El equipo tiene garantía vigente? Si aún tiene garantía de fábrica, siempre procede con el servicio autorizado.',
          '¿Consume mucha energía? Los equipos viejos sin tecnología inverter pueden costar más en la factura mensual de lo que ahorrarías al no comprar uno nuevo.',
        ],
      },
      {
        heading: 'Nuestra recomendación honesta',
        paragraphs: [
          'Como empresa de servicio técnico, podríamos tener incentivo de decirte siempre que repares. Pero no es así como trabajamos.',
          'Cuando un técnico de SomosTécnicos llega a tu hogar, su primera responsabilidad es darte un diagnóstico honesto. Si la reparación no es la mejor opción económicamente, te lo decimos. Nuestro objetivo no es una reparación: es que tomes la mejor decisión para tu hogar.',
          'Si el equipo tiene mucho tiempo, múltiples fallas o el costo de reparación es desproporcionado, lo más probable es que te lo digamos directamente.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto suele costar una reparación de nevera en Cali?',
        a: 'No existe tarifa fija — el precio varía según la complejidad, los repuestos y la tecnología del equipo. La visita de diagnóstico cuesta $50.000 pesos; si apruebas la reparación dentro del mes siguiente, ese valor se abona al total. El técnico te entrega una cotización antes de proceder.',
      },
      {
        q: '¿Vale la pena reparar un televisor con pantalla rota?',
        a: 'En la mayoría de los casos no. Una pantalla nueva para un TV de 40-50 pulgadas puede costar el 70-90% del valor de un equipo nuevo equivalente. La excepción son los televisores OLED de gama alta. Siempre hacemos el diagnóstico antes de recomendar.',
      },
      {
        q: '¿Qué pasa con la garantía si reparo con un técnico externo?',
        a: 'Si el equipo tiene garantía de fábrica vigente (generalmente 1 año), la reparación con un técnico no autorizado puede anularla. En ese caso, acude primero al servicio técnico oficial. Si la garantía ya venció, puedes usar cualquier técnico certificado.',
      },
    ],
  },

  'habitos-para-alargar-vida-electrodomesticos': {
    slug: 'habitos-para-alargar-vida-electrodomesticos',
    title: '10 hábitos que alargan la vida de tus electrodomésticos (y ahorran dinero)',
    metaTitle: '10 Hábitos para Cuidar tus Electrodomésticos | SomosTécnicos Cali',
    metaDescription: 'Descubre 10 hábitos prácticos para alargar la vida de tu nevera, lavadora, calentador y televisor. Consejos de nuestros técnicos en Cali para ahorrar en reparaciones.',
    keywords: [
      'cómo cuidar electrodomésticos',
      'alargar vida electrodomésticos colombia',
      'consejos mantenimiento hogar cali',
      'hábitos cuidado nevera lavadora',
      'electrodomésticos duran más cali',
      'ahorro energía electrodomésticos',
    ],
    canonicalPath: '/blog/habitos-para-alargar-vida-electrodomesticos',
    heroImage: '/blog/seguridad/matenimiento-nevera.png',
    heroImageAlt: 'Electrodomésticos bien mantenidos en cocina colombiana',
    cardImage: '/blog/seguridad/matenimiento-nevera.png',
    cardImageAlt: 'Ilustración de hábitos de cuidado para alargar la vida de electrodomésticos',
    excerpt: 'En SomosTécnicos atendemos miles de servicios al año. Estos son los patrones que vemos en los hogares donde los equipos duran el doble: 10 hábitos que marcan la diferencia.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-03',
    readTime: 5,
    sections: [
      {
        heading: 'Lo que aprendemos de visitar miles de hogares en Cali',
        paragraphs: [
          'Después de más de 5 años y miles de servicios técnicos en Cali y el Valle del Cauca, hemos identificado patrones claros: los hogares donde los electrodomésticos duran más no tienen equipos más caros ni más modernos. Tienen mejores hábitos de uso y mantenimiento.',
          'Aquí compartimos los 10 más importantes, organizados por equipo.',
        ],
      },
      {
        heading: 'Para tu nevera',
        paragraphs: [
          'La nevera es el electrodoméstico que más energía consume en un hogar colombiano promedio y también el que más resiente el mal uso.',
        ],
        tips: [
          'Temperatura ideal: entre 3°C y 5°C para el refrigerador, -18°C para el congelador. Más frío no conserva mejor, solo consume más.',
          'No guardes alimentos calientes directamente — espera a que enfríen. El vapor calienta el interior y hace trabajar más el compresor.',
          'Deja al menos 10 cm de espacio entre la nevera y la pared para que el condensador ventile correctamente.',
          'Limpia la goma del sello de la puerta con un paño húmedo cada mes para mantener su elasticidad.',
        ],
      },
      {
        heading: 'Para tu lavadora',
        paragraphs: [
          'La lavadora es el electrodoméstico que más fácilmente se deteriora por mal uso. Estos hábitos pueden duplicar su vida útil:',
        ],
        tips: [
          'Usa la cantidad exacta de detergente indicada en el empaque. El exceso forma espuma que bloquea el sistema de drenaje.',
          'No llenes la lavadora al máximo en cada ciclo — deja un espacio equivalente al 20% de la capacidad.',
          'Después de cada lavado, deja la puerta entreabierta para que el interior ventile y no crezca moho.',
          'Limpia el filtro de pelusas al menos una vez al mes.',
        ],
      },
      {
        heading: 'Para tu calentador de agua',
        paragraphs: [
          'El calentador trabaja todos los días pero raramente recibe atención hasta que falla. Dos hábitos simples pueden duplicar su vida útil:',
        ],
        tips: [
          'Configura la temperatura entre 50°C y 55°C. Temperaturas más altas no aportan beneficio y aceleran la formación de sarro.',
          'Si vas a estar fuera de casa más de 3 días, apaga el calentador completamente — no tiene sentido mantenerlo calentando agua que nadie va a usar.',
          'Revisa visualmente cada 6 meses que no haya humedad ni manchas alrededor del equipo.',
        ],
        highlight: 'Un calentador ajustado a 55°C en lugar de 70°C puede reducir el consumo de gas hasta un 18% en el mes.',
      },
      {
        heading: 'Para televisores y equipos electrónicos',
        paragraphs: [
          'Los equipos electrónicos son sensibles a dos enemigos principales: el calor y las variaciones de voltaje.',
        ],
        tips: [
          'Usa un regulador de voltaje o UPS. En Cali y el Valle del Cauca los picos de voltaje son frecuentes y pueden dañar la tarjeta madre de cualquier equipo en segundos.',
          'No bloquees las rejillas de ventilación del televisor — necesita circular aire para no sobrecalentarse.',
          'Apaga el televisor completamente cuando no lo uses (no en standby). Los equipos en standby consumen energía y los componentes acumulan calor innecesariamente.',
          'Limpia con un paño seco suave, nunca con productos líquidos directamente sobre la pantalla.',
        ],
      },
      {
        heading: 'El mantenimiento preventivo: la mejor inversión',
        paragraphs: [
          'Más allá de los hábitos diarios, el mantenimiento profesional preventivo es la mejor inversión que puedes hacer por tus electrodomésticos.',
          'No es lo mismo llamar a un técnico cuando el equipo ya falló (reparación correctiva) que llamarlo para una revisión preventiva antes de que algo falle. En el segundo caso, el técnico puede identificar desgaste, limpiar componentes críticos y calibrar el equipo — todo por una fracción del costo de una reparación mayor.',
        ],
        tips: [
          'Nevera: revisión cada 2 años.',
          'Lavadora: revisión cada 12-18 meses.',
          'Calentador: revisión cada 2 años.',
          'Computadores: limpieza interna y revisión anual.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Con qué frecuencia debo llamar un técnico para mantenimiento preventivo?',
        a: 'Depende del equipo: nevera y calentador cada 2 años, lavadora cada 12-18 meses. Si el equipo es muy antiguo o de uso intensivo, reduce ese intervalo a la mitad.',
      },
      {
        q: '¿Qué temperatura es ideal para una nevera?',
        a: 'Entre 3°C y 5°C para el compartimento refrigerador y -18°C para el congelador. A estas temperaturas los alimentos se conservan bien y el compresor no trabaja en exceso.',
      },
      {
        q: '¿Vale la pena un regulador de voltaje para el televisor?',
        a: 'Absolutamente sí. Un regulador básico cuesta entre $30.000 y $80.000 pesos en Colombia. Proteger un Smart TV de $1.500.000+ de un pico de voltaje que puede destruir la tarjeta principal justifica ampliamente esa inversión.',
      },
    ],
  },

  'cuanto-cuesta-reparar-electrodomestico-cali': {
    slug: 'cuanto-cuesta-reparar-electrodomestico-cali',
    title: '¿Cuánto cuesta reparar un electrodoméstico en Cali? Guía de precios 2026',
    metaTitle: '¿Cuánto Cuesta Reparar un Electrodoméstico en Cali? | SomosTécnicos',
    metaDescription: 'Guía de precios de reparación de electrodomésticos en Cali 2026. Descubre cuánto cuesta reparar nevera, lavadora, calentador, estufa y televisor, y cuándo conviene reparar vs comprar nuevo.',
    keywords: [
      'cuánto cuesta reparar nevera cali',
      'precio reparación lavadora colombia',
      'costo técnico electrodomésticos cali',
      'reparar o comprar nuevo electrodoméstico',
      'precio visita técnico domicilio cali',
      'presupuesto reparación calentador cali',
    ],
    canonicalPath: '/blog/cuanto-cuesta-reparar-electrodomestico-cali',
    heroImage: '/blog/seguridad/cuanto-cuesta-una-reparacion-nevera.png',
    heroImageAlt: 'Técnico revisando electrodoméstico con herramientas en Cali',
    cardImage: '/blog/seguridad/cuanto-cuesta-una-reparacion-nevera.png',
    cardImageAlt: 'Ilustración de costos y presupuesto para reparación de electrodomésticos',
    excerpt: 'En Cali no existe un precio fijo para reparar electrodomésticos: el costo depende de la falla, los repuestos y la tecnología del equipo. Aquí te explicamos cómo funciona el proceso y qué factores determinan el valor final.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-04',
    readTime: 6,
    sections: [
      {
        heading: '¿Por qué no existe un precio fijo para la reparación?',
        paragraphs: [
          'Una de las preguntas más frecuentes que recibimos es: "¿cuánto me cuesta arreglar mi nevera?" La respuesta honesta es: depende. No existe una tarifa fija porque cada reparación es distinta.',
          'Los tres factores que determinan el costo final son: **la complejidad de la falla** (un fusible dañado no cuesta lo mismo que un compresor), **los repuestos requeridos** (piezas originales vs genéricas, disponibilidad local), y **la tecnología del equipo** (una lavadora inverter de última generación requiere diagnóstico electrónico especializado; una convencional de 10 años, no).',
          'Por eso nuestro proceso siempre comienza con un diagnóstico: el técnico evalúa el equipo, identifica la falla y te entrega una cotización antes de tocar nada.',
        ],
      },
      {
        heading: 'El diagnóstico: $50.000 pesos, abonables al total',
        paragraphs: [
          'La visita técnica a domicilio tiene un costo fijo de **$50.000 pesos**. Este valor cubre el desplazamiento y el diagnóstico completo del equipo.',
          'Si decides aprobar la reparación dentro del mes siguiente a la visita, esos $50.000 se descuentan del total — no pagas el diagnóstico por aparte. Si decides no reparar, solo pagas la visita.',
        ],
        highlight: 'Ejemplo: diagnóstico el 4 de marzo. Si apruebas la reparación antes del 4 de abril, los $50.000 se abonan al total. Después de esa fecha, se cobra nuevamente la visita si el equipo requiere otro diagnóstico.',
      },
      {
        heading: 'Factores que suben o bajan el costo',
        paragraphs: [
          'Estos son los elementos que el técnico evalúa para construir la cotización:',
        ],
        tips: [
          '**Tipo de falla**: una falla eléctrica simple (fusible, sensor) cuesta menos que una falla mecánica (compresor, bomba de agua, motor).',
          '**Disponibilidad del repuesto**: piezas de marcas comunes como LG, Samsung o Haceb suelen conseguirse el mismo día en Cali. Repuestos de marcas menos comunes pueden tardar y costar más.',
          '**Antigüedad del equipo**: en equipos con más de 12 años puede ser difícil conseguir repuestos originales; las piezas genéricas son más económicas pero pueden tener menor durabilidad.',
          '**Tecnología inverter**: los compresores y motores inverter son más eficientes pero su reparación requiere equipos de diagnóstico especializado, lo que incrementa el costo.',
          '**Número de fallas**: a veces al reparar la falla principal se detectan problemas secundarios. El técnico siempre informa antes de proceder.',
        ],
      },
      {
        heading: '¿Cuándo conviene reparar y cuándo comprar nuevo?',
        paragraphs: [
          'Una regla práctica usada por técnicos experimentados: si el costo de la reparación supera el **50% del valor de reposición del equipo**, considera reemplazarlo.',
          'Pero hay matices importantes. Un electrodoméstico de buena marca con menos de 8 años puede valer la pena reparar aunque el costo sea alto — tiene mucha vida útil por delante. Uno de marca desconocida con 12 años puede no justificarlo aunque la reparación sea económica.',
        ],
        tips: [
          'Menos de 5 años de uso: casi siempre conviene reparar, especialmente si es de buena marca.',
          'Entre 5 y 10 años: evalúa el costo de reparación vs precio de equipo nuevo similar. Si la reparación es menos del 40% del nuevo, repara.',
          'Más de 10 años: si la falla es de compresor, motor principal o pantalla, compara bien antes de decidir.',
          'Equipo con garantía vigente: contacta primero al fabricante o distribuidor — puede ser reparación sin costo.',
        ],
      },
      {
        heading: 'El proceso de cotización: sin sorpresas',
        paragraphs: [
          'En SomosTécnicos trabajamos con total transparencia. El proceso es siempre el mismo:',
        ],
        tips: [
          '**Visita de diagnóstico** ($50.000): el técnico evalúa el equipo en tu domicilio.',
          '**Cotización detallada**: recibes el desglose de mano de obra y repuestos antes de aprobar.',
          '**Tú decides**: no se realiza ninguna reparación sin tu aprobación explícita.',
          '**Reparación con garantía**: 30 días de garantía en todas las reparaciones realizadas.',
          '**Pago al finalizar**: pagas cuando el equipo queda funcionando, no antes.',
        ],
        highlight: 'Nunca realizamos reparaciones sin cotización aprobada. Si el equipo requiere repuesto que no tenemos disponible, te informamos el tiempo de espera antes de proceder.',
      },
      {
        heading: '¿Qué incluye la garantía de 30 días?',
        paragraphs: [
          'Todas las reparaciones realizadas por SomosTécnicos incluyen 30 días de garantía sobre la falla atendida. Si el mismo problema regresa dentro de ese período, lo solucionamos sin costo adicional.',
          'La garantía cubre la mano de obra y los repuestos instalados. No cubre fallas nuevas o daños causados por mal uso, cortes de energía o causas externas.',
        ],
        warning: 'La garantía no cubre fallas distintas a la reparada, ni daños por fluctuaciones de voltaje, inundaciones o uso inadecuado del equipo. Recomendamos usar reguladores de voltaje para televisores y equipos electrónicos sensibles.',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta la visita del técnico a domicilio en Cali?',
        a: 'La visita de diagnóstico cuesta $50.000 pesos, valor que se abona al total de la reparación si la apruebas dentro del mes siguiente a la visita.',
      },
      {
        q: '¿Dan presupuesto antes de hacer la reparación?',
        a: 'Sí, siempre. El técnico diagnostica el equipo, entrega la cotización con desglose de repuestos y mano de obra, y solo procede con tu aprobación. No hay sorpresas en la factura final.',
      },
      {
        q: '¿Cuánto tarda una reparación a domicilio en Cali?',
        a: 'La mayoría de reparaciones se realizan el mismo día de la visita. Si se requieren repuestos especiales, el tiempo puede extenderse entre 1 y 3 días hábiles. El técnico te informa el plazo exacto al entregar la cotización.',
      },
      {
        q: '¿Tienen garantía en las reparaciones?',
        a: '30 días de garantía en todas las reparaciones. Si la misma falla regresa dentro del período de garantía, la atendemos sin costo adicional.',
      },
      {
        q: '¿Atienden todos los barrios de Cali?',
        a: 'Atendemos toda la ciudad de Cali y municipios cercanos como Jamundí, Palmira, Yumbo y Candelaria. El costo de la visita es el mismo para toda el área de cobertura.',
      },
    ],
  },

  'guia-completa-reparacion-electrodomesticos-cali': {
    slug: 'guia-completa-reparacion-electrodomesticos-cali',
    title: 'Guía completa de reparación de electrodomésticos en Cali 2026',
    metaTitle: 'Guía Completa Reparación Electrodomésticos Cali 2026 | SomosTécnicos',
    metaDescription: 'Todo lo que necesitas saber sobre reparación de electrodomésticos en Cali: neveras, lavadoras, calentadores, estufas, televisores. Diagnóstico, precios, marcas y cuándo llamar a un técnico.',
    keywords: [
      'reparación electrodomésticos cali',
      'técnico electrodomésticos cali domicilio',
      'servicio técnico cali',
      'reparar nevera lavadora calentador cali',
      'guía reparación electrodomésticos colombia',
      'técnico certificado electrodomésticos cali',
    ],
    canonicalPath: '/blog/guia-completa-reparacion-electrodomesticos-cali',
    heroImage: '/electrodomesticos/lavadora carga superior lg.jpg',
    heroImageAlt: 'Técnico certificado reparando electrodoméstico en hogar de Cali',
    cardImage: '/blog/guia-reparacion-card.svg',
    cardImageAlt: 'Ilustración de guía completa para reparación de electrodomésticos en Cali',
    excerpt: 'La guía definitiva para propietarios de vivienda en Cali: qué hacer cuando falla un electrodoméstico, cómo elegir un técnico confiable, qué preguntar antes de aprobar una reparación y cómo prolongar la vida de tus equipos.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-04',
    readTime: 10,
    sections: [
      {
        heading: 'Lo primero que debes hacer cuando falla un electrodoméstico',
        paragraphs: [
          'El momento en que un electrodoméstico deja de funcionar genera estrés, especialmente si se trata de la nevera o el calentador — equipos que usamos todos los días. Pero antes de llamar a un técnico o salir a comprar uno nuevo, hay pasos básicos que pueden ahorrarte tiempo y dinero.',
          '**Revisa lo obvio primero.** El 15% de los llamados que recibimos en SomosTécnicos se resuelven en los primeros 2 minutos: breaker caído, enchufe mal conectado, fusible del hogar, o el equipo en modo de protección. Son los primeros puntos que revisa cualquier técnico al llegar.',
          '**No intentes reparar si no sabes.** Abrir un compresor, manipular el gas refrigerante o intervenir el sistema de gas de un calentador requiere certificación técnica. Hacerlo sin conocimiento puede convertir un daño menor en uno mayor — y en algunos casos representa un riesgo real.',
        ],
        tips: [
          'Verifica breakers y conexiones eléctricas antes de llamar al técnico.',
          'Revisa si el equipo está en garantía del fabricante (primeros 12 meses generalmente).',
          'Documenta el síntoma: qué hace, qué no hace, desde cuándo, si hizo algún ruido antes de fallar.',
          'No intentes desmontar piezas internas si no tienes formación técnica.',
        ],
      },
      {
        heading: 'Cuándo llamar a un técnico: señales que no puedes ignorar',
        paragraphs: [
          'Algunos síntomas requieren atención técnica inmediata — esperar puede convertir una reparación económica en un reemplazo costoso, o representar un riesgo para el hogar.',
        ],
        warning: 'Llama de inmediato si: percibes olor a gas cerca del calentador o la estufa, hay chispas visibles en cualquier electrodoméstico, escuchas golpes fuertes o explosiones, el equipo genera calor excesivo en el exterior, o hay agua acumulada debajo de la nevera o lavadora.',
      },
      {
        heading: 'Neveras: fallas más frecuentes en Cali',
        paragraphs: [
          'Las neveras son el electrodoméstico que más servicio técnico demanda en Cali, según nuestra experiencia. El clima cálido y húmedo de la ciudad (promedio 24°C) hace que los equipos trabajen con mayor exigencia que en ciudades frías.',
          'La falla número uno que atendemos: **condensador sucio**. El calor y el polvo de Cali obstruyen el serpentín trasero con mayor rapidez que en otras ciudades. El resultado es una nevera que trabaja el doble, consume más energía y gradualmente pierde capacidad de enfriamiento.',
          'La segunda causa más frecuente: **sello de puerta deteriorado**. La humedad del ambiente acelera el desgaste de la goma. Cuando el sello pierde hermeticidad, el frío escapa y el compresor no puede compensarlo.',
        ],
        tips: [
          'Limpia el condensador trasero cada 6 meses — especialmente si tienes mascotas.',
          'Prueba el sello de la puerta: cierra un papel; si sale sin resistencia, el sello necesita reemplazo.',
          'La temperatura ideal: 3-5°C refrigerador, -18°C congelador.',
          'Deja al menos 10 cm de espacio entre la nevera y la pared para ventilación.',
        ],
      },
      {
        heading: 'Lavadoras: lo que más falla y por qué',
        paragraphs: [
          'Las lavadoras de carga frontal y carga superior tienen perfiles de falla distintos. Las frontales son más eficientes en agua y energía, pero más costosas de reparar cuando fallan los rodamientos o el sello de tambor. Las de carga superior son mecánicamente más simples y generalmente más económicas de mantener.',
          'La falla más frecuente en lavadoras en Cali es el **filtro de bomba tapado**. La calidad del agua en algunas zonas de la ciudad deja sedimentos que se acumulan progresivamente. El síntoma: la ropa queda mojada al terminar el ciclo, o la lavadora tarda más de lo normal en drenar.',
          'Segunda falla frecuente: **rodamientos desgastados**. Se manifiesta con vibración excesiva y ruido de fricción durante el centrifugado. Si se ignora, puede dañar el tambor — una reparación considerablemente más costosa.',
        ],
        tips: [
          'Limpia el filtro de la bomba cada 3 meses — la mayoría de lavadoras tiene acceso desde el frente inferior.',
          'No sobrecargues la lavadora: la ropa necesita espacio para moverse durante el lavado.',
          'Usa la cantidad correcta de jabón — el exceso genera espuma que deteriora los rodamientos.',
          'Si la lavadora vibra mucho, verifica que está nivelada con un nivel de burbuja.',
        ],
      },
      {
        heading: 'Calentadores: seguridad primero',
        paragraphs: [
          'El calentador es el electrodoméstico con mayor potencial de riesgo del hogar cuando no recibe mantenimiento adecuado. Un calentador a gas con válvula dañada o conexiones deterioradas puede generar acumulación de gas — una situación de emergencia.',
          'En Cali y el Valle del Cauca, el agua tiene un nivel moderado de dureza mineral. Con el tiempo, los minerales se depositan en el fondo del tanque (calentadores de acumulación) o en los quemadores (calentadores de paso), reduciendo la eficiencia y generando ruidos característicos.',
          'La vida útil promedio de un calentador de paso a gas es de 10-12 años. Uno de acumulación, 8-10 años. Con mantenimiento preventivo cada 2 años, estos plazos se extienden significativamente.',
        ],
        warning: 'Si percibes olor a gas cerca del calentador, abre ventanas de inmediato, no enciendas interruptores ni llamas, sal del área y llama a un técnico certificado. No intentes revisar el equipo por tu cuenta.',
      },
      {
        heading: 'Cómo elegir un técnico de electrodomésticos confiable en Cali',
        paragraphs: [
          'El mercado de técnicos informales en Cali es amplio. Elegir el proveedor equivocado puede resultar en una reparación que dura poco, o en daños adicionales por mal diagnóstico. Estas son las preguntas clave que debes hacer antes de contratar:',
        ],
        tips: [
          '¿Dan cotización por escrito antes de proceder? Un técnico serio siempre detalla mano de obra y repuestos.',
          '¿Tienen garantía sobre la reparación? El estándar mínimo del sector es 30 días.',
          '¿Están identificados? El técnico debe poder mostrar identificación y pertenecer a una empresa verificable.',
          '¿Tienen reseñas verificables? Busca en Google Maps o plataformas de reseñas — no solo en la web del servicio.',
          '¿Trabajan con repuestos originales o genéricos? Pregunta explícitamente — afecta la durabilidad de la reparación.',
        ],
        highlight: 'SomosTécnicos tiene más de 200 reseñas verificadas en Google con calificación promedio de 4.8/5. Todos nuestros técnicos están identificados, trabajan con cotización previa y ofrecen 30 días de garantía.',
      },
      {
        heading: 'Mantenimiento preventivo: la mejor inversión',
        paragraphs: [
          'Una revisión técnica preventiva anual puede costar significativamente menos que una reparación mayor. Esta es la frecuencia recomendada por electrodoméstico:',
        ],
        tips: [
          '**Nevera**: limpieza de condensador cada 6 meses; revisión técnica completa cada 2 años.',
          '**Lavadora**: limpieza de filtro cada 3 meses; revisión técnica cada 2 años.',
          '**Calentador a gas**: revisión técnica cada 2 años (obligatoria para seguridad).',
          '**Estufa a gas**: limpieza de quemadores cada 6 meses; revisión de válvulas anual.',
          '**Televisor**: limpieza externa mensual; nada más salvo que presente síntomas.',
        ],
      },
      {
        heading: 'Marcas de electrodomésticos más comunes en Cali: qué técnicos debemos saber',
        paragraphs: [
          'En Cali conviven electrodomésticos de marcas internacionales premium (LG, Samsung, Whirlpool), marcas colombianas consolidadas (Haceb, Challenger) y marcas de bajo costo de alta rotación (Mabe, Centrales, Electrolux).',
          'Las marcas con mayor disponibilidad de repuestos en Cali son LG, Samsung y Haceb — conseguir piezas el mismo día de la visita es habitual. Para marcas menos comunes, puede requerirse importación con tiempos de 3 a 10 días hábiles.',
          'Los equipos inverter (LG Inverter, Samsung Digital Inverter) son más eficientes pero requieren diagnóstico electrónico especializado. No todos los técnicos del mercado tienen el equipo necesario para trabajarlos correctamente.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto tiempo tarda un técnico en llegar a mi domicilio en Cali?',
        a: 'Normalmente coordinamos la visita el mismo día o al día siguiente. En casos urgentes (nevera sin frío, calentador sin agua caliente), priorizamos la atención. Llamamos para confirmar el horario exacto.',
      },
      {
        q: '¿Reparan todas las marcas de electrodomésticos?',
        a: 'Sí. Trabajamos con todas las marcas: LG, Samsung, Haceb, Challenger, Whirlpool, Mabe, Electrolux, Centrales, Indurama, Kalley y más. Para marcas con repuestos de difícil consecución, informamos el tiempo de espera antes de proceder.',
      },
      {
        q: '¿Pueden reparar electrodomésticos inverter?',
        a: 'Sí. Contamos con equipos de diagnóstico electrónico para sistemas inverter de LG, Samsung y otras marcas. Estas reparaciones requieren técnico especializado, lo que se refleja en el costo de la mano de obra.',
      },
      {
        q: '¿Qué pasa si después de la reparación vuelve a fallar?',
        a: 'Todas nuestras reparaciones tienen 30 días de garantía. Si la misma falla regresa en ese período, la atendemos sin costo adicional. Solo debes llamarnos y coordinamos la visita de garantía.',
      },
      {
        q: '¿Atienden los fines de semana?',
        a: 'Sí, atendemos de lunes a sábado. Para emergencias (calentador, nevera) hacemos lo posible por atender el mismo día independientemente del día de la semana. Contáctanos por WhatsApp para urgencias.',
      },
    ],
  },

  'puedo-instalar-camara-yo-mismo': {
    slug: 'puedo-instalar-camara-yo-mismo',
    title: '¿Puedo instalar una cámara de seguridad yo mismo? DIY vs. instalación profesional',
    metaTitle: 'Instalar Cámaras de Seguridad: DIY vs Profesional | SomosTécnicos',
    metaDescription: 'Descubre si puedes instalar tu cámara Wi-Fi o si requieres un técnico profesional de CCTV. Evalúa riesgos, conexión red y alcance para seguridad del hogar.',
    keywords: [
      'instalar camara de seguridad yo mismo',
      'camara seguridad diy colombia',
      'instalacion camara wifi hogar',
      'diferencia camara diy vs profesional',
      'instalar cctv sin tecnico colombia',
      'CCTV',
      'sensores de movimiento',
      'seguridad hogar'
    ],
    canonicalPath: '/blog/puedo-instalar-camara-yo-mismo',
    heroImage: '/blog/seguridad/camara-diy-vs-profesional.png',
    heroImageAlt: 'Cámara DIY vs Instalación Profesional CCTV para Seguridad de Hogar',
    cardImage: '/hero-servicios/nvr-camaras-seguridad.png',
    cardImageAlt: 'Comparación entre instalación DIY e instalación profesional CCTV',
    excerpt: 'Una cámara Wi-Fi la puedes instalar en 20 minutos. Un sistema CCTV con NVR y cableado estructurado requiere un profesional. Te explicamos dónde está la línea.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-09',
    readTime: 5,
    relatedServiceSlug: 'camaras-seguridad-alarmas-cali',
    relatedServiceLabel: 'Instalación de Cámaras de Seguridad en Cali',
    sections: [
      {
        heading: '¿Es posible instalar una cámara de seguridad sin ser técnico?',
        paragraphs: [
          'Sí, es completamente posible instalar una cámara de seguridad por cuenta propia. La complejidad varía según el tipo de cámara, pero el mercado actual ofrece opciones diseñadas específicamente para el usuario final sin conocimientos técnicos.',
          '<img src="/blog/seguridad/app-camara-wifi-celular.png" alt="App de Seguridad Control de Cámara Wi-Fi" className="w-full aspect-video rounded-xl my-6 object-cover shadow-sm border border-slate-200" />',
          'Los pasos generales de una instalación básica son sencillos: elegir una buena ubicación, montar la cámara con los soportes incluidos, conectarla a la energía, vincularla a tu red Wi-Fi y configurar el dispositivo desde la app móvil.',
          'Marcas orientadas al hogar inteligente como TP-Link (Tapo) y Ezviz ofrecen interfaces amigables que guían al usuario paso a paso, sin necesidad de conocimientos de redes ni cableado complejo.',
        ],
        tips: [
          'Descarga la app del fabricante antes de comenzar la instalación — te guiará todo el proceso.',
          'Ubica la cámara a no más de 10 metros del router Wi-Fi para una señal estable.',
          'Asegúrate de que el punto de montaje tenga acceso a un tomacorriente cercano o planifica cómo ocultarás el cable.',
          'Haz una prueba de imagen y ángulo de visión antes de atornillar definitivamente la cámara.',
        ],
      },
      {
        heading: 'Cuándo la instalación DIY funciona perfectamente',
        paragraphs: [
          'La autoinstalación es ideal en estos escenarios:',
          '**Cámaras Wi-Fi para interiores:** Modelos de sobremesa o con soporte magnético como la TP-Link Tapo C200 o la Ezviz C6 se colocan sin herramientas y se configuran en menos de 10 minutos.',
          '**Cámaras Wi-Fi para exteriores compactas:** Modelos con batería recargable (como la Ezviz BC1 o la TP-Link Tapo C320WS) no requieren perforación ni cableado eléctrico.',
          '**Sistemas inalámbricos con panel de alarma:** Paneles como el Hikvision AX PRO o el Dahua AirShield permiten añadir sensores de puertas y ventanas sin pasar cables por las paredes.',
          'En estos casos, si tienes comodidad con apps móviles y disposición a seguir instrucciones, la instalación DIY es perfectamente viable y puede ahorrarte el costo de mano de obra.',
        ],
        highlight: 'Las cámaras Wi-Fi de gama doméstica están diseñadas para que cualquier persona las instale. Si puedes conectar un dispositivo Bluetooth o configurar un router, puedes instalar una cámara TP-Link o Ezviz.',
      },
      {
        heading: 'Cuándo sí necesitas un instalador profesional',
        paragraphs: [
          'Para sistemas más robustos, la experiencia del instalador es el factor determinante del éxito del proyecto:',
          '**Sistemas con cableado coaxial o UTP:** Pasar cable por paredes, techos o fachadas requiere herramientas especializadas, conocimiento de la estructura del inmueble y criterio para elegir recorridos eficientes y estéticos.',
          '**Configuración de DVR/NVR en red:** Configurar correctamente la dirección IP, el acceso remoto seguro (P2P o DDNS), los permisos de usuario y la grabación programada requiere conocimientos de redes que van más allá del usuario promedio.',
          '**Múltiples cámaras con diferentes lentes:** Elegir el ángulo de visión correcto para cada punto, calcular la distancia efectiva de visión nocturna y verificar que no haya puntos ciegos es una tarea de diseño que un instalador experimentado realiza con criterio.',
          '**Recuperación de contraseñas en sistemas Hikvision:** A diferencia de otras marcas, el proceso de recuperación de contraseña en Hikvision requiere software específico (SADP) y en muchos casos el apoyo del soporte técnico del fabricante. Sin el procedimiento correcto, puedes quedar bloqueado.',
        ],
        warning: 'Si instalas un sistema Hikvision o Dahua con NVR y olvidas la contraseña de administrador, el proceso de recuperación es complejo y puede requerir llevar el equipo a un técnico certificado. Documenta siempre las credenciales en un lugar seguro.',
      },
      {
        heading: 'Conclusión: el tipo de proyecto define la respuesta',
        paragraphs: [
          'Instalar una cámara tú mismo es una excelente opción si buscas soluciones para el hogar con conectividad Wi-Fi, precios accesibles y apps intuitivas. Es la ruta correcta para vigilar una habitación, la entrada de tu apartamento o tu mascota cuando no estás.',
          'Sin embargo, si tu objetivo es montar un CCTV comercial con múltiples cámaras, grabación en red, cableado estructurado y altas exigencias de seguridad, lo más recomendable es contar con un instalador profesional que garantice que la configuración de red y los equipos quede impecable desde el primer día.',
          'En SomosTécnicos instalamos desde sistemas básicos de 2 cámaras hasta proyectos de 32 puntos con NVR y acceso remoto configurado. Si tienes dudas sobre qué tipo de sistema necesitas, contáctanos y te asesoramos sin compromiso.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué herramientas necesito para instalar una cámara Wi-Fi yo mismo?',
        a: 'Para cámaras de interior: solo tu smartphone con la app instalada. Para cámaras de exterior que requieren montaje en pared: taladro, tornillos (generalmente incluidos), destornillador y cinta métrica para verificar el ángulo. El proceso completo toma entre 15 y 30 minutos.',
      },
      {
        q: '¿Cuál es la diferencia entre una cámara PoE y una cámara Wi-Fi?',
        a: 'Una cámara PoE (Power over Ethernet) recibe tanto la energía como la conexión de red por un único cable UTP Cat5e/Cat6. Es más estable y confiable que Wi-Fi, pero requiere pasar el cable desde un switch PoE o NVR hasta cada cámara — por eso es trabajo de instalador profesional. Una cámara Wi-Fi usa la red inalámbrica de tu hogar y solo necesita un tomacorriente cercano.',
      },
      {
        q: '¿Puedo mezclar cámaras Wi-Fi con un sistema NVR profesional?',
        a: 'Depende del fabricante y el modelo. Algunos NVR de Hikvision y Dahua permiten agregar cámaras Wi-Fi de su misma marca como canales adicionales. Sin embargo, en general los NVR profesionales están diseñados para cámaras IP cableadas (PoE). Para mezclar tecnologías, consulta con un técnico que evalúe la compatibilidad específica de los equipos.',
      },
      {
        q: '¿Una cámara Wi-Fi funciona si se va el internet?',
        a: 'La cámara sigue grabando en la tarjeta SD aunque se vaya el internet. Lo que no funciona sin internet es la visualización remota desde tu celular y la subida a la nube. Si usas un NVR local con cámaras PoE, el sistema graba independientemente del internet.',
      },
      {
        q: '¿Vale la pena pagar instalación profesional para solo 2 cámaras?',
        a: 'Si son 2 cámaras Wi-Fi de interior, probablemente no — la autoinstalación es viable. Si son 2 cámaras de exterior con cableado y configuración de acceso remoto seguro, sí vale la pena: un técnico garantiza que el montaje sea resistente a la intemperie, el cable quede correctamente sellado y el acceso remoto esté configurado sin vulnerabilidades de seguridad.',
      },
    ],
  },

  'seguridad-residencial-como-proteger-tu-hogar': {
    slug: 'seguridad-residencial-como-proteger-tu-hogar',
    title: 'Seguridad residencial: ¿Cómo proteger tu hogar de manera efectiva?',
    metaTitle: 'Seguridad Residencial Completa: Cómo Proteger tu Hogar | SomosTécnicos',
    metaDescription: 'Guía de seguridad para el hogar: cámaras Wi-Fi, alarmas inalámbricas y cerraduras. Asegura tu casa con CCTV, sensores de movimiento y seguridad electrónica.',
    keywords: [
      'seguridad residencial cali',
      'como proteger mi hogar cali',
      'alarma inalambrica para casa colombia',
      'CCTV',
      'sensores de movimiento',
      'seguridad hogar',
      'camara wifi para hogar cali',
      'cerradura inteligente colombia',
    ],
    canonicalPath: '/blog/seguridad-residencial-como-proteger-tu-hogar',
    heroImage: '/blog/seguridad/sistema-seguridad-inteligente.png',
    heroImageAlt: 'Sistema de seguridad residencial inteligente con CCTV integrado',
    cardImage: '/especialistas/seguridad_electronica2.jpg',
    cardImageAlt: 'Técnico instalando sistema de seguridad Smart Home en vivienda',
    excerpt: 'Proteger tu casa va más allá de una cámara: alarmas inalámbricas, cerraduras inteligentes y CCTV con sensores de movimiento forman el nuevo estándar.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-09',
    readTime: 7,
    relatedServiceSlug: 'camaras-seguridad-alarmas-cali',
    relatedServiceLabel: 'Instalación de Cámaras de Seguridad en Cali',
    sections: [
      {
        heading: 'La nueva seguridad residencial: más allá de la cámara aislada',
        paragraphs: [
          'La seguridad residencial ha experimentado una transformación radical gracias a la digitalización y a los ecosistemas de Smart Home (hogar inteligente). Hoy, proteger una casa va mucho más allá de instalar una cámara aislada; se trata de implementar soluciones integrales que combinan videovigilancia, paneles de intrusión y control de accesos inteligente.',
          'Los principales fabricantes han desarrollado líneas residenciales específicas que eliminan las complicaciones de las instalaciones tradicionales: sistemas inalámbricos, gestión remota desde el celular y dispositivos con diseño estético que se integran con la decoración del hogar.',
        ],
        highlight: 'Un sistema de seguridad residencial completo en 2026 incluye tres capas: detección (sensores y cámaras), disuasión (alarma audible y notificaciones) y acceso controlado (cerradura inteligente o videoportero). Cada capa por separado es insuficiente.',
      },
      {
        heading: 'Sistemas de intrusión inalámbricos: alarmas sin obra',
        paragraphs: [
          'Para evitar cableados complejos que modifiquen la estructura de tu casa, existen sistemas de alarma altamente eficientes que operan por radiofrecuencia o Wi-Fi:',
          '**U-PROX:** Ideal por su rápida configuración vía Wi-Fi/4G y diseño elegante disponible en blanco o negro. Se integra fácilmente en viviendas modernas.',
          '<img src="/blog/seguridad/panel-alarma-smart.png" alt="Panel de Alarma Inteligente en Hogar Moderno" className="w-full aspect-video rounded-xl my-6 object-cover shadow-sm border border-slate-200" />',
          '**Hikvision AX PRO:** Ofrece kits que incluyen detectores de movimiento con función antimascotas y sensores magnéticos para puertas y ventanas conectados por radio. Es una de las opciones más instaladas en Colombia por su relación precio-prestaciones.',
          '**Honeywell Galaxy:** Para residencias de alta gama que requieren un panel robusto con integración avanzada y mayor cantidad de zonas.',
        ],
        tips: [
          'Los detectores antimascotas evitan falsas alarmas si tienes perros o gatos — son esenciales en hogares con mascotas.',
          'Instala sensores magnéticos en todas las puertas exteriores y ventanas de planta baja como mínimo.',
          'Elige un panel con batería de respaldo: ante cortes de luz, el sistema debe seguir operando.',
          'Combina el sistema de intrusión con la app del fabricante para recibir notificaciones en tu celular en tiempo real.',
        ],
      },
      {
        heading: 'Cámaras de vigilancia domésticas: monitoreo desde tu teléfono',
        paragraphs: [
          'Para el monitoreo interior y exterior del hogar, las marcas TP-Link (Tapo), Ezviz y Xiaomi ofrecen equipos con excelente relación calidad-precio. Estas cámaras destacan por:',
          '**Conectividad Wi-Fi:** Se configuran en minutos desde la app sin necesidad de cableado adicional.',
          '**Visión nocturna:** Infrarroja para grabación en blanco y negro con total oscuridad, o a color (con luz de relleno LED) para identificar detalles en la noche.',
          '**Detección de movimiento con IA:** Las versiones más recientes distinguen personas de mascotas o vehículos, reduciendo las notificaciones falsas.',
          '**Audio bidireccional:** Te permite hablar a través de la cámara con quien esté en casa — útil para recibir domicilios o atender visitas cuando no estás.',
        ],
        highlight: 'Para una casa de uno o dos pisos, un sistema básico efectivo incluye: 1 cámara exterior en la entrada principal, 1 cámara interior en sala o pasillo principal, y 1 cámara en zona de parqueo o jardín si existe.',
      },
      {
        heading: 'Cerraduras inteligentes y control de accesos',
        paragraphs: [
          'El acceso al hogar también se ha modernizado. Sistemas de cerraduras inteligentes permiten abrir y cerrar las puertas a distancia desde el celular. Sus ventajas principales:',
          '<img src="/blog/seguridad/cerradura-inteligente-puerta.png" alt="Cerradura Inteligente App Control" className="w-full aspect-video rounded-xl my-6 object-cover shadow-sm border border-slate-200" />',
          '**Acceso temporal:** Puedes generar códigos o permisos con vigencia limitada para empleados del hogar, domicilios o huéspedes — sin entregar llaves físicas.',
          '**Historial de accesos:** Sabes exactamente quién entró y a qué hora.',
          '**Sin llaves:** Elimina el riesgo de llaves duplicadas o perdidas.',
          'Para alojamientos turísticos (Airbnb, hostales), las cerraduras inteligentes son especialmente útiles: el huésped recibe un código temporal que se desactiva automáticamente al finalizar su estadía, sin necesidad de que descargue ninguna app.',
        ],
      },
      {
        heading: 'Almacenamiento: ¿nube o tarjeta SD?',
        paragraphs: [
          'Una decisión clave al instalar cámaras domésticas es dónde se guardarán las grabaciones. Las opciones principales son:',
          '**Tarjeta SD (Edge Storage):** El video se graba directamente en la cámara. No depende de internet ni de suscripciones. Si la cámara es robada o destruida, las grabaciones se pierden con ella.',
          '**Nube:** El video se sube a los servidores del fabricante. Permite acceder a grabaciones aunque la cámara sea sustraída, pero requiere internet constante y generalmente tiene un costo mensual de suscripción.',
          '**NVR local:** Para sistemas de más de 2 cámaras, un grabador NVR centraliza el almacenamiento con mayor capacidad y sin costos recurrentes. Es la opción más recomendada para proyectos que planean escalar.',
        ],
        warning: 'Si confías solo en la tarjeta SD y un intruso sustrae la cámara, perderás las grabaciones del evento. Para mayor seguridad, combina SD con respaldo en nube o usa un NVR en un lugar no accesible.',
      },
      {
        heading: 'Conclusión: seguridad inteligente al alcance de cualquier hogar',
        paragraphs: [
          'La seguridad residencial moderna se basa en la automatización, la prevención y la facilidad de uso. Ya sea que necesites una cámara Wi-Fi para vigilar tu hogar desde el celular, un sistema de alarma inalámbrico que disuada intrusos, o una cerradura inteligente que elimine el uso de llaves físicas, el mercado actual ofrece soluciones confiables para todos los presupuestos.',
          'La clave es elegir un ecosistema de marcas reconocidas que se integre fácilmente a tus rutinas diarias, brindándote tranquilidad total sin invadir la estética de tu hogar.',
          'En SomosTécnicos diseñamos e instalamos sistemas de seguridad residencial en Cali a medida: desde una cámara Wi-Fi básica hasta sistemas completos con alarma, NVR y cerradura inteligente. Contáctanos para una asesoría sin compromiso.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta instalar un sistema de seguridad completo en una casa en Cali?',
        a: 'Un sistema básico (2 cámaras Wi-Fi + panel de alarma inalámbrico con 2 sensores) puede estar entre $800.000 y $1.500.000 pesos instalado. Un sistema intermedio (4 cámaras IP con NVR + alarma con 4 zonas) oscila entre $2.000.000 y $3.500.000 pesos. Realizamos visita de diagnóstico gratuita para cotizar según tu propiedad.',
      },
      {
        q: '¿Las alarmas inalámbricas son tan confiables como las cableadas?',
        a: 'Sí, en el rango residencial. Los sistemas modernos como Hikvision AX PRO o Dahua AirShield usan frecuencias de radio encriptadas con alta inmunidad a interferencias. La ventaja principal es que no requieren obra ni perforación de paredes, lo que reduce costos y tiempos de instalación.',
      },
      {
        q: '¿Puedo instalar una cámara Wi-Fi yo mismo o necesito un técnico?',
        a: 'Cámaras de marcas como TP-Link Tapo o Ezviz están diseñadas para autoinstalación en interiores. Sin embargo, para cámaras de exterior (que requieren perforación, sellado y fijación correcta), y para cualquier sistema con NVR o alarma, recomendamos instalación profesional para garantizar cobertura correcta, configuración de seguridad y garantía del trabajo.',
      },
      {
        q: '¿Qué pasa con el sistema si se va la luz o el internet?',
        a: 'Un sistema bien diseñado tiene respaldo para ambos escenarios: los paneles de alarma incluyen batería interna que mantiene el sistema activo por 8 a 24 horas sin luz. Las cámaras con tarjeta SD siguen grabando aunque se vaya el internet. Para mayor resiliencia, los sistemas 4G/LTE como U-PROX mantienen la comunicación con la central aunque corten el internet fijo.',
      },
      {
        q: '¿Las cerraduras inteligentes son seguras contra intentos de hackeo?',
        a: 'Las cerraduras de marcas reconocidas como Raixer usan cifrado AES-128 y comunicación Bluetooth o Wi-Fi con autenticación segura. El riesgo principal no es el hackeo remoto, sino contraseñas débiles o no revocar accesos de personas que ya no deben tenerlo. Gestionar correctamente los usuarios y códigos es tan importante como el hardware.',
      },
    ],
  },

  'es-legal-poner-camara-de-vigilancia': {
    slug: 'es-legal-poner-camara-de-vigilancia',
    title: '¿Es legal poner una cámara de vigilancia? Lo que debes saber antes de instalar',
    metaTitle: 'Normativa y Legalidad de Cámaras de Vigilancia | SomosTécnicos',
    metaDescription: 'Instalar cámaras de seguridad es legal, pero exige garantizar la privacidad de datos. Conoce la legalidad del CCTV y su uso en el hogar y comercio.',
    keywords: [
      'es legal poner camaras de seguridad colombia',
      'legalidad camaras vigilancia colombia',
      'privacidad datos camaras seguridad',
      'CCTV',
      'seguridad hogar',
      'proteccion datos camaras cctv',
      'ciberseguridad camaras seguridad',
    ],
    canonicalPath: '/blog/es-legal-poner-camara-de-vigilancia',
    heroImage: '/blog/seguridad/camara-diy-vs-profesional.png',
    heroImageAlt: 'Cámara de seguridad instalada en exterior con protección de privacidad',
    cardImage: '/blog/seguridad/camara-diy-vs-profesional.png',
    cardImageAlt: 'Sistema de videovigilancia CCTV cumpliendo normativa de privacidad',
    excerpt: 'Instalar cámaras es legal, pero la ley también exige proteger los datos que se graban. Conoce qué debes cumplir antes de encender tu sistema.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-09',
    readTime: 7,
    relatedServiceSlug: 'camaras-seguridad-alarmas-cali',
    relatedServiceLabel: 'Instalación de Cámaras de Seguridad en Cali',
    sections: [
      {
        heading: '¿Es legal instalar cámaras de seguridad?',
        paragraphs: [
          'Sí, instalar cámaras de videovigilancia es perfectamente legal en Colombia y en la mayoría de países del mundo. Sin embargo, la legalidad no termina en el momento de la instalación física.',
          'Con la expansión de la inteligencia artificial y el almacenamiento en la nube, las obligaciones regulatorias sobre la privacidad de los datos han aumentado significativamente. Los responsables de sistemas de seguridad se enfrentan hoy a marcos normativos en constante evolución, lo que exige que los sistemas implementados garanticen la protección de la información, la transparencia y la privacidad desde su diseño.',
          'En Colombia, la Ley 1581 de 2012 (Habeas Data) regula el tratamiento de datos personales, incluyendo las imágenes captadas por cámaras de vigilancia. Grabar personas sin un propósito legítimo o sin informarles puede constituir una violación a su derecho a la intimidad.',
        ],
        highlight: 'En Colombia es obligatorio informar a las personas que están siendo grabadas. En espacios comunes de edificios o locales comerciales, se debe colocar un aviso visible que indique la presencia de cámaras de seguridad.',
      },
      {
        heading: 'Qué dice la normativa: RGPD, NIS2 y estándares internacionales',
        paragraphs: [
          'Aunque el RGPD (Reglamento General de Protección de Datos) es una norma europea, su alcance afecta a cualquier empresa colombiana que tenga clientes o usuarios en Europa. Asimismo, los estándares ISO y NIS2 están redefiniendo las expectativas del mercado global de videovigilancia.',
          'Es crucial buscar soluciones y proveedores que ofrezcan protecciones de privacidad integradas y auditorías avanzadas para facilitar el cumplimiento normativo. Para proyectos empresariales o institucionales en Colombia, también aplica la Circular 002 de la SIC (Superintendencia de Industria y Comercio) sobre seguridad de la información.',
          'Para hogares y pequeños comercios, las exigencias son menos formales pero no inexistentes: no puedes apuntar cámaras hacia propiedades ajenas, espacios públicos sin autorización, ni grabar a personas en lugares donde tienen expectativa de privacidad (baños, zonas íntimas).',
        ],
        warning: 'Apuntar una cámara hacia la propiedad de un vecino, la vía pública desde un ángulo invasivo o zonas donde las personas tienen expectativa de privacidad puede derivar en demandas civiles o sanciones de la SIC. Siempre consulta con tu técnico instalador sobre el ángulo correcto de cada cámara.',
      },
      {
        heading: 'Buenas prácticas de ciberseguridad para tu sistema',
        paragraphs: [
          'En el panorama actual, la seguridad digital es tan importante como la física. Un alto porcentaje de empresas reporta intentos de violación digital en sus sistemas de control de accesos y video. Para proteger tu sistema, considera:',
          '**Cifrado HTTPS:** Asegúrate de que la transmisión de video entre las cámaras, el NVR y tu celular esté cifrada. Evita sistemas que transmitan en texto plano.',
          '**Contraseñas seguras y únicas:** Nunca dejes la contraseña de fábrica. Usa contraseñas distintas para el NVR, las cámaras individuales y la cuenta de la app móvil.',
          '**Actualizaciones de firmware:** Los fabricantes como Hikvision y Dahua publican actualizaciones que corrigen vulnerabilidades de seguridad. Mantenlas al día.',
          '**Segmentación de red:** Si es posible, coloca las cámaras en una VLAN separada del resto de tu red, para que un acceso no autorizado al sistema de videovigilancia no comprometa otros dispositivos.',
          '**Autenticación multifactor:** Activa la verificación en dos pasos en las aplicaciones móviles de gestión (Hik-Connect, DMSS, Tapo).',
        ],
        tips: [
          'Cambia la contraseña de fábrica antes de conectar cualquier cámara a internet.',
          'Deshabilita el acceso remoto si no lo necesitas — reduce significativamente la superficie de ataque.',
          'Revisa periódicamente quién tiene acceso a tu NVR y elimina usuarios inactivos.',
          'Cuando contrates instalación, pide que el técnico configure el cifrado y las contraseñas, no que las deje por defecto.',
        ],
      },
      {
        heading: 'Certificaciones que garantizan un sistema confiable',
        paragraphs: [
          'Al adquirir equipos, optar por productos que cumplan con el estándar NDAA (National Defense Authorization Act) es un indicador claro de ciberseguridad sólida y diseño responsable. Este estándar garantiza que los equipos no transmiten datos a terceros no autorizados, un requisito que gobiernos y grandes corporaciones ya exigen a sus proveedores.',
          'Adicionalmente, fabricantes líderes como Axis Communications cuentan con certificaciones ISO 27001 en gestión de seguridad de la información. Para proyectos empresariales en Colombia, solicitar estas certificaciones al proveedor es una buena práctica.',
        ],
        highlight: 'Los equipos Hikvision y Dahua de gama comercial incluyen certificación IP66 o IP67 para exteriores, pero la ciberseguridad también depende de la configuración que realice el técnico instalador — el hardware solo es la mitad del trabajo.',
      },
      {
        heading: 'Conclusión: legal sí, pero con responsabilidad',
        paragraphs: [
          'Instalar cámaras de vigilancia es legal y una medida inteligente de protección. Pero conlleva responsabilidad sobre la privacidad de los datos recopilados: dónde se almacenan, quién puede accederlos, cómo se transmiten y cuánto tiempo se conservan.',
          'Un sistema bien instalado no se evalúa únicamente por su capacidad de grabar, sino por su viabilidad tecnológica a largo plazo para proteger la información. Al elegir sistemas con cifrado avanzado, cumplimiento de leyes de privacidad y configuración de ciberseguridad adecuada, tu proyecto de videovigilancia protegerá tu entorno físico y respetará la intimidad de las personas.',
          'En SomosTécnicos instalamos y configuramos tu sistema de seguridad siguiendo todas las buenas prácticas: contraseñas seguras, cifrado activado, ángulos de cámara legalmente correctos y documentación de la instalación.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Necesito permiso para instalar cámaras de seguridad en mi casa?',
        a: 'Para el interior de tu propia propiedad no necesitas permiso. Sí debes asegurarte de que las cámaras no capten espacios de terceros (casa del vecino, zonas privadas de otros) ni vías públicas desde ángulos invasivos. En propiedades horizontales (edificios, conjuntos), consulta el reglamento interno: algunos exigen aprobación de la administración para instalar cámaras en zonas comunes.',
      },
      {
        q: '¿Puedo grabar la calle desde mi casa o negocio?',
        a: 'Puedes captar la vía pública de forma incidental si el ángulo principal cubre tu propiedad. No está permitido instalar cámaras cuyo propósito principal sea vigilar la vía pública o propiedades ajenas. Si tu negocio es en planta baja, un ángulo que cubra la entrada y parte de la acera inmediata suele ser aceptado.',
      },
      {
        q: '¿Por cuánto tiempo debo conservar las grabaciones?',
        a: 'La Ley 1581 de Colombia no establece un tiempo fijo para videovigilancia privada, pero la práctica recomendada es conservar entre 15 y 30 días. Para negocios con mayor exposición a riesgos, algunos optan por 60 días. Más tiempo implica mayor capacidad de almacenamiento y mayor responsabilidad sobre los datos.',
      },
      {
        q: '¿Qué pasa si alguien hackea mis cámaras?',
        a: 'Si tus cámaras no tienen configuración de seguridad adecuada (contraseña de fábrica, sin cifrado, firmware desactualizado), pueden ser accedidas remotamente por terceros. Esto representa un riesgo de privacidad y potencialmente legal si se filtran imágenes de personas. Por eso la configuración inicial por un técnico capacitado es tan importante como el hardware.',
      },
      {
        q: '¿Estoy obligado a avisar que hay cámaras en mi local?',
        a: 'Sí. En espacios donde atienes público (locales comerciales, oficinas, restaurantes), la SIC recomienda colocar un aviso visible que informe la presencia de videovigilancia. Esta señalización es una buena práctica que además te protege legalmente ante cualquier reclamación.',
      },
    ],
  },

  'mejores-marcas-camaras-seguridad': {
    slug: 'mejores-marcas-camaras-seguridad',
    title: '¿Cuáles son las mejores marcas de cámaras de seguridad?',
    metaTitle: 'Mejores Marcas de Cámaras de Seguridad 2026 | SomosTécnicos',
    metaDescription: 'Guía sobre Hikvision, Dahua, Axis, TP-Link, y Xiaomi. Elige el mejor sistema CCTV y las cámaras de seguridad para proteger tu hogar de manera profesional.',
    keywords: [
      'mejores marcas camaras de seguridad',
      'camaras hikvision dahua',
      'seguridad hogar',
      'CCTV',
      'sensores de movimiento',
      'camara vigilancia wifi colombia',
    ],
    canonicalPath: '/blog/mejores-marcas-camaras-seguridad',
    heroImage: '/blog/seguridad/guia-video-vigilancia.png',
    heroImageAlt: 'Sistema NVR CCTV Seguridad de Hikvision y Dahua instalado',
    cardImage: '/blog/seguridad/guia-video-vigilancia.png',
    cardImageAlt: 'Infografia de comparativa CCTV y ventajas de video IP',
    excerpt: 'Hikvision, Dahua, Axis, TP-Link o Xiaomi: te explicamos cuál elegir para tu sistema CCTV si necesitas proteger tu hogar o tu empresa.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-09',
    readTime: 6,
    relatedServiceSlug: 'camaras-seguridad-alarmas-cali',
    relatedServiceLabel: 'Instalación de Cámaras de Seguridad en Cali',
    sections: [
      {
        heading: 'El mercado de la videovigilancia en 2026',
        paragraphs: [
          'El mercado de la videovigilancia ha evolucionado significativamente, ofreciendo una amplia gama de marcas que se adaptan tanto a necesidades residenciales como a proyectos comerciales complejos.',
          'Hoy destacan marcas líderes a nivel mundial como Dahua y Hikvision, reconocidas por su alto desempeño, calidad de imagen y uso en sistemas profesionales de Circuito Cerrado de Televisión (CCTV). Para el sector de hogares y pequeñas empresas, marcas como TP-Link, Ezviz y Xiaomi han ganado gran popularidad al ofrecer soluciones accesibles con conectividad Wi-Fi.',
        ],
        highlight: 'Hikvision y Dahua concentran más del 40% del mercado mundial de videovigilancia, siendo las marcas más instaladas en Colombia tanto en proyectos residenciales como en grandes empresas.',
      },
      {
        heading: 'Factores clave para elegir una cámara de seguridad',
        paragraphs: [
          'Al evaluar qué marca o modelo adquirir, los expertos recomiendan considerar los siguientes factores técnicos y comerciales:',
          '**Garantía y respaldo.** Marcas líderes como Dahua y Hikvision ofrecen entre 1 y 5 años de garantía, lo que brinda tranquilidad a nivel de soporte técnico.',
          '**Resolución y visión nocturna.** Es vital buscar cámaras que ofrezcan desde alta definición (1080p) hasta 4K, y que cuenten con tecnología de infrarroja a color en oscuridad total.',
          '**Conectividad y ecosistema.** Para uso doméstico, la integración con aplicaciones móviles, el almacenamiento en la nube o SD, y el audio bidireccional son aspectos esenciales.',
        ],
        tips: [
          'Para proyectos residenciales pequeños, prioriza cámaras con app móvil estable y almacenamiento SD o nube.',
          'Si instalas más de 4 cámaras, invierte en un NVR: es más confiable que depender solo de la nube.',
          'Verifica que la resolución mínima sea 1080p; cámaras de 720p ya no ofrecen suficiente detalle.',
        ],
      },
      {
        heading: 'Cámaras profesionales vs. cámaras Smart Home: ¿cuál necesitas?',
        paragraphs: [
          'La diferencia principal no está en la calidad de imagen, sino en la infraestructura requerida y el nivel de control que necesitas:',
          '<img src="/blog/seguridad/conexion-cctv-nvr-profesional.png" alt="Conexión de servidor NVR para Sistema CCTV Profesional" className="w-full aspect-video rounded-xl my-6 object-cover shadow-sm border border-slate-200" />',
          '**Cámaras profesionales/comerciales (Hikvision, Dahua, Axis):** Requieren cableado estructurado, grabador NVR o DVR, y configuración técnica especializada. Son ideales en escenarios donde la continuidad del servicio es crítica. No dependen de conexión a internet para grabar.',
          '**Cámaras Smart Home (Ezviz, TP-Link Tapo, Xiaomi):** Funcionan con Wi-Fi, se configuran desde el celular en minutos y no requieren cableado adicional. Son perfectas para vigilar tu hogar desde tu teléfono móvil de forma sencilla.',
        ],
        warning: 'Las cámaras Smart Home dependen de la señal Wi-Fi y del servicio en la nube del fabricante. Para proyectos donde la grabación continua es obligatoria, siempre usa cámaras CCTV con NVR local.',
      },
      {
        heading: 'Conclusión: no existe la "mejor marca", sino la más adecuada',
        paragraphs: [
          'Si buscas proteger un negocio, un edificio corporativo o requieres un sistema robusto, Hikvision y Dahua son inversiones excelentes que lideran el mercado mundial y ofrecen alta durabilidad.',
          'Por otro lado, si necesitas una solución rápida, sin cableado complejo y para vigilar tu hogar desde tu teléfono móvil, opciones como TP-Link Tapo, Xiaomi o Ezviz te brindarán tecnología avanzada a un precio muy competitivo.',
          'La elección final dependerá de la infraestructura de tu propiedad, el número de cámaras requeridas y tus objetivos de seguridad. En SomosTécnicos te asesoramos sin compromiso para diseñar el sistema que mejor se ajuste a tu presupuesto y necesidades en Cali.',
        ],
        highlight: 'En Cali instalamos sistemas Hikvision y Dahua con garantía. Coordinamos la visita de diagnóstico sin costo adicional cuando contratas la instalación.',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta instalar cámaras de seguridad en Cali?',
        a: 'El costo varía según el número de cámaras, el tipo de cableado y si se requiere NVR. Un sistema básico de 4 cámaras IP con NVR y disco duro puede estar entre $1.200.000 y $2.500.000 pesos instalado. Realizamos visita de diagnóstico gratuita para entregarte un presupuesto exacto sin compromiso.',
      },
      {
        q: '¿Es mejor Hikvision o Dahua?',
        a: 'Ambas marcas son líderes mundiales y de calidad comparable. Hikvision suele tener mayor disponibilidad de repuestos en Colombia y su software iVMS-4200 es muy robusto. Dahua destaca por su facilidad de configuración y recuperación de contraseñas. La elección depende del proyecto y del técnico que lo instale, que debe conocer bien la plataforma elegida.',
      },
      {
        q: '¿Puedo ver las cámaras desde mi celular estando fuera de casa?',
        a: 'Sí. Todas las marcas mencionadas ofrecen aplicaciones móviles (Hik-Connect para Hikvision, DMSS para Dahua, Tapo para TP-Link, Mi Home para Xiaomi) que permiten ver el video en vivo y revisar grabaciones desde cualquier lugar con internet.',
      },
      {
        q: '¿Qué resolución de cámara recomienda para identificar personas o placas?',
        a: 'Para identificar rostros con claridad se recomienda mínimo 1080p (Full HD) y una distancia no mayor a 6 metros. Para leer placas de vehículos se necesita al menos 2MP con lente varifocal o 4MP con lente fija. Para perímetros amplios, las cámaras 4K marcan una diferencia considerable.',
      },
      {
        q: '¿Las cámaras Wi-Fi son igual de seguras que las cámaras cableadas?',
        a: 'Las cámaras Wi-Fi son convenientes pero tienen vulnerabilidades: dependen de la señal, pueden sufrir interferencias y son susceptibles a ciberataques si no se configuran correctamente. Las cámaras cableadas con NVR local son más robustas para proyectos donde la seguridad del sistema en sí es crítica.',
      },
    ],
  },

  'donde-colocar-camaras-seguridad-casa': {
    slug: 'donde-colocar-camaras-seguridad-casa',
    title: '¿Dónde colocar cámaras de seguridad en casa para una protección efectiva?',
    metaTitle: 'Ubicación Ideal de Cámaras CCTV para Seguridad del Hogar',
    metaDescription: 'Aprende dónde colocar estratégicamente cámaras CCTV, con sensores de movimiento y visión nocturna, cubriendo hogar y rincones vitales.',
    keywords: [
      'donde colocar camaras de seguridad en casa',
      'ubicacion camaras seguridad hogar',
      'CCTV',
      'sensores de movimiento',
      'seguridad hogar',
      'instalacion camaras residenciales',
    ],
    canonicalPath: '/blog/donde-colocar-camaras-seguridad-casa',
    heroImage: '/blog/seguridad/plano_camara_arquitectura.png',
    heroImageAlt: 'Plano cenital de casa con zonas clave para cámaras y CCTV',
    cardImage: '/blog/seguridad/plano_camara_arquitectura.png',
    cardImageAlt: 'Comparación entre cámara exterior de circuito y domo para interior',
    excerpt: 'Ubicar bien tus cámaras es tan importante como el hardware. Guía clave de cobertura de CCTV en entorno hogar para evitar puntos ciegos.',
    category: 'guias',
    categoryLabel: 'Guías',
    publishedAt: '2026-03-09',
    readTime: 7,
    relatedServiceSlug: 'camaras-seguridad-alarmas-cali',
    relatedServiceLabel: 'Instalación de Cámaras de Seguridad en Cali',
    sections: [
      {
        heading: 'La ubicación define la efectividad del sistema',
        paragraphs: [
          'Para lograr protección real en casa, el primer paso no es comprar la cámara más costosa, sino elegir una ubicación estratégica con vista despejada de la zona que deseas vigilar.',
          'La posición correcta también depende del tipo de cámara. Los fabricantes diseñan equipos para escenarios concretos (interior o exterior), por lo que instalar el modelo equivocado puede generar puntos ciegos, mala imagen nocturna o fallas por clima.',
          'Antes de fijar cada punto, evalúa ángulo de visión, distancia al objetivo, iluminación y zonas de acceso para definir la cámara adecuada y su orientación exacta.',
        ],
        highlight: 'Una buena instalación combina dos decisiones: punto estratégico de montaje + tecnología correcta para ese entorno.',
      },
      {
        heading: 'Entradas, patios y perímetros exteriores',
        paragraphs: [
          'Para puertas principales, rejas, parqueadero, patio o jardín, utiliza cámaras de exterior (outdoor) o cámaras tipo bala (bullet).',
          'Estos modelos incluyen carcasa resistente al clima y suelen tener mejor alcance para perímetros abiertos. Además, su diseño visible funciona como elemento disuasorio para posibles intrusos.',
        ],
        tips: [
          'Instala la cámara exterior entre 2.7 m y 3.2 m de altura para reducir manipulación y mantener detalle útil.',
          'Evita apuntar directo a luces intensas o reflejos metálicos para no perder nitidez de noche.',
          'Si la zona es oscura, exige IR nocturno y protección IP66 o IP67.',
        ],
      },
      {
        heading: 'Interior del hogar: salas, pasillos y escaleras',
        paragraphs: [
          'En áreas internas como sala y corredores amplios, las cámaras domo fijas o domésticas compactas son la opción más estable por su diseño discreto y bajo impacto visual.',
          'En pasillos estrechos y escaleras, conviene usar equipos que soporten formato de pasillo (corridor format), con imagen vertical 9:16. Así se aprovecha el encuadre útil y se reduce desperdicio de ancho de banda grabando paredes.',
        ],
        tips: [
          'Monta domos en techo o esquinas altas para cubrir cruces de circulación.',
          'En pasillos largos, prioriza lente gran angular y formato vertical 9:16.',
          'Si hay mascotas, activa analítica para filtrar eventos por tamaño y reducir falsas alarmas.',
        ],
      },
      {
        heading: 'Condiciones de luz: evita contraluz y zonas ciegas nocturnas',
        paragraphs: [
          'Una ubicación técnicamente correcta puede fallar si no se considera la luz del entorno. Los casos más críticos son ventanas con contraluz fuerte y áreas exteriores con iluminación irregular.',
          'Para estos escenarios busca cámaras con WDR (rango dinámico amplio) para compensar diferencias extremas de luz, y con iluminación IR integrada para visión nocturna cuando no hay luz ambiente.',
        ],
        warning: 'Si una cámara apunta directo a una ventana o farola potente sin WDR, podrías perder rostro y detalle justo en el evento más importante.',
      },
      {
        heading: 'Conclusión: planifica por zona, no por intuición',
        paragraphs: [
          'Saber dónde colocar cámaras de seguridad en casa es una decisión de diseño técnico, no solo estética. Exterior y perímetro requieren equipos robustos y visibles para disuadir; interiores funcionan mejor con domos discretos; y pasillos o escaleras aprovechan formatos verticales.',
          'Cuando asignas el tipo de cámara correcto a cada área y validas iluminación, construyes un sistema eficiente, con cobertura útil y sin puntos ciegos.',
          'En SomosTécnicos te ayudamos a mapear la vivienda, definir ángulos de instalación y configurar el sistema para monitoreo estable desde celular.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántas cámaras necesito para una casa promedio?',
        a: 'Depende del tamaño, pero en una vivienda estándar suelen funcionar bien entre 3 y 5 cámaras: entrada principal, patio o garaje, sala o pasillo central y un punto adicional en acceso secundario.',
      },
      {
        q: '¿Es mejor cámara bala o domo para casa?',
        a: 'No hay una sola mejor. Bala para exterior y perímetro por alcance y disuasión; domo para interior por discreción y mejor integración visual. En la mayoría de hogares se combinan ambas.',
      },
      {
        q: '¿A qué altura se recomienda instalar una cámara?',
        a: 'Generalmente entre 2.7 m y 3.2 m en exterior, y entre 2.4 m y 2.8 m en interior. La altura exacta debe permitir detalle facial sin dejar la cámara expuesta a manipulación.',
      },
      {
        q: '¿Qué tecnología necesito para grabar bien de noche?',
        a: 'Como mínimo, visión infrarroja (IR) y buena sensibilidad de sensor. Si hay cambios fuertes de luz, agrega WDR para mantener detalle en zonas iluminadas y oscuras al mismo tiempo.',
      },
    ],
  },
}

export const BLOG_POSTS_LIST = Object.values(BLOG_POSTS).sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)
