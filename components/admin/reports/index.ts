/**
 * 📤 SomosTécnicos - Exportaciones de Componentes de Reportes
 * ====================================================
 *
 * Archivo de índice para importaciones limpias y organizadas
 */

// Componente principal
export { VisualReports } from './VisualReports'

// Componentes individuales
export { ReportFilters } from './ReportFilters'
export { StatsOverview, SecondaryStats } from './StatsOverview'
export { OrdersChart } from './OrdersChart'
export { ServicesChart } from './ServicesChart'
export { TechnicianChart } from './TechnicianChart'

// Tipos y utilidades
export type {
  ReportData,
  ReportFilters as ReportFiltersType,
  OrderStats,
  TechnicianPerformance,
  ServiceTypeStats
} from './types'

export {
  formatCurrency,
  formatPercentage,
  formatChartDate,
  formatResponseTime,
  getServiceColor,
  generateMockReportData,
  CHART_COLORS,
  SERVICE_COLORS,
  TIME_RANGES,
  CHART_TYPES
} from './types'
