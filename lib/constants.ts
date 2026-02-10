/**
 * Constantes del Sistema de Servicio Técnico
 * Definiciones centralizadas para mantener consistencia
 */

// =============================================
// ESTADOS DE ÓRDENES
// =============================================

export const ORDER_STATES = {
  PENDIENTE: 'pendiente',
  ASIGNADO: 'asignado',
  EN_CAMINO: 'en_camino',
  REVISADO: 'revisado',
  COTIZADO: 'cotizado',
  EN_PROCESO: 'en_proceso',
  ESPERANDO_REPUESTOS: 'esperando_repuestos',
  REPARADO: 'reparado',
  ENTREGADO: 'entregado',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
  REAGENDADO: 'reagendado'
} as const

export type OrderState = typeof ORDER_STATES[keyof typeof ORDER_STATES]

// =============================================
// NIVELES DE URGENCIA
// =============================================

export const URGENCY_LEVELS = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta'
} as const

export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS]

// =============================================
// TIPOS DE SERVICIOS
// =============================================

export const SERVICE_TYPES = {
  REPARACION: 'reparacion',
  MANTENIMIENTO: 'mantenimiento',
  INSTALACION: 'instalacion',
  DIAGNOSTICO: 'diagnostico',
  LIMPIEZA: 'limpieza'
} as const

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES]

// =============================================
// TIPOS DE ELECTRODOMÉSTICOS
// =============================================

export const APPLIANCE_TYPES = {
  NEVERA: 'nevera',
  LAVADORA: 'lavadora',
  SECADORA: 'secadora',
  ESTUFA: 'estufa',
  HORNO: 'horno',
  MICROONDAS: 'microondas',
  LAVAVAJILLAS: 'lavavajillas',
  AIRE_ACONDICIONADO: 'aire_acondicionado',
  CALENTADOR: 'calentador',

  // Categorías Generales (Padres)
  ELECTRICISTA: 'electricidad_general',
  TECNICO_SISTEMAS: 'sistemas_general',
  TECNICO_SEGURIDAD: 'seguridad_general',

  // Electricidad
  CABLEADO: 'cableado',
  TABLERO: 'tablero',
  ILUMINACION: 'iluminacion',
  TOMACORRIENTE: 'tomacorriente',

  // Computación y Redes
  COMPUTADOR: 'computador',
  PORTATIL: 'portatil',
  RED: 'red',
  SERVIDOR: 'servidor',
  IMPRESORA: 'impresora',

  // Seguridad Electrónica
  CAMARA: 'camara',
  ALARMA: 'alarma',
  CITOFONO: 'citofono',
  CONTROL_ACCESO: 'control_acceso',
  CERCO_ELECTRICO: 'cerco_electrico',

  OTROS: 'otros'
} as const

export type ApplianceType = typeof APPLIANCE_TYPES[keyof typeof APPLIANCE_TYPES]

// =============================================
// ESTADOS DE ASIGNACIONES
// =============================================

export const ASSIGNMENT_STATES = {
  ASIGNADO: 'asignado',
  EN_CAMINO: 'en_camino',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
} as const

export type AssignmentState = typeof ASSIGNMENT_STATES[keyof typeof ASSIGNMENT_STATES]

// =============================================
// ROLES DE USUARIOS
// =============================================

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TECHNICIAN_MANAGER: 'technician_manager',
  VIEWER: 'viewer',
  CUSTOMER: 'customer'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// =============================================
// TIPOS DE NOTIFICACIONES
// =============================================

export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  SYSTEM: 'system'
} as const

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

// =============================================
// HORARIOS DE ATENCIÓN
// =============================================

export const TIME_SLOTS = {
  MANANA: 'mañana',
  TARDE: 'tarde',
  NOCHE: 'noche',
  TODO_EL_DIA: 'todo_el_dia'
} as const

export type TimeSlot = typeof TIME_SLOTS[keyof typeof TIME_SLOTS]

// =============================================
// ESPECIALIDADES DE TÉCNICOS
// =============================================

