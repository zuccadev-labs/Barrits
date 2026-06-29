import type { BarritsImportAction, BarritsSelectionFilters, BarritsTraitDiagnostic, BarritsTraitDiagnosticCode, BarritsConsumedTraitDescriptor } from "./contracts";
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
export declare const TRAIT_DIAGNOSTIC_CODES: ("trait-duplicate-name" | "trait-duplicate-provides" | "trait-conflicts-mismatch" | "trait-missing-consumed-capability" | "trait-consumes-mismatch" | "trait-missing-required-trait" | "trait-name-mismatch" | "trait-requires-conflict-overlap" | "trait-requires-mismatch" | "trait-self-requires" | "trait-self-conflict" | "trait-provides-mismatch" | "trait-state-mismatch" | "trait-unsupported-factory")[];
export declare const DISCOVERY_STRATEGIES: Set<string>;
export declare const FILE_MODES: Set<string>;
export declare const IMPORT_ACTION_KINDS: Set<import("./contracts").BarritsImportActionKind>;
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
type JsonRecord = Record<string, unknown>;
export declare const expectRecord: (value: unknown, payloadName: string, path: string) => JsonRecord;
export declare const expectString: (value: unknown, payloadName: string, path: string) => string;
export declare const expectNumber: (value: unknown, payloadName: string, path: string) => number;
export declare const expectStringArray: (value: unknown, payloadName: string, path: string) => string[];
export declare const expectOptionalString: (value: unknown, payloadName: string, path: string) => string | undefined;
export declare const expectEnumValue: <T extends string>(value: unknown, allowedValues: ReadonlySet<T>, payloadName: string, path: string, expected: string) => T;
export declare const expectOptionalArray: <T>(value: unknown, payloadName: string, path: string, mapEntry: (entry: unknown, index: number) => T) => T[] | undefined;
export declare const withOptionalProperty: <T extends object, K extends string, V>(value: T, key: K, optionalValue: V | undefined) => T & Partial<Record<K, V>>;
export declare const expectSelectionFilters: (value: unknown, payloadName: string, path: string) => BarritsSelectionFilters | undefined;
export declare const expectTraitDescriptor: (value: unknown, payloadName: string, path: string) => BarritsConsumedTraitDescriptor;
export declare const expectTraitDiagnostic: (value: unknown, payloadName: string, path: string) => BarritsTraitDiagnostic;
export declare const expectImportAction: (value: unknown, payloadName: string, path: string) => BarritsImportAction;
export declare const expectExportCollision: (value: unknown, payloadName: string, path: string) => {
    type: "project-project" | "project-library";
    namespace: string;
    exportName: string;
    projectSourceFile: string;
    conflictSourceFile: string;
    librarySourceFile?: string;
    message: string;
};
export declare const expectFileExport: (value: unknown, payloadName: string, path: string) => {
    name: string;
    accessPath: string;
    accessStrategy: string;
    kind: string;
    visibility: string;
};
export declare const expectFileIntegration: (value: unknown, payloadName: string, path: string) => {
    path: string;
    isIndex: boolean;
    kind: import("./contracts").BarritsFileKind;
    sourceLayer: string;
    exports: {
        name: string;
        accessPath: string;
        accessStrategy: string;
        kind: string;
        visibility: string;
    }[];
    traitDescriptors: BarritsConsumedTraitDescriptor[];
};
export declare const expectDomainIntegration: (value: unknown, payloadName: string, path: string) => {
    name: string;
    path: string;
    files: {
        path: string;
        isIndex: boolean;
        kind: import("./contracts").BarritsFileKind;
        sourceLayer: string;
        exports: {
            name: string;
            accessPath: string;
            accessStrategy: string;
            kind: string;
            visibility: string;
        }[];
        traitDescriptors: BarritsConsumedTraitDescriptor[];
    }[];
};
export declare const parseJsonSource: (source: string, payloadName: string) => JsonRecord;
export {};
