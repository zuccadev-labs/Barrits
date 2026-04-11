import type { GraphEdge, GraphNodeId } from "./types";

export const topologicalSort = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
): NodeId[] => {
  const adjacencyList = new Map<NodeId, NodeId[]>();
  const inDegree = new Map<NodeId, number>();

  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.from);

    if (neighbors) {
      neighbors.push(edge.to);
    } else {
      adjacencyList.set(edge.from, [edge.to]);
    }

    if (!inDegree.has(edge.from)) {
      inDegree.set(edge.from, 0);
    }

    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
  }

  const queue = Array.from(inDegree.entries())
    .filter(([, degree]) => degree === 0)
    .map(([node]) => node);
  const orderedNodes: NodeId[] = [];

  while (queue.length > 0) {
    const currentNode = queue.shift() as NodeId;
    orderedNodes.push(currentNode);

    for (const neighbor of adjacencyList.get(currentNode) ?? []) {
      const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, nextDegree);

      if (nextDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (orderedNodes.length !== inDegree.size) {
    throw new Error("Topological sort requires an acyclic directed graph.");
  }

  return orderedNodes;
};
