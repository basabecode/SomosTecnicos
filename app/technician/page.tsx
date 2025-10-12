'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function TechnicianRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/technician/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner className="mx-auto mb-4" />
        <p className="text-gray-600">Redirigiendo al panel de técnico...</p>
      </div>
    </div>
  )
}