export const TECHNICIAN_SPECIALTIES = {
  GENERAL: 'general',
  NEVERA: 'nevera',
  CONGELADOR: 'congelador',
  LAVADORA: 'lavadora',
  SECADORA: 'secadora',
  ESTUFA: 'estufa',
  HORNO: 'horno',
  MICROONDAS: 'microondas',
  LAVAVAJILLAS: 'lavavajillas',
  AIRE_ACONDICIONADO: 'aire_acondicionado',
  CALENTADOR: 'calentador',
  REPARACION: 'reparacion',
  MANTENIMIENTO: 'mantenimiento',
  INSTALACION: 'instalacion',
  DIAGNOSTICO: 'diagnostico',
  LIMPIEZA: 'limpieza',

  // Nuevas Especialidades
  ELECTRICIDAD: 'electricidad',
  COMPUTACION: 'computacion',
  REDES: 'redes',
  SEGURIDAD_ELECTRONICA: 'seguridad_electronica'
} as const

export type TechnicianSpecialty = typeof TECHNICIAN_SPECIALTIES[keyof typeof TECHNICIAN_SPECIALTIES]

// =============================================
// CONFIGURACIONES POR DEFECTO
// =============================================

export const DEFAULT_CONFIG = {
  // Paginación
  ORDERS_PER_PAGE: 10,
  TECHNICIANS_PER_PAGE: 10,
  NOTIFICATIONS_PER_PAGE: 20,

  // Tiempos (en minutos)
  DEFAULT_SERVICE_TIME: 120,
  MAX_ASSIGNMENT_TIME: 2 * 60, // 2 horas
  ORDER_TIMEOUT: 24 * 60, // 24 horas

  // Límites
  MAX_ORDERS_PER_TECHNICIAN: 5,
  MAX_NOTIFICATION_ATTEMPTS: 3,
  MAX_FILE_SIZE_MB: 5,

  // Costos por defecto
  BASE_SERVICE_COST: 50000,
  TRAVEL_COST_PER_KM: 1000,

  // Configuración de UI
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 30000,

  // Zona horaria por defecto
  DEFAULT_TIMEZONE: 'America/Bogota'
} as const

// =============================================
// COLORES PARA UI
// =============================================

export const STATUS_COLORS = {
  [ORDER_STATES.PENDIENTE]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '🟡'
  },
  [ORDER_STATES.ASIGNADO]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '🔵'
  },
  [ORDER_STATES.EN_CAMINO]: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: '🚗'
  },
  [ORDER_STATES.REVISADO]: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    icon: '🔍'
  },
  [ORDER_STATES.COTIZADO]: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    icon: '📝'
  },
  [ORDER_STATES.EN_PROCESO]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: '🟣'
  },
  [ORDER_STATES.ESPERANDO_REPUESTOS]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: '⏳'
  },
  [ORDER_STATES.REPARADO]: {
    bg: 'bg-lime-100',
    text: 'text-lime-800',
    border: 'border-lime-200',
    icon: '🔧'
  },
  [ORDER_STATES.ENTREGADO]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '📦'
  },
  [ORDER_STATES.COMPLETADO]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: '✅'
  },
  [ORDER_STATES.CANCELADO]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '❌'
  },
  [ORDER_STATES.REAGENDADO]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '📅'
  }
} as const

export const URGENCY_COLORS = {
  [URGENCY_LEVELS.BAJA]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: '🟢'
  },
  [URGENCY_LEVELS.MEDIA]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: '🟡'
  },
  [URGENCY_LEVELS.ALTA]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: '🔴'
  }
} as const

// =============================================
// ICONOS PARA ELECTRODOMÉSTICOS
// =============================================

