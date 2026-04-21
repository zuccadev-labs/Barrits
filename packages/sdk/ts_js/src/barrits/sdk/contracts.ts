export type RuntimeFileSystemEntryType = "file" | "directory";

export type RuntimeFileSystemEntry = {
  readonly name: string;
  readonly type: RuntimeFileSystemEntryType;
};

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