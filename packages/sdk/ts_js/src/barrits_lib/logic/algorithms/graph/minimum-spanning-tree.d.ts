import type { GraphEdge, GraphNodeId } from "./types";
export type MinimumSpanningTreeResult<NodeId extends GraphNodeId = GraphNodeId> = {
    readonly edges: GraphEdge<NodeId>[];
    readonly totalWeight: number;
};
export declare const minimumSpanningTree: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]) => MinimumSpanningTreeResult<NodeId>;
