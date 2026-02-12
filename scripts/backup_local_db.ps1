
# Script para hacer backup de la base de datos local de Docker
# y prepararla para Neon
$ErrorActionPreference = "Stop"

$CONTAINER_NAME = "servicio_tecnico_db"
$DB_USER = "admin"
$DB_NAME = "servicio_tecnico"
$OUTPUT_FILE = "neon_migration.sql"

Write-Host "Verificando si el contenedor '$CONTAINER_NAME' está corriendo..."
if (!(docker ps -q -f name=$CONTAINER_NAME)) {
    Write-Error "El contenedor '$CONTAINER_NAME' no está corriendo. Por favor inicia tus servicios con 'docker-compose up -d' primero."
}

Write-Host "Generando backup compatible con Neon..."
# Usamos pg_dump con opciones específicas para maximizar compatibilidad
# --no-owner: Neon ignora los dueños de objetos ya que usa roles propios
# --no-privileges: Neon maneja privilegios a nivel de su plataforma
# --clean: Incluye comandos DROP para limpiar antes de crear (útil si re-importas)
# --if-exists: Evita errores si tratas de borrar algo que no existe
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME --no-owner --no-privileges > $OUTPUT_FILE

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup exitoso generado en: $PWD\$OUTPUT_FILE"
    Write-Host "Ahora puedes importar este archivo a Neon usando la guía en docs/GUIA_MIGRACION_NEON.md"
} else {
    Write-Error "❌ Hubo un error al generar el backup."
}
