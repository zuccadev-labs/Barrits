/**
 * @module
 * [EN] Placeholder module description.
 * [ES] Descripción de marcador de posición del módulo.
 */
import type {
  BarritsBuildManifest,
  BarritsConsumedStateSummary,
  BarritsConsumedTraitDescriptor,
  BarritsTraitDiagnosticAggregate,
  BarritsTraitDiagnosticCategoryCounts,
  BarritsTraitDiagnosticCode,
  BarritsTraitDiagnosticCodeCounts,
  BarritsTraitDiagnosticCounts,
  BarritsImportAction,
  BarritsLanguageToolSnapshot,
  BarritsSelectionFilters,
  BarritsTraitDiagnostic,
  BarritsWatchSnapshot,
} from "./contracts";
import { isBarritsExportVisibility, isBarritsFileKind } from "./guards";

type ReadTextFile = (filePath: string) => Promise<string>;

type MutableTraitDiagnosticCounts = {
  total: number;
  errorCount: number;
  warningCount: number;
};

type MutableTraitDiagnosticCategoryCounts = {
  drift: number;
  impossible: number;
  "non-verifiable": number;
};

type MutableTraitDiagnosticCodeCounts = Record<BarritsTraitDiagnosticCode, number>;

type MutableSelectionFilters = {
  domains?: string[];
  exports?: string[];
  fileKinds?: BarritsSelectionFilters["fileKinds"];
  visibilities?: BarritsSelectionFilters["visibilities"];
  kinds?: BarritsSelectionFilters["kinds"];
};

const TRAIT_DIAGNOSTIC_CODES = [
  "trait-duplicate-name",
  "trait-duplicate-provides",
  "trait-conflicts-mismatch",
  "trait-missing-consumed-capability",
  "trait-consumes-mismatch",
  "trait-missing-required-trait",
  "trait-name-mismatch",
  "trait-requires-conflict-overlap",
  "trait-requires-mismatch",
  "trait-self-requires",
  "trait-self-conflict",
  "trait-provides-mismatch",
  "trait-state-mismatch",
  "trait-unsupported-factory",
] satisfies readonly BarritsTraitDiagnosticCode[];

const DISCOVERY_STRATEGIES = new Set(["current-directory", "direct-child", "recursive-child", "ancestor-child"]);
const FILE_MODES = new Set(["watch", "dev"]);
const IMPORT_ACTION_KINDS = new Set<BarritsImportAction["kind"]>(["named-import", "namespace-access", "alias-namespace-access"]);
const EXPORT_KINDS = new Set(["const", "function", "reexport"]);
const SOURCE_LAYERS = new Set(["barrits", "barrits_lib"]);
const BINDING_KINDS = new Set(["const", "function", "class"]);
const TRAIT_FACTORIES = new Set(["createTraitDescriptor", "createTraitDescriptorFromJsDoc"]);
const TRAIT_DIAGNOSTIC_SEVERITIES = new Set(["warning", "error"]);
const TRAIT_DIAGNOSTIC_CATEGORIES = new Set(["drift", "impossible", "non-verifiable"]);
const EXPORT_COLLISION_TYPES = new Set<"project-project" | "project-library">(["project-project", "project-library"]);
const TRAIT_DIAGNOSTIC_CODE_SET = new Set<BarritsTraitDiagnosticCode>(TRAIT_DIAGNOSTIC_CODES);

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const createInvalidPayloadError = (payloadName: string, path: string, expected: string): TypeError => {
  return new TypeError(`Invalid ${payloadName} at ${path}: expected ${expected}.`);
};

const expectRecord = (value: unknown, payloadName: string, path: string): JsonRecord => {
  if (!isJsonRecord(value)) {
    throw createInvalidPayloadError(payloadName, path, "object");
  }

  return value;
};

const expectString = (value: unknown, payloadName: string, path: string): string => {
  if (typeof value !== "string") {
    throw createInvalidPayloadError(payloadName, path, "string");
  }

  return value;
};

const expectNumber = (value: unknown, payloadName: string, path: string): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw createInvalidPayloadError(payloadName, path, "number");
  }

  return value;
};

