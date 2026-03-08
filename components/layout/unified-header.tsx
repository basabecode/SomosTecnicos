/**
 * Componente Unificado de Header
 * Diseño estandarizado para todos los portales (Admin, Técnico, Cliente)
 */

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationBell } from '@/components/navigation/notification-bell'
import { User, Settings, LogOut, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeaderMenuItem {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'danger'
}

interface UnifiedHeaderProps {
  /** Título principal del header */
  title: string
  /** Subtítulo opcional */
  subtitle?: string
  /** Nombre del usuario */
  userName: string
  /** Email del usuario */
  userEmail: string
  /** Iniciales del usuario */
  userInitials: string
  /** URL del avatar */
  userAvatar?: string
  /** Items del menú de usuario */
  menuItems?: HeaderMenuItem[]
  /** Función de logout */
  onLogout: () => void
  /** Mostrar notificaciones */
  showNotifications?: boolean
  /** Clase adicional */
  className?: string
  /** Contenido adicional a la izquierda (ej. botón de menú) */
  leftContent?: React.ReactNode
  /** Contenido adicional a la derecha */
  rightContent?: React.ReactNode
}

export function UnifiedHeader({
  title,
  subtitle,
  userName,
  userEmail,
  userInitials,
  userAvatar,
  menuItems = [],
  onLogout,
  showNotifications = true,
  className,
  leftContent,
  rightContent,
}: UnifiedHeaderProps) {
  return (
    <header
      className={cn(
        // Mobile: 56px, Desktop: 64px
        // Added pt-safe for notched devices and min-h instead of h
        'flex items-center justify-between min-h-[3.5rem] md:min-h-[4rem] px-4 md:px-8 bg-white border-b border-gray-200 sticky top-0 z-40 pt-safe transition-all',
        className
      )}
    >
      {/* Lado Izquierdo - Título y Menú */}
      <div className="flex items-center min-w-0 flex-1 mr-2">
        {leftContent && <div className="mr-3 md:hidden">{leftContent}</div>}
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-gray-600 hidden md:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Lado Derecho - Acciones */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Contenido adicional personalizado */}
        {rightContent}

        {/* Notificaciones */}
        {showNotifications && <NotificationBell />}

        {/* Menú de Usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              // Mobile: 36px, Desktop: 40px (tap target mínimo 44px con padding)
              className="relative h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-gray-100 p-0"
            >
              <Avatar className="h-9 w-9 md:h-10 md:w-10">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary text-white text-xs md:text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {/* Información del Usuario */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-600 truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Items del Menú */}
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className={cn(
                  'min-h-11', // Tap target mínimo
                  item.variant === 'danger' && 'text-red-600 focus:text-red-600'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}

            {menuItems.length > 0 && <DropdownMenuSeparator />}

            {/* Cerrar Sesión */}
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 focus:text-red-600 min-h-11"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
