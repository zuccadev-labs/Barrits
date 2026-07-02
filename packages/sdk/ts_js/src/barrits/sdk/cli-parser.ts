import type { BarritsFileKind, BarritsIntegrationGraph, BarritsSelectionFilters } from "./contracts";
import { formatTraitDiagnosticDetailLines, formatTraitOverviewLines } from "./cli-format";
import { isBarritsExportVisibility, isBarritsFileKind } from "./guards";

export type CliCommand = "detect" | "help" | "info" | "watch" | "dev" | "imports" | "build" | "completion";

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
  shellType: string;
};

export type IntegrationGraph = BarritsIntegrationGraph;

export type AutomationArtifactPaths = {
  buildManifestPath: string;
  importsManifestPath: string;
  importsModulePath: string;
  watchSnapshotPath: string;
};

export const BUILD_MANIFEST_BASENAME = "build-manifest.json";
export const IMPORTS_MANIFEST_BASENAME = "import-actions.json";
export const IMPORTS_MODULE_BASENAME = "import-actions.generated.ts";
export const WATCH_SNAPSHOT_BASENAME = "watch-snapshot.json";

const createDefaultOptions = (childArgs: string[]): CliOptions => ({
  command: "detect",
  json: false,
  write: false,
  writeSnapshot: false,
  mode: "named-import",
  domains: [],
  exports: [],
  kinds: [],
  fileKinds: [],
  visibilities: [],
  childArgs,
  shellType: "bash",
});

const nextValue = (args: string[], i: number): string | undefined => {
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : undefined;
};

const isValidName = (s: string): boolean => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(s);
const isValidExportName = (s: string): boolean => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s);
const isValidImportKind = (s: string): s is "named-import" | "namespace-access" | "alias-namespace-access" =>
  s === "named-import" || s === "namespace-access" || s === "alias-namespace-access";

const handleArgument = (args: string[], i: number, opts: CliOptions): number => {
  const arg = args[i];

  if (arg === "--json") { opts.json = true; return 0; }
  if (arg === "--write") { opts.write = true; return 0; }
  if (arg === "--write-snapshot") { opts.writeSnapshot = true; return 0; }

  if (arg === "help" || arg === "--help" || arg === "-h") { opts.command = "help"; return 0; }
  if (arg === "detect") { opts.command = "detect"; return 0; }
  if (arg === "info") { opts.command = "info"; return 0; }
  if (arg === "watch") { opts.command = "watch"; return 0; }
  if (arg === "dev") { opts.command = "dev"; return 0; }
  if (arg === "imports") { opts.command = "imports"; return 0; }
  if (arg === "build") { opts.command = "build"; return 0; }

  if (arg === "completion") {
    opts.command = "completion";
    const shellArg = nextValue(args, i);
    if (shellArg) { opts.shellType = shellArg; return 1; }
    return 0;
  }

  if (arg === "--target") {
    const value = nextValue(args, i);
    if (value && !value.includes("..")) { opts.targetFile = value; }
    return 1;
  }

  if (arg === "--snapshot") {
    const value = nextValue(args, i);
    if (value && !value.includes("..")) { opts.snapshotFile = value; }
    return 1;
  }

  if (arg === "--domain") {
    const value = nextValue(args, i);
    if (value && isValidName(value)) { opts.domains.push(value); }
    return 1;
  }

  if (arg === "--export") {
    const value = nextValue(args, i);
    if (value && isValidExportName(value)) { opts.exports.push(value); }
    return 1;
  }

  if (arg === "--kind") {
    const value = args[i + 1];
    if (isValidImportKind(value)) { opts.kinds.push(value); }
    return 1;
  }

  if (arg === "--file-kind") {
    const value = args[i + 1];
    if (value && isBarritsFileKind(value)) { opts.fileKinds.push(value); }
    return 1;
  }

  if (arg === "--visibility") {
    const value = args[i + 1];
    if (value && isBarritsExportVisibility(value)) { opts.visibilities.push(value); }
    return 1;
  }

  if (arg === "--mode") {
    const value = args[i + 1];
    if (isValidImportKind(value)) { opts.mode = value; }
    return 1;
  }

  if (!opts.startDirectory && !arg.startsWith("--")) {
    opts.startDirectory = arg;
  }

  return 0;
};

