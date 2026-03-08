/**
 * Sistema de Notificaciones Toast Simplificado
 * Notificaciones en tiempo real sin createPortal
 */

'use client'

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react'
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
  message?: string
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

// Valores por defecto
const defaultContext: NotificationContextType = {
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
  markAsRead: () => {},
}

// Contexto de notificaciones
const NotificationContext =
  createContext<NotificationContextType>(defaultContext)

// Hook para usar las notificaciones
export function useNotifications(): NotificationContextType {
  try {
    const context = useContext(NotificationContext)
    return context || defaultContext
  } catch {
    return defaultContext
  }
}

// Provider de notificaciones
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => {
    try {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        duration: notification.duration ?? 5000, // 5 segundos por defecto
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]) // Máximo 5 notificaciones

      // Auto-dismiss si tiene duración
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, newNotification.duration)
      }
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }

  const removeNotification = (id: string) => {
    try {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      )
    } catch (error) {
      console.error('Error removing notification:', error)
    }
  }

  const clearAllNotifications = () => {
    try {
      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  const markAsRead = (id: string) => {
    try {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
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

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950'
      case 'error':
        return 'bg-red-50 dark:bg-red-950'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-950'
    }
  }

  return (
    <Card
      className={`
        ${getBorderColor()} ${getBackgroundColor()}
        border-l-4 shadow-lg transition-all duration-300 transform
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
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {notification.title}
              </h4>
              <div className="flex items-center space-x-2">
                {/* Icono de categoría */}
                {getCategoryIcon() && (
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon()}
                  </Badge>
                )}
                {/* Botón cerrar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Mensaje */}
            {notification.message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {notification.message}
              </p>
            )}

            {/* Timestamp */}
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Funciones de utilidad para notificaciones comunes
export const showSuccessNotification = (
  title: string,
  message?: string,
  addNotification?: (notif: Omit<Notification, 'id' | 'timestamp'>) => void
) => {
  if (addNotification) {
    addNotification({
      type: 'success',
      title,
      message,
      category: 'system',
    })
  }
}

export const showErrorNotification = (
  title: string,
  message?: string,
  addNotification?: (notif: Omit<Notification, 'id' | 'timestamp'>) => void
) => {
  if (addNotification) {
    addNotification({
      type: 'error',
      title,
      message,
      category: 'system',
      duration: 8000, // Error notifications stay longer
    })
  }
}

export const showInfoNotification = (
  title: string,
  message?: string,
  addNotification?: (notif: Omit<Notification, 'id' | 'timestamp'>) => void
) => {
  if (addNotification) {
    addNotification({
      type: 'info',
      title,
      message,
      category: 'system',
    })
  }
}

export const showWarningNotification = (
  title: string,
  message?: string,
  addNotification?: (notif: Omit<Notification, 'id' | 'timestamp'>) => void
) => {
  if (addNotification) {
    addNotification({
      type: 'warning',
      title,
      message,
      category: 'system',
      duration: 7000,
    })
  }
}
