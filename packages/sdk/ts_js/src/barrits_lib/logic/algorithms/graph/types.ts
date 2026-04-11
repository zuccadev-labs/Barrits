export type GraphNodeId = string | number;

export type GraphEdge<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly from: NodeId;
  readonly to: NodeId;
  readonly weight?: number;
};

export type GraphAdjacencyEntry<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly to: NodeId;
  readonly weight: number;
};

export type GraphPath<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly distance: number;
  readonly path: NodeId[];
  readonly visitedOrder: NodeId[];
};
