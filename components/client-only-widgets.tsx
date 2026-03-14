'use client'

/**
 * Client Component wrapper para widgets que requieren ssr:false.
 * next/dynamic con ssr:false sólo puede usarse en Client Components —
 * no en Server Components como app/(public)/page.tsx.
 */
import dynamic from 'next/dynamic'

const AiChat              = dynamic(() => import('@/components/ai-chat'),               { ssr: false })
const MobileOptimizations = dynamic(() => import('@/components/mobile-optimizations'),  { ssr: false })
const SitelinksNav        = dynamic(() => import('@/components/sitelinks-nav'),         { ssr: false })

export default function ClientOnlyWidgets() {
  return (
    <>
      <AiChat />
      <MobileOptimizations />
      <SitelinksNav />
    </>
  )
}
