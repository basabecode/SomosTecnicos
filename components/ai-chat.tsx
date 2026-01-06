/**
 * Chat IA - Componente Nuevo
 * Se integra opcionalmente en HeroSection sin afectar funcionalidad existente
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
} from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

interface ServiceSuggestion {
  type: string
  urgency: string
  description: string
}

interface AIChatProps {
  hideTrigger?: boolean
  className?: string
}

/**
 * Chat IA Inteligente para Hero Section
 * - Conversación natural sobre problemas de electrodomésticos
 * - Auto-llenado de formulario basado en conversación
 * - Respuestas contextuales y sugerencias
 * - Interfaz minimizable y responsive
 */
export default function AIChat({ hideTrigger = false, className }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentSuggestion, setCurrentSuggestion] =
    useState<ServiceSuggestion | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Escuchar eventos para abrir el chat externamente
  useEffect(() => {
    const handleOpenChat = (event: any) => {
      setIsOpen(true)
      setIsMinimized(false)

      // Si viene del hero, agregar un mensaje de bienvenida especial
      if (event.detail?.fromHero) {
        setTimeout(() => {
          const welcomeMessage: Message = {
            id: `welcome-${Date.now()}`,
            text: '🎯 **Perfecto!** Has activado el Asistente IA desde el inicio.\n\nEstoy listo para ayudarte con cualquier problema de electrodomésticos. ¿Cuál es tu consulta?',
            isBot: true,
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, welcomeMessage])
        }, 800)
      }
    }

    window.addEventListener('openAIChat', handleOpenChat)
    return () => window.removeEventListener('openAIChat', handleOpenChat)
  }, [])

  // Mensajes iniciales del bot
  const initialMessages: Message[] = [
    {
      id: '1',
      text: '¡Hola! 👋 Soy el **Asistente IA de TecnoCity**. Estoy aquí para ayudarte con tu electrodoméstico.',
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: '🔧 Cuéntame sobre el problema y te ayudo a:\n• Identificar la falla\n• Estimar costos\n• Crear tu solicitud de servicio\n\n¿Qué electrodoméstico necesita reparación?',
      isBot: true,
      timestamp: new Date(),
    },
  ]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(initialMessages)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Procesamiento de IA simulado
  const processAIResponse = async (userMessage: string): Promise<string> => {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500))

    const lowerMessage = userMessage.toLowerCase()

    // Patterns de reconocimiento
    if (lowerMessage.includes('lavadora') || lowerMessage.includes('lavado')) {
      if (lowerMessage.includes('ruido') || lowerMessage.includes('sonido')) {
        setCurrentSuggestion({
          type: 'Lavadora',
          urgency: 'media',
          description:
            'Problema de ruidos en lavadora - posible desgaste de rodamientos',
        })
        return 'Entiendo, problema con ruidos en la lavadora. 🔧\n\n¿El ruido ocurre durante el centrifugado o durante todo el ciclo de lavado? Esto me ayuda a determinar si son los rodamientos o la correa.'
      }

      if (
        lowerMessage.includes('no enciende') ||
        lowerMessage.includes('no funciona')
      ) {
        setCurrentSuggestion({
          type: 'Lavadora',
          urgency: 'alta',
          description: 'Lavadora no enciende - revisar conexiones eléctricas',
        })
        return 'Problema eléctrico en lavadora. ⚡\n\n¿La lavadora no prende para nada o se apaga durante el funcionamiento? ¿Has verificado que llegue corriente al tomacorriente?'
      }

      return 'Veo que tienes un problema con tu lavadora. 🧺\n\n¿Podrías describir exactamente qué está pasando? Por ejemplo: no enciende, hace ruidos extraños, no centrifuga, etc.'
    }

    if (
      lowerMessage.includes('nevera') ||
      lowerMessage.includes('refrigerador')
    ) {
      if (
        lowerMessage.includes('no enfría') ||
        lowerMessage.includes('caliente')
      ) {
        setCurrentSuggestion({
          type: 'Nevera',
          urgency: 'alta',
          description: 'Nevera no enfría - problema de refrigeración crítico',
        })
        return 'Problema crítico de refrigeración! 🧊\n\n¿La nevera está completamente caliente o solo algunas áreas? ¿Escuchas que el motor funciona? Esto es urgente por tus alimentos.'
      }

      if (lowerMessage.includes('ruido') || lowerMessage.includes('sonido')) {
        setCurrentSuggestion({
          type: 'Nevera',
          urgency: 'media',
          description: 'Nevera con ruidos anormales - revisar compresor',
        })
        return 'Ruidos en la nevera pueden indicar problema del compresor. 🔧\n\n¿El ruido es constante o solo cuando arranca? ¿Es un zumbido, golpeteo o chirrido?'
      }

      return 'Problema con tu nevera detectado! ❄️\n\n¿Qué síntomas presenta? No enfría, hace ruidos, se forma hielo en exceso, etc.'
    }

    if (
      lowerMessage.includes('aire') ||
      lowerMessage.includes('acondicionado')
    ) {
      if (
        lowerMessage.includes('no enfría') ||
        lowerMessage.includes('caliente')
      ) {
        setCurrentSuggestion({
          type: 'Aire Acondicionado',
          urgency: 'alta',
          description: 'Aire acondicionado no enfría - limpieza o recarga',
        })
        return 'Aire acondicionado sin enfriamiento. 🌡️\n\n¿Arranca normalmente pero no bota aire frío, o no enciende para nada? ¿Cuándo fue la última limpieza de filtros?'
      }

      return 'Problema con aire acondicionado identificado! ❄️\n\n¿Específicamente qué falla tiene? No enciende, no enfría, gotea, hace ruido, etc.'
    }

    if (lowerMessage.includes('estufa') || lowerMessage.includes('cocina')) {
      setCurrentSuggestion({
        type: 'Estufa',
        urgency: 'media',
        description: 'Problema en estufa - revisar quemadores o conexiones',
      })
      return 'Problema en la cocina detectado! 🔥\n\n¿Es estufa de gas o eléctrica? ¿Qué específicamente no funciona: quemadores, horno, encendido automático?'
    }

    if (lowerMessage.includes('microondas')) {
      setCurrentSuggestion({
        type: 'Microondas',
        urgency: 'media',
        description: 'Problema en microondas - revisar magnetrón o controles',
      })
      return 'Microondas con falla. 📡\n\n¿Prende pero no calienta, o no enciende para nada? ¿Gira el plato y prende la luz interior?'
    }

    // Respuestas de información general
    if (
      lowerMessage.includes('precio') ||
      lowerMessage.includes('costo') ||
      lowerMessage.includes('cuánto')
    ) {
      return 'Los precios varían según el tipo de servicio: 💰\n\n• Diagnóstico: $35.000\n• Reparación básica: $50.000-$120.000\n• Servicio completo: $80.000-$200.000\n\n¿Te gustaría que programe una visita para diagnóstico?'
    }

    if (
      lowerMessage.includes('tiempo') ||
      lowerMessage.includes('cuándo') ||
      lowerMessage.includes('demora')
    ) {
      return 'Nuestros tiempos de servicio: ⏰\n\n• Visita de diagnóstico: 24-48 horas\n• Reparación en sitio: 2-4 horas\n• Con repuestos: 3-7 días\n\n¿Es urgente tu solicitud?'
    }

    if (
      lowerMessage.includes('gracias') ||
      lowerMessage.includes('ok') ||
      lowerMessage.includes('bien')
    ) {
      return '¡Perfecto! 😊 ¿Te gustaría que llene automáticamente el formulario de servicio con la información que me has dado?'
    }

    // Respuesta genérica inteligente
    return `Entiendo tu consulta sobre "${userMessage}". 🤔\n\nPara ayudarte mejor, ¿podrías contarme:\n\n1. ¿Qué tipo de electrodoméstico es?\n2. ¿Cuál es el problema específico?\n3. ¿Es urgente la reparación?`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await processAIResponse(inputValue)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error procesando respuesta IA:', error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Disculpa, tuve un problema técnico. ¿Podrías repetir tu consulta?',
        isBot: true,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const fillForm = () => {
    if (currentSuggestion) {
      // Auto-scroll al formulario existente
      const formElement = document.getElementById('formulario')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' })

        // Simular llenado de campos (compatible con el formulario existente)
        setTimeout(() => {
          const tipoElectrodomestico = document.querySelector(
            'select[name="tipoElectrodomestico"]'
          ) as HTMLSelectElement
          const descripcion = document.querySelector(
            'textarea[name="descripcionProblema"]'
          ) as HTMLTextAreaElement

          if (tipoElectrodomestico) {
            // Mapear tipos
            const typeMap: Record<string, string> = {
              Lavadora: 'lavadora',
              Nevera: 'nevera',
              'Aire Acondicionado': 'aire',
              Estufa: 'estufa',
              Microondas: 'microondas',
            }

            const mappedType = typeMap[currentSuggestion.type]
            if (mappedType) {
              tipoElectrodomestico.value = mappedType
              tipoElectrodomestico.dispatchEvent(
                new Event('change', { bubbles: true })
              )
            }
          }

          if (descripcion) {
            descripcion.value = currentSuggestion.description
            descripcion.dispatchEvent(new Event('input', { bubbles: true }))
          }

          alert(
            '¡Formulario pre-llenado con la información de nuestra conversación! 🎉'
          )
        }, 1000)
      }
    }
  }

  // Chat minimizado - solo botón flotante
  if (!isOpen) {
    if (hideTrigger) return null

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={className || "fixed bottom-16 right-6 z-50"}>
      <Card
        className={`w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[420px]'
        }`}
      >
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">
                Asistente IA TecnoCity
              </CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
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
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Content - solo visible cuando no está minimizado */}
        {!isMinimized && (
          <>
            <CardContent className="p-0 flex flex-col h-[360px]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[240px]">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isBot ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
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

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Pensando...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Auto-fill suggestion */}
              {currentSuggestion && (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <p className="font-medium text-green-800">
                        Detecté tu problema:
                      </p>
                      <p className="text-green-700">
                        {currentSuggestion.type} • {currentSuggestion.urgency}
                      </p>
                    </div>
                    <Button
                      onClick={fillForm}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white text-xs"
                    >
                      Llenar Formulario
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t bg-white border-gray-200">
                <div className="flex items-center space-x-3">
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe tu problema..."
                    className="flex-1 text-sm h-10 border-2 focus:border-blue-500"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-blue-500 hover:bg-blue-600 h-10 px-4"
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
