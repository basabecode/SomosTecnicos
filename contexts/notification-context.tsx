'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './auth-context'

interface Notification {
  id: number
  userId: string
  userType: string
  tipo: string
  asunto: string | null
  mensaje: string
  read: boolean
  createdAt: string
  metadata: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearReadNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

/**
 * Reproduce un doble-beep usando Web Audio API.
 * No requiere archivos de audio externos.
 * Solo funciona si el usuario ya interactuó con la página (política de autoplay del navegador).
 */
function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const playBeep = (startTime: number, freq: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18)
      osc.start(startTime)
      osc.stop(startTime + 0.18)
    }
    playBeep(ctx.currentTime, 440)         // primer tono (La)
    playBeep(ctx.currentTime + 0.22, 550)  // segundo tono (Do#)
  } catch {
    // El navegador bloqueó el audio — no hacer nada
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const result = await response.json()
        setNotifications(result.data.notifications)
        setUnreadCount(result.data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    try {
      const token = localStorage.getItem('accessToken')
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        // Si falló, re-sincronizar desde servidor para estado correcto
        await fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      await fetchNotifications()
    }
  }

  const clearReadNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch('/api/notifications/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        // Remover notificaciones leídas del estado local
        setNotifications(prev => prev.filter(n => !n.read))
      }
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  // SSE: conexión persistente en lugar de polling cada 60s
  useEffect(() => {
    if (!isAuthenticated) return

    // Carga inicial para mostrar notificaciones previas al conectar SSE
    fetchNotifications()

    const token = localStorage.getItem('accessToken')
    if (!token) return

    const connectSSE = () => {
      // Cerrar conexión anterior si existe
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      const es = new EventSource(`/api/notifications/stream?token=${encodeURIComponent(token)}`)
      eventSourceRef.current = es

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === 'connected') {
            // Sincronizar el contador de no leídas con el estado real del servidor
            setUnreadCount(data.unreadCount ?? 0)
          } else if (data.type === 'new_notifications' && Array.isArray(data.notifications)) {
            // Agregar las nuevas notificaciones al inicio de la lista
            setNotifications(prev => {
              const existingIds = new Set(prev.map(n => n.id))
              const newOnes = data.notifications.filter((n: Notification) => !existingIds.has(n.id))
              return newOnes.length > 0 ? [...newOnes, ...prev] : prev
            })
            setUnreadCount(prev => prev + (data.count ?? data.notifications.length))
            playNotificationSound()
          }
        } catch {
          // Evento malformado — ignorar
        }
      }

      es.onerror = () => {
        // EventSource reconecta automáticamente, pero cerramos y reconectamos
        // manualmente para controlar el backoff si es necesario
        es.close()
        eventSourceRef.current = null
        // Intentar reconexión después de 10 segundos
        setTimeout(() => {
          if (isAuthenticated) connectSSE()
        }, 10000)
      }
    }

    connectSSE()

    return () => {
      eventSourceRef.current?.close()
      eventSourceRef.current = null
    }
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearReadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
