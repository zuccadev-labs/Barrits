/**
 * @module
 * [EN] Build manifest and watch snapshot consumption: parsing, validation, and file reading.
 * [ES] Consumo de manifiestos de compilación y snapshots de observación: análisis, validación y lectura de archivos.
 */
import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsLanguageToolSnapshot, BarritsWatchSnapshot } from "./contracts";
import {
  parseJsonSource,
  expectRecord,
  expectString,
  expectNumber,
  expectStringArray,
  expectOptionalString,
  expectEnumValue,
  expectOptionalArray,
  withOptionalProperty,
  expectSelectionFilters,
  expectTraitDescriptor,
  expectTraitDiagnostic,
  expectImportAction,
  expectExportCollision,
  expectFileIntegration,
  expectDomainIntegration,
  DISCOVERY_STRATEGIES,
  FILE_MODES,
} from "./validation";
import { createBuildManifestSummary, createWatchSnapshotSummary, createLanguageToolSnapshot } from "./summarization";

type ReadTextFile = (filePath: string) => Promise<string>;

const parseBuildManifestPayload = (source: string): BarritsBuildManifest => {
  const record = parseJsonSource(source, "barrits build manifest");

  return withOptionalProperty(
    withOptionalProperty(
      {
        generatedAt: expectString(record.generatedAt, "barrits build manifest", "generatedAt"),
        projectRoot: expectString(record.projectRoot, "barrits build manifest", "projectRoot"),
        barritsDirectory: expectString(record.barritsDirectory, "barrits build manifest", "barritsDirectory"),
        strategy: expectEnumValue(
          record.strategy,
          DISCOVERY_STRATEGIES,
          "barrits build manifest",
          "strategy",
          "valid BarritsDiscoveryStrategy",
        ),
        filesCount: expectNumber(record.filesCount, "barrits build manifest", "filesCount"),
        exportsCount: expectNumber(record.exportsCount, "barrits build manifest", "exportsCount"),
        publicExportsCount: expectNumber(record.publicExportsCount, "barrits build manifest", "publicExportsCount"),
        internalExportsCount: expectNumber(record.internalExportsCount, "barrits build manifest", "internalExportsCount"),
        barrelsCount: expectNumber(record.barrelsCount, "barrits build manifest", "barrelsCount"),
        domains: expectStringArray(record.domains, "barrits build manifest", "domains"),
        discoveryRoots:
          expectOptionalArray(record.discoveryRoots, "barrits build manifest", "discoveryRoots", (entry, index) =>
            expectString(entry, "barrits build manifest", `discoveryRoots[${index}]`),
          ) ?? [],
        traitDescriptors:
          expectOptionalArray(record.traitDescriptors, "barrits build manifest", "traitDescriptors", (entry, index) =>
            expectTraitDescriptor(entry, "barrits build manifest", `traitDescriptors[${index}]`),
          ) ?? [],
        traitDiagnostics:
          expectOptionalArray(record.traitDiagnostics, "barrits build manifest", "traitDiagnostics", (entry, index) =>
            expectTraitDiagnostic(entry, "barrits build manifest", `traitDiagnostics[${index}]`),
          ) ?? [],
        importActions:
          expectOptionalArray(record.importActions, "barrits build manifest", "importActions", (entry, index) =>
            expectImportAction(entry, "barrits build manifest", `importActions[${index}]`),
          ) ?? [],
        collisions:
          expectOptionalArray(record.collisions, "barrits build manifest", "collisions", (entry, index) =>
            expectExportCollision(entry, "barrits build manifest", `collisions[${index}]`),
          ) ?? [],
        checksum: expectString(record.checksum ?? "sha256-barrits-000000", "barrits build manifest", "checksum"),
      },
      "barritsLibDirectory",
      expectOptionalString(record.barritsLibDirectory, "barrits build manifest", "barritsLibDirectory"),
    ),
    "filters",
    expectSelectionFilters(record.filters, "barrits build manifest", "filters"),
  ) as BarritsBuildManifest;
};

