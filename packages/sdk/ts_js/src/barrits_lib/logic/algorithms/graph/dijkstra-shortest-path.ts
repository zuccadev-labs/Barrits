import { buildAdjacencyList } from "./build-adjacency-list";
import { createBinaryHeap } from "../internal/binary-heap";
import type { GraphEdge, GraphNodeId, GraphPath, GraphTraversalOptions } from "./types";

type QueueEntry<NodeId extends GraphNodeId> = {
  readonly node: NodeId;
  readonly distance: number;
};

/**
 * [EN] Finds the shortest path between two nodes with Dijkstra's algorithm backed by a binary heap
 * (O((V + E) log V)). Edges are directional by default (`options.directed`, default `true`); weights default
 * to 1 and must be non-negative. When the target is unreachable the result has `distance: Infinity` and an
 * empty `path`.
 * [ES] Encuentra el camino más corto entre dos nodos con el algoritmo de Dijkstra respaldado por un montículo
 * binario (O((V + E) log V)). Las aristas son direccionales por defecto (`options.directed`, por defecto `true`);
 * los pesos valen 1 por defecto y deben ser no negativos. Si el destino es inalcanzable, el resultado tiene
 * `distance: Infinity` y un `path` vacío.
 *
 * @param edges [EN] Collection of weighted graph edges. [ES] Colección de aristas de grafo con peso.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @param targetNode [EN] The target node identifier. [ES] El identificador del nodo objetivo.
 * @param options [EN] Traversal options (`directed`). [ES] Opciones del recorrido (`directed`).
 * @returns [EN] Object containing distance, path, and settle order. [ES] Objeto con la distancia, el camino y el orden de asentamiento.
 * @throws RangeError - [EN] When an edge has a negative weight. [ES] Cuando una arista tiene peso negativo.
 */
export const dijkstraShortestPath = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  startNode: NodeId,
  targetNode: NodeId,
  options: GraphTraversalOptions = {},
): GraphPath<NodeId> => {
  for (const edge of edges) {
    if ((edge.weight ?? 1) < 0) {
      throw new RangeError(
        `dijkstraShortestPath requires non-negative weights (edge ${String(edge.from)} -> ${String(edge.to)} has ${String(edge.weight)}).`,
      );
    }
  }

  const adjacencyList = buildAdjacencyList(edges, { directed: options.directed ?? true });
  const distances = new Map<NodeId, number>([[startNode, 0]]);
  const previousNodes = new Map<NodeId, NodeId>();
  const settled = new Set<NodeId>();
  const visitOrder: NodeId[] = [];
  const queue = createBinaryHeap<QueueEntry<NodeId>>((left, right) => left.distance - right.distance);

  queue.push({ node: startNode, distance: 0 });

  while (queue.size() > 0) {
    const current = queue.pop()!;

    if (settled.has(current.node)) {
      continue;
    }

    settled.add(current.node);
    visitOrder.push(current.node);

    if (current.node === targetNode) {
      break;
    }

    for (const neighbor of adjacencyList.get(current.node) ?? []) {
      const candidateDistance = current.distance + neighbor.weight;
      const knownDistance = distances.get(neighbor.to) ?? Number.POSITIVE_INFINITY;

      if (candidateDistance < knownDistance) {
        distances.set(neighbor.to, candidateDistance);
        previousNodes.set(neighbor.to, current.node);
        queue.push({ node: neighbor.to, distance: candidateDistance });
      }
    }
  }

  const distance = distances.get(targetNode) ?? Number.POSITIVE_INFINITY;

  if (!settled.has(targetNode) || distance === Number.POSITIVE_INFINITY) {
    return {
      distance: Number.POSITIVE_INFINITY,
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

    path.push(cursor);
  }

  path.reverse();

  return {
    distance,
    path,
    visitedOrder: visitOrder,
  };
};
