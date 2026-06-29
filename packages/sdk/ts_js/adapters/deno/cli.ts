/**
 * @module
 * Deno CLI for Barrits discovery, inspection, imports, watch, and build automation.
 */

import {
  applyManagedImports,
  createBuildManifest,
  createImportsModuleSource,
  createProjectedGraph,
  filterImportActions,
  filterIntegrationGraph,
  findBarritsDirectory,
  inspectBarritsIntegrations,
  resolveProjectFilePath,
  stringifyBuildManifest,
  stringifyWatchSnapshot,
} from "../../src/barrits/sdk";
import { formatTraitOverviewLines } from "../../src/barrits/sdk/cli-format";
import { resolveBarritsConfig } from "../../src/barrits/package";
import { createDenoFileSystemAdapter } from "./filesystem";
import {
  parseArguments,
  toSelectionFilters,
  printGraph,
  printImportActions,
  hasCollisions,
  failOnCollisions,
  toGraphFingerprint,
  type IntegrationGraph,
  type AutomationArtifactPaths,
} from "../../src/barrits/sdk/cli-parser";

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
  const resolved = segments.filter(Boolean).reduce(
    (currentPath, segment) => {
      const normalizedSegment = segment.replace(/\\/g, "/");

      const safeSegment = normalizedSegment.replace(/^(?:[A-Za-z]:)?\/+/, "");

      return `${currentPath.replace(/\/+$/g, "")}/${safeSegment.replace(/^\/+/, "")}`;
    },
    getDenoGlobals().cwd().replace(/\\/g, "/"),
  );

  const isPosixAbsolute = resolved.startsWith("/");
  const driveLetterMatch = resolved.match(/^([A-Za-z]:\/)/);
  const isWindowsAbsolute = driveLetterMatch !== null;

  const parts = resolved.replace(/^[A-Za-z]:\//, "").split("/");
  const normalized: string[] = [];

  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      if (normalized.length > 0 && normalized[normalized.length - 1] !== "..") {
        const lastSegment = normalized[normalized.length - 1];
        if (isWindowsAbsolute && /^[A-Za-z]:$/.test(lastSegment)) continue;
        normalized.pop();
      } else if (!isPosixAbsolute && !isWindowsAbsolute) {
        normalized.push("..");
      }
      continue;
    }
    normalized.push(part);
  }

  let result = normalized.join("/");

  if (isPosixAbsolute) {
    result = `/${result}`;
  } else if (isWindowsAbsolute && driveLetterMatch) {
    result = `${driveLetterMatch[1]}${result}`;
  }

  return result;
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

const ensureTextFile = async (filePath: string, content: string): Promise<void> => {
  const runtime = getDenoGlobals();
  await runtime.mkdir(dirname(filePath), { recursive: true });
  await runtime.writeTextFile(filePath, content);
};

const resolveAutomationArtifactPaths = async (projectRoot: string): Promise<AutomationArtifactPaths> => {
  const configuration = await resolveBarritsConfig({ projectRoot }, projectRoot);
  const automationRoot = resolveDenoPath(projectRoot, configuration.automationDirectory);

  return {
    buildManifestPath: resolveDenoPath(automationRoot, "build-manifest.json"),
    importsManifestPath: resolveDenoPath(automationRoot, "import-actions.json"),
    importsModulePath: resolveDenoPath(automationRoot, "import-actions.generated.ts"),
    watchSnapshotPath: resolveDenoPath(automationRoot, "watch-snapshot.json"),
  };
};

const runChildCommand = async (childArgs: string[], cwd: string, envVars: Record<string, string>): Promise<number> => {
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
        const targetFilePath = options.targetFile
          ? resolveDenoPath(discovery.projectRoot, options.targetFile)
          : resolveProjectFilePath(discovery.projectRoot, options.targetFile);

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
    : options.writeSnapshot
      ? defaultWatchSnapshotPath
      : undefined;
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
