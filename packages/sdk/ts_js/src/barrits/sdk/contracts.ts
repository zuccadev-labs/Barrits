export type RuntimeFileSystemEntryType = "file" | "directory";

/** [EN] Entry metadata for a runtime filesystem.
 *  [ES] Metadatos de entrada para un sistema de archivos en runtime. */
export type RuntimeFileSystemEntry = {
  readonly name: string;
  readonly type: RuntimeFileSystemEntryType;
};

/** [EN] Deterministic adapter for filesystem operations across different runtimes.
 *  [ES] Adaptador determinístico para operaciones de archivos en diferentes runtimes. */
export type RuntimeFileSystemAdapter = {
  cwd: () => string | Promise<string>;
  directoryExists: (path: string) => Promise<boolean>;
  listDirectories: (path: string) => Promise<string[]>;
  listEntries: (path: string) => Promise<RuntimeFileSystemEntry[]>;
  readTextFile: (path: string) => Promise<string>;
};

export type BarritsDiscoveryStrategy =
  | "current-directory"
  | "direct-child"
  | "recursive-child"
  | "ancestor-child";

/** [EN] Result of a Barrits discovery process via AST or file-system patterns.
 *  [ES] Resultado de un proceso de descubrimiento de Barrits mediante patrones del sistema de archivos o AST. */
export type BarritsDiscovery = {
  readonly projectRoot: string;
  readonly barritsDirectory: string;
  readonly barritsLibDirectory?: string;
  readonly strategy: BarritsDiscoveryStrategy;
};

export type FindBarritsOptions = {
  readonly startDirectory?: string;
  readonly targetName?: string;
  readonly maxDepth?: number;
  readonly ignoredDirectories?: readonly string[];
};

export type BarritsExportKind = "const" | "function" | "reexport";

export type BarritsExportAccessStrategy = "export-name" | "file-system" | "jsdoc";

export type BarritsSourceLayer = "barrits" | "barrits_lib";

export type BarritsFileKind = "barrel" | "internal" | "trait" | "shared" | "domain" | "sdk" | "root";

export type BarritsExportVisibility = "public" | "internal";

export type BarritsFileExport = {
  readonly name: string;
  readonly accessPath: string;
  readonly accessStrategy: BarritsExportAccessStrategy;
  readonly kind: BarritsExportKind;
  readonly visibility: BarritsExportVisibility;
};

/** [EN] Static inspection data for a Barrits Trait descriptor.
 *  [ES] Datos de inspección estática para un descriptor de Trait de Barrits. */
export type BarritsTraitDescriptorInspection = {
  readonly name: string;
  readonly sourceFile: string;
  readonly bindingName: string;
  readonly bindingKind: "const" | "function" | "class";
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  readonly summary?: string;
  readonly requires: readonly string[];
  readonly conflicts: readonly string[];
  readonly state: readonly string[];
  readonly consumes: readonly string[];
  readonly provides: readonly string[];
  readonly tags: readonly string[];
  readonly runtimes: readonly string[];
};

export type BarritsTraitDiagnosticSeverity = "warning" | "error";

export type BarritsTraitDiagnosticCategory = "drift" | "impossible" | "non-verifiable";

export type BarritsTraitDiagnosticCode =
  | "trait-duplicate-name"
  | "trait-duplicate-provides"
  | "trait-conflicts-mismatch"
  | "trait-missing-consumed-capability"
  | "trait-consumes-mismatch"
  | "trait-missing-required-trait"
  | "trait-name-mismatch"
  | "trait-requires-conflict-overlap"
  | "trait-requires-mismatch"
  | "trait-self-requires"
  | "trait-self-conflict"
  | "trait-provides-mismatch"
  | "trait-state-mismatch"
  | "trait-unsupported-factory";

export type BarritsTraitDiagnostic = {
  readonly code: BarritsTraitDiagnosticCode;
  readonly category: BarritsTraitDiagnosticCategory;
  readonly severity: BarritsTraitDiagnosticSeverity;
  readonly message: string;
  readonly sourceFile: string;
  readonly descriptorName?: string;
  readonly bindingName?: string;
  readonly capabilityName?: string;
};

export type BarritsTraitDiagnosticCounts = {
  readonly total: number;
  readonly errorCount: number;
  readonly warningCount: number;
};

export type BarritsTraitDiagnosticCategoryCounts = Record<BarritsTraitDiagnosticCategory, number>;

export type BarritsTraitDiagnosticCodeCounts = Record<BarritsTraitDiagnosticCode, number>;

export type BarritsTraitDiagnosticDescriptorAggregate = {
  readonly descriptorName: string;
  readonly sourceFile: string;
  readonly bindingName?: string;
  readonly counts: BarritsTraitDiagnosticCounts;
  readonly byCategory: BarritsTraitDiagnosticCategoryCounts;
  readonly byCode: BarritsTraitDiagnosticCodeCounts;
  readonly codes: readonly BarritsTraitDiagnosticCode[];
};

export type BarritsTraitDiagnosticAggregate = {
  readonly counts: BarritsTraitDiagnosticCounts;
  readonly byCategory: BarritsTraitDiagnosticCategoryCounts;
  readonly byCode: BarritsTraitDiagnosticCodeCounts;
  readonly byDescriptor: readonly BarritsTraitDiagnosticDescriptorAggregate[];
};

export type BarritsConsumedTraitDescriptor = {
  readonly name: string;
  readonly sourceFile: string;
  readonly bindingName: string;
  readonly bindingKind: "const" | "function" | "class";
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  readonly summary?: string;
  readonly requires: readonly string[];
  readonly conflicts: readonly string[];
  readonly state: readonly string[];
  readonly consumes: readonly string[];
  readonly provides: readonly string[];
  readonly tags: readonly string[];
  readonly runtimes: readonly string[];
};

