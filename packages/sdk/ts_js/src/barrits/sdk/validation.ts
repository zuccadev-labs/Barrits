import type {
  BarritsImportAction,
  BarritsSelectionFilters,
  BarritsTraitDiagnostic,
  BarritsTraitDiagnosticCode,
  BarritsConsumedTraitDescriptor,
} from "./contracts";
import { isBarritsExportVisibility, isBarritsFileKind } from "./guards";

export type MutableTraitDiagnosticCounts = {
  total: number;
  errorCount: number;
  warningCount: number;
};

export type MutableTraitDiagnosticCategoryCounts = {
  drift: number;
  impossible: number;
  "non-verifiable": number;
};

export type MutableTraitDiagnosticCodeCounts = Record<BarritsTraitDiagnosticCode, number>;

export type MutableSelectionFilters = {
  domains?: string[];
  exports?: string[];
  fileKinds?: BarritsSelectionFilters["fileKinds"];
  visibilities?: BarritsSelectionFilters["visibilities"];
  kinds?: BarritsSelectionFilters["kinds"];
};

export const TRAIT_DIAGNOSTIC_CODES = [
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

export const DISCOVERY_STRATEGIES = new Set(["current-directory", "direct-child", "recursive-child", "ancestor-child"]);
export const FILE_MODES = new Set(["watch", "dev"]);
export const IMPORT_ACTION_KINDS = new Set<BarritsImportAction["kind"]>(["named-import", "namespace-access", "alias-namespace-access"]);
export const EXPORT_KINDS = new Set(["const", "function", "reexport"]);
export const SOURCE_LAYERS = new Set(["barrits", "barrits_lib"]);
export const BINDING_KINDS = new Set(["const", "function", "class"]);
export const TRAIT_FACTORIES = new Set(["createTraitDescriptor", "createTraitDescriptorFromJsDoc"]);
export const TRAIT_DIAGNOSTIC_SEVERITIES = new Set(["warning", "error"]);
export const TRAIT_DIAGNOSTIC_CATEGORIES = new Set(["drift", "impossible", "non-verifiable"]);
export const EXPORT_COLLISION_TYPES = new Set<"project-project" | "project-library">(["project-project", "project-library"]);
export const TRAIT_DIAGNOSTIC_CODE_SET = new Set<BarritsTraitDiagnosticCode>(TRAIT_DIAGNOSTIC_CODES);

export const createEmptyTraitDiagnosticCounts = (): MutableTraitDiagnosticCounts => ({
  total: 0,
  errorCount: 0,
  warningCount: 0,
});

export const createEmptyTraitDiagnosticCategoryCounts = (): MutableTraitDiagnosticCategoryCounts => ({
  drift: 0,
  impossible: 0,
  "non-verifiable": 0,
});

export const createEmptyTraitDiagnosticCodeCounts = (): MutableTraitDiagnosticCodeCounts => {
  return Object.fromEntries(
    TRAIT_DIAGNOSTIC_CODES.map((code) => [code, 0]),
  ) as MutableTraitDiagnosticCodeCounts;
};

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const createInvalidPayloadError = (payloadName: string, path: string, expected: string): TypeError => {
  return new TypeError(`Invalid ${payloadName} at ${path}: expected ${expected}.`);
};

export const expectRecord = (value: unknown, payloadName: string, path: string): JsonRecord => {
  if (!isJsonRecord(value)) {
    throw createInvalidPayloadError(payloadName, path, "object");
  }

  return value;
};

export const expectString = (value: unknown, payloadName: string, path: string): string => {
  if (typeof value !== "string") {
    throw createInvalidPayloadError(payloadName, path, "string");
  }

  return value;
};

export const expectNumber = (value: unknown, payloadName: string, path: string): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw createInvalidPayloadError(payloadName, path, "number");
  }

  return value;
};

export const expectStringArray = (value: unknown, payloadName: string, path: string): string[] => {
  if (!Array.isArray(value)) {
    throw createInvalidPayloadError(payloadName, path, "string[]");
  }

  return value.map((entry, index) => expectString(entry, payloadName, `${path}[${index}]`));
};

export const expectOptionalString = (value: unknown, payloadName: string, path: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, payloadName, path);
};

export const expectEnumValue = <T extends string>(
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

export const expectOptionalArray = <T>(
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

export const withOptionalProperty = <T extends object, K extends string, V>(
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

export const expectSelectionFilters = (
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

export const expectTraitDescriptor = (
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

export const expectTraitDiagnostic = (
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

export const expectImportAction = (value: unknown, payloadName: string, path: string): BarritsImportAction => {
  const record = expectRecord(value, payloadName, path);

  return {
    exportName: expectString(record.exportName, payloadName, `${path}.exportName`),
    domain: expectString(record.domain, payloadName, `${path}.domain`),
    sourceFile: expectString(record.sourceFile, payloadName, `${path}.sourceFile`),
    kind: expectEnumValue(record.kind, IMPORT_ACTION_KINDS, payloadName, `${path}.kind`, "valid BarritsImportActionKind"),
    statement: expectString(record.statement, payloadName, `${path}.statement`),
  };
};

export const expectExportCollision = (
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

export const expectFileExport = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);

  return {
    name: expectString(record.name, payloadName, `${path}.name`),
    accessPath: expectString(record.accessPath, payloadName, `${path}.accessPath`),
    accessStrategy: expectEnumValue(record.accessStrategy, new Set(["export-name", "file-system", "jsdoc"]), payloadName, `${path}.accessStrategy`, "valid BarritsExportAccessStrategy"),
    kind: expectEnumValue(record.kind, EXPORT_KINDS, payloadName, `${path}.kind`, "valid BarritsExportKind"),
    visibility: expectString(record.visibility, payloadName, `${path}.visibility`),
  };
};

export const expectFileIntegration = (value: unknown, payloadName: string, path: string) => {
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

export const expectDomainIntegration = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);

  return {
    name: expectString(record.name, payloadName, `${path}.name`),
    path: expectString(record.path, payloadName, `${path}.path`),
    files: expectOptionalArray(record.files, payloadName, `${path}.files`, (entry, index) =>
      expectFileIntegration(entry, payloadName, `${path}.files[${index}]`),
    ) ?? [],
  };
};

export const parseJsonSource = (source: string, payloadName: string): JsonRecord => {
  const MAX_JSON_SIZE = 10 * 1024 * 1024;
  if (source.length > MAX_JSON_SIZE) {
    throw new Error(
      `JSON payload "${payloadName}" exceeds maximum size of ${MAX_JSON_SIZE} bytes (received ${source.length} bytes)`,
    );
  }

  const parsed = JSON.parse(source) as unknown;
  return expectRecord(parsed, payloadName, "$root");
};
