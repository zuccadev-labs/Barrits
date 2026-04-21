import type { GraphEdge, GraphNodeId } from "./types";
export declare const topologicalSort: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]) => NodeId[];
