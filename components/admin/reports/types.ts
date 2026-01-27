/**
 * 🎯 SomosTécnicos - Tipos y Constantes para Reportes
 * ==============================================
 *
 * Tipos TypeScript y constantes compartidas entre componentes de reportes
 */

// =============================================
// TIPOS DE DATOS
// =============================================

export interface OrderStats {
  date: string
  total: number
  completed: number
  cancelled: number
  pending: number
  revenue: number
}

export interface TechnicianPerformance {
  id: number
  name: string
  completedJobs: number
  averageRating: number
  totalEarnings: number
  efficiency: number
  responseTime: number
}

export interface ServiceTypeStats {
  type: string
  count: number
  revenue: number
  averageTime: number
  satisfaction: number
}

export interface ReportData {
  ordersOverTime: OrderStats[]
  technicianPerformance: TechnicianPerformance[]
  serviceTypes: ServiceTypeStats[]
  monthlyStats: {
    totalOrders: number
    completedOrders: number
    activeOrders: number
    cancelledOrders: number
    averageRating: number
    totalRevenue: number
    growth: number
  }
}

export interface ReportFilters {
  timeRange: '1m' | '3m' | '6m' | '1y'
  chartType: 'orders' | 'performance' | 'services' | 'revenue'
  serviceType?: string
  technicianId?: number
}

// =============================================
// CONSTANTES DE UI
// =============================================

export const CHART_COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
] as const

export const SERVICE_COLORS = {
  nevera: '#0088FE',
  lavadora: '#00C49F',
  estufa: '#FFBB28',
  televisor: '#FF8042',
  aire_acondicionado: '#8884D8',
  otros: '#82CA9D',
} as const

export const TIME_RANGES = [
  { value: '1m', label: 'Último mes' },
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '1y', label: 'Último año' },
] as const

export const CHART_TYPES = [
  { value: 'orders', label: 'Órdenes', icon: 'BarChart3' },
  { value: 'performance', label: 'Performance', icon: 'TrendingUp' },
  { value: 'services', label: 'Servicios', icon: 'PieChartIcon' },
  { value: 'revenue', label: 'Ingresos', icon: 'DollarSign' },
] as const

// =============================================
// UTILIDADES
// =============================================

/**
 * 🎨 Obtener color para un tipo de servicio
 */
export function getServiceColor(serviceType: string): string {
  return SERVICE_COLORS[serviceType as keyof typeof SERVICE_COLORS] || SERVICE_COLORS.otros
}

/**
 * 📊 Formatear número como moneda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * 📈 Formatear porcentaje
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * 📅 Formatear fecha para gráficos
 */
export function formatChartDate(date: string): string {
  return new Date(date).toLocaleDateString('es-CO', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 * ⏱️ Formatear tiempo de respuesta
 */
export function formatResponseTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

// =============================================
// DATOS MOCK PARA DESARROLLO
// =============================================

export function generateMockReportData(): ReportData {
  const today = new Date()
  const ordersOverTime: OrderStats[] = []

  // Generar datos de los últimos 30 días
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    ordersOverTime.push({
      date: date.toISOString().split('T')[0],
      total: Math.floor(Math.random() * 20) + 10,
      completed: Math.floor(Math.random() * 15) + 5,
      cancelled: Math.floor(Math.random() * 3),
      pending: Math.floor(Math.random() * 8) + 2,
      revenue: Math.floor(Math.random() * 500000) + 200000
    })
  }

  const technicianPerformance: TechnicianPerformance[] = [
    {
      id: 1,
      name: 'Carlos Rodríguez',
      completedJobs: 45,
      averageRating: 4.8,
      totalEarnings: 2250000,
      efficiency: 95.2,
      responseTime: 25
    },
    {
      id: 2,
      name: 'María González',
      completedJobs: 38,
      averageRating: 4.9,
      totalEarnings: 1900000,
      efficiency: 97.1,
      responseTime: 18
    },
    {
      id: 3,
      name: 'Luis Martínez',
      completedJobs: 52,
      averageRating: 4.6,
      totalEarnings: 2600000,
      efficiency: 89.5,
      responseTime: 32
    }
  ]

  const serviceTypes: ServiceTypeStats[] = [
    {
      type: 'nevera',
      count: 45,
      revenue: 2250000,
      averageTime: 120,
      satisfaction: 4.7
    },
    {
      type: 'lavadora',
      count: 38,
      revenue: 1900000,
      averageTime: 90,
      satisfaction: 4.8
    },
    {
      type: 'estufa',
      count: 32,
      revenue: 1600000,
      averageTime: 85,
      satisfaction: 4.6
    },
    {
      type: 'televisor',
      count: 28,
      revenue: 1400000,
      averageTime: 60,
      satisfaction: 4.5
    },
    {
      type: 'aire_acondicionado',
      count: 25,
      revenue: 1875000,
      averageTime: 150,
      satisfaction: 4.9
    }
  ]

  return {
    ordersOverTime,
    technicianPerformance,
    serviceTypes,
    monthlyStats: {
      totalOrders: 168,
      completedOrders: 142,
      activeOrders: 18,
      cancelledOrders: 8,
      averageRating: 4.7,
      totalRevenue: 9025000,
      growth: 12.5
    }
  }
}
