import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsSelectionFilters, BarritsWatchSnapshot } from "./contracts";
export declare const createProjectedGraph: (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters) => BarritsIntegrationGraph;
export declare const createBuildManifest: (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters) => BarritsBuildManifest;
export declare const stringifyBuildManifest: (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters) => string;
export declare const createWatchSnapshot: (graph: BarritsIntegrationGraph, mode: "watch" | "dev", filters?: BarritsSelectionFilters) => BarritsWatchSnapshot;
export declare const stringifyWatchSnapshot: (graph: BarritsIntegrationGraph, mode: "watch" | "dev", filters?: BarritsSelectionFilters) => string;
