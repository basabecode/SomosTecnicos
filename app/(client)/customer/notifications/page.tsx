'use client'

import React from 'react'
import { NotificationList } from '@/components/notifications/notification-list'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CustomerNotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationList
        title="Mis Notificaciones"
        description="Información sobre el estado de tus servicios y avisos importantes."
      />

      <div className="flex justify-center pt-4">
         <Button variant="ghost" size="sm" className="text-gray-400 text-xs gap-2" asChild>
            <Link href="/customer/dashboard">
               <Home className="h-3 w-3" />
               Volver al Inicio
            </Link>
         </Button>
      </div>
    </div>
  )
}
