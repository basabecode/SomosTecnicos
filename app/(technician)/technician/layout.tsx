/**
 * Layout del Portal del Técnico
 * Navegación y estructura para técnicos
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
import {
  Home,
  ClipboardList,
  History,
  User,
  Settings,
  LogOut,
  Wrench,
  Calendar,
} from 'lucide-react'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { NotificationBell } from '@/components/navigation/notification-bell'

// Navigation items for technician sidebar
const sidebarItems = [
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

// Mobile Navigation Items
const mobileNavItems = [
    { label: 'Inicio', href: '/technician/dashboard', icon: Home },
    { label: 'Asignaciones', href: '/technician/assignments', icon: ClipboardList },
    { label: 'Historial', href: '/technician/history', icon: History },
    { label: 'Config', href: '/technician/settings', icon: Settings },
]

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  // Datos del usuario o defaults
  const userData = {
    name: user ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Técnico',
    email: user?.email || 'tecnico@email.com',
    avatar: '/placeholder-tech.jpg',
    initials: user
      ? `${user.nombre?.[0] || ''}${user.apellido?.[0] || ''}`
      : 'T',
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
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <ProtectedRoute requiredRoles={['technician', 'technician_manager']}>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
            {/* Logo/Brand */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Portal Técnico
                </span>
              </div>
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
        <div className="flex flex-col flex-1 overflow-hidden pb-16 md:pb-0">
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-4 py-3 md:px-6">
            <div className="flex items-center justify-between h-10">
              {/* Mobile Brand */}
              <div className="flex items-center md:hidden">
                 <div className="bg-primary/10 p-1.5 rounded-lg mr-2">
                    <Wrench className="h-5 w-5 text-primary" />
                 </div>
                 <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SomosTécnicos Técnico
                 </span>
              </div>

               {/* Navigation Actions (Notifications + User Menu) */}
               <div className="flex items-center gap-2">
                 <NotificationBell />

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
                         onClick={() => router.push('/technician/settings')}
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
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto p-4 md:p-6 max-w-7xl">{children}</div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav items={mobileNavItems} />
      </div>
    </ProtectedRoute>
  )
}
