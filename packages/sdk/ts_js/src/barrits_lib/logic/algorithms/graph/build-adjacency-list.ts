import type { GraphAdjacencyEntry, GraphEdge, GraphNodeId } from "./types";

export const buildAdjacencyList = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  options: {
    readonly directed?: boolean;
  } = {},
): Map<NodeId, GraphAdjacencyEntry<NodeId>[]> => {
  const adjacencyList = new Map<NodeId, GraphAdjacencyEntry<NodeId>[]>();
  const registerEdge = (from: NodeId, to: NodeId, weight: number): void => {
    const neighbors = adjacencyList.get(from);

    if (neighbors) {
      neighbors.push({ to, weight });
      return;
    }

    adjacencyList.set(from, [{ to, weight }]);
  };

  for (const edge of edges) {
    const weight = edge.weight ?? 1;
    registerEdge(edge.from, edge.to, weight);

    if (!adjacencyList.has(edge.to)) {
      adjacencyList.set(edge.to, []);
    }

    if (!options.directed) {
      registerEdge(edge.to, edge.from, weight);
    }
  }

  return adjacencyList;
};
