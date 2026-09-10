/**
 * @module
 * [EN] Runtime-agnostic CLI core. Every command (`detect`, `info`, `imports`, `build`, `watch`, `dev`, `help`,
 * `completion`) is implemented once here against the `CliRuntimeIo` trait; the Node, Bun and Deno adapters
 * only provide the handful of I/O primitives that differ between runtimes.
 * [ES] Núcleo de CLI agnóstico del runtime. Cada comando (`detect`, `info`, `imports`, `build`, `watch`, `dev`,
 * `help`, `completion`) se implementa una sola vez aquí contra el trait `CliRuntimeIo`; los adaptadores Node, Bun y
 * Deno solo aportan las pocas primitivas de E/S que difieren entre runtimes.
 */
import { resolveBarritsConfig, type ResolvedBarritsConfig } from "../config";
import { applyManagedImports, createImportsModuleSource, filterImportActions } from "./imports";
import { createBuildManifest, createProjectedGraph, stringifyWatchSnapshot } from "./manifest";
import { filterIntegrationGraph } from "./query";
import { findBarritsDirectory } from "./discovery";
import { inspectBarritsIntegrations } from "./inspect";
import { joinPath, normalizePath } from "./path";
import { BarritsSpinner } from "./cli-spinner";
import { formatTraitOverviewLines } from "./cli-format";
import { printCompletion } from "./completion";
import { logger as defaultLogger, type BarritsLogger } from "./logger";
import {
  BUILD_MANIFEST_BASENAME,
  IMPORTS_MANIFEST_BASENAME,
  IMPORTS_MODULE_BASENAME,
  WATCH_SNAPSHOT_BASENAME,
  failOnCollisions,
  hasCollisions,
  parseArguments,
  printGraph,
  printImportActions,
  toGraphFingerprint,
  toSelectionFilters,
  type AutomationArtifactPaths,
  type CliOptions,
} from "./cli-parser";
import type { BarritsDiscovery, BarritsIntegrationGraph, BarritsSelectionFilters, RuntimeFileSystemAdapter } from "./contracts";

/**
 * [EN] Handle returned by `CliRuntimeIo.watchDirectory`.
 * [ES] Manejador devuelto por `CliRuntimeIo.watchDirectory`.
 */
export type CliWatchHandle = {
  /** [EN] Stops watching; idempotent. [ES] Detiene la observación; idempotente. */
  readonly close: () => void;
};

/**
 * [EN] Runtime I/O trait consumed by `runCli`. Implement it once per runtime (Node/Bun share one).
 * [ES] Trait de E/S de runtime consumido por `runCli`. Impleméntalo una vez por runtime (Node/Bun comparten uno).
 */
export type CliRuntimeIo = {
  /** [EN] Runtime label used in debug logs (`node`, `bun`, `deno`). [ES] Etiqueta del runtime usada en logs de depuración. */
  readonly name: string;
  /** [EN] Command prefixes shown in the help text (e.g. `barrits`, `brt`). [ES] Prefijos de comando mostrados en la ayuda (p. ej. `barrits`, `brt`). */
  readonly commandPrefixes: readonly string[];
  /** [EN] Filesystem port used for discovery and inspection. [ES] Port de filesystem usado para discovery e inspección. */
  readonly filesystem: RuntimeFileSystemAdapter;
  /** [EN] Resolves path segments to an absolute path (relative segments resolve against the working directory). [ES] Resuelve segmentos a una ruta absoluta (los relativos se resuelven contra el directorio de trabajo). */
  readonly resolvePath: (...segments: string[]) => string;
  /** [EN] Writes a UTF-8 file, creating parent directories. [ES] Escribe un archivo UTF-8 creando los directorios padre. */
  readonly ensureTextFile: (filePath: string, content: string) => Promise<void>;
  /** [EN] Reads a UTF-8 file. [ES] Lee un archivo UTF-8. */
  readonly readTextFile: (filePath: string) => Promise<string>;
  /** [EN] Spawns a child command with inherited stdio and extra environment; resolves with its exit code. [ES] Lanza un comando hijo con stdio heredado y entorno extra; resuelve con su código de salida. */
  readonly runChildCommand: (command: readonly string[], cwd: string, env: Readonly<Record<string, string>>) => Promise<number>;
  /** [EN] Watches a directory recursively and invokes `onChange` for every filesystem event. [ES] Observa un directorio recursivamente e invoca `onChange` por cada evento del filesystem. */
  readonly watchDirectory: (directory: string, onChange: () => void) => CliWatchHandle;
  /** [EN] Resolves when the process receives a termination signal (SIGINT/SIGTERM). [ES] Resuelve cuando el proceso recibe una señal de terminación (SIGINT/SIGTERM). */
  readonly waitForTermination: () => Promise<void>;
};

