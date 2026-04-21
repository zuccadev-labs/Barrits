import type { GraphEdge, GraphNodeId, GraphPath } from "./types";
/**
 * [EN] Finds the shortest path between two nodes using Dijkstra's algorithm.
 * [ES] Encuentra el camino más corto entre dos nodos utilizando el algoritmo de Dijkstra.
 *
 * @param edges [EN] Collection of weighted graph edges. [ES] Colección de aristas de grafo con peso.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @param targetNode [EN] The target node identifier. [ES] El identificador del nodo objetivo.
 * @returns [EN] Object containing distance, path, and visit order. [ES] Objeto con la distancia, el camino y el orden de visita.
 */
export declare const dijkstraShortestPath: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => GraphPath<NodeId>;
