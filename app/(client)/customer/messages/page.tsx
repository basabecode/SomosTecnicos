'use client'

/**
 * CustomerMessages Component
 *
 * Sistema de mensajería para clientes.
 * Soluciona problemas de alineación, identificación de remitente,
 * agrupación de hilos y lógica de respuesta.
 */

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MessageSquare,
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  ArrowLeft,
  Headphones,
  Wrench,
  User,
  Trash2,
  MoreVertical,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { calculateReplyReceiver, getThreadKey, isOwnMessage, isMessageForMe } from '@/lib/chat-logic'

// =============================================
// TYPES
// =============================================

interface Message {
  id: string
  subject: string
  content: string
  // Sender info
  senderId: string
  senderType: string
  senderName: string
  // Receiver info
  receiverId: string
  receiverType: string
  // Metadata
  createdAt: string
  read: boolean
  category: 'service' | 'support' | 'billing' | 'warranty' | 'general'
  priority: 'low' | 'normal' | 'high'
  // Context
  relatedOrder?: string
  orderId?: string
  // Extra hydrated data often sent by API
  from?: {
    name: string
    role: string
    avatar?: string
  }
}

interface Order {
  id: string
  orderNumber: string
  tipoServicio: string
  estado?: string
}

interface Thread {
  id: string
  messages: Message[]
  lastMessage: Message
  partnerName: string
  partnerRole: string // 'admin' | 'technician' | 'support' | 'unknown'
  partnerId: string
  orderNumber?: string
  unreadCount: number
}

// =============================================
// COMPONENT
// =============================================

