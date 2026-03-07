/**
 * Cliente Prisma compatible con Edge Runtime (Vercel Edge Functions)
 *
 * Usa PrismaNeonHttp (fetch HTTP, sin TCP ni WebSocket) para ser compatible
 * con Edge Runtime donde process.on y WebSockets no están disponibles.
 *
 * USO: Solo importar en route.ts con `export const runtime = 'edge'`
 * Para el resto del proyecto seguir usando lib/prisma.ts (Node.js runtime)
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

function createEdgePrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL no está configurada')
  }

  // PrismaNeonHttp usa fetch HTTP — compatible con Edge Runtime sin WebSocket
  // arrayMode: false → retorna objetos ({key: value}), no arrays posicionales
  const adapter = new PrismaNeonHttp(connectionString, { arrayMode: false })

  return new PrismaClient({ adapter })
}

// Singleton por invocación Edge
const globalForEdgePrisma = globalThis as unknown as {
  prismaEdge: PrismaClient | undefined
}

export const prismaEdge =
  globalForEdgePrisma.prismaEdge ?? createEdgePrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForEdgePrisma.prismaEdge = prismaEdge
}
