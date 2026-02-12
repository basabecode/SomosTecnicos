
# Script para importar backup a Neon usando Docker
# Evita tener que instalar PostgreSQL/psql nativamente en Windows
$ErrorActionPreference = "Stop"
$SqlFile = "neon_migration.sql"

Write-Host "🔍 Verificando archivo de migración..."
if (!(Test-Path $SqlFile)) {
    Write-Error "❌ No se encuentra el archivo $SqlFile. Ejecuta primero 'scripts/backup_local_db.ps1'"
}

Write-Host "ℹ️  Este script usará un contenedor temporal de Docker para subir los datos."
Write-Host "ℹ️  No necesitas instalar nada en tu Windows."
Write-Host ""

$ConnectionString = Read-Host "🔏 Pega aquí tu Connection String de Neon (la que empieza con postgres://)"
$ConnectionString = $ConnectionString.Trim()

if ($ConnectionString -notmatch "^postgresql://") {
    Write-Error "❌ La cadena de conexión no parece válida. Debe empezar con postgres://"
}

Write-Host ""
Write-Host "🚀 Iniciando importación a Neon... (Esto puede tardar unos segundos)"

# Ejecutamos psql dentro de un contenedor Docker
# -v "${PWD}:/data": Monta la carpeta actual dentro del contenedor en /data
# -f "/data/$SqlFile": Le dice a psql que ejecute el archivo montado
docker run --rm -v "${PWD}:/data" postgres:15-alpine psql $ConnectionString -f "/data/$SqlFile"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Importación completada exitosamente!"
    Write-Host "Ahora verifica tu base de datos en el Dashboard de Neon."
} else {
    Write-Host ""
    Write-Error "❌ Hubo un error durante la importación. Revisa el mensaje de arriba."
}
