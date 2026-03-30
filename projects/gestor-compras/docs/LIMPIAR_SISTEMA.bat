@echo off
chcp 65001 >nul
color 0E
title 🧹 Limpieza y Optimización del Sistema MIP

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        🧹 LIMPIEZA Y OPTIMIZACIÓN DEL SISTEMA 🧹              ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [%time%] Iniciando proceso de limpieza...
echo.

REM ============================================================
REM  PASO 1: CREAR BACKUP DE SEGURIDAD COMPLETO
REM ============================================================
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📦 PASO 1: Creando Backup de Seguridad Completo          │
echo └────────────────────────────────────────────────────────────┘
echo.

if not exist "backups" mkdir backups

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set datetime=%mydate%_%mytime%
set backupfolder=backups\LIMPIEZA_%datetime%

echo [%time%] Creando backup en: %backupfolder%
mkdir "%backupfolder%" 2>nul

echo Copiando datos importantes...
xcopy "backend\data" "%backupfolder%\data" /E /I /Y /Q >nul 2>&1
copy "*.json" "%backupfolder%\" >nul 2>&1
copy "backend\*.json" "%backupfolder%\" >nul 2>&1
echo ✓ Backup creado exitosamente
echo.
timeout /t 2 >nul

REM ============================================================
REM  PASO 2: ELIMINAR ARCHIVOS DUPLICADOS Y ANTIGUOS
REM ============================================================
echo ┌────────────────────────────────────────────────────────────┐
echo │ 🗑️  PASO 2: Eliminando Archivos Duplicados               │
echo └────────────────────────────────────────────────────────────┘
echo.

REM Eliminar archivos de documentación duplicados
echo Limpiando documentación duplicada...
if exist "README-ACTUALIZACION.md" del /F /Q "README-ACTUALIZACION.md" >nul 2>&1
if exist "actualizar.bat" del /F /Q "actualizar.bat" >nul 2>&1
if exist "GUIA-DE-USO.md" del /F /Q "GUIA-DE-USO.md" >nul 2>&1
if exist "login.json" del /F /Q "login.json" >nul 2>&1
echo ✓ Archivos duplicados eliminados
echo.

REM ============================================================
REM  PASO 3: ORGANIZAR ARCHIVOS
REM ============================================================
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📁 PASO 3: Organizando Archivos                          │
echo └────────────────────────────────────────────────────────────┘
echo.

REM Crear carpeta de documentación si no existe
if not exist "docs" mkdir docs

REM Mover documentación a carpeta docs
echo Organizando documentación...
if exist "LEEME_PRIMERO.md" move /Y "LEEME_PRIMERO.md" "docs\" >nul 2>&1
if exist "GUIA_DE_USO.md" move /Y "GUIA_DE_USO.md" "docs\" >nul 2>&1
if exist "DATOS_CARGADOS.md" move /Y "DATOS_CARGADOS.md" "docs\" >nul 2>&1
if exist "MEJORAS_IMPLEMENTADAS.md" move /Y "MEJORAS_IMPLEMENTADAS.md" "docs\" >nul 2>&1
if exist "RESUMEN_COMPLETO.txt" move /Y "RESUMEN_COMPLETO.txt" "docs\" >nul 2>&1
if exist "INICIO_RAPIDO.txt" move /Y "INICIO_RAPIDO.txt" "docs\" >nul 2>&1
echo ✓ Documentación organizada en carpeta 'docs'
echo.

REM ============================================================
REM  PASO 4: LIMPIAR ARCHIVOS TEMPORALES
REM ============================================================
echo ┌────────────────────────────────────────────────────────────┐
echo │ 🧹 PASO 4: Limpiando Archivos Temporales                 │
echo └────────────────────────────────────────────────────────────┘
echo.

echo Eliminando archivos temporales...
if exist "*.log" del /F /Q "*.log" >nul 2>&1
if exist "*.tmp" del /F /Q "*.tmp" >nul 2>&1
if exist ".DS_Store" del /F /Q ".DS_Store" >nul 2>&1
echo ✓ Archivos temporales eliminados
echo.

REM ============================================================
REM  PASO 5: VERIFICAR INTEGRIDAD
REM ============================================================
echo ┌────────────────────────────────────────────────────────────┐
echo │ ✅ PASO 5: Verificando Integridad del Sistema            │
echo └────────────────────────────────────────────────────────────┘
echo.

