/**
 * @module
 * Deno CLI for Barrits discovery, inspection, imports, watch, and build automation.
 */

import { applyManagedImports, createBuildManifest, createImportsModuleSource, createProjectedGraph, filterImportActions, filterIntegrationGraph, findBarritsDirectory, inspectBarritsIntegrations, isBarritsExportVisibility, isBarritsFileKind, resolveProjectFilePath, stringifyBuildManifest, stringifyWatchSnapshot, type BarritsFileKind, type BarritsSelectionFilters } from "../../src/barrits/sdk";
import { formatTraitDiagnosticDetailLines, formatTraitOverviewLines } from "../../src/barrits/sdk/cli-format";
import { resolveBarritsConfig } from "../../src/barrits/package";
import { createDenoFileSystemAdapter } from "./filesystem";

type CliCommand = "detect" | "help" | "info" | "watch" | "dev" | "imports" | "build";

type DenoGlobals = {
  args: string[];
  cwd: () => string;
  env: { toObject: () => Record<string, string> };
  exit: (code?: number) => void;
  watchFs: (path: string | string[], options?: { recursive?: boolean }) => AsyncIterable<unknown> & { close?: () => void };
  mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>;
  writeTextFile: (path: string, data: string) => Promise<void>;
  readTextFile: (path: string) => Promise<string>;
  Command: new (
    command: string,
    options?: { args?: string[]; cwd?: string; env?: Record<string, string>; stdin?: "inherit"; stdout?: "inherit"; stderr?: "inherit" },
  ) => { output: () => Promise<{ code: number }> };
};

const dirname = (filePath: string): string => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const separatorIndex = normalizedPath.lastIndexOf("/");

  if (separatorIndex <= 0) {
    return ".";
  }

  return normalizedPath.slice(0, separatorIndex);
};

const resolveDenoPath = (...segments: string[]): string => {
  return segments
    .filter(Boolean)
    .reduce((currentPath, segment) => {
      const normalizedSegment = segment.replace(/\\/g, "/");

      if (/^(?:[A-Za-z]:\/|\/)/.test(normalizedSegment)) {
        return normalizedSegment;
      }

      return `${currentPath.replace(/\/+$/g, "")}/${normalizedSegment.replace(/^\/+/, "")}`;
    }, getDenoGlobals().cwd().replace(/\\/g, "/"));
};

const getDenoGlobals = (): DenoGlobals => {
  const runtime = (globalThis as { Deno?: DenoGlobals }).Deno;

  if (!runtime) {
    throw new Error("Deno runtime is not available.");
  }

  return runtime;
};

