import type { GraphEdge, GraphNodeId } from "./types";

export const detectDirectedCycle = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
): NodeId[] | null => {
  const adjacencyList = new Map<NodeId, NodeId[]>();

  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.from);

    if (neighbors) {
      neighbors.push(edge.to);
    } else {
      adjacencyList.set(edge.from, [edge.to]);
    }

    if (!adjacencyList.has(edge.to)) {
      adjacencyList.set(edge.to, []);
    }
  }

  const visited = new Set<NodeId>();
  const visiting = new Set<NodeId>();
  const path: NodeId[] = [];

  const visit = (node: NodeId): NodeId[] | null => {
    if (visiting.has(node)) {
      const cycleStartIndex = path.indexOf(node);
      return [...path.slice(cycleStartIndex), node];
    }

    if (visited.has(node)) {
      return null;
    }

    visited.add(node);
    visiting.add(node);
    path.push(node);

    for (const neighbor of adjacencyList.get(node) ?? []) {
      const cycle = visit(neighbor);

      if (cycle) {
        return cycle;
      }
    }

    visiting.delete(node);
    path.pop();
    return null;
  };

  for (const node of adjacencyList.keys()) {
    const cycle = visit(node);

    if (cycle) {
      return cycle;
    }
  }

  return null;
};
