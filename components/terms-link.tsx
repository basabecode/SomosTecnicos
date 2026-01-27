'use client'

import { useState } from 'react'
import { TermsModal } from './terms-modal'
import { FileText } from 'lucide-react'

interface TermsLinkProps {
  variant?: 'link' | 'button'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function TermsLink({
  variant = 'link',
  className = '',
  showIcon = true,
  children
}: TermsLinkProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultText = 'Términos y Condiciones'

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        >
          {showIcon && <FileText className="h-4 w-4" />}
          <span>{children || defaultText}</span>
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
        {children || defaultText}
      </button>
      <TermsModal
        open={isOpen}
        onOpenChange={setIsOpen}
        mode="view"
      />
    </>
  )
}
