@echo off
title Iniciando Proveedores MIP...
color 0A

echo.
echo    [ INICIANDO SISTEMA ]
echo    ---------------------
echo    Por favor espera unos segundos...
echo.

cd /d "%~dp0"

REM Ejecutamos Electron
call npm run app

