"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, FileText } from "lucide-react"
import { useState } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
}

/**
 * Modal de éxito corporativo
 * Diseño refinado y profesional para confirmación de servicio
 */
export default function SuccessModal({ isOpen, onClose, orderNumber }: SuccessModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-xl bg-white">

        {/* Header Corporativo con Estado */}
        <div className="bg-primary p-6 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-white mb-3" strokeWidth={1.5} />
                <DialogTitle className="text-2xl font-semibold tracking-wide">Solicitud Exitosa</DialogTitle>
                <p className="text-white/80 text-sm mt-1">Hemos registrado su servicio correctamente</p>
            </div>
        </div>

        <div className="p-6 space-y-6">
            {/* Tarjeta de Orden */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Número de Orden</span>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">{orderNumber}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-red-50"
                        onClick={handleCopy}
                        title="Copiar número de orden"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded-full mt-0.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Confirmación enviada</p>
                        <p className="text-xs leading-relaxed mt-0.5">
                            Hemos enviado los detalles de la solicitud a su correo electrónico. Un técnico revisará su caso en breve.
                        </p>
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-1 gap-3 pt-2">
                <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-md font-medium h-11"
                    onClick={onClose}
                >
                    Entendido
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
