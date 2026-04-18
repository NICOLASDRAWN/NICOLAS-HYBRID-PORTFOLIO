@echo off
title MIP_TUNNEL_ALTERNATIVO
color 0b
echo ==============================================================
echo        INICIANDO TÚNEL REMOTO ALTERNATIVO (LocalTunnel)
echo ==============================================================
echo.
echo Utilizando alternativa debido a rate-limits de Cloudflare.
echo.
echo Presione cualquier tecla si su servidor MIP (Puerto 3000) ya esta iniciado...
pause >nul

echo.
echo [*] Conectando con servidor remoto (loca.lt)...
call npx localtunnel --port 3000

echo.
pause
