import type { BarritsFileExport, BarritsFileKind, BarritsIntegrationGraph, BarritsSelectionFilters } from "./contracts";
import { formatTraitDiagnosticDetailLines, formatTraitOverviewLines } from "./cli-format";
import { isBarritsExportVisibility, isBarritsFileKind } from "./guards";

/** [EN] CLI sub-commands available in the Barrits CLI. [ES] Subcomandos de CLI disponibles en la CLI de Barrits. */
export type CliCommand = "detect" | "help" | "info" | "watch" | "dev" | "imports" | "build" | "completion";

/** [EN] Parsed CLI options with defaults applied. [ES] Opciones de CLI analizadas con valores predeterminados aplicados. */
export type CliOptions = {
  /** [EN] Command. [ES] Comando. */
  command: CliCommand;
  /** [EN] Json. [ES] Json. */
  json: boolean;
  /** [EN] Write. [ES] Escritura. */
  write: boolean;
  /** [EN] Mode. [ES] Modo. */
  mode: "named-import" | "namespace-access" | "alias-namespace-access";
  /** [EN] Domains. [ES] Dominios. */
  domains: string[];
  /** [EN] Exports. [ES] Exportaciones. */
  exports: string[];
  /** [EN] Kinds. [ES] Tipos. */
  kinds: Array<"named-import" | "namespace-access" | "alias-namespace-access">;
  /** [EN] File kinds. [ES] Archivo tipos. */
  fileKinds: BarritsFileKind[];
  /** [EN] Visibilities. [ES] Visibilidades. */
  visibilities: Array<"public" | "internal">;
  /** [EN] Write snapshot. [ES] Escritura snapshot. */
  writeSnapshot: boolean;
  /** [EN] Start directory. [ES] Inicio directorio. */
  startDirectory?: string;
  /** [EN] Snapshot file. [ES] Snapshot archivo. */
  snapshotFile?: string;
  /** [EN] Target file. [ES] Target archivo. */
  targetFile?: string;
  /** [EN] Child args. [ES] Child args. */
  childArgs: string[];
  /** [EN] Shell type. [ES] Shell tipo. */
  shellType: string;
};

/** [EN] Alias for the Barrits integration graph type used across CLI handlers. [ES] Alias para el tipo de grafo de integración de Barrits utilizado en los manejadores de CLI. */
export type IntegrationGraph = BarritsIntegrationGraph;

/** [EN] File paths for automation artifacts (manifests, imports, snapshots). [ES] Rutas de archivo para artefactos de automatización (manifiestos, importaciones, snapshots). */
export type AutomationArtifactPaths = {
  /** [EN] Build manifest path. [ES] Build manifiesto ruta. */
  buildManifestPath: string;
  /** [EN] Imports manifest path. [ES] Importaciones manifiesto ruta. */
  importsManifestPath: string;
  /** [EN] Imports module path. [ES] Importaciones module ruta. */
  importsModulePath: string;
  /** [EN] Watch snapshot path. [ES] Watch snapshot ruta. */
  watchSnapshotPath: string;
};

/** [EN] Default basename for the build manifest JSON file. [ES] Nombre base predeterminado para el archivo JSON del manifiesto de compilación. */
export const BUILD_MANIFEST_BASENAME = "build-manifest.json";
/** [EN] Default basename for the import actions manifest JSON file. [ES] Nombre base predeterminado para el archivo JSON del manifiesto de acciones de importación. */
export const IMPORTS_MANIFEST_BASENAME = "import-actions.json";
/** [EN] Default basename for the generated import actions TypeScript module. [ES] Nombre base predeterminado para el módulo TypeScript generado de acciones de importación. */
export const IMPORTS_MODULE_BASENAME = "import-actions.generated.ts";
/** [EN] Default basename for the watch snapshot JSON file. [ES] Nombre base predeterminado para el archivo JSON del snapshot de observación. */
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

const BOOLEAN_FLAGS = new Map<string, (opts: CliOptions) => void>([
  ["--json", (o) => { o.json = true; }],
  ["--write", (o) => { o.write = true; }],
  ["--write-snapshot", (o) => { o.writeSnapshot = true; }],
]);

const COMMANDS = new Set<string>(["detect", "info", "watch", "dev", "imports", "build"]);

const HELP_ALIASES = new Set<string>(["help", "--help", "-h"]);

const VALUE_FLAGS = new Map<string, (opts: CliOptions, value: string) => void>([
  ["--target", (o, v) => { if (v && !v.includes("..")) o.targetFile = v; }],
  ["--snapshot", (o, v) => { if (v && !v.includes("..")) o.snapshotFile = v; }],
  ["--domain", (o, v) => { if (v && isValidName(v)) o.domains.push(v); }],
  ["--export", (o, v) => { if (v && isValidExportName(v)) o.exports.push(v); }],
  ["--kind", (o, v) => { if (isValidImportKind(v)) o.kinds.push(v); }],
  ["--file-kind", (o, v) => { if (isBarritsFileKind(v)) o.fileKinds.push(v); }],
  ["--visibility", (o, v) => { if (isBarritsExportVisibility(v)) o.visibilities.push(v); }],
  ["--mode", (o, v) => { if (isValidImportKind(v)) o.mode = v; }],
]);

