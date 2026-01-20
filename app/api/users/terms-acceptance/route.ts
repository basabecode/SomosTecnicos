import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TERMS_VERSION } from '@/lib/terms-and-conditions'

/**
 * POST /api/users/terms-acceptance
 * Guarda la aceptación de términos y condiciones de un usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userType, version } = body

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'userId y userType son requeridos' },
        { status: 400 }
      )
    }

    const acceptedVersion = version || TERMS_VERSION
    const acceptedAt = new Date()

    // Actualizar según el tipo de usuario
    let updated

    switch (userType) {
      case 'customer':
        updated = await prisma.customer.update({
          where: { id: parseInt(userId) },
          data: {
            termsAcceptedAt: acceptedAt,
            termsVersion: acceptedVersion
          } as any
        })
        break

      case 'technician':
        updated = await prisma.technician.update({
          where: { id: parseInt(userId) },
          data: {
            termsAcceptedAt: acceptedAt,
            termsVersion: acceptedVersion
          } as any
        })
        break

      case 'admin':
        updated = await prisma.adminUser.update({
          where: { id: parseInt(userId) },
          data: {
            termsAcceptedAt: acceptedAt,
            termsVersion: acceptedVersion
          } as any
        })
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de usuario inválido' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: {
        termsAcceptedAt: acceptedAt,
        termsVersion: acceptedVersion
      }
    })

  } catch (error) {
    console.error('Error saving terms acceptance:', error)
    return NextResponse.json(
      { error: 'Error al guardar la aceptación de términos' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/users/terms-acceptance?userId=X&userType=Y
 * Verifica si un usuario ha aceptado los términos actuales
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')

    if (!userId || !userType) {
      return NextResponse.json(
        { error: 'userId y userType son requeridos' },
        { status: 400 }
      )
    }

    let user

    switch (userType) {
      case 'customer':
        user = await prisma.customer.findUnique({
          where: { id: parseInt(userId) },
          select: {
            termsAcceptedAt: true,
            termsVersion: true
          } as any
        })
        break

      case 'technician':
        user = await prisma.technician.findUnique({
          where: { id: parseInt(userId) },
          select: {
            termsAcceptedAt: true,
            termsVersion: true
          } as any
        })
        break

      case 'admin':
        user = await prisma.adminUser.findUnique({
          where: { id: parseInt(userId) },
          select: {
            termsAcceptedAt: true,
            termsVersion: true
          } as any
        })
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de usuario inválido' },
          { status: 400 }
        )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Casteamos a any temporalmente si los tipos de Prisma no se han actualizado en el editor
    // o definimos una interfaz base si preferimos más seguridad
    const userWithTerms = user as { termsVersion?: string | null; termsAcceptedAt?: Date | null }

    const hasAcceptedCurrentVersion = userWithTerms.termsVersion === TERMS_VERSION

    return NextResponse.json({
      hasAccepted: !!userWithTerms.termsAcceptedAt,
      hasAcceptedCurrentVersion,
      termsAcceptedAt: userWithTerms.termsAcceptedAt,
      termsVersion: userWithTerms.termsVersion,
      currentVersion: TERMS_VERSION
    })

  } catch (error) {
    console.error('Error checking terms acceptance:', error)
    return NextResponse.json(
      { error: 'Error al verificar la aceptación de términos' },
      { status: 500 }
    )
  }
}
