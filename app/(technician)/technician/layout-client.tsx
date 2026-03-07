/**
 * Layout del Portal del Técnico (Client Side)
 * Diseño unificado con componentes estandarizados
 */

'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/contexts/auth-context'
import { UnifiedSidebar, SidebarItem } from '@/components/layout/unified-sidebar'
import { UnifiedHeader, HeaderMenuItem } from '@/components/layout/unified-header'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { BottomNav } from '@/components/navigation/bottom-nav'
import {
  Home,
  ClipboardList,
  History,
  Settings,
  Calendar,
  Mail,
  Menu,
} from 'lucide-react'

// Items de navegación del sidebar
const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/technician/dashboard',
    icon: Home,
  },
  {
    title: 'Mis Asignaciones',
    href: '/technician/assignments',
    icon: ClipboardList,
  },
  {
    title: 'Mensajes',
    href: '/technician/messages',
    icon: Mail,
  },
  {
    title: 'Calendario',
    href: '/technician/schedule',
    icon: Calendar,
  },
  {
    title: 'Historial',
    href: '/technician/history',
    icon: History,
  },
  {
    title: 'Configuración',
    href: '/technician/settings',
    icon: Settings,
  },
]

// Items para navegación móvil inferior (4 acciones primarias; Configuración va en el menú del avatar)
const mobileNavItems = [
  { label: 'Inicio', href: '/technician/dashboard', icon: Home },
  { label: 'Asignaciones', href: '/technician/assignments', icon: ClipboardList },
  { label: 'Mensajes', href: '/technician/messages', icon: Mail },
  { label: 'Historial', href: '/technician/history', icon: History },
]

export default function TechnicianLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Título de página activa basado en pathname
  const activeItem = sidebarItems.find(
    item => pathname === item.href || pathname.startsWith(item.href + '/')
  )
  const pageTitle = activeItem?.title ?? 'Portal Técnico'

  // Datos del usuario
  const userData = {
    name: user ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Técnico',
    email: user?.email || 'tecnico@somostecnicos.com',
    initials: user
      ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`
      : 'T',
    avatar: undefined,
  }

  // Items del menú del header
  const headerMenuItems: HeaderMenuItem[] = [
    {
      label: 'Configuración',
      icon: Settings,
      onClick: () => router.push('/technician/settings'),
    },
  ]

  const handleLogout = async () => {
    await logout()
  }

  // Componente Sidebar para reutilizar en desktop y mobile
  const SidebarContent = () => (
    <UnifiedSidebar
      userName={userData.name}
      userEmail={userData.email}
      userInitials={userData.initials}
      userAvatar={userData.avatar}
      navItems={sidebarItems}
      onLogout={handleLogout}
      showBackToHome={true}
    />
  )

  return (
    <ProtectedRoute requiredRoles={['technician', 'technician_manager']}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden pb-16 md:pb-0">
          {/* Header */}
          <UnifiedHeader
            title={pageTitle}
            userName={userData.name}
            userEmail={userData.email}
            userInitials={userData.initials}
            userAvatar={userData.avatar}
            menuItems={headerMenuItems}
            onLogout={handleLogout}
            showNotifications={true}
            rightContent={undefined}
            leftContent={
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="-ml-3 h-10 w-10 text-gray-500 hover:text-gray-900">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-[240px]">
                    <SidebarContent />
                  </SheetContent>
                </Sheet>
              </div>
            }
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 pb-safe">
            <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav items={mobileNavItems} />
      </div>
    </ProtectedRoute>
  )
}
