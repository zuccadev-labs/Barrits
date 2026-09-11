import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId, GraphTraversalOptions } from "./types";

/**
 * [EN] Performs an iterative Depth-First Search (DFS) traversal from `startNode`, exploring neighbors in
 * insertion order of their edges. Edges are treated as undirected unless `options.directed` is `true`,
 * matching `buildAdjacencyList`. Uses an explicit stack, so deep graphs never overflow the call stack.
 * [ES] Realiza un recorrido en profundidad (DFS) iterativo desde `startNode`, explorando vecinos en el orden de
 * inserción de sus aristas. Las aristas se tratan como no dirigidas salvo que `options.directed` sea `true`,
 * igual que `buildAdjacencyList`. Usa una pila explícita, por lo que los grafos profundos nunca desbordan la pila.
 *
 * @param edges [EN] Collection of graph edges. [ES] Colección de aristas del grafo.
 * @param startNode [EN] The starting node identifier. [ES] El identificador del nodo inicial.
 * @param options [EN] Traversal options (`directed`). [ES] Opciones del recorrido (`directed`).
 * @returns [EN] List of nodes in the order they were visited. [ES] Lista de nodos en el orden en que fueron visitados.
 */
export const depthFirstSearch = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  startNode: NodeId,
  options: GraphTraversalOptions = {},
): NodeId[] => {
  const adjacencyList = buildAdjacencyList(edges, { directed: options.directed ?? false });
  const stack: NodeId[] = [startNode];
  const visited = new Set<NodeId>();
  const visitOrder: NodeId[] = [];

  while (stack.length > 0) {
    const currentNode = stack.pop()!;

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    visitOrder.push(currentNode);

    const neighbors = adjacencyList.get(currentNode) ?? [];

    for (let index = neighbors.length - 1; index >= 0; index -= 1) {
      const neighbor = neighbors[index].to;

      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return visitOrder;
};
