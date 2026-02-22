import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'
import { sendNotification } from '@/lib/services/notification.service'

// Tipos de usuario para la mensajería
const MSG_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  TECHNICIAN: 'technician',
  SUPPORT: 'support'
} as const

// GET /api/messages
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !auth.user) {
      console.log('[API-MSG] Unauthorized GET attempt')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { user } = auth
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Normalizar rol
    let userType: string = MSG_ROLES.CUSTOMER
    if (user.role === 'technician') userType = MSG_ROLES.TECHNICIAN
    if (['admin', 'super_admin', 'technician_manager'].includes(user.role)) {
      userType = MSG_ROLES.ADMIN
    }

    console.log('[API-MSG] GET Request:', {
        userId: user.id,
        role: user.role,
        normalizedType: userType,
        orderId
    })

    // Construir filtro excluyendo mensajes soft-deleted para este usuario
    const whereClause: any = {
      OR: [
        {
          senderId: user.id.toString(),
          senderType: userType,
          deletedBySender: false
        },
        {
          receiverId: user.id.toString(),
          receiverType: userType,
          deletedByReceiver: false
        },
        // Admins ven mensajes a soporte (no borrados como receptor)
        ...(userType === MSG_ROLES.ADMIN ? [{
          receiverType: MSG_ROLES.SUPPORT,
          deletedByReceiver: false
        }] : [])
      ]
    }

    if (orderId) {
      whereClause.orderId = orderId
    }

    // @ts-ignore - Prisma client might be outdated in dev environment due to lock
    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        order: {
          select: {
            orderNumber: true,
            tipoServicio: true
          }
        }
      }
    })

    // OPTIMIZACIÓN: Enriquecimiento de nombres faltantes para mensajes históricos
    // Identificar IDs que necesitan nombre (senderName es null o 'Usuario')
    const missingNames: Record<string, Set<number>> = {
      [MSG_ROLES.CUSTOMER]: new Set(),
      [MSG_ROLES.TECHNICIAN]: new Set(),
      [MSG_ROLES.ADMIN]: new Set()
    }

    messages.forEach((msg: any) => {
      if (!msg.senderName || msg.senderName === 'Usuario') {
        const id = parseInt(msg.senderId)
        if (!isNaN(id) && missingNames[msg.senderType]) {
          missingNames[msg.senderType].add(id)
        }
      }
    })

    // Fetch batch de nombres
    const nameMap = new Map<string, string>()

    await Promise.all([
      // Clientes
      (async () => {
        if (missingNames[MSG_ROLES.CUSTOMER].size > 0) {
          const users = await prisma.customer.findMany({
            where: { id: { in: Array.from(missingNames[MSG_ROLES.CUSTOMER]) } },
            select: { id: true, nombre: true, apellido: true }
          })
          users.forEach(u => nameMap.set(`${MSG_ROLES.CUSTOMER}:${u.id}`, `${u.nombre} ${u.apellido || ''}`.trim()))
        }
      })(),
      // Técnicos
      (async () => {
        if (missingNames[MSG_ROLES.TECHNICIAN].size > 0) {
          const users = await prisma.technician.findMany({
            where: { id: { in: Array.from(missingNames[MSG_ROLES.TECHNICIAN]) } },
            select: { id: true, nombre: true } // Técnicos no tienen apellido obligatorio a veces
          })
          users.forEach(u => nameMap.set(`${MSG_ROLES.TECHNICIAN}:${u.id}`, u.nombre))
        }
      })(),
      // Admins
      (async () => {
        if (missingNames[MSG_ROLES.ADMIN].size > 0) {
          const users = await prisma.adminUser.findMany({
            where: { id: { in: Array.from(missingNames[MSG_ROLES.ADMIN]) } },
            select: { id: true, nombre: true, apellido: true }
          })
          users.forEach(u => nameMap.set(`${MSG_ROLES.ADMIN}:${u.id}`, `${u.nombre} ${u.apellido || ''}`.trim()))
        }
      })()
    ])

    return NextResponse.json({
      success: true,
      messages: messages.map((msg: any) => {
        // Resolver nombre final
        let finalName = msg.senderName
        if (!finalName || finalName === 'Usuario') {
          const key = `${msg.senderType}:${msg.senderId}`
          if (nameMap.has(key)) {
            finalName = nameMap.get(key)
          }
        }

        return {
          ...msg,
          senderName: finalName, // Sobrescribir con nombre enriquecido
          from: {
            name: finalName,
            role: msg.senderType,
            id: msg.senderId
          },
          to: {
             role: msg.receiverType,
             id: msg.receiverId
          },
          relatedOrder: msg.order?.orderNumber
        }
      })
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/messages
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { user } = auth
    const body = await request.json()

    if (!body.content) {
       return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 })
    }

    // Determinar remitente
    let senderType: string = MSG_ROLES.CUSTOMER
    if (user.role === 'technician') senderType = MSG_ROLES.TECHNICIAN
    if (['admin', 'super_admin', 'technician_manager'].includes(user.role)) {
      senderType = MSG_ROLES.ADMIN
    }

    // Obtener nombre del remitente con fallback robusto
    let senderName = 'Usuario'

    if (user.nombre) {
      senderName = `${user.nombre} ${user.apellido || ''}`.trim()
    } else {
      // Si user no tiene nombre, buscar en la tabla correspondiente
      try {
        if (senderType === MSG_ROLES.CUSTOMER) {
          const customer = await prisma.customer.findUnique({
            where: { id: parseInt(user.id.toString()) },
            select: { nombre: true, apellido: true }
          })
          if (customer) {
            senderName = `${customer.nombre} ${customer.apellido || ''}`.trim()
          }
        } else if (senderType === MSG_ROLES.TECHNICIAN) {
          const tech = await prisma.technician.findFirst({
            where: { email: user.email },
            select: { nombre: true }
          })
          if (tech) {
            senderName = tech.nombre
          }
        } else if (senderType === MSG_ROLES.ADMIN) {
          const admin = await prisma.adminUser.findUnique({
            where: { id: parseInt(user.id.toString()) },
            select: { nombre: true, apellido: true }
          })
          if (admin) {
            senderName = `${admin.nombre} ${admin.apellido || ''}`.trim()
          }
        }
      } catch (err) {
        console.error('Error obteniendo nombre del remitente:', err)
      }
    }

    // Resolver Destinatario
    let receiverId = body.receiverId
    let receiverType = body.receiverType || MSG_ROLES.SUPPORT

    // Lógica inteligente de enrutamiento si no hay receiverId explícito
    if (!receiverId && body.orderId) {
       if (receiverType === MSG_ROLES.TECHNICIAN) {
          // Buscar técnico asignado a la orden
          const assignment = await prisma.assignment.findFirst({
            where: {
               orderId: body.orderId,
               estado: { not: 'cancelado' }
            },
            include: { technician: true }
          })

          if (assignment && assignment.technician) {
             // Buscar usuario Admin correspondiente al técnico (por email)
             const techUser = await prisma.adminUser.findUnique({
               where: { email: assignment.technician.email }
             })
             if (techUser) {
               receiverId = techUser.id.toString()
             }
          }
       }
    }

    // Fallback para soporte/admin
    if ((receiverType === MSG_ROLES.SUPPORT || receiverType === MSG_ROLES.ADMIN) && !receiverId) {
        // Asignar ID 0 para 'Soporte General' o buscar un admin
        // Usamos '0' para indicar inbox compartido de admins
        receiverId = '0'
        receiverType = MSG_ROLES.SUPPORT
    }

    if (!receiverId) {
       // Si falló la resolución automática, pero es un customer hablando de una orden...
       // Asignar a soporte como fallback
       receiverId = '0'
       receiverType = MSG_ROLES.SUPPORT
    }

    // Validar Order ID para evitar errores de Foreign Key
    const orderIdToSave = (body.orderId && typeof body.orderId === 'string' && body.orderId.trim() !== '' && body.orderId !== '0')
      ? body.orderId
      : null

    // @ts-ignore
    const newMessage = await prisma.message.create({
      data: {
        content: body.content,
        subject: body.subject || 'Mensaje',
        category: body.category || 'general',
        priority: body.priority || 'normal',

        senderId: String(user.id),
        senderType: senderType,
        senderName: senderName || user.email || user.username || 'Usuario',

        receiverId: String(receiverId),
        receiverType: receiverType,

        orderId: orderIdToSave,
      }
    })

    // 🔔 DISPARAR NOTIFICACIÓN IN-APP
    try {
      // Si el destinatario es '0' (Soporte/Admin), notificar a un rol o admin general
      // En este sistema, '0' es capturado por los admins en sus consultas.

      const notificationLink = orderIdToSave
        ? (receiverType === MSG_ROLES.ADMIN || receiverType === MSG_ROLES.SUPPORT ? `/admin/orders/${orderIdToSave}` : `/technician/assignments?orderId=${orderIdToSave}`)
        : (receiverType === MSG_ROLES.ADMIN || receiverType === MSG_ROLES.SUPPORT ? '/admin/messages' : '/technician/messages');

      await sendNotification({
        userId: receiverId.toString(),
        userType: receiverType,
        to: receiverType === MSG_ROLES.SUPPORT ? 'Administración' : (receiverId === '0' ? 'Soporte' : 'Usuario'),
        subject: `Nuevo mensaje de ${senderName}`,
        message: body.content.substring(0, 100) + (body.content.length > 100 ? '...' : ''),
        type: 'SYSTEM',
        orderId: orderIdToSave || undefined,
        metadata: {
          link: notificationLink,
          messageId: newMessage.id,
          senderName: senderName
        }
      })
    } catch (notifError) {
      console.error('Error enviando notificación de mensaje:', notifError)
    }

    return NextResponse.json({
      success: true,
      message: newMessage
    }, { status: 201 })

  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        error: 'Error enviando mensaje',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
