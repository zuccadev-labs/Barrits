/**
 * @module
 * [EN] Integration graph filtering, collision detection, and project path resolution queries.
 * [ES] Filtrado del grafo de integración, detección de colisiones y resolución de rutas de proyecto.
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
