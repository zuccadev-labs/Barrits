import type { GraphAdjacencyEntry, GraphEdge, GraphNodeId } from "./types";
/**
 * [EN] Constructs an adjacency list from a collection of graph edges.
 * [ES] Construye una lista de adyacencia a partir de una colección de aristas de grafo.
 *
 * @param edges [EN] Collection of edges. [ES] Colección de aristas.
 * @param options [EN] Configuration options (e.g., directed). [ES] Opciones de configuración (ej., dirigido).
 * @returns [EN] A map representing the adjacency list. [ES] Un mapa que representa la lista de adyacencia.
 */
export declare const buildAdjacencyList: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], options?: {
    readonly directed?: boolean;
}) => Map<NodeId, GraphAdjacencyEntry<NodeId>[]>;