export type BarritsFileIntegration = {
  readonly path: string;
  readonly isIndex: boolean;
  readonly kind: BarritsFileKind;
  readonly sourceLayer: BarritsSourceLayer;
  readonly exports: readonly BarritsFileExport[];
  readonly traitDescriptors: readonly BarritsTraitDescriptorInspection[];
};

export type BarritsDomainIntegration = {
  readonly name: string;
  readonly path: string;
  readonly files: readonly BarritsFileIntegration[];
};

export type BarritsExportCollision = {
  readonly type: "project-project" | "project-library";
  readonly namespace: string;
  readonly exportName: string;
  readonly projectSourceFile: string;
  readonly conflictSourceFile: string;
  readonly librarySourceFile?: string;
  readonly message: string;
};

/** [EN] Full integration graph of a Barrits project, including domains, traits and collisions.
 *  [ES] Grafo de integración completo de un proyecto Barrits, incluyendo dominios, traits y colisiones. */
export type BarritsIntegrationGraph = {
  readonly barritsDirectory: string;
  readonly barritsLibDirectory?: string;
  readonly projectRoot: string;
  readonly strategy: BarritsDiscoveryStrategy;
  readonly rootFiles: readonly BarritsFileIntegration[];
  readonly domains: readonly BarritsDomainIntegration[];
  readonly libraryRootFiles: readonly BarritsFileIntegration[];
  readonly libraryDomains: readonly BarritsDomainIntegration[];
  readonly filesCount: number;
  readonly exportsCount: number;
  readonly publicExportsCount: number;
  readonly internalExportsCount: number;
  readonly barrelsCount: number;
  readonly traitDescriptors: readonly BarritsTraitDescriptorInspection[];
  readonly traitDiagnostics: readonly BarritsTraitDiagnostic[];
  readonly importActions: readonly BarritsImportAction[];
  readonly collisions: readonly BarritsExportCollision[];
};

export type BarritsImportActionKind = "named-import" | "namespace-access" | "alias-namespace-access";

export type BarritsImportWriteMode = BarritsImportActionKind;

export type BarritsImportFilters = {
  readonly domains?: readonly string[];
  readonly exports?: readonly string[];
  readonly kinds?: readonly BarritsImportActionKind[];
};

export type BarritsGraphFilters = {
  readonly domains?: readonly string[];
  readonly exports?: readonly string[];
  readonly fileKinds?: readonly BarritsFileKind[];
  readonly visibilities?: readonly BarritsExportVisibility[];
};

export type BarritsSelectionFilters = BarritsGraphFilters & {
  readonly kinds?: readonly BarritsImportActionKind[];
};

export type BarritsImportAction = {
  readonly exportName: string;
  readonly domain: string;
  readonly sourceFile: string;
  readonly kind: BarritsImportActionKind;
  readonly statement: string;
};

/** [EN] Sealed manifest representing the state of discovery at a specific point in time.
 *  [ES] Manifiesto sellado que representa el estado del descubrimiento en un punto específico en el tiempo. */
export type BarritsBuildManifest = {
  readonly generatedAt: string;
  readonly checksum: string;
  readonly projectRoot: string;
  readonly barritsDirectory: string;
  readonly barritsLibDirectory?: string;
  readonly strategy: BarritsDiscoveryStrategy;
  readonly filesCount: number;
  readonly exportsCount: number;
  readonly publicExportsCount: number;
  readonly internalExportsCount: number;
  readonly barrelsCount: number;
  readonly domains: readonly string[];
  readonly traitDescriptors: readonly BarritsConsumedTraitDescriptor[];
  readonly traitDiagnostics: readonly BarritsTraitDiagnostic[];
  readonly importActions: readonly BarritsImportAction[];
  readonly collisions: readonly BarritsExportCollision[];
  readonly filters?: BarritsSelectionFilters;
};

export type BarritsWatchSnapshot = {
  readonly generatedAt: string;
  readonly mode: "watch" | "dev";
  readonly graph: BarritsIntegrationGraph;
  readonly filters?: BarritsSelectionFilters;
};

export type BarritsConsumedStateSummary = {
  readonly generatedAt: string | null;
  readonly mode?: "watch" | "dev";
  readonly strategy: string;
  readonly domains: readonly string[];
  readonly importStatements: readonly string[];
  readonly traitDescriptors: readonly BarritsConsumedTraitDescriptor[];
  readonly traitDiagnostics?: readonly BarritsTraitDiagnostic[];
  readonly traitDiagnosticAggregate?: BarritsTraitDiagnosticAggregate;
  readonly collisionsCount?: number;
  readonly filters?: BarritsSelectionFilters;
};

export type BarritsLanguageToolDomain = {
  readonly name: string;
  readonly filesCount: number;
  readonly exportNames: readonly string[];
};

export type BarritsLanguageToolSnapshot = {
  readonly generatedAt: string;
  readonly mode: "watch" | "dev";
  readonly strategy: string;
  readonly domains: readonly BarritsLanguageToolDomain[];
  readonly traitDescriptors: readonly BarritsConsumedTraitDescriptor[];
  readonly traitDiagnostics: readonly BarritsTraitDiagnostic[];
  readonly traitDiagnosticAggregate: BarritsTraitDiagnosticAggregate;
  readonly importActions: readonly BarritsImportAction[];
  readonly importStatements: readonly string[];
  readonly collisions: readonly BarritsExportCollision[];
  readonly filters?: BarritsSelectionFilters;
};