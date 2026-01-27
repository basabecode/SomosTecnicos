/**
 * 🔒 SomosTécnicos - Sistema de Logging Centralizado y Seguro
 * ======================================================
 *
 * Reemplaza console.log para prevenir exposición de datos sensibles en producción
 * Proporciona diferentes niveles de logging con contexto y timestamps
 */

interface LogContext {
  userId?: string
  action?: string
  component?: string
  role?: string
  metadata?: Record<string, any>
}

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  context?: LogContext
  stack?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isTest = process.env.NODE_ENV === 'test'

  /**
   * 🔍 Log informativo - Solo en desarrollo
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('info', message, context)
    }
  }

  /**
   * ⚠️ Log de advertencia - Siempre visible
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * 🚨 Log de error - Siempre visible + envío a servicio de monitoreo
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      stack: error?.stack,
      errorMessage: error?.message
    }

    this.log('error', message, errorContext)

    // En producción, enviar a servicio de monitoreo (Sentry, LogRocket, etc.)
    if (!this.isDevelopment && !this.isTest) {
      this.sendToMonitoringService(message, error, errorContext)
    }
  }

  /**
   * 🔧 Log de debug - Solo en desarrollo con flag específico
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && process.env.DEBUG_LOGS === 'true') {
      this.log('debug', message, context)
    }
  }

  /**
   * 🎯 Log de acción de usuario - Para auditoría
   */
  audit(action: string, userId: string, details?: Record<string, any>): void {
    const auditContext: LogContext = {
      userId,
      action,
      component: 'audit',
      metadata: details
    }

    this.log('info', `User action: ${action}`, auditContext)

    // En producción, enviar a sistema de auditoría
    if (!this.isDevelopment) {
      this.sendToAuditService(action, userId, details)
    }
  }

  /**
   * 📊 Log de performance - Para optimización
   */
  performance(operation: string, duration: number, context?: LogContext): void {
    const perfContext: LogContext = {
      ...context,
      component: 'performance',
      metadata: { duration, operation }
    }

    if (duration > 1000) { // Operaciones lentas (>1s)
      this.warn(`Slow operation detected: ${operation} took ${duration}ms`, perfContext)
    } else if (this.isDevelopment) {
      this.info(`Performance: ${operation} completed in ${duration}ms`, perfContext)
    }
  }

  private log(level: LogEntry['level'], message: string, context?: LogContext): void {
    const entry: LogEntry = {
      level,
      message: this.sanitizeMessage(message),
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeContext(context) : undefined
    }

    const colorMap = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      debug: '\x1b[35m'    // Magenta
    }

    const color = colorMap[level]
    const reset = '\x1b[0m'

    const logMethod = level === 'error' ? console.error :
                      level === 'warn' ? console.warn : console.log

    if (this.isDevelopment) {
      logMethod(`${color}[${level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`)
      if (entry.context) {
        logMethod(`${color}Context:${reset}`, entry.context)
      }
    } else {
      // En producción, formato JSON para herramientas de análisis
      logMethod(JSON.stringify(entry))
    }
  }

  /**
   * 🛡️ Sanitizar mensaje para prevenir exposición de datos sensibles
   */
  private sanitizeMessage(message: string): string {
    // Remover patrones de datos sensibles
    const patterns = [
      /password[=:]\s*[^\s]+/gi,
      /token[=:]\s*[^\s]+/gi,
      /secret[=:]\s*[^\s]+/gi,
      /api[_-]?key[=:]\s*[^\s]+/gi,
      /jwt[=:]\s*[^\s]+/gi,
      /bearer\s+[^\s]+/gi
    ]

    let sanitized = message
    patterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]')
    })

    return sanitized
  }

  /**
   * 🛡️ Sanitizar contexto para prevenir exposición de datos sensibles
   */
  private sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context }

    // Remover campos sensibles
    if (sanitized.metadata) {
      const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'jwt']
      sensitiveFields.forEach(field => {
        if (sanitized.metadata![field]) {
          sanitized.metadata![field] = '[REDACTED]'
        }
      })
    }

    return sanitized
  }

  /**
   * 🚀 Enviar a servicio de monitoreo en producción
   */
  private async sendToMonitoringService(
    message: string,
    error?: Error,
    context?: LogContext
  ): Promise<void> {
    try {
      // Aquí integrar con Sentry, LogRocket, DataDog, etc.
      // Ejemplo con fetch a servicio de logging:

      // await fetch('/api/monitoring/log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message, error: error?.stack, context })
      // })
    } catch (err) {
      // Fallback silencioso para evitar loops de error
      console.error('Failed to send log to monitoring service:', err)
    }
  }

  /**
   * 📋 Enviar a sistema de auditoría en producción
   */
  private async sendToAuditService(
    action: string,
    userId: string,
    details?: Record<string, any>
  ): Promise<void> {
    try {
      // Aquí integrar con sistema de auditoría
      // Ejemplo: Base de datos de auditoría, servicio externo, etc.
    } catch (err) {
      console.error('Failed to send audit log:', err)
    }
  }
}

// 🌟 Instancia singleton del logger
export const logger = new Logger()

// 🎯 Helpers de conveniencia para casos comunes
export const logAPI = {
  request: (method: string, path: string, userId?: string) => {
    logger.info(`API ${method} ${path}`, {
      component: 'api',
      action: 'request',
      userId,
      metadata: { method, path }
    })
  },

  response: (method: string, path: string, status: number, duration: number) => {
    const level = status >= 400 ? 'warn' : 'info'
    logger[level](`API ${method} ${path} - ${status}`, {
      component: 'api',
      action: 'response',
      metadata: { method, path, status, duration }
    })
  },

  error: (method: string, path: string, error: Error) => {
    logger.error(`API ${method} ${path} failed`, error, {
      component: 'api',
      action: 'error',
      metadata: { method, path }
    })
  }
}

export const logAuth = {
  login: (email: string, success: boolean, role?: string) => {
    logger.audit('login', email, { success, role })
  },

  logout: (userId: string) => {
    logger.audit('logout', userId, {})
  },

  tokenRefresh: (userId: string) => {
    logger.audit('token_refresh', userId, {})
  }
}

export const logDB = {
  query: (operation: string, table: string, duration: number) => {
    logger.performance(`DB ${operation} on ${table}`, duration, {
      component: 'database',
      metadata: { operation, table }
    })
  },

  error: (operation: string, table: string, error: Error) => {
    logger.error(`DB ${operation} on ${table} failed`, error, {
      component: 'database',
      metadata: { operation, table }
    })
  }
}

// 🔄 Para migración gradual desde console.log
export const deprecatedConsole = {
  log: (message: string, ...args: any[]) => {
    logger.warn(`DEPRECATED: Use logger instead of console.log - ${message}`, {
      component: 'deprecated',
      metadata: { args }
    })
  }
}

export default logger
