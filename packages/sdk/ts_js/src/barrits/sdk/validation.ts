import type {
  BarritsImportAction,
  BarritsSelectionFilters,
  BarritsTraitDiagnostic,
  BarritsTraitDiagnosticCode,
  BarritsConsumedTraitDescriptor,
} from "./contracts";
import { isBarritsExportVisibility, isBarritsFileKind } from "./guards";

/** [EN] Mutable aggregate counts for trait diagnostics (total, errors, warnings). [ES] Conteos agregados mutables para diagnósticos de traits (total, errores, advertencias). */
export type MutableTraitDiagnosticCounts = {
  /** [EN] Total. [ES] Total. */
  total: number;
  /** [EN] Error count. [ES] Error conteo. */
  errorCount: number;
  /** [EN] Warning count. [ES] Advertencia conteo. */
  warningCount: number;
};

/** [EN] Mutable counts per trait diagnostic category (drift, impossible, non-verifiable). [ES] Conteos mutables por categoría de diagnóstico de traits (drift, impossible, non-verifiable). */
export type MutableTraitDiagnosticCategoryCounts = {
  /** [EN] Drift. [ES] Drift. */
  drift: number;
  /** [EN] Impossible. [ES] Impossible. */
  impossible: number;
  /** [EN] "non verifiable". [ES] "non verifiable". */
  "non-verifiable": number;
};

/** [EN] Mutable counts per trait diagnostic code for aggregate tracking. [ES] Conteos mutables por código de diagnóstico de traits para seguimiento agregado. */
export type MutableTraitDiagnosticCodeCounts = Record<BarritsTraitDiagnosticCode, number>;

/** [EN] Mutable variant of BarritsSelectionFilters used during config parsing and merging. [ES] Variante mutable de BarritsSelectionFilters utilizada durante el análisis y la fusión de configuraciones. */
export type MutableSelectionFilters = {
  /** [EN] Domains. [ES] Dominios. */
  domains?: string[];
  /** [EN] Exports. [ES] Exportaciones. */
  exports?: string[];
  /** [EN] File kinds. [ES] Archivo tipos. */
  fileKinds?: BarritsSelectionFilters["fileKinds"];
  /** [EN] Visibilities. [ES] Visibilidades. */
  visibilities?: BarritsSelectionFilters["visibilities"];
  /** [EN] Kinds. [ES] Tipos. */
  kinds?: BarritsSelectionFilters["kinds"];
};

/**
 * [EN] Complete list of recognized trait diagnostic codes used for validation.
 * [ES] Lista completa de códigos de diagnóstico de traits reconocidos utilizados para la validación.
 */
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

/** [EN] Valid discovery strategies for locating the barrits directory. [ES] Estrategias de descubrimiento válidas para localizar el directorio barrits. */
export const DISCOVERY_STRATEGIES = new Set(["current-directory", "direct-child", "recursive-child", "ancestor-child"]);
/** [EN] Valid file modes for watch and dev commands. [ES] Modos de archivo válidos para los comandos watch y dev. */
export const FILE_MODES = new Set(["watch", "dev"]);
/** [EN] Valid kinds of import actions the SDK can generate. [ES] Tipos válidos de acciones de importación que el SDK puede generar. */
export const IMPORT_ACTION_KINDS = new Set<BarritsImportAction["kind"]>(["named-import", "namespace-access", "alias-namespace-access"]);
/** [EN] Valid export kinds for file export entries. [ES] Tipos de exportación válidos para entradas de exportación de archivos. */
export const EXPORT_KINDS = new Set(["const", "function", "reexport"]);
/** [EN] Valid source layers that can own exported symbols. [ES] Capas de origen válidas que pueden poseer símbolos exportados. */
export const SOURCE_LAYERS = new Set(["barrits", "barrits_lib"]);
/** [EN] Valid binding kinds for trait descriptors. [ES] Tipos de binding válidos para descriptores de traits. */
export const BINDING_KINDS = new Set(["const", "function", "class"]);
/** [EN] Valid factory functions for creating trait descriptors. [ES] Funciones de fábrica válidas para crear descriptores de traits. */
export const TRAIT_FACTORIES = new Set(["createTraitDescriptor", "createTraitDescriptorFromJsDoc"]);
/** [EN] Valid trait diagnostic severity levels. [ES] Niveles de severidad de diagnóstico de traits válidos. */
export const TRAIT_DIAGNOSTIC_SEVERITIES = new Set(["warning", "error"]);
/** [EN] Valid trait diagnostic categories. [ES] Categorías de diagnóstico de traits válidas. */
export const TRAIT_DIAGNOSTIC_CATEGORIES = new Set(["drift", "impossible", "non-verifiable"]);
/** [EN] Valid types of export collisions detected during graph analysis. [ES] Tipos válidos de colisiones de exportación detectadas durante el análisis de grafos. */
export const EXPORT_COLLISION_TYPES = new Set<"project-project" | "project-library">(["project-project", "project-library"]);
/** [EN] Set of all recognized trait diagnostic codes for O(1) membership checks. [ES] Conjunto de todos los códigos de diagnóstico de traits reconocidos para comprobaciones de pertenencia O(1). */
export const TRAIT_DIAGNOSTIC_CODE_SET = new Set<BarritsTraitDiagnosticCode>(TRAIT_DIAGNOSTIC_CODES);

