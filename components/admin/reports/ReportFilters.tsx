/**
 * 🎛️ SomosTécnicos - Filtros de Reportes
 * ==================================
 *
 * Controles para filtrar y configurar los reportes visuales
 */

'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  PieChartIcon,
  DollarSign,
} from 'lucide-react'
import type { ReportFilters as ReportFiltersType } from './types'
import { TIME_RANGES, CHART_TYPES } from './types'
import { logger } from '@/lib/logger'

// =============================================
// PROPS INTERFACE
// =============================================

interface ReportFiltersProps {
  filters: ReportFiltersType
  onFiltersChange: (filters: Partial<ReportFiltersType>) => void
  onExport: () => void
  loading?: boolean
}

// =============================================
// ÍCONOS POR TIPO DE GRÁFICO
// =============================================

const ChartIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'orders':
      return <BarChart3 className="h-4 w-4" />
    case 'performance':
      return <TrendingUp className="h-4 w-4" />
    case 'services':
      return <PieChartIcon className="h-4 w-4" />
    case 'revenue':
      return <DollarSign className="h-4 w-4" />
    default:
      return <BarChart3 className="h-4 w-4" />
  }
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export function ReportFilters({
  filters,
  onFiltersChange,
  onExport,
  loading = false,
}: ReportFiltersProps) {
  const handleTimeRangeChange = (value: string) => {
    logger.info('Time range filter changed', {
      component: 'report-filters',
      action: 'time_range_change',
      metadata: { newRange: value, previousRange: filters.timeRange },
    })

    onFiltersChange({ timeRange: value as ReportFiltersType['timeRange'] })
  }

  const handleChartTypeChange = (value: string) => {
    logger.info('Chart type filter changed', {
      component: 'report-filters',
      action: 'chart_type_change',
      metadata: { newType: value, previousType: filters.chartType },
    })

    onFiltersChange({ chartType: value as ReportFiltersType['chartType'] })
  }

  const handleExport = () => {
    logger.audit('report_export_initiated', 'system', {
      filters,
      action: 'export_report',
    })

    onExport()
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* 📊 Filtros principales */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* ⏰ Rango de tiempo */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.timeRange}
                onValueChange={handleTimeRangeChange}
                disabled={loading}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 📈 Tipo de gráfico */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.chartType}
                onValueChange={handleChartTypeChange}
                disabled={loading}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo de gráfico" />
                </SelectTrigger>
                <SelectContent>
                  {CHART_TYPES.map(chart => (
                    <SelectItem key={chart.value} value={chart.value}>
                      <div className="flex items-center gap-2">
                        <ChartIcon type={chart.value} />
                        {chart.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 🏷️ Badge con filtros activos */}
            <div className="flex items-center gap-2">
              {filters.serviceType && (
                <Badge variant="secondary" className="capitalize">
                  {filters.serviceType.replace('_', ' ')}
                </Badge>
              )}
              {filters.technicianId && (
                <Badge variant="secondary">
                  Técnico #{filters.technicianId}
                </Badge>
              )}
            </div>
          </div>

          {/* 📤 Acciones */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* 📊 Indicador de estado */}
        {loading && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              Cargando datos del reporte...
            </div>
          </div>
        )}

        {/* 📋 Información de filtros aplicados */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                Período:{' '}
                <strong>
                  {TIME_RANGES.find(r => r.value === filters.timeRange)?.label}
                </strong>
              </span>
              <span>
                Vista:{' '}
                <strong>
                  {CHART_TYPES.find(c => c.value === filters.chartType)?.label}
                </strong>
              </span>
            </div>
            <div className="text-xs">
              Última actualización: {new Date().toLocaleTimeString('es-CO')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
