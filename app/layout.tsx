import type React from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { ClientAuthProvider } from '@/components/client-auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationProvider as InternalToastProvider } from '@/components/notifications/notification-system-simple'
import { NotificationProvider } from '@/contexts/notification-context'
import { Toaster } from '@/components/ui/toaster'
import { TermsEnforcer } from '@/components/terms-enforcer'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://m'), // Set base URL for metadata resolution
  title: {
    default: 'SomosTécnicos | Servicio Técnico a Domicilio',
    template: '%s | SomosTécnicos',
  },
  description:
    'Reparación experta de electrodomésticos a domicilio con SomosTécnicos. Rapidez, confianza y seguimiento en tiempo real de tu servicio. ¡Calidad garantizada hoy!',
  keywords: ['servicio técnico', 'reparación electrodomésticos', 'domicilio', 'seguimiento en tiempo real', 'técnicos certificados'],
  authors: [{ name: 'SomosTécnicos' }],
  creator: 'SomosTécnicos',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://somostecnicos.com',
    siteName: 'SomosTécnicos',
    title: 'SomosTécnicos | Servicio Técnico a Domicilio',
    description: 'Expertos en reparación de electrodomésticos con seguimiento en vivo. Confianza y rapidez en la puerta de tu hogar.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SomosTécnicos - Servicio Técnico Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SomosTécnicos | Servicio Técnico a Domicilio',
    description: 'Reparación de electrodomésticos con seguimiento en tiempo real.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/img-3d/logo_modificado.jpeg',
    shortcut: '/img-3d/logo_modificado.jpeg',
    apple: '/img-3d/logo_modificado.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${plusJakartaSans.variable} font-body antialiased`} suppressHydrationWarning={true}>
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
