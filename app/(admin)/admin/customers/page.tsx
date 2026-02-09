/**
 * Página de Gestión de Clientes
 * Permite visualizar, buscar y validar información de clientes registrados.
 */

'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/contexts/auth-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Mail,
  Clock,
  History
} from 'lucide-react'

interface Customer {
  id: number
  nombreCompleto: string
  email: string
  telefono: string
  ciudad: string | null
  direccion: string | null
  createdAt: string
  ultimaSolicitud: string | null
  totalOrdenes: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    fetchCustomers()
  }, [searchTerm])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const params = new URLSearchParams({
        limit: '50', // Traemos bastantes para tener visión general
      })

      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/customers?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
        setTotalItems(data.customers.length) // La API actual devuelve array, no paginación compleja aún en el root
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Helper para detectar inactividad (ej: más de 3 meses sin solicitar)
  const isInactive = (dateString: string | null) => {
      if (!dateString) return true // Nunca ha pedido
      const last = new Date(dateString).getTime()
      const now = Date.now()
      const diffDays = (now - last) / (1000 * 3600 * 24)
      return diffDays > 90
  }

  const getInactivityBadge = (dateString: string | null) => {
      if (!dateString) return <Badge variant="outline" className="text-gray-500 border-gray-200">Sin Solicitudes</Badge>

      const last = new Date(dateString).getTime()
      const now = Date.now()
      const diffDays = (now - last) / (1000 * 3600 * 24)

      if (diffDays < 30) return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Activo Reciente</Badge>
      if (diffDays < 90) return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Regular</Badge>
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">Inactivo (+3m)</Badge>
  }

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'technician_manager']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Gestión de Clientes</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Consulta y valida la base de datos de usuarios registrados
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Registrados</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalItems}</div>
                    <p className="text-xs text-muted-foreground">Total en base de datos visualizados</p>
                </CardContent>
            </Card>
            {/* Podríamos agregar más stats calculadas del array 'customers' en el frontend por ahora */}
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Con Solicitudes</CardTitle>
                    <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {customers.filter(c => c.totalOrdenes > 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Clientes con al menos 1 servicio</p>
                </CardContent>
            </Card>
             <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sin Actividad Reciente</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {customers.filter(c => isInactive(c.ultimaSolicitud)).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Sin servicios en los últimos 90 días</p>
                </CardContent>
            </Card>
        </div>

        {/* Search & Validation Area */}
        <Card>
          <CardHeader>
            <CardTitle>Búsqueda y Validación</CardTitle>
            <CardDescription>
              Encuentra clientes por nombre, email o ciudad para validar sus datos
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="relative max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
            <CardHeader>
                 <CardTitle>Listado de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead>Registro</TableHead>
                                <TableHead>Total Servicios</TableHead>
                                <TableHead>Último Servicio</TableHead>
                                <TableHead>Estado Actividad</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Cargando clientes...
                                    </TableCell>
                                </TableRow>
                            ) : customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No se encontraron clientes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">
                                            {customer.nombreCompleto}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Mail className="mr-1 h-3 w-3" />
                                                    {customer.email}
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Phone className="mr-1 h-3 w-3" />
                                                    {customer.telefono}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                                                <span>{customer.ciudad || 'No registrada'}</span>
                                            </div>
                                            {customer.direccion && (
                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={customer.direccion}>
                                                    {customer.direccion}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(customer.createdAt)}
                                        </TableCell>
                                         <TableCell className="text-center">
                                            <Badge variant="secondary">{customer.totalOrdenes}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {customer.ultimaSolicitud ? formatDate(customer.ultimaSolicitud) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {getInactivityBadge(customer.ultimaSolicitud)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
