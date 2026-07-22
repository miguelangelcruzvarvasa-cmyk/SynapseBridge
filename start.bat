@echo off
title SynapseBridge Daemon
echo ============================================
echo   SynapseBridge - Zero-Token IPC Daemon
echo ============================================
echo.
cd /d "%~dp0"
echo Iniciando daemon en http://127.0.0.1:9090
echo.
npm run dev
pause
