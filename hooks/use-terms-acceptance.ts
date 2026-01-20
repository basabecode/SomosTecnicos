'use client'

import { useState, useEffect } from 'react'
import { TERMS_VERSION } from '@/lib/terms-and-conditions'

const TERMS_STORAGE_KEY = 'somostecnicos_terms_accepted'

interface TermsAcceptance {
  version: string
  acceptedAt: string
  userId?: string
}

export function useTermsAcceptance(userId?: string) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkTermsAcceptance()
  }, [userId])

  const checkTermsAcceptance = () => {
    try {
      const stored = localStorage.getItem(TERMS_STORAGE_KEY)

      if (!stored) {
        setHasAcceptedTerms(false)
        setIsLoading(false)
        return
      }

      const acceptance: TermsAcceptance = JSON.parse(stored)

      // Verificar si la versión aceptada es la actual
      const isCurrentVersion = acceptance.version === TERMS_VERSION

      // Si hay userId, verificar que coincida
      const isCorrectUser = !userId || acceptance.userId === userId

      setHasAcceptedTerms(isCurrentVersion && isCorrectUser)
      setIsLoading(false)
    } catch (error) {
      console.error('Error checking terms acceptance:', error)
      setHasAcceptedTerms(false)
      setIsLoading(false)
    }
  }

  const acceptTerms = (userId?: string, userType?: 'customer' | 'technician' | 'admin') => {
    const acceptance: TermsAcceptance = {
      version: TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
      userId
    }

    try {
      localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(acceptance))
      setHasAcceptedTerms(true)

      // También guardar en el backend si hay userId
      if (userId && userType) {
        saveTermsAcceptanceToBackend(userId, userType, acceptance)
      }
    } catch (error) {
      console.error('Error saving terms acceptance:', error)
    }
  }

  const revokeTerms = () => {
    try {
      localStorage.removeItem(TERMS_STORAGE_KEY)
      setHasAcceptedTerms(false)
    } catch (error) {
      console.error('Error revoking terms:', error)
    }
  }

  return {
    hasAcceptedTerms,
    isLoading,
    acceptTerms,
    revokeTerms,
    checkTermsAcceptance
  }
}

// Función para guardar en el backend (implementar según tu API)
async function saveTermsAcceptanceToBackend(userId: string, userType: string, acceptance: TermsAcceptance) {
  try {
    await fetch('/api/users/terms-acceptance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userType,
        ...acceptance
      })
    })
  } catch (error) {
    console.error('Error saving terms to backend:', error)
    // No lanzar error para no bloquear el flujo del usuario
  }
}
