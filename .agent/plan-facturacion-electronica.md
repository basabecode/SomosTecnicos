# Plan de Implementación: Sistema de Facturación Electrónica

**Fecha:** 2026-01-03
**Proyecto:** TecnoCity - Sistema de Servicio Técnico
**Objetivo:** Implementar sistema completo de facturación electrónica con envío por email y WhatsApp

---

## 🎯 **Objetivos del Sistema**

1. Generar facturas electrónicas automáticamente al completar un servicio
2. Enviar facturas por correo electrónico
3. Enviar facturas por WhatsApp
4. Permitir descarga de facturas en PDF
5. Mantener historial de facturas por cliente
6. Cumplir con requisitos legales básicos (Colombia)

---

## 📐 **Arquitectura del Sistema**

### **1. Modelo de Datos (Prisma)**

```prisma
model Invoice {
  id                String   @id @default(cuid())
  invoiceNumber     String   @unique @map("invoice_number") // Ej: FAC-2024-0001
  orderId           String   @map("order_id")

  // Información del Cliente
  clientName        String   @map("client_name")
  clientEmail       String   @map("client_email")
  clientPhone       String   @map("client_phone")
  clientAddress     String   @map("client_address")
  clientCity        String   @map("client_city")
  clientDocument    String?  @map("client_document") // NIT o Cédula

  // Detalles del Servicio
  serviceType       String   @map("service_type")
  serviceDescription String  @map("service_description")
  applianceType     String   @map("appliance_type")

  // Costos
  subtotal          Decimal  @db.Decimal(10,2)
  iva               Decimal  @db.Decimal(10,2) // 19% en Colombia
  total             Decimal  @db.Decimal(10,2)

  // Desglose de Costos
  laborCost         Decimal? @map("labor_cost") @db.Decimal(10,2)
  partsCost         Decimal? @map("parts_cost") @db.Decimal(10,2)
  transportCost     Decimal? @map("transport_cost") @db.Decimal(10,2)

  // Método de Pago
  paymentMethod     String   @map("payment_method") // efectivo, transferencia, nequi, daviplata
  paymentStatus     String   @default("pending") @map("payment_status") // pending, paid, cancelled
  paymentDate       DateTime? @map("payment_date")
  paymentReference  String?  @map("payment_reference") // Número de transacción

  // Archivos
  pdfUrl            String?  @map("pdf_url") // URL del PDF generado
  pdfPath           String?  @map("pdf_path") // Ruta local del PDF

  // Estado de Envío
  emailSent         Boolean  @default(false) @map("email_sent")
  emailSentAt       DateTime? @map("email_sent_at")
  whatsappSent      Boolean  @default(false) @map("whatsapp_sent")
  whatsappSentAt    DateTime? @map("whatsapp_sent_at")

  // Información Fiscal
  fiscalYear        Int      @map("fiscal_year")
  fiscalMonth       Int      @map("fiscal_month")

  // Notas
  notes             String?
  internalNotes     String?  @map("internal_notes")

  // Timestamps
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  // Relaciones
  order             Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  // Índices
  @@index([orderId])
  @@index([invoiceNumber])
  @@index([clientEmail])
  @@index([fiscalYear, fiscalMonth])
  @@index([paymentStatus])
  @@map("invoices")
}

// Actualizar modelo Order para incluir relación
model Order {
  // ... campos existentes ...
  invoices          Invoice[]
}
```

### **2. Estructura de Archivos**

```
app/
├── api/
│   └── invoices/
│       ├── route.ts                    # GET /api/invoices (listar)
│       ├── [id]/
│       │   ├── route.ts                # GET /api/invoices/:id
│       │   ├── download/route.ts       # GET /api/invoices/:id/download
│       │   └── send/route.ts           # POST /api/invoices/:id/send
│       ├── generate/route.ts           # POST /api/invoices/generate
│       └── by-order/[orderId]/route.ts # GET /api/invoices/by-order/:orderId

lib/
├── invoice/
│   ├── generator.ts                    # Generador de PDF
│   ├── templates/
│   │   └── invoice-template.tsx        # Plantilla React para PDF
│   ├── email-sender.ts                 # Envío por email
│   ├── whatsapp-sender.ts              # Envío por WhatsApp
│   └── invoice-number.ts               # Generador de números de factura

components/
├── invoices/
│   ├── invoice-preview.tsx             # Vista previa de factura
│   ├── invoice-list.tsx                # Lista de facturas
│   └── invoice-actions.tsx             # Acciones (descargar, enviar)

app/
├── admin/
│   └── invoices/
│       ├── page.tsx                    # Lista de facturas
│       └── [id]/page.tsx               # Detalle de factura
└── customer/
    └── invoices/
        └── page.tsx                    # Facturas del cliente
```

