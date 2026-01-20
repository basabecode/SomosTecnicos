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

    // Construir filtro
    const whereClause: any = {
      OR: [
        {
          senderId: user.id.toString(),
          senderType: userType
        },
        {
          receiverId: user.id.toString(),
          receiverType: userType
        },
        // Admins ven mensajes a soporte
        ...(userType === MSG_ROLES.ADMIN ? [{ receiverType: MSG_ROLES.SUPPORT }] : [])
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

    return NextResponse.json({
      success: true,
      messages: messages.map((msg: any) => ({
        ...msg,
        from: {
          name: msg.senderName,
          role: msg.senderType,
          id: msg.senderId
        },
        to: {
           role: msg.receiverType,
           id: msg.receiverId
        },
        relatedOrder: msg.order?.orderNumber
      }))
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

    const senderName = `${user.nombre} ${user.apellido || ''}`.trim()

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

    // @ts-ignore
    const newMessage = await prisma.message.create({
      data: {
        content: body.content,
        subject: body.subject || 'Mensaje',
        category: body.category || 'general',
        priority: body.priority || 'normal',

        senderId: user.id.toString(),
        senderType: senderType,
        senderName: senderName || user.email || user.username || 'Usuario',

        receiverId: receiverId.toString(),
        receiverType: receiverType,

        orderId: body.orderId, // Puede ser null
      }
    })

    // 🔔 DISPARAR NOTIFICACIÓN IN-APP
    try {
      // Si el destinatario es '0' (Soporte/Admin), notificar a un rol o admin general
      // En este sistema, '0' es capturado por los admins en sus consultas.

      const notificationLink = body.orderId
        ? (receiverType === MSG_ROLES.ADMIN || receiverType === MSG_ROLES.SUPPORT ? `/admin/orders/${body.orderId}` : `/technician/assignments?orderId=${body.orderId}`)
        : (receiverType === MSG_ROLES.ADMIN || receiverType === MSG_ROLES.SUPPORT ? '/admin/messages' : '/technician/messages');

      await sendNotification({
        userId: receiverId.toString(),
        userType: receiverType,
        to: receiverType === MSG_ROLES.SUPPORT ? 'Administración' : (receiverId === '0' ? 'Soporte' : 'Usuario'),
        subject: `Nuevo mensaje de ${senderName}`,
        message: body.content.substring(0, 100) + (body.content.length > 100 ? '...' : ''),
        type: 'SYSTEM',
        orderId: body.orderId,
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
    return NextResponse.json(
      { success: false, error: 'Error enviando mensaje' },
      { status: 500 }
    )
  }
}
