'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TermsModal } from '@/components/terms-modal'
import { FileText } from 'lucide-react'

export default function TermsModalTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full mt-8" size="lg">
        <FileText className="h-4 w-4 mr-2" />
        Ver documento completo
      </Button>
      <TermsModal open={isOpen} onOpenChange={setIsOpen} mode="view" />
    </>
  )
}
