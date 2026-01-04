'use client'

import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle2, Inbox, Trash2 } from 'lucide-react'
import { useNotifications } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface NotificationListProps {
  title?: string
  description?: string
  limit?: number
}

export function NotificationList({ title, description, limit }: NotificationListProps) {
  const { notifications, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  ).slice(0, limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title || 'Notificaciones'}</h1>
          <p className="text-gray-500 text-sm mt-1">{description || 'Gestiona tus alertas y avisos del sistema.'}</p>
        </div>
        <div className="flex gap-2">
           <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={notifications.filter(n => !n.read).length === 0}
            className="hidden sm:flex items-center gap-2"
           >
             <CheckCircle2 className="h-4 w-4" />
             Marcar todo como leído
           </Button>
        </div>
      </div>

      <Card className="border-gray-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-0 border-b border-gray-100">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                filter === 'all' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas
              {filter === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                filter === 'unread' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              No leídas
              {notifications.filter(n => !n.read).length > 0 && (
                 <Badge className="ml-2 bg-[#A50034] text-white border-none h-5 px-1.5 min-w-[20px] justify-center">
                    {notifications.filter(n => !n.read).length}
                 </Badge>
              )}
              {filter === 'unread' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && notifications.length === 0 ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50/10">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-gray-100">
                <Inbox className="h-8 w-8 text-gray-200" />
              </div>
              <p className="text-gray-900 font-semibold text-sm">No hay nada por aquí</p>
              <p className="text-gray-400 text-xs mt-1">
                {filter === 'unread'
                  ? 'No tienes notificaciones pendientes de leer.'
                  : 'Tu historial de notificaciones está vacío.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 sm:p-6 transition-all hover:bg-gray-50/50 flex gap-4 group relative ${!n.read ? 'bg-[#A50034]/[0.02]' : ''}`}
                >
                  <div className={`mt-1 p-2.5 rounded-xl shadow-sm h-fit ${
                    n.tipo === 'assignment' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {n.tipo === 'assignment' ? <CheckCircle2 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm tracking-tight truncate pr-4 ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                        {n.asunto || 'Notificación del Sistema'}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap uppercase tracking-wider">
                        {format(new Date(n.createdAt), "d MMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-4 ${!n.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {n.mensaje}
                    </p>

                    <div className="flex items-center gap-3">
                       {!n.read && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 text-xs font-bold bg-white border border-gray-100 text-gray-900 hover:bg-gray-50 shadow-sm px-4"
                            onClick={() => markAsRead(n.id)}
                          >
                            Entendido
                          </Button>
                       )}
                       {n.metadata?.link && (
                          <Button
                            variant="default"
                            size="sm"
                            className="h-8 text-xs font-bold rounded-lg shadow-sm px-4 bg-primary text-white"
                            asChild
                          >
                            <Link href={n.metadata.link}>Ver detalle</Link>
                          </Button>
                       )}
                    </div>
                  </div>

                  {!n.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#A50034]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
