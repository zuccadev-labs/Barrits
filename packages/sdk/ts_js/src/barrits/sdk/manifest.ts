/**
 * @module
 * [EN] Manifest creation and serialization utilities for Barrits.
 * [ES] Utilidades de creación y serialización de manifiestos para Barrits.
 */ import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsSelectionFilters, BarritsWatchSnapshot } from "./contracts";
import { filterImportActions } from "./imports";
import { filterIntegrationGraph } from "./query";

const hasSelectionFilters = (filters: BarritsSelectionFilters | undefined): filters is BarritsSelectionFilters => {
  if (!filters) {
    return false;
  }
  return (
    (filters.domains?.length ?? 0) > 0 ||
    (filters.exports?.length ?? 0) > 0 ||
    (filters.fileKinds?.length ?? 0) > 0 ||
    (filters.visibilities?.length ?? 0) > 0 ||
    (filters.kinds?.length ?? 0) > 0
  );
};

/**
 * [EN] Implementation of Create projected graph.
 * [ES] Implementación de Create projected graph.
 */
export const createProjectedGraph = (graph: BarritsIntegrationGraph, filters: BarritsSelectionFilters = {}): BarritsIntegrationGraph => {
  const filteredGraph = filterIntegrationGraph(graph, filters);

  return filterImportActions(filteredGraph, {
    domains: filters.domains,
    exports: filters.exports,
    kinds: filters.kinds,
  });
};

const generateChecksum = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sha256-barrits-${hashHex}`;
};

/**
 * [EN] Implementation of Create build manifest.
 * [ES] Implementación de Create build manifest.
 */
export const createBuildManifest = async (
  graph: BarritsIntegrationGraph,
  filters?: BarritsSelectionFilters,
): Promise<BarritsBuildManifest> => {
  const generatedAt = new Date().toISOString();

  const sortedTraits = [...graph.traitDescriptors].sort((left, right) => left.name.localeCompare(right.name));
  const sortedActions = [...graph.importActions].sort((left, right) => left.exportName.localeCompare(right.exportName));

  const payloadTokens = [
    graph.projectRoot,
    graph.barritsDirectory,
    graph.strategy,
    graph.discoveryRoots.join(","),
    graph.filesCount.toString(),
    graph.exportsCount.toString(),
    sortedTraits.map((t) => t.name).join(","),
    sortedActions.map((i) => i.exportName).join(";"),
  ].join("|");

  return {
    generatedAt,
    checksum: await generateChecksum(payloadTokens),
    ...(() => {
      const {
        rootFiles: _rootFiles,
        domains: _domains,
        libraryRootFiles: _libraryRootFiles,
        libraryDomains: _libraryDomains,
        ...base
      } = graph;
      return base;
    })(),
    domains: graph.domains.map((domain) => domain.name),
    traitDescriptors: sortedTraits,
    traitDiagnostics: graph.traitDiagnostics,
    importActions: sortedActions,
    collisions: graph.collisions,
    ...(hasSelectionFilters(filters) ? { filters } : {}),
  };
};

/**
 * [EN] Implementation of Stringify build manifest.
 * [ES] Implementación de Stringify build manifest.
 */
export const stringifyBuildManifest = async (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters): Promise<string> => {
  return JSON.stringify(await createBuildManifest(graph, filters), null, 2);
};

/**
 * [EN] Implementation of Create watch snapshot.
 * [ES] Implementación de Create watch snapshot.
 */
export const createWatchSnapshot = (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
): BarritsWatchSnapshot => {
  return {
    generatedAt: new Date().toISOString(),
    mode,
    graph,
    ...(hasSelectionFilters(filters) ? { filters } : {}),
  };
};

/**
 * [EN] Implementation of Stringify watch snapshot.
 * [ES] Implementación de Stringify watch snapshot.
 */
export const stringifyWatchSnapshot = (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
): string => {
  return JSON.stringify(createWatchSnapshot(graph, mode, filters), null, 2);
};
