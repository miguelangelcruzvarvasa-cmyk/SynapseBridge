import { SynapseBridgeServer } from './daemon/server.js';

const port = Number(process.env.SYNAPSE_PORT || '9090');
const host = process.env.SYNAPSE_HOST || '127.0.0.1';

const server = new SynapseBridgeServer({ port, host });

server.start().catch((err) => {
  console.error('Error iniciando SynapseBridge Daemon:', err);
  process.exit(1);
});
