/**
 * Contexto de Autenticación
 * Maneja el estado global de autenticación en el frontend
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logger, logAuth } from '@/lib/logger'

// =============================================
// TIPOS
// =============================================

interface User {
  id: number
  username: string
  email: string
  nombre: string
  apellido?: string
  role: string
  activo: boolean
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  isAuthenticated: boolean
}

// =============================================
// CONTEXTO
// =============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =============================================
// HOOK
// =============================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// =============================================
// PROVIDER
// =============================================

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // =============================================
  // FUNCIONES DE AUTENTICACIÓN
  // =============================================

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      logger.info('Login attempt initiated', {
        component: 'auth-context',
        userId: email,
        action: 'login_start',
      })

      // Usar API unificada que detecta automáticamente el tipo
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.accessToken)
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        setUser(data.user)

        // Log seguro de autenticación exitosa
        logAuth.login(email, true, data.user.role)
        logger.info('User authenticated successfully', {
          component: 'auth-context',
          userId: data.user.id,
          role: data.user.role,
          action: 'login_success',
        })

        return { success: true, user: data.user }
      } else {
        logAuth.login(email, false)
        return {
          success: false,
          error: data.message || 'Credenciales inválidas',
        }
      }
    } catch (error) {
      logger.error('Login error in auth context', error as Error, {
        component: 'auth-context',
        userId: email,
        action: 'login_error',
      })
      return { success: false, error: 'Error de conexión' }
    }
  }

  const logout = async () => {
    try {
      // Llamar API de logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar estado local siempre
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      const currentRole = user?.role
      setUser(null)

      // Redirigir siempre al login unificado
      router.push('/login')
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Para enviar cookies
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken)
        setUser(data.data.user)
        return true
      }

      return false
    } catch (error) {
      console.error('Error refrescando token:', error)
      return false
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.data)
      } else {
        // Token inválido, intentar refresh
        const refreshed = await refreshToken()
        if (!refreshed) {
          localStorage.removeItem('accessToken')
        }
      }
    } catch (error) {
      console.error('Error verificando auth:', error)
      localStorage.removeItem('accessToken')
    } finally {
      setLoading(false)
    }
  }

  // =============================================
  // EFECTOS
  // =============================================

  useEffect(() => {
    checkAuth()
  }, [])

  // Auto refresh token cada 20 minutos
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      refreshToken()
    }, 20 * 60 * 1000) // 20 minutos

    return () => clearInterval(interval)
  }, [user])

  // =============================================
  // VALOR DEL CONTEXTO
  // =============================================

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// =============================================
// HOC PARA RUTAS PROTEGIDAS
// =============================================

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // Redirigir siempre al login unificado
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        // Redireccionar según el rol del usuario
        if (user.role === 'customer') {
          router.push('/customer/dashboard')
        } else {
          router.push('/admin/dashboard')
        }
      }
    }
  }, [user, requiredRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