const expectStringArray = (value: unknown, payloadName: string, path: string): string[] => {
  if (!Array.isArray(value)) {
    throw createInvalidPayloadError(payloadName, path, "string[]");
  }

  return value.map((entry, index) => expectString(entry, payloadName, `${path}[${index}]`));
};

const expectOptionalString = (value: unknown, payloadName: string, path: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, payloadName, path);
};

const expectEnumValue = <T extends string>(
  value: unknown,
  allowedValues: ReadonlySet<T>,
  payloadName: string,
  path: string,
  expected: string,
): T => {
  if (typeof value !== "string" || !allowedValues.has(value as T)) {
    throw createInvalidPayloadError(payloadName, path, expected);
  }

  return value as T;
};

const expectOptionalArray = <T>(
  value: unknown,
  payloadName: string,
  path: string,
  mapEntry: (entry: unknown, index: number) => T,
): T[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw createInvalidPayloadError(payloadName, path, "array");
  }

  return value.map((entry, index) => mapEntry(entry, index));
};

const withOptionalProperty = <T extends object, K extends string, V>(
  value: T,
  key: K,
  optionalValue: V | undefined,
): T & Partial<Record<K, V>> => {
  if (optionalValue === undefined) {
    return value;
  }

  return {
    ...value,
    [key]: optionalValue,
  };
};

const expectSelectionFilters = (
  value: unknown,
  payloadName: string,
  path: string,
): BarritsSelectionFilters | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const record = expectRecord(value, payloadName, path);

  const filters: MutableSelectionFilters = {};

  if (record.domains !== undefined) {
    filters.domains = expectStringArray(record.domains, payloadName, `${path}.domains`);
  }

  if (record.exports !== undefined) {
    filters.exports = expectStringArray(record.exports, payloadName, `${path}.exports`);
  }

  if (record.fileKinds !== undefined) {
    filters.fileKinds = expectStringArray(record.fileKinds, payloadName, `${path}.fileKinds`).map((entry, index) => {
      if (!isBarritsFileKind(entry)) {
        throw createInvalidPayloadError(payloadName, `${path}.fileKinds[${index}]`, "valid BarritsFileKind");
      }

      return entry;
    });
  }

  if (record.visibilities !== undefined) {
    filters.visibilities = expectStringArray(record.visibilities, payloadName, `${path}.visibilities`).map((entry, index) => {
      if (!isBarritsExportVisibility(entry)) {
        throw createInvalidPayloadError(payloadName, `${path}.visibilities[${index}]`, "valid BarritsExportVisibility");
      }

      return entry;
    });
  }

  if (record.kinds !== undefined) {
    filters.kinds = expectStringArray(record.kinds, payloadName, `${path}.kinds`).map((entry, index) => {
      if (!IMPORT_ACTION_KINDS.has(entry as BarritsImportAction["kind"])) {
        throw createInvalidPayloadError(payloadName, `${path}.kinds[${index}]`, "valid BarritsImportActionKind");
      }

      return entry as BarritsImportAction["kind"];
    });
  }

  return filters;
};

const expectTraitDescriptor = (
  value: unknown,
  payloadName: string,
  path: string,
): BarritsConsumedTraitDescriptor => {
  const record = expectRecord(value, payloadName, path);

  const descriptor = {
    name: expectString(record.name, payloadName, `${path}.name`),
    sourceFile: expectString(record.sourceFile, payloadName, `${path}.sourceFile`),
    bindingName: expectString(record.bindingName, payloadName, `${path}.bindingName`),
    bindingKind: expectEnumValue(record.bindingKind, BINDING_KINDS, payloadName, `${path}.bindingKind`, "valid binding kind"),
    requires: expectStringArray(record.requires, payloadName, `${path}.requires`),
    conflicts: expectStringArray(record.conflicts, payloadName, `${path}.conflicts`),
    state: expectStringArray(record.state, payloadName, `${path}.state`),
    consumes: expectStringArray(record.consumes, payloadName, `${path}.consumes`),
    provides: expectStringArray(record.provides, payloadName, `${path}.provides`),
    tags: expectStringArray(record.tags, payloadName, `${path}.tags`),
    runtimes: expectStringArray(record.runtimes, payloadName, `${path}.runtimes`),
  };

  return withOptionalProperty(
    withOptionalProperty(
      descriptor,
      "summary",
      expectOptionalString(record.summary, payloadName, `${path}.summary`),
    ),
    "factory",
    record.factory === undefined
      ? undefined
      : expectEnumValue(record.factory, TRAIT_FACTORIES, payloadName, `${path}.factory`, "valid trait factory"),
  ) as BarritsConsumedTraitDescriptor;
};

