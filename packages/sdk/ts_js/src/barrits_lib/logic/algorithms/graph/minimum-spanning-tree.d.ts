import type { GraphEdge, GraphNodeId } from "./types";
/**
 * [EN] Result structure for Minimum Spanning Tree algorithms.
 * [ES] Estructura de resultado para algoritmos de Árbol de Recubrimiento Mínimo.
 */
export type MinimumSpanningTreeResult<NodeId extends GraphNodeId = GraphNodeId> = {
    readonly edges: GraphEdge<NodeId>[];
    readonly totalWeight: number;
};
/**
 * [EN] Computes the Minimum Spanning Tree (MST) of a graph using Kruskal's algorithm.
 * [ES] Calcula el Árbol de Recubrimiento Mínimo (MST) de un grafo utilizando el algoritmo de Kruskal.
 *
 * @param edges [EN] Collection of weighted graph edges. [ES] Colección de aristas de grafo con peso.
 * @returns [EN] The MST edges and collective weight mapping. [ES] Las aristas del MST y el mapeo de peso colectivo.
 */
export declare const minimumSpanningTree: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]) => MinimumSpanningTreeResult<NodeId>;
