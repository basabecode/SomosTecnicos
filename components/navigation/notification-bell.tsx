'use client'

import React, { useState } from 'react'
import { Bell, CheckCircle2, Inbox, RefreshCw, Trash2 } from 'lucide-react'
import { useNotifications } from '@/contexts/notification-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

import { useAuth } from '@/contexts/auth-context'

export function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications, clearReadNotifications } = useNotifications()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const historyLink = user?.role === 'technician' || user?.role === 'technician_manager'
    ? '/technician/notifications'
    : user?.role === 'customer'
      ? '/customer/notifications'
      : '/notifications'

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        // Marcar como leídas al cerrar el panel (no al abrir),
        // para que el usuario pueda ver cuáles son nuevas antes de que desaparezca el punto.
        if (!isOpen && unreadCount > 0) {
          markAllAsRead()
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative active-tap">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] flex items-center justify-center border-2 border-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-gray-100 rounded-xl overflow-hidden">
        <DropdownMenuLabel className="p-4 flex items-center justify-between bg-gray-50/50">
          <span className="font-bold text-gray-900">Notificaciones</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-gray-700"
              title="Actualizar notificaciones"
              onClick={(e) => {
                e.stopPropagation()
                fetchNotifications()
              }}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {notifications.some(n => n.read) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-red-600"
                title="Limpiar notificaciones leídas"
                onClick={(e) => {
                  e.stopPropagation()
                  clearReadNotifications()
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-primary hover:text-primary/80 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation()
                  markAllAsRead()
                }}
              >
                Marcar todo leído
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />

        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] p-6 text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <Inbox className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">No hay notificaciones</p>
              <p className="text-xs text-gray-500 mt-1">Te avisaremos cuando haya novedades importantes.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 transition-colors hover:bg-gray-50 relative group ${!notification.read ? 'bg-blue-50/30' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${
                      notification.tipo === 'assignment' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {notification.tipo === 'assignment' ? <CheckCircle2 className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-none ${!notification.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notification.asunto || 'Notificación del Sistema'}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {notification.mensaje}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                      </p>
                    </div>
                  </div>

                  {notification.metadata?.link && (
                    <Link
                      href={notification.metadata.link}
                      className="absolute inset-0"
                      onClick={() => {
                        setOpen(false)
                        !notification.read && markAsRead(notification.id)
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2 bg-gray-50/50">
               <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500 hover:text-gray-900" asChild>
                  <Link href={historyLink}>Ver todo el historial</Link>
               </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