const handleArgument = (args: string[], i: number, opts: CliOptions): number => {
  const arg = args[i];

  const booleanFlag = BOOLEAN_FLAGS.get(arg);
  if (booleanFlag) { booleanFlag(opts); return 0; }

  if (COMMANDS.has(arg)) { opts.command = arg as CliCommand; return 0; }

  if (HELP_ALIASES.has(arg)) { opts.command = "help"; return 0; }

  if (arg === "completion") {
    opts.command = "completion";
    const shellArg = nextValue(args, i);
    if (shellArg) { opts.shellType = shellArg; return 1; }
    return 0;
  }

  const valueFlag = VALUE_FLAGS.get(arg);
  if (valueFlag) { valueFlag(opts, args[i + 1]); return 1; }

  if (!opts.startDirectory && !arg.startsWith("--")) {
    opts.startDirectory = arg;
  }

  return 0;
};

/**
 * [EN] Parses raw CLI argument strings into a typed CliOptions object.
 * [ES] Analiza cadenas de argumentos CLI sin procesar en un objeto CliOptions tipado.
 */
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

/**
 * [EN] Converts CLI options into Barrits selection filters used for graph filtering.
 * [ES] Convierte opciones de CLI en filtros de selección de Barrits utilizados para el filtrado de grafos.
 */
export const toSelectionFilters = (options: CliOptions): BarritsSelectionFilters => {
  return {
    domains: options.domains.length > 0 ? options.domains : undefined,
    exports: options.exports.length > 0 ? options.exports : undefined,
    kinds: options.kinds.length > 0 ? options.kinds : undefined,
    fileKinds: options.fileKinds.length > 0 ? options.fileKinds : undefined,
    visibilities: options.visibilities.length > 0 ? options.visibilities : undefined,
  };
};

/**
 * [EN] Checks whether the integration graph contains any export collisions.
 * [ES] Verifica si el grafo de integración contiene alguna colisión de exportaciones.
 */
export const hasCollisions = (graph: IntegrationGraph): boolean => {
  return graph.collisions.length > 0;
};

/**
 * [EN] Prints all collision messages from the integration graph to stderr.
 * [ES] Imprime todos los mensajes de colisión del grafo de integración en stderr.
 */
export const printCollisions = (graph: IntegrationGraph): void => {
  for (const collision of graph.collisions) {
    console.error(collision.message);
  }
};

/**
 * [EN] Returns a non-zero exit code if the graph has collisions; prints collision details.
 * [ES] Retorna un código de salida distinto de cero si el grafo tiene colisiones; imprime los detalles de las colisiones.
 */
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

/**
 * [EN] Computes a deterministic fingerprint for the integration graph (used for change detection).
 * [ES] Calcula una huella digital determinista para el grafo de integración (usada para detección de cambios).
 */
export const toGraphFingerprint = (graph: IntegrationGraph): string => {
  return JSON.stringify(graph);
};

const formatExportLabel = (file: { readonly exports: readonly BarritsFileExport[] }): string =>
  file.exports.map((entry) => `${entry.name}:${entry.visibility}`).join(", ") || "-";

const printRootFilesInfo = (rootFiles: IntegrationGraph["rootFiles"]): void => {
  if (rootFiles.length === 0) return;

  console.log("rootFiles:");
  for (const file of rootFiles) {
    console.log(`  - ${file.path} [${file.kind}]: ${formatExportLabel(file)}`);
  }
};

const printDomainsInfo = (domains: IntegrationGraph["domains"]): void => {
  if (domains.length === 0) return;

  console.log("domains:");
  for (const domain of domains) {
    console.log(`  - ${domain.name}`);
    for (const file of domain.files) {
      console.log(`    ${file.path} [${file.kind}]: ${formatExportLabel(file)}`);
    }
  }
};

const printImportActionsInfo = (importActions: IntegrationGraph["importActions"]): void => {
  if (importActions.length === 0) return;

  console.log("importActions:");
  for (const action of importActions.slice(0, 12)) {
    console.log(`  - ${action.exportName} (${action.kind}): ${action.statement}`);
  }
  if (importActions.length > 12) {
    console.log(`  ... ${importActions.length - 12} more`);
  }
};

const printCollisionsInfo = (collisions: IntegrationGraph["collisions"]): void => {
  if (collisions.length === 0) return;

  console.log("collisions:");
  for (const collision of collisions) {
    console.log(`  - ${collision.message}`);
  }
};

/**
 * [EN] Prints a human-readable summary of the integration graph to stdout.
 * [ES] Imprime un resumen legible del grafo de integración en stdout.
 */
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

  printRootFilesInfo(graph.rootFiles);
  printDomainsInfo(graph.domains);
  printImportActionsInfo(graph.importActions);
  printCollisionsInfo(graph.collisions);

  for (const line of formatTraitDiagnosticDetailLines(graph.traitDiagnostics)) {
    console.log(line);
  }
};

/**
 * [EN] Prints the integration graph in JSON or human-readable format based on the json flag.
 * [ES] Imprime el grafo de integración en formato JSON o legible según el indicador json.
 */
export const printGraph = (graph: IntegrationGraph, json: boolean): void => {
  if (json) {
    console.log(JSON.stringify(graph, null, 2));
    return;
  }

  printInfoSummary(graph);
};

/**
 * [EN] Prints the import actions from the integration graph in JSON or text format.
 * [ES] Imprime las acciones de importación del grafo de integración en formato JSON o texto.
 */
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