const expectTraitDiagnostic = (
  value: unknown,
  payloadName: string,
  path: string,
): BarritsTraitDiagnostic => {
  const record = expectRecord(value, payloadName, path);

  const diagnostic = {
    code: expectEnumValue(record.code, TRAIT_DIAGNOSTIC_CODE_SET, payloadName, `${path}.code`, "valid BarritsTraitDiagnosticCode"),
    category: expectEnumValue(record.category, TRAIT_DIAGNOSTIC_CATEGORIES, payloadName, `${path}.category`, "valid BarritsTraitDiagnosticCategory"),
    severity: expectEnumValue(record.severity, TRAIT_DIAGNOSTIC_SEVERITIES, payloadName, `${path}.severity`, "valid BarritsTraitDiagnosticSeverity"),
    message: expectString(record.message, payloadName, `${path}.message`),
    sourceFile: expectString(record.sourceFile, payloadName, `${path}.sourceFile`),
  };

  return withOptionalProperty(
    withOptionalProperty(
      withOptionalProperty(
        diagnostic,
        "descriptorName",
        expectOptionalString(record.descriptorName, payloadName, `${path}.descriptorName`),
      ),
      "bindingName",
      expectOptionalString(record.bindingName, payloadName, `${path}.bindingName`),
    ),
    "capabilityName",
    expectOptionalString(record.capabilityName, payloadName, `${path}.capabilityName`),
  ) as BarritsTraitDiagnostic;
};

const expectImportAction = (value: unknown, payloadName: string, path: string): BarritsImportAction => {
  const record = expectRecord(value, payloadName, path);

  return {
    exportName: expectString(record.exportName, payloadName, `${path}.exportName`),
    domain: expectString(record.domain, payloadName, `${path}.domain`),
    sourceFile: expectString(record.sourceFile, payloadName, `${path}.sourceFile`),
    kind: expectEnumValue(record.kind, IMPORT_ACTION_KINDS, payloadName, `${path}.kind`, "valid BarritsImportActionKind"),
    statement: expectString(record.statement, payloadName, `${path}.statement`),
  };
};

const expectExportCollision = (
  value: unknown,
  payloadName: string,
  path: string,
): { type: "project-project" | "project-library"; namespace: string; exportName: string; projectSourceFile: string; conflictSourceFile: string; librarySourceFile?: string; message: string } => {
  const record = expectRecord(value, payloadName, path);

  return withOptionalProperty({
    type: expectEnumValue(record.type, EXPORT_COLLISION_TYPES, payloadName, `${path}.type`, "valid collision type"),
    namespace: expectString(record.namespace, payloadName, `${path}.namespace`),
    exportName: expectString(record.exportName, payloadName, `${path}.exportName`),
    projectSourceFile: expectString(record.projectSourceFile, payloadName, `${path}.projectSourceFile`),
    conflictSourceFile: expectString(record.conflictSourceFile, payloadName, `${path}.conflictSourceFile`),
    message: expectString(record.message, payloadName, `${path}.message`),
  }, "librarySourceFile", expectOptionalString(record.librarySourceFile, payloadName, `${path}.librarySourceFile`));
};

const expectFileExport = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);

  return {
    name: expectString(record.name, payloadName, `${path}.name`),
    accessPath: expectString(record.accessPath, payloadName, `${path}.accessPath`),
    accessStrategy: expectEnumValue(record.accessStrategy, new Set(["export-name", "file-system", "jsdoc"]), payloadName, `${path}.accessStrategy`, "valid BarritsExportAccessStrategy"),
    kind: expectEnumValue(record.kind, EXPORT_KINDS, payloadName, `${path}.kind`, "valid BarritsExportKind"),
    visibility: expectString(record.visibility, payloadName, `${path}.visibility`),
  };
};

