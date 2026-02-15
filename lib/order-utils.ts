/**
 * Utilidades para gestión de órdenes de servicio
 * Generación de números de orden secuenciales con formato ORD-YYYY-NNNN
 */

import { prisma } from '@/lib/prisma'

/**
 * Genera un número de orden único con formato ORD-YYYY-NNNN de forma atómica
 *
 * Ejemplos: ORD-2026-0001, ORD-2026-0042, ORD-2026-1583
 *
 * El número es secuencial dentro del año actual.
 * Se reinicia a 0001 al comenzar cada nuevo año.
 *
 * MEJORA: Usa tabla OrderSequence para garantizar atomicidad y evitar race conditions.
 * La operación upsert con increment es atómica y thread-safe.
 *
 * @returns El número de orden generado (ej: "ORD-2026-0001")
 */
export async function generateSequentialOrderNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()

  // Operación atómica: incrementa el contador en una sola transacción
  const sequence = await prisma.orderSequence.upsert({
    where: { year: currentYear },
    update: {
      lastNumber: { increment: 1 }
    },
    create: {
      year: currentYear,
      lastNumber: 1
    },
    select: {
      lastNumber: true
    }
  })

  // Formatear con padding de 4 dígitos
  const orderNumber = `ORD-${currentYear}-${sequence.lastNumber.toString().padStart(4, '0')}`

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
