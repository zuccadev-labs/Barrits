#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { watch } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { applyManagedImports, createBuildManifest, createImportsModuleSource, createProjectedGraph, filterImportActions, filterIntegrationGraph, findBarritsDirectory, inspectBarritsIntegrations, isBarritsExportVisibility, isBarritsFileKind, resolveProjectFilePath, stringifyBuildManifest, stringifyWatchSnapshot, type BarritsFileKind, type BarritsSelectionFilters } from "../../src/barrits/sdk";
import { formatTraitDiagnosticDetailLines, formatTraitOverviewLines } from "../../src/barrits/sdk/cli-format";
import { resolveBarritsConfig } from "../../src/barrits/package";
import { createNodeFileSystemAdapter } from "./filesystem";

type CliCommand = "detect" | "help" | "info" | "watch" | "dev" | "imports" | "build";

type CliOptions = {
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

const HELP_TEXT = `barrits SDK

Usage:
  barrits detect [path] [--json]
  barrits info [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal]
  barrits watch [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file]
  barrits imports [path] [--json] [--write] [--target file] [--mode named-import|namespace-access|alias-namespace-access] [--domain name] [--export name] [--kind kind]
  barrits build [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [-- command]
  barrits dev [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file] [-- command]
  brt detect [path] [--json]
  brt info [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal]
  brt watch [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file]
  brt imports [path] [--json] [--write] [--target file] [--mode named-import|namespace-access|alias-namespace-access] [--domain name] [--export name] [--kind kind]
  brt build [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [-- command]
  brt dev [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file] [-- command]
  barrits help

Description:
  Detects the barrits directory, inspects its integrations and can watch changes automatically.
`;

type IntegrationGraph = Awaited<ReturnType<typeof inspectBarritsIntegrations>>;

const BUILD_MANIFEST_BASENAME = "build-manifest.json";
const IMPORTS_MANIFEST_BASENAME = "import-actions.json";
const IMPORTS_MODULE_BASENAME = "import-actions.generated.ts";
const WATCH_SNAPSHOT_BASENAME = "watch-snapshot.json";

type AutomationArtifactPaths = {
  buildManifestPath: string;
  importsManifestPath: string;
  importsModulePath: string;
  watchSnapshotPath: string;
};

const toSelectionFilters = (options: CliOptions): BarritsSelectionFilters => {
  return {
    domains: options.domains.length > 0 ? options.domains : undefined,
    exports: options.exports.length > 0 ? options.exports : undefined,
    kinds: options.kinds.length > 0 ? options.kinds : undefined,
    fileKinds: options.fileKinds.length > 0 ? options.fileKinds : undefined,
    visibilities: options.visibilities.length > 0 ? options.visibilities : undefined,
  };
};

const printInfoSummary = (graph: IntegrationGraph): void => {
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

const printCollisions = (graph: IntegrationGraph): void => {
  for (const collision of graph.collisions) {
    console.error(collision.message);
  }
};

const hasCollisions = (graph: IntegrationGraph): boolean => {
  return graph.collisions.length > 0;
};

const failOnCollisions = (graph: IntegrationGraph, json: boolean): number => {
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

const toGraphFingerprint = (graph: IntegrationGraph): string => {
  return JSON.stringify(graph);
};

const printGraph = (graph: IntegrationGraph, json: boolean): void => {
  if (json) {
    console.log(JSON.stringify(graph, null, 2));
    return;
  }

  printInfoSummary(graph);
};

const printImportActions = (graph: IntegrationGraph, json: boolean): void => {
  if (json) {
    console.log(JSON.stringify(graph.importActions, null, 2));
    return;
  }

  console.log(`imports: ${graph.importActions.length}`);

  for (const action of graph.importActions) {
    console.log(`- ${action.exportName} (${action.kind}) -> ${action.statement}`);
  }
};

const ensureTextFile = async (filePath: string, content: string): Promise<void> => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
};

const resolveAutomationArtifactPaths = async (projectRoot: string): Promise<AutomationArtifactPaths> => {
  const configuration = await resolveBarritsConfig({ projectRoot }, projectRoot);
  const automationRoot = resolve(projectRoot, configuration.automationDirectory);

  return {
    buildManifestPath: resolve(automationRoot, BUILD_MANIFEST_BASENAME),
    importsManifestPath: resolve(automationRoot, IMPORTS_MANIFEST_BASENAME),
    importsModulePath: resolve(automationRoot, IMPORTS_MODULE_BASENAME),
    watchSnapshotPath: resolve(automationRoot, WATCH_SNAPSHOT_BASENAME),
  };
};

const resolveChildCommand = (command: string): string => {
  if (process.platform !== "win32") {
    return command;
  }

  if (["npm", "npx", "pnpm", "yarn"].includes(command)) {
    return `${command}.cmd`;
  }

  return command;
};

const isWindowsPackageManagerCommand = (command: string): boolean => {
  return process.platform === "win32" && ["npm", "npx", "pnpm", "yarn"].includes(command);
};

const quoteCmdArgument = (value: string): string => {
  if (!/[\s"]/u.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
};

const runChildCommand = async (
  childArgs: string[],
  cwd: string,
  envVars: Record<string, string>,
): Promise<number> => {
  if (childArgs.length === 0) {
    return 0;
  }

  return new Promise<number>((resolve) => {
    const [command, ...args] = childArgs;
    const commandName = resolveChildCommand(command);
    const child = spawn(
      isWindowsPackageManagerCommand(command)
        ? process.env.ComSpec ?? "cmd.exe"
        : commandName,
      isWindowsPackageManagerCommand(command)
        ? ["/d", "/s", "/c", [commandName, ...args].map(quoteCmdArgument).join(" ")]
        : args,
      {
      cwd,
      stdio: "inherit",
      shell: false,
      env: {
        ...process.env,
        ...envVars,
      },
      },
    );

    const stopChild = (): void => {
      child.kill("SIGTERM");
    };

    process.once("SIGINT", stopChild);
    process.once("SIGTERM", stopChild);

    child.once("error", () => resolve(1));
    child.once("exit", (code) => resolve(code ?? 0));
  });
};

const startWatchSession = (
  discovery: { barritsDirectory: string },
  emitGraph: () => Promise<IntegrationGraph>,
  options: { json: boolean; onGraph?: (graph: IntegrationGraph) => Promise<void> | void },
) => {
  let timer: NodeJS.Timeout | undefined;
  let lastFingerprint = "";

  const watchers = [discovery.barritsDirectory]
    .map((directory) => watch(directory, { recursive: true }, () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      void emitGraph().then(async (nextGraph) => {
        const nextFingerprint = toGraphFingerprint(nextGraph);

        if (nextFingerprint === lastFingerprint) {
          return;
        }

        lastFingerprint = nextFingerprint;

        if (!options.json) {
          console.log("change detected");
        }

        if (options.onGraph) {
          await options.onGraph(nextGraph);
        }

        printGraph(nextGraph, options.json);
      });
    }, 100);
    }));

  return {
    setInitialGraph(graph: IntegrationGraph) {
      lastFingerprint = toGraphFingerprint(graph);
    },
    close() {
      for (const watcher of watchers) {
        watcher.close();
      }
      if (timer) {
        clearTimeout(timer);
      }
    },
  };
};

const parseArguments = (argumentsList: string[]): CliOptions => {
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
      options.targetFile = cliArguments[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--snapshot") {
      options.snapshotFile = cliArguments[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--domain") {
      const domain = cliArguments[index + 1];

      if (domain) {
        options.domains.push(domain);
      }

      index += 1;
      continue;
    }

    if (argument === "--export") {
      const exportName = cliArguments[index + 1];

      if (exportName) {
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

export const runNodeCli = async (argumentsList = process.argv.slice(2)): Promise<number> => {
  const options = parseArguments(argumentsList);
  const adapter = createNodeFileSystemAdapter();

  if (options.command === "help") {
    console.log(HELP_TEXT);
    return 0;
  }

  const discovery = await findBarritsDirectory(adapter, {
    startDirectory: options.startDirectory,
  });

  if (!discovery) {
    const payload = { found: false, target: "barrits" };
    console.error(options.json ? JSON.stringify(payload, null, 2) : "barrits directory not found.");
    return 1;
  }

  if (options.command === "detect" && options.json) {
    console.log(JSON.stringify({ found: true, ...discovery }, null, 2));
    return 0;
  }

  if (options.command === "detect") {
    console.log(`barrits: ${discovery.barritsDirectory}`);
    console.log(`projectRoot: ${discovery.projectRoot}`);
    console.log(`strategy: ${discovery.strategy}`);
    return 0;
  }

  const emitGraph = async (): Promise<IntegrationGraph> => {
    return inspectBarritsIntegrations(adapter, discovery);
  };

  const graph = await emitGraph();
  const selectionFilters = toSelectionFilters(options);
  const filteredGraph = filterIntegrationGraph(graph, selectionFilters);
  const automationPaths = await resolveAutomationArtifactPaths(discovery.projectRoot);

  if (options.command === "info") {
    printGraph(filteredGraph, options.json);
    return hasCollisions(graph) ? failOnCollisions(graph, options.json) : 0;
  }

  if (hasCollisions(graph)) {
    return failOnCollisions(graph, options.json);
  }

  if (options.command === "imports") {
    const importsGraph = filterImportActions(filteredGraph, {
      domains: options.domains.length > 0 ? options.domains : undefined,
      exports: options.exports.length > 0 ? options.exports : undefined,
      kinds: options.kinds.length > 0 ? options.kinds : undefined,
    });

    if (options.write) {
      const { importsManifestPath, importsModulePath } = automationPaths;
      await ensureTextFile(importsManifestPath, JSON.stringify(importsGraph.importActions, null, 2));
      await ensureTextFile(importsModulePath, createImportsModuleSource(importsGraph));

      if (options.targetFile) {
        const targetFilePath = options.targetFile ? resolve(discovery.projectRoot, options.targetFile) : resolveProjectFilePath(discovery.projectRoot, options.targetFile);

        if (!targetFilePath) {
          throw new Error("Unable to resolve imports target file.");
        }

        const targetSource = await readFile(targetFilePath, "utf8");
        const nextSource = applyManagedImports(targetSource, importsGraph, options.mode);
        await ensureTextFile(targetFilePath, nextSource);
      }

      if (!options.json) {
        console.log(`importsManifest: ${importsManifestPath}`);
        console.log(`importsModule: ${importsModulePath}`);

        if (options.targetFile) {
          console.log(`importsTarget: ${resolveProjectFilePath(discovery.projectRoot, options.targetFile)}`);
          console.log(`importsMode: ${options.mode}`);
        }
      }
    }

    printImportActions(importsGraph, options.json);
    return 0;
  }

  if (options.command === "build") {
    const { buildManifestPath } = automationPaths;
    const buildGraph = createProjectedGraph(graph, selectionFilters);
    await ensureTextFile(buildManifestPath, await stringifyBuildManifest(buildGraph, selectionFilters));

    const manifest = await createBuildManifest(buildGraph, selectionFilters);

    if (options.json) {
      console.log(JSON.stringify(manifest, null, 2));
    } else {
      console.log(`buildManifest: ${buildManifestPath}`);
      console.log(`domains: ${manifest.domains.join(", ")}`);

      for (const line of formatTraitOverviewLines(manifest)) {
        console.log(line);
      }
    }

    if (options.childArgs.length > 0) {
      return runChildCommand(options.childArgs, discovery.projectRoot, {
        BARRITS_BUILD_MANIFEST: buildManifestPath,
      });
    }

    return 0;
  }

  const { buildManifestPath, watchSnapshotPath: defaultWatchSnapshotPath } = automationPaths;
  const watchGraph = createProjectedGraph(graph, selectionFilters);
  const watchSnapshotPath = options.snapshotFile
    ? resolve(discovery.projectRoot, options.snapshotFile)
    : (options.writeSnapshot ? defaultWatchSnapshotPath : undefined);
  await ensureTextFile(buildManifestPath, await stringifyBuildManifest(watchGraph, selectionFilters));

  if (watchSnapshotPath) {
    await ensureTextFile(
      watchSnapshotPath,
      stringifyWatchSnapshot(watchGraph, options.command === "dev" ? "dev" : "watch", selectionFilters),
    );
  }

  printGraph(watchGraph, options.json);

  if (!options.json) {
    console.log("watching for changes in barrits/ ...");
  }

  const session = startWatchSession(discovery, emitGraph, {
    json: options.json,
    onGraph: async (nextGraph) => {
      const nextProjectedGraph = createProjectedGraph(nextGraph, selectionFilters);
      await ensureTextFile(buildManifestPath, await stringifyBuildManifest(nextProjectedGraph, selectionFilters));

      if (watchSnapshotPath) {
        await ensureTextFile(
          watchSnapshotPath,
          stringifyWatchSnapshot(nextProjectedGraph, options.command === "dev" ? "dev" : "watch", selectionFilters),
        );
      }
    },
  });
  session.setInitialGraph(watchGraph);

  if (options.command === "dev" && options.childArgs.length > 0) {
    const exitCode = await runChildCommand(options.childArgs, discovery.projectRoot, {
      BARRITS_BUILD_MANIFEST: buildManifestPath,
      ...(watchSnapshotPath ? { BARRITS_WATCH_SNAPSHOT: watchSnapshotPath } : {}),
      BARRITS_DEV_MODE: "1",
    });
    session.close();
    return exitCode;
  }

  return new Promise<number>((resolve) => {
    const stop = (): void => {
      session.close();
      resolve(0);
    };

    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
};

const isDirectExecution = (): boolean => {
  const entryFilePath = process.argv[1];

  if (!entryFilePath) {
    return false;
  }

  return resolve(entryFilePath) === fileURLToPath(import.meta.url);
};

if (isDirectExecution()) {
  void runNodeCli().then((exitCode) => {
    process.exitCode = exitCode;
  });
}