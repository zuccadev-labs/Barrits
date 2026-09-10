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
  /** [EN] Edge weight or capacity (optional, defaults to 1). [ES] Peso o capacidad de la arista (opcional, por defecto 1). */
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
 * [EN] Options shared by traversal algorithms (`breadthFirstSearch`, `depthFirstSearch`, `dijkstraShortestPath`).
 * [ES] Opciones compartidas por los algoritmos de recorrido (`breadthFirstSearch`, `depthFirstSearch`, `dijkstraShortestPath`).
 */
export type GraphTraversalOptions = {
  /**
   * [EN] Treat edges as one-way (`from → to`). Traversals default to `false` (undirected, like `buildAdjacencyList`);
   * `dijkstraShortestPath` defaults to `true` because weighted routes are usually directional.
   * [ES] Tratar las aristas como unidireccionales (`from → to`). Los recorridos usan `false` por defecto (no dirigido,
   * como `buildAdjacencyList`); `dijkstraShortestPath` usa `true` porque las rutas ponderadas suelen ser direccionales.
   */
  readonly directed?: boolean;
};

/**
 * [EN] Result structure for pathfinding algorithms.
 * [ES] Estructura de resultado para algoritmos de búsqueda de caminos.
 */
export type GraphPath<NodeId extends GraphNodeId = GraphNodeId> = {
  /** [EN] Total path distance or cost (`Infinity` when unreachable). [ES] Distancia total o costo del camino (`Infinity` si es inalcanzable). */
  readonly distance: number;
  /** [EN] Ordered list of nodes in the path (empty when unreachable). [ES] Lista ordenada de nodos en el camino (vacía si es inalcanzable). */
  readonly path: readonly NodeId[];
  /** [EN] Order in which nodes were settled. [ES] Orden en que se asentaron los nodos. */
  readonly visitedOrder: readonly NodeId[];
};
