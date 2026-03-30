@echo off
echo Iniciando Proveedores MIP (Modo Desarrollo)...
echo.
echo Se abriran dos ventanas:
echo 1. La consola del servidor (NO CERRAR)
echo 2. Tu navegador web
echo.
cd /d "%~dp0"
npm start
pause
