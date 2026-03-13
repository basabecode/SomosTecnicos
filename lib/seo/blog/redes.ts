import type { BlogPost } from './types'

export const redesPosts: Record<string, BlogPost> = {
  'internet-lento-en-casa-causas-y-soluciones': {
    slug: 'internet-lento-en-casa-causas-y-soluciones',
    title: 'Internet lento en casa: causas reales y cómo solucionarlo',
    metaTitle: 'Internet Lento en Casa: Causas y Soluciones | SomosTécnicos',
    metaDescription: '¿Tu internet va lento aunque pagas por buena velocidad? Descubre las causas reales — router, cableado, interferencia — y cómo mejorar la señal en casa.',
    keywords: [
      'internet lento en casa',
      'por qué el internet va lento',
      'mejorar señal wifi hogar',
      'router lento Colombia',
      'problemas de internet Cali',
    ],
    canonicalPath: '/blog/internet-lento-en-casa-causas-y-soluciones',
    heroImage: '/blog/redes-computacion/internet-lento.avif',
    heroImageAlt: 'router wifi doméstico con señal débil y múltiples dispositivos conectados en un hogar colombiano',
    cardImage: '/blog/redes-computacion/internet-lento.avif',
    cardImageAlt: 'Router WiFi con indicadores de señal débil en hogar colombiano',
    excerpt: 'La velocidad de internet contratada rara vez es la que llega al dispositivo. Entre el router, el cableado, la ubicación y las interferencias, hay múltiples puntos donde la señal se degrada.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-10',
    readTime: 5,
    relatedServiceSlug: 'tecnico-computadores-redes-cali',
    relatedServiceLabel: 'Técnico Computadores y Redes en Cali',
    sections: [
      {
        heading: 'La velocidad que contratas vs la que recibes',
        paragraphs: [
          'En Colombia, la velocidad de internet que ves en la factura es la velocidad máxima teórica bajo condiciones ideales. En la práctica, factores dentro de tu hogar pueden reducir esa velocidad a la mitad o menos — y la solución casi siempre está en tu control.',
          'Antes de llamar a la empresa de internet para quejarse, hay una lista de verificaciones internas que puede mejorar significativamente la experiencia de conexión.',
        ],
      },
      {
        heading: 'Factor 1: La posición y condición del router',
        paragraphs: [
          'El router es el origen de la señal WiFi en tu hogar. Su ubicación impacta directamente la cobertura: un router escondido dentro de un closet o detrás de un televisor puede perder hasta el 40% de su alcance por las obstrucciones físicas.',
          'La posición ideal es en el centro del área que necesitas cubrir, elevado (no en el piso), alejado de otros aparatos electrónicos y sin objetos metálicos cerca.',
        ],
        tips: [
          'Aleja el router del microondas, del teléfono inalámbrico y del televisor — todos interfieren con la banda 2.4 GHz.',
          'Un router con más de 4-5 años puede ser tecnológicamente obsoleto para los planes de internet actuales.',
          'Reinicia el router completamente (desconectarlo 30 segundos) al menos una vez por semana.',
        ],
      },
      {
        heading: 'Factor 2: Canal WiFi saturado',
        paragraphs: [
          'En edificios y urbanizaciones densas, muchos routers pueden estar usando el mismo canal WiFi, lo que genera interferencia. Esto es especialmente frecuente con la banda 2.4 GHz.',
          'La solución: accede a la configuración de tu router y cambia el canal manualmente. Los canales 1, 6 y 11 son los que no se solapan en 2.4 GHz. En la banda 5 GHz la interferencia es mucho menor y la velocidad es mayor si tu dispositivo la soporta.',
        ],
      },
      {
        heading: 'Factor 3: Demasiados dispositivos conectados',
        paragraphs: [
          'Cada dispositivo conectado comparte el ancho de banda disponible. Un hogar moderno puede tener 10-15 dispositivos activos simultáneamente: teléfonos, tablets, computadores, televisores, consolas, y dispositivos inteligentes (bombillas, cámaras, asistentes de voz).',
          'La solución no siempre es contratar más velocidad — en muchos casos, configurar prioridades de QoS (Quality of Service) en el router da acceso preferente a los dispositivos que más lo necesitan.',
        ],
      },
      {
        heading: 'Factor 4: Cableado de red interno deteriorado',
        paragraphs: [
          'Si tienes internet por cable (Ethernet) y la velocidad es inconsistente, el problema puede estar en el cableado interno. Los cables de red tienen una vida útil, y los conectores RJ45 se deterioran con el tiempo o si se doblaron repetidamente.',
          'Prueba reemplazando el cable entre el router y el computador. Si la velocidad mejora con el cable nuevo, el problema era el cableado.',
        ],
      },
      {
        heading: '¿Cuándo el problema sí es del proveedor?',
        paragraphs: [
          'Si verificaste todo lo anterior y la velocidad sigue siendo insatisfactoria, puede ser un problema del proveedor. Haz una prueba de velocidad directamente desde el cable del modem (sin router) — si la velocidad sigue baja, el problema está antes de tu hogar.',
        ],
        highlight: 'Herramienta recomendada: fast.com o speedtest.net para medir la velocidad real. Haz la prueba conectado por cable directamente al modem para eliminar variables del WiFi.',
      },
    ],
    faqs: [
      {
        q: '¿Debería contratar internet de 200 Mbps si solo tengo 3 personas en casa?',
        a: 'Para 3 personas con uso normal (streaming, videollamadas, redes sociales), un plan de 50-100 Mbps es generalmente suficiente. Un plan de 200 Mbps tiene sentido si hay trabajo remoto intensivo, streaming en 4K simultáneo o gaming online en varios dispositivos.',
      },
      {
        q: '¿Vale la pena comprar un router nuevo si el del proveedor funciona?',
        a: 'Los routers que dan los proveedores suelen ser de gama baja. Si tienes un apartamento grande, muchos dispositivos o paredes gruesas, un router de gama media o alta puede mejorar significativamente la cobertura y la velocidad.',
      },
    ],
  },

  'computador-lento-causas-y-que-hacer': {
    slug: 'computador-lento-causas-y-que-hacer',
    title: 'Computador lento: causas frecuentes y cómo acelerarlo',
    metaTitle: 'Computador Lento: Causas y Cómo Acelerarlo | SomosTécnicos',
    metaDescription: 'Un computador lento puede tener solución sin comprar uno nuevo. Estas son las causas más comunes y los pasos concretos para recuperar rendimiento.',
    keywords: [
      'computador lento',
      'por qué mi computador es lento',
      'cómo acelerar computador',
      'computador lento solución Colombia',
      'PC lento Cali',
    ],
    canonicalPath: '/blog/computador-lento-causas-y-que-hacer',
    heroImage: '/blog/redes-computacion/computador-lento-1.avif',
    heroImageAlt: 'técnico limpiando ventiladores internos y aplicando pasta térmica en computador portátil',
    cardImage: '/blog/redes-computacion/computador-lento-1.avif',
    cardImageAlt: 'Técnico aplicando pasta térmica en procesador de laptop en Cali',
    excerpt: 'Un computador que tarda en abrir programas o se congela no siempre necesita cambio. El 70% de los casos de lentitud se resuelven con mantenimiento de software y limpieza de hardware.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-10',
    readTime: 5,
    relatedServiceSlug: 'tecnico-computadores-redes-cali',
    relatedServiceLabel: 'Técnico Computadores y Redes en Cali',
    sections: [
      {
        heading: 'Lento no significa dañado',
        paragraphs: [
          'La lentitud en un computador es uno de los problemas más comunes y también uno de los más mal diagnosticados. En la mayoría de los casos, el hardware está en perfecto estado — el problema es de software, acumulación de polvo o configuración.',
          'Antes de gastar en un equipo nuevo, hay una serie de causas identificables y solucionables que pueden devolver el rendimiento original a tu computador.',
        ],
      },
      {
        heading: 'Causa 1: Disco duro mecánico lento o defectuoso',
        paragraphs: [
          'Los discos duros mecánicos (HDD) son el componente más lento en la mayoría de los computadores. Cuando el sistema operativo está instalado en un HDD, el tiempo de inicio y la apertura de programas son mucho más lentos que con un SSD.',
          'Si el computador tiene más de 5 años y nunca se ha actualizado el almacenamiento, instalar un SSD es frecuentemente la mejora de rendimiento más impactante — puede reducir el tiempo de inicio de 3 minutos a 20 segundos.',
        ],
        tips: [
          'Señales de disco duro fallando: ruidos de clic o rascar, archivos que no abren, frecuentes pantallas azules.',
          'El programa CrystalDiskInfo (Windows) o Disk Utility (Mac) puede mostrar el estado de salud del disco.',
          'Un SSD de reemplazo cuesta entre $150.000 y $400.000 pesos dependiendo de la capacidad.',
        ],
      },
      {
        heading: 'Causa 2: RAM insuficiente para las aplicaciones actuales',
        paragraphs: [
          'Windows 11 y macOS Sonoma requieren mínimo 8 GB de RAM para funcionar cómodamente. Los computadores con 4 GB de RAM se quedan sin memoria con solo el navegador y dos o tres programas abiertos, lo que hace que el sistema use el disco duro como memoria temporal — lo que es muy lento.',
          'Verificar el uso de RAM mientras el computador está lento: si el Task Manager (Windows) muestra 90-100% de RAM en uso, ampliar la memoria es la solución.',
        ],
      },
      {
        heading: 'Causa 3: Malware o programas no deseados',
        paragraphs: [
          'El malware, adware y los programas que se instalan sin consentimiento pueden consumir CPU y RAM constantemente en segundo plano, haciendo que el computador parezca muy lento.',
          'Un análisis completo con un antivirus actualizado y herramientas de limpieza (como Malwarebytes) puede identificar y eliminar este tipo de software.',
        ],
      },
      {
        heading: 'Causa 4: Sobrecalentamiento por polvo y pasta térmica degradada',
        paragraphs: [
          'El polvo acumulado dentro del computador obstruye los ventiladores y el disipador del procesador. Cuando la temperatura del procesador supera el límite seguro, el sistema reduce automáticamente su velocidad para enfriar (throttling) — lo que resulta en lentitud repentina especialmente bajo carga.',
          'La pasta térmica entre el procesador y el disipador se reseca con el tiempo y pierde eficiencia. En computadores portátiles de más de 3-4 años, renovar la pasta térmica y limpiar el polvo interno puede recuperar el rendimiento completo.',
        ],
        warning: 'Si el computador se calienta mucho al tacto en la zona del procesador (zona central de la base en laptops), o si el ventilador trabaja a máxima velocidad constantemente, hay un problema de temperatura que debe atenderse pronto para evitar daños.',
      },
    ],
    faqs: [
      {
        q: '¿Vale la pena reparar un computador de 7 años para que sea más rápido?',
        a: 'Depende del tipo de uso. Si el computador se usa para ofimática, correo y navegación web, reemplazar el HDD por un SSD y añadir RAM puede darle 3-4 años adicionales de uso útil a una fracción del costo de uno nuevo. Para edición de video o gaming, el hardware de 7 años puede ser un limitante real.',
      },
      {
        q: '¿Cuánto cuesta optimizar un computador lento en Cali?',
        a: 'El servicio de optimización incluye diagnóstico, limpieza de malware, limpieza física y optimización del sistema. El costo exacto depende de las intervenciones necesarias — siempre informamos antes de proceder.',
      },
    ],
  },

  'wifi-no-conecta-diagnostico-paso-a-paso': {
    slug: 'wifi-no-conecta-diagnostico-paso-a-paso',
    title: 'WiFi no conecta: diagnóstico paso a paso para solucionarlo',
    metaTitle: 'WiFi No Conecta: Diagnóstico Paso a Paso | SomosTécnicos',
    metaDescription: 'El WiFi aparece pero no conecta, o conecta y se cae. Sigue este diagnóstico antes de llamar a tu operador — muchas veces la solución está en casa.',
    keywords: [
      'wifi no conecta',
      'wifi aparece pero no conecta',
      'por qué el wifi no funciona',
      'solucionar problemas wifi',
      'wifi se cae Colombia',
    ],
    canonicalPath: '/blog/wifi-no-conecta-diagnostico-paso-a-paso',
    heroImage: '/blog/redes-computacion/wifi-no-conecta.avif',
    heroImageAlt: 'pantalla de laptop mostrando el error wifi conectado sin acceso a internet en Colombia',
    cardImage: '/blog/redes-computacion/wifi-no-conecta.avif',
    cardImageAlt: 'Pantalla mostrando el mensaje WiFi conectado sin acceso a internet',
    excerpt: 'WiFi conectado pero sin internet — uno de los mensajes más frustrantes. Hay una forma sistemática de identificar si el problema está en el dispositivo, el router o el proveedor.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-11',
    readTime: 4,
    relatedServiceSlug: 'tecnico-computadores-redes-cali',
    relatedServiceLabel: 'Técnico Computadores y Redes en Cali',
    sections: [
      {
        heading: 'El mensaje que todos hemos visto',
        paragraphs: [
          '"Conectado, sin acceso a internet" — o en inglés "Connected, no internet access" — es uno de los mensajes de error más frecuentes en redes domésticas. El dispositivo ve la red WiFi y se conecta a ella, pero no puede acceder a internet.',
          'La clave del diagnóstico es identificar si el problema está en el dispositivo, en el router o en el proveedor de internet. Este orden de verificación resuelve el 80% de los casos.',
        ],
      },
      {
        heading: 'Paso 1: Verifica si el problema es de un solo dispositivo',
        paragraphs: [
          'Si otros dispositivos en el mismo hogar tienen internet y solo uno no puede conectarse, el problema está en ese dispositivo específico — no en el router ni en el proveedor.',
          'Solución en dispositivos específicos: activa y desactiva el modo avión, elimina la red WiFi guardada y vuelve a conectarte ingresando la contraseña, o reinicia la configuración de red del dispositivo.',
        ],
        tips: [
          'En Windows: netsh winsock reset en el Símbolo del sistema (como administrador) puede resolver conflictos de red.',
          'En Android: Ajustes > Gestión general > Restablecer > Restablecer configuración de red.',
          'En iOS: Ajustes > General > Transferir o restablecer el iPhone > Restablecer > Restablecer ajustes de red.',
        ],
      },
      {
        heading: 'Paso 2: Si todos los dispositivos fallan, reinicia el router',
        paragraphs: [
          'Si ningún dispositivo tiene internet pero todos ven el WiFi, el problema está en el router o en el proveedor. Reinicia el router desconectándolo completamente de la corriente por 30 segundos.',
          'Después del reinicio, espera 2 minutos para que el router reestablezca todas sus conexiones antes de intentar navegar.',
        ],
      },
      {
        heading: 'Paso 3: Verifica el conflicto de IP',
        paragraphs: [
          'Un conflicto de IP ocurre cuando dos dispositivos tienen la misma dirección IP en la red. El router asigna IPs automáticamente (DHCP), pero en algunos casos puede asignar la misma IP dos veces, causando que uno o ambos dispositivos pierdan la conexión.',
          'La solución: accede a la configuración del router (generalmente 192.168.1.1 o 192.168.0.1) y reinicia el servidor DHCP, o asigna IPs fijas a los dispositivos principales.',
        ],
      },
      {
        heading: 'Paso 4: Verifica el DNS',
        paragraphs: [
          'El DNS (Domain Name System) es el servicio que traduce nombres de dominio (como google.com) en direcciones IP. Si el DNS configurado en el router falla, el dispositivo no puede acceder a sitios web aunque tenga conectividad de red.',
          'Una solución rápida: configura manualmente el DNS en el dispositivo usando los de Google (8.8.8.8 y 8.8.4.4) o los de Cloudflare (1.1.1.1 y 1.0.0.1). Si con estos DNS el internet funciona, el DNS del proveedor es el problema.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Por qué el WiFi funciona bien con el celular pero no con el computador?',
        a: 'Los computadores y los teléfonos usan adaptadores WiFi diferentes con distintas capacidades. A veces el adaptador WiFi del computador necesita actualizar sus drivers, o el dispositivo está conectado a la banda 2.4 GHz cuando la 5 GHz da mejor rendimiento.',
      },
      {
        q: '¿Qué hago si el WiFi se conecta y se cae constantemente?',
        a: 'La reconexión frecuente suele indicar interferencia en el canal, señal débil (el dispositivo está en el límite del alcance del router) o un router con firmware desactualizado. Actualiza el firmware del router y cambia el canal WiFi como primeros pasos.',
      },
    ],
  },

  'computador-no-enciende-que-hacer': {
    slug: 'computador-no-enciende-que-hacer',
    title: 'Computador no enciende: qué hacer antes de llevarlo al técnico',
    metaTitle: 'Computador No Enciende: Diagnóstico Paso a Paso | SomosTécnicos',
    metaDescription: 'Si tu computador no enciende, no presiones el botón varias veces. Sigue estos pasos de diagnóstico para identificar si es un problema menor o requiere reparación.',
    keywords: [
      'computador no enciende',
      'PC no prende',
      'laptop no enciende',
      'computador no arranca',
      'qué hacer si el computador no enciende',
    ],
    canonicalPath: '/blog/computador-no-enciende-que-hacer',
    heroImage: '/blog/redes-computacion/computador-no-enciende.avif',
    heroImageAlt: 'computador de escritorio sin señal de encendido con botón de power y pantalla apagados',
    cardImage: '/blog/redes-computacion/computador-no-enciende.avif',
    cardImageAlt: 'Computador con pantalla negra y sin señales de encendido',
    excerpt: 'Un computador que no enciende puede tener una causa simple (batería descargada, cable suelto) o compleja (falla de hardware). Este diagnóstico te ayuda a identificar cuál es.',
    category: 'reparacion',
    categoryLabel: 'Reparación',
    publishedAt: '2026-03-11',
    readTime: 4,
    relatedServiceSlug: 'tecnico-computadores-redes-cali',
    relatedServiceLabel: 'Técnico Computadores y Redes en Cali',
    sections: [
      {
        heading: 'No presiones el botón de encendido repetidamente',
        paragraphs: [
          'El primer instinto cuando un computador no enciende es presionar el botón de encendido varias veces seguidas. Este hábito puede empeorar algunas fallas de hardware. En cambio, sigue este orden de diagnóstico.',
        ],
      },
      {
        heading: 'Para laptops: verifica la carga primero',
        paragraphs: [
          'Si el computador portátil no enciende, lo primero es verificar que tenga carga. Conecta el cargador y espera 5 minutos antes de intentar encenderlo — una batería completamente agotada puede tardar unos minutos en tener energía suficiente para encender.',
          'Si el indicador de carga no se ilumina cuando conectas el cargador, puede ser el cargador (prueba con otro compatible) o el conector de carga del equipo.',
        ],
        tips: [
          'Prueba retirando la batería completamente y encendiendo solo con el cargador conectado — si enciende, la batería está dañada.',
          'Un cargador original o de buena calidad compatible marca la diferencia — los genéricos económicos pueden dar voltaje incorrecto.',
          'Verifica que el cable del cargador no esté doblado ni pelado cerca del conector.',
        ],
      },
      {
        heading: 'Para computadores de escritorio: verifica los cables',
        paragraphs: [
          'En computadores de escritorio, muchos casos de "no enciende" se resuelven verificando que el cable de corriente esté correctamente conectado tanto al computador como al tomacorriente, y que el tomacorriente tenga corriente (prueba con otro dispositivo).',
          'Verifica también el interruptor en la fuente de poder (la caja metálica de donde salen todos los cables internos) — tiene un pequeño switch que a veces queda en posición OFF.',
        ],
      },
      {
        heading: 'El computador hace sonidos pero no arranca',
        paragraphs: [
          'Si al presionar el botón de encendido el computador hace un sonido de beep, los ventiladores giran pero la pantalla queda negra, el problema puede ser en la RAM. Intenta retirar los módulos de RAM y reinstalarlos firmemente en sus slots — una mala conexión puede impedir el arranque.',
        ],
        warning: 'Si el computador hace un olor a quemado al intentar encenderlo, o si hay componentes con marcas de quemado visibles (condensadores o resistencias quemadas en la tarjeta madre), apaga inmediatamente y no vuelvas a intentarlo. Requiere revisión técnica.',
      },
      {
        heading: 'Enciende pero la pantalla queda negra',
        paragraphs: [
          'Si los ventiladores y las luces del computador se activan pero la pantalla queda negra, el problema puede estar en la pantalla misma, en el cable que conecta la pantalla con la tarjeta madre (en laptops), o en la tarjeta de video.',
          'Prueba conectando el computador a un monitor externo con HDMI — si el monitor externo funciona, el problema es la pantalla o el cable de la pantalla interna.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta reparar un computador que no enciende en Cali?',
        a: 'El costo depende completamente de la causa. Desde una revisión de cables y limpieza de contactos (muy económico) hasta el reemplazo de la tarjeta madre (el componente más costoso). Siempre hacemos diagnóstico antes de cotizar la reparación.',
      },
      {
        q: '¿Vale la pena reparar un computador que no enciende?',
        a: 'Depende del diagnóstico y la antigüedad del equipo. Un computador con 3-4 años y una falla específica (fuente de poder, RAM) casi siempre conviene reparar. Un equipo de más de 8 años con falla en la tarjeta madre puede ser más económico reemplazar.',
      },
    ],
  },

  'mantenimiento-preventivo-computador-empresa-cali': {
    slug: 'mantenimiento-preventivo-computador-empresa-cali',
    title: 'Mantenimiento preventivo de computadores para empresa en Cali',
    metaTitle: 'Mantenimiento Preventivo Computadores Empresa Cali | SomosTécnicos',
    metaDescription: 'Evita tiempos muertos y pérdida de datos con un plan de mantenimiento preventivo para los computadores de tu empresa en Cali. Qué incluye y cuánto cuesta.',
    keywords: [
      'mantenimiento computadores empresa Cali',
      'mantenimiento preventivo PC Cali',
      'servicio técnico computadores empresas Colombia',
      'mantenimiento redes empresa Cali',
      'soporte técnico empresa Cali',
    ],
    canonicalPath: '/blog/mantenimiento-preventivo-computador-empresa-cali',
    heroImage: '/blog/redes-computacion/mantenimiento-preventivo-de-computadoras.avif',
    heroImageAlt: 'técnico realizando mantenimiento preventivo en sala de computadores de una empresa en Cali Colombia',
    cardImage: '/blog/redes-computacion/mantenimiento-preventivo-de-computadoras.avif',
    cardImageAlt: 'Técnico realizando mantenimiento preventivo de computadores en oficina en Cali',
    excerpt: 'Un computador empresarial sin mantenimiento acumula polvo, malware y fragmentación. El resultado: empleados que trabajan más lento y fallas en los peores momentos.',
    category: 'consejos',
    categoryLabel: 'Consejos',
    publishedAt: '2026-03-12',
    readTime: 5,
    relatedServiceSlug: 'tecnico-computadores-redes-cali',
    relatedServiceLabel: 'Técnico Computadores y Redes en Cali',
    sections: [
      {
        heading: 'El costo real de no hacer mantenimiento',
        paragraphs: [
          'Una empresa con 10 computadores sin mantenimiento preventivo puede perder entre 2 y 4 horas de productividad por equipo al año en fallas, lentitud y tiempo de recuperación de datos. A eso se suman los costos de reparación de emergencia, que siempre son mayores que los de mantenimiento preventivo.',
          'El mantenimiento preventivo programado tiene una lógica simple: es más barato revisar que reparar, y mucho más barato que perder datos.',
        ],
      },
      {
        heading: 'Qué incluye el mantenimiento preventivo empresarial',
        paragraphs: [
          'El servicio de mantenimiento para empresas va más allá de lo que se hace en un equipo doméstico:',
        ],
        highlight: 'El mantenimiento preventivo empresarial incluye: limpieza física interna (polvo, ventiladores, disipadores), actualización de sistema operativo y drivers, análisis y eliminación de malware, verificación del estado de los discos duros, limpieza de programas innecesarios, verificación de la red interna (switch, cableado, router) y respaldo de configuraciones críticas.',
      },
      {
        heading: 'Frecuencia recomendada por tipo de uso',
        paragraphs: [
          'La frecuencia del mantenimiento depende del entorno y el uso:',
        ],
        tips: [
          'Oficina con ambiente de polvo bajo (aire acondicionado, piso duro): mantenimiento cada 12 meses.',
          'Oficina con polvo moderado o con personal numeroso: mantenimiento cada 6 meses.',
          'Entorno industrial o con mucho polvo (talleres, bodeg as): mantenimiento cada 3-4 meses.',
          'Equipos con más de 5 años: revisión del estado de los discos y verificación de la temperatura del procesador en cada visita.',
        ],
      },
      {
        heading: 'La red interna también necesita mantenimiento',
        paragraphs: [
          'El mantenimiento no termina en los computadores. La red interna de la empresa (switch, cableado, router) también requiere revisión periódica:',
        ],
        tips: [
          'Verifica el estado del switch (concentrador de red): los puertos dañados pueden causar desconexiones intermitentes.',
          'El cableado de red se deteriora con el tiempo, especialmente en instalaciones de más de 10 años.',
          'Actualiza el firmware del router empresarial — las vulnerabilidades de seguridad en firmware antiguo son un vector frecuente de ataques.',
        ],
      },
      {
        heading: 'Planes de mantenimiento con contrato anual',
        paragraphs: [
          'Para empresas con más de 3 equipos, los planes de mantenimiento con contrato anual ofrecen ventajas sobre el servicio por llamada:',
        ],
        tips: [
          'Costo fijo mensual predecible en lugar de gastos de emergencia variables.',
          'Tiempo de respuesta prioritario ante fallas.',
          'Historial técnico de cada equipo que permite identificar patrones de falla.',
          'Asesoría para renovación de equipos basada en datos reales del estado del hardware.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuánto cuesta el mantenimiento preventivo de computadores para empresa en Cali?',
        a: 'El costo por equipo disminuye cuando el contrato incluye más máquinas. Para empresas con flotas de 5 equipos o más, manejamos planes con tarifas especiales. Cotizamos directamente según el número de equipos, el tipo de uso y la frecuencia requerida.',
      },
      {
        q: '¿El servicio de mantenimiento incluye respaldo de datos?',
        a: 'El mantenimiento estándar incluye verificación del estado del disco y detección de sectores defectuosos. El servicio de respaldo (backup) automático en la nube o en NAS local es un servicio adicional que podemos configurar como parte del plan.',
      },
    ],
  },
}
