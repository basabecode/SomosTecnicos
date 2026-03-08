/**
 * Sistema de Notificaciones Toast
 * Notificaciones en tiempo real para cambios de estado
 */

'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Bell,
  Clock,
  User,
  Wrench,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Tipos de notificación
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number // en ms, 0 = no auto-dismiss
  timestamp: Date
  category?: 'assignment' | 'order' | 'technician' | 'system'
  data?: Record<string, unknown>
  read?: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  markAsRead: (id: string) => void
}

// Contexto de notificaciones
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
  markAsRead: () => {},
})

// Hook para usar las notificaciones
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    // Devolver valores por defecto si no hay contexto
    return {
      notifications: [],
      addNotification: () => {},
      removeNotification: () => {},
      clearAllNotifications: () => {},
      markAsRead: () => {},
    }
  }
  return context
}

// Provider de notificaciones
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? 5000, // 5 segundos por defecto
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-dismiss si tiene duración
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        markAsRead,
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

// Contenedor de notificaciones toast
function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full">
      {notifications.slice(0, 5).map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}

// Componente individual de toast
function NotificationToast({
  notification,
  onClose,
}: {
  notification: Notification
  onClose: () => void
}) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Esperar a que termine la animación
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'assignment':
        return <Wrench className="h-4 w-4" />
      case 'technician':
        return <User className="h-4 w-4" />
      case 'order':
        return <Bell className="h-4 w-4" />
      default:
        return null
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-green-500'
      case 'error':
        return 'border-l-red-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'info':
      default:
        return 'border-l-blue-500'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card
      className={`
        ${getBorderColor()} border-l-4 shadow-lg
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icono principal */}
          <div className="shrink-0 mt-0.5">{getIcon()}</div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </p>
                {notification.category && (
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon()}
                    <span className="ml-1 capitalize">
                      {notification.category}
                    </span>
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-gray-700 mb-2">{notification.message}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(notification.timestamp)}
              </div>

              {notification.action && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={notification.action.onClick}
                  className="text-xs h-7"
                >
                  {notification.action.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Funciones helper para crear notificaciones comunes
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications()

  return {
    // Notificaciones de técnicos
    technicianCreated: (technicianName: string) => {
      addNotification({
        type: 'success',
        category: 'technician',
        title: 'Técnico Creado',
        message: `${technicianName} ha sido registrado exitosamente`,
        duration: 4000,
      })
    },

    technicianUpdated: (technicianName: string) => {
      addNotification({
        type: 'success',
        category: 'technician',
        title: 'Técnico Actualizado',
        message: `La información de ${technicianName} ha sido actualizada`,
        duration: 4000,
      })
    },

    technicianAssigned: (technicianName: string, orderNumber: string) => {
      addNotification({
        type: 'info',
        category: 'assignment',
        title: 'Nueva Asignación',
        message: `${technicianName} ha sido asignado a la orden ${orderNumber}`,
        action: {
          label: 'Ver Orden',
          onClick: () =>
            (window.location.href = `/admin/orders/${orderNumber}`),
        },
        duration: 6000,
      })
    },

    // Notificaciones de órdenes
    orderStatusChanged: (orderNumber: string, newStatus: string) => {
      addNotification({
        type: 'info',
        category: 'order',
        title: 'Estado de Orden Actualizado',
        message: `La orden ${orderNumber} cambió a ${newStatus}`,
        action: {
          label: 'Ver Orden',
          onClick: () =>
            (window.location.href = `/admin/orders/${orderNumber}`),
        },
        duration: 5000,
      })
    },

    orderCompleted: (orderNumber: string) => {
      addNotification({
        type: 'success',
        category: 'order',
        title: 'Orden Completada',
        message: `La orden ${orderNumber} ha sido completada exitosamente`,
        duration: 4000,
      })
    },

    // Notificaciones de sistema
    systemError: (message: string) => {
      addNotification({
        type: 'error',
        category: 'system',
        title: 'Error del Sistema',
        message,
        duration: 8000,
      })
    },

    connectionLost: () => {
      addNotification({
        type: 'warning',
        category: 'system',
        title: 'Conexión Perdida',
        message: 'Se ha perdido la conexión con el servidor. Reintentando...',
        duration: 0, // No auto-dismiss
      })
    },

    connectionRestored: () => {
      addNotification({
        type: 'success',
        category: 'system',
        title: 'Conexión Restaurada',
        message: 'La conexión con el servidor ha sido restaurada',
        duration: 3000,
      })
    },
  }
}
