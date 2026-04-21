import type { BarritsImportFilters, BarritsImportWriteMode, BarritsIntegrationGraph } from "./contracts";
export declare const AUTO_IMPORTS_START = "// barrits:auto-imports:start";
export declare const AUTO_IMPORTS_END = "// barrits:auto-imports:end";
export declare const createImportsModuleSource: (graph: BarritsIntegrationGraph) => string;
export declare const filterImportActions: (graph: BarritsIntegrationGraph, filters?: BarritsImportFilters) => BarritsIntegrationGraph;
export declare const createImportBlock: (graph: BarritsIntegrationGraph, mode?: BarritsImportWriteMode) => string;
export declare const applyManagedImports: (source: string, graph: BarritsIntegrationGraph, mode?: BarritsImportWriteMode) => string;
