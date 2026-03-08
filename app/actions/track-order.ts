'use server'

import { prisma } from '@/lib/prisma'

export async function trackOrder(orderNumber: string) {
  const trimmed = typeof orderNumber === 'string' ? orderNumber.trim() : ''

  if (trimmed.length < 3) {
    return { success: false, error: 'Por favor ingrese un número de orden válido' }
  }
  if (trimmed.length > 50) {
    return { success: false, error: 'Número de orden demasiado largo' }
  }
  // Solo letras, dígitos, guiones y guiones bajos (formato estándar de órdenes)
  if (!/^[a-zA-Z0-9\-_]+$/.test(trimmed)) {
    return { success: false, error: 'El número de orden contiene caracteres no válidos' }
  }

  try {
    // Intentar buscar por orderNumber
    let order = await prisma.order.findUnique({
      where: { orderNumber: trimmed },
      select: {
        id: true,
        orderNumber: true,
        estado: true,
        tipoServicio: true,
        tipoElectrodomestico: true,
        createdAt: true,
        updatedAt: true,
        marca: true,
        assignments: {
          where: {
            // Buscamos la asignación más relevante
            estado: {
              not: 'cancelado'
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            estado: true,
            technician: {
              select: {
                nombre: true
              }
            }
          }
        }
      }
    })

    if (!order) {
        return { success: false, error: 'No se encontró ninguna orden con este número' }
    }

    // Formateamos los datos para enviar solo lo necesario
    return {
      success: true,
      order: {
        numero: order.orderNumber,
        estado: order.estado,
        servicio: `${order.tipoServicio} de ${order.tipoElectrodomestico}`,
        marca: order.marca || 'No especificada',
        fecha: order.createdAt.toISOString(),
        ultimaActualizacion: order.updatedAt.toISOString(),
        tecnico: order.assignments[0]?.technician.nombre ? order.assignments[0].technician.nombre.split(' ')[0] : null, // Solo primer nombre por privacidad
        estadoTecnico: order.assignments[0]?.estado || null
      }
    }

  } catch (error) {
    console.error('Track Order Error:', error)
    return { success: false, error: 'Ocurrió un error al consultar la orden. Intente nuevamente.' }
  }
}
