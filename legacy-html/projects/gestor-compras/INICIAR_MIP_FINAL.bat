@echo off
setlocal enabledelayedexpansion
title [SISTEMA] CENTRO DE MANDO MIP v5 (UNIFICADO)
color 0F

:: --- AUTOMATIC STARTUP ---
echo.
echo    ==========================================================
echo            SISTEMA DE GESTION MIP INTERNACIONAL
echo    ==========================================================
echo.
echo    [*] El sistema se iniciara automaticamente en 2 segundos...
echo    [PULSA UNA TECLA PARA MENU DE MANTENIMIENTO]
echo.
choice /c 1234567890 /n /t 2 /d 1 >nul 2>&1
if %errorlevel% neq 255 goto Lanzar

:Menu
cls
echo.
echo    ==========================================================
echo            CENTRO DE MANDO - MANTENIMIENTO
echo    ==========================================================
echo.
echo    [1] =€ INICIAR SISTEMA (Lanzar unicamente la aplicacion)
echo    [2] = REPARAR Y SINCRONIZAR (Master Sync)
echo    [3] = RECUPERAR CLAVES (Admin: mip2025* / Maria: compras2026*)
echo    [4] =Â ABRIR CARPETA DE DATOS
echo    [5] =Ñ DETENER TODOS LOS SERVICIOS
echo    [0] L SALIR
echo.
set /p opt="> Seleccione: "

if "%opt%"=="1" goto Lanzar
if "%opt%"=="2" goto Repair
if "%opt%"=="3" goto Clave
if "%opt%"=="4" goto Folder
if "%opt%"=="5" goto Stop
if "%opt%"=="0" exit
goto Menu

:Lanzar
echo [*] Liberando recursos...
taskkill /f /im node.exe /t >nul 2>&1
taskkill /f /im "MIP*.exe" /t >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo [*] Sincronizando datos...
node sync_latest_data.js

echo [*] Iniciando servidor en segundo plano...
:: Usamos la ruta absoluta del proyecto para asegurar consistencia
set USER_DATA_PATH=%~dp0
start "MIP_SERVICE" /min cmd /c "node backend/server.js 2> error.log"

echo [*] Esperando que el motor responda...
node wait_for_server.js
if %errorlevel% neq 0 (
    cls
    echo.
    echo    [!] ERROR CRITICO: El servidor no ha respondido.
    echo    Revise el archivo 'error.log' para ver el detalle técnico.
    echo.
    pause
    goto Menu
)

echo [*] Lanzando interfaz de usuario...
set "APP_EXE=dist-app\win-unpacked\MIP Internacional - Gestor de Compras.exe"
if exist "%APP_EXE%" (
    start "" "%APP_EXE%"
) else (
    echo [!] No se encontro el ejecutable compilado. Usando navegador...
    start http://localhost:3000
)

echo.
echo  SISTEMA ACTIVO Y EN EJECUCION.
echo.
echo [!] Esta ventana se minimizara y permanecera activa para mantener el motor.
echo     Si la cierra de inmediato, el sistema se detendra.
echo.
pause
goto Menu

:Repair
echo [*] Deteniendo procesos...
taskkill /f /im node.exe /t >nul 2>&1
taskkill /f /im "MIP*.exe" /t >nul 2>&1
echo [*] Forzando sincronizacion maestra...
node sync_latest_data.js
echo [*] Listo.
pause
goto Menu

:Clave
echo [*] Reseteando claves...
node update_admin_pass.js
node update_maria_pass.js
echo [*] Sincronizando...
node sync_latest_data.js
echo.
echo  CLAVES ACTUALIZADAS:
echo    - Administrador: mip2025*
echo    - Maria Alejandra: compras2026*
echo.
pause
goto Menu

:Folder
explorer "backend\data"
goto Menu

:Stop
echo [*] Deteniendo servicios...
taskkill /f /im node.exe /t >nul 2>&1
taskkill /f /im "MIP*.exe" /t >nul 2>&1
echo  Servicios detenidos.
pause
goto Menu
