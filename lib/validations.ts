/**
 * Esquemas de Validación con Zod
 * Validaciones centralizadas para formularios y APIs
 */

import { z } from 'zod'
import {
  ORDER_STATES,
  URGENCY_LEVELS,
  SERVICE_TYPES,
  APPLIANCE_TYPES,
  USER_ROLES,
  NOTIFICATION_TYPES,
  TIME_SLOTS,
  TECHNICIAN_SPECIALTIES,
  REGEX_PATTERNS
} from './constants'

// =============================================
// VALIDACIONES BÁSICAS
// =============================================

export const phoneSchema = z.string()
  .min(10, 'El teléfono debe tener al menos 10 dígitos')
  .max(15, 'El teléfono no puede tener más de 15 dígitos')
  .regex(REGEX_PATTERNS.PHONE, 'Formato de teléfono inválido. Debe ser un número colombiano')

export const emailSchema = z.string()
  .email('Email inválido')
  .max(100, 'El email no puede tener más de 100 caracteres')

export const cedulaSchema = z.string()
  .regex(REGEX_PATTERNS.CEDULA, 'Cédula inválida. Debe tener entre 7 y 10 dígitos')

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(
    REGEX_PATTERNS.PASSWORD,
    'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial'
  )

// =============================================
// VALIDACIÓN DE ÓRDENES
// =============================================

export const createOrderSchema = z.object({
  // Información del Cliente
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  telefono: phoneSchema,

  email: emailSchema,

  direccion: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede tener más de 200 caracteres'),

  ciudad: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'La ciudad no puede tener más de 50 caracteres'),

  // Información del Electrodoméstico
  tipoElectrodomestico: z.enum(Object.values(APPLIANCE_TYPES) as [string, ...string[]], {
    errorMap: () => ({ message: 'Tipo de electrodoméstico inválido' })
  }),

  marca: z.string()
    .max(50, 'La marca no puede tener más de 50 caracteres')
    .optional(),

  modelo: z.string()
    .max(50, 'El modelo no puede tener más de 50 caracteres')
    .optional(),

  año: z.number()
    .int('El año debe ser un número entero')
    .min(1980, 'El año no puede ser anterior a 1980')
    .max(new Date().getFullYear() + 1, 'El año no puede ser futuro')
    .optional(),

  // Información del Servicio
  tipoServicio: z.enum(Object.values(SERVICE_TYPES) as [string, ...string[]], {
    errorMap: () => ({ message: 'Tipo de servicio inválido' })
  }),

  descripcionProblema: z.string()
    .max(1000, 'La descripción no puede tener más de 1000 caracteres')
    .optional(),

  urgencia: z.enum(Object.values(URGENCY_LEVELS) as [string, ...string[]], {
    errorMap: () => ({ message: 'Nivel de urgencia inválido' })
  }),

  // Programación
  fechaPreferida: z.string()
    .datetime('Fecha inválida')
    .optional()
    .or(z.date().optional()),

  horario: z.enum(Object.values(TIME_SLOTS) as [string, ...string[]])
    .optional(),

  comentarios: z.string()
    .max(500, 'Los comentarios no pueden tener más de 500 caracteres')
    .optional()
})

export const updateOrderSchema = createOrderSchema.partial().extend({
  id: z.string().cuid('ID de orden inválido'),
  estado: z.enum(Object.values(ORDER_STATES) as [string, ...string[]])
    .optional(),
  costoEstimado: z.number()
    .positive('El costo estimado debe ser positivo')
    .optional(),
  costoFinal: z.number()
    .positive('El costo final debe ser positivo')
    .optional()
})

export const orderQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10))
    .pipe(z.number().min(1, 'La página debe ser mayor a 0'))
    .optional()
    .default('1'),

  limit: z.string().transform(val => parseInt(val, 10))
    .pipe(z.number().min(1).max(100, 'El límite no puede ser mayor a 100'))
    .optional()
    .default('10'),

  estado: z.enum(Object.values(ORDER_STATES) as [string, ...string[]])
    .optional(),

  urgencia: z.enum(Object.values(URGENCY_LEVELS) as [string, ...string[]])
    .optional(),

  tipoElectrodomestico: z.enum(Object.values(APPLIANCE_TYPES) as [string, ...string[]])
    .optional(),

  fechaDesde: z.string().datetime().optional(),
  fechaHasta: z.string().datetime().optional(),

  search: z.string()
    .max(100, 'La búsqueda no puede tener más de 100 caracteres')
    .optional()
})

