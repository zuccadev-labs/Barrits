/**
 * [EN] Supported identifier types for graph nodes.
 * [ES] Tipos de identificadores soportados para nodos de grafos.
 */
export type GraphNodeId = string | number;

/**
 * [EN] Represents a connection between two nodes in a graph.
 * [ES] Representa una conexión entre dos nodos en un grafo.
 * 
 * @template NodeId [EN] Type of the node identifier. [ES] Tipo del identificador del nodo.
 */
export type GraphEdge<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly from: NodeId;
  readonly to: NodeId;
  readonly weight?: number;
};

/**
 * [EN] Structure for an entry in an adjacency list.
 * [ES] Estructura para una entrada en una lista de adyacencia.
 */
export type GraphAdjacencyEntry<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly to: NodeId;
  readonly weight: number;
};

/**
 * [EN] Result structure for pathfinding algorithms.
 * [ES] Estructura de resultado para algoritmos de búsqueda de caminos.
 */
export type GraphPath<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly distance: number;
  readonly path: NodeId[];
  readonly visitedOrder: NodeId[];
};
