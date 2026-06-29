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

export const parseArguments = (argumentsList: string[]): CliOptions => {
  const separatorIndex = argumentsList.indexOf("--");
  const cliArguments = separatorIndex === -1 ? argumentsList : argumentsList.slice(0, separatorIndex);
  const childArgs = separatorIndex === -1 ? [] : argumentsList.slice(separatorIndex + 1);

  const options: CliOptions = {
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
  };

  for (let index = 0; index < cliArguments.length; index += 1) {
    const argument = cliArguments[index];

    if (argument === "help" || argument === "--help" || argument === "-h") {
      options.command = "help";
      continue;
    }

    if (argument === "detect") {
      options.command = "detect";
      continue;
    }
    if (argument === "info") {
      options.command = "info";
      continue;
    }
    if (argument === "watch") {
      options.command = "watch";
      continue;
    }
    if (argument === "dev") {
      options.command = "dev";
      continue;
    }
    if (argument === "imports") {
      options.command = "imports";
      continue;
    }
    if (argument === "build") {
      options.command = "build";
      continue;
    }
    if (argument === "completion") {
      options.command = "completion";
      const shellArg = cliArguments[index + 1];
      if (shellArg && !shellArg.startsWith("--")) {
        options.shellType = shellArg;
        index += 1;
      }
      continue;
    }

    if (argument === "--json") {
      options.json = true;
      continue;
    }
    if (argument === "--write") {
      options.write = true;
      continue;
    }
    if (argument === "--write-snapshot") {
      options.writeSnapshot = true;
      continue;
    }

    if (argument === "--target") {
      const value = cliArguments[index + 1];
      if (value && !value.startsWith("--") && !value.includes("..")) {
        options.targetFile = value;
      }
      index += 1;
      continue;
    }

    if (argument === "--snapshot") {
      const value = cliArguments[index + 1];
      if (value && !value.startsWith("--") && !value.includes("..")) {
        options.snapshotFile = value;
      }
      index += 1;
      continue;
    }

    if (argument === "--domain") {
      const domain = cliArguments[index + 1];
      if (domain && !domain.startsWith("--") && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(domain)) {
        options.domains.push(domain);
      }
      index += 1;
      continue;
    }

    if (argument === "--export") {
      const exportName = cliArguments[index + 1];
      if (exportName && !exportName.startsWith("--") && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(exportName)) {
        options.exports.push(exportName);
      }
      index += 1;
      continue;
    }

    if (argument === "--kind") {
      const kind = cliArguments[index + 1];
      if (kind === "named-import" || kind === "namespace-access" || kind === "alias-namespace-access") {
        options.kinds.push(kind);
      }
      index += 1;
      continue;
    }

    if (argument === "--file-kind") {
      const fileKind = cliArguments[index + 1];
      if (fileKind && isBarritsFileKind(fileKind)) {
        options.fileKinds.push(fileKind);
      }
      index += 1;
      continue;
    }

    if (argument === "--visibility") {
      const visibility = cliArguments[index + 1];
      if (visibility && isBarritsExportVisibility(visibility)) {
        options.visibilities.push(visibility);
      }
      index += 1;
      continue;
    }

    if (argument === "--mode") {
      const mode = cliArguments[index + 1];
      if (mode === "named-import" || mode === "namespace-access" || mode === "alias-namespace-access") {
        options.mode = mode;
      }
      index += 1;
      continue;
    }

    if (!options.startDirectory && !argument.startsWith("--")) {
      options.startDirectory = argument;
    }
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
