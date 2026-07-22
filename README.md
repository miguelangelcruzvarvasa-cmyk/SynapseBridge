# ⚡ SynapseBridge

**SynapseBridge** es un daemon de comunicación en tiempo real de ultra-baja latencia (IPC / WebSockets / Server-Sent Events) diseñado para transmitir micro-contexto en caliente desde el canvas visual de **ProjectGrapher** hacia cualquier agente de IA (Claude, Gemini, Cursor, Antigravity, CLI) sin sobrecosto de tokens.

---

## 🚀 Características Clave

* **Daemon IPC Zero-Token:** Transmite payloads hiper-compactos en tiempo real cuando el desarrollador interactúa con el grafo o cambia el foco de la interfaz.
* **Suscripción Dual:**
  * **Server-Sent Events (SSE):** `http://127.0.0.1:9090/stream/context`
  * **WebSocket IPC:** `ws://127.0.0.1:9090/ws/live`
* **Compresión Inteligente de Eventos:** Formatea roles, contratos expuestos, dependencias directas y snippets activos en prompts listos para IA en menos de 5ms.
* **Integración Directa con ProjectGrapher:** Emite automáticamente eventos cada vez que se selecciona un nodo en la interfaz visual de ProjectGrapher.

---

## 🛠️ Instalación y Uso

### 1. Iniciar el Daemon de SynapseBridge

```bash
cd SynapseBridge
npm install
npm run dev
```

### 2. Iniciar un Suscriptor de Prueba (Cliente de Agente)

En otra terminal:

```bash
npm run client
```

### 3. Emisión de Eventos HTTP desde la API

```bash
curl -X POST http://127.0.0.1:9090/api/live/event \
  -H "Content-Type: application/json" \
  -d '{
    "type": "node_focus",
    "timestamp": 1720000000000,
    "project": "ERP_Delison",
    "file": {
      "path": "src/components/molienda-grid-card.component.ts",
      "label": "molienda-grid-card.component.ts",
      "importance": 9,
      "role": "componente, pantalla u orquestador de interfaz",
      "exports": ["MoliendaGridCardComponent"]
    }
  }'
```

---

## 🏗️ Estructura del Proyecto

```
SynapseBridge/
├── src/
│   ├── daemon/
│   │   └── server.ts          # Servidor Express + WebSocket + SSE Daemon
│   ├── generator/
│   │   └── microContext.ts    # Formateador Zero-Token de eventos a prompts
│   ├── client/
│   │   └── agentSubscriber.ts # Cliente CLI suscriptor de pruebas
│   └── index.ts               # Punto de entrada del servidor
├── package.json
└── tsconfig.json
```
