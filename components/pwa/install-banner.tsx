'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Share, Plus } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'pwa-install-state'
const MIN_VISITS = 1
const SHOW_DELAY_MS = 2000

// ─────────────────────────────────────────────────────────
// Captura a nivel de módulo — antes de que React hidrate.
// Android Chrome dispara beforeinstallprompt muy temprano
// y lo perdemos si esperamos al useEffect del componente.
// ─────────────────────────────────────────────────────────
let _capturedPrompt: BeforeInstallPromptEvent | null = null

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    _capturedPrompt = e as BeforeInstallPromptEvent
  })
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (stored.dismissed || stored.installed) return

    const visits = (stored.visits || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, visits }))
    if (visits < MIN_VISITS) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())
    const alreadyInstalled = (navigator as Navigator & { standalone?: boolean }).standalone === true
    setIsIOS(ios)

    if (ios && !alreadyInstalled) {
      setTimeout(() => setShow(true), SHOW_DELAY_MS)
      return
    }

    // Usar el prompt capturado a nivel de módulo si ya llegó
    if (_capturedPrompt) {
      setDeferredPrompt(_capturedPrompt)
      setTimeout(() => setShow(true), SHOW_DELAY_MS)
      return
    }

    // Si aún no llegó, escuchar (puede pasar en recargas lentas)
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      _capturedPrompt = e as BeforeInstallPromptEvent
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShow(true), SHOW_DELAY_MS)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ installed: true }))
      setShow(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ installed: true }))
    }
    setShow(false)
    setDeferredPrompt(null)
    _capturedPrompt = null
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissed: true }))
    setShow(false)
    setShowIOSModal(false)
  }

  if (!show) return null

  // Bloque de logo reutilizable — pastilla con marca
  const LogoBadge = ({ size }: { size: 'sm' | 'md' }) => (
    <div className={`shrink-0 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden ${size === 'sm' ? 'h-11 w-24 p-1.5' : 'h-14 w-32 p-2'}`}>
      <div className="relative w-full h-full">
        <Image
          src="/img-3d/diseño-Logos-sinFondo.avif"
          alt="SomosTécnicos"
          fill
          className="object-contain object-center"
          sizes={size === 'sm' ? '96px' : '128px'}
        />
      </div>
    </div>
  )

  // iOS
  if (isIOS) {
    return (
      <>
        <div
          className="fixed bottom-20 left-4 right-4 z-40 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
            <LogoBadge size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Instalar SomosTécnicos</p>
              <p className="text-xs text-gray-500 mt-0.5">Agrega la app a tu pantalla de inicio</p>
            </div>
            <button onClick={() => setShowIOSModal(true)} className="shrink-0 min-h-11 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
              Cómo
            </button>
            <button onClick={handleDismiss} className="min-h-11 min-w-11 flex items-center justify-center text-gray-400" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showIOSModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:hidden animate-in fade-in duration-200" onClick={() => setShowIOSModal(false)}>
            <div className="bg-white rounded-t-3xl w-full px-6 pt-5 animate-in slide-in-from-bottom-4 duration-300" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }} onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
              <div className="flex items-center gap-3 mb-6">
                <LogoBadge size="md" />
                <div>
                  <p className="font-bold text-gray-900 font-display">SomosTécnicos</p>
                  <p className="text-xs text-gray-500">somostecnicos.com</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-4">Para instalar en tu iPhone:</p>
              <ol className="space-y-4 mb-6">
                {[
                  { icon: <Share className="w-4 h-4 text-blue-500" />, label: 'Toca el botón', detail: 'Compartir en Safari (flecha hacia arriba)' },
                  { icon: <Plus className="w-4 h-4 text-blue-500" />, label: 'Selecciona', detail: '"Agregar a pantalla de inicio"' },
                  { icon: <span className="text-blue-500 font-bold text-sm">✓</span>, label: 'Confirma', detail: 'Toca "Agregar" para finalizar' },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">{step.icon}</div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-900">{step.label} </span>
                      <span className="text-sm text-gray-500">{step.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <button onClick={handleDismiss} className="w-full min-h-11 text-sm text-gray-400">No mostrar de nuevo</button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Android / Chrome
  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
        <LogoBadge size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Instalar SomosTécnicos</p>
          <p className="text-xs text-gray-500 mt-0.5">Acceso rápido desde tu pantalla</p>
        </div>
        <button onClick={handleInstall} className="shrink-0 min-h-11 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
          Instalar
        </button>
        <button onClick={handleDismiss} className="min-h-11 min-w-11 flex items-center justify-center text-gray-400" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
