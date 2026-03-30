@echo off
chcp 65001 >nul
color 0A
title 📦 Preparar Sistema para Distribución

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        📦 PREPARANDO SISTEMA PARA DISTRIBUCIÓN 📦             ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set SOURCE_DIR=%~dp0
set DEST_NAME=gestor-de-compras-mip-v3.1-PRODUCCION
set DEST_DIR=%USERPROFILE%\Desktop\%DEST_NAME%

echo [%time%] Preparando sistema actualizado...
echo.
echo 📁 Carpeta origen: %SOURCE_DIR%
echo 📁 Carpeta destino: %DEST_DIR%
echo.

REM Verificar si ya existe
if exist "%DEST_DIR%" (
    echo ⚠ La carpeta de destino ya existe.
    set /p overwrite="¿Desea sobrescribirla? (S/N): "
    if /i not "%overwrite%"=="S" (
        echo Operación cancelada.
        pause
        exit
    )
    echo Eliminando carpeta anterior...
    rmdir /S /Q "%DEST_DIR%"
)

echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📋 PASO 1: Creando estructura de carpetas                │
echo └────────────────────────────────────────────────────────────┘
echo.

mkdir "%DEST_DIR%"
mkdir "%DEST_DIR%\backend"
mkdir "%DEST_DIR%\backend\data"
mkdir "%DEST_DIR%\backend\uploads"
mkdir "%DEST_DIR%\pages"
mkdir "%DEST_DIR%\components"
mkdir "%DEST_DIR%\store"
mkdir "%DEST_DIR%\docs"

echo ✓ Estructura creada
echo.

echo ┌────────────────────────────────────────────────────────────┐
echo │ 📦 PASO 2: Copiando archivos del proyecto                │
echo └────────────────────────────────────────────────────────────┘
echo.

REM Archivos raíz principales
echo Copiando archivos raíz...
copy "%SOURCE_DIR%package.json" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%package-lock.json" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%tsconfig.json" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%tsconfig.node.json" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%vite.config.ts" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%index.html" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%index.css" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%App.tsx" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%main.tsx" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%types.ts" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%constants.ts" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%vite-env.d.ts" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%postcss.config.js" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%tailwind.config.js" "%DEST_DIR%\" >nul 2>&1

REM Scripts de gestión
echo Copiando scripts de gestión...
copy "%SOURCE_DIR%INICIAR_Y_GUARDAR.bat" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%BACKUP_RAPIDO.bat" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%DETENER_SISTEMA.bat" "%DEST_DIR%\" >nul 2>&1

REM Backend
echo Copiando backend...
xcopy "%SOURCE_DIR%backend\*.js" "%DEST_DIR%\backend\" /Y /Q >nul 2>&1
xcopy "%SOURCE_DIR%backend\*.json" "%DEST_DIR%\backend\" /Y /Q >nul 2>&1
xcopy "%SOURCE_DIR%backend\data\*.json" "%DEST_DIR%\backend\data\" /Y /Q >nul 2>&1
if exist "%SOURCE_DIR%backend\uploads\*.*" (
    xcopy "%SOURCE_DIR%backend\uploads\*.*" "%DEST_DIR%\backend\uploads\" /Y /Q >nul 2>&1
)

REM Pages
echo Copiando páginas...
xcopy "%SOURCE_DIR%pages\*.tsx" "%DEST_DIR%\pages\" /Y /Q >nul 2>&1

REM Components
echo Copiando componentes...
xcopy "%SOURCE_DIR%components\*.tsx" "%DEST_DIR%\components\" /Y /Q >nul 2>&1

REM Store
echo Copiando store...
xcopy "%SOURCE_DIR%store\*.tsx" "%DEST_DIR%\store\" /Y /Q >nul 2>&1

REM Documentación
echo Copiando documentación...
copy "%SOURCE_DIR%CAMBIOS_CONSECUTIVOS.md" "%DEST_DIR%\docs\" >nul 2>&1
copy "%SOURCE_DIR%CAMBIOS_REALIZADOS.txt" "%DEST_DIR%\docs\" >nul 2>&1
copy "%SOURCE_DIR%GUIA_DE_USO.md" "%DEST_DIR%\docs\" >nul 2>&1
copy "%SOURCE_DIR%DATOS_CARGADOS.md" "%DEST_DIR%\docs\" >nul 2>&1
copy "%SOURCE_DIR%MEJORAS_IMPLEMENTADAS.md" "%DEST_DIR%\docs\" >nul 2>&1

echo ✓ Archivos copiados
echo.

