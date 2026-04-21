import type { GraphEdge, GraphNodeId } from "./types";
/**
 * [EN] Detects cycles in a directed graph.
 * Returns the path of the first cycle found, or null if acyclic.
 * [ES] Detecta ciclos en un grafo dirigido.
 * Devuelve el camino del primer ciclo encontrado, o null si es acíclico.
 *
 * @param edges [EN] Collection of graph edges. [ES] Colección de aristas del grafo.
 * @returns [EN] Path of the cycle or null. [ES] Camino del ciclo o null.
 */
export declare const detectDirectedCycle: <NodeId extends GraphNodeId>(edges: readonly GraphEdge<NodeId>[]) => NodeId[] | null;
