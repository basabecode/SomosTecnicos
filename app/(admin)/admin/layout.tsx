/**
 * Layout del Panel Administrativo
 * Sidebar + Header + Contenido principal
 */

'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Home,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Bell,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Wrench,
  Calendar,
  FileText,
  Mail,
} from 'lucide-react'
import { NotificationBell } from '@/components/navigation/notification-bell'

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: SidebarItem[]
}

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
    badge: '12',
    children: [
      { title: 'Todas las Órdenes', href: '/admin/orders', icon: ShoppingCart },
      {
        title: 'Pendientes',
        href: '/admin/orders?status=pendiente',
        icon: Calendar,
      },
      {
        title: 'En Proceso',
        href: '/admin/orders?status=en_proceso',
        icon: Wrench,
      },
    ],
  },
  {
    title: 'Técnicos',
    href: '/admin/technicians',
    icon: Users,
    children: [
      { title: 'Todos los Técnicos', href: '/admin/technicians', icon: Users },
      { title: 'Solicitudes', href: '/admin/applications', icon: FileText },
      { title: 'Asignaciones', href: '/admin/assignments', icon: Calendar },
    ],
  },
  {
    title: 'Reportes',
    href: '/admin/reports',
    icon: BarChart3,
    children: [
      { title: 'Dashboard', href: '/admin/reports', icon: BarChart3 },
      { title: 'Órdenes', href: '/admin/reports/orders', icon: FileText },
      { title: 'Técnicos', href: '/admin/reports/technicians', icon: Users },
    ],
  },
  {
    title: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
  },
]

import Image from 'next/image'

// ... imports ...

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { logout } = useAuth()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className={`pb-12 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {/* Branding */}
          <div className="flex items-center space-x-2 px-2 mb-6">
            <Image
                src="/img_3d/somos_tecnicos.png"
                alt="SomosTécnicos"
                width={80}
                height={80}
                className="h-12 w-auto object-contain"
                priority
            />
          </div>

          {/* Botón para regresar al inicio */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#A50034] transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
            >
              <Home size={16} />
              <span>Volver al Inicio</span>
            </Link>
          </div>
          <div className="space-y-1">
            {sidebarItems.map(item => (
              <div key={item.title}>
                {/* ... existing map content ... */}
                {item.children ? (
                  <>
                    <Button
                      variant={
                        expandedItems.includes(item.title)
                          ? 'secondary'
                          : 'ghost'
                      }
                      className="w-full justify-start"
                      onClick={() => toggleExpanded(item.title)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${
                          expandedItems.includes(item.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                    {expandedItems.includes(item.title) && (
                      <div className="ml-4 space-y-1">
                        {item.children.map(child => (
                          <Button
                            key={child.href}
                            variant={
                              isActive(child.href) ? 'secondary' : 'ghost'
                            }
                            className="w-full justify-start text-sm"
                            asChild
                          >
                            <Link href={child.href}>
                              <child.icon className="mr-2 h-3 w-3" />
                              {child.title}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant={isActive(item.href) ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                )}
              </div>
            ))}

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Breadcrumb/Title */}
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">
          Panel de Administración
        </h1>
      </div>

      <div className="ml-auto">
        <NotificationBell />
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.nombre}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  // Si estamos en la página de login, no mostrar sidebar ni header
  if (pathname === '/admin/login') {
    return <div className="min-h-screen w-full">{children}</div>
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  )
}