/**
 * [EN] Creates a zero-initialized mutable trait diagnostic counts object.
 * [ES] Crea un objeto mutable de conteos de diagnósticos de traits inicializado en cero.
 */
export const createEmptyTraitDiagnosticCounts = (): MutableTraitDiagnosticCounts => ({
  total: 0,
  errorCount: 0,
  warningCount: 0,
});

/**
 * [EN] Creates a zero-initialized mutable trait diagnostic category counts object.
 * [ES] Crea un objeto mutable de conteos por categoría de diagnósticos de traits inicializado en cero.
 */
export const createEmptyTraitDiagnosticCategoryCounts = (): MutableTraitDiagnosticCategoryCounts => ({
  drift: 0,
  impossible: 0,
  "non-verifiable": 0,
});

/**
 * [EN] Creates a zero-initialized mutable trait diagnostic code counts map.
 * [ES] Crea un mapa mutable de conteos por código de diagnósticos de traits inicializado en cero.
 */
export const createEmptyTraitDiagnosticCodeCounts = (): MutableTraitDiagnosticCodeCounts => {
  return Object.fromEntries(TRAIT_DIAGNOSTIC_CODES.map((code) => [code, 0])) as MutableTraitDiagnosticCodeCounts;
};

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const createInvalidPayloadError = (payloadName: string, path: string, expected: string): TypeError => {
  return new TypeError(`Invalid ${payloadName} at ${path}: expected ${expected}.`);
};

/**
 * [EN] Validates that a value is a non-null, non-array object (Record) and returns it.
 * [ES] Valida que un valor sea un objeto no nulo y no array (Record) y lo retorna.
 */
export const expectRecord = (value: unknown, payloadName: string, path: string): JsonRecord => {
  if (!isJsonRecord(value)) {
    throw createInvalidPayloadError(payloadName, path, "object");
  }

  return value;
};

/**
 * [EN] Validates that a value is a string and returns it.
 * [ES] Valida que un valor sea un string y lo retorna.
 */
export const expectString = (value: unknown, payloadName: string, path: string): string => {
  if (typeof value !== "string") {
    throw createInvalidPayloadError(payloadName, path, "string");
  }

  return value;
};

/**
 * [EN] Validates that a value is a finite number and returns it.
 * [ES] Valida que un valor sea un número finito y lo retorna.
 */
export const expectNumber = (value: unknown, payloadName: string, path: string): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw createInvalidPayloadError(payloadName, path, "number");
  }

  return value;
};

/**
 * [EN] Validates that a value is an array of strings, validating each element.
 * [ES] Valida que un valor sea un array de strings, validando cada elemento.
 */
export const expectStringArray = (value: unknown, payloadName: string, path: string): string[] => {
  if (!Array.isArray(value)) {
    throw createInvalidPayloadError(payloadName, path, "string[]");
  }

  return value.map((entry, index) => expectString(entry, payloadName, `${path}[${index}]`));
};

