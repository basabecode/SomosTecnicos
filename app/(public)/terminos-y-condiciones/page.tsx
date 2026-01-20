'use client'

import { useState } from 'react'
import { TermsModal } from '@/components/terms-modal'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600">
            Lea nuestros términos y condiciones de uso de la plataforma
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="w-full"
          size="lg"
        >
          Ver Términos y Condiciones Completos
        </Button>

        <TermsModal
          open={isOpen}
          onOpenChange={setIsOpen}
          mode="view"
        />
      </div>
    </div>
  )
}
