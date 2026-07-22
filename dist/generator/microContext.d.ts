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
export declare function generateZeroTokenMicroContext(event: LiveNodeEvent): ZeroTokenMicroContext;
