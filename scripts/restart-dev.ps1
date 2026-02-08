# Script para reiniciar el servidor de desarrollo
Write-Host "🔄 Reiniciando servidor de desarrollo..." -ForegroundColor Cyan

# Detener procesos de Node/pnpm relacionados con el puerto 3000
Write-Host "⏹️  Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | ForEach-Object {
    try {
        $port = netstat -ano | findstr ":3000" | findstr $_.Id
        if ($port) {
            Write-Host "  Deteniendo proceso $($_.Id) ($($_.ProcessName))" -ForegroundColor Gray
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Ignorar errores
    }
}

Start-Sleep -Seconds 2

# Iniciar el servidor
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
pnpm run dev
