@echo off
title SynapseBridge - Todos los Componentes
echo ============================================
echo   SynapseBridge - Inicio Completo
echo ============================================
echo.
cd /d "%~dp0"

echo [1/2] Iniciando Daemon...
start "SynapseBridge Daemon" cmd /k "npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Iniciando Cliente Agente...
start "SynapseBridge Client" cmd /k "npm run client"

echo.
echo ============================================
echo   SynapseBridge Iniciado Correctamente
echo ============================================
echo.
echo   Daemon:    http://127.0.0.1:9090
echo   SSE:       http://127.0.0.1:9090/stream/context
echo   WebSocket: ws://127.0.0.1:9090/ws/live
echo.
echo   Cierra estas ventanas para detener.
echo ============================================
pause