/**
 * [EN] Options accepted by `runCli`.
 * [ES] Opciones aceptadas por `runCli`.
 */
export type RunCliOptions = {
  /** [EN] Logger for diagnostics (`debugCommands` in the config raises its level to `debug`). [ES] Logger de diagnóstico (`debugCommands` en la configuración eleva su nivel a `debug`). */
  readonly logger?: BarritsLogger;
  /** [EN] Custom help text; defaults to `createHelpText(io.commandPrefixes)`. [ES] Texto de ayuda personalizado; por defecto `createHelpText(io.commandPrefixes)`. */
  readonly helpText?: string;
};

const WATCH_DEBOUNCE_MS = 100;

const COMMAND_USAGE_LINES: readonly string[] = [
  "detect [path] [--json]",
  "info [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal]",
  "watch [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file]",
  "imports [path] [--json] [--write] [--target file] [--mode named-import|namespace-access|alias-namespace-access] [--domain name] [--export name] [--kind kind]",
  "build [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [-- command]",
  "dev [path] [--json] [--domain name] [--export name] [--file-kind kind] [--visibility public|internal] [--kind kind] [--write-snapshot] [--snapshot file] [-- command]",
  "completion <bash|zsh|fish>",
  "help",
];

/**
 * [EN] Builds the CLI help text for the given command prefixes (one block per prefix).
 * [ES] Construye el texto de ayuda de la CLI para los prefijos de comando indicados (un bloque por prefijo).
 *
 * @param commandPrefixes - [EN] Ways to invoke the CLI (`barrits`, `brt`, `deno run -A jsr:...`). [ES] Formas de invocar la CLI.
 * @returns [EN] Help text ending with a newline. [ES] Texto de ayuda terminado en salto de línea.
 */
export const createHelpText = (commandPrefixes: readonly string[]): string => {
  const usage = commandPrefixes.flatMap((prefix) => COMMAND_USAGE_LINES.map((line) => `  ${prefix} ${line}`));

  return [
    "barrits SDK",
    "",
    "Usage:",
    ...usage,
    "",
    "Description:",
    "  Detects the barrits directory, inspects its integrations and can watch changes automatically.",
    "",
  ].join("\n");
};

const resolveAutomationArtifactPaths = (
  io: CliRuntimeIo,
  projectRoot: string,
  configuration: ResolvedBarritsConfig,
): AutomationArtifactPaths => {
  const automationRoot = io.resolvePath(projectRoot, configuration.automationDirectory);

  return {
    buildManifestPath: io.resolvePath(automationRoot, BUILD_MANIFEST_BASENAME),
    importsManifestPath: io.resolvePath(automationRoot, IMPORTS_MANIFEST_BASENAME),
    importsModulePath: io.resolvePath(automationRoot, IMPORTS_MODULE_BASENAME),
    watchSnapshotPath: io.resolvePath(automationRoot, WATCH_SNAPSHOT_BASENAME),
  };
};

/**
 * [EN] Applies the configured `discoveryRoots` to a discovery result: roots are normalized, de-duplicated and the
 * primary barrits directory is never added as an extra root (it would otherwise be inspected twice).
 * [ES] Aplica las `discoveryRoots` configuradas a un resultado de discovery: las raíces se normalizan, se deduplican y
 * el directorio barrits primario nunca se añade como raíz extra (se inspeccionaría dos veces).
 */
const withConfiguredDiscoveryRoots = (discovery: BarritsDiscovery, configuration: ResolvedBarritsConfig): BarritsDiscovery => {
  const barritsDirectory = normalizePath(discovery.barritsDirectory);
  const discoveryRoots = Array.from(
    new Set(configuration.discoveryRoots.map((root) => normalizePath(root)).filter((root) => root !== "." && root !== "")),
  ).filter((root) => normalizePath(joinPath(discovery.projectRoot, root)) !== barritsDirectory);

  return { ...discovery, discoveryRoots };
};

const writeSealedManifest = async (
  io: CliRuntimeIo,
  filePath: string,
  graph: BarritsIntegrationGraph,
  filters: BarritsSelectionFilters,
) => {
  const manifest = await createBuildManifest(graph, filters);
  await io.ensureTextFile(filePath, JSON.stringify(manifest, null, 2));
  return manifest;
};

type CommandContext = {
  readonly io: CliRuntimeIo;
  readonly log: BarritsLogger;
  readonly options: CliOptions;
  readonly discovery: BarritsDiscovery;
  readonly graph: BarritsIntegrationGraph;
  readonly filteredGraph: BarritsIntegrationGraph;
  readonly selectionFilters: BarritsSelectionFilters;
  readonly automationPaths: AutomationArtifactPaths;
  readonly emitGraph: () => Promise<BarritsIntegrationGraph>;
};