---

## 🔧 **Implementación Paso a Paso**

### **PASO 1: Configurar Modelo de Datos**

#### 1.1 Actualizar Schema de Prisma
```bash
# Editar prisma/schema.prisma
# Agregar modelo Invoice
```

#### 1.2 Crear Migración
```bash
npx prisma migrate dev --name add_invoices
```

#### 1.3 Generar Cliente Prisma
```bash
npx prisma generate
```

---

### **PASO 2: Implementar Generador de PDF**

#### 2.1 Instalar Dependencias
```bash
pnpm add @react-pdf/renderer
pnpm add -D @types/react-pdf
```

#### 2.2 Crear Plantilla de Factura (`lib/invoice/templates/invoice-template.tsx`)

```tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #A50034',
    paddingBottom: 10,
  },
  // ... más estilos
})

export const InvoiceTemplate = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header con logo y datos de la empresa */}
      <View style={styles.header}>
        <Text style={{ fontSize: 20, color: '#A50034', fontWeight: 'bold' }}>
          TecnoCity
        </Text>
        <Text>Servicio Técnico Especializado</Text>
        <Text>NIT: 900.XXX.XXX-X</Text>
      </View>

      {/* Información de la factura */}
      <View style={styles.invoiceInfo}>
        <Text>FACTURA No: {invoice.invoiceNumber}</Text>
        <Text>Fecha: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
        <Text>Orden: {invoice.order.orderNumber}</Text>
      </View>

      {/* Datos del cliente */}
      <View style={styles.clientInfo}>
        <Text style={{ fontWeight: 'bold' }}>CLIENTE:</Text>
        <Text>{invoice.clientName}</Text>
        <Text>{invoice.clientAddress}</Text>
        <Text>{invoice.clientPhone}</Text>
      </View>

      {/* Detalles del servicio */}
      <View style={styles.serviceDetails}>
        <Text style={{ fontWeight: 'bold' }}>DETALLES DEL SERVICIO:</Text>
        <Text>Tipo: {invoice.serviceType}</Text>
        <Text>Electrodoméstico: {invoice.applianceType}</Text>
        <Text>Descripción: {invoice.serviceDescription}</Text>
      </View>

      {/* Tabla de costos */}
      <View style={styles.costsTable}>
        <View style={styles.tableRow}>
          <Text>Mano de obra</Text>
          <Text>${invoice.laborCost?.toLocaleString()}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>Repuestos</Text>
          <Text>${invoice.partsCost?.toLocaleString()}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>Transporte</Text>
          <Text>${invoice.transportCost?.toLocaleString()}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.tableRow}>
          <Text>Subtotal</Text>
          <Text>${invoice.subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>IVA (19%)</Text>
          <Text>${invoice.iva.toLocaleString()}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
          <Text style={{ fontWeight: 'bold' }}>${invoice.total.toLocaleString()}</Text>
        </View>
      </View>

      {/* Método de pago */}
      <View style={styles.paymentInfo}>
        <Text>Método de pago: {invoice.paymentMethod}</Text>
        <Text>Estado: {invoice.paymentStatus}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Gracias por confiar en TecnoCity</Text>
        <Text>www.tecnocity.com | contacto@tecnocity.com</Text>
      </View>
    </Page>
  </Document>
)
```

#### 2.3 Crear Generador (`lib/invoice/generator.ts`)

```typescript
import { renderToStream } from '@react-pdf/renderer'
import { InvoiceTemplate } from './templates/invoice-template'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function generateInvoicePDF(invoice: any): Promise<string> {
  const stream = await renderToStream(<InvoiceTemplate invoice={invoice} />)

  // Guardar en carpeta pública
  const fileName = `invoice-${invoice.invoiceNumber}.pdf`
  const filePath = join(process.cwd(), 'public', 'invoices', fileName)

  await writeFile(filePath, stream)

  return `/invoices/${fileName}`
}
```

