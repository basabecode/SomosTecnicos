import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { ClientAuthProvider } from '@/components/client-auth-provider'
import { NotificationProvider as InternalToastProvider } from '@/components/notifications/notification-system-simple'
import { NotificationProvider } from '@/contexts/notification-context'
import { Toaster } from '@/components/ui/toaster'
import { TermsEnforcer } from '@/components/terms-enforcer'
import { OfflineBanner } from '@/components/pwa/offline-banner'
import { InstallBanner } from '@/components/pwa/install-banner'
import './globals.css'

// Tipografía distintiva para SomosTécnicos
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// Viewport separado del metadata (Next.js 15 requiere export independiente)
// viewport-fit=cover es crítico para que la PWA ocupe pantalla completa en iOS con notch
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: '#a50034',
}

const envUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://somostecnicos.com'
const cleanBaseUrl = envUrl.replace(/^https?:\/\/(www\.)?/, 'https://')

export const metadata: Metadata = {
  metadataBase: new URL(cleanBaseUrl),
  alternates: {
    canonical: '/',
  },
  // PWA
  applicationName: 'SomosTécnicos',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SomosTécnicos',
  },
  formatDetection: {
    telephone: false,
  },
  title: {
    default: 'SomosTécnicos | Servicio Técnico a Domicilio en Cali',
    template: '%s | SomosTécnicos',
  },
  description:
    'Servicio técnico experto para electrodomésticos a domicilio. Reparación de neveras, lavadoras, secadoras y calentadores. Técnicos certificados, garantía y seguimiento en tiempo real.',
  keywords: [
    'servicio técnico',
    'reparación electrodomésticos',
    'mantenimiento neveras',
    'arreglo lavadoras',
    'técnico secadoras',
    'reparación calentadores',
    'instalación cámaras seguridad',
    'electricista domicilio',
    'bogotá',
    'cali',
    'somostecnicos',
    'técnicos certificados',
    'reparación a domicilio',
  ],
  authors: [{ name: 'SomosTécnicos Team', url: 'https://somostecnicos.com' }],
  creator: 'SomosTécnicos',
  publisher: 'SomosTécnicos',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://somostecnicos.com',
    siteName: 'SomosTécnicos',
    title: 'SomosTécnicos | Servicio Técnico a Domicilio',
    description:
      'Expertos en reparación de electrodomésticos con seguimiento en vivo. Confianza y rapidez en la puerta de tu hogar.',
    images: [
      {
        url: '/seo/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SomosTécnicos - Servicio Técnico Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SomosTécnicos | Servicio Técnico a Domicilio',
    description:
      'Reparación de electrodomésticos con seguimiento en tiempo real.',
    images: ['/seo/og-image.jpg'],
  },
  manifest: '/site.webmanifest',
  // Color de la barra del navegador / status bar en Android y PWA
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/img-3d/favicon-st-metalizado.avif', sizes: '1024x1024', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: 'geutOlRYLvqkZ5QpsYNSq0B7k0gXTOBSq-yot0RsDR8', // Placeholder for user to fill
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} font-body antialiased`}
        suppressHydrationWarning={true}
      >
        <OfflineBanner />
        <InstallBanner />
        <ClientAuthProvider>
          <NotificationProvider>
            <InternalToastProvider>
              <TermsEnforcer>
                <Suspense fallback={null}>{children}</Suspense>
              </TermsEnforcer>
            </InternalToastProvider>
          </NotificationProvider>
        </ClientAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}

