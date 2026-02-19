/**
 * API Configuración del Sistema (Admin)
 * GET  /api/admin/settings — leer settings del sistema
 * PUT  /api/admin/settings — guardar settings del sistema
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRoles } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Claves de configuración del sistema que se gestionan
const SYSTEM_KEYS = [
  'company_name',
  'support_email',
  'support_phone',
  'company_address',
  'timezone',
  'email_notifications',
  'sms_notifications',
  'auto_assignment',
  'session_timeout',
  'max_login_attempts',
  'maintenance_mode',
  'maps_api_key',
  'whatsapp_token',
  'smtp_server',
  'smtp_port',
] as const

// Valores por defecto
const DEFAULTS: Record<string, string> = {
  company_name: 'SomosTécnicos',
  support_email: 'soporte@somostecnicos.com',
  support_phone: '+57 300 123 4567',
  company_address: 'Calle 123 #45-67, Bogotá, Colombia',
  timezone: 'America/Bogota',
  email_notifications: 'true',
  sms_notifications: 'false',
  auto_assignment: 'true',
  session_timeout: '60',
  max_login_attempts: '5',
  maintenance_mode: 'false',
  maps_api_key: '',
  whatsapp_token: '',
  smtp_server: 'smtp.gmail.com',
  smtp_port: '587',
}

// =============================================
// GET /api/admin/settings
// =============================================

export const GET = withRoles(
  ['super_admin', 'admin'],
  async (request: NextRequest, user) => {
    try {
      const dbSettings = await prisma.systemSetting.findMany({
        where: { key: { in: SYSTEM_KEYS as unknown as string[] } },
        select: { key: true, value: true }
      })

      // Merge con valores por defecto para que siempre haya datos
      const settingsMap: Record<string, string> = { ...DEFAULTS }
      for (const s of dbSettings) {
        settingsMap[s.key] = s.value
      }

      return NextResponse.json({ success: true, data: settingsMap })
    } catch (error) {
      console.error('Error obteniendo configuraciones:', error)
      return NextResponse.json(
        { success: false, error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
)

// =============================================
// PUT /api/admin/settings
// =============================================

export const PUT = withRoles(
  ['super_admin', 'admin'],
  async (request: NextRequest, user) => {
    try {
      const body = await request.json()

      // Solo guardamos claves permitidas
      const updates: Array<{ key: string; value: string }> = []
      for (const key of SYSTEM_KEYS) {
        if (key in body && body[key] !== undefined) {
          updates.push({ key, value: String(body[key]) })
        }
      }

      if (updates.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No se recibieron configuraciones válidas' },
          { status: 400 }
        )
      }

      // Upsert de cada configuración
      await Promise.all(
        updates.map(({ key, value }) =>
          prisma.systemSetting.upsert({
            where: { key },
            create: {
              key,
              value,
              descripcion: key.replace(/_/g, ' '),
              categoria: getCategoryForKey(key),
              updatedBy: user.username,
            },
            update: {
              value,
              updatedBy: user.username,
            }
          })
        )
      )

      return NextResponse.json({
        success: true,
        message: 'Configuración guardada correctamente',
        updated: updates.length
      })
    } catch (error) {
      console.error('Error guardando configuraciones:', error)
      return NextResponse.json(
        { success: false, error: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  }
)

function getCategoryForKey(key: string): string {
  if (['email_notifications', 'sms_notifications', 'smtp_server', 'smtp_port'].includes(key)) return 'email'
  if (['maps_api_key', 'whatsapp_token'].includes(key)) return 'integrations'
  if (['session_timeout', 'max_login_attempts', 'maintenance_mode'].includes(key)) return 'security'
  return 'system'
}
