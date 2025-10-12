"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
}

/**
 * Modal de éxito al enviar solicitud
 * - Muestra número de orden generado
 * - Se cierra automáticamente
 */
export default function SuccessModal({ isOpen, onClose, orderNumber }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#27AE60] rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">¡Solicitud Enviada!</DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <p className="text-lg">Tu solicitud ha sido recibida exitosamente.</p>
            <div className="bg-[#F8F9FA] p-4 rounded-lg">
              <p className="text-sm text-[#7F8C8D] mb-1">Número de orden:</p>
              <p className="text-2xl font-bold text-[#A50034]">{orderNumber}</p>
            </div>
            <p className="text-sm text-[#7F8C8D]">
              Nos pondremos en contacto contigo pronto para confirmar tu servicio.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