// =============================================
// VALIDACIÓN DE TÉCNICOS
// =============================================

export const createTechnicianSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  telefono: phoneSchema,

  email: emailSchema,

  cedula: cedulaSchema,

  especialidades: z.array(
    z.enum(Object.values(TECHNICIAN_SPECIALTIES) as [string, ...string[]])
  )
    .min(1, 'Debe seleccionar al menos una especialidad')
    .max(10, 'No puede tener más de 10 especialidades'),

  zonaTrabajoArea: z.string()
    .min(2, 'La zona de trabajo debe tener al menos 2 caracteres')
    .max(100, 'La zona de trabajo no puede tener más de 100 caracteres')
    .optional(),

  activo: z.boolean().optional().default(true),
  disponible: z.boolean().optional().default(true)
})

export const updateTechnicianSchema = createTechnicianSchema.partial().extend({
  id: z.number().int().positive('ID de técnico inválido'),

  ordenesCompletadas: z.number()
    .int()
    .min(0, 'Las órdenes completadas no pueden ser negativas')
    .optional(),

  calificacionPromedio: z.number()
    .min(0, 'La calificación no puede ser menor a 0')
    .max(5, 'La calificación no puede ser mayor a 5')
    .optional(),

  tiempoPromedioServicio: z.number()
    .int()
    .positive('El tiempo promedio debe ser positivo')
    .optional()
})

// =============================================
// VALIDACIÓN DE ASIGNACIONES
// =============================================

export const createAssignmentSchema = z.object({
  orderId: z.string().cuid('ID de orden inválido'),

  technicianId: z.number()
    .int()
    .positive('ID de técnico inválido'),

  fechaProgramada: z.string()
    .datetime('Fecha programada inválida')
    .optional()
    .or(z.date().optional()),

  notasAsignacion: z.string()
    .max(500, 'Las notas no pueden tener más de 500 caracteres')
    .optional(),

  tiempoEstimado: z.number()
    .int()
    .positive('El tiempo estimado debe ser positivo')
    .optional()
})

export const updateAssignmentSchema = createAssignmentSchema.partial().extend({
  id: z.number().int().positive('ID de asignación inválido'),

  notasTecnico: z.string()
    .max(1000, 'Las notas del técnico no pueden tener más de 1000 caracteres')
    .optional(),

  tiempoReal: z.number()
    .int()
    .positive('El tiempo real debe ser positivo')
    .optional(),

  costoManoObra: z.number()
    .positive('El costo de mano de obra debe ser positivo')
    .optional(),

  costoRepuestos: z.number()
    .positive('El costo de repuestos debe ser positivo')
    .optional()
})

// =============================================
// VALIDACIÓN DE USUARIOS ADMIN
// =============================================

export const createAdminUserSchema = z.object({
  username: z.string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(50, 'El username no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El username solo puede contener letras, números y guiones bajos'),

  email: emailSchema,

  password: passwordSchema,

  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),

  apellido: z.string()
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .optional(),

  telefono: phoneSchema.optional(),

  role: z.enum(Object.values(USER_ROLES) as [string, ...string[]])
    .optional()
    .default('admin'),

  activo: z.boolean().optional().default(true)
})

export const updateAdminUserSchema = createAdminUserSchema
  .omit({ password: true })
  .partial()
  .extend({
    id: z.number().int().positive('ID de usuario inválido'),

    newPassword: passwordSchema.optional(),
    currentPassword: z.string().optional()
  })
  .refine(
    (data) => {
      // Si se proporciona nueva contraseña, debe proporcionar la actual
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: 'Debe proporcionar la contraseña actual para cambiarla',
      path: ['currentPassword']
    }
  )