/**
 * [EN] Validates that a value is a string or undefined and returns it.
 * [ES] Valida que un valor sea un string o undefined y lo retorna.
 */
export const expectOptionalString = (value: unknown, payloadName: string, path: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, payloadName, path);
};

/**
 * [EN] Validates that a value belongs to an allowed set of enum strings.
 * [ES] Valida que un valor pertenezca a un conjunto permitido de strings de enumeración.
 */
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

/**
 * [EN] Validates an optional value is an array, mapping each element through a validator.
 * [ES] Valida que un valor opcional sea un array, mapeando cada elemento a través de un validador.
 */
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

/**
 * [EN] Conditionally adds an optional property to an object if the value is defined.
 * [ES] Añade condicionalmente una propiedad opcional a un objeto si el valor está definido.
 */
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

/**
 * [EN] Validates and parses a BarritsSelectionFilters object from an unknown JSON value.
 * [ES] Valida y analiza un objeto BarritsSelectionFilters desde un valor JSON desconocido.
 */
export const expectSelectionFilters = (value: unknown, payloadName: string, path: string): BarritsSelectionFilters | undefined => {
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

/**
 * [EN] Validates and parses a BarritsConsumedTraitDescriptor from an unknown JSON value.
 * [ES] Valida y analiza un BarritsConsumedTraitDescriptor desde un valor JSON desconocido.
 */
export const expectTraitDescriptor = (value: unknown, payloadName: string, path: string): BarritsConsumedTraitDescriptor => {
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
    withOptionalProperty(descriptor, "summary", expectOptionalString(record.summary, payloadName, `${path}.summary`)),
    "factory",
    record.factory === undefined
      ? undefined
      : expectEnumValue(record.factory, TRAIT_FACTORIES, payloadName, `${path}.factory`, "valid trait factory"),
  ) as BarritsConsumedTraitDescriptor;
};

/**
 * [EN] Validates and parses a BarritsTraitDiagnostic from an unknown JSON value.
 * [ES] Valida y analiza un BarritsTraitDiagnostic desde un valor JSON desconocido.
 */
export const expectTraitDiagnostic = (value: unknown, payloadName: string, path: string): BarritsTraitDiagnostic => {
  const record = expectRecord(value, payloadName, path);

  const diagnostic = {
    code: expectEnumValue(record.code, TRAIT_DIAGNOSTIC_CODE_SET, payloadName, `${path}.code`, "valid BarritsTraitDiagnosticCode"),
    category: expectEnumValue(
      record.category,
      TRAIT_DIAGNOSTIC_CATEGORIES,
      payloadName,
      `${path}.category`,
      "valid BarritsTraitDiagnosticCategory",
    ),
    severity: expectEnumValue(
      record.severity,
      TRAIT_DIAGNOSTIC_SEVERITIES,
      payloadName,
      `${path}.severity`,
      "valid BarritsTraitDiagnosticSeverity",
    ),
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

/**
 * [EN] Validates and parses a BarritsImportAction from an unknown JSON value.
 * [ES] Valida y analiza un BarritsImportAction desde un valor JSON desconocido.
 */
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

/**
 * [EN] Validates and parses an export collision object from an unknown JSON value.
 * [ES] Valida y analiza un objeto de colisión de exportación desde un valor JSON desconocido.
 */
export const expectExportCollision = (
  value: unknown,
  payloadName: string,
  path: string,
): {
  type: "project-project" | "project-library";
  namespace: string;
  exportName: string;
  projectSourceFile: string;
  conflictSourceFile: string;
  librarySourceFile?: string;
  message: string;
} => {
  const record = expectRecord(value, payloadName, path);

  return withOptionalProperty(
    {
      type: expectEnumValue(record.type, EXPORT_COLLISION_TYPES, payloadName, `${path}.type`, "valid collision type"),
      namespace: expectString(record.namespace, payloadName, `${path}.namespace`),
      exportName: expectString(record.exportName, payloadName, `${path}.exportName`),
      projectSourceFile: expectString(record.projectSourceFile, payloadName, `${path}.projectSourceFile`),
      conflictSourceFile: expectString(record.conflictSourceFile, payloadName, `${path}.conflictSourceFile`),
      message: expectString(record.message, payloadName, `${path}.message`),
    },
    "librarySourceFile",
    expectOptionalString(record.librarySourceFile, payloadName, `${path}.librarySourceFile`),
  );
};

/**
 * [EN] Validates and parses a file export entry from an unknown JSON value.
 * [ES] Valida y analiza una entrada de exportación de archivo desde un valor JSON desconocido.
 */
export const expectFileExport = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);

  return {
    name: expectString(record.name, payloadName, `${path}.name`),
    accessPath: expectString(record.accessPath, payloadName, `${path}.accessPath`),
    accessStrategy: expectEnumValue(
      record.accessStrategy,
      new Set(["export-name", "file-system", "jsdoc"]),
      payloadName,
      `${path}.accessStrategy`,
      "valid BarritsExportAccessStrategy",
    ),
    kind: expectEnumValue(record.kind, EXPORT_KINDS, payloadName, `${path}.kind`, "valid BarritsExportKind"),
    visibility: expectString(record.visibility, payloadName, `${path}.visibility`),
  };
};

