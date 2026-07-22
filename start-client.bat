@echo off
title SynapseBridge - Agent Subscriber
echo ============================================
echo   SynapseBridge - Cliente Agente IA
echo ============================================
echo.
cd /d "%~dp0"
echo Conectando a SynapseBridge...
echo.
npm run client
pause