const parseWatchSnapshotPayload = (source: string): BarritsWatchSnapshot => {
  const record = parseJsonSource(source, "barrits watch snapshot");
  const graph = expectRecord(record.graph, "barrits watch snapshot", "graph");

  const validatedGraph = withOptionalProperty(
    {
      barritsDirectory: expectString(graph.barritsDirectory, "barrits watch snapshot", "graph.barritsDirectory"),
      projectRoot: expectString(graph.projectRoot, "barrits watch snapshot", "graph.projectRoot"),
      strategy: expectEnumValue(
        graph.strategy,
        DISCOVERY_STRATEGIES,
        "barrits watch snapshot",
        "graph.strategy",
        "valid BarritsDiscoveryStrategy",
      ),
      discoveryRoots:
        expectOptionalArray(graph.discoveryRoots, "barrits watch snapshot", "graph.discoveryRoots", (entry, index) =>
          expectString(entry, "barrits watch snapshot", `graph.discoveryRoots[${index}]`),
        ) ?? [],
      rootFiles:
        expectOptionalArray(graph.rootFiles, "barrits watch snapshot", "graph.rootFiles", (entry, index) =>
          expectFileIntegration(entry, "barrits watch snapshot", `graph.rootFiles[${index}]`),
        ) ?? [],
      domains:
        expectOptionalArray(graph.domains, "barrits watch snapshot", "graph.domains", (entry, index) =>
          expectDomainIntegration(entry, "barrits watch snapshot", `graph.domains[${index}]`),
        ) ?? [],
      libraryRootFiles:
        expectOptionalArray(graph.libraryRootFiles, "barrits watch snapshot", "graph.libraryRootFiles", (entry, index) =>
          expectFileIntegration(entry, "barrits watch snapshot", `graph.libraryRootFiles[${index}]`),
        ) ?? [],
      libraryDomains:
        expectOptionalArray(graph.libraryDomains, "barrits watch snapshot", "graph.libraryDomains", (entry, index) =>
          expectDomainIntegration(entry, "barrits watch snapshot", `graph.libraryDomains[${index}]`),
        ) ?? [],
      filesCount: expectNumber(graph.filesCount, "barrits watch snapshot", "graph.filesCount"),
      exportsCount: expectNumber(graph.exportsCount, "barrits watch snapshot", "graph.exportsCount"),
      publicExportsCount: expectNumber(graph.publicExportsCount, "barrits watch snapshot", "graph.publicExportsCount"),
      internalExportsCount: expectNumber(graph.internalExportsCount, "barrits watch snapshot", "graph.internalExportsCount"),
      barrelsCount: expectNumber(graph.barrelsCount, "barrits watch snapshot", "graph.barrelsCount"),
      traitDescriptors:
        expectOptionalArray(graph.traitDescriptors, "barrits watch snapshot", "graph.traitDescriptors", (entry, index) =>
          expectTraitDescriptor(entry, "barrits watch snapshot", `graph.traitDescriptors[${index}]`),
        ) ?? [],
      traitDiagnostics:
        expectOptionalArray(graph.traitDiagnostics, "barrits watch snapshot", "graph.traitDiagnostics", (entry, index) =>
          expectTraitDiagnostic(entry, "barrits watch snapshot", `graph.traitDiagnostics[${index}]`),
        ) ?? [],
      importActions:
        expectOptionalArray(graph.importActions, "barrits watch snapshot", "graph.importActions", (entry, index) =>
          expectImportAction(entry, "barrits watch snapshot", `graph.importActions[${index}]`),
        ) ?? [],
      collisions:
        expectOptionalArray(graph.collisions, "barrits watch snapshot", "graph.collisions", (entry, index) =>
          expectExportCollision(entry, "barrits watch snapshot", `graph.collisions[${index}]`),
        ) ?? [],
    },
    "barritsLibDirectory",
    expectOptionalString(graph.barritsLibDirectory, "barrits watch snapshot", "graph.barritsLibDirectory"),
  );

  return withOptionalProperty(
    {
      generatedAt: expectString(record.generatedAt, "barrits watch snapshot", "generatedAt"),
      mode: expectEnumValue(record.mode, FILE_MODES, "barrits watch snapshot", "mode", "valid watch mode"),
      graph: validatedGraph,
    },
    "filters",
    expectSelectionFilters(record.filters, "barrits watch snapshot", "filters"),
  ) as BarritsWatchSnapshot;
};

/**
 * [EN] Parses a JSON string into a validated BarritsBuildManifest.
 * [ES] Analiza una cadena JSON en un BarritsBuildManifest validado.
 *
 * @param source - [EN] Raw JSON string. [ES] Cadena JSON sin procesar.
 * @returns [EN] A validated build manifest. [ES] Un manifiesto de compilación validado.
 */
export const parseBuildManifest = (source: string): BarritsBuildManifest => {
  return parseBuildManifestPayload(source);
};

