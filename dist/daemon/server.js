import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { generateZeroTokenMicroContext } from '../generator/microContext.js';
export class SynapseBridgeServer {
    config;
    app = express();
    server = createServer(this.app);
    wss = new WebSocketServer({ noServer: true });
    sseClients = new Set();
    wsClients = new Set();
    lastEvent = null;
    constructor(config = { port: 9090, host: '127.0.0.1' }) {
        this.config = config;
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupWebSocket();
    }
    setupMiddlewares() {
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
                return;
            }
            next();
        });
    }
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'online',
                service: 'SynapseBridge IPC Daemon',
                subscribers: {
                    sse: this.sseClients.size,
                    websocket: this.wsClients.size
                },
                lastEventTime: this.lastEvent ? this.lastEvent.timestamp : null
            });
        });
        // Server-Sent Events (SSE) Stream for real-time context subscription
        this.app.get('/stream/context', (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();
            this.sseClients.add(res);
            console.log(`[SynapseBridge] Nuevo suscriptor SSE conectado (${this.sseClients.size} activos)`);
            if (this.lastEvent) {
                const micro = generateZeroTokenMicroContext(this.lastEvent);
                res.write(`data: ${JSON.stringify(micro)}\n\n`);
            }
            req.on('close', () => {
                this.sseClients.delete(res);
                console.log(`[SynapseBridge] Suscriptor SSE desconectado (${this.sseClients.size} restantes)`);
            });
        });
        // HTTP Endpoint for pushing events from ProjectGrapher or IDE plugins
        this.app.post('/api/live/event', (req, res) => {
            const event = req.body;
            if (!event || !event.file || !event.file.path) {
                res.status(400).json({ error: 'Payload de evento inválido' });
                return;
            }
            this.broadcastLiveEvent(event);
            res.json({ success: true, broadcastedTo: this.sseClients.size + this.wsClients.size });
        });
    }
    setupWebSocket() {
        this.server.on('upgrade', (request, socket, head) => {
            const url = request.url || '';
            if (url.startsWith('/ws/live') || url.startsWith('/ws')) {
                this.wss.handleUpgrade(request, socket, head, (ws) => {
                    this.wss.emit('connection', ws, request);
                });
            }
            else {
                socket.destroy();
            }
        });
        this.wss.on('connection', (ws) => {
            this.wsClients.add(ws);
            console.log(`[SynapseBridge] Nuevo cliente WebSocket IPC conectado (${this.wsClients.size} activos)`);
            if (this.lastEvent) {
                const micro = generateZeroTokenMicroContext(this.lastEvent);
                ws.send(JSON.stringify(micro));
            }
            ws.on('message', (message) => {
                try {
                    const event = JSON.parse(message.toString());
                    if (event && event.file) {
                        this.broadcastLiveEvent(event);
                    }
                }
                catch (err) {
                    console.error('[SynapseBridge] Error parseando mensaje WebSocket:', err);
                }
            });
            ws.on('close', () => {
                this.wsClients.delete(ws);
                console.log(`[SynapseBridge] Cliente WebSocket desconectado (${this.wsClients.size} restantes)`);
            });
        });
    }
    broadcastLiveEvent(event) {
        this.lastEvent = event;
        const micro = generateZeroTokenMicroContext(event);
        const payload = JSON.stringify(micro);
        // Broadcast SSE
        for (const client of this.sseClients) {
            client.write(`data: ${payload}\n\n`);
        }
        // Broadcast WebSocket
        for (const ws of this.wsClients) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(payload);
            }
        }
        console.log(`⚡ [SYNAPSE-LIVE BROADCAST] -> ${event.file.label} [${event.file.role || 'módulo'}] -> Difundido a ${this.sseClients.size + this.wsClients.size} suscriptores`);
    }
    start() {
        return new Promise((resolve) => {
            this.server.listen(this.config.port, this.config.host, () => {
                console.log(`====================================================`);
                console.log(`  ⚡ SynapseBridge Daemon Online (Zero-Token IPC)`);
                console.log(`  - Escuchando en: http://${this.config.host}:${this.config.port}`);
                console.log(`  - Stream SSE:    http://${this.config.host}:${this.config.port}/stream/context`);
                console.log(`  - WebSocket IPC: ws://${this.config.host}:${this.config.port}/ws/live`);
                console.log(`====================================================`);
                resolve();
            });
        });
    }
}
