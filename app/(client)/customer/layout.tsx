/**
 * Layout del Portal del Cliente
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
import { TermsLink } from '@/components/terms-link'
import {
  Home,
  ClipboardList,
  History,
  User,
  Settings,
  Shield,
  MessageSquare,
  Plus,
  Menu,
  FileText,
} from 'lucide-react'

// Items de navegación del sidebar
const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/customer/dashboard',
    icon: Home,
  },
  {
    title: 'Mis Servicios',
    href: '/customer/services',
    icon: ClipboardList,
  },
  {
    title: 'Solicitar Servicio',
    href: '/customer/request',
    icon: Plus,
  },
  {
    title: 'Historial',
    href: '/customer/history',
    icon: History,
  },
  {
    title: 'Garantías',
    href: '/customer/warranty',
    icon: Shield,
  },
  {
    title: 'Mensajes',
    href: '/customer/messages',
    icon: MessageSquare,
  },
  {
    title: 'Mi Perfil',
    href: '/customer/profile',
    icon: User,
  },
  {
    title: 'Configuración',
    href: '/customer/settings',
    icon: Settings,
  },
]

// Items para navegación móvil inferior
const mobileNavItems = [
  { label: 'Inicio', href: '/customer/dashboard', icon: Home },
  { label: 'Solicitar', href: '/customer/request', icon: Plus },
  { label: 'Historial', href: '/customer/history', icon: History },
  { label: 'Perfil', href: '/customer/profile', icon: User },
]

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Datos del usuario
  const userData = {
    name: user ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Usuario',
    email: user?.email || 'usuario@email.com',
    initials: user
      ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`
      : 'U',
    avatar: undefined,
  }

  // Items del menú del header
  const headerMenuItems: HeaderMenuItem[] = [
    {
      label: 'Mi Perfil',
      icon: User,
      onClick: () => router.push('/customer/profile'),
    },
    {
      label: 'Configuración',
      icon: Settings,
      onClick: () => router.push('/customer/settings'),
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
    <ProtectedRoute requiredRoles={['customer']}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden pb-16 md:pb-0">
          {/* Header */}
          <UnifiedHeader
            title="Portal Cliente"
            userName={userData.name}
            userEmail={userData.email}
            userInitials={userData.initials}
            userAvatar={userData.avatar}
            menuItems={headerMenuItems}
            onLogout={handleLogout}
            showNotifications={true}
            rightContent={
              <Button
                onClick={() => router.push('/customer/request')}
                className="hidden md:flex bg-[#991B1B] hover:bg-[#7F1D1D] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Solicitud
              </Button>
            }
          />

          {/* Mobile Menu Button */}
          <div className="md:hidden fixed top-4 left-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white shadow-md h-11 w-11">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[240px]">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

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