export const parseArguments = (argumentsList: string[]): CliOptions => {
  const separatorIndex = argumentsList.indexOf("--");
  const cliArguments = separatorIndex === -1 ? argumentsList : argumentsList.slice(0, separatorIndex);
  const childArgs = separatorIndex === -1 ? [] : argumentsList.slice(separatorIndex + 1);

  const options = createDefaultOptions(childArgs);

  for (let i = 0; i < cliArguments.length; i += 1) {
    i += handleArgument(cliArguments, i, options);
  }

  return options;
};

export const toSelectionFilters = (options: CliOptions): BarritsSelectionFilters => {
  return {
    domains: options.domains.length > 0 ? options.domains : undefined,
    exports: options.exports.length > 0 ? options.exports : undefined,
    kinds: options.kinds.length > 0 ? options.kinds : undefined,
    fileKinds: options.fileKinds.length > 0 ? options.fileKinds : undefined,
    visibilities: options.visibilities.length > 0 ? options.visibilities : undefined,
  };
};

export const hasCollisions = (graph: IntegrationGraph): boolean => {
  return graph.collisions.length > 0;
};

export const printCollisions = (graph: IntegrationGraph): void => {
  for (const collision of graph.collisions) {
    console.error(collision.message);
  }
};

export const failOnCollisions = (graph: IntegrationGraph, json: boolean): number => {
  if (!hasCollisions(graph)) {
    return 0;
  }

  if (json) {
    console.error(JSON.stringify({ collisions: graph.collisions }, null, 2));
  } else {
    printCollisions(graph);
  }

  return 1;
};

export const toGraphFingerprint = (graph: IntegrationGraph): string => {
  return JSON.stringify(graph);
};

export const printInfoSummary = (graph: IntegrationGraph): void => {
  console.log(`barrits: ${graph.barritsDirectory}`);
  console.log(`projectRoot: ${graph.projectRoot}`);
  console.log(`strategy: ${graph.strategy}`);
  console.log(`files: ${graph.filesCount}`);
  console.log(`exports: ${graph.exportsCount}`);
  console.log(`publicExports: ${graph.publicExportsCount}`);
  console.log(`internalExports: ${graph.internalExportsCount}`);
  console.log(`barrels: ${graph.barrelsCount}`);

  for (const line of formatTraitOverviewLines(graph)) {
    console.log(line);
  }

  if (graph.rootFiles.length > 0) {
    console.log("rootFiles:");

    for (const file of graph.rootFiles) {
      const exportsLabel = file.exports.map((entry) => `${entry.name}:${entry.visibility}`).join(", ") || "-";
      console.log(`  - ${file.path} [${file.kind}]: ${exportsLabel}`);
    }
  }

  if (graph.domains.length > 0) {
    console.log("domains:");

    for (const domain of graph.domains) {
      console.log(`  - ${domain.name}`);

      for (const file of domain.files) {
        const exportsLabel = file.exports.map((entry) => `${entry.name}:${entry.visibility}`).join(", ") || "-";
        console.log(`    ${file.path} [${file.kind}]: ${exportsLabel}`);
      }
    }
  }

  if (graph.importActions.length > 0) {
    console.log("importActions:");

    for (const action of graph.importActions.slice(0, 12)) {
      console.log(`  - ${action.exportName} (${action.kind}): ${action.statement}`);
    }

    if (graph.importActions.length > 12) {
      console.log(`  ... ${graph.importActions.length - 12} more`);
    }
  }

  if (graph.collisions.length > 0) {
    console.log("collisions:");

    for (const collision of graph.collisions) {
      console.log(`  - ${collision.message}`);
    }
  }

  for (const line of formatTraitDiagnosticDetailLines(graph.traitDiagnostics)) {
    console.log(line);
  }
};

export const printGraph = (graph: IntegrationGraph, json: boolean): void => {
  if (json) {
    console.log(JSON.stringify(graph, null, 2));
    return;
  }

  printInfoSummary(graph);
};

export const printImportActions = (graph: IntegrationGraph, json: boolean): void => {
  if (json) {
    console.log(JSON.stringify(graph.importActions, null, 2));
    return;
  }

  console.log(`imports: ${graph.importActions.length}`);

  for (const action of graph.importActions) {
    console.log(`- ${action.exportName} (${action.kind}) -> ${action.statement}`);
  }
};
