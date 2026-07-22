export interface LiveNodeEvent {
  type: 'node_focus' | 'hotspot_select' | 'code_cursor' | 'diff_change';
  timestamp: number;
  project: string;
  file: {
    path: string;
    label: string;
    importance?: number;
    role?: string;
    complexity?: string;
    lines?: number;
    exports?: string[];
  };
  relations?: {
    uses?: string[];
    usedBy?: string[];
  };
  activeSnippet?: string;
}

export interface ZeroTokenMicroContext {
  headline: string;
  compactPrompt: string;
  formattedStream: string;
}

export function generateZeroTokenMicroContext(event: LiveNodeEvent): ZeroTokenMicroContext {
  const file = event.file;
  const uses = event.relations?.uses?.slice(0, 4).join(', ') || 'Ninguna';
  const usedBy = event.relations?.usedBy?.slice(0, 4).join(', ') || 'Ninguno';
  const exports = file.exports?.slice(0, 5).join(', ') || 'Sin exports públicos';

  const headline = `[SYNAPSE-LIVE] Foco en: ${file.label} (${file.role || 'Módulo'})`;

  let formattedStream = `=== SYNAPSE REAL-TIME CONTEXT STREAM ===\n`;
  formattedStream += `Timestamp: ${new Date(event.timestamp).toISOString()}\n`;
  formattedStream += `Proyecto: ${event.project}\n`;
  formattedStream += `Evento: ${event.type}\n`;
  formattedStream += `Archivo Activo: ${file.path}\n`;
  formattedStream += `Rol Inferido: ${file.role || 'Módulo de soporte'}\n`;
  formattedStream += `Importancia Grafo: ${file.importance || 0}\n`;
  formattedStream += `Contratos Exp: ${exports}\n`;
  formattedStream += `Usa Directamente: ${uses}\n`;
  formattedStream += `Recibe Uso De: ${usedBy}\n`;

  if (event.activeSnippet) {
    formattedStream += `\n--- Snippet Vivo ---\n${event.activeSnippet}\n`;
  }
  formattedStream += `=========================================\n`;

  const compactPrompt = `[LIVE FOCUS] El desarrollador/canvas está enfocado en "${file.path}". Rol: ${file.role || 'Módulo'}. Usa -> [${uses}]. Es usado por -> [${usedBy}]. Exposta -> [${exports}].`;

  return {
    headline,
    compactPrompt,
    formattedStream
  };
}
