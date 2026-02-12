
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function checkDb() {
    console.log('---------------------------------------------------')
    console.log('🕵️‍♀️ Verificando conexión a Neon y datos de usuario...')
    console.log('---------------------------------------------------')
    console.log(`📡 URL usada: ${process.env.DATABASE_URL?.substring(0, 20)}...`)

    try {
        // 1. Probar conexión básica
        const count = await prisma.adminUser.count()
        console.log(`✅ Conexión EXITOSA.`)
        console.log(`📊 Número de usuarios admin encontrados: ${count}`)

        if (count === 0) {
            console.error('⚠️  ALERTA: No hay usuarios administradores en la base de datos.')
            console.error('   ¿Ejecutaste el script de importación (step 2)?')
            console.error('   Si no, ejecuta: .\\scripts\\import_to_neon.ps1')
            console.error('   O ejecuta el seed: npx prisma db seed')
        } else {
            // 2. Buscar el usuario admin específico
            const admin = await prisma.adminUser.findFirst({
                where: { OR: [{ email: 'admin.demo@somostecnicos.com' }, { username: 'admin_demo' }] }
            })

            if (admin) {
                console.log(`✅ Usuario admin encontrado: ${admin.email} (ID: ${admin.id})`)
                console.log(`   Role: ${admin.role}`)
                console.log(`   Hash de contraseña empieza con: ${admin.passwordHash?.substring(0, 10)}...`)
            } else {
                console.error('❌ Usuario admin (admin.demo@somostecnicos.com) NO encontrado.')
            }
        }

    } catch (e: any) {
        console.error('❌ ERROR FATAL DE CONEXIÓN:')
        console.error(e.message)
    } finally {
        await prisma.$disconnect()
    }
}

checkDb()
