/**
 * Layout para el área de Manager
 * Sidebar y navegación específica para managers
 */

'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Users,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Wrench,
  FileText,
  Clock,
} from 'lucide-react'

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/manager/dashboard',
    icon: Home,
  },
  {
    title: 'Técnicos',
    href: '/manager/technicians',
    icon: Users,
  },
  {
    title: 'Asignaciones',
    href: '/manager/assignments',
    icon: Calendar,
  },
  {
    title: 'Reportes',
    href: '/manager/reports',
    icon: BarChart3,
  },
  {
    title: 'Configuración',
    href: '/manager/settings',
    icon: Settings,
  },
]

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={className}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-4">
            <Wrench className="h-6 w-6 text-[#A50034]" />
            <h2 className="text-lg font-semibold">SomosTécnicos Manager</h2>
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
              <Button
                key={item.href}
                variant={pathname === item.href ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  pathname === item.href
                    ? 'bg-[#A50034] text-white hover:bg-[#8B0028]'
                    : 'hover:bg-muted'
                }`}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#A50034] rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {user?.nombre?.charAt(0)}
                    {user?.apellido?.charAt(0)}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <Badge variant="secondary" className="w-fit mt-1">
                  Manager
                </Badge>
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
      </div>
    </header>
  )
}

interface ManagerLayoutProps {
  children: React.ReactNode
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
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
