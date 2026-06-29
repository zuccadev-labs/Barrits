/**
 * @module
 * [EN] JSON schema validation primitives for build manifests and watch snapshots.
 * [ES] Primitivas de validación de esquemas JSON para manifiestos de compilación y snapshots de observación.
 */
import type {
  BarritsImportAction,
  BarritsSelectionFilters,
  BarritsTraitDiagnostic,
  BarritsTraitDiagnosticCode,
  BarritsConsumedTraitDescriptor,
} from "./contracts";
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
export declare const TRAIT_DIAGNOSTIC_CODES: readonly BarritsTraitDiagnosticCode[];
export declare const DISCOVERY_STRATEGIES: Set<string>;
export declare const FILE_MODES: Set<string>;
export declare const IMPORT_ACTION_KINDS: Set<BarritsImportAction["kind"]>;
export declare const EXPORT_KINDS: Set<string>;
export declare const SOURCE_LAYERS: Set<string>;
export declare const BINDING_KINDS: Set<string>;
export declare const TRAIT_FACTORIES: Set<string>;
export declare const TRAIT_DIAGNOSTIC_SEVERITIES: Set<string>;
export declare const TRAIT_DIAGNOSTIC_CATEGORIES: Set<string>;
export declare const EXPORT_COLLISION_TYPES: Set<"project-project" | "project-library">;
export declare const TRAIT_DIAGNOSTIC_CODE_SET: Set<BarritsTraitDiagnosticCode>;
export declare const createEmptyTraitDiagnosticCounts: () => MutableTraitDiagnosticCounts;
export declare const createEmptyTraitDiagnosticCategoryCounts: () => MutableTraitDiagnosticCategoryCounts;
export declare const createEmptyTraitDiagnosticCodeCounts: () => MutableTraitDiagnosticCodeCounts;
export declare const expectRecord: (value: unknown, payloadName: string, path: string) => Record<string, unknown>;
export declare const expectString: (value: unknown, payloadName: string, path: string) => string;
export declare const expectNumber: (value: unknown, payloadName: string, path: string) => number;
export declare const expectStringArray: (value: unknown, payloadName: string, path: string) => string[];
export declare const expectOptionalString: (value: unknown, payloadName: string, path: string) => string | undefined;
export declare const expectEnumValue: <T extends string>(
  value: unknown,
  allowedValues: ReadonlySet<T>,
  payloadName: string,
  path: string,
  expected: string,
) => T;
export declare const expectOptionalArray: <T>(
  value: unknown,
  payloadName: string,
  path: string,
  mapEntry: (entry: unknown, index: number) => T,
) => T[] | undefined;
export declare const withOptionalProperty: <T extends object, K extends string, V>(
  value: T,
  key: K,
  optionalValue: V | undefined,
) => T & Partial<Record<K, V>>;
export declare const expectSelectionFilters: (value: unknown, payloadName: string, path: string) => BarritsSelectionFilters | undefined;
export declare const expectTraitDescriptor: (value: unknown, payloadName: string, path: string) => BarritsConsumedTraitDescriptor;
export declare const expectTraitDiagnostic: (value: unknown, payloadName: string, path: string) => BarritsTraitDiagnostic;
export declare const expectImportAction: (value: unknown, payloadName: string, path: string) => BarritsImportAction;
export declare const expectExportCollision: (
  value: unknown,
  payloadName: string,
  path: string,
) => {
  type: "project-project" | "project-library";
  namespace: string;
  exportName: string;
  projectSourceFile: string;
  conflictSourceFile: string;
  librarySourceFile?: string;
  message: string;
};
export declare const expectFileExport: (
  value: unknown,
  payloadName: string,
  path: string,
) => { name: string; accessPath: string; accessStrategy: string; kind: string; visibility: string };
export declare const expectFileIntegration: (
  value: unknown,
  payloadName: string,
  path: string,
) => { path: string; isIndex: boolean; kind: string; sourceLayer: string; exports: Array<unknown>; traitDescriptors: Array<unknown> };
export declare const expectDomainIntegration: (
  value: unknown,
  payloadName: string,
  path: string,
) => { name: string; path: string; files: Array<unknown> };
export declare const parseJsonSource: (source: string, payloadName: string) => Record<string, unknown>;
export {};
