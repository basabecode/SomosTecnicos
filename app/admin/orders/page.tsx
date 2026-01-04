/**
 * Página de Gestión de Órdenes
 * Lista, filtra y gestiona todas las órdenes del sistema
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  User,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react'

interface Order {
  id: string
  numeroOrden: string
  nombre: string
  telefono: string
  email: string
  ciudad: string
  direccion: string
  tipoElectrodomestico: string
  tipoServicio: string
  estado: string
  urgencia: string
  createdAt: string
  assignment?: {
    technician: {
      id: number
      nombre: string
    }
  }
  costoEstimado?: number
  costoFinal?: number
}

const statusColors = {
  pendiente: 'bg-orange-100 text-orange-800 border-orange-200',
  asignado: 'bg-blue-100 text-blue-800 border-blue-200',
  en_camino: 'bg-purple-100 text-purple-800 border-purple-200',
  en_proceso: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  esperando_repuestos: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completado: 'bg-green-100 text-green-800 border-green-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
  reagendado: 'bg-gray-100 text-gray-800 border-gray-200',
}

const statusLabels = {
  pendiente: 'Pendiente',
  asignado: 'Asignado',
  en_camino: 'En Camino',
  en_proceso: 'En Proceso',
  esperando_repuestos: 'Esperando Repuestos',
  completado: 'Completado',
  cancelado: 'Cancelado',
  reagendado: 'Reagendado',
}

const urgencyColors = {
  baja: 'text-green-600',
  media: 'text-orange-600',
  alta: 'text-red-600',
}

const urgencyLabels = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const searchParams = useSearchParams()

  useEffect(() => {
    // Inicializar filtros desde URL
    const status = searchParams.get('status')
    const urgency = searchParams.get('urgency')
    const search = searchParams.get('search')

    if (status) setStatusFilter(status)
    if (urgency) setUrgencyFilter(urgency)
    if (search) setSearchTerm(search)
  }, [searchParams])

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, urgencyFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })

      if (statusFilter !== 'all') params.append('estado', statusFilter)
      if (urgencyFilter !== 'all') params.append('urgencia', urgencyFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data.orders)
        setTotalPages(data.data.pagination.totalPages)
        setTotalItems(data.data.pagination.totalItems)
      } else {
        // Datos mock si la API no responde
        const mockOrders: Order[] = [
          {
            id: '1',
            numeroOrden: 'ORD-001',
            nombre: 'María García',
            telefono: '+573001234567',
            email: 'maria@email.com',
            ciudad: 'Bogotá',
            direccion: 'Calle 123 #45-67',
            tipoElectrodomestico: 'nevera',
            tipoServicio: 'reparacion',
            estado: 'pendiente',
            urgencia: 'alta',
            createdAt: new Date().toISOString(),
            costoEstimado: 150000,
          },
          {
            id: '2',
            numeroOrden: 'ORD-002',
            nombre: 'Carlos López',
            telefono: '+573007654321',
            email: 'carlos@email.com',
            ciudad: 'Medellín',
            direccion: 'Carrera 456 #78-90',
            tipoElectrodomestico: 'lavadora',
            tipoServicio: 'mantenimiento',
            estado: 'en_proceso',
            urgencia: 'media',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            assignment: {
              technician: {
                id: 1,
                nombre: 'Juan Pérez',
              },
            },
            costoEstimado: 120000,
          },
          {
            id: '3',
            numeroOrden: 'ORD-003',
            nombre: 'Ana Rodríguez',
            telefono: '+573009876543',
            email: 'ana@email.com',
            ciudad: 'Cali',
            direccion: 'Avenida 789 #12-34',
            tipoElectrodomestico: 'estufa',
            tipoServicio: 'instalacion',
            estado: 'completado',
            urgencia: 'baja',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            assignment: {
              technician: {
                id: 2,
                nombre: 'María García',
              },
            },
            costoEstimado: 200000,
            costoFinal: 180000,
          },
        ]

        setOrders(mockOrders)
        setTotalPages(1)
        setTotalItems(mockOrders.length)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <ProtectedRoute
      requiredRoles={['super_admin', 'admin', 'technician_manager']}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Órdenes de Servicio
            </h1>
            <p className="text-muted-foreground">
              Gestiona y supervisa todas las órdenes del sistema
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/orders/create">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Link>
          </Button>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtra y busca órdenes específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, cliente, teléfono..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 md:h-10 text-base md:text-sm" // Larger touch target
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 h-12 md:h-10">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="asignado">Asignado</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-full md:w-48 h-12 md:h-10">
                  <SelectValue placeholder="Urgencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las urgencias</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <Card className="border-0 md:border">
           <CardHeader className="hidden md:block">
            <CardTitle>Órdenes ({totalItems})</CardTitle>
            <CardDescription>
              Lista de todas las órdenes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            {loading ? (
              <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-full h-24 bg-muted animate-pulse rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No se encontraron órdenes
                </p>
              </div>
            ) : (
                <>
                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Orden</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Técnico</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Costo</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-semibold">
                                  {order.numeroOrden}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    urgencyColors[
                                      order.urgencia as keyof typeof urgencyColors
                                    ]
                                  }`}
                                >
                                  {
                                    urgencyLabels[
                                      order.urgencia as keyof typeof urgencyLabels
                                    ]
                                  }
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.nombre}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Phone className="mr-1 h-3 w-3" />
                                  {order.telefono}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  {order.ciudad}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium capitalize">
                                  {order.tipoElectrodomestico}
                                </div>
                                <div className="text-sm text-muted-foreground capitalize">
                                  {order.tipoServicio}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  statusColors[
                                    order.estado as keyof typeof statusColors
                                  ]
                                }
                              >
                                {
                                  statusLabels[
                                    order.estado as keyof typeof statusLabels
                                  ]
                                }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.assignment ? (
                                <div className="flex items-center">
                                  <User className="mr-1 h-3 w-3" />
                                  <span className="text-sm">
                                    {order.assignment.technician.nombre}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  Sin asignar
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatDate(order.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                {order.costoFinal ? (
                                  <div className="font-medium text-green-600">
                                    {formatCurrency(order.costoFinal)}
                                  </div>
                                ) : order.costoEstimado ? (
                                  <div className="text-sm text-muted-foreground">
                                    Est: {formatCurrency(order.costoEstimado)}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/orders/${order.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Ver detalles
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/orders/${order.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </Link>
                                  </DropdownMenuItem>
                                  {order.estado === 'pendiente' && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem asChild>
                                        <Link
                                          href={`/admin/orders/${order.id}/assign`}
                                        >
                                          <User className="mr-2 h-4 w-4" />
                                          Asignar Técnico
                                        </Link>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                      <div className="flex justify-between items-start">
                         <div>
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                {order.numeroOrden}
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] h-5 ${
                                    urgencyColors[
                                        order.urgencia as keyof typeof urgencyColors
                                    ]
                                    }`}
                                >
                                    {urgencyLabels[order.urgencia as keyof typeof urgencyLabels]}
                                </Badge>
                            </span>
                            <h4 className="font-semibold text-base mt-1 text-[#A50034]">{order.nombre}</h4>
                         </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                         <Badge
                           variant="outline"
                           className={statusColors[order.estado as keyof typeof statusColors]}
                         >
                            {statusLabels[order.estado as keyof typeof statusLabels]}
                         </Badge>
                         <span className="text-gray-500 text-xs flex items-center gap-1">
                             <Calendar className="w-3 h-3" />
                             {formatDate(order.createdAt)}
                         </span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 space-y-2">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full text-xs">🔧</div>
                             <span className="capitalize font-medium">{order.tipoElectrodomestico} - {order.tipoServicio}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                             <MapPin className="w-4 h-4 ml-0.5" />
                             <span className="text-xs">{order.direccion}, {order.ciudad}</span>
                          </div>
                          {order.assignment && (
                              <div className="flex items-center gap-2 text-blue-600 pt-1 border-t border-gray-100 mt-2">
                                  <User className="w-4 h-4 ml-0.5" />
                                  <span className="text-xs font-medium">Téc: {order.assignment.technician.nombre}</span>
                              </div>
                          )}
                      </div>

                      <Button asChild className="w-full bg-[#A50034] hover:bg-[#8B0028] text-white" size="default">
                         <Link href={`/admin/orders/${order.id}`}>
                            Ver Detalles Completos
                         </Link>
                      </Button>
                    </div>
                  ))}
                </div>
                </>
            )}
          </CardContent>
        </Card>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground hidden md:block">
              Mostrando {(currentPage - 1) * 10 + 1} a{' '}
              {Math.min(currentPage * 10, totalItems)} de {totalItems} ordenes
            </p>
            <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-10 px-4"
              >
                Anterior
              </Button>
              <span className="text-sm mx-2">
                 {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-10 px-4"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
