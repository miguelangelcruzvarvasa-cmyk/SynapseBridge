import WebSocket from 'ws';
const targetWsUrl = process.env.SYNAPSE_WS_URL || 'ws://127.0.0.1:9090/ws/live';
console.log(`[AgentSubscriber] Conectando a SynapseBridge IPC Stream en ${targetWsUrl}...`);
const ws = new WebSocket(targetWsUrl);
ws.on('open', () => {
    console.log(`✅ [AgentSubscriber] Conectado a SynapseBridge. Escuchando eventos de contexto en caliente...\n`);
});
ws.on('message', (data) => {
    try {
        const payload = JSON.parse(data.toString());
        console.log(`\n---------------------------------------------------------`);
        console.log(`⚡ EVENTO DE CONTEXTO EN VIVO RECIBIDO POR EL AGENTE`);
        console.log(`Headline: ${payload.headline}`);
        console.log(`Prompt Compacto: ${payload.compactPrompt}`);
        console.log(`\n${payload.formattedStream}`);
        console.log(`---------------------------------------------------------\n`);
    }
    catch (err) {
        console.error('Error parseando payload de contexto:', err);
    }
});
ws.on('error', (err) => {
    console.error('Error en la conexión WebSocket de SynapseBridge:', err.message);
});
ws.on('close', () => {
    console.log('[AgentSubscriber] Desconectado de SynapseBridge Daemon.');
});
