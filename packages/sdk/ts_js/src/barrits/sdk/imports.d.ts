/**
 * @module
 * [EN] Placeholder module description.
 * [ES] Descripción de marcador de posición del módulo.
 */
import type { BarritsImportFilters, BarritsImportWriteMode, BarritsIntegrationGraph } from "./contracts";
/**
 * [EN] Implementation of  a u t o_ i m p o r t s_ s t a r t.
 * [ES] Implementación de  a u t o_ i m p o r t s_ s t a r t.
 */
export declare const AUTO_IMPORTS_START = "// barrits:auto-imports:start";
/**
 * [EN] Implementation of  a u t o_ i m p o r t s_ e n d.
 * [ES] Implementación de  a u t o_ i m p o r t s_ e n d.
 */
export declare const AUTO_IMPORTS_END = "// barrits:auto-imports:end";
/**
 * [EN] Implementation of Create imports module source.
 * [ES] Implementación de Create imports module source.
 */
export declare const createImportsModuleSource: (graph: BarritsIntegrationGraph) => string;
/**
 * [EN] Implementation of Filter import actions.
 * [ES] Implementación de Filter import actions.
 */
export declare const filterImportActions: (graph: BarritsIntegrationGraph, filters?: BarritsImportFilters) => BarritsIntegrationGraph;
/**
 * [EN] Implementation of Create import block.
 * [ES] Implementación de Create import block.
 */
export declare const createImportBlock: (graph: BarritsIntegrationGraph, mode?: BarritsImportWriteMode) => string;
/**
 * [EN] Implementation of Apply managed imports.
 * [ES] Implementación de Apply managed imports.
 */
export declare const applyManagedImports: (source: string, graph: BarritsIntegrationGraph, mode?: BarritsImportWriteMode) => string;
