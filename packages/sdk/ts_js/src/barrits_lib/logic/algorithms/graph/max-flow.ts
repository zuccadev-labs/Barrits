import type { GraphEdge, GraphNodeId } from "./types";

/**
 * [EN] Result structure for maximum flow algorithms.
 * [ES] Estructura de resultado para algoritmos de flujo máximo.
 */
export type MaxFlowResult<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly value: number;
  readonly augmentingPaths: NodeId[][];
};

/**
 * [EN] Computes the maximum flow between a source and a sink using the Edmonds-Karp algorithm.
 * [ES] Calcula el flujo máximo entre una fuente y un sumidero utilizando el algoritmo de Edmonds-Karp.
 * 
 * @param edges [EN] Collection of graph edges with capacity. [ES] Colección de aristas de grafo con capacidad.
 * @param source [EN] The source node identifier. [ES] El identificador del nodo fuente.
 * @param sink [EN] The sink node identifier. [ES] El identificador del nodo sumidero.
 * @returns [EN] The maximum flow value and the used augmenting paths. [ES] El valor del flujo máximo y los caminos de aumento utilizados.
 */
export const maxFlow = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  source: NodeId,
  sink: NodeId,
): MaxFlowResult<NodeId> => {
  const capacity = new Map<string, number>();
  const adjacencyList = new Map<NodeId, NodeId[]>();
  const createKey = (from: NodeId, to: NodeId) => `${String(from)}=>${String(to)}`;
  const registerNeighbor = (from: NodeId, to: NodeId): void => {
    const neighbors = adjacencyList.get(from);

    if (neighbors) {
      if (!neighbors.includes(to)) {
        neighbors.push(to);
      }
      return;
    }

    adjacencyList.set(from, [to]);
  };

  for (const edge of edges) {
    capacity.set(createKey(edge.from, edge.to), edge.weight ?? 1);
    capacity.set(createKey(edge.to, edge.from), capacity.get(createKey(edge.to, edge.from)) ?? 0);
    registerNeighbor(edge.from, edge.to);
    registerNeighbor(edge.to, edge.from);
  }

  let totalFlow = 0;
  const augmentingPaths: NodeId[][] = [];

  while (true) {
    const queue: NodeId[] = [source];
    const parents = new Map<NodeId, NodeId>();
    const visited = new Set<NodeId>([source]);

    while (queue.length > 0 && !visited.has(sink)) {
      const currentNode = queue.shift() as NodeId;

      for (const neighbor of adjacencyList.get(currentNode) ?? []) {
        const residualCapacity = capacity.get(createKey(currentNode, neighbor)) ?? 0;

        if (residualCapacity <= 0 || visited.has(neighbor)) {
          continue;
        }

        visited.add(neighbor);
        parents.set(neighbor, currentNode);
        queue.push(neighbor);
      }
    }

    if (!visited.has(sink)) {
      break;
    }

    const path: NodeId[] = [sink];
    let bottleneck = Number.POSITIVE_INFINITY;
    let cursor = sink;

    while (cursor !== source) {
      const parent = parents.get(cursor) as NodeId;
      bottleneck = Math.min(bottleneck, capacity.get(createKey(parent, cursor)) ?? 0);
      path.unshift(parent);
      cursor = parent;
    }

    augmentingPaths.push(path);
    totalFlow += bottleneck;

    for (let index = 1; index < path.length; index += 1) {
      const from = path[index - 1];
      const to = path[index];
      capacity.set(createKey(from, to), (capacity.get(createKey(from, to)) ?? 0) - bottleneck);
      capacity.set(createKey(to, from), (capacity.get(createKey(to, from)) ?? 0) + bottleneck);
    }
  }

  return {
    value: totalFlow,
    augmentingPaths,
  };
};
