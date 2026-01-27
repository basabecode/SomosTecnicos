/**
 * 📊 SomosTécnicos - Reportes Visuales Refactorizados
 * ==============================================
 *
 * Componente principal de reportes completamente refactorizado
 * Siguiendo principios SOLID y arquitectura modular
 */

'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Download, RefreshCw } from 'lucide-react'

// Importar componentes refactorizados
import { ReportFilters } from './ReportFilters'
import { StatsOverview, SecondaryStats } from './StatsOverview'
import { OrdersChart } from './OrdersChart'
import { ServicesChart } from './ServicesChart'
import { TechnicianChart } from './TechnicianChart'
import {
  ReportData,
  ReportFilters as ReportFiltersType,
  generateMockReportData,
} from './types'
import { logger } from '@/lib/logger'

// =============================================
// HOOKS PERSONALIZADOS
// =============================================

/**
 * 🎯 Hook para manejar datos de reportes
 */
function useReportData(filters: ReportFiltersType) {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      logger.info('Fetching report data', {
        component: 'visual-reports',
        action: 'fetch_data',
        metadata: { filters },
      })

      const token = localStorage.getItem('accessToken')
      const response = await fetch(
        `/api/reports/dashboard?range=${filters.timeRange}&chart=${filters.chartType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const result = await response.json()
        setData(result.data)
        logger.info('Report data fetched successfully', {
          component: 'visual-reports',
          action: 'fetch_success',
        })
      } else {
        // Fallback a datos mock para desarrollo
        logger.warn('API unavailable, using mock data', {
          component: 'visual-reports',
          action: 'fallback_mock',
        })
        setData(generateMockReportData())
      }
    } catch (error) {
      logger.error('Error fetching report data', error as Error, {
        component: 'visual-reports',
        action: 'fetch_error',
      })

      // Fallback a datos mock en caso de error
      setData(generateMockReportData())
      setError('Error cargando datos. Mostrando datos de ejemplo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filters.timeRange, filters.chartType])

  return { data, loading, error, refetch: fetchData }
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export function VisualReports() {
  // Estado de filtros
  const [filters, setFilters] = useState<ReportFiltersType>({
    timeRange: '6m',
    chartType: 'orders',
  })

  // Hook de datos
  const { data, loading, error, refetch } = useReportData(filters)

  // Manejadores de eventos
  const handleFiltersChange = (newFilters: Partial<ReportFiltersType>) => {
    logger.info('Report filters changed', {
      component: 'visual-reports',
      action: 'filters_change',
      metadata: { previous: filters, new: newFilters },
    })

    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleExport = async () => {
    try {
      logger.audit('report_export_started', 'system', {
        filters,
        action: 'export_report',
      })

      // Simular exportación (implementar según necesidades)
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-${filters.timeRange}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      logger.info('Report exported successfully', {
        component: 'visual-reports',
        action: 'export_success',
      })
    } catch (error) {
      logger.error('Export failed', error as Error, {
        component: 'visual-reports',
        action: 'export_error',
      })
    }
  }

  const handleRefresh = () => {
    logger.info('Manual report refresh triggered', {
      component: 'visual-reports',
      action: 'manual_refresh',
    })
    refetch()
  }

  return (
    <div className="space-y-6">
      {/* 🎛️ Filtros */}
      <ReportFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        loading={loading}
      />

      {/* ⚠️ Error Alert */}
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 📊 Estadísticas Resumidas */}
      {data && (
        <>
          <StatsOverview data={data.monthlyStats} loading={loading} />
          <SecondaryStats data={data.monthlyStats} loading={loading} />
        </>
      )}

      {/* 📈 Gráficos en Pestañas */}
      <Tabs
        value={filters.chartType}
        onValueChange={value =>
          handleFiltersChange({
            chartType: value as ReportFiltersType['chartType'],
          })
        }
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="performance">Técnicos</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
        </TabsList>

        {/* 📊 Gráfico de Órdenes */}
        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-6">
            {data && (
              <OrdersChart
                data={data.ordersOverTime}
                loading={loading}
                chartType="bar"
                showRevenue={false}
              />
            )}
          </div>
        </TabsContent>

        {/* 🥧 Gráfico de Servicios */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {data && (
              <>
                <ServicesChart
                  data={data.serviceTypes}
                  loading={loading}
                  chartType="pie"
                  metric="count"
                />
                <ServicesChart
                  data={data.serviceTypes}
                  loading={loading}
                  chartType="bar"
                  metric="revenue"
                />
              </>
            )}
          </div>
        </TabsContent>

        {/* 👷 Gráfico de Técnicos */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6">
            {data && (
              <>
                <TechnicianChart
                  data={data.technicianPerformance}
                  loading={loading}
                  chartType="bar"
                  metric="jobs"
                />
                <div className="md:grid-cols-2 grid gap-6">
                  <TechnicianChart
                    data={data.technicianPerformance}
                    loading={loading}
                    chartType="scatter"
                    metric="rating"
                  />
                  <TechnicianChart
                    data={data.technicianPerformance}
                    loading={loading}
                    chartType="table"
                    metric="efficiency"
                  />
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* 💰 Gráfico de Ingresos */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-6">
            {data && (
              <>
                <OrdersChart
                  data={data.ordersOverTime}
                  loading={loading}
                  chartType="area"
                  showRevenue={true}
                />
                <ServicesChart
                  data={data.serviceTypes}
                  loading={loading}
                  chartType="bar"
                  metric="revenue"
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 📊 Resumen final */}
      {data && !loading && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Resumen del Período</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total de órdenes:</span>
              <span className="font-medium ml-2">
                {data.monthlyStats.totalOrders}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Tasa de éxito:</span>
              <span className="font-medium ml-2">
                {(
                  (data.monthlyStats.completedOrders /
                    data.monthlyStats.totalOrders) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Crecimiento:</span>
              <span
                className={`font-medium ml-2 ${
                  data.monthlyStats.growth >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {data.monthlyStats.growth > 0 ? '+' : ''}
                {data.monthlyStats.growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