// =============================================
// VALIDACIÓN DE AUTENTICACIÓN
// =============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida')
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirme la nueva contraseña')
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
)

// =============================================
// VALIDACIÓN DE NOTIFICACIONES
// =============================================

export const createNotificationSchema = z.object({
  orderId: z.string().cuid().optional(),

  tipo: z.enum(Object.values(NOTIFICATION_TYPES) as [string, ...string[]]),

  destinatario: z.string()
    .min(1, 'El destinatario es requerido')
    .max(100, 'El destinatario no puede tener más de 100 caracteres'),

  asunto: z.string()
    .max(200, 'El asunto no puede tener más de 200 caracteres')
    .optional(),

  mensaje: z.string()
    .min(1, 'El mensaje es requerido')
    .max(1000, 'El mensaje no puede tener más de 1000 caracteres'),

  programadaPara: z.string()
    .datetime('Fecha de programación inválida')
    .optional()
    .or(z.date().optional()),

  prioridad: z.number()
    .int()
    .min(1, 'La prioridad debe ser al menos 1')
    .max(3, 'La prioridad no puede ser mayor a 3')
    .optional()
    .default(1)
})

// =============================================
// VALIDACIÓN DE CONFIGURACIONES
// =============================================

export const systemSettingSchema = z.object({
  key: z.string()
    .min(1, 'La clave es requerida')
    .max(100, 'La clave no puede tener más de 100 caracteres')
    .regex(/^[a-z0-9_]+$/, 'La clave solo puede contener letras minúsculas, números y guiones bajos'),

  value: z.string()
    .min(1, 'El valor es requerido'),

  descripcion: z.string()
    .max(200, 'La descripción no puede tener más de 200 caracteres')
    .optional(),

  tipo: z.enum(['string', 'number', 'boolean', 'json'])
    .optional()
    .default('string'),

  categoria: z.string()
    .max(50, 'La categoría no puede tener más de 50 caracteres')
    .optional(),

  esPublico: z.boolean()
    .optional()
    .default(false)
})

// =============================================
// UTILIDADES DE VALIDACIÓN
// =============================================

/**
 * Valida y transforma datos de entrada
 */
export function validateAndTransform<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

/**
 * Formatea errores de validación para mostrar al usuario
 */
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}

  errors.errors.forEach((error) => {
    const path = error.path.join('.')
    formatted[path] = error.message
  })

  return formatted
}

/**
 * Valida si una fecha está en el futuro
 */
export const futureDateSchema = z.string()
  .datetime()
  .refine(
    (date) => new Date(date) > new Date(),
    { message: 'La fecha debe ser futura' }
  )

/**
 * Valida si una fecha está dentro del horario de atención
 */
export const businessHoursSchema = z.string()
  .datetime()
  .refine(
    (date) => {
      const day = new Date(date).getDay()
      // 0 = Domingo, 6 = Sábado
      return day >= 1 && day <= 6
    },
    { message: 'Solo se atiende de lunes a sábado' }
  )
  .refine(
    (date) => {
      const hour = new Date(date).getHours()
      return hour >= 8 && hour <= 18
    },
    { message: 'El horario de atención es de 8:00 AM a 6:00 PM' }
  )

// =============================================
// TIPOS TYPESCRIPT DERIVADOS
// =============================================

export type CreateOrderData = z.infer<typeof createOrderSchema>
export type UpdateOrderData = z.infer<typeof updateOrderSchema>
export type OrderQueryData = z.infer<typeof orderQuerySchema>

export type CreateTechnicianData = z.infer<typeof createTechnicianSchema>
export type UpdateTechnicianData = z.infer<typeof updateTechnicianSchema>

export type CreateAssignmentData = z.infer<typeof createAssignmentSchema>
export type UpdateAssignmentData = z.infer<typeof updateAssignmentSchema>

export type CreateAdminUserData = z.infer<typeof createAdminUserSchema>
export type UpdateAdminUserData = z.infer<typeof updateAdminUserSchema>

export type LoginData = z.infer<typeof loginSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>

export type CreateNotificationData = z.infer<typeof createNotificationSchema>
export type SystemSettingData = z.infer<typeof systemSettingSchema>
