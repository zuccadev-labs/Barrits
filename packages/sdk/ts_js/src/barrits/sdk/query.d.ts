/**
 * @module
 * [EN] Placeholder module description.
 * [ES] Descripción de marcador de posición del módulo.
 */
import type { BarritsGraphFilters, BarritsIntegrationGraph } from "./contracts";
/**
 * [EN] Implementation of Filter integration graph.
 * [ES] Implementación de Filter integration graph.
 */
export declare const filterIntegrationGraph: (graph: BarritsIntegrationGraph, filters?: BarritsGraphFilters) => BarritsIntegrationGraph;
/**
 * [EN] Implementation of Resolve project file path.
 * [ES] Implementación de Resolve project file path.
 */
export declare const resolveProjectFilePath: (projectRoot: string, filePath: string | undefined) => string | undefined;
