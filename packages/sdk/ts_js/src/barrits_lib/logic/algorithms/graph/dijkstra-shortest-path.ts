import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId, GraphPath } from "./types";

/**
 * [EN] Finds the shortest path between two nodes using Dijkstra's algorithm.
 * [ES] Encuentra el camino más corto entre dos nodos utilizando el algoritmo de Dijkstra.
 * 
 * @param edges [EN] Collection of weighted graph edges. [ES] Colección de aristas de grafo con peso.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @param targetNode [EN] The target node identifier. [ES] El identificador del nodo objetivo.
 * @returns [EN] Object containing distance, path, and visit order. [ES] Objeto con la distancia, el camino y el orden de visita.
 */
export const dijkstraShortestPath = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  startNode: NodeId,
  targetNode: NodeId,
): GraphPath<NodeId> => {
  const adjacencyList = buildAdjacencyList(edges, { directed: true });
  const distances = new Map<NodeId, number>([[startNode, 0]]);
  const previousNodes = new Map<NodeId, NodeId>();
  const visited = new Set<NodeId>();
  const visitOrder: NodeId[] = [];
  const queue = new Set<NodeId>(adjacencyList.keys());
  queue.add(startNode);
  queue.add(targetNode);

  while (queue.size > 0) {
    let currentNode: NodeId | undefined;
    let currentDistance = Number.POSITIVE_INFINITY;

    for (const node of queue) {
      const distance = distances.get(node) ?? Number.POSITIVE_INFINITY;

      if (distance < currentDistance) {
        currentNode = node;
        currentDistance = distance;
      }
    }

    if (currentNode === undefined || currentDistance === Number.POSITIVE_INFINITY) {
      break;
    }

    queue.delete(currentNode);

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    visitOrder.push(currentNode);

    if (currentNode === targetNode) {
      break;
    }

    for (const neighbor of adjacencyList.get(currentNode) ?? []) {
      const candidateDistance = currentDistance + neighbor.weight;
      const knownDistance = distances.get(neighbor.to) ?? Number.POSITIVE_INFINITY;

      if (candidateDistance < knownDistance) {
        distances.set(neighbor.to, candidateDistance);
        previousNodes.set(neighbor.to, currentNode);
        queue.add(neighbor.to);
      }
    }
  }

  const distance = distances.get(targetNode) ?? Number.POSITIVE_INFINITY;

  if (distance === Number.POSITIVE_INFINITY) {
    return {
      distance,
      path: [],
      visitedOrder: visitOrder,
    };
  }

  const path: NodeId[] = [targetNode];
  let cursor: NodeId | undefined = targetNode;

  while (cursor !== startNode) {
    cursor = previousNodes.get(cursor);

    if (cursor === undefined) {
      return {
        distance: Number.POSITIVE_INFINITY,
        path: [],
        visitedOrder: visitOrder,
      };
    }

    path.unshift(cursor);
  }

  return {
    distance,
    path,
    visitedOrder: visitOrder,
  };
};
