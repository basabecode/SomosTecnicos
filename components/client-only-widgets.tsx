'use client'

/**
 * Client Component wrapper para widgets que requieren ssr:false.
 * next/dynamic con ssr:false sólo puede usarse en Client Components —
 * no en Server Components como app/(public)/page.tsx.
 *
 * Los widgets se montan DESPUÉS del evento 'load' para no bloquear
 * el hilo principal durante LCP/FID → reduce TBT en mobile.
 */
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const AiChat              = dynamic(() => import('@/components/ai-chat'),               { ssr: false })
const MobileOptimizations = dynamic(() => import('@/components/mobile-optimizations'),  { ssr: false })
const SitelinksNav        = dynamic(() => import('@/components/sitelinks-nav'),         { ssr: false })

export default function ClientOnlyWidgets() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoaded(true)
    } else {
      const handler = () => setLoaded(true)
      window.addEventListener('load', handler, { once: true })
      return () => window.removeEventListener('load', handler)
    }
  }, [])

  if (!loaded) return null

  return (
    <>
      <AiChat />
      <MobileOptimizations />
      <SitelinksNav />
    </>
  )
}
