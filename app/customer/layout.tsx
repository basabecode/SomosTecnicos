/**
 * Layout del Portal del Cliente
 * Navegación y estructura para clientes
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ProtectedRoute, useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Home,
  ClipboardList,
  History,
  User,
  Settings,
  Menu,
  LogOut,
  Shield,
  MessageSquare,
  Wrench,
  Plus,
} from 'lucide-react'

// Navigation items for customer sidebar
const sidebarItems = [
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

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  // Datos del usuario o defaults
  const userData = {
    name: user ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Usuario',
    email: user?.email || 'usuario@email.com',
    avatar: '/placeholder-user.jpg',
    initials: user
      ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`
      : 'U',
  }

  const NavItems = () => (
    <>
      {sidebarItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <ProtectedRoute requiredRoles={['customer']}>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
            {/* Logo/Brand */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Portal Cliente
                </span>
              </div>
            </div>

            {/* Botón para regresar al inicio */}
            <div className="px-4 mt-4 mb-2 pb-3 border-b border-gray-200">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <Home size={16} />
                <span>Volver al Inicio</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="flex items-center px-4 py-3 mt-6 bg-gray-50 mx-4 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium truncate">{userData.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userData.email}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-4 space-y-1">
              <NavItems />
            </nav>

            {/* Logout Button */}
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="flex flex-col h-full bg-white">
                      {/* Mobile Logo */}
                      <div className="flex items-center px-4 py-6 border-b">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-6 w-6 text-blue-600" />
                          <span className="text-lg font-bold text-gray-900">
                            Portal Cliente
                          </span>
                        </div>
                      </div>

                      {/* Mobile User Info */}
                      <div className="flex items-center px-4 py-3 bg-gray-50 mx-4 mt-4 rounded-lg">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={userData.avatar}
                            alt={userData.name}
                          />
                          <AvatarFallback>{userData.initials}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {userData.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {userData.email}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Navigation */}
                      <nav className="flex-1 px-4 py-4 space-y-1">
                        <NavItems />
                      </nav>

                      {/* Mobile Logout */}
                      <div className="p-4 border-t">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userData.avatar}
                          alt={userData.name}
                        />
                        <AvatarFallback>{userData.initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{userData.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push('/customer/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push('/customer/settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto p-6 max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
