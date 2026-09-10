import type { GraphEdge, GraphNodeId } from "./types";

/**
 * [EN] Result structure for maximum flow algorithms.
 * [ES] Estructura de resultado para algoritmos de flujo máximo.
 */
export type MaxFlowResult<NodeId extends GraphNodeId = GraphNodeId> = {
  /** [EN] Maximum flow value. [ES] Valor del flujo máximo. */
  readonly value: number;
  /** [EN] Paths used to augment the flow, in discovery order. [ES] Caminos utilizados para aumentar el flujo, en orden de descubrimiento. */
  readonly augmentingPaths: readonly (readonly NodeId[])[];
};

const getCapacity = <NodeId extends GraphNodeId>(capacities: Map<NodeId, Map<NodeId, number>>, from: NodeId, to: NodeId): number => {
  return capacities.get(from)?.get(to) ?? 0;
};

const addCapacity = <NodeId extends GraphNodeId>(
  capacities: Map<NodeId, Map<NodeId, number>>,
  from: NodeId,
  to: NodeId,
  delta: number,
): void => {
  const row = capacities.get(from) ?? new Map<NodeId, number>();
  row.set(to, (row.get(to) ?? 0) + delta);
  capacities.set(from, row);
};

/**
 * [EN] Computes the maximum flow from `source` to `sink` with the Edmonds-Karp algorithm (BFS augmenting
 * paths, O(V · E²)). `weight` is the edge capacity (default 1); parallel edges add up, node identifiers are
 * kept as-is (no string concatenation), and negative capacities throw.
 * [ES] Calcula el flujo máximo de `source` a `sink` con el algoritmo de Edmonds-Karp (caminos de aumento por BFS,
 * O(V · E²)). `weight` es la capacidad de la arista (por defecto 1); las aristas paralelas se suman, los
 * identificadores se conservan tal cual (sin concatenar cadenas) y las capacidades negativas lanzan.
 *
 * @param edges [EN] Directed edges with capacity. [ES] Aristas dirigidas con capacidad.
 * @param source [EN] The source node identifier. [ES] El identificador del nodo fuente.
 * @param sink [EN] The sink node identifier. [ES] El identificador del nodo sumidero.
 * @returns [EN] The maximum flow value and the augmenting paths used. [ES] El valor del flujo máximo y los caminos de aumento utilizados.
 * @throws RangeError - [EN] When an edge has a negative capacity. [ES] Cuando una arista tiene capacidad negativa.
 */
export const maxFlow = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
  source: NodeId,
  sink: NodeId,
): MaxFlowResult<NodeId> => {
  const capacities = new Map<NodeId, Map<NodeId, number>>();
  const neighbors = new Map<NodeId, NodeId[]>();
  const connect = (from: NodeId, to: NodeId): void => {
    const list = neighbors.get(from);

    if (!list) {
      neighbors.set(from, [to]);
      return;
    }

    if (!list.includes(to)) {
      list.push(to);
    }
  };

  for (const edge of edges) {
    const capacity = edge.weight ?? 1;

    if (!Number.isFinite(capacity) || capacity < 0) {
      throw new RangeError(
        `maxFlow requires finite, non-negative capacities (edge ${String(edge.from)} -> ${String(edge.to)} has ${String(edge.weight)}).`,
      );
    }

    addCapacity(capacities, edge.from, edge.to, capacity);
    addCapacity(capacities, edge.to, edge.from, 0);
    connect(edge.from, edge.to);
    connect(edge.to, edge.from);
  }

  if (source === sink) {
    return { value: 0, augmentingPaths: [] };
  }

  let totalFlow = 0;
  const augmentingPaths: NodeId[][] = [];

  for (;;) {
    const queue: NodeId[] = [source];
    const parents = new Map<NodeId, NodeId>();
    const visited = new Set<NodeId>([source]);
    let head = 0;

    while (head < queue.length && !visited.has(sink)) {
      const currentNode = queue[head];
      head += 1;

      for (const neighbor of neighbors.get(currentNode) ?? []) {
        if (visited.has(neighbor) || getCapacity(capacities, currentNode, neighbor) <= 0) {
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
      const parent = parents.get(cursor)!;
      bottleneck = Math.min(bottleneck, getCapacity(capacities, parent, cursor));
      path.push(parent);
      cursor = parent;
    }

    path.reverse();

    if (bottleneck <= 0) {
      break;
    }

    augmentingPaths.push(path);
    totalFlow += bottleneck;

    for (let index = 1; index < path.length; index += 1) {
      addCapacity(capacities, path[index - 1], path[index], -bottleneck);
      addCapacity(capacities, path[index], path[index - 1], bottleneck);
    }
  }

  return {
    value: totalFlow,
    augmentingPaths,
  };
};
