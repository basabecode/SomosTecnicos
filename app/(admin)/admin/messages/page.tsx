'use client'

import { useState, useEffect, useRef } from 'react'
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
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

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
  priority: 'low' | 'medium' | 'high'
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

  // Fetch Messages
  const fetchMessages = async () => {
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
    } finally {
      setLoading(false)
    }
  }

  // Initial Load & Polling
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (selectedThreadId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedThreadId, messages])

  // Grouping logic: Create threads based on Order ID or Direct User pair
  // We prefer grouping by Order ID
  const threads = messages.reduce((acc, msg) => {
    const threadKey = msg.orderId ? `order-${msg.orderId}` : `user-${msg.senderId === user?.id?.toString() ? msg.receiverId : msg.senderId}`
    if (!acc[threadKey]) {
      acc[threadKey] = {
        id: threadKey,
        messages: [],
        lastMessage: msg,
        orderNumber: msg.relatedOrder,
        partnerName: msg.senderId === user?.id?.toString()
          ? 'Soporte / Técnico' // We don't verify receiver name easily here without extra data
          : msg.senderName
      }
    }
    acc[threadKey].messages.push(msg)
    // Update last message if newer
    if (new Date(msg.createdAt) > new Date(acc[threadKey].lastMessage.createdAt)) {
      acc[threadKey].lastMessage = msg
    }
    // Update partner name if incoming message
    if (msg.senderId !== user?.id?.toString()) {
      acc[threadKey].partnerName = msg.senderName
    }
    return acc
  }, {} as Record<string, { id: string, messages: Message[], lastMessage: Message, orderNumber?: string, partnerName: string }>)

  const sortedThreads = Object.values(threads).sort((a, b) =>
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  )

  const selectedThread = selectedThreadId ? threads[selectedThreadId] : null

  // Filter threads for the list
  const filteredThreads = sortedThreads.filter(thread => {
    const matchesSearch =
      thread.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter logic (simplified: check if last message is unread and received)
    const isUnread = !thread.lastMessage.read && thread.lastMessage.receiverId === user?.id?.toString()

    if (statusFilter === 'unread' && !isUnread) return false
    if (statusFilter === 'read' && isUnread) return false

    return matchesSearch
  })

  // Handle Send Reply
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return

    setSending(true)
    try {
      const token = localStorage.getItem('accessToken')
      const lastMsg = selectedThread.lastMessage

      // Determine receiver (the other person in the thread)
      // If I sent the last message, receiver is my previous receiver.
      // If I received the last message, receiver is the sender.
      const amISender = lastMsg.senderId === user?.id?.toString()
      const receiverId = amISender ? lastMsg.receiverId : lastMsg.senderId
      const receiverType = amISender ? lastMsg.receiverType : lastMsg.senderType

      const payload = {
        content: newMessage,
        receiverId: receiverId,
        receiverType: receiverType,
        orderId: lastMsg.orderId,
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
      }
    } catch (err) {
      console.error('Error sending message:', err)
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buzón de Administración</h1>
          <p className="text-gray-600 mt-2">Gestión de comunicaciones</p>
        </div>
        <Button onClick={() => alert('Función de nuevo mensaje próximamente')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Mensaje
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Thread List */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
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
        <div className="lg:col-span-2 flex flex-col min-h-0">
          {selectedThread ? (
            <Card className="flex flex-col flex-1 h-full shadow-lg border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <CardHeader className="py-4 px-6 border-b bg-gray-50/50 flex flex-row items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
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
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                 {/* Sort chronological for display */}
                 {[...selectedThread.messages].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg) => {
                   const isMe = msg.senderId === user?.id?.toString()
                   return (
                     <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] rounded-2xl p-3 px-4 shadow-sm ${
                         isMe
                           ? 'bg-primary text-primary-foreground rounded-br-none'
                           : 'bg-white border border-gray-100 rounded-bl-none'
                       }`}>
                         {!isMe && (
                           <p className="text-[10px] font-medium text-gray-500 mb-1">{msg.senderName}</p>
                         )}
                         <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                         <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                           {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                         </p>
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
    </div>
  )
}
