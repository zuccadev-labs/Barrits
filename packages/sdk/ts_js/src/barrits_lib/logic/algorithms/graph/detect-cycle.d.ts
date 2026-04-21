import type { GraphEdge, GraphNodeId } from "./types";
export declare const detectDirectedCycle: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]) => NodeId[] | null;
