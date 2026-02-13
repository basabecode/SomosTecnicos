import { renderToStream } from '@react-pdf/renderer'
import { createElement } from 'react'
import { InvoiceTemplate } from './templates/invoice-template'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Definir tipos explícitos para evitar problemas de TypeScript
interface InvoiceData {
  invoiceNumber: string
  createdAt: string
  order: {
    orderNumber: string
  }
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  clientCity: string
  clientDocument?: string
  serviceType: string
  serviceDescription: string
  applianceType: string
  laborCost?: number
  partsCost?: number
  transportCost?: number
  subtotal: number
  iva: number
  total: number
  paymentMethod: string
  paymentStatus: string
  paymentDate?: string
  paymentReference?: string
  notes?: string
}

export async function generateInvoicePDF(invoice: any): Promise<string> {
  // Asegurar que los datos cumplan con la interfaz
  const invoiceData: InvoiceData = {
    invoiceNumber: invoice.invoiceNumber,
    createdAt: invoice.createdAt instanceof Date ? invoice.createdAt.toISOString() : invoice.createdAt,
    order: {
      orderNumber: invoice.order?.orderNumber || 'N/A'
    },
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    clientPhone: invoice.clientPhone,
    clientAddress: invoice.clientAddress,
    clientCity: invoice.clientCity,
    clientDocument: invoice.clientDocument,
    serviceType: invoice.serviceType,
    serviceDescription: invoice.serviceDescription,
    applianceType: invoice.applianceType,
    laborCost: Number(invoice.laborCost) || 0,
    partsCost: Number(invoice.partsCost) || 0,
    transportCost: Number(invoice.transportCost) || 0,
    subtotal: Number(invoice.subtotal),
    iva: Number(invoice.iva),
    total: Number(invoice.total),
    paymentMethod: invoice.paymentMethod,
    paymentStatus: invoice.paymentStatus,
    paymentDate: invoice.paymentDate ? (invoice.paymentDate instanceof Date ? invoice.paymentDate.toISOString() : invoice.paymentDate) : undefined,
    paymentReference: invoice.paymentReference,
    notes: invoice.notes,
  }

  // Crear el elemento React manualmente para evitar problemas de JSX en archivos .ts
  const template = createElement(InvoiceTemplate, { invoice: invoiceData })
  const stream = await renderToStream(template as any)

  // Definir rutas
  const fileName = `invoice-${invoice.invoiceNumber}.pdf`
  const publicDir = join(process.cwd(), 'public')
  const invoicesDir = join(publicDir, 'invoices')
  const filePath = join(invoicesDir, fileName)

  // Asegurar que el directorio existe
  if (!existsSync(invoicesDir)) {
    await mkdir(invoicesDir, { recursive: true })
  }

  // Convertir stream a buffer y guardar
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  const buffer = Buffer.concat(chunks)

  await writeFile(filePath, buffer)

  // Retornar URL relativa para acceso web
  return `/invoices/${fileName}`
}