const expectFileIntegration = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);
  const visibilityEntries = expectOptionalArray(record.exports, payloadName, `${path}.exports`, (entry, index) =>
    expectFileExport(entry, payloadName, `${path}.exports[${index}]`),
  ) ?? [];

  visibilityEntries.forEach((entry, index) => {
    if (!isBarritsExportVisibility(entry.visibility)) {
      throw createInvalidPayloadError(payloadName, `${path}.exports[${index}].visibility`, "valid BarritsExportVisibility");
    }
  });

  return {
    path: expectString(record.path, payloadName, `${path}.path`),
    isIndex: typeof record.isIndex === "boolean" ? record.isIndex : (() => { throw createInvalidPayloadError(payloadName, `${path}.isIndex`, "boolean"); })(),
    kind: (() => {
      const value = expectString(record.kind, payloadName, `${path}.kind`);
      if (!isBarritsFileKind(value)) {
        throw createInvalidPayloadError(payloadName, `${path}.kind`, "valid BarritsFileKind");
      }
      return value;
    })(),
    sourceLayer: expectEnumValue(record.sourceLayer, SOURCE_LAYERS, payloadName, `${path}.sourceLayer`, "valid BarritsSourceLayer"),
    exports: visibilityEntries,
    traitDescriptors: expectOptionalArray(record.traitDescriptors, payloadName, `${path}.traitDescriptors`, (entry, index) =>
      expectTraitDescriptor(entry, payloadName, `${path}.traitDescriptors[${index}]`),
    ) ?? [],
  };
};

const expectDomainIntegration = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);

  return {
    name: expectString(record.name, payloadName, `${path}.name`),
    path: expectString(record.path, payloadName, `${path}.path`),
    files: expectOptionalArray(record.files, payloadName, `${path}.files`, (entry, index) =>
      expectFileIntegration(entry, payloadName, `${path}.files[${index}]`),
    ) ?? [],
  };
};

const parseJsonSource = (source: string, payloadName: string): JsonRecord => {
  const parsed = JSON.parse(source) as unknown;
  return expectRecord(parsed, payloadName, "$root");
};

const parseBuildManifestPayload = (source: string): BarritsBuildManifest => {
  const record = parseJsonSource(source, "barrits build manifest");

  return withOptionalProperty(
    withOptionalProperty({
    generatedAt: expectString(record.generatedAt, "barrits build manifest", "generatedAt"),
    projectRoot: expectString(record.projectRoot, "barrits build manifest", "projectRoot"),
    barritsDirectory: expectString(record.barritsDirectory, "barrits build manifest", "barritsDirectory"),
    strategy: expectEnumValue(record.strategy, DISCOVERY_STRATEGIES, "barrits build manifest", "strategy", "valid BarritsDiscoveryStrategy"),
    filesCount: expectNumber(record.filesCount, "barrits build manifest", "filesCount"),
    exportsCount: expectNumber(record.exportsCount, "barrits build manifest", "exportsCount"),
    publicExportsCount: expectNumber(record.publicExportsCount, "barrits build manifest", "publicExportsCount"),
    internalExportsCount: expectNumber(record.internalExportsCount, "barrits build manifest", "internalExportsCount"),
    barrelsCount: expectNumber(record.barrelsCount, "barrits build manifest", "barrelsCount"),
    domains: expectStringArray(record.domains, "barrits build manifest", "domains"),
    discoveryRoots: expectOptionalArray(record.discoveryRoots, "barrits build manifest", "discoveryRoots", (entry, index) => 
      expectString(entry, "barrits build manifest", `discoveryRoots[${index}]`)
    ) ?? [],
    traitDescriptors: expectOptionalArray(record.traitDescriptors, "barrits build manifest", "traitDescriptors", (entry, index) =>
      expectTraitDescriptor(entry, "barrits build manifest", `traitDescriptors[${index}]`),
    ) ?? [],
    traitDiagnostics: expectOptionalArray(record.traitDiagnostics, "barrits build manifest", "traitDiagnostics", (entry, index) =>
      expectTraitDiagnostic(entry, "barrits build manifest", `traitDiagnostics[${index}]`),
    ) ?? [],
    importActions: expectOptionalArray(record.importActions, "barrits build manifest", "importActions", (entry, index) =>
      expectImportAction(entry, "barrits build manifest", `importActions[${index}]`),
    ) ?? [],
    collisions: expectOptionalArray(record.collisions, "barrits build manifest", "collisions", (entry, index) =>
      expectExportCollision(entry, "barrits build manifest", `collisions[${index}]`),
    ) ?? [],
    checksum: expectString(record.checksum ?? "sha256-barrits-000000", "barrits build manifest", "checksum"),
    }, "barritsLibDirectory", expectOptionalString(record.barritsLibDirectory, "barrits build manifest", "barritsLibDirectory")),
    "filters",
    expectSelectionFilters(record.filters, "barrits build manifest", "filters"),
  ) as BarritsBuildManifest;
};

