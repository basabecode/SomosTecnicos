/**
 * ============================================================================
 * COMPONENTE: AIChat - Asistente Virtual Inteligente para SomosTécnicos
 * ============================================================================
 *
 * PROPÓSITO:
 * Este componente implementa un chatbot conversacional que guía a los usuarios
 * a través de un flujo de diagnóstico de electrodomésticos en 3 pasos, culminando
 * con la creación automática de una solicitud de servicio.
 *
 * FLUJO DE CONVERSACIÓN (3 PASOS):
 * 1. GREETING → IDENTIFYING: Identificar qué electrodoméstico tiene el problema
 * 2. IDENTIFYING → DIAGNOSING: Diagnosticar el problema específico
 * 3. DIAGNOSING → READY: Mostrar resumen y CTA para crear solicitud
 *
 * TECNOLOGÍAS:
 * - React Hooks (useState, useEffect, useRef) para manejo de estado
 * - Shadcn/ui components para UI consistente
 * - Tailwind CSS para estilos responsivos
 * - Lucide React para iconografía
 * - Custom Events para comunicación entre componentes
 *
 * CARACTERÍSTICAS:
 * - Sistema de reconocimiento de patrones basado en palabras clave
 * - 10 tipos de electrodomésticos soportados
 * - Diagnóstico de urgencia (baja, media, alta)
 * - Detección de Instalación y Mantenimiento
 * - Comunicación con ServiceForm mediante eventos personalizados
 * - Indicador visual de progreso
 * - Respuestas contextuales según el estado de la conversación
 *
 * @author SomosTécnicos Dev Team
 * @version 2.1
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Loader2,
  CheckCircle2,
  Wrench,
  Calendar
} from 'lucide-react'
import Image from 'next/image'

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

/**
 * Estructura de un mensaje individual en el chat
 */
interface Message {
  id: string              // ID único del mensaje (timestamp)
  text: string            // Contenido del mensaje
  isBot: boolean          // true = mensaje del bot, false = mensaje del usuario
  timestamp: Date         // Hora en que se envió el mensaje
}

/**
 * Estado de la conversación - Controla el flujo del chat
 *
 * ESTADOS POSIBLES:
 * - greeting: Estado inicial, esperando que el usuario inicie
 * - identifying: Identificando el tipo de electrodoméstico
 * - diagnosing: Diagnosticando el problema específico
 * - ready: Diagnóstico completo, listo para crear solicitud
 */
interface ConversationState {
  step: 'greeting' | 'identifying' | 'diagnosing' | 'ready'
  appliance?: string      // Tipo de electrodoméstico identificado
  problem?: string        // Descripción del problema
  urgency?: 'baja' | 'media' | 'alta'  // Nivel de urgencia del problema
}

/**
 * Props del componente AIChat
 */
interface AIChatProps {
  hideTrigger?: boolean   // Si true, no muestra el botón flotante
  className?: string      // Clases CSS personalizadas
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function AIChat({ hideTrigger = false, className }: AIChatProps) {

  // ========================================================================
  // ESTADOS DEL COMPONENTE
  // ========================================================================

  const [isOpen, setIsOpen] = useState(false)                    // Control de visibilidad del chat
  const [isMinimized, setIsMinimized] = useState(false)          // Control de minimización
  const [messages, setMessages] = useState<Message[]>([])        // Array de mensajes del chat
  const [inputValue, setInputValue] = useState('')               // Valor del input de texto
  const [isTyping, setIsTyping] = useState(false)                // Indicador de "bot escribiendo..."
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'greeting'
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)            // Referencia para auto-scroll

  // ========================================================================
  // EFECTO: Escuchar eventos personalizados para abrir el chat
  // ========================================================================

  /**
   * Permite abrir el chat desde otros componentes mediante evento personalizado
   * Uso: window.dispatchEvent(new CustomEvent('openAIChat', { detail: { fromHero: true } }))
   */
  useEffect(() => {
    const handleOpenChat = (event: any) => {
      setIsOpen(true)
      setIsMinimized(false)
      if (event.detail?.fromHero && messages.length === 0) {
        initializeChat()
      }
    }
    window.addEventListener('openAIChat', handleOpenChat)
    return () => window.removeEventListener('openAIChat', handleOpenChat)
  }, [])

  // ========================================================================
  // MENSAJES INICIALES DEL BOT
  // ========================================================================

