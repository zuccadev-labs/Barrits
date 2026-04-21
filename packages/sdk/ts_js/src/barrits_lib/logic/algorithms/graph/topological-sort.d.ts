import type { GraphEdge, GraphNodeId } from "./types";
/**
 * [EN] Performs a Topological Sort on a Directed Acyclic Graph (DAG) using Kahn's algorithm.
 * [ES] Realiza un ordenamiento topológico en un Grafo Dirigido Acíclico (DAG) utilizando el algoritmo de Kahn.
 *
 * @param edges [EN] Collection of directed graph edges. [ES] Colección de aristas de grafo dirigido.
 * @returns [EN] Linearly ordered list of nodes. [ES] Lista de nodos ordenada linealmente.
 */
export declare const topologicalSort: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]) => NodeId[];
