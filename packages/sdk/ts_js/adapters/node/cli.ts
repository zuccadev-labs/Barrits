#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { watch } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

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
import { printCompletion } from "../../src/barrits/sdk/completion";
import { resolveBarritsConfig } from "../../src/barrits/package";
import { createNodeFileSystemAdapter } from "./filesystem";
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
  barrits completion <bash|zsh|fish>
  barrits help
  brt completion <bash|zsh|fish>

Description:
  Detects the barrits directory, inspects its integrations and can watch changes automatically.
`;

const ensureTextFile = async (filePath: string, content: string): Promise<void> => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
};

const resolveAutomationArtifactPaths = async (projectRoot: string): Promise<AutomationArtifactPaths> => {
  const configuration = await resolveBarritsConfig({ projectRoot }, projectRoot);
  const automationRoot = resolve(projectRoot, configuration.automationDirectory);

  return {
    buildManifestPath: resolve(automationRoot, "build-manifest.json"),
    importsManifestPath: resolve(automationRoot, "import-actions.json"),
    importsModulePath: resolve(automationRoot, "import-actions.generated.ts"),
    watchSnapshotPath: resolve(automationRoot, "watch-snapshot.json"),
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

const CHILD_TIMEOUT_MS = Number(process.env.BARRITS_CHILD_TIMEOUT_MS) || 600_000;

const runChildCommand = async (childArgs: string[], cwd: string, envVars: Record<string, string>): Promise<number> => {
  if (childArgs.length === 0) {
    return 0;
  }

  return new Promise<number>((resolvePromise) => {
    const [command, ...args] = childArgs;
    const commandName = resolveChildCommand(command);
    const child = spawn(
      isWindowsPackageManagerCommand(command) ? (process.env.ComSpec ?? "cmd.exe") : commandName,
      isWindowsPackageManagerCommand(command) ? ["/d", "/s", "/c", [commandName, ...args].map(quoteCmdArgument).join(" ")] : args,
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

    const timeoutId = setTimeout(() => {
      child.kill("SIGTERM");
    }, CHILD_TIMEOUT_MS);

    process.once("SIGINT", stopChild);
    process.once("SIGTERM", stopChild);

    child.once("error", () => {
      clearTimeout(timeoutId);
      resolvePromise(1);
    });
    child.once("exit", (code) => {
      clearTimeout(timeoutId);
      resolvePromise(code ?? 0);
    });
  });
};

const startWatchSession = (
  discovery: { barritsDirectory: string },
  emitGraph: () => Promise<IntegrationGraph>,
  options: { json: boolean; onGraph?: (graph: IntegrationGraph) => Promise<void> | void },
) => {
  let timer: NodeJS.Timeout | undefined;
  let lastFingerprint = "";

  const watchers = [discovery.barritsDirectory].map((directory) =>
    watch(directory, { recursive: true }, () => {
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
    }),
  );

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

export const runNodeCli = async (argumentsList = process.argv.slice(2)): Promise<number> => {
  const options = parseArguments(argumentsList);
  const adapter = createNodeFileSystemAdapter();

  if (options.command === "help") {
    console.log(HELP_TEXT);
    return 0;
  }

  if (options.command === "completion") {
    printCompletion(options.shellType);
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
        const targetFilePath = options.targetFile
          ? resolve(discovery.projectRoot, options.targetFile)
          : resolveProjectFilePath(discovery.projectRoot, options.targetFile);

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
    const exitCode = await runChildCommand(options.childArgs, discovery.projectRoot, {
      BARRITS_BUILD_MANIFEST: buildManifestPath,
      ...(watchSnapshotPath ? { BARRITS_WATCH_SNAPSHOT: watchSnapshotPath } : {}),
      BARRITS_DEV_MODE: "1",
    });
    session.close();
    return exitCode;
  }

  return new Promise<number>((resolvePromise) => {
    const stop = (): void => {
      session.close();
      resolvePromise(0);
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
  }).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
