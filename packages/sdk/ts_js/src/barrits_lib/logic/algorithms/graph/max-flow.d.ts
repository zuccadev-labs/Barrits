import type { GraphEdge, GraphNodeId } from "./types";
export type MaxFlowResult<NodeId extends GraphNodeId = GraphNodeId> = {
    readonly value: number;
    readonly augmentingPaths: NodeId[][];
};
export declare const maxFlow: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[], source: NodeId, sink: NodeId) => MaxFlowResult<NodeId>;
