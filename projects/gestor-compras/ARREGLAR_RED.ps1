# Script de Reparación de Red para Gestor de Compras MIP
Write-Host "Iniciando configuración de red..." -ForegroundColor Cyan

# 1. Verificar Permisos de Administrador
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️ Se requieren permisos de Administrador." -ForegroundColor Yellow
    Write-Host "Iniciando nuevamente como Administrador..." -ForegroundColor Yellow
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# 2. Abrir Puertos en Firewall (Frontend y Backend)
Write-Host "Abriendo puertos en el Firewall (3000, 5173, 5174)..." -ForegroundColor Green
try {
    New-NetFirewallRule -DisplayName "Gestor MIP - Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
    New-NetFirewallRule -DisplayName "Gestor MIP - Frontend VITE" -Direction Inbound -LocalPort 5173,5174 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
    Write-Host "✅ Puertos abiertos correctamente." -ForegroundColor Green
} catch {
    Write-Host "❌ Error al configurar Firewall." -ForegroundColor Red
}

# 3. Mostrar IP Local
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notmatch "Loopback|vEthernet" -and $_.IPAddress -notmatch "^169\."}).IPAddress | Select-Object -First 1
Write-Host "`n------------------------------------------------"
Write-Host "✅ RED CONFIGURADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "------------------------------------------------"
Write-Host "👉 TU IP DE RED ES: $ip" -ForegroundColor Cyan
Write-Host "------------------------------------------------"
Write-Host "Comparte este enlace con tu equipo:"
Write-Host "https://$($ip):5173" -ForegroundColor Yellow
Write-Host "`nPresiona Enter para salir..."
Read-Host
