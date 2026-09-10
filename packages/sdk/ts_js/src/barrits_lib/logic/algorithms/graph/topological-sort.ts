import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId } from "./types";

/**
 * [EN] Performs a topological sort of a directed acyclic graph with Kahn's algorithm in O(V + E). Nodes with
 * no incoming edges are emitted first, in the order they first appear in `edges`.
 * [ES] Realiza un ordenamiento topológico de un grafo dirigido acíclico con el algoritmo de Kahn en O(V + E). Los
 * nodos sin aristas entrantes se emiten primero, en el orden en que aparecen por primera vez en `edges`.
 *
 * @param edges [EN] Collection of directed graph edges. [ES] Colección de aristas de grafo dirigido.
 * @returns [EN] Linearly ordered list of nodes. [ES] Lista de nodos ordenada linealmente.
 * @throws Error - [EN] When the graph contains a cycle. [ES] Cuando el grafo contiene un ciclo.
 */
export const topologicalSort = <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]): NodeId[] => {
  const adjacencyList = buildAdjacencyList(edges, { directed: true });
  const inDegree = new Map<NodeId, number>();

  for (const node of adjacencyList.keys()) {
    inDegree.set(node, 0);
  }

  for (const neighbors of adjacencyList.values()) {
    for (const neighbor of neighbors) {
      inDegree.set(neighbor.to, (inDegree.get(neighbor.to) ?? 0) + 1);
    }
  }

  const queue: NodeId[] = [];

  for (const [node, degree] of inDegree) {
    if (degree === 0) {
      queue.push(node);
    }
  }

  const orderedNodes: NodeId[] = [];
  let head = 0;

  while (head < queue.length) {
    const currentNode = queue[head];
    head += 1;
    orderedNodes.push(currentNode);

    for (const neighbor of adjacencyList.get(currentNode) ?? []) {
      const nextDegree = (inDegree.get(neighbor.to) ?? 0) - 1;
      inDegree.set(neighbor.to, nextDegree);

      if (nextDegree === 0) {
        queue.push(neighbor.to);
      }
    }
  }

  if (orderedNodes.length !== inDegree.size) {
    throw new Error("Topological sort requires an acyclic directed graph.");
  }

  return orderedNodes;
};
