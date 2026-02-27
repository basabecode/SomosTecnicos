'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle, X, Bot, LogIn } from 'lucide-react'
import Link from 'next/link'

/**
 * Componentes Mobile Optimizados
 * - Botón de llamada sticky (DESHABILITADO - puede reactivarse en el futuro)
 * - Chatbot flotante mejorado
 * - Accesos rápidos mobile
 */

// ============================================================================
// DESHABILITADO TEMPORALMENTE - Puede reactivarse en el futuro
// ============================================================================
/*
export function StickyCallButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar después de scroll inicial
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const callNow = () => {
    window.location.href = 'tel:+573001234567'
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={callNow}
      className="fixed bottom-4 right-4 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-2xl animate-pulse md:hidden"
      size="lg"
    >
      <Phone className="w-6 h-6" />
    </Button>
  )
}
*/

export function MobileChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToForm = () => {
    const element = document.getElementById('formulario')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const openWhatsApp = () => {
    window.open(
      'https://wa.me/573003094854?text=Hola%2C%20necesito%20servicio%20t%C3%A9cnico',
      '_blank'
    )
  }

  return (
    <>
      {/* Botón principal flotante */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-[#A50034] hover:bg-[#E74C3C] text-white rounded-full p-4 shadow-2xl md:hidden"
        size="lg"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Panel de opciones */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 md:hidden animate-in slide-in-from-bottom-2 w-64">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#2C3E50] mb-3">
              ¿Cómo te ayudamos?
            </p>

            <Button
              onClick={scrollToForm}
              className="w-full bg-[#A50034] hover:bg-[#E74C3C] text-white justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Solicitar Servicio
            </Button>

            <Button
              onClick={() => {
                const event = new CustomEvent('openAIChat', { detail: { fromHero: false } })
                window.dispatchEvent(event)
                setIsOpen(false)
              }}
              variant="outline"
              className="w-full border-cyan-500 text-cyan-600 hover:bg-cyan-50 justify-start"
            >
              <Bot className="w-4 h-4 mr-2" />
              Asistente IA
            </Button>

            {/* Nuevo botón: Chat en el Portal */}
            <Link href="/login" className="w-full block">
              <Button
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 justify-start"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">Chat en el Portal</div>
                  <div className="text-xs text-gray-500">Inicia sesión para hablar</div>
                </div>
              </Button>
            </Link>

            <Button
              onClick={openWhatsApp}
              variant="outline"
              className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default function MobileOptimizations() {
  return (
    <>
      {/* StickyCallButton deshabilitado temporalmente */}
      {/* <StickyCallButton /> */}
      <MobileChatWidget />
    </>
  )
}
