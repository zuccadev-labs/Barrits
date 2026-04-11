import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId } from "./types";

export const breadthFirstSearch = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  startNode: NodeId,
): NodeId[] => {
  const adjacencyList = buildAdjacencyList(edges);
  const visited = new Set<NodeId>();
  const queue: NodeId[] = [startNode];
  const visitOrder: NodeId[] = [];

  while (queue.length > 0) {
    const currentNode = queue.shift() as NodeId;

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    visitOrder.push(currentNode);

    for (const neighbor of adjacencyList.get(currentNode) ?? []) {
      if (!visited.has(neighbor.to)) {
        queue.push(neighbor.to);
      }
    }
  }

  return visitOrder;
};