const HELP_TEXT = `barrits SDK

Usage:
  deno run -A jsr:@barrits/sdk/cli detect [path] [--json]
  deno run -A jsr:@barrits/sdk/cli info [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal]
  deno run -A jsr:@barrits/sdk/cli watch [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file]
  deno run -A jsr:@barrits/sdk/cli imports [path] [--json] [--write] [--target file] [--mode named-import|namespace-access|alias-namespace-access] [--domain name] [--export name] [--kind kind]
  deno run -A jsr:@barrits/sdk/cli build [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [-- command]
  deno run -A jsr:@barrits/sdk/cli dev [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file] [-- command]
  deno run -A jsr:@barrits/sdk/cli help

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

const toSelectionFilters = (options: ReturnType<typeof parseArguments>): BarritsSelectionFilters => {
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
  const runtime = getDenoGlobals();
  await runtime.mkdir(dirname(filePath), { recursive: true });
  await runtime.writeTextFile(filePath, content);
};

const resolveAutomationArtifactPaths = async (projectRoot: string): Promise<AutomationArtifactPaths> => {
  const configuration = await resolveBarritsConfig({ projectRoot }, projectRoot);
  const automationRoot = resolveDenoPath(projectRoot, configuration.automationDirectory);

  return {
    buildManifestPath: resolveDenoPath(automationRoot, BUILD_MANIFEST_BASENAME),
    importsManifestPath: resolveDenoPath(automationRoot, IMPORTS_MANIFEST_BASENAME),
    importsModulePath: resolveDenoPath(automationRoot, IMPORTS_MODULE_BASENAME),
    watchSnapshotPath: resolveDenoPath(automationRoot, WATCH_SNAPSHOT_BASENAME),
  };
};

const runChildCommand = async (
  childArgs: string[],
  cwd: string,
  envVars: Record<string, string>,
): Promise<number> => {
  if (childArgs.length === 0) {
    return 0;
  }

  const runtime = getDenoGlobals();
  const [command, ...args] = childArgs;
  const child = new runtime.Command(command, {
    args,
    cwd,
    env: {
      ...runtime.env.toObject(),
      ...envVars,
    },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const result = await child.output();
  return result.code;
};

const startWatchSession = (
  discovery: { barritsDirectory: string },
  emitGraph: () => Promise<IntegrationGraph>,
  options: { json: boolean; onGraph?: (graph: IntegrationGraph) => Promise<void> | void },
) => {
  let lastFingerprint = "";
  const watchTargets = [discovery.barritsDirectory];
  const watcher = getDenoGlobals().watchFs(watchTargets, { recursive: true });
  let closed = false;

  return {
    setInitialGraph(graph: IntegrationGraph) {
      lastFingerprint = toGraphFingerprint(graph);
    },
    close() {
      if (closed) {
        return;
      }

      closed = true;
      watcher.close?.();
    },
    async run() {
      try {
        for await (const _event of watcher) {
          if (closed) {
            return;
          }

          const nextGraph = await emitGraph();
          const nextFingerprint = toGraphFingerprint(nextGraph);

          if (nextFingerprint === lastFingerprint) {
            continue;
          }

          lastFingerprint = nextFingerprint;

          if (!options.json) {
            console.log("change detected");
          }

          if (options.onGraph) {
            await options.onGraph(nextGraph);
          }

          printGraph(nextGraph, options.json);
        }
      } catch {
        if (!closed) {
          throw new Error("Deno watch session terminated unexpectedly.");
        }
      }
    },
  };
};

const parseArguments = (argumentsList: string[]) => {
  const separatorIndex = argumentsList.indexOf("--");
  const cliArguments = separatorIndex === -1 ? argumentsList : argumentsList.slice(0, separatorIndex);
  const childArgs = separatorIndex === -1 ? [] : argumentsList.slice(separatorIndex + 1);

  let command: CliCommand = "detect";
  let json = false;
  let write = false;
  let writeSnapshot = false;
  let mode: "named-import" | "namespace-access" | "alias-namespace-access" = "named-import";
  const domains: string[] = [];
  const exports: string[] = [];
  const kinds: Array<"named-import" | "namespace-access" | "alias-namespace-access"> = [];
  const fileKinds: BarritsFileKind[] = [];
  const visibilities: Array<"public" | "internal"> = [];
  let startDirectory: string | undefined;
  let snapshotFile: string | undefined;
  let targetFile: string | undefined;

  for (let index = 0; index < cliArguments.length; index += 1) {
    const argument = cliArguments[index];

    if (argument === "help" || argument === "--help" || argument === "-h") {
      command = "help";
      continue;
    }

    if (argument === "detect") {
      command = "detect";
      continue;
    }

    if (argument === "info") {
      command = "info";
      continue;
    }

    if (argument === "watch") {
      command = "watch";
      continue;
    }

    if (argument === "dev") {
      command = "dev";
      continue;
    }

    if (argument === "imports") {
      command = "imports";
      continue;
    }

    if (argument === "build") {
      command = "build";
      continue;
    }

    if (argument === "--json") {
      json = true;
      continue;
    }

    if (argument === "--write") {
      write = true;
      continue;
    }

    if (argument === "--write-snapshot") {
      writeSnapshot = true;
      continue;
    }

    if (argument === "--target") {
      targetFile = cliArguments[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--snapshot") {
      snapshotFile = cliArguments[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--domain") {
      const domain = cliArguments[index + 1];

      if (domain) {
        domains.push(domain);
      }

      index += 1;
      continue;
    }

    if (argument === "--export") {
      const exportName = cliArguments[index + 1];

      if (exportName) {
        exports.push(exportName);
      }

      index += 1;
      continue;
    }

    if (argument === "--kind") {
      const kind = cliArguments[index + 1];

      if (kind === "named-import" || kind === "namespace-access" || kind === "alias-namespace-access") {
        kinds.push(kind);
      }

      index += 1;
      continue;
    }

    if (argument === "--file-kind") {
      const fileKind = cliArguments[index + 1];

      if (fileKind && isBarritsFileKind(fileKind)) {
        fileKinds.push(fileKind);
      }

      index += 1;
      continue;
    }

    if (argument === "--visibility") {
      const visibility = cliArguments[index + 1];

      if (visibility && isBarritsExportVisibility(visibility)) {
        visibilities.push(visibility);
      }

      index += 1;
      continue;
    }

    if (argument === "--mode") {
      const nextMode = cliArguments[index + 1];

      if (nextMode === "named-import" || nextMode === "namespace-access" || nextMode === "alias-namespace-access") {
        mode = nextMode;
      }

      index += 1;
      continue;
    }

    if (!startDirectory && !argument.startsWith("--")) {
      startDirectory = argument;
    }
  }

  return { command, json, write, writeSnapshot, mode, domains, exports, kinds, fileKinds, visibilities, startDirectory, snapshotFile, targetFile, childArgs };
};

/**
 * Runs the Barrits CLI command pipeline inside Deno.
 *
 * @param argumentsList Optional CLI arguments. Defaults to runtime args.
 * @returns Process exit code compatible with shell tooling.
 */
export const runDenoCli = async (argumentsList: string[] = getDenoGlobals().args): Promise<number> => {
  const options = parseArguments(argumentsList);
  const adapter = createDenoFileSystemAdapter();

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
        const runtime = getDenoGlobals();
        const targetFilePath = options.targetFile ? resolveDenoPath(discovery.projectRoot, options.targetFile) : resolveProjectFilePath(discovery.projectRoot, options.targetFile);

        if (!targetFilePath) {
          throw new Error("Unable to resolve imports target file.");
        }

        const targetSource = await runtime.readTextFile(targetFilePath);
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
    ? resolveDenoPath(discovery.projectRoot, options.snapshotFile)
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
    const watchPromise = session.run();
    const exitCode = await runChildCommand(options.childArgs, discovery.projectRoot, {
      BARRITS_BUILD_MANIFEST: buildManifestPath,
      ...(watchSnapshotPath ? { BARRITS_WATCH_SNAPSHOT: watchSnapshotPath } : {}),
      BARRITS_DEV_MODE: "1",
    });
    session.close();
    await watchPromise;
    return exitCode;
  }

  await session.run();

  return 0;
};

if (import.meta.main) {
  void runDenoCli().then((exitCode) => {
    getDenoGlobals().exit(exitCode);
  });
}