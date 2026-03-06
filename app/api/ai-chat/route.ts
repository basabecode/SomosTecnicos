/**
 * API Chat IA — SomosTécnicos
 * Procesa mensajes y retorna respuestas contextuales con sugerencias de servicio.
 */

import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  text: string
  timestamp: string
}

interface ChatRequest {
  message: string
  conversationHistory?: ChatMessage[]
}

interface ServiceSuggestion {
  type: string
  urgency: 'baja' | 'media' | 'alta'
  description: string
  estimatedCost?: string
  estimatedTime?: string
}

interface AIResponse {
  response: string
  suggestion?: ServiceSuggestion
  confidence: number
  followUpQuestions?: string[]
  actionType?: 'register_client' | 'register_technician' | 'schedule_visit' | null
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    const aiResponse = processAIResponse(message, conversationHistory)

    return NextResponse.json({ success: true, data: aiResponse })
  } catch (error) {
    console.error('Error en Chat IA:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error procesando mensaje',
        data: {
          response: 'Disculpa, tuve un problema técnico. ¿Podrías repetir tu consulta?',
          confidence: 0,
        },
      },
      { status: 500 }
    )
  }
}

// ─── Main processor ────────────────────────────────────────────────────────────

function processAIResponse(message: string, history: ChatMessage[]): AIResponse {
  const lower = message.toLowerCase()
  const context = history.map(m => m.text.toLowerCase()).join(' ')

  // ── Registration intents ──────────────────────────────────────────────────
  if (
    (lower.includes('registrar') && lower.includes('client')) ||
    lower.includes('crear cuenta') || lower.includes('nueva cuenta')
  ) {
    return {
      response: 'Crear tu cuenta de cliente es **gratuito**. Obtienes seguimiento en tiempo real, historial de reparaciones y chat directo con tu técnico.\n\nVisita somostecnicos.com/register para registrarte.',
      confidence: 0.98,
      actionType: 'register_client',
    }
  }

  if (
    lower.includes('unirme como técnico') || lower.includes('ser técnico') ||
    (lower.includes('técnico') && (lower.includes('unir') || lower.includes('trabajar') || lower.includes('registrar')))
  ) {
    return {
      response: 'Unirte como técnico es **completamente gratis**. Recibes órdenes en tu zona, pagos seguros y agenda flexible — sin mensualidades.\n\nVisita somostecnicos.com/trabaja-con-nosotros para registrarte.',
      confidence: 0.98,
      actionType: 'register_technician',
    }
  }

  // ── Prices ───────────────────────────────────────────────────────────────
  if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuánto') ||
      lower.includes('cuanto') || lower.includes('cobran') || lower.includes('vale')) {
    return {
      response: '**Precios del servicio:**\n\n• Diagnóstico: $50.000 (se abona si apruebas la reparación dentro del mes)\n• Reparación: Varía según equipo y repuestos — no existe tarifa fija\n• Mantenimiento preventivo: Desde $45.000\n• Urgente el mismo día: Disponible con recargo\n\nEl precio exacto lo confirma el técnico después del diagnóstico presencial.',
      confidence: 0.98,
      followUpQuestions: ['¿Qué cubre la garantía?', '¿Cuánto tarda el diagnóstico?', '¿Qué servicios ofrecen?'],
    }
  }

  // ── Guarantees ───────────────────────────────────────────────────────────
  if (lower.includes('garantía') || lower.includes('garantia')) {
    return {
      response: '**Garantía en todos los servicios:**\n\n• Reparaciones de electrodomésticos: 30 días\n• Instalaciones eléctricas y de seguridad: 90 días\n• Repuestos nuevos originales: 6 a 12 meses\n\nSi el problema regresa dentro del período de garantía, lo resolvemos sin costo adicional.',
      confidence: 0.98,
      followUpQuestions: ['¿Cuáles son los precios?', '¿Qué servicios ofrecen?'],
    }
  }

  // ── Schedule / timing ────────────────────────────────────────────────────
  if (lower.includes('tiempo') || lower.includes('cuándo') || lower.includes('demora') ||
      lower.includes('cuanto tarda') || lower.includes('disponib')) {
    return {
      response: '**Tiempos de servicio:**\n\n• Diagnóstico: 24 a 48 horas\n• Reparación in-situ: 2 a 4 horas\n• Con repuestos especiales: 3 a 7 días hábiles\n• Servicio urgente el mismo día: Disponible\n\n**Horario de atención:** Lunes a sábado, 8:00 am – 6:00 pm\n\n¿Es urgente tu solicitud?',
      confidence: 0.97,
      followUpQuestions: ['Quiero agendar una visita', '¿Tienen servicio urgente?'],
      actionType: 'schedule_visit',
    }
  }

  // ── Appliance patterns ────────────────────────────────────────────────────

  const appliancePatterns: {
    keywords: string[]
    name: string
    problems: Record<string, {
      triggers: string[]
      response: string
      suggestion: ServiceSuggestion
    }>
  }[] = [
    {
      keywords: ['lavadora', 'lavado', 'centrifug'],
      name: 'Lavadora',
      problems: {
        ruido: {
          triggers: ['ruido', 'sonido', 'vibra', 'golpe'],
          response: '**Ruidos en lavadora** pueden indicar rodamientos desgastados o desbalance.\n\n¿El ruido ocurre durante el centrifugado o en todo el ciclo?',
          suggestion: { type: 'Lavadora', urgency: 'media', description: 'Ruidos — posibles rodamientos o desbalance', estimatedCost: '$80.000 – $150.000', estimatedTime: '2-4 h' },
        },
        noEnciende: {
          triggers: ['no enciende', 'no prende', 'no funciona', 'muerta'],
          response: '**Lavadora sin encendido.** ¿El panel no enciende para nada, o se apaga a mitad del ciclo? ¿Llega corriente al tomacorriente?',
          suggestion: { type: 'Lavadora', urgency: 'alta', description: 'No enciende — revisión eléctrica y placa', estimatedCost: '$60.000 – $120.000', estimatedTime: '1-3 h' },
        },
        noDesagua: {
          triggers: ['no desagua', 'no drena', 'inundada', 'agua atascada'],
          response: '**Problema de desagüe.** ¿El agua se queda en el tambor al terminar el ciclo? Puede ser bomba o manguera obstruida.',
          suggestion: { type: 'Lavadora', urgency: 'alta', description: 'No desagua — obstrucción en bomba o mangueras', estimatedCost: '$50.000 – $100.000', estimatedTime: '1-2 h' },
        },
        mantenimiento: {
          triggers: ['mantenimiento', 'limpieza', 'revisión', 'preventivo'],
          response: '**Mantenimiento preventivo para lavadora.** Incluye limpieza de tambor, filtros, mangueras y calibración. ¿Cuánto tiempo lleva sin mantenimiento?',
          suggestion: { type: 'Lavadora', urgency: 'baja', description: 'Mantenimiento preventivo completo', estimatedCost: '$45.000 – $65.000', estimatedTime: '1-2 h' },
        },
      },
    },
    {
      keywords: ['nevera', 'refrigerador', 'refri', 'heladera'],
      name: 'Nevera',
      problems: {
        noEnfria: {
          triggers: ['no enfría', 'no enfria', 'caliente', 'no congela', 'temperatura'],
          response: '**Nevera sin refrigeración — problema urgente.** ¿Está completamente caliente o solo una zona? ¿El motor suena normalmente?',
          suggestion: { type: 'Nevera', urgency: 'alta', description: 'No enfría — gas, compresor o termostato', estimatedCost: '$100.000 – $250.000', estimatedTime: '2-6 h' },
        },
        ruido: {
          triggers: ['ruido', 'zumbido', 'golpea', 'sonido'],
          response: '**Ruidos en nevera** pueden venir del compresor o ventiladores. ¿Es constante o solo al arrancar?',
          suggestion: { type: 'Nevera', urgency: 'media', description: 'Ruidos — compresor o ventiladores', estimatedCost: '$80.000 – $200.000', estimatedTime: '2-4 h' },
        },
        gotea: {
          triggers: ['gotea', 'agua', 'charco', 'humedad'],
          response: '**Goteo en nevera.** ¿Sale agua por debajo, por dentro o por la parte trasera? ¿Has revisado el desagüe interno?',
          suggestion: { type: 'Nevera', urgency: 'media', description: 'Goteo — drenaje obstruido o sellos dañados', estimatedCost: '$40.000 – $90.000', estimatedTime: '1-2 h' },
        },
        mantenimiento: {
          triggers: ['mantenimiento', 'limpieza', 'revisión', 'preventivo'],
          response: '**Mantenimiento de nevera.** Incluye limpieza de serpentines, desagüe, sellos y calibración de temperatura.',
          suggestion: { type: 'Nevera', urgency: 'baja', description: 'Mantenimiento preventivo', estimatedCost: '$50.000 – $70.000', estimatedTime: '1-2 h' },
        },
      },
    },
    {
      keywords: ['calentador', 'boiler', 'agua caliente', 'termocalentador'],
      name: 'Calentador',
      problems: {
        noCalienta: {
          triggers: ['no calienta', 'agua fría', 'agua tibia', 'temperatura'],
          response: '**Calentador sin agua caliente.** ¿Es a gas o eléctrico? ¿El piloto está encendido? Puede ser termostato, resistencia o problema de gas.',
          suggestion: { type: 'Calentador', urgency: 'alta', description: 'No calienta — termostato, resistencia o gas', estimatedCost: '$70.000 – $160.000', estimatedTime: '1-3 h' },
        },
        gotea: {
          triggers: ['gotea', 'fuga', 'agua', 'charco'],
          response: '**Fuga en calentador** — puede ser en conexiones o en el tanque. ¿Es una gota o un chorro constante?',
          suggestion: { type: 'Calentador', urgency: 'alta', description: 'Fuga de agua — conexiones o tanque', estimatedCost: '$60.000 – $120.000', estimatedTime: '1-2 h' },
        },
        piloto: {
          triggers: ['piloto', 'llama', 'encendido'],
          response: '**Problema de piloto en calentador a gas.** El piloto puede fallar por corriente de aire, suciedad o termopar desgastado.',
          suggestion: { type: 'Calentador', urgency: 'alta', description: 'Piloto no enciende — termopar o gas', estimatedCost: '$50.000 – $90.000', estimatedTime: '1-2 h' },
        },
        mantenimiento: {
          triggers: ['mantenimiento', 'limpieza', 'revisión'],
          response: '**Mantenimiento de calentador.** Incluye limpieza de quemador, revisión de conexiones, purga del tanque y pruebas de temperatura.',
          suggestion: { type: 'Calentador', urgency: 'baja', description: 'Mantenimiento preventivo', estimatedCost: '$55.000 – $75.000', estimatedTime: '1-2 h' },
        },
      },
    },
    {
      keywords: ['secadora', 'ropa húmeda'],
      name: 'Secadora',
      problems: {
        noSeca: {
          triggers: ['no seca', 'húmeda', 'humeda', 'mojada'],
          response: '**Secadora sin secar.** ¿Es a gas o eléctrica? ¿El tambor gira pero no hay calor? Puede ser resistencia, termostato o ventilación bloqueada.',
          suggestion: { type: 'Secadora', urgency: 'media', description: 'No seca — resistencia o ventilación', estimatedCost: '$80.000 – $150.000', estimatedTime: '2-3 h' },
        },
        sobrecalienta: {
          triggers: ['sobrecalienta', 'muy caliente', 'huele a quemado'],
          response: '**Secadora sobrecalentada — riesgo de incendio.** Suspende el uso. Puede ser ventilación obstruida o termostato dañado.',
          suggestion: { type: 'Secadora', urgency: 'alta', description: 'Sobrecalentamiento — revisión urgente', estimatedCost: '$70.000 – $130.000', estimatedTime: '2-3 h' },
        },
        mantenimiento: {
          triggers: ['mantenimiento', 'limpieza', 'revisión'],
          response: '**Mantenimiento de secadora.** Limpieza de conducto de salida, filtros y revisión de resistencia y correas.',
          suggestion: { type: 'Secadora', urgency: 'baja', description: 'Mantenimiento preventivo', estimatedCost: '$50.000 – $70.000', estimatedTime: '1-2 h' },
        },
      },
    },
    {
      keywords: ['aire', 'split', 'acondicionado', 'clima'],
      name: 'Aire Acondicionado',
      problems: {
        noEnfria: {
          triggers: ['no enfría', 'no enfria', 'caliente', 'temperatura'],
          response: '**Aire sin enfriamiento.** ¿El ventilador funciona pero no bota frío, o no enciende? ¿Cuándo fue la última limpieza de filtros?',
          suggestion: { type: 'Aire Acondicionado', urgency: 'alta', description: 'No enfría — gas, limpieza o eléctrico', estimatedCost: '$70.000 – $180.000', estimatedTime: '2-4 h' },
        },
        gotea: {
          triggers: ['gotea', 'agua', 'chorrea'],
          response: '**Goteo en aire acondicionado.** ¿Gotea por la unidad interna? Suele ser el drenaje obstruido — revisión rápida.',
          suggestion: { type: 'Aire Acondicionado', urgency: 'media', description: 'Goteo — limpieza de drenajes', estimatedCost: '$50.000 – $100.000', estimatedTime: '1-2 h' },
        },
        mantenimiento: {
          triggers: ['mantenimiento', 'limpieza', 'revisión'],
          response: '**Mantenimiento de aire acondicionado.** Limpieza de filtros, serpentines, drenajes y verificación de gas refrigerante.',
          suggestion: { type: 'Aire Acondicionado', urgency: 'media', description: 'Mantenimiento preventivo', estimatedCost: '$60.000 – $90.000', estimatedTime: '2-3 h' },
        },
        instalacion: {
          triggers: ['instalación', 'instalar', 'nueva'],
          response: '**Instalación profesional de aire acondicionado.** Incluye instalación eléctrica, tubería de cobre, vacío y carga de gas.',
          suggestion: { type: 'Aire Acondicionado', urgency: 'media', description: 'Instalación completa', estimatedCost: '$150.000 – $300.000', estimatedTime: '4-8 h' },
        },
      },
    },
    {
      keywords: ['electricidad', 'cableado', 'tablero', 'breaker', 'tomacorriente', 'interruptor'],
      name: 'Electricidad',
      problems: {
        tablero: {
          triggers: ['tablero', 'breaker', 'panel', 'disyuntor'],
          response: '**Revisión de tablero eléctrico.** ¿Se disparan los breakers con frecuencia o hay alguno quemado? ¿Cuántos circuitos tiene el tablero?',
          suggestion: { type: 'Electricidad', urgency: 'alta', description: 'Tablero — revisión y reparación', estimatedCost: '$80.000 – $200.000', estimatedTime: '2-4 h' },
        },
        instalacion: {
          triggers: ['instalación', 'cableado', 'instalar', 'nueva'],
          response: '**Instalación eléctrica residencial.** ¿Es una instalación nueva, adición de circuitos o cambio de cableado?',
          suggestion: { type: 'Electricidad', urgency: 'media', description: 'Instalación eléctrica', estimatedCost: '$100.000 – $300.000', estimatedTime: '4-8 h' },
        },
      },
    },
    {
      keywords: ['cámara', 'camara', 'alarma', 'cctv', 'seguridad electronica', 'vigilancia'],
      name: 'Seguridad Electrónica',
      problems: {
        instalacion: {
          triggers: ['instalación', 'instalar', 'cámara nueva', 'sistema nuevo'],
          response: '**Instalación de sistema de seguridad.** ¿Cuántas cámaras necesitas y cuál es el área a cubrir (interior, exterior, ambos)?',
          suggestion: { type: 'Seguridad', urgency: 'media', description: 'Instalación de cámaras y alarmas', estimatedCost: '$150.000 – $400.000', estimatedTime: '4-8 h' },
        },
        mantenimiento: {
          triggers: ['mantenimiento', 'limpieza', 'revisión'],
          response: '**Mantenimiento de cámaras de seguridad.** Limpieza de lentes, revisión de conexiones, actualización de firmware y prueba de grabación.',
          suggestion: { type: 'Seguridad', urgency: 'baja', description: 'Mantenimiento del sistema', estimatedCost: '$60.000 – $120.000', estimatedTime: '2-3 h' },
        },
      },
    },
  ]

  // Match appliance + problem
  for (const appliance of appliancePatterns) {
    const hasAppliance = appliance.keywords.some(kw =>
      lower.includes(kw) || context.includes(kw)
    )
    if (!hasAppliance) continue

    for (const [, prob] of Object.entries(appliance.problems)) {
      const hasProblem = prob.triggers.some(t => lower.includes(t))
      if (!hasProblem) continue

      return {
        response: prob.response,
        suggestion: prob.suggestion,
        confidence: 0.92,
        followUpQuestions: [
          '¿Cuándo comenzó el problema?',
          '¿Has intentado alguna solución?',
          '¿Qué tan urgente es?',
        ],
      }
    }

    // Appliance recognized but no specific problem
    return {
      response: `Entendido, tienes un problema con tu **${appliance.name}**. ¿Podrías describir exactamente qué está pasando? Por ejemplo: no enciende, hace ruidos, no cumple su función, gotea, etc.`,
      confidence: 0.75,
      followUpQuestions: [
        `¿Qué síntomas presenta tu ${appliance.name}?`,
        '¿Cuándo comenzó el problema?',
        '¿Es urgente la reparación?',
      ],
    }
  }

  // Generic fallbacks
  if (lower.includes('mantenimiento') || lower.includes('limpieza') || lower.includes('preventivo')) {
    return {
      response: '**Mantenimiento preventivo** — excelente decisión para alargar la vida útil de tus equipos.\n\n¿Para qué electrodoméstico o sistema necesitas el mantenimiento?',
      confidence: 0.85,
      followUpQuestions: ['¿Qué equipo necesita mantenimiento?', '¿Cuánto tiempo lleva sin mantenimiento?'],
    }
  }

  if (lower.includes('instalación') || lower.includes('instalar')) {
    return {
      response: '**Instalación profesional** con garantía incluida.\n\n¿Qué equipo o sistema necesitas instalar? (lavadora, nevera, calentador, aire, cámaras, electricidad, etc.)',
      confidence: 0.85,
      followUpQuestions: ['¿Qué tipo de equipo vas a instalar?', '¿Es instalación nueva o reubicación?'],
    }
  }

  // Default
  return {
    response: `Para ayudarte mejor necesito saber:\n\n1. **¿Qué equipo o servicio necesitas?** (lavadora, nevera, calentador, electricidad, cámaras, etc.)\n2. **¿Cuál es el problema específico?**\n3. **¿Qué tan urgente es?**\n\nCon esos datos te doy una cotización y agendamos la visita.`,
    confidence: 0.6,
    followUpQuestions: [
      '¿Qué tipo de electrodoméstico o servicio necesitas?',
      '¿Cuáles son los síntomas del problema?',
      '¿Prefieres servicio normal o urgente?',
    ],
  }
}
