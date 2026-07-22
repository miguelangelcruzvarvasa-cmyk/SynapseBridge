@echo off
title SynapseBridge → Claude Code Context
echo ============================================
echo   SynapseBridge - Contexto para Claude Code
echo ============================================
echo.
echo 1. Abre VS Code con tu proyecto
echo 2. Abre Claude Code en la terminal
echo 3. Selecciona un nodo en ProjectGrapher
echo 4. El contexto aparecera aqui automaticamente
echo.
echo Copia el contexto y pegalo en Claude Code
echo ============================================
echo.
cd /d "%~dp0"
node -e "
const WebSocket = require('ws');
const ws = new WebSocket('ws://127.0.0.1:9090/ws/live');
ws.on('open', () => console.log('Conectado a SynapseBridge...\n'));
ws.on('message', (data) => {
  const ctx = JSON.parse(data.toString());
  console.log('═══════════════════════════════════════════════');
  console.log('CONTEXTO PARA CLAUDE CODE:');
  console.log('═══════════════════════════════════════════════');
  console.log(ctx.compactPrompt);
  console.log('═══════════════════════════════════════════════');
  console.log('');
});
ws.on('error', (e) => console.error('Error:', e.message));
"
pause
