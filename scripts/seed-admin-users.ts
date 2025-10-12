/**
 * Script para crear usuarios de prueba en la base de datos
 * Ejecutar con: pnpm tsx scripts/seed-admin-users.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdminUsers() {
  try {
    console.log('🌱 Iniciando seed de usuarios de prueba...')

    // Verificar si ya existen usuarios
    const existingUsers = await prisma.adminUser.findMany()
    console.log(`📊 Usuarios existentes: ${existingUsers.length}`)

    // Crear usuarios de prueba si no existen
    const users = [
      {
        email: 'admin@tecnocity.com',
        username: 'admin_tecnocity',
        password: 'admin123',
        nombre: 'Administrador',
        apellido: 'TecnoCity',
        role: 'super_admin'
      },
      {
        email: 'tecnico@tecnocity.com',
        username: 'tecnico_juan',
        password: 'tecnico123',
        nombre: 'Juan',
        apellido: 'Pérez',
        role: 'technician_manager'
      },
      {
        email: 'manager@tecnocity.com',
        username: 'manager_maria',
        password: 'manager123',
        nombre: 'María',
        apellido: 'García',
        role: 'admin'
      }
    ]

    for (const userData of users) {
      // Verificar tanto email como username
      const emailExists = await prisma.adminUser.findUnique({
        where: { email: userData.email }
      })

      const usernameExists = await prisma.adminUser.findUnique({
        where: { username: userData.username }
      })

      if (!emailExists && !usernameExists) {
        const hashedPassword = await bcrypt.hash(userData.password, 12)

        await prisma.adminUser.create({
          data: {
            username: userData.username,
            email: userData.email,
            passwordHash: hashedPassword,
            nombre: userData.nombre,
            apellido: userData.apellido,
            role: userData.role,
            activo: true
          }
        })

        console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`)
      } else {
        if (emailExists) {
          console.log(`� Email ya existe: ${userData.email}`)
        }
        if (usernameExists) {
          console.log(`👤 Username ya existe: ${userData.username}`)
        }
      }
    }

    console.log('🎉 Seed completado exitosamente!')

  } catch (error) {
    console.error('❌ Error al crear usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seed
seedAdminUsers()
