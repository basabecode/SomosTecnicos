'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  TERMS_CONTENT,
  TERMS_VERSION,
  TERMS_LAST_UPDATED,
  PRIVACY_HIGHLIGHTS
} from '@/lib/terms-and-conditions'
import { FileText, AlertCircle, Shield, Scale } from 'lucide-react'

interface TermsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requireAcceptance?: boolean
  onAccept?: () => void
  onDecline?: () => void
  mode?: 'view' | 'accept'
}

export function TermsModal({
  open,
  onOpenChange,
  requireAcceptance = false,
  onAccept,
  onDecline,
  mode = 'view'
}: TermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [showScrollWarning, setShowScrollWarning] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Verificar si el contenido cabe sin scroll o si ya está al final
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current
        // Si no hay scroll o ya está al final
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50

        if (isAtBottom) {
          setHasScrolledToBottom(true)
        }
      }
    }

    if (open) {
      // Pequeño delay para asegurar que el contenido se renderizó
      const timer = setTimeout(checkScroll, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
      setShowScrollWarning(false)
    }
  }

  const handleAcceptClick = () => {
    // Verificación de seguridad adicional al hacer clic
    if (scrollRef.current) {
         const { scrollHeight, clientHeight, scrollTop } = scrollRef.current
         if (scrollHeight - scrollTop <= clientHeight + 50) {
             setHasScrolledToBottom(true) // Asegurar estado
         }
    }

    if (!hasScrolledToBottom && requireAcceptance) {
      // Doble chequeo por si el estado no se actualizó pero sí está abajo
      if (scrollRef.current && (scrollRef.current.scrollHeight - scrollRef.current.scrollTop <= scrollRef.current.clientHeight + 50)) {
           // Permitir pasar si técnicamente ya está abajo
      } else {
          setShowScrollWarning(true)
          return
      }
    }

    if (!hasAccepted && requireAcceptance) {
      setShowScrollWarning(true)
      return
    }

    onAccept?.()
    onOpenChange(false)
  }

  const handleDeclineClick = () => {
    onDecline?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {TERMS_CONTENT.introduction.title}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Versión {TERMS_VERSION} • Última actualización: {new Date(TERMS_LAST_UPDATED).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Highlights importantes */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-900">
            <strong className="font-semibold">Puntos clave:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {PRIVACY_HIGHLIGHTS.slice(0, 3).map((highlight, index) => (
                <li key={index} className="text-xs">{highlight}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        {/* Contenido scrolleable */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 border rounded-md p-4 bg-muted/10 h-full"
          onScroll={handleScroll}
        >
          <div className="space-y-6 text-sm">
            {/* Introducción */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {TERMS_CONTENT.introduction.content}
              </p>
            </div>

            {/* Secciones */}
            {TERMS_CONTENT.sections.map((section) => (
              <div key={section.id} className="border-l-4 border-primary/20 pl-4">
                <h3 className="font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {section.title}
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Aceptación */}
            {requireAcceptance && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-base text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {TERMS_CONTENT.acceptance.title}
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                  {TERMS_CONTENT.acceptance.content}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Warning si no ha scrolleado */}
        {showScrollWarning && !hasScrolledToBottom && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Por favor, lea todo el documento desplazándose hasta el final antes de aceptar.
            </AlertDescription>
          </Alert>
        )}

        {/* Warning si no ha marcado checkbox */}
        {showScrollWarning && hasScrolledToBottom && !hasAccepted && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Debe marcar la casilla de aceptación para continuar.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-3">
          {requireAcceptance && (
            <div className="flex items-start space-x-2 w-full sm:mr-auto">
              <Checkbox
                id="accept-terms"
                checked={hasAccepted}
                onCheckedChange={(checked) => setHasAccepted(checked as boolean)}
                disabled={!hasScrolledToBottom}
              />
              <label
                htmlFor="accept-terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                He leído y acepto los Términos y Condiciones
                {!hasScrolledToBottom && (
                  <span className="text-amber-600 ml-1">(Lea todo el documento primero)</span>
                )}
              </label>
            </div>
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            {mode === 'accept' && onDecline && (
              <Button
                variant="outline"
                onClick={handleDeclineClick}
                className="flex-1 sm:flex-none"
              >
                Rechazar
              </Button>
            )}

            {mode === 'view' && (
              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none"
              >
                Cerrar
              </Button>
            )}

            {mode === 'accept' && onAccept && (
              <Button
                onClick={handleAcceptClick}
                disabled={requireAcceptance && (!hasScrolledToBottom || !hasAccepted)}
                className="flex-1 sm:flex-none"
              >
                Aceptar y Continuar
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
