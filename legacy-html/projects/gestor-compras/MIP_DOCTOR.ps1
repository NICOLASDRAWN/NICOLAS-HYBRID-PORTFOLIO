# Script de Diagnóstico MIP Internacional
Clear-Host
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           🚀 DIAGNÓSTICO DE SALUD - MIP INTERNACIONAL              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$errors = 0

# 1. Verificar Node.js
Write-Host "[1/5] Verificando Node.js... " -NoNewline
try {
    $nodeVer = node -v
    Write-Host "✅ OK ($nodeVer)" -ForegroundColor Green
} catch {
    Write-Host "❌ NO ENCONTRADO" -ForegroundColor Red
    Write-Host "    Pista: Instala Node.js desde https://nodejs.org" -ForegroundColor Gray
    $errors++
}

# 2. Verificar NPM
Write-Host "[2/5] Verificando NPM... " -NoNewline
try {
    $npmVer = npm -v
    Write-Host "✅ OK ($npmVer)" -ForegroundColor Green
} catch {
    Write-Host "❌ NO ENCONTRADO" -ForegroundColor Red
    $errors++
}

# 3. Verificar Archivos Críticos
Write-Host "[3/5] Verificando archivos del proyecto... " -NoNewline
$files = @("package.json", "electron-main.cjs", "backend/server.js")
foreach ($f in $files) {
    if (!(Test-Path $f)) {
        Write-Host "❌ FALTA $f " -ForegroundColor Red -NoNewline
        $errors++
    }
}
if ($errors -eq 0) { Write-Host "✅ OK" -ForegroundColor Green } else { Write-Host "" }

# 4. Verificar Puerto 3000
Write-Host "[4/5] Verificando Puerto 3000... " -NoNewline
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "⚠️ OCUPADO (PID: $($port3000.OwningProcess))" -ForegroundColor Yellow
    Write-Host "    Nota: El iniciador intentará liberarlo automáticamente." -ForegroundColor Gray
} else {
    Write-Host "✅ LIBRE" -ForegroundColor Green
}

# 5. Verificar Dependencias
Write-Host "[5/5] Verificando carpeta node_modules... " -NoNewline
if (Test-Path "node_modules") {
    Write-Host "✅ OK" -ForegroundColor Green
} else {
    Write-Host "⚠️ NO ENCONTRADA" -ForegroundColor Yellow
    Write-Host "    Sugerencia: Ejecuta 'REPARAR_MIP.bat' opción 2." -ForegroundColor Gray
}

Write-Host ""
if ($errors -eq 0) {
    Write-Host "✅ EL SISTEMA PARECE ESTAR EN BUEN ESTADO." -ForegroundColor Green
} else {
    Write-Host "❌ SE DETECTARON $errors PROBLEMAS CRÍTICOS." -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = [Console]::ReadKey()
