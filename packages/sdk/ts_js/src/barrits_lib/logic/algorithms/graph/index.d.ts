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
export declare const graphAlgorithms: {
    breadthFirstSearch: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
    buildAdjacencyList: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], options?: {
        readonly directed?: boolean;
    }) => Map<NodeId, import("./types").GraphAdjacencyEntry<NodeId>[]>;
    detectDirectedCycle: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[]) => NodeId[] | null;
    depthFirstSearch: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
    dijkstraShortestPath: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => import("./types").GraphPath<NodeId>;
    maxFlow: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => import("./max-flow").MaxFlowResult<NodeId>;
    minimumSpanningTree: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[]) => import("./minimum-spanning-tree").MinimumSpanningTreeResult<NodeId>;
    topologicalSort: <NodeId extends import("./types").GraphNodeId>(edges: readonly import("./types").GraphEdge<NodeId>[]) => NodeId[];
};