const parseWatchSnapshotPayload = (source: string): BarritsWatchSnapshot => {
  const record = parseJsonSource(source, "barrits watch snapshot");
  const graph = expectRecord(record.graph, "barrits watch snapshot", "graph");

  const validatedGraph = withOptionalProperty({
    barritsDirectory: expectString(graph.barritsDirectory, "barrits watch snapshot", "graph.barritsDirectory"),
    projectRoot: expectString(graph.projectRoot, "barrits watch snapshot", "graph.projectRoot"),
    strategy: expectEnumValue(graph.strategy, DISCOVERY_STRATEGIES, "barrits watch snapshot", "graph.strategy", "valid BarritsDiscoveryStrategy"),
    discoveryRoots: expectOptionalArray(graph.discoveryRoots, "barrits watch snapshot", "graph.discoveryRoots", (entry, index) => 
      expectString(entry, "barrits watch snapshot", `graph.discoveryRoots[${index}]`)
    ) ?? [],
    rootFiles: expectOptionalArray(graph.rootFiles, "barrits watch snapshot", "graph.rootFiles", (entry, index) =>
      expectFileIntegration(entry, "barrits watch snapshot", `graph.rootFiles[${index}]`),
    ) ?? [],
    domains: expectOptionalArray(graph.domains, "barrits watch snapshot", "graph.domains", (entry, index) =>
      expectDomainIntegration(entry, "barrits watch snapshot", `graph.domains[${index}]`),
    ) ?? [],
    libraryRootFiles: expectOptionalArray(graph.libraryRootFiles, "barrits watch snapshot", "graph.libraryRootFiles", (entry, index) =>
      expectFileIntegration(entry, "barrits watch snapshot", `graph.libraryRootFiles[${index}]`),
    ) ?? [],
    libraryDomains: expectOptionalArray(graph.libraryDomains, "barrits watch snapshot", "graph.libraryDomains", (entry, index) =>
      expectDomainIntegration(entry, "barrits watch snapshot", `graph.libraryDomains[${index}]`),
    ) ?? [],
    filesCount: expectNumber(graph.filesCount, "barrits watch snapshot", "graph.filesCount"),
    exportsCount: expectNumber(graph.exportsCount, "barrits watch snapshot", "graph.exportsCount"),
    publicExportsCount: expectNumber(graph.publicExportsCount, "barrits watch snapshot", "graph.publicExportsCount"),
    internalExportsCount: expectNumber(graph.internalExportsCount, "barrits watch snapshot", "graph.internalExportsCount"),
    barrelsCount: expectNumber(graph.barrelsCount, "barrits watch snapshot", "graph.barrelsCount"),
    traitDescriptors: expectOptionalArray(graph.traitDescriptors, "barrits watch snapshot", "graph.traitDescriptors", (entry, index) =>
      expectTraitDescriptor(entry, "barrits watch snapshot", `graph.traitDescriptors[${index}]`),
    ) ?? [],
    traitDiagnostics: expectOptionalArray(graph.traitDiagnostics, "barrits watch snapshot", "graph.traitDiagnostics", (entry, index) =>
      expectTraitDiagnostic(entry, "barrits watch snapshot", `graph.traitDiagnostics[${index}]`),
    ) ?? [],
    importActions: expectOptionalArray(graph.importActions, "barrits watch snapshot", "graph.importActions", (entry, index) =>
      expectImportAction(entry, "barrits watch snapshot", `graph.importActions[${index}]`),
    ) ?? [],
    collisions: expectOptionalArray(graph.collisions, "barrits watch snapshot", "graph.collisions", (entry, index) =>
      expectExportCollision(entry, "barrits watch snapshot", `graph.collisions[${index}]`),
    ) ?? [],
  }, "barritsLibDirectory", expectOptionalString(graph.barritsLibDirectory, "barrits watch snapshot", "graph.barritsLibDirectory"));

  return withOptionalProperty({
    generatedAt: expectString(record.generatedAt, "barrits watch snapshot", "generatedAt"),
    mode: expectEnumValue(record.mode, FILE_MODES, "barrits watch snapshot", "mode", "valid watch mode"),
    graph: validatedGraph,
  }, "filters", expectSelectionFilters(record.filters, "barrits watch snapshot", "filters")) as BarritsWatchSnapshot;
};

