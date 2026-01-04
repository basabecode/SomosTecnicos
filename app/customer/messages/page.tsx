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
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  Archive,
  Star,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSearchParams } from 'next/navigation'

interface Message {
  id: string
  subject: string
  content: string
  from: {
    name: string
    role: 'customer' | 'technician' | 'support'
    avatar?: string
  }
  to: {
    name: string
    role: 'customer' | 'technician' | 'support'
    avatar?: string
  }
  timestamp: string
  status: 'read' | 'unread' | 'replied'
  priority: 'low' | 'medium' | 'high'
  category: 'service' | 'support' | 'billing' | 'warranty'
  relatedOrder?: string
}

const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    subject: 'Actualización del servicio ORD-2024-0234',
    content:
      'Hola! Te informo que he completado la reparación de tu lavadora. El problema era una obstrucción en la bomba de drenaje. Ya está funcionando perfectamente. La garantía del servicio es de 90 días.',
    from: {
      name: 'Carlos Mendoza',
      role: 'technician',
      avatar: '/placeholder-user.jpg',
    },
    to: {
      name: 'Juan Pérez',
      role: 'customer',
    },
    timestamp: '2024-01-16T14:30:00Z',
    status: 'unread',
    priority: 'medium',
    category: 'service',
    relatedOrder: 'ORD-2024-0234',
  },
  {
    id: 'MSG-002',
    subject: 'Consulta sobre garantía',
    content:
      'Estimado equipo de soporte, tengo una pregunta sobre la garantía de un servicio realizado hace 2 meses. ¿Podrían ayudarme con información sobre qué cubre exactamente?',
    from: {
      name: 'Juan Pérez',
      role: 'customer',
    },
    to: {
      name: 'Soporte Técnico',
      role: 'support',
      avatar: '/placeholder-user.jpg',
    },
    timestamp: '2024-01-15T10:15:00Z',
    status: 'replied',
    priority: 'low',
    category: 'warranty',
  },
  {
    id: 'MSG-003',
    subject: 'Recordatorio de cita programada',
    content:
      'Te recordamos que tienes una cita programada para mañana a las 2:00 PM para el mantenimiento de tu nevera. Por favor confirma tu disponibilidad.',
    from: {
      name: 'Sistema Automático',
      role: 'support',
    },
    to: {
      name: 'Juan Pérez',
      role: 'customer',
    },
    timestamp: '2024-01-14T16:00:00Z',
    status: 'read',
    priority: 'high',
    category: 'service',
    relatedOrder: 'ORD-2024-0235',
  },
]


export default function CustomerMessages() {
  const searchParams = useSearchParams()
  const initialServiceId = searchParams.get('serviceId')
  const initialTechnician = searchParams.get('technician')

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'read' | 'unread' | 'replied'
  >('all')
  const [newMessage, setNewMessage] = useState('')

  // Simular inicio de conversación si vienen parámetros
  if (initialServiceId && !selectedMessage && !newMessage) {
     // En una implementación real, esto abriría un modal de composición o buscaría el hilo existente
     // Por ahora, podemos pre-llenar el filtro o mostrar un indicador visual
     // console.log(`Starting chat with ${initialTechnician} for service ${initialServiceId}`)
  }

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || message.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            No leído
          </Badge>
        )
      case 'read':
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Leído
          </Badge>
        )
      case 'replied':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Send className="h-3 w-3 mr-1" />
            Respondido
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'service':
        return <MessageSquare className="h-4 w-4" />
      case 'support':
        return <User className="h-4 w-4" />
      case 'billing':
        return <Star className="h-4 w-4" />
      case 'warranty':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-2">Comunícate con técnicos y soporte</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Nuevo Mensaje
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Buscar mensajes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className="justify-start"
                    onClick={() => setStatusFilter('all')}
                  >
                    Todos ({mockMessages.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'unread' ? 'default' : 'ghost'}
                    size="sm"
                    className="justify-start"
                    onClick={() => setStatusFilter('unread')}
                  >
                    No leídos (
                    {mockMessages.filter(m => m.status === 'unread').length})
                  </Button>
                  <Button
                    variant={statusFilter === 'replied' ? 'default' : 'ghost'}
                    size="sm"
                    className="justify-start"
                    onClick={() => setStatusFilter('replied')}
                  >
                    Respondidos (
                    {mockMessages.filter(m => m.status === 'replied').length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <div className="space-y-2">
            {filteredMessages.map(message => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${getPriorityColor(
                  message.priority
                )} ${
                  selectedMessage?.id === message.id
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.from.avatar} />
                        <AvatarFallback>
                          {message.from.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {message.from.name}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {message.from.role}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(message.status)}
                  </div>

                  <h4 className="font-medium text-sm mb-1 line-clamp-1">
                    {message.subject}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {message.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(message.category)}
                      <span className="capitalize">{message.category}</span>
                    </div>
                    <span>
                      {new Date(message.timestamp).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {selectedMessage.subject}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedMessage.from.avatar} />
                        <AvatarFallback className="text-xs">
                          {selectedMessage.from.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedMessage.from.name}</span>
                      <span>•</span>
                      <span>
                        {new Date(selectedMessage.timestamp).toLocaleString(
                          'es-CO'
                        )}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedMessage.status)}
                    <Badge variant="outline" className="capitalize">
                      {selectedMessage.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {selectedMessage.relatedOrder && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Relacionado con orden: {selectedMessage.relatedOrder}
                    </p>
                  </div>
                )}

                <div className="prose prose-sm max-w-none">
                  <p>{selectedMessage.content}</p>
                </div>

                <Separator />

                {/* Reply Section */}
                <div className="space-y-4">
                  <Label>Responder</Label>
                  <Textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Respuesta
                    </Button>
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archivar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-fit">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecciona un mensaje
                </h3>
                <p className="text-gray-600">
                  Elige un mensaje de la lista para ver su contenido completo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