/**
 * [EN] Validates and parses a file integration entry from an unknown JSON value.
 * [ES] Valida y analiza una entrada de integración de archivo desde un valor JSON desconocido.
 */
export const expectFileIntegration = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);
  const visibilityEntries =
    expectOptionalArray(record.exports, payloadName, `${path}.exports`, (entry, index) =>
      expectFileExport(entry, payloadName, `${path}.exports[${index}]`),
    ) ?? [];

  visibilityEntries.forEach((entry, index) => {
    if (!isBarritsExportVisibility(entry.visibility)) {
      throw createInvalidPayloadError(payloadName, `${path}.exports[${index}].visibility`, "valid BarritsExportVisibility");
    }
  });

  return {
    path: expectString(record.path, payloadName, `${path}.path`),
    isIndex:
      typeof record.isIndex === "boolean"
        ? record.isIndex
        : (() => {
            throw createInvalidPayloadError(payloadName, `${path}.isIndex`, "boolean");
          })(),
    kind: (() => {
      const value = expectString(record.kind, payloadName, `${path}.kind`);
      if (!isBarritsFileKind(value)) {
        throw createInvalidPayloadError(payloadName, `${path}.kind`, "valid BarritsFileKind");
      }
      return value;
    })(),
    sourceLayer: expectEnumValue(record.sourceLayer, SOURCE_LAYERS, payloadName, `${path}.sourceLayer`, "valid BarritsSourceLayer"),
    exports: visibilityEntries,
    traitDescriptors:
      expectOptionalArray(record.traitDescriptors, payloadName, `${path}.traitDescriptors`, (entry, index) =>
        expectTraitDescriptor(entry, payloadName, `${path}.traitDescriptors[${index}]`),
      ) ?? [],
  };
};

/**
 * [EN] Validates and parses a domain integration entry from an unknown JSON value.
 * [ES] Valida y analiza una entrada de integración de dominio desde un valor JSON desconocido.
 */
export const expectDomainIntegration = (value: unknown, payloadName: string, path: string) => {
  const record = expectRecord(value, payloadName, path);

  return {
    name: expectString(record.name, payloadName, `${path}.name`),
    path: expectString(record.path, payloadName, `${path}.path`),
    files:
      expectOptionalArray(record.files, payloadName, `${path}.files`, (entry, index) =>
        expectFileIntegration(entry, payloadName, `${path}.files[${index}]`),
      ) ?? [],
  };
};

/**
 * [EN] Parses a JSON string into a validated Record, with size limits and error boundaries.
 * [ES] Analiza una cadena JSON en un Record validado, con límites de tamaño y límites de error.
 */
export const parseJsonSource = (source: string, payloadName: string): JsonRecord => {
  const MAX_JSON_SIZE = 10 * 1024 * 1024;
  if (source.length > MAX_JSON_SIZE) {
    throw new Error(`JSON payload "${payloadName}" exceeds maximum size of ${MAX_JSON_SIZE} bytes (received ${source.length} bytes)`);
  }

  const parsed = JSON.parse(source) as unknown;
  return expectRecord(parsed, payloadName, "$root");
};
