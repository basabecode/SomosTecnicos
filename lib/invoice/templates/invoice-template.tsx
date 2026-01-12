/**
 * Plantilla de Factura Electrónica en PDF
 * Usando @react-pdf/renderer
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    marginBottom: 20,
    borderBottom: '3px solid #A50034',
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A50034',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 9,
    color: '#2C3E50',
    marginBottom: 2,
  },

  // Invoice Info
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 5,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  invoiceDetail: {
    fontSize: 9,
    color: '#7F8C8D',
    marginBottom: 3,
  },

  // Client Info
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    borderBottom: '1px solid #E0E0E0',
    paddingBottom: 5,
  },
  infoRow: {
    fontSize: 9,
    color: '#2C3E50',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#7F8C8D',
  },

  // Service Details
  serviceBox: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  serviceText: {
    fontSize: 9,
    color: '#2C3E50',
    marginBottom: 3,
  },

  // Costs Table
  table: {
    marginTop: 15,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    padding: 8,
    borderRadius: 3,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E0E0E0',
    padding: 8,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '1px solid #E0E0E0',
    padding: 8,
    backgroundColor: '#F8F9FA',
  },
  tableCell: {
    fontSize: 9,
    color: '#2C3E50',
  },
  tableCellRight: {
    fontSize: 9,
    color: '#2C3E50',
    textAlign: 'right',
  },

  // Totals
  totalsSection: {
    marginTop: 10,
    borderTop: '2px solid #2C3E50',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 10,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#A50034',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Payment Info
  paymentBox: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
    borderLeft: '4px solid #27AE60',
  },
  paymentText: {
    fontSize: 9,
    color: '#2C3E50',
    marginBottom: 3,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1px solid #E0E0E0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#7F8C8D',
    marginBottom: 2,
  },

  // Notes
  notesBox: {
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderLeft: '4px solid #F39C12',
  },
  notesText: {
    fontSize: 8,
    color: '#2C3E50',
    lineHeight: 1.4,
  },
})

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

export const InvoiceTemplate: React.FC<{ invoice: InvoiceData }> = ({
  invoice,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const paymentMethodLabels: Record<string, string> = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia Bancaria',
    nequi: 'Nequi',
    daviplata: 'Daviplata',
    tarjeta: 'Tarjeta de Crédito/Débito',
  }

  const paymentStatusLabels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    cancelled: 'Cancelado',
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Información de la Empresa */}
        <View style={styles.header}>
          <Text style={styles.companyName}>SomosTécnicos</Text>
          <Text style={styles.companyInfo}>
            Servicio Técnico Especializado en Electrodomésticos
          </Text>
          <Text style={styles.companyInfo}>NIT: 900.XXX.XXX-X</Text>
          <Text style={styles.companyInfo}>
            Dirección: Calle 123 #45-67, Bogotá, Colombia
          </Text>
          <Text style={styles.companyInfo}>
            Tel: +57 300 123 4567 | Email: contacto@somostecnicos.com
          </Text>
        </View>

        {/* Invoice Header */}
        <View style={styles.invoiceHeader}>
          <View>
            <Text style={styles.invoiceTitle}>FACTURA ELECTRÓNICA</Text>
            <Text style={styles.invoiceDetail}>
              No: {invoice.invoiceNumber}
            </Text>
            <Text style={styles.invoiceDetail}>
              Orden: {invoice.order.orderNumber}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceDetail}>
              Fecha de Emisión:
            </Text>
            <Text style={styles.invoiceDetail}>
              {formatDate(invoice.createdAt)}
            </Text>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Nombre: </Text>
            {invoice.clientName}
          </Text>
          {invoice.clientDocument && (
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Documento: </Text>
              {invoice.clientDocument}
            </Text>
          )}
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Dirección: </Text>
            {invoice.clientAddress}, {invoice.clientCity}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Teléfono: </Text>
            {invoice.clientPhone}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Email: </Text>
            {invoice.clientEmail}
          </Text>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLES DEL SERVICIO</Text>
          <View style={styles.serviceBox}>
            <Text style={styles.serviceText}>
              <Text style={styles.label}>Tipo de Servicio: </Text>
              {invoice.serviceType}
            </Text>
            <Text style={styles.serviceText}>
              <Text style={styles.label}>Electrodoméstico: </Text>
              {invoice.applianceType}
            </Text>
            <Text style={styles.serviceText}>
              <Text style={styles.label}>Descripción: </Text>
              {invoice.serviceDescription}
            </Text>
          </View>
        </View>

        {/* Costs Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>
              Concepto
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>
              Valor
            </Text>
          </View>

          {invoice.laborCost && invoice.laborCost > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                Mano de Obra
              </Text>
              <Text style={[styles.tableCellRight, { flex: 1 }]}>
                {formatCurrency(invoice.laborCost)}
              </Text>
            </View>
          )}

          {invoice.partsCost && invoice.partsCost > 0 && (
            <View style={styles.tableRowAlt}>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                Repuestos y Materiales
              </Text>
              <Text style={[styles.tableCellRight, { flex: 1 }]}>
                {formatCurrency(invoice.partsCost)}
              </Text>
            </View>
          )}

          {invoice.transportCost && invoice.transportCost > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                Transporte
              </Text>
              <Text style={[styles.tableCellRight, { flex: 1 }]}>
                {formatCurrency(invoice.transportCost)}
              </Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (19%):</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.iva)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL A PAGAR:</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentText}>
            <Text style={styles.label}>Método de Pago: </Text>
            {paymentMethodLabels[invoice.paymentMethod] || invoice.paymentMethod}
          </Text>
          <Text style={styles.paymentText}>
            <Text style={styles.label}>Estado: </Text>
            {paymentStatusLabels[invoice.paymentStatus] || invoice.paymentStatus}
          </Text>
          {invoice.paymentDate && (
            <Text style={styles.paymentText}>
              <Text style={styles.label}>Fecha de Pago: </Text>
              {formatDate(invoice.paymentDate)}
            </Text>
          )}
          {invoice.paymentReference && (
            <Text style={styles.paymentText}>
              <Text style={styles.label}>Referencia: </Text>
              {invoice.paymentReference}
            </Text>
          )}
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>
              <Text style={styles.label}>Notas: </Text>
              {invoice.notes}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gracias por confiar en SomosTécnicos - Su satisfacción es nuestra prioridad
          </Text>
          <Text style={styles.footerText}>
            www.somostecnicos.com | WhatsApp: +57 300 123 4567
          </Text>
          <Text style={styles.footerText}>
            Este documento es una representación impresa de una factura electrónica
          </Text>
        </View>
      </Page>
    </Document>
  )
}
