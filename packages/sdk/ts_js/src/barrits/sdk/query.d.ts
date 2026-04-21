import type { BarritsGraphFilters, BarritsIntegrationGraph } from "./contracts";
export declare const filterIntegrationGraph: (graph: BarritsIntegrationGraph, filters?: BarritsGraphFilters) => BarritsIntegrationGraph;
export declare const resolveProjectFilePath: (projectRoot: string, filePath: string | undefined) => string | undefined;
