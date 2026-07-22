# SynapseBridge

**Zero-Token IPC Daemon** para contexto en tiempo real entre ProjectGrapher y agentes de IA.

## Qué es

SynapseBridge conecta el canvas visual de ProjectGrapher con la memoria de tus agentes de IA mediante comunicación en tiempo real (IPC). Cuando seleccionas un nodo en ProjectGrapher, el agente recibe instantáneamente el micro-contexto sin copiar/pegar archivos.

## Arquitectura

```
ProjectGrapher (Browser) → HTTP POST → SynapseBridge Daemon → SSE/WebSocket → Agente IA
```

## Componentes

| Componente | Descripción |
|------------|-------------|
| **Daemon** | Servidor WebSocket + SSE en `localhost:9090` |
| **Micro-Context Generator** | Genera contexto compacto (Zero-Token) |
| **Agent Subscriber** | Cliente para que los agentes se suscriban |
| **ProjectGrapher Connector** | Emite eventos al seleccionar nodos |

## Instalación

```bash
cd SynapseBridge
npm install
npm run build
```

## Uso

### 1. Iniciar el Daemon

```bash
npm run dev
```

El daemon escuchará en:
- HTTP: `http://127.0.0.1:9090`
- SSE: `http://127.0.0.1:9090/stream/context`
- WebSocket: `ws://127.0.0.1:9090/ws/live`

### 2. Conectar un Agente

```bash
npm run client
```

### 3. Usar con ProjectGrapher

Abre ProjectGrapher y selecciona cualquier nodo del grafo. El agente recibirá automáticamente:

```json
{
  "headline": "[SYNAPSE-LIVE] Foco en: App.tsx (Componente Principal)",
  "compactPrompt": "[LIVE FOCUS] El desarrollador/canvas está enfocado en...",
  "formattedStream": "=== SYNAPSE REAL-TIME CONTEXT STREAM ===..."
}
```

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Health check del daemon |
| `/stream/context` | GET | Stream SSE de contexto en vivo |
| `/ws/live` | WebSocket | Canal WebSocket bidireccional |
| `/api/live/event` | POST | Recibe eventos de ProjectGrapher |

## Eventos Soportados

- `node_focus` - Nodo seleccionado en el canvas
- `hotspot_select` - Hotspot crítico seleccionado
- `code_cursor` - Cursor en el editor
- `diff_change` - Cambio en el diff

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `SYNAPSE_PORT` | `9090` | Puerto del daemon |
| `SYNAPSE_HOST` | `127.0.0.1` | Host del daemon |
| `SYNAPSE_WS_URL` | `ws://127.0.0.1:9090/ws/live` | URL WebSocket del cliente |

## License

MIT
