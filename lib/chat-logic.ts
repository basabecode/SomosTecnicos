
/**
 * Shared Chat Logic Library
 * Centralizes critical logic for thread grouping and message routing
 * to assure consistency across Client, Technician, and Admin panels.
 */

// Basic Interface COMPATIBLE with the local ones
export interface ChatMessage {
  id: string
  senderId: string
  senderType: string
  senderName?: string
  receiverId: string
  receiverType: string
  orderId?: string
  relatedOrder?: string
  read: boolean
  createdAt: string | Date
  content: string
  [key: string]: any
}

export interface ChatThread {
  id: string
  lastMessage: ChatMessage
  partnerName: string
  partnerRole: string
  partnerId: string
  orderNumber?: string
  unreadCount: number
  [key: string]: any
}

export interface ChatUser {
  id: string | number
  [key: string]: any
}

/**
 * Calculates the correct Receiver ID and Type for a reply.
 * Handles edge cases where ID is missing or '0'.
 */
export function calculateReplyReceiver(
  lastMsg: ChatMessage,
  currentUser: ChatUser,
  thread?: ChatThread | null
) {
  const currentUserId = String(currentUser.id)
  const amISender = String(lastMsg.senderId) === currentUserId

  // 1. Initial Deduction
  // If I sent the last one, I keep talking to the same receiver.
  // If I received the last one, I reply to the sender.
  let receiverId = amISender ? lastMsg.receiverId : lastMsg.senderId
  let receiverType = amISender ? lastMsg.receiverType : lastMsg.senderType

  // 2. Recovery Logic (The "FIX CRITICO")
  // If we identify a broken ID (empty or 0) for a specific user type, try to recover from Thread
  const isGenericParams = !receiverId || receiverId === '0'

  if (isGenericParams && thread) {
     // If the thread is NOT with a generic support channel, we should use the partner ID
     const isThreadGeneric = thread.partnerId === '0' || thread.partnerId === 'support'

     if (!isThreadGeneric && thread.partnerId) {
        receiverId = thread.partnerId

        // Force type consistency based on the thread partner role
        if (thread.partnerRole === 'customer') receiverType = 'customer'
        else if (thread.partnerRole === 'technician') receiverType = 'technician'
        else if (thread.partnerRole === 'admin') receiverType = 'admin'
     }
  }

  // 3. Support/Admin Normalization
  // If we are definitely talking to Support/Admin and ID is 0/empty, keep it 0.
  if (receiverType === 'admin' || receiverType === 'support') {
      if (!receiverId || receiverId === '0') {
          receiverId = '0'
          receiverType = 'support'
      }
  }

  return { receiverId, receiverType }
}

/**
 * Generates the unique key for grouping messages into threads.
 */
export function getThreadKey(msg: ChatMessage, currentUser: ChatUser): string {
  const currentUserId = String(currentUser.id)
  const isMe = String(msg.senderId) === currentUserId

  // Priority 1: Order ID
  if (msg.orderId) {
    return `order-${msg.orderId}`
  }

  // Priority 2: Direct User Pair
  const partnerId = isMe ? msg.receiverId : msg.senderId

  // Normalize 'support' or '0'
  const normalizedPartnerId = (
    partnerId === '0' ||
    msg.receiverType === 'support' ||
    msg.senderType === 'support'
  ) ? 'support' : partnerId

  return `direct-${normalizedPartnerId}`
}
