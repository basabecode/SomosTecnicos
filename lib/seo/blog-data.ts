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
    heroImage: '/electrodomesticos/calentador challenger.jpg',
    heroImageAlt: 'Calentador de agua a gas en buen estado de mantenimiento',
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
    heroImage: '/electrodomesticos/lavadora blanca lg1.jpg',
    heroImageAlt: 'Electrodomésticos bien mantenidos en cocina colombiana',
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
    heroImage: '/electrodomesticos/nevecon lg1.jpg',
    heroImageAlt: 'Técnico revisando electrodoméstico con herramientas en Cali',
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
}

export const BLOG_POSTS_LIST = Object.values(BLOG_POSTS).sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)
