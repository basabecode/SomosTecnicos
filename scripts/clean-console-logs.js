#!/usr/bin/env node

/**
 * 🧹 TecnoCity - Script de Limpieza de Console.logs
 * ================================================
 *
 * Remueve automáticamente console.log statements de producción
 * y los reemplaza con logging seguro usando el logger centralizado
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Configuración
const CONFIG = {
  // Directorios a procesar
  include: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'lib/**/*.ts',
  ],

  // Archivos a excluir
  exclude: [
    'node_modules/**',
    '.next/**',
    'prisma/seed.ts', // Mantener logs en seeds
    'scripts/**', // Mantener logs en scripts
    'docs/**',
    '**/*.test.ts',
    '**/*.spec.ts',
  ],

  // Patrones de console.log a reemplazar
  patterns: [
    {
      // console.log simple
      regex: /console\.log\((.*?)\)/g,
      replacement: '// REMOVED: console.log($1) - Use logger.info instead',
    },
    {
      // console.error que no están en catch
      regex: /(?<!catch.*?)console\.error\((.*?)\)(?!\s*})/g,
      replacement: 'logger.error($1)',
    },
    {
      // console.warn
      regex: /console\.warn\((.*?)\)/g,
      replacement: 'logger.warn($1)',
    },
    {
      // console.info
      regex: /console\.info\((.*?)\)/g,
      replacement: 'logger.info($1)',
    },
  ],
}

class ConsoleLogCleaner {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      filesModified: 0,
      logsRemoved: 0,
      logsReplaced: 0,
    }
  }

  /**
   * 🚀 Ejecutar limpieza completa
   */
  async run() {
    console.log('🧹 Iniciando limpieza de console.logs...\n')

    try {
      const files = await this.getFilesToProcess()
      console.log(`📁 Archivos encontrados: ${files.length}\n`)

      for (const file of files) {
        await this.processFile(file)
      }

      this.printSummary()
    } catch (error) {
      console.error('❌ Error durante la limpieza:', error)
      process.exit(1)
    }
  }

  /**
   * 📄 Obtener lista de archivos a procesar
   */
  async getFilesToProcess() {
    const allFiles = []

    for (const pattern of CONFIG.include) {
      const files = glob.sync(pattern, {
        ignore: CONFIG.exclude,
        absolute: true,
      })
      allFiles.push(...files)
    }

    // Remover duplicados
    return [...new Set(allFiles)]
  }

  /**
   * 🔧 Procesar un archivo individual
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const originalContent = content
      let modifiedContent = content
      let modifications = 0

      // Verificar si necesita importar logger
      const needsLoggerImport = this.needsLoggerImport(content)

      // Aplicar patrones de reemplazo
      for (const pattern of CONFIG.patterns) {
        const matches = modifiedContent.match(pattern.regex)
        if (matches) {
          modifiedContent = modifiedContent.replace(
            pattern.regex,
            pattern.replacement
          )
          modifications += matches.length
        }
      }

      // Agregar import de logger si es necesario
      if (needsLoggerImport && modifications > 0) {
        modifiedContent = this.addLoggerImport(modifiedContent, filePath)
      }

      // Guardar cambios si hubo modificaciones
      if (originalContent !== modifiedContent) {
        fs.writeFileSync(filePath, modifiedContent)
        this.stats.filesModified++
        this.stats.logsRemoved += modifications

        console.log(
          `✅ ${path.relative(
            process.cwd(),
            filePath
          )} - ${modifications} logs procesados`
        )
      }

      this.stats.filesProcessed++
    } catch (error) {
      console.error(`❌ Error procesando ${filePath}:`, error.message)
    }
  }

  /**
   * 🔍 Determinar si el archivo necesita importar logger
   */
  needsLoggerImport(content) {
    return (
      !content.includes("from '@/lib/logger'") &&
      !content.includes('from "@/lib/logger"') &&
      (content.includes('console.log') ||
        content.includes('console.warn') ||
        content.includes('console.error'))
    )
  }

  /**
   * ➕ Agregar import de logger al archivo
   */
  addLoggerImport(content, filePath) {
    // Buscar el último import
    const importRegex = /^import.*from.*$/gm
    const imports = content.match(importRegex) || []

    if (imports.length === 0) {
      // No hay imports, agregar al inicio
      return `import { logger } from '@/lib/logger'\n\n${content}`
    }

    // Verificar si ya existe import de logger
    const hasLoggerImport = imports.some(
      imp => imp.includes('@/lib/logger') || imp.includes('"@/lib/logger"')
    )

    if (hasLoggerImport) {
      return content
    }

    // Agregar después del último import
    const lastImport = imports[imports.length - 1]
    const lastImportIndex = content.indexOf(lastImport)
    const insertPosition = lastImportIndex + lastImport.length

    return (
      content.slice(0, insertPosition) +
      "\nimport { logger } from '@/lib/logger'" +
      content.slice(insertPosition)
    )
  }

  /**
   * 📊 Imprimir resumen de la limpieza
   */
  printSummary() {
    console.log('\n' + '='.repeat(50))
    console.log('🎉 LIMPIEZA COMPLETADA')
    console.log('='.repeat(50))
    console.log(`📁 Archivos procesados: ${this.stats.filesProcessed}`)
    console.log(`✏️  Archivos modificados: ${this.stats.filesModified}`)
    console.log(`🧹 Console.logs removidos: ${this.stats.logsRemoved}`)
    console.log('')

    if (this.stats.filesModified > 0) {
      console.log(
        '✅ Limpieza exitosa! Los console.logs han sido removidos o reemplazados.'
      )
      console.log(
        '🔧 Recuerda revisar los archivos modificados y agregar contexto a los logs donde sea necesario.'
      )
    } else {
      console.log('ℹ️  No se encontraron console.logs para limpiar.')
    }

    console.log('\n🚀 Proyecto listo para producción!')
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  const cleaner = new ConsoleLogCleaner()
  cleaner.run()
}

module.exports = ConsoleLogCleaner
