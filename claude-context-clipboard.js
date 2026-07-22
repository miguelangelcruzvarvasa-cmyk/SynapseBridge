import WebSocket from 'ws';
import { execSync } from 'child_process';

const ws = new WebSocket('ws://127.0.0.1:9090/ws/live');

ws.on('open', () => {
  console.log('✅ Conectado a SynapseBridge');
  console.log('📋 El contexto se copiara al portapapeles automaticamente');
  console.log('💡 Pegalo en Claude Code con Ctrl+V\n');
});

ws.on('message', (data) => {
  try {
    const ctx = JSON.parse(data.toString());
    const contextText = ctx.compactPrompt;
    
    // Copiar al portapapeles en Windows
    execSync(`echo ${JSON.stringify(contextText)} | clip`, { shell: 'cmd.exe' });
    
    console.log('━'.repeat(50));
    console.log('📋 CONTEXTO COPIADO AL PORTAPAPELES:');
    console.log('━'.repeat(50));
    console.log(contextText);
    console.log('━'.repeat(50));
    console.log('✅ Listo! Pegalo en Claude Code con Ctrl+V\n');
  } catch (err) {
    console.error('Error:', err.message);
  }
});

ws.on('error', (err) => {
  console.error('❌ Error de conexion:', err.message);
  console.log('💡 Asegurate de que SynapseBridge esta corriendo:');
  console.log('   cd C:\\Users\\MQerKAcademy\\Desktop\\proyectos\\SynapseBridge');
  console.log('   npm run dev');
});
