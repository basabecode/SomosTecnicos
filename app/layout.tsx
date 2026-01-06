import type React from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import { ClientAuthProvider } from '@/components/client-auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationProvider as InternalToastProvider } from '@/components/notifications/notification-system-simple'
import { NotificationProvider } from '@/contexts/notification-context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TecnoCity - Servicio Técnico de Electrodomésticos a Domicilio',
  description:
    'Reparación, instalación y mantenimiento profesional de electrodomésticos. Servicio rápido y garantizado en toda la ciudad.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <ClientAuthProvider>
          <NotificationProvider>
            <InternalToastProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </InternalToastProvider>
          </NotificationProvider>
        </ClientAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
