'use client'

import { useState } from 'react'
import { TermsModal } from './terms-modal'
import { FileText } from 'lucide-react'

interface TermsLinkProps {
  variant?: 'link' | 'button'
  className?: string
  showIcon?: boolean
}

export function TermsLink({
  variant = 'link',
  className = '',
  showIcon = true
}: TermsLinkProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        >
          {showIcon && <FileText className="h-4 w-4" />}
          <span>Términos y Condiciones</span>
        </button>
        <TermsModal
          open={isOpen}
          onOpenChange={setIsOpen}
          mode="view"
        />
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`text-sm hover:underline inline-flex items-center gap-1 ${className}`}
      >
        {showIcon && <FileText className="h-3 w-3" />}
        Términos y Condiciones
      </button>
      <TermsModal
        open={isOpen}
        onOpenChange={setIsOpen}
        mode="view"
      />
    </>
  )
}
