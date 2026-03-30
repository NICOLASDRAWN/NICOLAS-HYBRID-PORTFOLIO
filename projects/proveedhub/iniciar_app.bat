@echo off
title Proveedores MIP - Sistema
color 0F

REM ==========================================
REM VERIFICACION DE MOTOR (NODE.JS)
REM ==========================================
node -v >nul 2>&1
if %errorlevel% neq 0 (
    cls
    color 4F
    echo.
    echo [!] ERROR CRITICO: NO SE DETECTO EL MOTOR NECESARIO
    echo ===================================================
    echo.
    echo Para que esta aplicacion funcione en CUALQUIER computador,
    echo se debe instalar "Node.js" una unica vez.
    echo.
    echo 1. Descarga e instala esto: https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi
    echo 2. Vuelve a abrir este archivo.
    echo.
    echo Presiona cualquier tecla para abrir la pagina de descarga...
    pause >nul
    start https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi
    exit
)

REM ==========================================
REM INICIO DEL SISTEMA
REM ==========================================
cd /d "%~dp0"

IF NOT EXIST "node_modules" (
    echo [Configuracion] Preparando el sistema por primera vez...
    call npm install
    cls
)

echo.
echo    [ PROVEEDORES MIP ]
echo    -------------------
echo    Sistema corriendo. No cierres esta ventana.
echo    Puedes minimizarla.
echo.
echo    Accediendo a la aplicacion...

REM Abre el navegador despues de 4 segundos
timeout /t 4 >nul
start http://localhost:3000

REM Inicia todo el sistema en esta misma ventana
npm run start