export default function CustomerMessages() {
  const { user } = useAuth()

  // -------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  // Selection & Navigation
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)

  // New Message Dialog
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [newMsgTarget, setNewMsgTarget] = useState<'support' | 'technician'>('support')
  const [newMsgOrderId, setNewMsgOrderId] = useState<string>('none')
  const [newMsgContent, setNewMsgContent] = useState('')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all')

  // Inputs
  const [replyContent, setReplyContent] = useState('')

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null)

  // -------------------------------------------
  // DATA FETCHING
  // -------------------------------------------

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=50')
      const data = await response.json()
      if (data.success) {
        setOrders(data.data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error al cargar órdenes')
    }
  }

  const fetchMessages = async (silent = false) => {
    if (!user) return
    if (!silent) setLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch('/api/messages?limit=200', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      if (!silent) toast.error('Error de conexión al obtener mensajes')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Initial Load
  useEffect(() => {
    fetchMessages()
    fetchOrders()

    // Optimized Polling: Every 10s
    const interval = setInterval(() => {
      fetchMessages(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [user])

  // Scroll to bottom when messages change in selected thread
  useEffect(() => {
    if (selectedThreadId && scrollRef.current) {
      // Small timeout to ensure DOM update
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [selectedThreadId, messages])



  // -------------------------------------------
  // THREAD GROUPING LOGIC
  // -------------------------------------------

  const threads = useMemo(() => {
    if (!user) return []

    const grouped: Record<string, Thread> = {}

    messages.forEach(msg => {
      const isMe = isOwnMessage(msg, user)

      // DETERMINE THREAD KEY
      const threadKey = getThreadKey(msg, user)

      // Initialize Thread if needed
      if (!grouped[threadKey]) {
        // Determine initial Partner Info
        let pName = 'Soporte Técnico'
        let pRole = 'support'
        let pId = '0'

        if (msg.orderId) {
           // If order based, try to be generic unless we have specific info
           pName = 'Chat de Orden'
           pRole = 'service'
        }

        if (!isMe) {
          // If we received it, we trust the sender info
          pName = msg.senderName || (msg.senderType === 'admin' ? 'Soporte' : 'Usuario')
          pRole = msg.senderType
          pId = msg.senderId
        } else {
          // If we sent it, we try to guess who we sent it to based on type
          if (msg.receiverType === 'support' || msg.receiverId === '0') {
            pName = 'Soporte Técnico'
            pRole = 'support'
            pId = '0'
          } else {
             // Technician or specific user
             pName = msg.receiverType === 'technician' ? 'Técnico' : 'Admin'
             pRole = msg.receiverType
             pId = msg.receiverId
          }
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

      // Update Last Message
      if (new Date(msg.createdAt) > new Date(thread.lastMessage.createdAt)) {
        thread.lastMessage = msg
        // Update partner name from most recent incoming message if possible (more accurate)
        if (!isMe) {
            thread.partnerName = msg.senderName
            thread.partnerRole = msg.senderType
            thread.partnerId = msg.senderId
        }
      }

      // Count Unread
      if (!msg.read && isMessageForMe(msg, user)) {
        thread.unreadCount++
      }
    })

    // Sort by Date Descending
    return Object.values(grouped).sort((a, b) =>
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )
  }, [messages, user])

  // Filtered Threads
  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      const matchSearch = t.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.orderNumber && t.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          t.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())

      if (statusFilter === 'unread') {
        return matchSearch && t.unreadCount > 0
      }
      return matchSearch
    })
  }, [threads, searchTerm, statusFilter])

  // Mark as Read Logic
  useEffect(() => {
    if (selectedThreadId && user) {
       const thread = threads.find(t => t.id === selectedThreadId)
       if (!thread) return

       const unreadIds = thread.messages
          .filter(m => !m.read && isMessageForMe(m, user))
          .map(m => m.id)

       if (unreadIds.length > 0) {
          // Optimistic Update
          setMessages(prev => prev.map(m =>
             unreadIds.includes(m.id) ? { ...m, read: true } : m
          ))

          // API Call
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

  const selectedThread = threads.find(t => t.id === selectedThreadId)

  // -------------------------------------------
  // ACTIONS
  // -------------------------------------------

  const handleSendMessage = async () => {
    if (!replyContent.trim() || !selectedThread || !user) {
        return
    }  setSending(true)
    try {
      const token = localStorage.getItem('accessToken')
      const lastMsg = selectedThread.lastMessage

      // LOGICA CRITICA DE RESPUESTA CENTRALIZADA
      const { receiverId, receiverType } = calculateReplyReceiver(lastMsg, user, selectedThread)

      const payload = {
        content: replyContent,
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
        setReplyContent('')
        fetchMessages(true) // Refresh sin loading
      } else {
        toast.error('No se pudo enviar el mensaje')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Error de conexión')
    } finally {
      setSending(false)
    }
  }

  const handleCreateNewConversation = async () => {
    if (!newMsgContent.trim()) return

    setSending(true)
    try {
      const token = localStorage.getItem('accessToken')

      // Validación lógica
      if (newMsgTarget === 'technician' && newMsgOrderId === 'none') {
        toast.error('Debes seleccionar una orden para contactar al técnico')
        setSending(false)
        return
      }

      const payload = {
        content: newMsgContent,
        receiverType: newMsgTarget,
        // Si es técnico, necesitamos ID de la orden para que el backend busque al técnico asignado
        orderId: newMsgOrderId === 'none' ? undefined : newMsgOrderId,
        category: newMsgTarget === 'support' ? 'support' : 'service',
        subject: newMsgTarget === 'support' ? 'Consulta de Soporte' : 'Asistencia Técnica'
      }

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Mensaje enviado')
        setNewMsgContent('')
        setIsNewMessageOpen(false)
        fetchMessages()
      } else {
        toast.error(data.error || 'Error al iniciar conversación')
      }
    } catch (err) {
      console.error('Error creating msg:', err)
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

  // -------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------

  const getRoleBadge = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin':
      case 'support':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none text-[10px]">Soporte</Badge>
      case 'technician':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-none text-[10px]">Técnico</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Mis Mensajes</h1>
          <p className="text-xs md:text-base text-sm text-gray-500 mt-1">Centro de comunicación con Soporte y Técnicos</p>
        </div>
        <Button onClick={() => setIsNewMessageOpen(true)} size="sm" className="w-full sm:w-auto h-9 text-xs bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Nuevo Mensaje
        </Button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0 w-full relative">

        {/* LISTA DE HILOS (Izquierda) */}
        {/* Oculta en móvil si hay un hilo seleccionado */}
        <div className={`lg:col-span-1 flex flex-col gap-4 min-h-0 ${selectedThreadId ? 'hidden lg:flex' : 'flex'}`}>
            <Card className="flex flex-col h-full border-gray-200 shadow-sm">
                <CardHeader className="p-3 pb-2 border-b space-y-3">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                      <Input
                        placeholder="Buscar conversaciones..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 text-sm bg-gray-50 border-gray-200"
                      />
                   </div>
                   <div className="flex gap-2 p-0.5 bg-gray-100 rounded-lg">
                     <Button
                       variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
                       size="sm"
                       className={`flex-1 h-8 text-xs rounded-md ${statusFilter === 'all' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                       onClick={() => setStatusFilter('all')}
                     >
                       Todos
                     </Button>
                     <Button
                       variant={statusFilter === 'unread' ? 'secondary' : 'ghost'}
                       size="sm"
                       className={`flex-1 h-8 text-xs rounded-md whitespace-nowrap ${statusFilter === 'unread' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                       onClick={() => setStatusFilter('unread')}
                     >
                       <span className="hidden sm:inline">No leídos</span>
                       <span className="sm:hidden">No leídos</span>
                     </Button>
                   </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-2 space-y-2">
                   {loading ? (
                     <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                       <Loader2 className="h-6 w-6 animate-spin mb-2" />
                       <span className="text-xs">Cargando...</span>
                     </div>
                   ) : filteredThreads.length === 0 ? (
                     <div className="text-center py-10 text-gray-400 px-4">
                       <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                       <p className="text-sm">No se encontraron mensajes</p>
                     </div>
                   ) : (
                     filteredThreads.map(thread => {
                        const isSelected = selectedThreadId === thread.id
                        return (
                          <div
                            key={thread.id}
                            onClick={() => setSelectedThreadId(thread.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors border flex gap-3 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-white hover:bg-gray-50 border-transparent hover:border-gray-100'
                            }`}
                          >
                             <Avatar className="h-10 w-10 border">
                               <AvatarFallback className={isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100'}>
                                 {thread.partnerName.slice(0, 2).toUpperCase()}
                               </AvatarFallback>
                             </Avatar>

                             <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-start mb-0.5">
                                 <span className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                   {thread.partnerName}
                                 </span>
                                 <span className="text-[10px] text-gray-400 whitespace-nowrap ml-1">
                                   {new Date(thread.lastMessage.createdAt).toLocaleDateString()}
                                 </span>
                               </div>

                               <div className="flex items-center gap-2 mb-1">
                                  {getRoleBadge(thread.partnerRole)}
                                  {thread.orderNumber && (
                                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-gray-300 text-gray-500">
                                      {thread.orderNumber}
                                    </Badge>
                                  )}
                               </div>

                               <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                 {isOwnMessage(thread.lastMessage, user!) && 'Tú: '}
                                 {thread.lastMessage.content}
                               </p>
                             </div>

                             {thread.unreadCount > 0 && (
                               <div className="flex items-center self-center">
                                 <span className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                   {thread.unreadCount}
                                 </span>
                               </div>
                             )}
                          </div>
                        )
                     })
                   )}
                </CardContent>
            </Card>
        </div>

        {/* DETALLE DEL CHAT (Derecha) */}
        {/* Oculta en móvil si NO hay hilo seleccionado */}
        <div className={`lg:col-span-2 flex flex-col min-h-0 ${!selectedThreadId ? 'hidden lg:flex' : 'flex'}`}>
            {selectedThread ? (
              <Card className="flex flex-col h-full shadow-lg border-gray-200 overflow-hidden bg-gray-50/30">
                 {/* Chat Header */}
                 <div className="p-4 border-b bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                       <Button
                         variant="ghost"
                         size="icon"
                         className="lg:hidden -ml-2 h-8 w-8 text-gray-600"
                         onClick={() => setSelectedThreadId(null)}
                       >
                         <ArrowLeft className="h-5 w-5" />
                       </Button>

                       <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                         <AvatarFallback className="bg-slate-800 text-white">
                           {selectedThread.partnerName.slice(0,2).toUpperCase()}
                         </AvatarFallback>
                       </Avatar>

                       <div>
                          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                             {selectedThread.partnerName}
                             {getRoleBadge(selectedThread.partnerRole)}
                          </h2>
                          <div className="flex items-center text-xs text-gray-500 gap-2">
                             {selectedThread.orderNumber ? (
                               <span className="flex items-center text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                 Orden: {selectedThread.orderNumber}
                               </span>
                             ) : (
                               <span>Chat General</span>
                             )}
                             <span>•</span>
                             <span>{selectedThread.partnerRole === 'support' ? 'Soporte Administrativo' : 'Técnico Especialista'}</span>
                          </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => fetchMessages()} className="text-gray-400 hover:text-gray-600" title="Actualizar">
                           <RefreshCw className="h-4 w-4" />
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
                  </div>

                 {/* Mensajes Scroll Area */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f8fafc]">
                    {[...selectedThread.messages]
                      .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((msg, index, arr) => {
                        const isMe = isOwnMessage(msg, user!)
                        const showAvatar = !isMe && (index === 0 || arr[index-1].senderId !== msg.senderId)

                        return (
                          <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* Avatar pequeño al lado del mensaje recibido */}
                                {!isMe && (
                                  <div className="w-8 shrink-0 flex flex-col justify-end">
                                    {showAvatar ? (
                                      <Avatar className="h-8 w-8 border bg-white">
                                        <AvatarFallback className="text-[10px] bg-slate-100 text-slate-600">
                                           {msg.senderName?.slice(0,2).toUpperCase() || 'US'}
                                        </AvatarFallback>
                                      </Avatar>
                                    ) : <div className="w-8" />}
                                  </div>
                                )}

                                <div>
                                   {/* Nombre Sender (si es el primero del bloque recibido) */}
                                   {!isMe && showAvatar && (
                                      <span className="text-[10px] font-bold text-gray-500 ml-1 mb-1 block uppercase tracking-wide">
                                         {msg.senderName}
                                      </span>
                                   )}

                                   {/* Burbuja */}
                                   <div className={`
                                     relative px-4 py-2.5 shadow-sm text-sm break-words
                                     ${isMe
                                       ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm'
                                       : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'}
                                   `}>
                                      {msg.content}
                                   </div>

                                   {/* Timestamp y Status */}
                                   <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? 'justify-end text-slate-400' : 'text-gray-400'}`}>
                                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      {isMe && (
                                         <CheckCircle2 className={`h-3 w-3 ${msg.read ? 'text-blue-500' : 'text-gray-300'}`} />
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                        )
                    })}
                    <div ref={scrollRef} />
                 </div>

                 {/* Input Area */}
                 <div className="p-4 bg-white border-t shrink-0">
                    <div className="flex gap-3 items-end">
                       <Textarea
                         value={replyContent}
                         onChange={e => setReplyContent(e.target.value)}
                         placeholder="Escribe tu mensaje..."
                         className="min-h-[50px] max-h-[150px] resize-none py-3"
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' && !e.shiftKey) {
                             e.preventDefault()
                             handleSendMessage()
                           }
                         }}
                       />
                       <Button
                         onClick={handleSendMessage}
                         disabled={sending || !replyContent.trim()}
                         className="h-12 w-12 rounded-xl shrink-0 bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
                       >
                         {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                       </Button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                      Presiona Enter para enviar • Shift + Enter para nueva línea
                    </p>
                 </div>
              </Card>
            ) : (
               // Empty State
               <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border rounded-lg border-dashed m-1">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                     <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Tus Mensajes</h3>
                  <p className="text-sm text-gray-500 max-w-sm text-center mt-2">
                    Selecciona una conversación existente o inicia una nueva para contactar a Soporte o a tu Técnico.
                  </p>
                  <Button onClick={() => setIsNewMessageOpen(true)} variant="outline" className="mt-6">
                    Iniciar Nueva Conversación
                  </Button>
               </div>
            )}
        </div>
      </div>

      {/* New Message Dialog */}
      <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Mensaje</DialogTitle>
            <DialogDescription>
              ¿Con quién deseas comunicarte hoy?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Destinatario</Label>
                <Select value={newMsgTarget} onValueChange={(val: any) => setNewMsgTarget(val)}>
                   <SelectTrigger>
                      <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="support">Soporte Administrativo (General)</SelectItem>
                      <SelectItem value="technician">Técnico Asignado a mi Orden</SelectItem>
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-2">
                <Label>Orden Relacionada {newMsgTarget === 'technician' && <span className="text-red-500">*</span>}</Label>
                <Select value={newMsgOrderId} onValueChange={setNewMsgOrderId}>
                   <SelectTrigger>
                      <SelectValue placeholder="Selecciona una orden..." />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="none">Consulta General (Sin orden)</SelectItem>
                      {orders.map(o => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.orderNumber} - {o.tipoServicio} ({o.estado})
                        </SelectItem>
                      ))}
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-2">
                <Label>Mensaje</Label>
                <Textarea
                   placeholder="Describe tu consulta..."
                   className="min-h-[100px]"
                   value={newMsgContent}
                   onChange={e => setNewMsgContent(e.target.value)}
                />
             </div>
          </div>

          <DialogFooter>
             <Button variant="ghost" onClick={() => setIsNewMessageOpen(false)}>Cancelar</Button>
             <Button
               onClick={handleCreateNewConversation}
               disabled={sending || (newMsgTarget === 'technician' && newMsgOrderId === 'none') || !newMsgContent.trim()}
             >
               {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
               Enviar
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