/**
 * [EN] Parses a JSON string into a validated BarritsWatchSnapshot.
 * [ES] Analiza una cadena JSON en un BarritsWatchSnapshot validado.
 *
 * @param source - [EN] Raw JSON string. [ES] Cadena JSON sin procesar.
 * @returns [EN] A validated watch snapshot. [ES] Un snapshot de observación validado.
 */
export const parseWatchSnapshot = (source: string): BarritsWatchSnapshot => {
  return parseWatchSnapshotPayload(source);
};

/**
 * [EN] Reads and parses a build manifest from a file path using a provided text reader.
 * [ES] Lee y analiza un manifiesto de compilación desde una ruta de archivo usando un lector de texto proporcionado.
 *
 * @param filePath - [EN] Absolute path to the manifest file. [ES] Ruta absoluta al archivo de manifiesto.
 * @param readTextFile - [EN] Async function to read a file's text content. [ES] Función asíncrona para leer el contenido de texto de un archivo.
 * @returns [EN] A validated build manifest. [ES] Un manifiesto de compilación validado.
 */
export const readBuildManifest = async (filePath: string, readTextFile: ReadTextFile): Promise<BarritsBuildManifest> => {
  return parseBuildManifest(await readTextFile(filePath));
};

/**
 * [EN] Reads a build manifest from disk and produces a consumed state summary.
 * [ES] Lee un manifiesto de compilación desde el disco y produce un resumen de estado consumido.
 *
 * @param filePath - [EN] Absolute path to the manifest file. [ES] Ruta absoluta al archivo de manifiesto.
 * @param readTextFile - [EN] Async function to read a file's text content. [ES] Función asíncrona para leer el contenido de texto de un archivo.
 * @returns [EN] A consumed state summary with aggregated diagnostics. [ES] Un resumen de estado consumido con diagnósticos agregados.
 */
export const readBuildManifestSummary = async (filePath: string, readTextFile: ReadTextFile): Promise<BarritsConsumedStateSummary> => {
  return createBuildManifestSummary(await readBuildManifest(filePath, readTextFile));
};

/**
 * [EN] Reads and parses a watch snapshot from a file path using a provided text reader.
 * [ES] Lee y analiza un snapshot de observación desde una ruta de archivo usando un lector de texto proporcionado.
 *
 * @param filePath - [EN] Absolute path to the snapshot file. [ES] Ruta absoluta al archivo de snapshot.
 * @param readTextFile - [EN] Async function to read a file's text content. [ES] Función asíncrona para leer el contenido de texto de un archivo.
 * @returns [EN] A validated watch snapshot. [ES] Un snapshot de observación validado.
 */
export const readWatchSnapshot = async (filePath: string, readTextFile: ReadTextFile): Promise<BarritsWatchSnapshot> => {
  return parseWatchSnapshot(await readTextFile(filePath));
};

/**
 * [EN] Reads a watch snapshot from disk and produces a consumed state summary.
 * [ES] Lee un snapshot de observación desde el disco y produce un resumen de estado consumido.
 *
 * @param filePath - [EN] Absolute path to the snapshot file. [ES] Ruta absoluta al archivo de snapshot.
 * @param readTextFile - [EN] Async function to read a file's text content. [ES] Función asíncrona para leer el contenido de texto de un archivo.
 * @returns [EN] A consumed state summary with aggregated diagnostics. [ES] Un resumen de estado consumido con diagnósticos agregados.
 */
export const readWatchSnapshotSummary = async (filePath: string, readTextFile: ReadTextFile): Promise<BarritsConsumedStateSummary> => {
  return createWatchSnapshotSummary(await readWatchSnapshot(filePath, readTextFile));
};

/**
 * [EN] Reads a watch snapshot from disk and produces a detailed language tool snapshot.
 * [ES] Lee un snapshot de observación desde el disco y produce un snapshot detallado de herramienta de lenguaje.
 *
 * @param filePath - [EN] Absolute path to the snapshot file. [ES] Ruta absoluta al archivo de snapshot.
 * @param readTextFile - [EN] Async function to read a file's text content. [ES] Función asíncrona para leer el contenido de texto de un archivo.
 * @returns [EN] A language tool snapshot with full domain, diagnostic, and collision data. [ES] Un snapshot de herramienta de lenguaje con datos completos de dominio, diagnóstico y colisión.
 */
export const readLanguageToolSnapshot = async (filePath: string, readTextFile: ReadTextFile): Promise<BarritsLanguageToolSnapshot> => {
  return createLanguageToolSnapshot(await readWatchSnapshot(filePath, readTextFile));
};
