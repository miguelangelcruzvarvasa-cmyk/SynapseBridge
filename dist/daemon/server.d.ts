import { LiveNodeEvent } from '../generator/microContext.js';
export interface SynapseBridgeServerConfig {
    port: number;
    host: string;
}
export declare class SynapseBridgeServer {
    private config;
    private app;
    private server;
    private wss;
    private sseClients;
    private wsClients;
    private lastEvent;
    constructor(config?: SynapseBridgeServerConfig);
    private setupMiddlewares;
    private setupRoutes;
    private setupWebSocket;
    broadcastLiveEvent(event: LiveNodeEvent): void;
    start(): Promise<void>;
}