---

### **PASO 3: Implementar Generador de Números de Factura**

#### 3.1 Crear Generador (`lib/invoice/invoice-number.ts`)

```typescript
import { prisma } from '@/lib/prisma'

export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Obtener el último número de factura del mes
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      fiscalYear: currentYear,
      fiscalMonth: currentMonth,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  let sequential = 1
  if (lastInvoice) {
    // Extraer número secuencial del último número de factura
    const parts = lastInvoice.invoiceNumber.split('-')
    sequential = parseInt(parts[parts.length - 1]) + 1
  }

  // Formato: FAC-2024-01-0001
  return `FAC-${currentYear}-${currentMonth.toString().padStart(2, '0')}-${sequential.toString().padStart(4, '0')}`
}
```

---

### **PASO 4: Implementar API de Facturación**

#### 4.1 Generar Factura (`app/api/invoices/generate/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInvoiceNumber } from '@/lib/invoice/invoice-number'
import { generateInvoicePDF } from '@/lib/invoice/generator'

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethod, paymentReference } = await request.json()

    // Obtener orden completa
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        assignments: {
          include: { technician: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Calcular costos
    const assignment = order.assignments[0]
    const laborCost = assignment?.costoManoObra || 0
    const partsCost = assignment?.costoRepuestos || 0
    const transportCost = 0 // Configurar según necesidad

    const subtotal = Number(laborCost) + Number(partsCost) + Number(transportCost)
    const iva = subtotal * 0.19
    const total = subtotal + iva

    // Generar número de factura
    const invoiceNumber = await generateInvoiceNumber()

    // Crear factura en base de datos
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,
        clientName: order.nombre,
        clientEmail: order.email,
        clientPhone: order.telefono,
        clientAddress: order.direccion,
        clientCity: order.ciudad,
        serviceType: order.tipoServicio,
        serviceDescription: order.descripcionProblema || '',
        applianceType: order.tipoElectrodomestico,
        subtotal,
        iva,
        total,
        laborCost,
        partsCost,
        transportCost,
        paymentMethod,
        paymentStatus: 'paid',
        paymentDate: new Date(),
        paymentReference,
        fiscalYear: new Date().getFullYear(),
        fiscalMonth: new Date().getMonth() + 1,
      },
      include: {
        order: true,
      },
    })

    // Generar PDF
    const pdfUrl = await generateInvoicePDF(invoice)

    // Actualizar factura con URL del PDF
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdfUrl },
    })

    return NextResponse.json({
      success: true,
      invoice: { ...invoice, pdfUrl }
    })

  } catch (error) {
    console.error('Error generando factura:', error)
    return NextResponse.json(
      { error: 'Error generando factura' },
      { status: 500 }
    )
  }
}
```

---

### **PASO 5: Implementar Envío por Email**

#### 5.1 Instalar Resend
```bash
pnpm add resend
```

#### 5.2 Configurar Variables de Entorno
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

#### 5.3 Crear Servicio de Email (`lib/invoice/email-sender.ts`)

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceByEmail(invoice: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TecnoCity <facturas@tecnocity.com>',
      to: [invoice.clientEmail],
      subject: `Factura ${invoice.invoiceNumber} - TecnoCity`,
      html: `
        <h1>Gracias por confiar en TecnoCity</h1>
        <p>Hola ${invoice.clientName},</p>
        <p>Adjuntamos la factura de tu servicio:</p>
        <ul>
          <li><strong>Número de Factura:</strong> ${invoice.invoiceNumber}</li>
          <li><strong>Orden:</strong> ${invoice.order.orderNumber}</li>
          <li><strong>Total:</strong> $${invoice.total.toLocaleString()}</li>
        </ul>
        <p>Puedes descargar tu factura desde el siguiente enlace:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}${invoice.pdfUrl}">Descargar Factura</a>
      `,
      attachments: [
        {
          filename: `factura-${invoice.invoiceNumber}.pdf`,
          path: `${process.env.NEXT_PUBLIC_APP_URL}${invoice.pdfUrl}`,
        },
      ],
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error enviando email:', error)
    throw error
  }
}
```

---

### **PASO 6: Implementar Envío por WhatsApp**

