/**
 * Componente Unificado de Sidebar
 * Diseño estandarizado para todos los portales (Admin, Técnico, Cliente)
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Home, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

interface UnifiedSidebarProps {
  /** Nombre del usuario */
  userName: string
  /** Email o rol del usuario */
  userEmail: string
  /** Iniciales del usuario para el avatar */
  userInitials: string
  /** URL del avatar del usuario */
  userAvatar?: string
  /** Items de navegación */
  navItems: SidebarItem[]
  /** Función para cerrar sesión */
  onLogout: () => void
  /** Mostrar botón "Volver al Inicio" */
  showBackToHome?: boolean
  /** Clase adicional para el contenedor */
  className?: string
}

export function UnifiedSidebar({
  userName,
  userEmail,
  userInitials,
  userAvatar,
  navItems,
  onLogout,
  showBackToHome = true,
  className,
}: UnifiedSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full w-60 bg-white border-r border-gray-200',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-5 py-6">
        <Image
          src="/img-3d/somos_tecnicos.png"
          alt="SomosTécnicos"
          width={120}
          height={48}
          className="h-12 w-auto object-contain"
          priority
        />
      </div>

      {/* Perfil de Usuario */}
      <div className="flex items-center px-5 py-4 gap-3 bg-gray-50 mx-5 rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-white text-sm font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-600 truncate">{userEmail}</p>
        </div>
      </div>

      {/* Botón Volver al Inicio */}
      {showBackToHome && (
        <div className="mx-5 mt-4 mb-2 pb-3 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
          >
            <Home size={16} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 px-5 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gray-100 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-medium text-white bg-primary rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Cerrar Sesión */}
      <div className="p-5">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-5 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}
