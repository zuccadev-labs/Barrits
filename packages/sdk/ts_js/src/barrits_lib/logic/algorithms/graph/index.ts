import { breadthFirstSearch } from "./breadth-first-search";
import { buildAdjacencyList } from "./build-adjacency-list";
import { detectDirectedCycle } from "./detect-cycle";
import { depthFirstSearch } from "./depth-first-search";
import { dijkstraShortestPath } from "./dijkstra-shortest-path";
import { maxFlow } from "./max-flow";
import { minimumSpanningTree } from "./minimum-spanning-tree";
import { topologicalSort } from "./topological-sort";

export { breadthFirstSearch } from "./breadth-first-search";
export { buildAdjacencyList } from "./build-adjacency-list";
export { detectDirectedCycle } from "./detect-cycle";
export { depthFirstSearch } from "./depth-first-search";
export { dijkstraShortestPath } from "./dijkstra-shortest-path";
export { maxFlow } from "./max-flow";
export { minimumSpanningTree } from "./minimum-spanning-tree";
export { topologicalSort } from "./topological-sort";
export type { GraphAdjacencyEntry, GraphEdge, GraphNodeId, GraphPath } from "./types";
export type { MaxFlowResult } from "./max-flow";
export type { MinimumSpanningTreeResult } from "./minimum-spanning-tree";

/**
 * [EN] Comprehensive collection of graph traversal and analysis algorithms.
 * [ES] Colección completa de algoritmos de recorrido y análisis de grafos.
 */
export const graphAlgorithms = {
  /** [EN] Breadth-First Search (BFS). [ES] Búsqueda en anchura (BFS). */
  breadthFirstSearch,
  /** [EN] Adjacency list builder. [ES] Constructor de listas de adyacencia. */
  buildAdjacencyList,
  /** [EN] Directed cycle detection. [ES] Detección de ciclos dirigidos. */
  detectDirectedCycle,
  /** [EN] Depth-First Search (DFS). [ES] Búsqueda en profundidad (DFS). */
  depthFirstSearch,
  /** [EN] Dijkstra's shortest path. [ES] Camino más corto de Dijkstra. */
  dijkstraShortestPath,
  /** [EN] Edmonds-Karp maximum flow. [ES] Flujo máximo de Edmonds-Karp. */
  maxFlow,
  /** [EN] Kruskal's Minimum Spanning Tree. [ES] Árbol de Recubrimiento Mínimo de Kruskal. */
  minimumSpanningTree,
  /** [EN] Kahn's topological sort. [ES] Ordenamiento topológico de Kahn. */
  topologicalSort,
};
