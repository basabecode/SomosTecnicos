'use client'

import React from 'react'
import { NotificationList } from '@/components/notifications/notification-list'
import { History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TechnicianNotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationList
        title="Mis Notificaciones"
        description="Alertas de nuevas asignaciones y cambios en tus servicios."
      />

      <div className="flex justify-center pt-4">
         <Button variant="ghost" size="sm" className="text-gray-400 text-xs gap-2" asChild>
            <Link href="/technician/dashboard">
               <History className="h-3 w-3" />
               Volver al Dashboard
            </Link>
         </Button>
      </div>
    </div>
  )
}
