/**
 * Componente de Exportación de Datos del Técnico
 * Permite exportar su historial personal
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface TechnicianExportButtonProps {
  type: 'my-services' | 'my-stats'
}

export function TechnicianExportButton({ type }: TechnicianExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async (format: 'csv' | 'pdf') => {
    setIsExporting(true)

    try {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        throw new Error('No hay sesión activa. Por favor inicia sesión.')
      }

      const queryParams = new URLSearchParams({
        type,
        format,
      })

      console.log('Exportando:', { type, format, url: `/api/technicians/me/export?${queryParams}` })

      const response = await fetch(`/api/technicians/me/export?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Respuesta del servidor:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.error || errorData?.details || `Error del servidor: ${response.status}`
        console.error('Error en la respuesta:', errorData)
        throw new Error(errorMessage)
      }

      // Verificar que la respuesta es un blob
      const contentType = response.headers.get('content-type')
      console.log('Content-Type:', contentType)

      if (contentType?.includes('application/json')) {
        // Si es JSON, probablemente es un error
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error desconocido al exportar')
      }

      // Obtener el blob de la respuesta
      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error('El archivo exportado está vacío')
      }

      console.log('Blob recibido:', blob.size, 'bytes')

      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Determinar el nombre del archivo
      const timestamp = new Date().toISOString().split('T')[0]
      a.download = `mi_${type}_${timestamp}.${format}`

      document.body.appendChild(a)
      a.click()

      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Reporte exportado exitosamente')
    } catch (error) {
      console.error('Error completo en exportación:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al exportar'
      toast.error(errorMessage)
    } finally {
      setIsExporting(false)
    }
  }

  const getLabel = () => {
    switch (type) {
      case 'my-services':
        return 'Mis Servicios'
      case 'my-stats':
        return 'Mis Estadísticas'
      default:
        return 'Datos'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exportar {getLabel()}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Formato de Exportación</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportData('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          CSV (Excel compatible)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('pdf')} disabled>
          <FileText className="mr-2 h-4 w-4" />
          PDF (Próximamente)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
