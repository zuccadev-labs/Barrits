import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId, GraphTraversalOptions } from "./types";

/**
 * [EN] Performs a Breadth-First Search (BFS) traversal from `startNode`, visiting nodes level by level in
 * insertion order of their edges. Edges are treated as undirected unless `options.directed` is `true`,
 * matching `buildAdjacencyList`. Runs in O(V + E).
 * [ES] Realiza un recorrido en anchura (BFS) desde `startNode`, visitando los nodos nivel a nivel en el orden de
 * inserción de sus aristas. Las aristas se tratan como no dirigidas salvo que `options.directed` sea `true`,
 * igual que `buildAdjacencyList`. Se ejecuta en O(V + E).
 *
 * @param edges [EN] Collection of graph edges. [ES] Colección de aristas del grafo.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @param options [EN] Traversal options (`directed`). [ES] Opciones del recorrido (`directed`).
 * @returns [EN] List of nodes in the order they were visited. [ES] Lista de nodos en el orden en que fueron visitados.
 */
export const breadthFirstSearch = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  startNode: NodeId,
  options: GraphTraversalOptions = {},
): NodeId[] => {
  const adjacencyList = buildAdjacencyList(edges, { directed: options.directed ?? false });
  const visited = new Set<NodeId>([startNode]);
  const queue: NodeId[] = [startNode];
  const visitOrder: NodeId[] = [];
  let head = 0;

  while (head < queue.length) {
    const currentNode = queue[head];
    head += 1;
    visitOrder.push(currentNode);

    for (const neighbor of adjacencyList.get(currentNode) ?? []) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to);
        queue.push(neighbor.to);
      }
    }
  }

  return visitOrder;
};