export const APPLIANCE_ICONS = {
  [APPLIANCE_TYPES.NEVERA]: '❄️',
  [APPLIANCE_TYPES.LAVADORA]: '🔄',
  [APPLIANCE_TYPES.SECADORA]: '💨',
  [APPLIANCE_TYPES.ESTUFA]: '🔥',
  [APPLIANCE_TYPES.HORNO]: '🍞',
  [APPLIANCE_TYPES.MICROONDAS]: '📱',
  [APPLIANCE_TYPES.LAVAVAJILLAS]: '💧',
  [APPLIANCE_TYPES.AIRE_ACONDICIONADO]: '❄️',
  [APPLIANCE_TYPES.CALENTADOR]: '🔥',
  [APPLIANCE_TYPES.OTROS]: '➕',

  // Categorías Padres (Iconos Generales)
  [APPLIANCE_TYPES.ELECTRICISTA]: '⚡',
  [APPLIANCE_TYPES.TECNICO_SISTEMAS]: '💻',
  [APPLIANCE_TYPES.TECNICO_SEGURIDAD]: '🛡️',

  // Electricidad
  [APPLIANCE_TYPES.CABLEADO]: '⚡',
  [APPLIANCE_TYPES.TABLERO]: '🔌',
  [APPLIANCE_TYPES.ILUMINACION]: '💡',
  [APPLIANCE_TYPES.TOMACORRIENTE]: '🔌',

  // Computación
  [APPLIANCE_TYPES.COMPUTADOR]: '🖥️',
  [APPLIANCE_TYPES.PORTATIL]: '💻',
  [APPLIANCE_TYPES.RED]: '🌐',
  [APPLIANCE_TYPES.SERVIDOR]: '💾',
  [APPLIANCE_TYPES.IMPRESORA]: '🖨️',

  // Seguridad
  [APPLIANCE_TYPES.CAMARA]: '📹',
  [APPLIANCE_TYPES.ALARMA]: '🚨',
  [APPLIANCE_TYPES.CITOFONO]: '🔔',
  [APPLIANCE_TYPES.CONTROL_ACCESO]: '🔐',
  [APPLIANCE_TYPES.CERCO_ELECTRICO]: '⚡'
} as const

// =============================================
// MENSAJES DEL SISTEMA
// =============================================

export const SYSTEM_MESSAGES = {
  ORDER_CREATED: 'Orden creada exitosamente',
  ORDER_UPDATED: 'Orden actualizada correctamente',
  ORDER_ASSIGNED: 'Técnico asignado a la orden',
  ORDER_COMPLETED: 'Servicio completado satisfactoriamente',
  ORDER_CANCELLED: 'Orden cancelada',

  TECHNICIAN_CREATED: 'Técnico registrado exitosamente',
  TECHNICIAN_UPDATED: 'Información del técnico actualizada',
  TECHNICIAN_ACTIVATED: 'Técnico activado',
  TECHNICIAN_DEACTIVATED: 'Técnico desactivado',

  NOTIFICATION_SENT: 'Notificación enviada correctamente',
  NOTIFICATION_FAILED: 'Error al enviar notificación',

  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_FAILED: 'Credenciales incorrectas',
  ACCESS_DENIED: 'Acceso denegado',

  VALIDATION_ERROR: 'Error de validación en los datos',
  SERVER_ERROR: 'Error interno del servidor',
  CONNECTION_ERROR: 'Error de conexión'
} as const

// =============================================
// PATRONES REGEX
// =============================================