echo ┌────────────────────────────────────────────────────────────┐
echo │ 📝 PASO 3: Creando archivos de instalación               │
echo └────────────────────────────────────────────────────────────┘
echo.

REM Crear README principal
(
echo # 🚀 GESTOR DE COMPRAS MIP INTERNACIONAL v3.1
echo.
echo ## ✅ VERSIÓN DE PRODUCCIÓN - LISTA PARA USAR
echo.
echo **Fecha:** 2026-02-04
echo **Versión:** 3.1 Enterprise
echo **Estado:** ✅ PRODUCCIÓN
echo.
echo ---
echo.
echo ## 🎯 CARACTERÍSTICAS PRINCIPALES
echo.
echo ✅ **Sistema de Consecutivos por Usuario**
echo    - Cada usuario tiene su propio contador
echo    - Empieza desde #0001 para cada usuario
echo    - Borradores separados por usuario
echo.
echo ✅ **Gestión de Borradores**
echo    - Guardar órdenes como borradores
echo    - Continuar editando borradores
echo    - Ver consecutivos reservados
echo.
echo ✅ **Datos Precargados**
echo    - 3 usuarios listos para usar
echo    - 300+ proveedores
echo    - 30+ productos
echo.
echo ---
echo.
echo ## 🚀 INSTALACIÓN RÁPIDA
echo.
echo ### Opción 1: Instalación Automática ^(Recomendada^)
echo ```
echo 1. Doble clic en: INSTALAR.bat
echo 2. Esperar que termine ^(2-5 minutos^)
echo 3. ¡Listo!
echo ```
echo.
echo ### Opción 2: Instalación Manual
echo ```
echo 1. Abrir PowerShell en esta carpeta
echo 2. Ejecutar: npm install
echo 3. Ejecutar: cd backend
echo 4. Ejecutar: npm install
echo 5. Ejecutar: cd ..
echo ```
echo.
echo ---
echo.
echo ## 🎬 CÓMO USAR
echo.
echo ### Iniciar el Sistema:
echo ```
echo Doble clic en: INICIAR_Y_GUARDAR.bat
echo ```
echo.
echo **El script hará:**
echo - ✅ Crear backup automático
echo - ✅ Iniciar backend ^(puerto 3000^)
echo - ✅ Iniciar frontend ^(puerto 5173^)
echo - ✅ Abrir navegador automáticamente
echo - ✅ Mostrar menú interactivo
echo.
echo ### Credenciales de Acceso:
echo ```
echo Administrador:
echo   Usuario: admin
echo   Contraseña: 123
echo.
echo Comprador:
echo   Usuario: yulimip
echo   Contraseña: mip2025*
echo.
echo Super Usuario:
echo   Usuario: master
echo   Contraseña: master123
echo ```
echo.
echo ---
echo.
echo ## 📋 SCRIPTS DISPONIBLES
echo.
echo - **INSTALAR.bat** - Instalar dependencias automáticamente
echo - **INICIAR_Y_GUARDAR.bat** - Iniciar sistema completo
echo - **BACKUP_RAPIDO.bat** - Crear backup manual
echo - **DETENER_SISTEMA.bat** - Detener servicios
echo.
echo ---
echo.
echo ## 📊 DATOS INCLUIDOS
echo.
echo ### Usuarios ^(3^):
echo - admin ^(Administrador^)
echo - master ^(Super Usuario^)
echo - yulimip ^(Comprador^)
echo.
echo ### Proveedores ^(300+^):
echo - Todas las categorías
echo - Información completa
echo.
echo ### Productos ^(30+^):
echo - Dotaciones
echo - EPP
echo - Ropa de trabajo
echo.
echo ---
echo.
echo ## 🆘 SOLUCIÓN DE PROBLEMAS
echo.
echo ### "Node.js no está instalado"
echo → Descargar desde: https://nodejs.org/
echo.
echo ### "Puerto ya en uso"
echo → Ejecutar: DETENER_SISTEMA.bat
echo.
echo ### Sistema lento
echo → Reiniciar desde el menú interactivo
echo.
echo ---
echo.
echo ## 📞 SOPORTE
echo.
echo **URLs:**
echo - Aplicación: http://localhost:5173
echo - API: http://localhost:3000/api
echo.
echo **Documentación:**
echo - docs/GUIA_DE_USO.md
echo - docs/CAMBIOS_CONSECUTIVOS.md
echo - docs/DATOS_CARGADOS.md
echo.
echo ---
echo.
echo ## ✅ VERIFICACIÓN
echo.
echo Antes de usar, verifica:
echo - [ ] Node.js instalado
echo - [ ] Ejecutado INSTALAR.bat
echo - [ ] Ejecutado INICIAR_Y_GUARDAR.bat
echo - [ ] Navegador abierto
echo - [ ] Sesión iniciada
echo.
echo ---
echo.
echo **¡Sistema listo para producción!** 🎉
) > "%DEST_DIR%\README.md"