const mapImportStatements = (importActions: readonly BarritsImportAction[]): string[] => {
  return importActions.map((action) => action.statement);
};

const mapTraitDescriptors = (
  descriptors: readonly BarritsConsumedTraitDescriptor[] | undefined,
): BarritsConsumedTraitDescriptor[] => {
  return [...(descriptors ?? [])].sort((left, right) => {
    if (left.name === right.name) {
      return left.sourceFile.localeCompare(right.sourceFile);
    }

    return left.name.localeCompare(right.name);
  });
};

const mapTraitDiagnostics = (
  diagnostics: readonly BarritsTraitDiagnostic[] | undefined,
): BarritsTraitDiagnostic[] => {
  return [...(diagnostics ?? [])].sort((left, right) => {
    if (left.severity === right.severity) {
      if (left.code === right.code) {
        return left.sourceFile.localeCompare(right.sourceFile);
      }

      return left.code.localeCompare(right.code);
    }

    return left.severity.localeCompare(right.severity);
  });
};

const createEmptyTraitDiagnosticCounts = (): MutableTraitDiagnosticCounts => ({
  total: 0,
  errorCount: 0,
  warningCount: 0,
});

const createEmptyTraitDiagnosticCategoryCounts = (): MutableTraitDiagnosticCategoryCounts => ({
  drift: 0,
  impossible: 0,
  "non-verifiable": 0,
});

const createEmptyTraitDiagnosticCodeCounts = (): MutableTraitDiagnosticCodeCounts => {
  return Object.fromEntries(
    TRAIT_DIAGNOSTIC_CODES.map((code) => [code, 0]),
  ) as MutableTraitDiagnosticCodeCounts;
};

