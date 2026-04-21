import type { GraphEdge, GraphNodeId } from "./types";

/**
 * [EN] Internal Disjoint Set (Union-Find) utility for group membership tracking.
 * [ES] Utilidad interna de Conjuntos Disjuntos (Union-Find) para rastreo de pertenencia a grupos.
 */
const createDisjointSet = <NodeId extends GraphNodeId>(nodes: readonly NodeId[]) => {
  const parent = new Map<NodeId, NodeId>(nodes.map((node) => [node, node]));
  const rank = new Map<NodeId, number>(nodes.map((node) => [node, 0]));

  const find = (node: NodeId): NodeId => {
    const parentNode = parent.get(node);

    if (!parentNode || parentNode === node) {
      return node;
    }

    const root = find(parentNode);
    parent.set(node, root);
    return root;
  };

  const union = (left: NodeId, right: NodeId): boolean => {
    const leftRoot = find(left);
    const rightRoot = find(right);

    if (leftRoot === rightRoot) {
      return false;
    }

    const leftRank = rank.get(leftRoot) ?? 0;
    const rightRank = rank.get(rightRoot) ?? 0;

    if (leftRank < rightRank) {
      parent.set(leftRoot, rightRoot);
      return true;
    }

    if (leftRank > rightRank) {
      parent.set(rightRoot, leftRoot);
      return true;
    }

    parent.set(rightRoot, leftRoot);
    rank.set(leftRoot, leftRank + 1);
    return true;
  };

  return { find, union };
};

/**
 * [EN] Result structure for Minimum Spanning Tree algorithms.
 * [ES] Estructura de resultado para algoritmos de Árbol de Recubrimiento Mínimo.
 */
export type MinimumSpanningTreeResult<NodeId extends GraphNodeId = GraphNodeId> = {
  readonly edges: GraphEdge<NodeId>[];
  readonly totalWeight: number;
};

/**
 * [EN] Computes the Minimum Spanning Tree (MST) of a graph using Kruskal's algorithm.
 * [ES] Calcula el Árbol de Recubrimiento Mínimo (MST) de un grafo utilizando el algoritmo de Kruskal.
 * 
 * @param edges [EN] Collection of weighted graph edges. [ES] Colección de aristas de grafo con peso.
 * @returns [EN] The MST edges and collective weight mapping. [ES] Las aristas del MST y el mapeo de peso colectivo.
 */
export const minimumSpanningTree = <NodeId extends GraphNodeId>(
  edges: readonly GraphEdge<NodeId>[],
): MinimumSpanningTreeResult<NodeId> => {
  const nodes = Array.from(new Set(edges.flatMap((edge) => [edge.from, edge.to])));
  const disjointSet = createDisjointSet(nodes);
  const sortedEdges = [...edges].sort((left, right) => (left.weight ?? 1) - (right.weight ?? 1));
  const treeEdges: GraphEdge<NodeId>[] = [];
  let totalWeight = 0;

  for (const edge of sortedEdges) {
    if (!disjointSet.union(edge.from, edge.to)) {
      continue;
    }

    treeEdges.push(edge);
    totalWeight += edge.weight ?? 1;
  }

  return {
    edges: treeEdges,
    totalWeight,
  };
};
