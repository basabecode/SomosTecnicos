'use client'

import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle2, History, Inbox, Trash2 } from 'lucide-react'
import { useNotifications } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  )

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Centro de Notificaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Mantente al tanto de tus servicios y tareas asignadas.</p>
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

      <Card className="border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 p-0">
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
                 <Badge className="ml-2 bg-primary text-white border-none h-5 px-1.5 min-w-[20px] justify-center">
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
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Inbox className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold">No hay notificaciones</p>
              <p className="text-gray-500 text-sm max-w-xs mt-2">
                {filter === 'unread'
                  ? '¡Estás al día! No tienes notificaciones sin leer.'
                  : 'Aún no has recibido ninguna notificación.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-6 transition-all hover:bg-gray-50 flex gap-4 group relative ${!n.read ? 'bg-blue-50/20' : ''}`}
                >
                  <div className={`mt-1 p-2.5 rounded-xl shadow-sm ${
                    n.tipo === 'assignment' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {n.tipo === 'assignment' ? <CheckCircle2 className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm tracking-tight ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {n.asunto || 'Notificación del Sistema'}
                      </h3>
                      <span className="text-[11px] font-medium text-gray-400">
                        {format(new Date(n.createdAt), "d 'de' MMMM, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">
                      {n.mensaje}
                    </p>

                    <div className="flex items-center gap-3">
                       {!n.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 p-0 sm:px-3"
                            onClick={() => markAsRead(n.id)}
                          >
                            Marcar como leída
                          </Button>
                       )}
                       {n.metadata?.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-bold rounded-lg border-gray-200"
                            asChild
                          >
                            <Link href={n.metadata.link}>Ver detalle</Link>
                          </Button>
                       )}
                    </div>
                  </div>

                  {!n.read && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden group-hover:block">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
         <Button variant="ghost" size="sm" className="text-gray-400 text-xs gap-2" asChild>
            <Link href="/">
               <History className="h-3 w-3" />
               Volver al inicio
            </Link>
         </Button>
      </div>
    </div>
  )
}
