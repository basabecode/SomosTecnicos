/**
 * Generador de Números de Factura
 * Formato: FAC-YYYY-MM-XXXX
 * Ejemplo: FAC-2024-01-0001
 */

import { prisma } from '@/lib/prisma'

export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  try {
    // Obtener el último número de factura del mes actual
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        fiscalYear: currentYear,
        fiscalMonth: currentMonth,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        invoiceNumber: true,
      },
    })

    let sequential = 1

    if (lastInvoice) {
      // Extraer número secuencial del último número de factura
      // Formato: FAC-2024-01-0001
      const parts = lastInvoice.invoiceNumber.split('-')
      const lastSequential = parseInt(parts[parts.length - 1])
      sequential = lastSequential + 1
    }

    // Generar nuevo número de factura
    // Formato: FAC-YYYY-MM-XXXX
    const invoiceNumber = `FAC-${currentYear}-${currentMonth.toString().padStart(2, '0')}-${sequential.toString().padStart(4, '0')}`

    return invoiceNumber
  } catch (error) {
    console.error('Error generando número de factura:', error)
    throw new Error('No se pudo generar el número de factura')
  }
}

/**
 * Validar formato de número de factura
 */
export function validateInvoiceNumber(invoiceNumber: string): boolean {
  const pattern = /^FAC-\d{4}-\d{2}-\d{4}$/
  return pattern.test(invoiceNumber)
}

/**
 * Extraer información del número de factura
 */
export function parseInvoiceNumber(invoiceNumber: string): {
  year: number
  month: number
  sequential: number
} | null {
  if (!validateInvoiceNumber(invoiceNumber)) {
    return null
  }

  const parts = invoiceNumber.split('-')
  return {
    year: parseInt(parts[1]),
    month: parseInt(parts[2]),
    sequential: parseInt(parts[3]),
  }
}
