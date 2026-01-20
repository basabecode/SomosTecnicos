import { defineConfig } from '@prisma/config'

export default defineConfig({
  // En la versión actual de @prisma/config, el schema se define como string (implícitamente static)
  schema: 'prisma/schema.prisma',

  // Configuración de seed (si soportada por la versión instalada o plugins futuros)
  // @ts-expect-error: La propiedad seed puede no estar tipada en todas las versiones de @prisma/config
  seed: {
    command: 'tsx prisma/seed.ts',
  },
})
