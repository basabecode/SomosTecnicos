
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
  role?: string
  userType?: string
  [key: string]: any
}

/**
 * Normalizes a user's role to the senderType format used in messages.
 * Admin/super_admin/technician_manager → 'admin'
 * Technician → 'technician'
 * Customer → 'customer'
 */
export function getNormalizedUserType(user: ChatUser): string {
  const role = (user.role || user.userType || 'customer').toLowerCase()
  if (role === 'technician') return 'technician'
  if (['admin', 'super_admin', 'technician_manager'].includes(role)) return 'admin'
  return 'customer'
}

/**
 * Determines if a message was sent by the current user.
 * Compares BOTH senderId AND senderType to avoid ID collisions
 * between Customer and AdminUser tables (both use autoincrement).
 */
export function isOwnMessage(msg: ChatMessage, currentUser: ChatUser): boolean {
  const idMatch = String(msg.senderId) === String(currentUser.id)
  const typeMatch = msg.senderType === getNormalizedUserType(currentUser)
  return idMatch && typeMatch
}

/**
 * Determines if a message is addressed to the current user.
 * Checks both receiverId AND receiverType to avoid ID collisions.
 * Also handles 'support' messages being visible to all admins.
 */
export function isMessageForMe(msg: ChatMessage, currentUser: ChatUser): boolean {
  const myType = getNormalizedUserType(currentUser)
  const myId = String(currentUser.id)

  // Direct match: receiverId + receiverType
  if (String(msg.receiverId) === myId && msg.receiverType === myType) {
    return true
  }

  // Support inbox: all admins can see messages sent to support
  if (myType === 'admin' && (msg.receiverType === 'support' || msg.receiverType === 'admin')) {
    return true
  }

  return false
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
  const amISender = isOwnMessage(lastMsg, currentUser)

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
  const isMe = isOwnMessage(msg, currentUser)

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
