/**
 * Layout del Panel Administrativo (Client Side)
 * Diseño unificado con componentes estandarizados
 */

'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { UnifiedSidebar, SidebarItem } from '@/components/layout/unified-sidebar'
import { UnifiedHeader, HeaderMenuItem } from '@/components/layout/unified-header'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Home,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Menu,
  User,
  Wrench,
  Mail,
  FileText,
} from 'lucide-react'

// Items de navegación del sidebar
const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
  },
  {
    title: 'Mensajes',
    href: '/admin/messages',
    icon: Mail,
  },
  {
    title: 'Órdenes',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Clientes',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Técnicos',
    href: '/admin/technicians',
    icon: Wrench,
  },
  {
    title: 'Solicitudes',
    href: '/admin/applications',
    icon: FileText,
  },
  {
    title: 'Reportes',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [navItems, setNavItems] = useState<SidebarItem[]>(sidebarItems)

  // Fetch stats for badges
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const response = await fetch('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          const pendingOrders = data.data?.ordenes?.pendientes || 0
          const pendingApplications = data.data?.alertas?.technicianApplicationsPending || 0

          setNavItems((prev: SidebarItem[]) => prev.map((item: SidebarItem) => {
            if (item.href === '/admin/orders') {
              return { ...item, badge: pendingOrders }
            }
            if (item.href === '/admin/applications') {
              return { ...item, badge: pendingApplications }
            }
            return item
          }))
        }
      } catch (error) {
        console.error('Error fetching stats for sidebar:', error)
      }
    }

    fetchStats()

    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  // Si estamos en la página de login, no mostrar sidebar ni header
  if (pathname === '/admin/login') {
    return <div className="min-h-screen w-full">{children}</div>
  }

  // Datos del usuario
  const userData = {
    name: user ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Administrador',
    email: user?.email || 'admin@somostecnicos.com',
    initials: user
      ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`
      : 'AD',
    avatar: undefined,
  }

  // Items del menú del header
  const headerMenuItems: HeaderMenuItem[] = [
    {
      label: 'Perfil',
      icon: User,
      onClick: () => router.push('/admin/profile'),
    },
    {
      label: 'Configuración',
      icon: Settings,
      onClick: () => router.push('/admin/settings'),
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
      navItems={navItems}
      onLogout={handleLogout}
      showBackToHome={true}
    />
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <UnifiedHeader
          title="Panel de Administración"
          subtitle="Sistema Operativo"
          userName={userData.name}
          userEmail={userData.email}
          userInitials={userData.initials}
          userAvatar={userData.avatar}
          menuItems={headerMenuItems}
          onLogout={handleLogout}
          showNotifications={true}
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
    </div>
  )
}
