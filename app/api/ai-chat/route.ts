/**
 * API del Chat IA - Endpoint para procesamiento inteligente
 * Procesa conversaciones y genera respuestas contextuales
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
}

/**
 * Procesador de IA para el chat
 * - Análisis de texto con patrones
 * - Detección de problemas comunes
 * - Sugerencias de servicio automáticas
 * - Respuestas contextuales
 */
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] }: ChatRequest = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    const aiResponse = await processAIResponse(message, conversationHistory)

    return NextResponse.json({
      success: true,
      data: aiResponse
    })

  } catch (error) {
    console.error('Error en Chat IA:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error procesando mensaje',
        data: {
          response: 'Disculpa, tuve un problema técnico. ¿Podrías repetir tu consulta?',
          confidence: 0
        }
      },
      { status: 500 }
    )
  }
}

async function processAIResponse(message: string, history: ChatMessage[]): Promise<AIResponse> {
  const lowerMessage = message.toLowerCase()

  // Análisis de contexto de la conversación
  const conversationContext = history
    .map(msg => msg.text.toLowerCase())
    .join(' ')

  // Patrones de reconocimiento avanzados
  const patterns = {
    lavadora: {
      keywords: ['lavadora', 'lavado', 'centrifuga', 'spin'],
      problems: {
        ruido: {
          pattern: ['ruido', 'sonido', 'estruendo', 'golpe', 'vibra'],
          response: 'Entiendo, problema con ruidos en la lavadora. 🔧\n\n¿El ruido ocurre durante el centrifugado o durante todo el ciclo? Esto me ayuda a determinar si son los rodamientos, la correa o un desbalance.',
          suggestion: {
            type: 'Lavadora',
            urgency: 'media' as const,
            description: 'Problema de ruidos - posible desgaste de rodamientos o desbalance',
            estimatedCost: '$80,000 - $150,000',
            estimatedTime: '2-4 horas'
          }
        },
        noEnciende: {
          pattern: ['no enciende', 'no prende', 'no funciona', 'muerta'],
          response: 'Problema eléctrico en lavadora detectado. ⚡\n\n¿La lavadora no prende para nada o se apaga durante el funcionamiento? ¿Has verificado que llegue corriente al tomacorriente?',
          suggestion: {
            type: 'Lavadora',
            urgency: 'alta' as const,
            description: 'Lavadora no enciende - revisar conexiones eléctricas y controles',
            estimatedCost: '$60,000 - $120,000',
            estimatedTime: '1-3 horas'
          }
        },
        noDesagua: {
          pattern: ['no desagua', 'no drena', 'agua', 'inundada'],
          response: 'Problema de desagüe detectado. 💧\n\n¿El agua se queda en el tambor al final del ciclo? ¿Has revisado si hay obstrucciones en la manguera de desagüe?',
          suggestion: {
            type: 'Lavadora',
            urgency: 'alta' as const,
            description: 'Problema de desagüe - obstrucción en bomba o mangueras',
            estimatedCost: '$50,000 - $100,000',
            estimatedTime: '1-2 horas'
          }
        },
        mantenimiento: {
          pattern: ['mantenimiento', 'limpieza', 'revisión', 'preventivo'],
          response: 'Excelente idea! El mantenimiento preventivo alarga la vida útil. 🔧✨\n\n¿Cuánto tiempo tiene sin mantenimiento tu lavadora? Incluye limpieza completa, revisión de mangueras y calibración.',
          suggestion: {
            type: 'Lavadora',
            urgency: 'baja' as const,
            description: 'Mantenimiento preventivo - limpieza completa y calibración',
            estimatedCost: '$45,000 - $65,000',
            estimatedTime: '1-2 horas'
          }
        },
        instalacion: {
          pattern: ['instalación', 'instalar', 'conectar', 'nueva'],
          response: 'Instalación profesional de lavadora. 🔧🏠\n\n¿Es lavadora nueva o reubicación? Incluye conexión de agua, desagüe, nivelación y prueba completa de funcionamiento.',
          suggestion: {
            type: 'Lavadora',
            urgency: 'media' as const,
            description: 'Instalación completa - conexiones, nivelación y puesta en marcha',
            estimatedCost: '$60,000 - $90,000',
            estimatedTime: '2-3 horas'
          }
        }
      }
    },

    nevera: {
      keywords: ['nevera', 'refrigerador', 'refri', 'heladera'],
      problems: {
        noEnfria: {
          pattern: ['no enfría', 'caliente', 'temperatura', 'no congela'],
          response: 'Problema crítico de refrigeración detectado! 🧊\n\n¿La nevera está completamente caliente o solo algunas áreas? ¿Escuchas que el motor funciona? Esto es urgente por la conservación de alimentos.',
          suggestion: {
            type: 'Nevera',
            urgency: 'alta' as const,
            description: 'Nevera no enfría - problema crítico de refrigeración',
            estimatedCost: '$100,000 - $250,000',
            estimatedTime: '2-6 horas'
          }
        },
        ruido: {
          pattern: ['ruido', 'sonido', 'zumbido', 'golpea'],
          response: 'Ruidos en nevera pueden indicar problema del compresor. 🔧\n\n¿El ruido es constante o solo cuando arranca? ¿Es un zumbido, golpeteo o chirrido?',
          suggestion: {
            type: 'Nevera',
            urgency: 'media' as const,
            description: 'Nevera con ruidos anormales - revisar compresor y ventiladores',
            estimatedCost: '$80,000 - $200,000',
            estimatedTime: '2-4 horas'
          }
        },
        gotea: {
          pattern: ['gotea', 'agua', 'charco', 'humedad'],
          response: 'Fuga de agua en nevera detectada. 💧\n\n¿El agua sale por debajo, por dentro o por la parte trasera? ¿Has revisado el desagüe interno?',
          suggestion: {
            type: 'Nevera',
            urgency: 'media' as const,
            description: 'Nevera con goteo - obstrucción en drenaje o sellos dañados',
            estimatedCost: '$40,000 - $90,000',
            estimatedTime: '1-2 horas'
          }
        },
        mantenimiento: {
          pattern: ['mantenimiento', 'limpieza', 'revisión', 'preventivo'],
          response: 'Mantenimiento de nevera es clave para su eficiencia! ❄️🔧\n\n¿Cuándo fue la última limpieza? Incluye limpieza de serpentines, desagües, sellos y calibración de temperatura.',
          suggestion: {
            type: 'Nevera',
            urgency: 'baja' as const,
            description: 'Mantenimiento preventivo - limpieza de serpentines y calibración',
            estimatedCost: '$50,000 - $70,000',
            estimatedTime: '1-2 horas'
          }
        },
        instalacion: {
          pattern: ['instalación', 'instalar', 'conectar', 'nueva'],
          response: 'Instalación profesional de nevera. ❄️🏠\n\n¿Es nevera nueva o cambio de ubicación? Incluye conexión eléctrica, nivelación, configuración inicial y pruebas.',
          suggestion: {
            type: 'Nevera',
            urgency: 'media' as const,
            description: 'Instalación completa - conexión, nivelación y configuración inicial',
            estimatedCost: '$65,000 - $95,000',
            estimatedTime: '2-3 horas'
          }
        }
      }
    },

    aire: {
      keywords: ['aire', 'acondicionado', 'split', 'clima'],
      problems: {
        noEnfria: {
          pattern: ['no enfría', 'caliente', 'temperatura'],
          response: 'Aire acondicionado sin enfriamiento. 🌡️\n\n¿Arranca normalmente pero no bota aire frío, o no enciende para nada? ¿Cuándo fue la última limpieza de filtros?',
          suggestion: {
            type: 'Aire Acondicionado',
            urgency: 'alta' as const,
            description: 'Aire no enfría - limpieza, recarga de gas o problema eléctrico',
            estimatedCost: '$70,000 - $180,000',
            estimatedTime: '2-4 horas'
          }
        },
        gotea: {
          pattern: ['gotea', 'agua', 'chorrea'],
          response: 'Goteo en aire acondicionado. 💧\n\n¿Gotea por la unidad interna o externa? ¿El goteo es constante o solo cuando funciona?',
          suggestion: {
            type: 'Aire Acondicionado',
            urgency: 'media' as const,
            description: 'Aire acondicionado con goteo - limpieza de drenajes',
            estimatedCost: '$50,000 - $100,000',
            estimatedTime: '1-2 horas'
          }
        },
        mantenimiento: {
          pattern: ['mantenimiento', 'limpieza', 'revisión', 'preventivo'],
          response: 'Mantenimiento de aire es esencial para eficiencia energética! ❄️🔧\n\n¿Hace cuánto no lo limpian? Incluye lavado de filtros, serpentines, drenajes y verificación de gas.',
          suggestion: {
            type: 'Aire Acondicionado',
            urgency: 'media' as const,
            description: 'Mantenimiento preventivo - limpieza completa y verificación de gas',
            estimatedCost: '$60,000 - $90,000',
            estimatedTime: '2-3 horas'
          }
        },
        instalacion: {
          pattern: ['instalación', 'instalar', 'conectar', 'nueva'],
          response: 'Instalación profesional de aire acondicionado. ❄️⚡\n\n¿Qué tipo de unidad? Incluye instalación eléctrica, tubería de cobre, drenaje, vacío y carga de gas.',
          suggestion: {
            type: 'Aire Acondicionado',
            urgency: 'alta' as const,
            description: 'Instalación completa - eléctrica, tubería, vacío y carga de gas',
            estimatedCost: '$150,000 - $300,000',
            estimatedTime: '4-8 horas'
          }
        }
      }
    }
  }

  // Análisis inteligente del mensaje
  for (const [applianceType, config] of Object.entries(patterns)) {
    const hasAppliance = config.keywords.some(keyword =>
      lowerMessage.includes(keyword) || conversationContext.includes(keyword)
    )

    if (hasAppliance) {
      // Buscar problema específico
      for (const [problemType, problemConfig] of Object.entries(config.problems)) {
        const hasProblem = problemConfig.pattern.some(pattern =>
          lowerMessage.includes(pattern)
        )

        if (hasProblem) {
          return {
            response: problemConfig.response,
            suggestion: problemConfig.suggestion,
            confidence: 0.9,
            followUpQuestions: generateFollowUpQuestions(applianceType, problemType)
          }
        }
      }

      // Si se menciona el electrodoméstico pero no el problema específico
      return {
        response: `Veo que tienes un problema con tu ${applianceType}. 🔧\n\n¿Podrías describir exactamente qué está pasando? Por ejemplo: no enciende, hace ruidos extraños, no funciona correctamente, etc.`,
        confidence: 0.7,
        followUpQuestions: [
          `¿Qué síntomas presenta tu ${applianceType}?`,
          `¿Cuándo comenzó el problema?`,
          `¿Es urgente la reparación?`
        ]
      }
    }
  }

  // Patrones genéricos para mantenimiento e instalación
  if (lowerMessage.includes('mantenimiento') || lowerMessage.includes('limpieza') || lowerMessage.includes('preventivo')) {
    return {
      response: 'Mantenimiento preventivo es una excelente decisión! 🔧✨\n\n¿Para qué electrodoméstico necesitas el mantenimiento? Ofrecemos servicios completos que incluyen:\n\n• Limpieza profunda\n• Revisión de componentes\n• Calibración\n• Lubricación de partes móviles\n• Pruebas de funcionamiento',
      confidence: 0.85,
      followUpQuestions: [
        '¿Qué electrodoméstico necesita mantenimiento?',
        '¿Cuánto tiempo tiene sin mantenimiento?',
        '¿Has notado algún problema específico?'
      ]
    }
  }

  if (lowerMessage.includes('instalación') || lowerMessage.includes('instalar') || lowerMessage.includes('conectar')) {
    return {
      response: 'Instalación profesional garantizada! 🔧🏠\n\n¿Qué electrodoméstico necesitas instalar? Nuestros servicios incluyen:\n\n• Conexiones eléctricas seguras\n• Instalación hidráulica (si aplica)\n• Nivelación y calibración\n• Pruebas completas de funcionamiento\n• Garantía de instalación',
      confidence: 0.85,
      followUpQuestions: [
        '¿Qué tipo de electrodoméstico vas a instalar?',
        '¿Es instalación nueva o reubicación?',
        '¿Tienes las conexiones eléctricas listas?'
      ]
    }
  }

  // Respuestas a consultas generales
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
    return {
      response: 'Te explico nuestros precios: 💰\n\n• **Diagnóstico:** $35,000\n• **Reparación básica:** $50,000-$120,000\n• **Servicio completo:** $80,000-$200,000\n• **Mantenimiento preventivo:** $45,000\n\n*Precios incluyen mano de obra. Repuestos se cobran aparte.*\n\n¿Te gustaría programar una visita de diagnóstico?',
      confidence: 0.95
    }
  }

  if (lowerMessage.includes('tiempo') || lowerMessage.includes('cuándo') || lowerMessage.includes('demora')) {
    return {
      response: 'Nuestros tiempos de servicio: ⏰\n\n• **Visita diagnóstico:** 24-48 horas\n• **Reparación in situ:** 2-4 horas\n• **Con repuestos:** 3-7 días\n• **Servicios urgentes:** Mismo día (+30%)\n\n¿Qué tan urgente es tu solicitud?',
      confidence: 0.95
    }
  }

  if (lowerMessage.includes('garantía') || lowerMessage.includes('garantia')) {
    return {
      response: 'Nuestra garantía te protege: 🛡️\n\n• **Mano de obra:** 3 meses\n• **Repuestos nuevos:** 6-12 meses\n• **Servicio completo:** Hasta 1 año\n• **Revisión gratuita:** 30 días\n\n¿Tienes algún servicio previo con nosotros?',
      confidence: 0.9
    }
  }

  // Respuesta genérica inteligente
  return {
    response: `Entiendo tu consulta: "${message}" 🤔\n\nPara ayudarte mejor, necesito más información:\n\n1. **¿Qué electrodoméstico es?** (lavadora, nevera, aire, etc.)\n2. **¿Cuál es el problema específico?**\n3. **¿Qué tan urgente es?**\n\nCon estos datos puedo darte una cotización precisa y programar la visita.`,
    confidence: 0.6,
    followUpQuestions: [
      '¿Qué tipo de electrodoméstico necesita reparación?',
      '¿Cuáles son los síntomas del problema?',
      '¿Prefieres servicio normal o urgente?'
    ]
  }
}

function generateFollowUpQuestions(applianceType: string, problemType: string): string[] {
  const questions: Record<string, Record<string, string[]>> = {
    lavadora: {
      ruido: [
        '¿En qué momento del ciclo se produce el ruido?',
        '¿Has notado si vibra mucho durante el centrifugado?',
        '¿Cuántos años tiene la lavadora?'
      ],
      noEnciende: [
        '¿Hay luz en el panel de control?',
        '¿El tomacorriente funciona con otros aparatos?',
        '¿Se escucha algún sonido al presionar encendido?'
      ]
    },
    nevera: {
      noEnfria: [
        '¿Cuánto tiempo lleva sin enfriar?',
        '¿Los alimentos en el congelador están descongelándose?',
        '¿La luz interior funciona normalmente?'
      ]
    }
  }

  return questions[applianceType]?.[problemType] || [
    '¿Cuándo comenzó el problema?',
    '¿Has intentado alguna solución?',
    '¿Qué tan urgente es la reparación?'
  ]
}