const createTraitDiagnosticAggregate = (
  diagnostics: readonly BarritsTraitDiagnostic[] | undefined,
): BarritsTraitDiagnosticAggregate | undefined => {
  if (!diagnostics || diagnostics.length === 0) {
    return undefined;
  }

  const counts = createEmptyTraitDiagnosticCounts();
  const byCategory = createEmptyTraitDiagnosticCategoryCounts();
  const byCode = createEmptyTraitDiagnosticCodeCounts();
  const byDescriptor = new Map<string, {
    descriptorName: string;
    sourceFile: string;
    bindingName?: string;
    counts: MutableTraitDiagnosticCounts;
    byCategory: MutableTraitDiagnosticCategoryCounts;
    byCode: MutableTraitDiagnosticCodeCounts;
    codes: Set<BarritsTraitDiagnostic["code"]>;
  }>();

  for (const diagnostic of diagnostics) {
    counts.total += 1;
    counts[diagnostic.severity === "error" ? "errorCount" : "warningCount"] += 1;
    byCategory[diagnostic.category] += 1;
    byCode[diagnostic.code] += 1;

    const descriptorName = diagnostic.descriptorName ?? "(anonymous)";
    const key = `${descriptorName}:${diagnostic.sourceFile}:${diagnostic.bindingName ?? ""}`;
    const existing = byDescriptor.get(key) ?? {
      descriptorName,
      sourceFile: diagnostic.sourceFile,
      bindingName: diagnostic.bindingName,
      counts: createEmptyTraitDiagnosticCounts(),
      byCategory: createEmptyTraitDiagnosticCategoryCounts(),
      byCode: createEmptyTraitDiagnosticCodeCounts(),
      codes: new Set<BarritsTraitDiagnostic["code"]>(),
    };

    existing.counts.total += 1;
    existing.counts[diagnostic.severity === "error" ? "errorCount" : "warningCount"] += 1;
    existing.byCategory[diagnostic.category] += 1;
    existing.byCode[diagnostic.code] += 1;
    existing.codes.add(diagnostic.code);
    byDescriptor.set(key, existing);
  }

  return {
    counts,
    byCategory,
    byCode,
    byDescriptor: Array.from(byDescriptor.values())
      .sort((left, right) => {
        if (left.descriptorName === right.descriptorName) {
          return left.sourceFile.localeCompare(right.sourceFile);
        }

        return left.descriptorName.localeCompare(right.descriptorName);
      })
      .map((entry) => ({
        descriptorName: entry.descriptorName,
        sourceFile: entry.sourceFile,
        bindingName: entry.bindingName,
        counts: entry.counts,
        byCategory: entry.byCategory,
        byCode: entry.byCode,
        codes: Array.from(entry.codes).sort((left, right) => left.localeCompare(right)),
      })),
  };
};

const withOptionalFilters = <T extends object>(
  value: T,
  filters: BarritsSelectionFilters | undefined,
): T & { filters?: BarritsSelectionFilters } => {
  if (!filters) {
    return value;
  }

  return {
    ...value,
    filters,
  };
};

/** [EN] Verifies and parses a JSON source into a validated BarritsBuildManifest.
 *  [ES] Verifica y parsea una fuente JSON en un BarritsBuildManifest validado. */
export const parseBuildManifest = (source: string): BarritsBuildManifest => {
  return parseBuildManifestPayload(source);
};

/**
 * [EN] Implementation of Parse watch snapshot.
 * [ES] Implementación de Parse watch snapshot.
 */
export const parseWatchSnapshot = (source: string): BarritsWatchSnapshot => {
  return parseWatchSnapshotPayload(source);
};

/** [EN] Asynchronously reads and validates a build manifest from the filesystem.
 *  [ES] Lee y valida asíncronamente un manifiesto de build desde el sistema de archivos. */
export const readBuildManifest = async (
  filePath: string,
  readTextFile: ReadTextFile,
): Promise<BarritsBuildManifest> => {
  return parseBuildManifest(await readTextFile(filePath));
};

/** [EN] Reads a manifest and returns a simplified summary for consumer usage.
 *  [ES] Lee un manifiesto y retorna un resumen simplificado para uso del consumidor. */
export const readBuildManifestSummary = async (
  filePath: string,
  readTextFile: ReadTextFile,
): Promise<BarritsConsumedStateSummary> => {
  return createBuildManifestSummary(await readBuildManifest(filePath, readTextFile));
};

/**
 * [EN] Implementation of Read watch snapshot.
 * [ES] Implementación de Read watch snapshot.
 */
export const readWatchSnapshot = async (
  filePath: string,
  readTextFile: ReadTextFile,
): Promise<BarritsWatchSnapshot> => {
  return parseWatchSnapshot(await readTextFile(filePath));
};

/**
 * [EN] Implementation of Read watch snapshot summary.
 * [ES] Implementación de Read watch snapshot summary.
 */
export const readWatchSnapshotSummary = async (
  filePath: string,
  readTextFile: ReadTextFile,
): Promise<BarritsConsumedStateSummary> => {
  return createWatchSnapshotSummary(await readWatchSnapshot(filePath, readTextFile));
};

/**
 * [EN] Implementation of Read language tool snapshot.
 * [ES] Implementación de Read language tool snapshot.
 */
export const readLanguageToolSnapshot = async (
  filePath: string,
  readTextFile: ReadTextFile,
): Promise<BarritsLanguageToolSnapshot> => {
  return createLanguageToolSnapshot(await readWatchSnapshot(filePath, readTextFile));
};

