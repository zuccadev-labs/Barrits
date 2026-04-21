import type { GraphEdge, GraphNodeId, GraphPath } from "./types";
export declare const dijkstraShortestPath: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], startNode: NodeId, targetNode: NodeId) => GraphPath<NodeId>;
