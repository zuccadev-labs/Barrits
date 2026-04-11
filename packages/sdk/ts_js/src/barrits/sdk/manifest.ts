import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsSelectionFilters, BarritsWatchSnapshot } from "./contracts";
import { filterImportActions } from "./imports";
import { filterIntegrationGraph } from "./query";

const hasSelectionFilters = (filters: BarritsSelectionFilters | undefined): filters is BarritsSelectionFilters => {
  return Boolean(
    filters
    && (
      filters.domains?.length
      || filters.exports?.length
      || filters.fileKinds?.length
      || filters.visibilities?.length
      || filters.kinds?.length
    ),
  );
};

export const createProjectedGraph = (
  graph: BarritsIntegrationGraph,
  filters: BarritsSelectionFilters = {},
): BarritsIntegrationGraph => {
  const filteredGraph = filterIntegrationGraph(graph, filters);

  return filterImportActions(filteredGraph, {
    domains: filters.domains,
    exports: filters.exports,
    kinds: filters.kinds,
  });
};

export const createBuildManifest = (
  graph: BarritsIntegrationGraph,
  filters?: BarritsSelectionFilters,
): BarritsBuildManifest => {
  return {
    generatedAt: new Date().toISOString(),
    projectRoot: graph.projectRoot,
    barritsDirectory: graph.barritsDirectory,
    barritsLibDirectory: graph.barritsLibDirectory,
    strategy: graph.strategy,
    filesCount: graph.filesCount,
    exportsCount: graph.exportsCount,
    publicExportsCount: graph.publicExportsCount,
    internalExportsCount: graph.internalExportsCount,
    barrelsCount: graph.barrelsCount,
    domains: graph.domains.map((domain) => domain.name),
    traitDescriptors: graph.traitDescriptors,
    traitDiagnostics: graph.traitDiagnostics,
    importActions: graph.importActions,
    collisions: graph.collisions,
    ...(hasSelectionFilters(filters) ? { filters } : {}),
  };
};

export const stringifyBuildManifest = (
  graph: BarritsIntegrationGraph,
  filters?: BarritsSelectionFilters,
): string => {
  return JSON.stringify(createBuildManifest(graph, filters), null, 2);
};

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

export const stringifyWatchSnapshot = (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
): string => {
  return JSON.stringify(createWatchSnapshot(graph, mode, filters), null, 2);
};