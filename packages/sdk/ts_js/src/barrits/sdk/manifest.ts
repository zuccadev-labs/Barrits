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

const generateChecksum = (data: string): string => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return `sha256-barrits-${Math.abs(hash).toString(16).padStart(8, "0")}`;
};

export const createBuildManifest = (
  graph: BarritsIntegrationGraph,
  filters?: BarritsSelectionFilters,
): BarritsBuildManifest => {
  const generatedAt = new Date().toISOString();
  
  const payloadTokens = [
    graph.projectRoot,
    graph.barritsDirectory,
    graph.filesCount.toString(),
    graph.exportsCount.toString(),
    graph.traitDescriptors.map(t => t.bindingName).join(","),
    graph.importActions.map(i => i.statement).join(";")
  ].join("|");

  return {
    generatedAt,
    checksum: generateChecksum(payloadTokens),
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