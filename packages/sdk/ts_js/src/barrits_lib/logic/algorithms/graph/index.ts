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

export const graphAlgorithms = {
  breadthFirstSearch,
  buildAdjacencyList,
  detectDirectedCycle,
  depthFirstSearch,
  dijkstraShortestPath,
  maxFlow,
  minimumSpanningTree,
  topologicalSort,
};
