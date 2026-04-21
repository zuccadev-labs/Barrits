import type { GraphEdge, GraphNodeId } from "./types";
/**
 * [EN] Result structure for maximum flow algorithms.
 * [ES] Estructura de resultado para algoritmos de flujo máximo.
 */
export type MaxFlowResult<NodeId extends GraphNodeId = GraphNodeId> = {
    readonly value: number;
    readonly augmentingPaths: NodeId[][];
};
/**
 * [EN] Computes the maximum flow between a source and a sink using the Edmonds-Karp algorithm.
 * [ES] Calcula el flujo máximo entre una fuente y un sumidero utilizando el algoritmo de Edmonds-Karp.
 *
 * @param edges [EN] Collection of graph edges with capacity. [ES] Colección de aristas de grafo con capacidad.
 * @param source [EN] The source node identifier. [ES] El identificador del nodo fuente.
 * @param sink [EN] The sink node identifier. [ES] El identificador del nodo sumidero.
 * @returns [EN] The maximum flow value and the used augmenting paths. [ES] El valor del flujo máximo y los caminos de aumento utilizados.
 */
export declare const maxFlow: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => MaxFlowResult<NodeId>;