  /**
   * Mensajes de bienvenida que se muestran al abrir el chat
   * Explican el flujo de 3 pasos y solicitan el tipo de electrodoméstico
   */
  const initialMessages: Message[] = [
    {
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente de SomosTécnicos.',
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'Te ayudo a solicitar tu servicio en 3 pasos:\n\n1️⃣ Identifico tu necesidad\n2️⃣ Entiendo el problema\n3️⃣ Creo tu solicitud\n\n**¿Qué servicio necesitas?**\n\n📱 **Electrodomésticos:** Lavadora, nevera, aire, estufa, microondas, secadora, lavavajillas, horno, calentador, televisor\n\n⚡ **Especialidades:** Electricidad, computadores, redes, cámaras de seguridad',
      isBot: true,
      timestamp: new Date(),
    },
  ]

  /**
   * Inicializa el chat con los mensajes de bienvenida
   */
  const initializeChat = () => {
    setMessages(initialMessages)
    setConversationState({ step: 'greeting' })
  }

  // ========================================================================
  // EFECTOS DE INICIALIZACIÓN Y AUTO-SCROLL
  // ========================================================================

  /**
   * Inicializar mensajes cuando se abre el chat por primera vez
   */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
    }
  }, [isOpen])

  /**
   * Auto-scroll al último mensaje cuando hay nuevos mensajes
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * Función para hacer scroll al final del chat
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ========================================================================
  // MOTOR DE INTELIGENCIA ARTIFICIAL (SIMULADA)
  // ========================================================================

  /**
   * FUNCIÓN PRINCIPAL DE PROCESAMIENTO DE IA
   *
   * Esta función implementa un sistema de reconocimiento de patrones
   * basado en palabras clave (keyword matching) para simular inteligencia.
   *
   * FLUJO DE DECISIÓN:
   * 1. Normaliza el input del usuario (lowercase)
   * 2. Evalúa el estado actual de la conversación
   * 3. Busca patrones de palabras clave en el mensaje
   * 4. Genera respuesta contextual según el paso del flujo
   * 5. Actualiza el estado de la conversación si es necesario
   *
   * @param userMessage - Mensaje enviado por el usuario
   * @returns Promise<string> - Respuesta generada por el bot
   */
  const processAIResponse = async (userMessage: string): Promise<string> => {

    // Simular delay de procesamiento (efecto de "pensando...")
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Normalizar mensaje para búsqueda de patrones
    const lower = userMessage.toLowerCase()

    // ====================================================================
    // PASO 1: MANEJO DE SALUDOS Y COMANDOS BÁSICOS
    // ====================================================================

    if (conversationState.step === 'greeting') {

      // Patrón: Saludos generales
      if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hey')) {
        return '¡Hola! 😊 Listo para ayudarte.\n\n**¿Qué servicio necesitas?** (electrodomésticos, electricidad, computadores, redes, seguridad)'
      }

      // Patrón: Solicitud de ayuda
      if (lower.includes('ayuda') || lower.includes('help')) {
        return 'Claro! Te ayudo paso a paso:\n\n1. Dime qué servicio necesitas\n2. Describes el problema\n3. Te creo la solicitud ✅\n\n**Servicios disponibles:**\n📱 Electrodomésticos\n⚡ Electricidad\n💻 Computadores\n🌐 Redes\n📹 Seguridad'
      }
    }

    // ====================================================================
    // PASO 2: IDENTIFICACIÓN DE ELECTRODOMÉSTICO
    // ====================================================================

    /**
     * Si aún no tenemos el tipo de electrodoméstico identificado,
     * buscar patrones de palabras clave para cada tipo
     */
    if (!conversationState.appliance) {
      let appliance = ''      // Nombre del electrodoméstico identificado
      let followUp = ''       // Pregunta de seguimiento para diagnosticar

      // LAVADORA
      if (lower.includes('lavadora') || lower.includes('lavado')) {
        appliance = 'Lavadora'
        followUp = '**¿Cuál es el problema?**\n\n• No enciende\n• Hace ruido\n• No centrifuga\n• Bota agua\n• Instalación\n• Mantenimiento'
      }

      // NEVERA/REFRIGERADOR
      else if (lower.includes('nevera') || lower.includes('refri') || lower.includes('frigo')) {
        appliance = 'Nevera'
        followUp = '**¿Qué está pasando?**\n\n• No enfría\n• Hace ruido\n• Bota agua\n• Se congela todo\n• Instalación\n• Mantenimiento'
      }

      // AIRE ACONDICIONADO
      else if (lower.includes('aire') || lower.includes('clima')) {
        appliance = 'Aire Acondicionado'
        followUp = '**¿Cuál es la falla?**\n\n• No enfría\n• No enciende\n• Gotea\n• Hace ruido\n• Instalación\n• Mantenimiento'
      }

      // ESTUFA/COCINA
      else if (lower.includes('estufa') || lower.includes('cocina')) {
        appliance = 'Estufa'
        followUp = '**¿Qué no funciona?**\n\n• Quemadores\n• Horno\n• Encendido\n• Regulador\n• Instalación\n• Mantenimiento'
      }

      // MICROONDAS
      else if (lower.includes('microondas') || lower.includes('micro')) {
        appliance = 'Microondas'
        followUp = '**¿Cuál es el problema?**\n\n• No calienta\n• No enciende\n• Hace chispas\n• Plato no gira\n• Instalación\n• Mantenimiento'
      }

      // SECADORA
      else if (lower.includes('secadora') || lower.includes('secado')) {
        appliance = 'Secadora'
        followUp = '**¿Qué está fallando?**\n\n• No seca\n• No enciende\n• Hace ruido\n• Se sobrecalienta\n• Instalación\n• Mantenimiento'
      }

      // LAVAVAJILLAS
      else if (lower.includes('lavavajillas') || lower.includes('lava platos') || lower.includes('lavaplatos')) {
        appliance = 'Lavavajillas'
        followUp = '**¿Cuál es la falla?**\n\n• No lava bien\n• No enciende\n• Bota agua\n• No desagua\n• Instalación\n• Mantenimiento'
      }

      // HORNO ELÉCTRICO
      else if (lower.includes('horno eléctrico') || lower.includes('horno electrico') || (lower.includes('horno') && lower.includes('eléctrico'))) {
        appliance = 'Horno Eléctrico'
        followUp = '**¿Qué no funciona?**\n\n• No calienta\n• No enciende\n• Temperatura irregular\n• Puerta no cierra\n• Instalación\n• Mantenimiento'
      }

      // CALENTADOR
      else if (lower.includes('calentador') || lower.includes('termo') || lower.includes('boiler')) {
        appliance = 'Calentador'
        followUp = '**¿Cuál es el problema?**\n\n• No calienta\n• Gotea\n• Temperatura baja\n• No enciende piloto\n• Instalación\n• Mantenimiento'
      }

      // TELEVISOR
      else if (lower.includes('televisor') || lower.includes('tv') || lower.includes('tele')) {
        appliance = 'Televisor'
        followUp = '**¿Qué está pasando?**\n\n• No enciende\n• No da imagen\n• No hay sonido\n• Pantalla dañada\n• Instalación\n• Mantenimiento'
      }

      // ELECTRICIDAD
      else if (lower.includes('electricidad') || lower.includes('eléctrico') || lower.includes('electrico') || lower.includes('cableado') || lower.includes('tablero') || lower.includes('breaker') || lower.includes('toma') || lower.includes('interruptor')) {
        appliance = 'Electricidad'
        followUp = '**¿Qué necesitas?**\n\n• Instalación de cableado\n• Reparación de tablero\n• Cambio de breakers\n• Instalación de tomas\n• Iluminación\n• Revisión eléctrica'
      }

      // COMPUTADORES
      else if (lower.includes('computador') || lower.includes('computadora') || lower.includes('pc') || lower.includes('laptop') || lower.includes('portatil') || lower.includes('portátil')) {
        appliance = 'Computador'
        followUp = '**¿Cuál es el problema?**\n\n• No enciende\n• Lento\n• Virus\n• Pantalla dañada\n• Formateo\n• Instalación de software\n• Mantenimiento'
      }

      // REDES
      else if (lower.includes('red') || lower.includes('redes') || lower.includes('internet') || lower.includes('wifi') || lower.includes('router') || lower.includes('cableado estructurado')) {
        appliance = 'Redes'
        followUp = '**¿Qué necesitas?**\n\n• Instalación de red\n• Configuración de router\n• Cableado estructurado\n• Puntos de acceso WiFi\n• Diagnóstico de conexión\n• Optimización de red'
      }

      // SEGURIDAD ELECTRÓNICA
      else if (lower.includes('cámara') || lower.includes('camara') || lower.includes('seguridad') || lower.includes('alarma') || lower.includes('cctv') || lower.includes('vigilancia')) {
        appliance = 'Seguridad Electrónica'
        followUp = '**¿Qué necesitas?**\n\n• Instalación de cámaras\n• Sistema de alarma\n• Control de acceso\n• Videoportero\n• Mantenimiento de sistema\n• Ampliación de cámaras'
      }

      // NO SE IDENTIFICÓ EL SERVICIO
      else {
        return 'Mmm, no identifiqué el servicio 🤔\n\n**Por favor escribe uno de estos:**\n\n📱 **Electrodomésticos:** Lavadora, Nevera, Aire, Estufa, Microondas, Secadora, Lavavajillas, Horno, Calentador, Televisor\n\n⚡ **Especialidades:** Electricidad, Computador, Redes, Cámaras/Seguridad'
      }

      // Actualizar estado: ahora tenemos el electrodoméstico identificado
      setConversationState(prev => ({
        ...prev,
        step: 'identifying',
        appliance
      }))

      return `Perfecto! ${appliance} 👍\n\n${followUp}`
    }

    // ====================================================================
    // PASO 3: DIAGNÓSTICO DEL PROBLEMA
    // ====================================================================

    /**
     * Si ya tenemos el electrodoméstico pero no el problema,
     * analizar el mensaje para diagnosticar
     */
    if (conversationState.appliance && !conversationState.problem) {
      let problem = ''                                    // Descripción del problema
      let urgency: 'baja' | 'media' | 'alta' = 'media'   // Nivel de urgencia
      let diagnostic = ''                                 // Mensaje de diagnóstico

      // ----------------------------------------------------------------
      // DETECCIÓN DE PROBLEMAS COMUNES (Patrones de palabras clave)
      // ----------------------------------------------------------------

      // PROBLEMA: No enciende (Alta urgencia - sin electricidad)
      if (lower.includes('no enciende') || lower.includes('no prende') || lower.includes('muerto')) {
        problem = 'No enciende'
        urgency = 'alta'
        diagnostic = '⚡ **Problema eléctrico**\nPosible causa: Conexión, fusible o tarjeta.\n\n'
      }

      // PROBLEMA: Hace ruidos anormales
      else if (lower.includes('ruido') || lower.includes('sonido') || lower.includes('golpe')) {
        problem = 'Hace ruidos anormales'
        urgency = 'media'
        diagnostic = '🔧 **Problema mecánico**\nPosible causa: Rodamientos o motor.\n\n'
      }

      // PROBLEMA: No enfría (Alta urgencia - riesgo de comida/ambiente)
      else if (lower.includes('no enfría') || lower.includes('caliente') || lower.includes('no congela')) {
        problem = 'No enfría correctamente'
        urgency = 'alta'
        diagnostic = '❄️ **Problema de refrigeración**\nPosible causa: Gas, compresor o termostato.\n\n'
      }

      // PROBLEMA: Fuga de agua
      else if (lower.includes('agua') || lower.includes('gotea') || lower.includes('fuga') || lower.includes('bota')) {
        problem = 'Fuga de agua'
        urgency = 'media'
        diagnostic = '💧 **Problema de sellado**\nPosible causa: Manguera o empaque.\n\n'
      }

      // PROBLEMA: Instalación
      else if (lower.includes('instalación') || lower.includes('instalacion') || lower.includes('instalar')) {
        problem = 'Instalación de equipo'
        urgency = 'baja'
        diagnostic = '🔧 **Servicio de instalación**\nInstalación profesional de tu equipo.\n\n'
      }

      // PROBLEMA: Mantenimiento
      else if (lower.includes('mantenimiento') || lower.includes('limpieza') || lower.includes('revisión') || lower.includes('revision')) {
        problem = 'Mantenimiento preventivo'
        urgency = 'baja'
        diagnostic = '🛠️ **Mantenimiento preventivo**\nRevisión y limpieza completa del equipo.\n\n'
      }

      // PROBLEMA: Funciones específicas no operan
      else if (lower.includes('no centrifuga') || lower.includes('no lava') || lower.includes('no calienta')) {
        problem = userMessage
        urgency = 'media'
        diagnostic = '⚙️ **Falla funcional**\nNecesita revisión técnica.\n\n'
      }

      // PROBLEMA: No seca (Secadoras)
      else if (lower.includes('no seca') || lower.includes('húmedo') || lower.includes('humedo')) {
        problem = 'No seca correctamente'
        urgency = 'media'
        diagnostic = '🌀 **Problema de secado**\nPosible causa: Resistencia, termostato o ventilación.\n\n'
      }

      // PROBLEMA: Sobrecalentamiento (Alta urgencia - riesgo de incendio)
      else if (lower.includes('sobrecalienta') || lower.includes('muy caliente') || lower.includes('quema')) {
        problem = 'Se sobrecalienta'
        urgency = 'alta'
        diagnostic = '🔥 **Problema de temperatura**\nPosible causa: Termostato o ventilación bloqueada.\n\n'
      }

      // PROBLEMA: No desagua (Lavavajillas/Lavadoras)
      else if (lower.includes('no desagua') || lower.includes('no desagüa') || lower.includes('no drena')) {
        problem = 'No desagua'
        urgency = 'media'
        diagnostic = '🚰 **Problema de drenaje**\nPosible causa: Bomba o filtro obstruido.\n\n'
      }

      // PROBLEMA: Sin imagen (TV)
      else if (lower.includes('no da imagen') || lower.includes('pantalla') || lower.includes('negro')) {
        problem = 'No da imagen'
        urgency = 'alta'
        diagnostic = '📺 **Problema de video**\nPosible causa: Placa, pantalla o cable.\n\n'
      }

      // PROBLEMA: Sin sonido (TV)
      else if (lower.includes('no hay sonido') || lower.includes('sin audio') || lower.includes('mudo')) {
        problem = 'Sin sonido'
        urgency = 'media'
        diagnostic = '🔊 **Problema de audio**\nPosible causa: Bocinas o placa de sonido.\n\n'
      }

      // PROBLEMA: Chispas o cortocircuito (MÁXIMA URGENCIA - PELIGRO)
      else if (lower.includes('chispas') || lower.includes('chispa') || lower.includes('corto')) {
        problem = 'Genera chispas'
        urgency = 'alta'
        diagnostic = '⚠️ **PELIGRO ELÉCTRICO**\nNo usar hasta revisar. Posible cortocircuito.\n\n'
      }

      // PROBLEMA: Temperatura irregular
      else if (lower.includes('temperatura irregular') || lower.includes('no regula') || lower.includes('temperatura')) {
        problem = 'Temperatura irregular'
        urgency = 'media'
        diagnostic = '🌡️ **Problema de control**\nPosible causa: Termostato o sensor.\n\n'
      }

      // PROBLEMA: Piloto (Calentadores a gas)
      else if (lower.includes('piloto') || lower.includes('llama')) {
        problem = 'Problema con piloto'
        urgency = 'alta'
        diagnostic = '🔥 **Problema de encendido**\nPosible causa: Termopar o piloto.\n\n'
      }

      // PROBLEMA GENÉRICO: Usar el mensaje del usuario tal cual
      else {
        problem = userMessage
        urgency = 'media'
        diagnostic = '🔍 **Requiere diagnóstico**\n\n'
      }

      // ----------------------------------------------------------------
      // ACTUALIZAR ESTADO: Conversación completa, listo para crear solicitud
      // ----------------------------------------------------------------
      setConversationState(prev => ({
        ...prev,
        step: 'ready',    // Cambiar a estado "ready"
        problem,
        urgency
      }))

      // Formatear texto de urgencia
      const urgencyText = urgency === 'alta' ? '🚨 **URGENTE**' : urgency === 'media' ? '⏰ Normal' : '📅 Programable'

      // Retornar resumen completo con CTA
      return `${diagnostic}**Resumen:**\n• Equipo: ${conversationState.appliance}\n• Problema: ${problem}\n• Prioridad: ${urgencyText}\n\n✅ **¡Listo para crear tu solicitud!**\nPresiona el botón verde de abajo 👇`
    }

    // ====================================================================
    // RESPUESTAS INFORMATIVAS ADICIONALES
    // ====================================================================

    // Consulta sobre precios
    if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuanto')) {
      return '💰 **Precios estimados:**\n\n• Diagnóstico: $35.000\n• Reparación básica: $50k-$120k\n• Servicio completo: $80k-$200k\n\nEl costo exacto se confirma después del diagnóstico.'
    }

    // Consulta sobre tiempos
    if (lower.includes('tiempo') || lower.includes('cuando') || lower.includes('demora')) {
      return '⏱️ **Tiempos de servicio:**\n\n• Diagnóstico: 24-48 hrs\n• Reparación: 2-4 hrs\n• Con repuestos: 3-7 días\n\n¿Es urgente?'
    }

    // Agradecimientos o confirmaciones
    if (lower.includes('gracias') || lower.includes('ok') || lower.includes('perfecto') || lower.includes('bien')) {
      if (conversationState.step === 'ready') {
        return '😊 ¡Excelente!\n\n**Presiona "Crear Solicitud"** para completar el formulario automáticamente.'
      }
      return '😊 De nada! ¿En qué más te ayudo?'
    }

    // ====================================================================
    // RESPUESTA GENÉRICA CONTEXTUAL
    // ====================================================================

    /**
     * Si no se reconoce el patrón, guiar según el paso actual
     */
    return `Entendido 👍\n\n${
      conversationState.step === 'greeting'
        ? '**Primero dime: ¿Qué electrodoméstico?**'
        : conversationState.step === 'identifying'
        ? '**Ahora cuéntame: ¿Cuál es el problema?**'
        : '¿Algo más que quieras agregar antes de crear la solicitud?'
    }`
  }

  // ========================================================================
  // HANDLER: Enviar mensaje del usuario
  // ========================================================================

  /**
   * Procesa el envío de un mensaje del usuario
   *
   * FLUJO:
   * 1. Valida que haya texto
   * 2. Agrega mensaje del usuario al chat
   * 3. Activa indicador de "escribiendo..."
   * 4. Procesa respuesta de IA
   * 5. Agrega respuesta del bot al chat
   * 6. Maneja errores si ocurren
   */
  const handleSendMessage = async () => {
    // Validar input no vacío
    if (!inputValue.trim()) return

    // Crear mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    // Agregar mensaje al chat y limpiar input
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)  // Activar indicador "escribiendo..."

    try {
      // Procesar respuesta de IA
      const response = await processAIResponse(inputValue)

      // Crear mensaje del bot
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      }

      // Agregar respuesta al chat
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      // Manejo de errores: mostrar mensaje amigable
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '😅 Ups, hubo un error. ¿Puedes repetir?',
        isBot: true,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])

    } finally {
      // Siempre desactivar indicador de escritura
      setIsTyping(false)
    }
  }

  // ========================================================================
  // HANDLER: Detectar tecla Enter
  // ========================================================================

  /**
   * Permite enviar mensaje con Enter (sin Shift)
   * Shift+Enter agrega nueva línea
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // ========================================================================
  // FUNCIÓN: Crear solicitud de servicio
  // ========================================================================

  /**
   * Crea una solicitud de servicio con los datos del diagnóstico del chat
   *
   * PROCESO:
   * 1. Prepara los datos del diagnóstico (electrodoméstico, problema, urgencia)
   * 2. Dispara un evento personalizado 'openServiceForm' con los datos
   * 3. El ServiceForm escuchará este evento y pre-llenará el formulario
   * 4. Hace scroll al formulario y muestra mensaje de confirmación
   */
  const createServiceRequest = () => {
    // Mapeo de nombres del chat a valores del formulario
    const typeMap: Record<string, string> = {
      // Electrodomésticos
      'Lavadora': 'lavadora',
      'Nevera': 'nevera',
      'Aire Acondicionado': 'aire',
      'Estufa': 'estufa',
      'Microondas': 'microondas',
      'Secadora': 'secadora',
      'Lavavajillas': 'lavavajillas',
      'Horno Eléctrico': 'horno',
      'Calentador': 'calentador',
      'Televisor': 'televisor',

      // Especialidades
      'Electricidad': 'electricidad',
      'Computador': 'computacion',
      'Redes': 'redes',
      'Seguridad Electrónica': 'seguridad_electronica'
    }

    const mappedType = typeMap[conversationState.appliance || '']

    // Disparar evento personalizado con los datos del diagnóstico
    window.dispatchEvent(
      new CustomEvent('openServiceForm', {
        detail: {
          tipoElectrodomestico: mappedType || '',
          descripcionProblema: `${conversationState.appliance} - ${conversationState.problem}\n\nDiagnosticado por Asistente IA de SomosTécnicos`,
          urgencia: conversationState.urgency || 'media',
          fromAI: true
        }
      })
    )

    // Scroll suave al formulario
    setTimeout(() => {
      const formElement = document.getElementById('formulario')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 300)

    // Agregar mensaje de confirmación al chat
    const successMsg: Message = {
      id: Date.now().toString(),
      text: '✅ **¡Datos transferidos!**\n\nAhora completa tus datos personales en el formulario y envía la solicitud.',
      isBot: true,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, successMsg])

    // Cerrar el chat después de 2 segundos
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
  }

  // ========================================================================
  // FUNCIÓN: Calcular progreso visual
  // ========================================================================

  /**
   * Calcula el porcentaje de progreso basado en el paso actual
   * Se usa para la barra de progreso en el header
   *
   * @returns Porcentaje de 0 a 100
   */
  const getProgress = () => {
    const steps = ['greeting', 'identifying', 'diagnosing', 'ready']
    const currentIndex = steps.indexOf(conversationState.step)
    return ((currentIndex + 1) / steps.length) * 100
  }

  // ========================================================================
  // RENDER: Botón flotante (chat cerrado)
  // ========================================================================

  /**
   * Si el chat no está abierto, mostrar solo el botón flotante
   * (a menos que hideTrigger sea true)
   */
  if (!isOpen) {
    if (hideTrigger) return null

    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Botón circular flotante con animación de pulso */}
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Abrir asistente virtual"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    )
  }

  // ========================================================================
  // RENDER: Interfaz del chat (abierto)
  // ========================================================================

  return (
    <div className={className || "fixed bottom-6 right-6 z-50"}>
      <Card
        className={`w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[520px]'
        }`}
      >
        {/* ================================================================
            HEADER DEL CHAT
            ================================================================ */}
        <CardHeader className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            {/* Título y estado */}
            <div className="flex items-center space-x-2">
              <Image
                src="/img_3d/logo modificado.jpeg"
                alt="SomosTécnicos"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <div>
                <CardTitle className="text-sm font-medium">
                  Asistente IA SomosTécnicos
                </CardTitle>
                {!isMinimized && (
                  <p className="text-xs opacity-90">
                    Paso {conversationState.step === 'greeting' ? '1' : conversationState.step === 'identifying' ? '2' : conversationState.step === 'diagnosing' ? '3' : '3'} de 3
                  </p>
                )}
              </div>
            </div>

            {/* Controles: Minimizar y Cerrar */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                aria-label={isMinimized ? "Maximizar" : "Minimizar"}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Barra de progreso */}
          {!isMinimized && (
            <div className="mt-3 bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </CardHeader>

        {/* ================================================================
            CONTENIDO DEL CHAT (solo visible cuando no está minimizado)
            ================================================================ */}
        {!isMinimized && (
          <>
            <CardContent className="p-0 flex flex-col h-[460px]">
              {/* ============================================================
                  ÁREA DE MENSAJES
                  ============================================================ */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isBot ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isBot && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        {!message.isBot && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-sm whitespace-pre-line">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Indicador de "escribiendo..." */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Pensando...</span>
                    </div>
                  </div>
                )}

                {/* Referencia para auto-scroll */}
                <div ref={messagesEndRef} />
              </div>

              {/* ============================================================
                  BOTÓN DE CREAR SOLICITUD (solo visible cuando está listo)
                  ============================================================ */}
              {conversationState.step === 'ready' && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-t">
                  <Button
                    onClick={createServiceRequest}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Crear Solicitud de Servicio
                  </Button>
                  <p className="text-xs text-center text-gray-600 mt-2">
                    Llenaremos el formulario automáticamente
                  </p>
                </div>
              )}

              {/* ============================================================
                  ÁREA DE INPUT
                  ============================================================ */}
              <div className="p-4 border-t bg-white border-gray-200">
                <div className="flex items-center space-x-3">
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 text-sm h-10 border-2 focus:border-blue-500"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-blue-500 hover:bg-blue-600 h-10 px-4"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Presiona Enter para enviar • Shift+Enter para nueva línea
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
