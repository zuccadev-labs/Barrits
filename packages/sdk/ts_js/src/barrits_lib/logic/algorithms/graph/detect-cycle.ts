import { buildAdjacencyList } from "./build-adjacency-list";
import type { GraphEdge, GraphNodeId } from "./types";

type Frame<NodeId extends GraphNodeId> = {
  readonly node: NodeId;
  readonly neighbors: readonly NodeId[];
  nextNeighborIndex: number;
};

/**
 * [EN] Detects cycles in a directed graph with an iterative depth-first search (explicit stack, so graphs with
 * tens of thousands of nodes never overflow the call stack). Returns the first cycle found as a closed path
 * (`[a, b, c, a]`), or `null` when the graph is acyclic. Runs in O(V + E).
 * [ES] Detecta ciclos en un grafo dirigido con una búsqueda en profundidad iterativa (pila explícita, de modo que
 * grafos con decenas de miles de nodos nunca desbordan la pila). Devuelve el primer ciclo encontrado como camino
 * cerrado (`[a, b, c, a]`), o `null` si el grafo es acíclico. Se ejecuta en O(V + E).
 *
 * @param edges [EN] Collection of directed edges. [ES] Colección de aristas dirigidas.
 * @returns [EN] Path of the cycle or null. [ES] Camino del ciclo o null.
 */
export const detectDirectedCycle = <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]): NodeId[] | null => {
  const adjacencyList = buildAdjacencyList(edges, { directed: true });
  const visited = new Set<NodeId>();
  const onPath = new Map<NodeId, number>();
  const path: NodeId[] = [];

  for (const root of adjacencyList.keys()) {
    if (visited.has(root)) {
      continue;
    }

    const stack: Frame<NodeId>[] = [{ node: root, neighbors: (adjacencyList.get(root) ?? []).map((entry) => entry.to), nextNeighborIndex: 0 }];
    visited.add(root);
    onPath.set(root, 0);
    path.push(root);

    while (stack.length > 0) {
      const frame = stack[stack.length - 1];

      if (frame.nextNeighborIndex >= frame.neighbors.length) {
        stack.pop();
        onPath.delete(frame.node);
        path.pop();
        continue;
      }

      const neighbor = frame.neighbors[frame.nextNeighborIndex];
      frame.nextNeighborIndex += 1;

      const cycleStart = onPath.get(neighbor);

      if (cycleStart !== undefined) {
        return [...path.slice(cycleStart), neighbor];
      }

      if (visited.has(neighbor)) {
        continue;
      }

      visited.add(neighbor);
      onPath.set(neighbor, path.length);
      path.push(neighbor);
      stack.push({ node: neighbor, neighbors: (adjacencyList.get(neighbor) ?? []).map((entry) => entry.to), nextNeighborIndex: 0 });
    }
  }

  return null;
};
