/**
 * Utilidades para gestión de órdenes de servicio
 * Generación de números de orden secuenciales con formato ORD-YYYY-NNNN
 */

import { prisma } from '@/lib/prisma'

/**
 * Genera un número de orden único con formato ORD-YYYY-NNNN
 *
 * Ejemplos: ORD-2026-0001, ORD-2026-0042, ORD-2026-1583
 *
 * El número es secuencial dentro del año actual.
 * Se reinicia a 0001 al comenzar cada nuevo año.
 *
 * @returns El número de orden generado (ej: "ORD-2026-0001")
 */
export async function generateSequentialOrderNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const prefix = `ORD-${currentYear}-`

  // Buscar la última orden del año actual con formato ORD-YYYY-NNNN
  const lastOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      orderNumber: 'desc'
    },
    select: {
      orderNumber: true
    }
  })

  let nextNumber = 1

  if (lastOrder) {
    // Extraer el número secuencial de la última orden
    // Formato: ORD-2026-0042 → extraer "0042" → 42
    const parts = lastOrder.orderNumber.split('-')
    const lastSequential = parseInt(parts[2], 10)

    if (!isNaN(lastSequential)) {
      nextNumber = lastSequential + 1
    }
  }

  // Generar el nuevo número con padding a 4 dígitos
  const orderNumber = `${prefix}${nextNumber.toString().padStart(4, '0')}`

  // Verificar unicidad (por seguridad ante race conditions)
  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true }
  })

  if (existing) {
    // En caso de colisión (poco probable), intentar con el siguiente
    const fallbackNumber = `${prefix}${(nextNumber + 1).toString().padStart(4, '0')}`
    return fallbackNumber
  }

  return orderNumber
}

/**
 * Costo fijo de visita técnica.
 * Se intenta leer de SystemSetting, con fallback a $50.000 COP.
 */
export async function getCostoVisitaTecnica(): Promise<number> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'COSTO_VISITA_TECNICA' }
    })

    if (setting) {
      const valor = parseFloat(setting.value)
      if (!isNaN(valor)) return valor
    }
  } catch {
    // Fallback silencioso
  }

  return 50000 // $50.000 COP por defecto
}
