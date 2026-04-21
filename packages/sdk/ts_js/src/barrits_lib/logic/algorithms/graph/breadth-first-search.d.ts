import type { GraphEdge, GraphNodeId } from "./types";
/**
 * [EN] Performs a Breadth-First Search (BFS) traversal on a graph.
 * [ES] Realiza un recorrido de búsqueda en anchura (BFS) en un grafo.
 *
 * @param edges [EN] Collection of graph edges. [ES] Colección de aristas del grafo.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @returns [EN] List of nodes in the order they were visited. [ES] Lista de nodos en el orden en que fueron visitados.
 */
export declare const breadthFirstSearch: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