export const REGEX_PATTERNS = {
  PHONE: /^(\+57|57)?[3][0-9]{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ORDER_NUMBER: /^ORD-\d{4}-\d{4}$/,
  CEDULA: /^\d{7,10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
} as const

// =============================================
// CONFIGURACIÓN DE DESARROLLO/PRODUCCIÓN
// =============================================

export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // URLs
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || '/api',

  // Configuración de logging
  logLevel: process.env.LOG_LEVEL || 'info',
  enableApiLogs: process.env.ENABLE_API_LOGS === 'true',

  // Funciones de desarrollo
  enableSeedData: process.env.ENABLE_SEED_DATA === 'true',
  skipEmailVerification: process.env.SKIP_EMAIL_VERIFICATION === 'true'
} as const

// =============================================
// FUNCIONES UTILITARIAS
// =============================================

/**
 * Obtiene el texto legible para un estado de orden
 */
export function getOrderStateText(state: OrderState): string {
  const stateTexts = {
    [ORDER_STATES.PENDIENTE]: 'Pendiente de asignación',
    [ORDER_STATES.ASIGNADO]: 'Técnico asignado',
    [ORDER_STATES.EN_CAMINO]: 'Técnico en camino',
    [ORDER_STATES.REVISADO]: 'Revisado / Diagnóstico',
    [ORDER_STATES.COTIZADO]: 'Cotizado',
    [ORDER_STATES.EN_PROCESO]: 'Servicio en proceso',
    [ORDER_STATES.ESPERANDO_REPUESTOS]: 'Esperando repuestos',
    [ORDER_STATES.REPARADO]: 'Reparado',
    [ORDER_STATES.ENTREGADO]: 'Entregado',
    [ORDER_STATES.COMPLETADO]: 'Completado',
    [ORDER_STATES.CANCELADO]: 'Cancelado',
    [ORDER_STATES.REAGENDADO]: 'Reagendado'
  }
  return stateTexts[state] || state
}

/**
 * Obtiene el texto legible para un nivel de urgencia
 */
export function getUrgencyText(urgency: UrgencyLevel): string {
  const urgencyTexts = {
    [URGENCY_LEVELS.BAJA]: 'Baja',
    [URGENCY_LEVELS.MEDIA]: 'Media',
    [URGENCY_LEVELS.ALTA]: 'Alta'
  }
  return urgencyTexts[urgency] || urgency
}

/**
 * Obtiene el texto legible para un tipo de electrodoméstico
 */
export function getApplianceText(appliance: ApplianceType): string {
  const applianceTexts = {
    [APPLIANCE_TYPES.NEVERA]: 'Nevera',
    [APPLIANCE_TYPES.LAVADORA]: 'Lavadora',
    [APPLIANCE_TYPES.SECADORA]: 'Secadora',
    [APPLIANCE_TYPES.ESTUFA]: 'Estufa',
    [APPLIANCE_TYPES.HORNO]: 'Horno',
    [APPLIANCE_TYPES.MICROONDAS]: 'Microondas',
    [APPLIANCE_TYPES.LAVAVAJILLAS]: 'Lavavajillas',
    [APPLIANCE_TYPES.AIRE_ACONDICIONADO]: 'Aire Acondicionado',
    [APPLIANCE_TYPES.CALENTADOR]: 'Calentador',

    // Categorías Padres
    [APPLIANCE_TYPES.ELECTRICISTA]: 'Electricista',
    [APPLIANCE_TYPES.TECNICO_SISTEMAS]: 'Computación y Redes',
    [APPLIANCE_TYPES.TECNICO_SEGURIDAD]: 'Seguridad Electrónica',

    // Electricidad
    [APPLIANCE_TYPES.CABLEADO]: 'Cableado Eléctrico',
    [APPLIANCE_TYPES.TABLERO]: 'Tablero Eléctrico',
    [APPLIANCE_TYPES.ILUMINACION]: 'Iluminación',
    [APPLIANCE_TYPES.TOMACORRIENTE]: 'Puntos Eléctricos',

    // Computación
    [APPLIANCE_TYPES.COMPUTADOR]: 'Computador de Mesa',
    [APPLIANCE_TYPES.PORTATIL]: 'Portátil / Laptop',
    [APPLIANCE_TYPES.RED]: 'Redes / WiFi',
    [APPLIANCE_TYPES.SERVIDOR]: 'Servidores',
    [APPLIANCE_TYPES.IMPRESORA]: 'Impresoras',

    // Seguridad
    [APPLIANCE_TYPES.CAMARA]: 'Cámaras de Seguridad',
    [APPLIANCE_TYPES.ALARMA]: 'Sistemas de Alarma',
    [APPLIANCE_TYPES.CITOFONO]: 'Citofonía',
    [APPLIANCE_TYPES.CONTROL_ACCESO]: 'Control de Acceso',
    [APPLIANCE_TYPES.CERCO_ELECTRICO]: 'Cercos Eléctricos',

    [APPLIANCE_TYPES.OTROS]: 'Otros'
  }
  return applianceTexts[appliance] || appliance
}

/**
 * Verifica si un estado de orden es válido
 */
export function isValidOrderState(state: string): state is OrderState {
  return Object.values(ORDER_STATES).includes(state as OrderState)
}

/**
 * Verifica si un nivel de urgencia es válido
 */
export function isValidUrgencyLevel(urgency: string): urgency is UrgencyLevel {
  return Object.values(URGENCY_LEVELS).includes(urgency as UrgencyLevel)
}

/**
 * @deprecated Usar generateSequentialOrderNumber() de '@/lib/order-utils' en su lugar.
 * Esta función genera formatos no legibles. Se mantiene solo por compatibilidad temporal.
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `ORD-${timestamp}-${random}`
}
