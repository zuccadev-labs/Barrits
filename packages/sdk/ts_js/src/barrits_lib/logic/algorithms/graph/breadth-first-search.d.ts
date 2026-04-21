import type { GraphEdge, GraphNodeId } from "./types";
export declare const breadthFirstSearch: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], startNode: NodeId) => NodeId[];
