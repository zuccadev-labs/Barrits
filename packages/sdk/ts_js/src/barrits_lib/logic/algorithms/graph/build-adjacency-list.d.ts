import type { GraphAdjacencyEntry, GraphEdge, GraphNodeId } from "./types";
export declare const buildAdjacencyList: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], options?: {
    readonly directed?: boolean;
}) => Map<NodeId, GraphAdjacencyEntry<NodeId>[]>;
