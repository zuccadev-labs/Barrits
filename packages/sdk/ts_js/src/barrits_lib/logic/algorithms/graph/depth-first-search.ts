import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId } from "./types";

/**
 * [EN] Performs a Depth-First Search (DFS) traversal on a graph.
 * [ES] Realiza un recorrido de búsqueda en profundidad (DFS) en un grafo.
 * 
 * @param edges [EN] Collection of graph edges. [ES] Colección de aristas del grafo.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @returns [EN] List of nodes in the order they were visited. [ES] Lista de nodos en el orden en que fueron visitados.
 */
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
