'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { EmptyState } from '@/components/domain'
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
import { calculateReplyReceiver, getThreadKey, isOwnMessage, isMessageForMe } from '@/lib/chat-logic'

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

export default function TechnicianMessages() {
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
      const isMe = isOwnMessage(msg, user)

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

        if (!isMe) {
          pName = msg.senderName || 'Usuario'
          pRole = msg.senderType
          pId = msg.senderId
        } else {
          // Outgoing from Technician
          if (msg.receiverType === 'customer') pName = `Cliente (${msg.receiverId})`
          else if (msg.receiverType === 'admin') pName = 'Administrador'
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

      // 3. UPDATE LAST MESSAGE
      if (new Date(msg.createdAt) > new Date(thread.lastMessage.createdAt)) {
        thread.lastMessage = msg
        if (!isMe) {
            thread.partnerName = msg.senderName || thread.partnerName
            thread.partnerRole = msg.senderType
            thread.partnerId = msg.senderId
        }
      }

      // 4. UNREAD
      if (!msg.read && isMessageForMe(msg, user)) {
        thread.unreadCount++
      }
    })

    return Object.values(grouped).sort((a, b) =>
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )
  }, [messages, user])

  const sortedThreads = threads
  const selectedThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) : null

  // Filter threads for the list
  const filteredThreads = sortedThreads.filter(thread => {
    const matchesSearch =
      thread.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter logic (simplified: check if last message is unread and received)
    const isUnread = !thread.lastMessage.read && isMessageForMe(thread.lastMessage, user!)

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
          .filter(m => !m.read && isMessageForMe(m, user))
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

  // Handle Send Reply
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user) {
        return
    }

    setSending(true)
    try {
      const token = localStorage.getItem('accessToken')
      const lastMsg = selectedThread.lastMessage

      // LÓGICA CRÍTICA DE RESPUESTA CENTRALIZADA
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

  // Fetch metadata for new conversations
  useEffect(() => {
    if (isNewConvOpen) {
      const fetchData = async () => {
        const token = localStorage.getItem('accessToken')
        try {
          const res = await fetch('/api/orders?limit=100', { headers: { Authorization: `Bearer ${token}` }})
          const data = await res.json()
          if (data.success) {
            // Filtrar solo órdenes asignadas o relacionadas
            setAvailableOrders(data.orders || data.data?.orders || [])
          }
        } catch (err) {
          console.error('Error fetching conversion metadata:', err)
        }
      }
      fetchData()
    }
  }, [isNewConvOpen])

  const handleCreateNewConversation = async () => {
    // console.log('Tech handleCreateNewConversation BEGIN');

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

      const payload = {
          ...newConvData,
          subject: newConvData.subject || 'Consulta Técnica'
      };

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
      console.error('Error sending:', err)
      toast.error('Error de red al enviar mensaje')
    } finally {
      setSending(false)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Mis Mensajes</h1>
          <p className="text-xs md:text-base text-gray-600 mt-1">Comunicación con clientes y soporte</p>
        </div>
        <Button onClick={() => setIsNewConvOpen(true)} size="sm" className="w-full sm:w-auto h-9 text-xs sm:text-sm">
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Nuevo Mensaje
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 flex-1 min-h-0 w-full relative">
        {/* Thread List */}
        <div className={`lg:col-span-1 flex-col gap-3 min-h-0 overflow-y-auto pr-1 ${selectedThreadId ? 'hidden lg:flex' : 'flex'}`}>
          {/* Controls */}
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-3 space-y-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
               </div>
               <div className="flex gap-2 p-0.5 bg-gray-100 rounded-lg">
                 <Button
                   variant={statusFilter === 'all' ? 'default' : 'ghost'}
                   size="sm"
                   onClick={() => setStatusFilter('all')}
                   className={`flex-1 h-8 text-xs rounded-md ${statusFilter === 'all' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                 >
                   Todos
                 </Button>
                 <Button
                   variant={statusFilter === 'unread' ? 'default' : 'ghost'}
                   size="sm"
                   onClick={() => setStatusFilter('unread')}
                   className={`flex-1 h-8 text-xs rounded-md whitespace-nowrap ${statusFilter === 'unread' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                 >
                   <span className="hidden sm:inline">No leídos</span>
                   <span className="sm:hidden">No leídos</span>
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
               <EmptyState variant="no-messages" className="p-6" />
             ) : (
               filteredThreads.map(thread => {
                 const lastMsg = thread.lastMessage
                 const isSelected = selectedThreadId === thread.id
                 const isUnread = !lastMsg.read && isMessageForMe(lastMsg, user!)

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
                         {isOwnMessage(lastMsg, user!) && 'Tú: '}
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
        <div className={`lg:col-span-2 flex-col min-h-0 ${!selectedThreadId ? 'hidden lg:flex' : 'flex'}`}>
          {selectedThread ? (
            <Card className="flex flex-col flex-1 h-full shadow-lg border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <CardHeader className="py-4 px-4 sm:px-6 border-b bg-gray-50/50 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden -ml-2 h-8 w-8"
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
                <div className="flex items-center gap-1">
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
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                 {/* Sort chronological for display */}
                 {[...selectedThread.messages].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
                   const isMe = isOwnMessage(msg, user!)
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
                             <span className="block text-[10px] font-bold text-orange-600 mb-1 uppercase tracking-wider">
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
              Inicia un nuevo hilo de mensajes con un cliente o soporte.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label className="text-left sm:text-right">Tipo</Label>
              <div className="sm:col-span-3">
                <Select
                  value={newConvData.receiverType}
                  onValueChange={(val: any) => setNewConvData({...newConvData, receiverType: val, receiverId: (val === 'support' ? '0' : '')})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Cliente</SelectItem>
                    <SelectItem value="support">Administración / Soporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newConvData.receiverType === 'customer' && (
              <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                <Label className="text-left sm:text-right">Cliente</Label>
                <div className="sm:col-span-3">
                  <Select
                    value={newConvData.receiverId}
                    onValueChange={(val) => {
                      const order = availableOrders.find(o => (o.clientId || o.userId) === val);
                      setNewConvData({
                        ...newConvData,
                        receiverId: val,
                        orderId: order?.id || ''
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
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
                </div>
              </div>
            )}

            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label className="text-left sm:text-right">Orden</Label>
              <div className="sm:col-span-3">
                <Select
                  value={newConvData.orderId}
                  onValueChange={(val) => setNewConvData({...newConvData, orderId: val})}
                >
                  <SelectTrigger className="w-full">
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
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
              <Label className="text-left sm:text-right">Asunto</Label>
              <Input
                value={newConvData.subject}
                onChange={e => setNewConvData({...newConvData, subject: e.target.value})}
                placeholder="Ej: Dudas sobre la reparación"
                className="sm:col-span-3"
              />
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-start gap-2 sm:gap-4">
              <Label className="text-left sm:text-right sm:mt-2">Mensaje</Label>
              <Textarea
                value={newConvData.content}
                onChange={e => setNewConvData({...newConvData, content: e.target.value})}
                placeholder="Escribe tu mensaje aquí..."
                className="sm:col-span-3 min-h-[100px]"
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