REM Crear script de instalación
(
echo @echo off
echo chcp 65001 ^>nul
echo color 0B
echo title 📦 Instalación del Sistema MIP
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        📦 INSTALACIÓN DEL SISTEMA MIP v3.1 📦                 ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [%%time%%] Iniciando instalación...
echo.
echo ⚠ IMPORTANTE: Este proceso puede tomar 2-5 minutos
echo              No cierre esta ventana
echo.
pause
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📋 PASO 1: Verificando Node.js                           │
echo └────────────────────────────────────────────────────────────┘
echo.
node --version ^>nul 2^>^&1
if %%errorlevel%% neq 0 ^(
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo Por favor instale Node.js desde: https://nodejs.org/
    echo Luego ejecute este script nuevamente
    pause
    exit
^)
echo ✓ Node.js instalado
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📦 PASO 2: Instalando dependencias del Frontend          │
echo └────────────────────────────────────────────────────────────┘
echo.
echo Instalando... ^(esto puede tomar 1-3 minutos^)
call npm install
if %%errorlevel%% neq 0 ^(
    echo ❌ Error instalando dependencias del frontend
    pause
    exit
^)
echo ✓ Frontend instalado
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ 📦 PASO 3: Instalando dependencias del Backend           │
echo └────────────────────────────────────────────────────────────┘
echo.
cd backend
echo Instalando... ^(esto puede tomar 1-2 minutos^)
call npm install
if %%errorlevel%% neq 0 ^(
    echo ❌ Error instalando dependencias del backend
    cd ..
    pause
    exit
^)
cd ..
echo ✓ Backend instalado
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              ✅ INSTALACIÓN COMPLETADA ✅                      ║
echo ║                                                                ║
echo ║  El sistema está listo para usar                              ║
echo ║                                                                ║
echo ║  Próximo paso:                                                 ║
echo ║  Doble clic en: INICIAR_Y_GUARDAR.bat                         ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
pause
) > "%DEST_DIR%\INSTALAR.bat"

echo ✓ Archivos de instalación creados
echo.

echo ┌────────────────────────────────────────────────────────────┐
echo │ ✅ PASO 4: Verificando archivos copiados                 │
echo └────────────────────────────────────────────────────────────┘
echo.

set allgood=1

if not exist "%DEST_DIR%\package.json" (
    echo ❌ Falta package.json
    set allgood=0
) else (
    echo ✓ package.json
)

if not exist "%DEST_DIR%\backend\server.js" (
    echo ❌ Falta backend/server.js
    set allgood=0
) else (
    echo ✓ backend/server.js
)

if not exist "%DEST_DIR%\backend\data\users.json" (
    echo ❌ Falta backend/data/users.json
    set allgood=0
) else (
    echo ✓ backend/data/users.json
)

if not exist "%DEST_DIR%\pages\Drafts.tsx" (
    echo ❌ Falta pages/Drafts.tsx
    set allgood=0
) else (
    echo ✓ pages/Drafts.tsx
)

if not exist "%DEST_DIR%\INICIAR_Y_GUARDAR.bat" (
    echo ❌ Falta INICIAR_Y_GUARDAR.bat
    set allgood=0
) else (
    echo ✓ INICIAR_Y_GUARDAR.bat
)

echo.

if %allgood%==1 (
    echo ✅ Todos los archivos críticos están presentes
) else (
    echo ⚠ ADVERTENCIA: Algunos archivos faltan
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║            ✅ SISTEMA PREPARADO EXITOSAMENTE ✅                ║
echo ║                                                                ║
echo ║  📁 Ubicación: %DEST_DIR%
echo ║                                                                ║
echo ║  📋 Próximos pasos:                                            ║
echo ║  1. Ir a la carpeta: %DEST_NAME%
echo ║  2. Doble clic en: INSTALAR.bat                                ║
echo ║  3. Esperar que termine la instalación                         ║
echo ║  4. Doble clic en: INICIAR_Y_GUARDAR.bat                       ║
echo ║  5. ¡Listo para usar!                                          ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo ¿Desea abrir la carpeta ahora? (S/N):
set /p open_folder=
if /i "%open_folder%"=="S" (
    explorer "%DEST_DIR%"
)

echo.
echo Presione cualquier tecla para salir...
pause >nul
