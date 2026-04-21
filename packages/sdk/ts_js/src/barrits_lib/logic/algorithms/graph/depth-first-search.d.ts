import type { GraphEdge, GraphNodeId } from "./types";
export declare const depthFirstSearch: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
