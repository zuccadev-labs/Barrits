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
export declare const graphAlgorithms: {
    /** [EN] Breadth-First Search (BFS). [ES] Búsqueda en anchura (BFS). */
    breadthFirstSearch: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
    /** [EN] Adjacency list builder. [ES] Constructor de listas de adyacencia. */
    buildAdjacencyList: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], options?: {
        readonly directed?: boolean;
    }) => Map<NodeId, import("./types").GraphAdjacencyEntry<NodeId>[]>;
    /** [EN] Directed cycle detection. [ES] Detección de ciclos dirigidos. */
    detectDirectedCycle: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[]) => NodeId[] | null;
    /** [EN] Depth-First Search (DFS). [ES] Búsqueda en profundidad (DFS). */
    depthFirstSearch: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
    /** [EN] Dijkstra's shortest path. [ES] Camino más corto de Dijkstra. */
    dijkstraShortestPath: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./types").GraphPath<NodeId>;
    /** [EN] Edmonds-Karp maximum flow. [ES] Flujo máximo de Edmonds-Karp. */
    maxFlow: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./max-flow").MaxFlowResult<NodeId>;
    /** [EN] Kruskal's Minimum Spanning Tree. [ES] Árbol de Recubrimiento Mínimo de Kruskal. */
    minimumSpanningTree: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[]) => import("./minimum-spanning-tree").MinimumSpanningTreeResult<NodeId>;
    /** [EN] Kahn's topological sort. [ES] Ordenamiento topológico de Kahn. */
    topologicalSort: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[]) => NodeId[];
};
