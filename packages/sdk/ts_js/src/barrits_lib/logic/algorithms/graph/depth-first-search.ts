import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId } from "./types";

export const depthFirstSearch = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  startNode: NodeId,
): NodeId[] => {
  const adjacencyList = buildAdjacencyList(edges);
  const stack: NodeId[] = [startNode];
  const visited = new Set<NodeId>();
  const visitOrder: NodeId[] = [];

  while (stack.length > 0) {
    const currentNode = stack.pop() as NodeId;

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    visitOrder.push(currentNode);

    const neighbors = [...(adjacencyList.get(currentNode) ?? [])].reverse();

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        stack.push(neighbor.to);
      }
    }
  }

  return visitOrder;
};