const handleImports = async ({ io, options, filteredGraph, discovery, automationPaths }: CommandContext): Promise<number> => {
  const importsGraph = filterImportActions(filteredGraph, {
    domains: options.domains.length > 0 ? options.domains : undefined,
    exports: options.exports.length > 0 ? options.exports : undefined,
    kinds: options.kinds.length > 0 ? options.kinds : undefined,
  });

  if (options.write) {
    const { importsManifestPath, importsModulePath } = automationPaths;
    await io.ensureTextFile(importsManifestPath, JSON.stringify(importsGraph.importActions, null, 2));
    await io.ensureTextFile(importsModulePath, createImportsModuleSource(importsGraph));

    const targetFilePath = options.targetFile ? io.resolvePath(discovery.projectRoot, options.targetFile) : undefined;

    if (targetFilePath) {
      const targetSource = await io.readTextFile(targetFilePath);
      await io.ensureTextFile(targetFilePath, applyManagedImports(targetSource, importsGraph, options.mode));
    }

    if (!options.json) {
      console.log(`importsManifest: ${importsManifestPath}`);
      console.log(`importsModule: ${importsModulePath}`);

      if (targetFilePath) {
        console.log(`importsTarget: ${targetFilePath}`);
        console.log(`importsMode: ${options.mode}`);
      }
    }
  }

  printImportActions(importsGraph, options.json);
  return 0;
};

const handleBuild = async ({ io, options, graph, selectionFilters, automationPaths, discovery }: CommandContext): Promise<number> => {
  const spinner = new BarritsSpinner();
  spinner.start("building...");

  const { buildManifestPath } = automationPaths;
  const buildGraph = createProjectedGraph(graph, selectionFilters);

  spinner.update("writing manifest...");
  const manifest = await writeSealedManifest(io, buildManifestPath, buildGraph, selectionFilters);

  if (options.json) {
    spinner.stopAndClear();
    console.log(JSON.stringify(manifest, null, 2));
  } else {
    spinner.succeed("build complete");
    console.log(`buildManifest: ${buildManifestPath}`);
    console.log(`domains: ${manifest.domains.join(", ")}`);

    for (const line of formatTraitOverviewLines(manifest)) {
      console.log(line);
    }
  }

  if (options.childArgs.length > 0) {
    return io.runChildCommand(options.childArgs, discovery.projectRoot, {
      BARRITS_BUILD_MANIFEST: buildManifestPath,
    });
  }

  return 0;
};

const startWatchSession = (context: CommandContext, onGraph: (graph: BarritsIntegrationGraph) => Promise<void>) => {
  const { io, log, options, discovery, emitGraph } = context;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastFingerprint = "";
  let closed = false;

  const handle = io.watchDirectory(discovery.barritsDirectory, () => {
    if (closed) {
      return;
    }

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;

      void emitGraph()
        .then(async (nextGraph) => {
          const nextFingerprint = toGraphFingerprint(nextGraph);

          if (closed || nextFingerprint === lastFingerprint) {
            return;
          }

          lastFingerprint = nextFingerprint;

          if (!options.json) {
            console.log("change detected");
          }

          await onGraph(nextGraph);
          printGraph(nextGraph, options.json);
        })
        .catch((error: unknown) => {
          log.error(`watch cycle failed: ${error instanceof Error ? error.message : String(error)}`);
        });
    }, WATCH_DEBOUNCE_MS);
  });

  return {
    setInitialGraph(graph: BarritsIntegrationGraph): void {
      lastFingerprint = toGraphFingerprint(graph);
    },
    close(): void {
      if (closed) {
        return;
      }

      closed = true;

      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }

      handle.close();
    },
  };
};

const handleWatchDev = async (context: CommandContext): Promise<number> => {
  const { io, options, graph, selectionFilters, automationPaths, discovery } = context;
  const { buildManifestPath, watchSnapshotPath: defaultWatchSnapshotPath } = automationPaths;
  const mode = options.command === "dev" ? "dev" : "watch";
  const watchGraph = createProjectedGraph(graph, selectionFilters);
  const watchSnapshotPath = options.snapshotFile
    ? io.resolvePath(discovery.projectRoot, options.snapshotFile)
    : options.writeSnapshot
      ? defaultWatchSnapshotPath
      : undefined;

  const persistArtifacts = async (nextGraph: BarritsIntegrationGraph): Promise<void> => {
    const projectedGraph = createProjectedGraph(nextGraph, selectionFilters);
    await writeSealedManifest(io, buildManifestPath, projectedGraph, selectionFilters);

    if (watchSnapshotPath) {
      await io.ensureTextFile(watchSnapshotPath, stringifyWatchSnapshot(projectedGraph, mode, selectionFilters));
    }
  };

  await writeSealedManifest(io, buildManifestPath, watchGraph, selectionFilters);

  if (watchSnapshotPath) {
    await io.ensureTextFile(watchSnapshotPath, stringifyWatchSnapshot(watchGraph, mode, selectionFilters));
  }

  printGraph(watchGraph, options.json);

  const startupSpinner = new BarritsSpinner();
  startupSpinner.start(mode === "dev" ? "starting dev session..." : "watching for changes in barrits/ ...");

  const session = startWatchSession(context, persistArtifacts);
  session.setInitialGraph(watchGraph);

  if (mode === "dev" && options.childArgs.length > 0) {
    startupSpinner.succeed("dev session started");

    try {
      return await io.runChildCommand(options.childArgs, discovery.projectRoot, {
        BARRITS_BUILD_MANIFEST: buildManifestPath,
        ...(watchSnapshotPath ? { BARRITS_WATCH_SNAPSHOT: watchSnapshotPath } : {}),
        BARRITS_DEV_MODE: "1",
      });
    } finally {
      session.close();
    }
  }

  startupSpinner.succeed("watching for changes in barrits/ ...");

  try {
    await io.waitForTermination();
  } finally {
    session.close();
  }

  return 0;
};

