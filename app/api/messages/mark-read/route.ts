import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { messageIds } = body

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ success: true, count: 0 })
    }

    // Actualizar estado 'read'
    // Aseguramos que solo se marquen mensajes donde el usuario actual es el receptor
    // @ts-ignore
    const result = await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: auth.user.id.toString()
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({
      success: true,
      count: result.count
    })

  } catch (error) {
    console.error('[API-MSG] Error marking messages as read:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