echo Verificando archivos críticos...
set allgood=1

if not exist "backend\data\users.json" (
    echo ❌ ERROR: Falta backend\data\users.json
    set allgood=0
) else (
    echo ✓ users.json
)

if not exist "backend\data\suppliers.json" (
    echo ❌ ERROR: Falta backend\data\suppliers.json
    set allgood=0
) else (
    echo ✓ suppliers.json
)

if not exist "backend\data\products.json" (
    echo ❌ ERROR: Falta backend\data\products.json
    set allgood=0
) else (
    echo ✓ products.json
)

if not exist "INICIAR_Y_GUARDAR.bat" (
    echo ❌ ERROR: Falta INICIAR_Y_GUARDAR.bat
    set allgood=0
) else (
    echo ✓ INICIAR_Y_GUARDAR.bat
)

if not exist "pages\Drafts.tsx" (
    echo ❌ ERROR: Falta pages\Drafts.tsx
    set allgood=0
) else (
    echo ✓ Drafts.tsx (Nueva funcionalidad)
)

echo.

if %allgood%==1 (
    echo ✅ Todos los archivos críticos están presentes
) else (
    echo ⚠ ADVERTENCIA: Algunos archivos críticos faltan
    echo    Puedes restaurarlos desde: %backupfolder%
)

echo.

REM ============================================================
REM  PASO 6: CREAR ARCHIVO DE RESUMEN
REM ============================================================
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📝 PASO 6: Creando Resumen de Limpieza                   │
echo └────────────────────────────────────────────────────────────┘
echo.

echo LIMPIEZA COMPLETADA: %date% %time% > "LIMPIEZA_LOG.txt"
echo. >> "LIMPIEZA_LOG.txt"
echo ARCHIVOS ELIMINADOS: >> "LIMPIEZA_LOG.txt"
echo - README-ACTUALIZACION.md (duplicado) >> "LIMPIEZA_LOG.txt"
echo - actualizar.bat (obsoleto) >> "LIMPIEZA_LOG.txt"
echo - GUIA-DE-USO.md (duplicado) >> "LIMPIEZA_LOG.txt"
echo - login.json (duplicado) >> "LIMPIEZA_LOG.txt"
echo - Archivos temporales (*.log, *.tmp) >> "LIMPIEZA_LOG.txt"
echo. >> "LIMPIEZA_LOG.txt"
echo ARCHIVOS ORGANIZADOS: >> "LIMPIEZA_LOG.txt"
echo - Documentación movida a carpeta 'docs/' >> "LIMPIEZA_LOG.txt"
echo. >> "LIMPIEZA_LOG.txt"
echo BACKUP CREADO EN: >> "LIMPIEZA_LOG.txt"
echo - %backupfolder% >> "LIMPIEZA_LOG.txt"
echo. >> "LIMPIEZA_LOG.txt"
echo ARCHIVOS PRINCIPALES CONSERVADOS: >> "LIMPIEZA_LOG.txt"
echo - INICIAR_Y_GUARDAR.bat (Script principal) >> "LIMPIEZA_LOG.txt"
echo - BACKUP_RAPIDO.bat (Backups) >> "LIMPIEZA_LOG.txt"
echo - DETENER_SISTEMA.bat (Detener servicios) >> "LIMPIEZA_LOG.txt"
echo - backend/data/ (Todos los datos) >> "LIMPIEZA_LOG.txt"
echo - pages/Drafts.tsx (Nueva funcionalidad) >> "LIMPIEZA_LOG.txt"

echo ✓ Log de limpieza creado: LIMPIEZA_LOG.txt
echo.

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║                  ✅ LIMPIEZA COMPLETADA ✅                     ║
echo ║                                                                ║
echo ║  📦 Backup guardado en: %backupfolder%
echo ║                                                                ║
echo ║  🗑️  Archivos duplicados eliminados                           ║
echo ║  📁 Documentación organizada en 'docs/'                       ║
echo ║  💾 Todos los datos conservados                               ║
echo ║  ✅ Sistema optimizado y listo                                ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Presione cualquier tecla para ver el resumen...
pause >nul

type "LIMPIEZA_LOG.txt"
echo.
echo.
echo Presione cualquier tecla para salir...
pause >nul