/**
 * [EN] Runs the Barrits CLI against a runtime I/O implementation and returns the process exit code.
 * [ES] Ejecuta la CLI de Barrits contra una implementación de E/S de runtime y devuelve el código de salida.
 *
 * @param io - [EN] Runtime primitives. [ES] Primitivas del runtime.
 * @param argumentsList - [EN] Raw CLI arguments (without the executable). [ES] Argumentos crudos de la CLI (sin el ejecutable).
 * @param runOptions - [EN] Logger and help overrides. [ES] Logger y ayuda personalizados.
 * @returns [EN] Exit code (`0` on success, `1` on discovery failure or export collisions). [ES] Código de salida (`0` en éxito, `1` si falla el discovery o hay colisiones).
 */
export const runCli = async (io: CliRuntimeIo, argumentsList: readonly string[], runOptions: RunCliOptions = {}): Promise<number> => {
  const log = runOptions.logger ?? defaultLogger;
  const options = parseArguments([...argumentsList]);

  if (options.command === "help") {
    console.log(runOptions.helpText ?? createHelpText(io.commandPrefixes));
    return 0;
  }

  if (options.command === "completion") {
    printCompletion(options.shellType);
    return 0;
  }

  const baseDiscovery = await findBarritsDirectory(io.filesystem, { startDirectory: options.startDirectory });

  if (!baseDiscovery) {
    const payload = { found: false, target: "barrits" };
    console.error(options.json ? JSON.stringify(payload, null, 2) : "barrits directory not found.");
    return 1;
  }

  if (options.command === "detect") {
    if (options.json) {
      console.log(JSON.stringify({ found: true, ...baseDiscovery }, null, 2));
    } else {
      console.log(`barrits: ${baseDiscovery.barritsDirectory}`);
      console.log(`projectRoot: ${baseDiscovery.projectRoot}`);
      console.log(`strategy: ${baseDiscovery.strategy}`);
    }

    return 0;
  }

  const configuration = await resolveBarritsConfig({ projectRoot: baseDiscovery.projectRoot }, baseDiscovery.projectRoot);

  if (configuration.debugCommands) {
    log.level = "debug";
  }

  const discovery = withConfiguredDiscoveryRoots(baseDiscovery, configuration);
  log.debug(
    `runtime=${io.name} command=${options.command} projectRoot=${discovery.projectRoot} discoveryRoots=[${discovery.discoveryRoots.join(", ")}]`,
  );

  const emitGraph = async (): Promise<BarritsIntegrationGraph> => {
    const startedAt = Date.now();
    const nextGraph = await inspectBarritsIntegrations(io.filesystem, discovery);
    log.debug(
      `inspected ${nextGraph.filesCount} files (${nextGraph.exportsCount} exports, ${nextGraph.traitDescriptors.length} traits) in ${Date.now() - startedAt}ms`,
    );
    return nextGraph;
  };

  const graph = await emitGraph();
  const selectionFilters = toSelectionFilters(options);
  const filteredGraph = filterIntegrationGraph(graph, selectionFilters);
  const automationPaths = resolveAutomationArtifactPaths(io, discovery.projectRoot, configuration);
  const context: CommandContext = { io, log, options, discovery, graph, filteredGraph, selectionFilters, automationPaths, emitGraph };

  if (options.command === "info") {
    printGraph(filteredGraph, options.json);
    return hasCollisions(graph) ? failOnCollisions(graph, options.json) : 0;
  }

  if (hasCollisions(graph)) {
    return failOnCollisions(graph, options.json);
  }

  if (options.command === "imports") {
    return handleImports(context);
  }

  if (options.command === "build") {
    return handleBuild(context);
  }

  return handleWatchDev(context);
};
