'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  MessageCircle, Send, X, Minimize2, Maximize2,
  Loader2, CheckCircle2, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  quickReplies?: string[]
  actionButton?: { label: string; href?: string; action?: 'createRequest' }
}

interface ConversationState {
  step: 'greeting' | 'identifying' | 'diagnosing' | 'ready'
  appliance?: string
  problem?: string
  urgency?: 'baja' | 'media' | 'alta'
}

interface BotReply {
  text: string
  quickReplies?: string[]
  actionButton?: { label: string; href?: string; action?: 'createRequest' }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const INITIAL_QUICK_REPLIES = [
  'Reparar electrodoméstico',
  'Servicios especializados',
  'Registrarme como cliente',
  'Unirme como técnico',
  'Precios y garantías',
]

const APPLIANCE_MAP: Record<string, { name: string; problems: string[] }> = {
  'lavadora|lavado|centrifug': {
    name: 'Lavadora',
    problems: ['No enciende', 'Hace ruido', 'No centrifuga', 'Bota agua', 'Instalación', 'Mantenimiento'],
  },
  'nevera|refrigerador|refri|heladera': {
    name: 'Nevera',
    problems: ['No enfría', 'Hace ruido', 'Gotea', 'Se congela todo', 'Instalación', 'Mantenimiento'],
  },
  'aire|split|clima': {
    name: 'Aire Acondicionado',
    problems: ['No enfría', 'No enciende', 'Gotea', 'Hace ruido', 'Instalación', 'Mantenimiento'],
  },
  'calentador|termocalentador|boiler|agua caliente': {
    name: 'Calentador',
    problems: ['No calienta', 'Gotea', 'Temperatura baja', 'Piloto apagado', 'Instalación', 'Mantenimiento'],
  },
  'secadora|ropa húmeda': {
    name: 'Secadora',
    problems: ['No seca', 'No enciende', 'Hace ruido', 'Se sobrecalienta', 'Instalación', 'Mantenimiento'],
  },
  'estufa|cocina a gas|fogon': {
    name: 'Estufa',
    problems: ['Quemadores fallan', 'No enciende', 'Horno', 'Regulador', 'Instalación', 'Mantenimiento'],
  },
  'microondas|micro': {
    name: 'Microondas',
    problems: ['No calienta', 'No enciende', 'Hace chispas', 'Plato no gira', 'Instalación', 'Mantenimiento'],
  },
  'lavavajillas|lavaplatos|lava platos': {
    name: 'Lavavajillas',
    problems: ['No lava bien', 'No enciende', 'No desagua', 'Bota agua', 'Instalación', 'Mantenimiento'],
  },
  'horno eléctrico|horno electrico': {
    name: 'Horno Eléctrico',
    problems: ['No calienta', 'No enciende', 'Temperatura irregular', 'Puerta no cierra', 'Instalación', 'Mantenimiento'],
  },
  'televisor|television|pantalla led|pantalla smart': {
    name: 'Televisor',
    problems: ['No enciende', 'Sin imagen', 'Sin sonido', 'Pantalla dañada', 'Instalación', 'Mantenimiento'],
  },
  'electricidad|cableado|tablero|breaker|tomacorriente|interruptor': {
    name: 'Electricidad',
    problems: ['Instalación cableado', 'Reparación tablero', 'Cambio de breakers', 'Tomas e interruptores', 'Iluminación', 'Revisión eléctrica'],
  },
  'computador|computadora|laptop|portátil|portatil': {
    name: 'Computador / Laptop',
    problems: ['No enciende', 'Muy lento', 'Virus / malware', 'Pantalla dañada', 'Formateo', 'Mantenimiento'],
  },
  'red |redes|internet|wifi|router|cableado estructurado': {
    name: 'Redes / Internet',
    problems: ['Instalación de red', 'Configurar router', 'WiFi lento', 'Sin conexión', 'Cableado estructurado', 'Ampliar cobertura'],
  },
  'cámara|camara|alarma|cctv|vigilancia|seguridad electronica': {
    name: 'Seguridad Electrónica',
    problems: ['Instalación cámaras', 'Sistema de alarma', 'Control de acceso', 'Videoportero', 'Mantenimiento', 'Ampliar sistema'],
  },
}

function matchAppliance(lower: string) {
  for (const [pattern, config] of Object.entries(APPLIANCE_MAP)) {
    if (pattern.split('|').some(kw => lower.includes(kw.trim()))) {
      return config
    }
  }
  return null
}

/** Render **bold** markers as <strong> elements */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className="whitespace-pre-line leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AIChatProps { className?: string }

export default function AIChat({ className }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationState, setConversationState] = useState<ConversationState>({ step: 'greeting' })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // External trigger
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent
      setIsOpen(true)
      setIsMinimized(false)
      if (ev.detail?.fromHero && messages.length === 0) initChat()
    }
    window.addEventListener('openAIChat', handler)
    return () => window.removeEventListener('openAIChat', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  const initChat = useCallback(() => {
    setMessages([{
      id: '1',
      text: '¡Hola! 👋 Soy el asistente de **SomosTécnicos**. ¿En qué te puedo ayudar hoy?',
      isBot: true,
      timestamp: new Date(),
      quickReplies: INITIAL_QUICK_REPLIES,
    }])
    setConversationState({ step: 'greeting' })
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) initChat()
  }, [isOpen, initChat, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ─── AI Logic ──────────────────────────────────────────────────────────────

  const processResponse = useCallback(async (raw: string): Promise<BotReply> => {
    await new Promise(r => setTimeout(r, 850))
    const lower = raw.toLowerCase()

    // Register as client
    if (
      (lower.includes('registrar') && (lower.includes('client') || lower.includes('cuenta'))) ||
      lower.includes('crear cuenta') || lower.includes('registrarme como cliente') ||
      lower.includes('nueva cuenta') || lower.includes('abrir cuenta')
    ) {
      return {
        text: '¡Excelente! Crear tu cuenta de cliente es **gratis** y te da acceso a:\n\n• Seguimiento en tiempo real de tu técnico\n• Historial de reparaciones y garantías\n• Chat directo con tu técnico asignado\n• Notificaciones de estado del servicio',
        actionButton: { label: 'Crear cuenta de cliente →', href: '/register' },
      }
    }

    // Register as technician
    if (
      lower.includes('unirme como técnico') || lower.includes('unirme como tecnico') ||
      lower.includes('registrarme como técnico') || lower.includes('ser técnico') ||
      (lower.includes('técnico') && (lower.includes('unir') || lower.includes('trabajar') || lower.includes('registrar')))
    ) {
      return {
        text: '¡Genial! Unirte como técnico es **completamente gratis**. Obtienes:\n\n• Órdenes de servicio en tu zona\n• Pagos seguros y garantizados\n• Agenda 100% flexible desde el celular\n• Sin mensualidades ni comisiones fijas',
        actionButton: { label: 'Registrarme como técnico →', href: '/trabaja-con-nosotros' },
      }
    }

    // Prices
    if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuánto') ||
        lower.includes('cuanto') || lower.includes('cobran') || lower.includes('vale')) {
      return {
        text: '**Precios del servicio:**\n\n• **Diagnóstico:** $50.000 (se abona si apruebas la reparación en el mes)\n• **Reparación:** Varía según equipo y repuestos\n• **Mantenimiento preventivo:** Desde $45.000\n• **Urgente el mismo día:** Disponible con recargo\n\nEl precio exacto lo da el técnico después del diagnóstico presencial.',
        quickReplies: ['Agendar diagnóstico', '¿Qué cubre la garantía?', 'Volver al inicio'],
      }
    }

    // Guarantees
    if (lower.includes('garantía') || lower.includes('garantia') || lower.includes('garantizan')) {
      return {
        text: '**Garantía en todos los servicios:**\n\n• **Reparaciones:** 30 días\n• **Instalaciones eléctricas y de seguridad:** 90 días\n• **Repuestos nuevos:** 6 a 12 meses\n\nSi el problema regresa dentro del período de garantía, lo resolvemos **sin costo adicional**.',
        quickReplies: ['Ver precios', 'Solicitar servicio', 'Volver al inicio'],
      }
    }

    // Schedule / availability
    if (lower.includes('cuándo') || lower.includes('cuando') || lower.includes('agendar') ||
        lower.includes('horario') || lower.includes('disponib') || lower.includes('cita')) {
      return {
        text: '**Disponibilidad:**\n\n• Lunes a sábado: 8:00 am – 6:00 pm\n• Diagnóstico en 24 a 48 horas\n• Servicio urgente el mismo día (con disponibilidad)\n\n¿Prefieres mañana o tarde?',
        quickReplies: ['Reparar electrodoméstico', 'Precios y garantías', 'Volver al inicio'],
      }
    }

    // Greetings
    if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hey') || lower.includes('buenos')) {
      return { text: '¡Hola! 😊 ¿En qué te ayudo hoy?', quickReplies: INITIAL_QUICK_REPLIES }
    }

    // Back to menu
    if (lower.includes('volver') || lower.includes('inicio') || lower.includes('menú') || lower.includes('menu')) {
      setConversationState({ step: 'greeting' })
      return { text: '¿En qué más te puedo ayudar?', quickReplies: INITIAL_QUICK_REPLIES }
    }

    // General "electrodoméstico" / "especializado" triggers
    if (lower.includes('electrodoméstico') || lower.includes('electrodomestico') || lower.includes('reparar electrodoméstico')) {
      return {
        text: '¿Qué electrodoméstico necesita atención?',
        quickReplies: ['Lavadora', 'Nevera', 'Aire Acondicionado', 'Calentador', 'Secadora', 'Estufa', 'Microondas', 'Televisor'],
      }
    }
    if (lower.includes('especializado') || lower.includes('servicios especializados')) {
      return {
        text: '¿Qué servicio especializado necesitas?',
        quickReplies: ['Electricidad', 'Computador / Laptop', 'Redes / Internet', 'Cámaras / Seguridad'],
      }
    }

    // ── Appliance identification ──────────────────────────────────────────────
    if (!conversationState.appliance) {
      const match = matchAppliance(lower)
      if (match) {
        setConversationState(prev => ({ ...prev, step: 'identifying', appliance: match.name }))
        return {
          text: `Perfecto, **${match.name}**. ¿Cuál es el problema?`,
          quickReplies: match.problems,
        }
      }
      return { text: 'No identifiqué el servicio. ¿Con qué te ayudo?', quickReplies: INITIAL_QUICK_REPLIES }
    }

    // ── Problem diagnosis ─────────────────────────────────────────────────────
    if (conversationState.appliance && !conversationState.problem) {
      let problem = ''
      let urgency: 'baja' | 'media' | 'alta' = 'media'
      let diagnostic = ''

      if (lower.includes('no enciende') || lower.includes('no prende') || lower.includes('muerto') || lower.includes('sin luz')) {
        problem = 'No enciende'; urgency = 'alta'
        diagnostic = '⚡ **Problema eléctrico** — revisión de conexiones y tarjeta de control.\n\n'
      } else if (lower.includes('ruido') || lower.includes('golpe') || lower.includes('vibra') || lower.includes('ronca')) {
        problem = 'Ruidos anormales'; urgency = 'media'
        diagnostic = '🔧 **Problema mecánico** — posibles rodamientos o motor.\n\n'
      } else if (lower.includes('no enfría') || lower.includes('no enfria') || lower.includes('caliente') || lower.includes('no congela')) {
        problem = 'No enfría'; urgency = 'alta'
        diagnostic = '❄️ **Refrigeración** — posible gas refrigerante, compresor o termostato.\n\n'
      } else if (lower.includes('agua') || lower.includes('gotea') || lower.includes('fuga') || lower.includes('bota') || lower.includes('charco')) {
        problem = 'Fuga de agua'; urgency = 'media'
        diagnostic = '💧 **Sellado** — posible manguera, empaque o drenaje dañado.\n\n'
      } else if (lower.includes('instalación') || lower.includes('instalacion') || lower.includes('instalar') || lower.includes('nueva')) {
        problem = 'Instalación'; urgency = 'baja'
        diagnostic = '🔧 **Instalación profesional** — conexión, nivelación y pruebas incluidas.\n\n'
      } else if (lower.includes('mantenimiento') || lower.includes('limpieza') || lower.includes('revisión') || lower.includes('preventivo')) {
        problem = 'Mantenimiento preventivo'; urgency = 'baja'
        diagnostic = '🛠️ **Mantenimiento** — limpieza profunda, calibración y revisión de componentes.\n\n'
      } else if (lower.includes('no calienta') || lower.includes('agua fría') || lower.includes('piloto') || lower.includes('temperatura baja')) {
        problem = 'No calienta'; urgency = 'alta'
        diagnostic = '🔥 **Calefacción** — posible termostato, resistencia o piloto apagado.\n\n'
      } else if (lower.includes('no seca') || lower.includes('húmedo') || lower.includes('humedo')) {
        problem = 'No seca'; urgency = 'media'
        diagnostic = '🌀 **Secado** — posible resistencia o ventilación obstruida.\n\n'
      } else if (lower.includes('chispa') || lower.includes('corto') || lower.includes('quema') || lower.includes('humo')) {
        problem = 'Cortocircuito / chispas'; urgency = 'alta'
        diagnostic = '⚠️ **PELIGRO ELÉCTRICO** — suspende el uso hasta revisión técnica.\n\n'
      } else if (lower.includes('no desagua') || lower.includes('no drena')) {
        problem = 'No desagua'; urgency = 'media'
        diagnostic = '🚰 **Drenaje** — posible bomba u obstrucción en filtro.\n\n'
      } else if (lower.includes('sin imagen') || lower.includes('pantalla negra') || lower.includes('no da imagen')) {
        problem = 'Sin imagen'; urgency = 'alta'
        diagnostic = '📺 **Video** — posible placa principal o panel de pantalla.\n\n'
      } else if (lower.includes('lento') || lower.includes('tarda') || lower.includes('virus')) {
        problem = 'Rendimiento bajo / virus'; urgency = 'media'
        diagnostic = '💻 **Software** — diagnóstico de malware, limpieza y optimización.\n\n'
      } else {
        problem = raw.length > 60 ? raw.slice(0, 57) + '...' : raw
        urgency = 'media'
        diagnostic = '🔍 **Requiere diagnóstico presencial.**\n\n'
      }

      setConversationState(prev => ({ ...prev, step: 'ready', problem, urgency }))

      const urgencyLabel =
        urgency === 'alta' ? '🚨 Urgente' :
        urgency === 'media' ? '⏰ Normal (24-48 h)' : '📅 Programable'

      return {
        text: `${diagnostic}**Resumen del diagnóstico:**\n• Equipo: ${conversationState.appliance}\n• Problema: ${problem}\n• Prioridad: ${urgencyLabel}\n• Diagnóstico: **$50.000** (abonables si apruebas la reparación)\n\n¿Agendamos la visita?`,
        actionButton: { label: '✓  Crear solicitud de servicio', action: 'createRequest' },
      }
    }

    // ── Post-ready ────────────────────────────────────────────────────────────
    if (conversationState.step === 'ready') {
      if (lower.includes('gracias') || lower.includes('ok') || lower.includes('perfecto') || lower.includes('sí')) {
        return {
          text: '¡Perfecto! Presiona el botón de abajo para completar tu solicitud 👇',
          actionButton: { label: '✓  Crear solicitud', action: 'createRequest' },
        }
      }
    }

    return {
      text: conversationState.step === 'greeting'
        ? '¿Con qué te puedo ayudar?'
        : conversationState.step === 'identifying'
        ? '¿Cuál es el problema específico?'
        : '¿Algo más antes de crear la solicitud?',
      quickReplies: conversationState.step === 'greeting' ? INITIAL_QUICK_REPLIES : undefined,
    }
  }, [conversationState])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const addBotReply = useCallback((reply: BotReply) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: reply.text,
      isBot: true,
      timestamp: new Date(),
      quickReplies: reply.quickReplies,
      actionButton: reply.actionButton,
    }])
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }])
    setInputValue('')
    setIsTyping(true)

    try {
      const reply = await processResponse(text)
      addBotReply(reply)
    } catch {
      addBotReply({ text: '😅 Hubo un error. ¿Podrías repetir?' })
    } finally {
      setIsTyping(false)
    }
  }, [processResponse, addBotReply])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue) }
  }

  const createServiceRequest = useCallback(() => {
    const typeMap: Record<string, string> = {
      'Lavadora': 'lavadora', 'Nevera': 'nevera', 'Aire Acondicionado': 'aire',
      'Calentador': 'calentador', 'Secadora': 'secadora', 'Estufa': 'estufa',
      'Microondas': 'microondas', 'Lavavajillas': 'lavavajillas', 'Horno Eléctrico': 'horno',
      'Televisor': 'televisor', 'Electricidad': 'electricidad',
      'Computador / Laptop': 'computacion', 'Redes / Internet': 'redes',
      'Seguridad Electrónica': 'seguridad_electronica',
    }
    window.dispatchEvent(new CustomEvent('openServiceForm', {
      detail: {
        tipoElectrodomestico: typeMap[conversationState.appliance || ''] || '',
        descripcionProblema: `${conversationState.appliance} — ${conversationState.problem}\n\nDiagnosticado por Asistente IA de SomosTécnicos`,
        urgencia: conversationState.urgency || 'media',
        fromAI: true,
      },
    }))
    addBotReply({ text: '✅ **¡Datos transferidos!** Completa tus datos en el formulario y envía la solicitud.' })
    setTimeout(() => {
      document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
    setTimeout(() => setIsOpen(false), 2200)
  }, [conversationState, addBotReply])

  const getProgress = () => {
    const map = { greeting: 25, identifying: 50, diagnosing: 75, ready: 100 }
    return map[conversationState.step] ?? 25
  }

  // ─── Render: Closed (floating button) ─────────────────────────────────────

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-2">
        {/* Tooltip */}
        <div className="bg-[#1a0a0f] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-[fade-in-up_0.4s_ease-out_forwards]">
          ¿Necesitas ayuda? 💬
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Abrir asistente virtual"
          style={{ boxShadow: '0 8px 32px rgba(165,0,52,0.45)' }}
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" aria-hidden="true" />
          <MessageCircle className="h-6 w-6 relative z-10" />
        </button>
      </div>
    )
  }

  // ─── Render: Open chat ─────────────────────────────────────────────────────

  return (
    <div className={
      className ||
      'fixed bottom-0 right-0 md:bottom-6 md:right-6 z-[60] w-full md:w-auto h-full md:h-auto flex items-end md:block bg-black/50 md:bg-transparent'
    }>
      <div
        className={`
          w-full md:w-[380px] shadow-2xl flex flex-col overflow-hidden
          rounded-t-2xl md:rounded-2xl border border-white/8
          transition-all duration-300
          ${isMinimized ? 'h-[60px]' : 'h-[90vh] md:h-[560px]'}
        `}
        style={{ background: '#ffffff' }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          className="shrink-0 px-4 py-3 flex flex-col gap-2"
          style={{ background: 'linear-gradient(135deg, #120608 0%, #1f0a10 100%)' }}
        >
          <div className="flex items-center justify-between">
            {/* Identity */}
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <Image
                  src="/img-3d/logo_modificado.avif"
                  alt="SomosTécnicos"
                  width={36} height={36}
                  className="rounded-full object-contain bg-white p-0.5 ring-2 ring-primary/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#120608]" aria-label="En línea" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">Asistente SomosTécnicos</p>
                {!isMinimized && (
                  <p className="text-[11px] text-[#ff8fab] mt-0.5">
                    Paso {getProgress() === 25 ? 1 : getProgress() === 50 ? 2 : getProgress() === 75 ? 3 : 3} de 3 · En línea
                  </p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(v => !v)}
                className="h-8 w-8 hidden md:flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isMinimized ? 'Maximizar' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {!isMinimized && (
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </div>

        {/* ── Messages ───────────────────────────────────────────────────── */}
        {!isMinimized && (
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-[#FAFAF9]">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1
              return (
                <div key={msg.id} className="space-y-2">
                  <div className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    {/* Bot avatar */}
                    {msg.isBot && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2 mt-0.5">
                        <span className="text-white text-[9px] font-bold">ST</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm shadow-sm ${
                        msg.isBot
                          ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                          : 'bg-primary text-white rounded-tr-sm'
                      }`}
                    >
                      <RichText text={msg.text} />
                    </div>
                  </div>

                  {/* Quick replies — only on the last bot message */}
                  {msg.isBot && msg.quickReplies && isLast && !isTyping && (
                    <div className="flex flex-wrap gap-1.5 pl-8">
                      {msg.quickReplies.map(qr => (
                        <button
                          key={qr}
                          onClick={() => sendMessage(qr)}
                          className="text-xs px-3 py-1.5 rounded-full border border-primary/25 text-primary bg-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-150 font-medium"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action button */}
                  {msg.isBot && msg.actionButton && isLast && !isTyping && (
                    <div className="pl-8">
                      {msg.actionButton.href ? (
                        <Link
                          href={msg.actionButton.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-primary px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          {msg.actionButton.label}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button
                          onClick={createServiceRequest}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-primary px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {msg.actionButton.label}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-bold">ST</span>
                </div>
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-primary/60"
                      style={{ animation: `cta-float-0 1.2s ease-in-out infinite`, animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ── Input area ─────────────────────────────────────────────────── */}
        {!isMinimized && (
          <div className="shrink-0 bg-white border-t border-slate-100 px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta..."
                disabled={isTyping}
                className="
                  flex-1 text-sm h-10 px-4 rounded-full border border-slate-200
                  bg-[#FAFAF9] text-slate-800 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40
                  disabled:opacity-50 transition-all
                "
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                aria-label="Enviar"
              >
                {isTyping
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />
                }
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 hidden md:block">
              Enter para enviar · SomosTécnicos · Cali, Colombia
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
