import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nombre,
      apellido,
      email,
      telefono,
      password,
      direccion,
      ciudad,
      barrio,
      electrodomesticos,
      username,
      isOnboarded,
    } = body

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !telefono || !password || !direccion || !ciudad) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Preparar preferencias con electrodomésticos
    const preferencias = {
      electrodomesticos: electrodomesticos || [],
      barrio: barrio || '',
    }

    // Crear el cliente
    const customer = await prisma.customer.create({
      data: {
        username: username || email.split('@')[0],
        email,
        passwordHash,
        nombre,
        apellido,
        telefono,
        direccion,
        ciudad,
        isOnboarded: isOnboarded || true,
        preferencias: preferencias,
        activo: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente registrado exitosamente',
      customer: {
        id: customer.id,
        nombre: customer.nombre,
        apellido: customer.apellido,
        email: customer.email,
      },
    })
  } catch (error) {
    console.error('Error en registro de cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Error al registrar el cliente' },
      { status: 500 }
    )
  }
}
