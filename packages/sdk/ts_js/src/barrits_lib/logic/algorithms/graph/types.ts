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
  /** [EN] Source node. [ES] Nodo origen. */
  readonly from: NodeId;
  /** [EN] Target node. [ES] Nodo destino. */
  readonly to: NodeId;
  /** [EN] Edge weight (optional, defaults to 1). [ES] Peso de la arista (opcional, por defecto 1). */
  readonly weight?: number;
};

/**
 * [EN] Structure for an entry in an adjacency list.
 * [ES] Estructura para una entrada en una lista de adyacencia.
 */
export type GraphAdjacencyEntry<NodeId extends GraphNodeId = GraphNodeId> = {
  /** [EN] Target node. [ES] Nodo destino. */
  readonly to: NodeId;
  /** [EN] Edge weight. [ES] Peso de la arista. */
  readonly weight: number;
};

/**
 * [EN] Result structure for pathfinding algorithms.
 * [ES] Estructura de resultado para algoritmos de búsqueda de caminos.
 */
export type GraphPath<NodeId extends GraphNodeId = GraphNodeId> = {
  /** [EN] Total path distance or cost. [ES] Distancia total o costo del camino. */
  readonly distance: number;
  /** [EN] Ordered list of nodes in the path. [ES] Lista ordenada de nodos en el camino. */
  readonly path: NodeId[];
  /** [EN] Order in which nodes were visited. [ES] Orden en que se visitaron los nodos. */
  readonly visitedOrder: NodeId[];
};
