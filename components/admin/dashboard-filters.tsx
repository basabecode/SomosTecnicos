/**
 * Componente de Filtros Avanzados para el Dashboard
 * Permite filtrar datos por múltiples criterios
 */

'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface FilterConfig {
  estado?: string
  urgencia?: string
  ciudad?: string
  fechaInicio?: Date
  fechaFin?: Date
  tecnico?: string
}

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterConfig) => void
  ciudades?: string[]
  tecnicos?: Array<{ id: string; nombre: string }>
}

export function DashboardFilters({
  onFilterChange,
  ciudades = [],
  tecnicos = [],
}: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>({})
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof FilterConfig, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilter = (key: keyof FilterConfig) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  const activeFiltersCount = Object.keys(filters).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avanzados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Filtra los datos del dashboard por múltiples criterios
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Filtro de Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.estado}
                onValueChange={(value) => handleFilterChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="asignado">Asignado</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Urgencia */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Urgencia</label>
              <Select
                value={filters.urgencia}
                onValueChange={(value) => handleFilterChange('urgencia', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las urgencias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Ciudad */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad</label>
              <Select
                value={filters.ciudad}
                onValueChange={(value) => handleFilterChange('ciudad', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ciudades" />
                </SelectTrigger>
                <SelectContent>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Fecha Inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fechaInicio ? (
                      format(filters.fechaInicio, 'PPP', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.fechaInicio}
                    onSelect={(date) => handleFilterChange('fechaInicio', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro de Fecha Fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fechaFin ? (
                      format(filters.fechaFin, 'PPP', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.fechaFin}
                    onSelect={(date) => handleFilterChange('fechaFin', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro de Técnico */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Técnico</label>
              <Select
                value={filters.tecnico}
                onValueChange={(value) => handleFilterChange('tecnico', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los técnicos" />
                </SelectTrigger>
                <SelectContent>
                  {tecnicos.map((tecnico) => (
                    <SelectItem key={tecnico.id} value={tecnico.id}>
                      {tecnico.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros Activos */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Filtros Activos:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8 text-xs"
                >
                  Limpiar Todo
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.estado && (
                  <Badge variant="secondary" className="gap-1">
                    Estado: {filters.estado}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter('estado')}
                    />
                  </Badge>
                )}
                {filters.urgencia && (
                  <Badge variant="secondary" className="gap-1">
                    Urgencia: {filters.urgencia}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter('urgencia')}
                    />
                  </Badge>
                )}
                {filters.ciudad && (
                  <Badge variant="secondary" className="gap-1">
                    Ciudad: {filters.ciudad}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter('ciudad')}
                    />
                  </Badge>
                )}
                {filters.fechaInicio && (
                  <Badge variant="secondary" className="gap-1">
                    Desde: {format(filters.fechaInicio, 'dd/MM/yyyy')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter('fechaInicio')}
                    />
                  </Badge>
                )}
                {filters.fechaFin && (
                  <Badge variant="secondary" className="gap-1">
                    Hasta: {format(filters.fechaFin, 'dd/MM/yyyy')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter('fechaFin')}
                    />
                  </Badge>
                )}
                {filters.tecnico && (
                  <Badge variant="secondary" className="gap-1">
                    Técnico: {tecnicos.find(t => t.id === filters.tecnico)?.nombre}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter('tecnico')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
