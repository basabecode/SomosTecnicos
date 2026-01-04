import { ORDER_STATES } from '@/lib/constants'

type OrderState = typeof ORDER_STATES[keyof typeof ORDER_STATES]

// Mapa de transiciones permitidas
// Clave: Estado actual -> Valor: Lista de estados posibles siguientes
export const VALID_TRANSITIONS: Record<string, string[]> = {
  [ORDER_STATES.PENDIENTE]: [
    ORDER_STATES.ASIGNADO,
    ORDER_STATES.CANCELADO
  ],
  [ORDER_STATES.ASIGNADO]: [
    ORDER_STATES.EN_CAMINO,
    ORDER_STATES.REVISADO, // Salto directo si llegó
    ORDER_STATES.CANCELADO,
    ORDER_STATES.REAGENDADO,
    ORDER_STATES.PENDIENTE // Permitir desasignar por error
  ],
  [ORDER_STATES.EN_CAMINO]: [
    ORDER_STATES.REVISADO,
    ORDER_STATES.EN_PROCESO,
    ORDER_STATES.CANCELADO,
    ORDER_STATES.ASIGNADO // Rollback
  ],
  [ORDER_STATES.REVISADO]: [
    ORDER_STATES.COTIZADO,
    ORDER_STATES.EN_PROCESO, // Si no requirió cotización
    ORDER_STATES.REPARADO, // Reparación inmediata
    ORDER_STATES.ESPERANDO_REPUESTOS,
    ORDER_STATES.CANCELADO
  ],
  [ORDER_STATES.COTIZADO]: [
    ORDER_STATES.EN_PROCESO,
    ORDER_STATES.REPARADO,
    ORDER_STATES.CANCELADO,
    ORDER_STATES.ESPERANDO_REPUESTOS
  ],
  [ORDER_STATES.ESPERANDO_REPUESTOS]: [
    ORDER_STATES.EN_PROCESO,
    ORDER_STATES.REPARADO,
    ORDER_STATES.CANCELADO
  ],
  [ORDER_STATES.EN_PROCESO]: [
    ORDER_STATES.REPARADO,
    ORDER_STATES.ESPERANDO_REPUESTOS,
    ORDER_STATES.CANCELADO
  ],
  [ORDER_STATES.REPARADO]: [
    ORDER_STATES.ENTREGADO,
    ORDER_STATES.COMPLETADO, // Alias legacy
    ORDER_STATES.EN_PROCESO // Rollback si quedó mal
  ],
  [ORDER_STATES.ENTREGADO]: [
    ORDER_STATES.COMPLETADO, // Cierre final
  ],
  [ORDER_STATES.COMPLETADO]: [], // Estado final
  [ORDER_STATES.CANCELADO]: [], // Estado final
  [ORDER_STATES.REAGENDADO]: [
    ORDER_STATES.ASIGNADO,
    ORDER_STATES.PENDIENTE,
    ORDER_STATES.CANCELADO
  ]
}

/**
 * Valida si una transición de estado es permitida
 * @param from Estado actual
 * @param to Estado nuevo
 * @returns true si es válida
 */
export function isValidTransition(from: string, to: string): boolean {
  if (from === to) return true

  // Si el estado no está en el mapa, ser permisivo o restrictivo?
  // Restrictivo:
  const allowed = VALID_TRANSITIONS[from]
  if (!allowed) return false // Estado desconocido no puede transicionar

  return allowed.includes(to)
}