/** [EN] Transforms a raw manifest into a high-level summary of domains and traits.
 *  [ES] Transforma un manifiesto crudo en un resumen de alto nivel de dominios y traits. */
/**
 * [EN] Creates a summary of the build manifest for consumption by language tools.
 * [ES] Crea un resumen del manifiesto de construcción para su consumo por herramientas de lenguaje.
 * @param manifest - [EN] The build manifest to summarize. [ES] El manifiesto de construcción que se resumirá.
 * @returns [EN] A summary of the build manifest. [ES] Un resumen del manifiesto de construcción.
 */
export const createBuildManifestSummary = (
  manifest: BarritsBuildManifest | null,
): BarritsConsumedStateSummary => {
  if (!manifest) {
    return {
      generatedAt: null,
      strategy: "missing",
      domains: [],
      importStatements: [],
      traitDescriptors: [],
    };
  }

  return withOptionalFilters({
    generatedAt: manifest.generatedAt,
    strategy: manifest.strategy,
    domains: manifest.domains,
    importStatements: mapImportStatements(manifest.importActions),
    traitDescriptors: mapTraitDescriptors(manifest.traitDescriptors),
    traitDiagnostics: mapTraitDiagnostics(manifest.traitDiagnostics),
    traitDiagnosticAggregate: createTraitDiagnosticAggregate(manifest.traitDiagnostics),
    collisionsCount: manifest.collisions?.length ?? 0,
  }, manifest.filters);
};

/**
 * [EN] Implementation of Create watch snapshot summary.
 * [ES] Implementación de Create watch snapshot summary.
 */
export const createWatchSnapshotSummary = (
  snapshot: BarritsWatchSnapshot | null,
): BarritsConsumedStateSummary => {
  if (!snapshot) {
    return {
      generatedAt: null,
      strategy: "missing",
      domains: [],
      importStatements: [],
      traitDescriptors: [],
    };
  }

  return withOptionalFilters({
    generatedAt: snapshot.generatedAt,
    mode: snapshot.mode,
    strategy: snapshot.graph.strategy,
    domains: snapshot.graph.domains.map((domain) => domain.name),
    importStatements: mapImportStatements(snapshot.graph.importActions),
    traitDescriptors: mapTraitDescriptors(snapshot.graph.traitDescriptors),
    traitDiagnostics: mapTraitDiagnostics(snapshot.graph.traitDiagnostics),
    traitDiagnosticAggregate: createTraitDiagnosticAggregate(snapshot.graph.traitDiagnostics),
    collisionsCount: snapshot.graph.collisions?.length ?? 0,
  }, snapshot.filters);
};

/**
 * [EN] Implementation of Create language tool snapshot.
 * [ES] Implementación de Create language tool snapshot.
 */
export const createLanguageToolSnapshot = (
  snapshot: BarritsWatchSnapshot,
): BarritsLanguageToolSnapshot => {
  const traitDiagnosticAggregate = createTraitDiagnosticAggregate(snapshot.graph.traitDiagnostics) ?? {
    counts: createEmptyTraitDiagnosticCounts(),
    byCategory: createEmptyTraitDiagnosticCategoryCounts(),
    byCode: createEmptyTraitDiagnosticCodeCounts(),
    byDescriptor: [],
  };

  return withOptionalFilters({
    generatedAt: snapshot.generatedAt,
    mode: snapshot.mode,
    strategy: snapshot.graph.strategy,
    domains: snapshot.graph.domains.map((domain) => ({
      name: domain.name,
      filesCount: domain.files.length,
      exportNames: domain.files.flatMap((file) => file.exports.map((entry) => entry.name)),
    })),
    traitDescriptors: mapTraitDescriptors(snapshot.graph.traitDescriptors),
    traitDiagnostics: mapTraitDiagnostics(snapshot.graph.traitDiagnostics),
    traitDiagnosticAggregate,
    importActions: snapshot.graph.importActions,
    importStatements: mapImportStatements(snapshot.graph.importActions),
    collisions: snapshot.graph.collisions ?? [],
  }, snapshot.filters);
};

