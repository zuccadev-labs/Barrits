/**
 * @module
 * [EN] Manifest creation and serialization utilities for Barrits.
 * [ES] Utilidades de creación y serialización de manifiestos para Barrits.
 */ import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsSelectionFilters, BarritsWatchSnapshot } from "./contracts";
/**
 * [EN] Implementation of Create projected graph.
 * [ES] Implementación de Create projected graph.
 */
export declare const createProjectedGraph: (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters) => BarritsIntegrationGraph;
/**
 * [EN] Implementation of Create build manifest.
 * [ES] Implementación de Create build manifest.
 */
export declare const createBuildManifest: (
  graph: BarritsIntegrationGraph,
  filters?: BarritsSelectionFilters,
) => Promise<BarritsBuildManifest>;
/**
 * [EN] Implementation of Stringify build manifest.
 * [ES] Implementación de Stringify build manifest.
 */
export declare const stringifyBuildManifest: (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters) => Promise<string>;
/**
 * [EN] Implementation of Create watch snapshot.
 * [ES] Implementación de Create watch snapshot.
 */
export declare const createWatchSnapshot: (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
) => BarritsWatchSnapshot;
/**
 * [EN] Implementation of Stringify watch snapshot.
 * [ES] Implementación de Stringify watch snapshot.
 */
export declare const stringifyWatchSnapshot: (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
) => string;
