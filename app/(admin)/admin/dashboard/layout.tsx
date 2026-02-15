import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Administrativo - SomosTécnicos',
  description: 'Panel de control administrativo con estadísticas y gestión de órdenes de servicio',
}

// ✅ ISR Configuration - Regenerar cada 60 segundos
export const revalidate = 60

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}