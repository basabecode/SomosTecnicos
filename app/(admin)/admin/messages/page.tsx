'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
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
  Send,
  Archive,
  Star,
  Search,
  CheckCircle2,
  AlertCircle,
  User,
  Loader2,
  RefreshCw,
  Plus,
  ArrowLeft,
  Trash2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { calculateReplyReceiver, getThreadKey } from '@/lib/chat-logic'

interface Message {
  id: string
  subject: string
  content: string
  senderId: string
  senderType: string
  senderName: string
  receiverId: string
  receiverType: string
  createdAt: string
  read: boolean
  priority: 'low' | 'normal' | 'high'
  category: 'service' | 'support' | 'billing' | 'warranty'
  relatedOrder?: string
  orderId?: string
  from?: {
    name: string
    role: string
    avatar?: string
  }
}

export default function AdminMessages() {
  const { user } = useAuth()
  const searchParams = useSearchParams()

  // States
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')

  // Compose
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // New Conversation States
  const [isNewConvOpen, setIsNewConvOpen] = useState(false)
  const [newConvData, setNewConvData] = useState({
    receiverId: '',
    receiverType: 'customer' as 'customer' | 'technician' | 'support',
    orderId: '',
    subject: '',
    content: '',
    category: 'general' as any
  })
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([])

  // Fetch Messages
  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch('/api/messages?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      if (!silent) toast.error('Error al cargar mensajes')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(() => {
      fetchMessages(true) // Polling silencioso
    }, 10000)
    return () => clearInterval(interval)
  }, [user])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (selectedThreadId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedThreadId, messages])



  // -------------------------------------------
  // THREAD GROUPING LOGIC (Robust & Normalized)
  // -------------------------------------------
  const threads = useMemo(() => {
    if (!user) return []

    type Thread = {
      id: string
      messages: Message[]
      lastMessage: Message
      partnerName: string
      partnerRole: string
      partnerId: string
      orderNumber?: string
      unreadCount: number
    }

    const grouped: Record<string, Thread> = {}

    messages.forEach(msg => {
      const isMe = String(msg.senderId) === String(user?.id)

      // 1. DETERMINE THREAD KEY
      const threadKey = getThreadKey(msg, user)

      // 2. INITIALIZE THREAD
      if (!grouped[threadKey]) {
        let pName = 'Usuario'
        let pRole = 'user'
        let pId = ''

        if (msg.orderId) {
           pName = msg.relatedOrder || `Orden #${msg.orderId}`
           pRole = 'service'
        }

        // Try to identify partner from message content
        if (!isMe) {
          // Incoming: Sender is partner
          pName = msg.senderName || 'Usuario'
          pRole = msg.senderType
          pId = msg.senderId
        } else {
          // Outgoing: Receiver is partner
          // Admin specific parsing
          if (msg.receiverType === 'customer') pName = `Cliente (${msg.receiverId})`
          else if (msg.receiverType === 'technician') pName = 'Técnico'
          else if (msg.receiverType === 'support' || msg.receiverId === '0') pName = 'Soporte General'

          pRole = msg.receiverType
          pId = msg.receiverId
        }

        grouped[threadKey] = {
          id: threadKey,
          messages: [],
          lastMessage: msg,
          partnerName: pName,
          partnerRole: pRole,
          partnerId: pId,
          orderNumber: msg.relatedOrder,
          unreadCount: 0
        }
      }

      const thread = grouped[threadKey]
      thread.messages.push(msg)

      // 3. UPDATE LAST MESSAGE & INFO
      if (new Date(msg.createdAt) > new Date(thread.lastMessage.createdAt)) {
        thread.lastMessage = msg
        // Update partner info from newest incoming message
        if (!isMe) {
          // Solo actualizar nombre si tenemos uno real (no genérico)
          if (msg.senderName && msg.senderName !== 'Usuario' && !msg.senderName.startsWith('Cliente (')) {
            thread.partnerName = msg.senderName
          }
          thread.partnerRole = msg.senderType
          thread.partnerId = msg.senderId
        }
      }

      // 4. COUNT UNREAD
      if (!msg.read && String(msg.receiverId) === String(user?.id)) {
        thread.unreadCount++
      }
    })

    // Sort by Date Descending
    return Object.values(grouped).sort((a, b) =>
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )
  }, [messages, user])

  const sortedThreads = threads

  // Filter threads for the list
  const filteredThreads = sortedThreads.filter(thread => {
    const matchesSearch =
      thread.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter logic (simplified: check if last message is unread and received)
    const isUnread = !thread.lastMessage.read && String(thread.lastMessage.receiverId) === String(user?.id)

    if (statusFilter === 'unread' && !isUnread) return false
    if (statusFilter === 'read' && isUnread) return false

    return matchesSearch
  })

  // Mark as Read Logic
  useEffect(() => {
    if (selectedThreadId && user) {
       const thread = threads.find(t => t.id === selectedThreadId)
       if (!thread) return

       const unreadIds = thread.messages
          .filter(m => !m.read && String(m.receiverId) === String(user.id))
          .map(m => m.id)

       if (unreadIds.length > 0) {
          setMessages(prev => prev.map(m =>
             unreadIds.includes(m.id) ? { ...m, read: true } : m
          ))

          const token = localStorage.getItem('accessToken')
          fetch('/api/messages/mark-read', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
             },
             body: JSON.stringify({ messageIds: unreadIds })
          }).catch(err => console.error('Error marking read', err))
       }
    }
  }, [selectedThreadId, threads, user])

  const selectedThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) : null


  // Handle Send Reply
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user) return

    setSending(true)
    try {
      const token = localStorage.getItem('accessToken')
      const lastMsg = selectedThread.lastMessage

      // LOGICA CRITICA DE RESPUESTA CENTRALIZADA
      const { receiverId, receiverType } = calculateReplyReceiver(lastMsg, user, selectedThread)

      const payload = {
        content: newMessage,
        receiverId: receiverId,
        receiverType: receiverType,
        orderId: lastMsg.orderId, // Propagar contexto de orden
        subject: `Re: ${lastMsg.subject || 'Consulta'}`,
        category: lastMsg.category || 'general'
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setNewMessage('')
        fetchMessages() // Refresh immediately
      } else {
        const errorData = await res.json()
        console.error('Error al enviar mensaje:', errorData)
        toast?.error?.('No se pudo enviar el mensaje')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      toast?.error?.('Error de conexión al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  // Fetch metadata for new conversations
  useEffect(() => {
    if (isNewConvOpen) {
      const fetchData = async () => {
        const token = localStorage.getItem('accessToken')
        try {
          const [ordersRes, techRes] = await Promise.all([
            fetch('/api/orders?limit=100', { headers: { Authorization: `Bearer ${token}` }}),
            fetch('/api/technicians?limit=100', { headers: { Authorization: `Bearer ${token}` }})
          ])
          const ordersData = await ordersRes.json()
          const techData = await techRes.json()

          if (ordersData.success) setAvailableOrders(ordersData.orders || ordersData.data?.orders || [])
          if (techData.success) setAvailableTechnicians(techData.data?.technicians || [])
        } catch (err) {
          console.error('Error fetching conversion metadata:', err)
        }
      }
      fetchData()
    }
  }, [isNewConvOpen])

  const handleCreateNewConversation = async () => {
    if (!newConvData.content.trim() || !newConvData.receiverType) {
      toast.error('Por favor completa el contenido y el destinatario')
      return
    }

    // Validar que se haya seleccionado un destinatario específico cuando no es soporte
    if (newConvData.receiverType !== 'support' && !newConvData.receiverId) {
      toast.error('Por favor selecciona un destinatario específico')
      return
    }

    setSending(true)
    try {
      const token = localStorage.getItem('accessToken')

      // Si seleccionó una orden, el receiverId debería ser el cliente o técnico de esa orden
      // Pero por ahora permitimos envío manual

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newConvData,
          subject: newConvData.subject || 'Nueva Consulta'
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Mensaje enviado correctamente')
        setIsNewConvOpen(false)
        setNewConvData({ receiverId: '', receiverType: 'customer', orderId: '', subject: '', content: '', category: 'general' })
        fetchMessages()
      } else {
        toast.error(data.error || 'Error al enviar mensaje')
      }
    } catch (err) {
      toast.error('Error de red al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta conversación? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/messages/thread/${threadId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Conversación eliminada (${data.deletedCount} mensajes)`)
        setSelectedThreadId(null) // Deseleccionar si estaba abierto
        fetchMessages() // Refrescar lista
      } else {
        toast.error(data.error || 'Error al eliminar la conversación')
      }
    } catch (error) {
      console.error('Error deleting thread:', error)
      toast.error('Error de conexión al eliminar')
    }
  }

  // Helper for badges
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'service': return <MessageSquare className="h-4 w-4" />
      case 'support': return <User className="h-4 w-4" />
      case 'billing': return <Star className="h-4 w-4" />
      case 'warranty': return <CheckCircle2 className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buzón de Administración</h1>
          <p className="text-gray-600 mt-2">Gestión de comunicaciones</p>
        </div>
        <Button onClick={() => setIsNewConvOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Mensaje
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 w-full relative">
        {/* Thread List */}
        <div className={`md:col-span-1 flex-col gap-4 min-h-0 overflow-y-auto pr-1 ${selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
          {/* Controls */}
          <Card>
            <CardContent className="p-4 space-y-4">
               {/* Search Block was here in original, I am assuming structure match */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
               </div>
               <div className="flex gap-2">
                 <Button
                   variant={statusFilter === 'all' ? 'default' : 'outline'}
                   size="sm"
                   onClick={() => setStatusFilter('all')}
                   className="flex-1"
                 >
                   Todos
                 </Button>
                 <Button
                   variant={statusFilter === 'unread' ? 'default' : 'outline'}
                   size="sm"
                   onClick={() => setStatusFilter('unread')}
                   className="flex-1"
                 >
                   No leídos
                 </Button>
               </div>
            </CardContent>
          </Card>

          {/* List */}
          <div className="space-y-2 flex-1 overflow-y-auto">
             {loading ? (
               <div className="text-center py-4 text-muted-foreground">
                 <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                 Cargando chats...
               </div>
             ) : filteredThreads.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                 No hay mensajes
               </div>
             ) : (
               filteredThreads.map(thread => {
                 const lastMsg = thread.lastMessage
                 const isSelected = selectedThreadId === thread.id
                 const isUnread = !lastMsg.read && lastMsg.receiverId === user?.id?.toString()

                 return (
                   <Card
                     key={thread.id}
                     className={`cursor-pointer transition-all hover:bg-gray-50 ${isSelected ? 'ring-2 ring-primary border-primary' : ''} ${isUnread ? 'bg-blue-50/50' : ''}`}
                     onClick={() => setSelectedThreadId(thread.id)}
                   >
                     <CardContent className="p-4">
                       <div className="flex justify-between items-start mb-1">
                         <h4 className="font-semibold text-sm truncate pr-2">{thread.partnerName || 'Usuario'}</h4>
                         <span className="text-[10px] text-gray-500 shrink-0">
                           {new Date(lastMsg.createdAt).toLocaleDateString()}
                         </span>
                       </div>

                       {thread.orderNumber && (
                         <Badge variant="secondary" className="mb-2 text-[10px] px-1 h-5">
                           {thread.orderNumber}
                         </Badge>
                       )}

                       <p className={`text-xs line-clamp-2 ${isUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                         {lastMsg.senderId === user?.id?.toString() && 'Tú: '}
                         {lastMsg.content}
                       </p>
                     </CardContent>
                   </Card>
                 )
               })
             )}
          </div>
        </div>

        {/* Chat Detail */}
        <div className={`md:col-span-2 flex-col min-h-0 ${!selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
          {selectedThread ? (
            <Card className="flex flex-col flex-1 h-full shadow-lg border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <CardHeader className="py-4 px-4 sm:px-6 border-b bg-gray-50/50 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden -ml-2 h-8 w-8"
                    onClick={() => setSelectedThreadId(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarFallback>{selectedThread.partnerName.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selectedThread.partnerName}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      {selectedThread.orderNumber ? `Orden: ${selectedThread.orderNumber}` : 'Chat General'}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => fetchMessages()} title="Actualizar">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </Button>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={() => handleDeleteThread(selectedThread.id)}
                   className="text-gray-400 hover:text-red-600"
                   title="Eliminar conversación"
                 >
                   <Trash2 className="h-4 w-4" />
                 </Button>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                 {/* Sort chronological for display */}
                  {[...selectedThread.messages].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
                    const isMe = String(msg.senderId) === String(user?.id)
                   return (
                     <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                       <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>

                         {/* Bubble */}
                         <div className={`relative px-4 py-3 shadow-sm text-sm ${
                           isMe
                             ? 'bg-slate-900 text-white rounded-2xl rounded-tr-none' // Usuario actual (Derecha)
                             : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none' // Otro usuario (Izquierda)
                         }`}>
                           {/* Nombre solo en mensajes recibidos */}
                           {!isMe && (
                             <span className="block text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-wider">
                               {msg.senderName || 'Usuario'}
                             </span>
                           )}

                           <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                         </div>

                         {/* Time and Status */}
                         <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                            {isMe && (
                              <span>
                                {msg.read ? <CheckCircle2 className="h-3 w-3 text-blue-500" /> : <CheckCircle2 className="h-3 w-3" />}
                              </span>
                            )}
                         </div>

                       </div>
                     </div>
                   )
                 })}
                 <div ref={messagesEndRef} />
              </CardContent>

              {/* Reply Input */}
              <div className="p-4 bg-white border-t mt-auto shrink-0">
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="min-h-[50px] max-h-[120px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    className="h-auto px-4"
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Presiona Enter para enviar
                </p>
              </div>
            </Card>
          ) : (
             <Card className="flex flex-col items-center justify-center flex-1 h-full bg-gray-50/50 border-dashed">
                <div className="text-center p-6">
                   <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                   <h3 className="font-semibold text-gray-700">Tus Mensajes</h3>
                   <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                     Selecciona una conversación de la lista para ver el historial o enviar una respuesta.
                   </p>
                </div>
             </Card>
          )}
        </div>
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={isNewConvOpen} onOpenChange={setIsNewConvOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nueva Conversación</DialogTitle>
            <DialogDescription>
              Inicia un nuevo hilo de mensajes con un cliente o técnico.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tipo</Label>
              <Select
                value={newConvData.receiverType}
                onValueChange={(val: any) => setNewConvData({...newConvData, receiverType: val, receiverId: ''})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Cliente</SelectItem>
                  <SelectItem value="technician">Técnico</SelectItem>
                  <SelectItem value="support">Soporte (Buzón General)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newConvData.receiverType !== 'support' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Destinatario</Label>
                <div className="col-span-3">
                  {newConvData.receiverType === 'customer' ? (
                    <Select value={newConvData.receiverId} onValueChange={(val) => setNewConvData({...newConvData, receiverId: val})}>
                      <SelectTrigger>
                         <SelectValue placeholder="Seleccionar Cliente via Orden" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOrders.map(o => (
                          <SelectItem key={o.id} value={o.clientId || o.userId || 'unknown'}>
                            {o.nombre} ({o.orderNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={newConvData.receiverId} onValueChange={(val) => setNewConvData({...newConvData, receiverId: val})}>
                      <SelectTrigger>
                         <SelectValue placeholder="Seleccionar Técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTechnicians.map(t => (
                          <SelectItem key={t.id} value={t.adminUserId || t.id}>
                            {t.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Orden</Label>
              <Select
                value={newConvData.orderId}
                onValueChange={(val) => setNewConvData({...newConvData, orderId: val})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Opcional: Vincular a Orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguna</SelectItem>
                  {availableOrders.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.orderNumber} - {o.tipoServicio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Asunto</Label>
              <Input
                value={newConvData.subject}
                onChange={e => setNewConvData({...newConvData, subject: e.target.value})}
                placeholder="Ej: Consulta sobre repuestos"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Mensaje</Label>
              <Textarea
                value={newConvData.content}
                onChange={e => setNewConvData({...newConvData, content: e.target.value})}
                placeholder="Escribe tu mensaje aquí..."
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConvOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateNewConversation} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Enviar Mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