#### 6.1 Usar API de WhatsApp Business

```typescript
// lib/invoice/whatsapp-sender.ts
export async function sendInvoiceByWhatsApp(invoice: any) {
  const phone = invoice.clientPhone.replace(/\D/g, '') // Limpiar número
  const message = `
¡Hola ${invoice.clientName}! 👋

Gracias por confiar en TecnoCity. Tu servicio ha sido completado.

📄 *Factura:* ${invoice.invoiceNumber}
🔧 *Orden:* ${invoice.order.orderNumber}
💰 *Total:* $${invoice.total.toLocaleString()}

Descarga tu factura aquí:
${process.env.NEXT_PUBLIC_APP_URL}${invoice.pdfUrl}

¿Tienes alguna pregunta? Estamos para ayudarte.
  `.trim()

  // Opción 1: WhatsApp Business API (requiere cuenta business)
  // Opción 2: Link de WhatsApp Web (más simple)
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  // Para envío automático, necesitarías integrar con WhatsApp Business API
  // Por ahora, retornamos el URL para que el admin lo envíe manualmente

  return { success: true, whatsappUrl }
}
```

---

## 📱 **Interfaz de Usuario**

### **Panel de Administrador**

#### Vista de Lista de Facturas
```tsx
// app/admin/invoices/page.tsx
- Tabla con todas las facturas
- Filtros: fecha, cliente, estado de pago
- Acciones: Ver, Descargar, Reenviar
```

#### Generar Factura desde Orden
```tsx
// Botón en /admin/orders/[id]
- "Generar Factura"
- Modal con formulario de pago
- Seleccionar método de pago
- Ingresar referencia de pago
- Generar y enviar automáticamente
```

### **Panel de Cliente**

#### Mis Facturas
```tsx
// app/customer/invoices/page.tsx
- Lista de facturas del cliente
- Descargar PDF
- Ver detalles
- Solicitar reenvío
```

---

## ✅ **Checklist de Implementación**

### Base de Datos
- [x] Crear modelo Invoice en Prisma
- [x] Ejecutar migración
- [x] Actualizar relaciones

### Backend
- [x] Implementar generador de números de factura
- [x] Implementar generador de PDF
- [ ] Crear API de generación de facturas
- [ ] Crear API de envío de facturas
- [ ] Implementar servicio de email
- [ ] Implementar servicio de WhatsApp

### Frontend
- [ ] Crear componente de vista previa de factura
- [ ] Crear página de lista de facturas (admin)
- [ ] Crear página de lista de facturas (cliente)
- [ ] Agregar botón "Generar Factura" en orden
- [ ] Crear modal de generación de factura

### Testing
- [ ] Probar generación de factura
- [ ] Probar envío por email
- [ ] Probar envío por WhatsApp
- [ ] Probar descarga de PDF
- [ ] Probar numeración secuencial

---

## 🚀 **Orden de Implementación Recomendado**

1. **Día 1:** Base de datos y modelo (✅ Completado)
2. **Día 2:** Generador de PDF y números (✅ Completado - ver `lib/invoice`)
3. **Día 3:** API de generación (🚧 Pendiente)
4. **Día 4:** Envío por email (🚧 Pendiente)
5. **Día 5:** Interfaz de usuario (🚧 Pendiente)
6. **Día 6:** Testing y ajustes (🚧 Pendiente)

---

## 💡 **Consideraciones Adicionales**

### Seguridad
- Validar permisos antes de generar facturas
- Solo el cliente puede ver sus propias facturas
- Proteger rutas de descarga de PDF

### Performance
- Generar PDFs de forma asíncrona
- Cachear facturas generadas
- Optimizar consultas a base de datos

### Legal (Colombia)
- Incluir NIT de la empresa
- Numeración consecutiva
- Retención de facturas por 5 años
- Considerar integración con DIAN para facturación electrónica oficial

---

## 📞 **Soporte y Mantenimiento**

### Logs
- Registrar todas las generaciones de facturas
- Registrar envíos de email y WhatsApp
- Alertas en caso de errores

### Backups
- Backup diario de PDFs generados
- Backup de base de datos de facturas

---

**Estado Actual: En Progreso** 🚀
El modelo de datos y las utilidades core (generador PDF) ya existen. Falta exponer la funcionalidad vía API y conectar la UI.
