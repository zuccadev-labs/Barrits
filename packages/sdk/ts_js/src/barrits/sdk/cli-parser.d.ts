/**
 * @module
 * [EN] Shared CLI argument parsing, selection filters, collision handling, and graph printing.
 * [ES] Análisis compartido de argumentos CLI, filtros de selección, manejo de colisiones e impresión de grafos.
 */
import type { BarritsFileKind, BarritsIntegrationGraph, BarritsSelectionFilters } from "./contracts";
export type CliCommand = "detect" | "help" | "info" | "watch" | "dev" | "imports" | "build";
export type CliOptions = {
  command: CliCommand;
  json: boolean;
  write: boolean;
  mode: "named-import" | "namespace-access" | "alias-namespace-access";
  domains: string[];
  exports: string[];
  kinds: Array<"named-import" | "namespace-access" | "alias-namespace-access">;
  fileKinds: BarritsFileKind[];
  visibilities: Array<"public" | "internal">;
  writeSnapshot: boolean;
  startDirectory?: string;
  snapshotFile?: string;
  targetFile?: string;
  childArgs: string[];
};
export type IntegrationGraph = BarritsIntegrationGraph;
export type AutomationArtifactPaths = {
  buildManifestPath: string;
  importsManifestPath: string;
  importsModulePath: string;
  watchSnapshotPath: string;
};
export declare const BUILD_MANIFEST_BASENAME = "build-manifest.json";
export declare const IMPORTS_MANIFEST_BASENAME = "import-actions.json";
export declare const IMPORTS_MODULE_BASENAME = "import-actions.generated.ts";
export declare const WATCH_SNAPSHOT_BASENAME = "watch-snapshot.json";
export declare const parseArguments: (argumentsList: string[]) => CliOptions;
export declare const toSelectionFilters: (options: CliOptions) => BarritsSelectionFilters;
export declare const hasCollisions: (graph: IntegrationGraph) => boolean;
export declare const printCollisions: (graph: IntegrationGraph) => void;
export declare const failOnCollisions: (graph: IntegrationGraph, json: boolean) => number;
export declare const toGraphFingerprint: (graph: IntegrationGraph) => string;
export declare const printInfoSummary: (graph: IntegrationGraph) => void;
export declare const printGraph: (graph: IntegrationGraph, json: boolean) => void;
export declare const printImportActions: (graph: IntegrationGraph, json: boolean) => void;
export {};
