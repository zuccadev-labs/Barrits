/** [EN] Classification of entries in a filesystem layer. [ES] Clasificación de entradas en una capa de sistema de archivos. */
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

/** [EN] Strategy used to discover the Barrits project root and library directories.
 *  [ES] Estrategia utilizada para descubrir la raíz del proyecto Barrits y los directorios de la biblioteca. */
export type BarritsDiscoveryStrategy =
  | "current-directory"
  | "direct-child"
  | "recursive-child"
  | "ancestor-child";

/** [EN] Common infrastructure context shared across discovery, graph, and manifest.
 *  [ES] Contexto de infraestructura com\u00fan compartido entre el descubrimiento, el grafo y el manifiesto. */
export type BarritsBaseContext = {
  readonly projectRoot: string;
  readonly barritsDirectory: string;
  readonly barritsLibDirectory?: string;
  readonly strategy: BarritsDiscoveryStrategy;
  readonly discoveryRoots: readonly string[];
};

/** [EN] Result of a Barrits discovery process via AST or file-system patterns.
 *  [ES] Resultado de un proceso de descubrimiento de Barrits mediante patrones del sistema de archivos o AST. */
export type BarritsDiscovery = BarritsBaseContext;

/** [EN] Configuration options for the Barrits directory discovery service.
 *  [ES] Opciones de configuración para el servicio de descubrimiento de directorios Barrits. */
export type FindBarritsOptions = {
  /** [EN] Directory to start searching from. [ES] Directorio desde donde empezar la búsqueda. */
  readonly startDirectory?: string;
  /** [EN] Name of the target Barrits directory (default: "barrits"). [ES] Nombre del directorio Barrits objetivo. */
  readonly targetName?: string;
  /** [EN] Maximum depth for recursive search. [ES] Profundidad máxima para la búsqueda recursiva. */
  readonly maxDepth?: number;
  /** [EN] List of directories to ignore during search. [ES] Lista de directorios a ignorar durante la búsqueda. */
  readonly ignoredDirectories?: readonly string[];
};

/** [EN] Technical kind of an exported binding (constant, function, or re-export).
 *  [ES] Tipo técnico de un binding exportado (constante, función o re-exportación). */
export type BarritsExportKind = "const" | "function" | "reexport";

/** [EN] Strategy for accessing an export (via its name, filesystem path, or JSDoc alias).
 *  [ES] Estrategia para acceder a una exportación (vía su nombre, ruta de archivos o alias JSDoc). */
export type BarritsExportAccessStrategy = "export-name" | "file-system" | "jsdoc";

/** [EN] Source layer classification for a file (internal library vs project code).
 *  [ES] Clasificación de la capa de origen de un archivo (biblioteca interna vs código del proyecto). */
export type BarritsSourceLayer = "barrits" | "barrits_lib";

/** [EN] Architectural classification of a file within a Barrits domain.
 *  [ES] Clasificación arquitectónica de un archivo dentro de un dominio Barrits. */
export type BarritsFileKind = "barrel" | "internal" | "trait" | "shared" | "domain" | "sdk" | "root";

/** [EN] Visibility level of an export (publicly accessible vs internal to the domain).
 *  [ES] Nivel de visibilidad de una exportación (accesible públicamente vs interna al dominio). */
export type BarritsExportVisibility = "public" | "internal";

/** [EN] Metadata for an individual exported symbol within a file.
 *  [ES] Metadatos de un símbolo exportado individual dentro de un archivo. */
export type BarritsFileExport = {
  /** [EN] Exported name. [ES] Nombre exportado. */
  readonly name: string;
  /** [EN] Full access path for composition. [ES] Ruta de acceso completa para la composición. */
  readonly accessPath: string;
  /** [EN] How to resolve this export. [ES] Cómo resolver esta exportación. */
  readonly accessStrategy: BarritsExportAccessStrategy;
  /** [EN] Language level kind. [ES] Tipo a nivel de lenguaje. */
  readonly kind: BarritsExportKind;
  /** [EN] Architectural visibility. [ES] Visibilidad arquitectónica. */
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

/** [EN] Severity levels for trait diagnostics. [ES] Niveles de severidad para diagnósticos de traits. */
export type BarritsTraitDiagnosticSeverity = "warning" | "error";

/** [EN] Categories for architectural diagnostics. [ES] Categorías para diagnósticos arquitectónicos. */
export type BarritsTraitDiagnosticCategory = "drift" | "impossible" | "non-verifiable";

/**
 * [EN] Type definition for BarritsTraitDiagnosticCode.
 * [ES] Definición de tipo para BarritsTraitDiagnosticCode.
 */
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
  | "trait-required-conflicts"
  | "trait-unsupported-factory";

/** [EN] Individual diagnostic record for a trait discovery or validation failure.
 *  [ES] Registro de diagnóstico individual para un fallo de descubrimiento o validación de trait. */
export type BarritsTraitDiagnostic = {
  /** [EN] Standard error code. [ES] Código de error estándar. */
  readonly code: BarritsTraitDiagnosticCode;
  /** [EN] Architectural category. [ES] Categoría arquitectónica. */
  readonly category: BarritsTraitDiagnosticCategory;
  /** [EN] Issue severity. [ES] Severidad del problema. */
  readonly severity: BarritsTraitDiagnosticSeverity;
  /** [EN] Explanatory message. [ES] Mensaje explicativo. */
  readonly message: string;
  /** [EN] Path to the source file. [ES] Ruta al archivo fuente. */
  readonly sourceFile: string;
  /** [EN] Name of the target trait. [ES] Nombre del trait objetivo. */
  readonly descriptorName?: string;
  /** [EN] Binding identifier. [ES] Identificador del binding. */
  readonly bindingName?: string;
  /** [EN] Related capability name. [ES] Nombre de la capacidad relacionada. */
  readonly capabilityName?: string;
};

/** [EN] Summary counts for a set of diagnostics. [ES] Conteos resumidos para un conjunto de diagnósticos. */
export type BarritsTraitDiagnosticCounts = {
  readonly total: number;
  readonly errorCount: number;
  readonly warningCount: number;
};

/**
 * [EN] Type definition for BarritsTraitDiagnosticCategoryCounts.
 * [ES] Definición de tipo para BarritsTraitDiagnosticCategoryCounts.
 */
export type BarritsTraitDiagnosticCategoryCounts = Record<BarritsTraitDiagnosticCategory, number>;

/**
 * [EN] Type definition for BarritsTraitDiagnosticCodeCounts.
 * [ES] Definición de tipo para BarritsTraitDiagnosticCodeCounts.
 */
export type BarritsTraitDiagnosticCodeCounts = Record<BarritsTraitDiagnosticCode, number>;

/** [EN] Aggregated diagnostic metrics for a specific trait descriptor.
 *  [ES] Métricas de diagnóstico agregadas para un descriptor de trait específico. */
export type BarritsTraitDiagnosticDescriptorAggregate = {
  readonly descriptorName: string;
  readonly sourceFile: string;
  readonly bindingName?: string;
  readonly counts: BarritsTraitDiagnosticCounts;
  readonly byCategory: BarritsTraitDiagnosticCategoryCounts;
  readonly byCode: BarritsTraitDiagnosticCodeCounts;
  readonly codes: readonly BarritsTraitDiagnosticCode[];
};

/**
 * [EN] Type definition for BarritsTraitDiagnosticAggregate.
 * [ES] Definición de tipo para BarritsTraitDiagnosticAggregate.
 */
export type BarritsTraitDiagnosticAggregate = {
  readonly counts: BarritsTraitDiagnosticCounts;
  readonly byCategory: BarritsTraitDiagnosticCategoryCounts;
  readonly byCode: BarritsTraitDiagnosticCodeCounts;
  readonly byDescriptor: readonly BarritsTraitDiagnosticDescriptorAggregate[];
};

/**
 * [EN] Type definition for BarritsConsumedTraitDescriptor.
 * [ES] Definición de tipo para BarritsConsumedTraitDescriptor.
 */
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

/**
 * [EN] Type definition for BarritsFileIntegration.
 * [ES] Definición de tipo para BarritsFileIntegration.
 */
export type BarritsFileIntegration = {
  readonly path: string;
  readonly isIndex: boolean;
  readonly kind: BarritsFileKind;
  readonly sourceLayer: BarritsSourceLayer;
  readonly exports: readonly BarritsFileExport[];
  readonly traitDescriptors: readonly BarritsTraitDescriptorInspection[];
};

/** [EN] Integration of a domain within the Barrits project structure.
 *  [ES] Integración de un dominio dentro de la estructura del proyecto Barrits. */
export type BarritsDomainIntegration = {
  /** [EN] Domain identifier. [ES] Identificador del dominio. */
  readonly name: string;
  /** [EN] Logical path. [ES] Ruta lógica. */
  readonly path: string;
  /** [EN] Files belonging to this domain. [ES] Archivos pertenecientes a este dominio. */
  readonly files: readonly BarritsFileIntegration[];
};

/** [EN] Report of a naming collision between project and library exports.
 *  [ES] Informe de una colisión de nombres entre exportaciones del proyecto y la biblioteca. */
export type BarritsExportCollision = {
  /** [EN] Nature of the collision. [ES] Naturaleza de la colisión. */
  readonly type: "project-project" | "project-library";
  /** [EN] Namespace where the collision occurred. [ES] Espacio de nombres donde ocurrió la colisión. */
  readonly namespace: string;
  /** [EN] Conflicting export name. [ES] Nombre de exportación en conflicto. */
  readonly exportName: string;
  /** [EN] Primary source file. [ES] Archivo fuente primario. */
  readonly projectSourceFile: string;
  /** [EN] Conflicting source file. [ES] Archivo fuente en conflicto. */
  readonly conflictSourceFile: string;
  /** [EN] Library source if applicable. [ES] Fuente de la biblioteca si aplica. */
  readonly librarySourceFile?: string;
  /** [EN] Human readable collision message. [ES] Mensaje de colisión legible por humanos. */
  readonly message: string;
};

/** [EN] Full integration graph of a Barrits project, including domains, traits and collisions.
 *  [ES] Grafo de integración completo de un proyecto Barrits, incluyendo dominios, traits y colisiones. */
export type BarritsIntegrationGraph = BarritsBaseContext & {
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

/**
 * [EN] Type definition for BarritsImportActionKind.
 * [ES] Definición de tipo para BarritsImportActionKind.
 */
export type BarritsImportActionKind = "named-import" | "namespace-access" | "alias-namespace-access";

/**
 * [EN] Type definition for BarritsImportWriteMode.
 * [ES] Definición de tipo para BarritsImportWriteMode.
 */
export type BarritsImportWriteMode = BarritsImportActionKind;

/**
 * [EN] Type definition for BarritsImportFilters.
 * [ES] Definición de tipo para BarritsImportFilters.
 */
export type BarritsImportFilters = {
  readonly domains?: readonly string[];
  readonly exports?: readonly string[];
  readonly kinds?: readonly BarritsImportActionKind[];
};

/**
 * [EN] Type definition for BarritsGraphFilters.
 * [ES] Definición de tipo para BarritsGraphFilters.
 */
export type BarritsGraphFilters = {
  readonly domains?: readonly string[];
  readonly exports?: readonly string[];
  readonly fileKinds?: readonly BarritsFileKind[];
  readonly visibilities?: readonly BarritsExportVisibility[];
};

/**
 * [EN] Type definition for BarritsSelectionFilters.
 * [ES] Definición de tipo para BarritsSelectionFilters.
 */
export type BarritsSelectionFilters = BarritsGraphFilters & {
  readonly kinds?: readonly BarritsImportActionKind[];
};

/** [EN] Individual import action planned for proxy generation.
 *  [ES] Acción de importación individual planificada para la generación de proxies. */
export type BarritsImportAction = {
  /** [EN] Exported name. [ES] Nombre exportado. */
  readonly exportName: string;
  /** [EN] Domain name. [ES] Nombre del dominio. */
  readonly domain: string;
  /** [EN] Target source file. [ES] Archivo fuente objetivo. */
  readonly sourceFile: string;
  /** [EN] Action kind. [ES] Tipo de acción. */
  readonly kind: BarritsImportActionKind;
  /** [EN] Generated Typescript statement. [ES] Sentencia de Typescript generada. */
  readonly statement: string;
};

/** [EN] Sealed manifest representing the state of discovery at a specific point in time.
 *  [ES] Manifiesto sellado que representa el estado del descubrimiento en un punto específico en el tiempo. */
export type BarritsBuildManifest = {
  /** [EN] Generation timestamp. [ES] Marca de tiempo de generación. */
  readonly generatedAt: string;
  /** [EN] Integrity checksum. [ES] Checksum de integridad. */
  readonly checksum: string;
} & BarritsBaseContext & {
  readonly filesCount: number;
  readonly exportsCount: number;
  readonly publicExportsCount: number;
  readonly internalExportsCount: number;
  readonly barrelsCount: number;
  /** [EN] List of discovered domains. [ES] Lista de dominios descubiertos. */
  readonly domains: readonly string[];
  /** [EN] Flattened trait descriptors. [ES] Descriptores de traits aplanados. */
  readonly traitDescriptors: readonly BarritsConsumedTraitDescriptor[];
  /** [EN] Global diagnostics. [ES] Diagnósticos globales. */
  readonly traitDiagnostics: readonly BarritsTraitDiagnostic[];
  /** [EN] Planned actions. [ES] Acciones planificadas. */
  readonly importActions: readonly BarritsImportAction[];
  /** [EN] Unresolved collisions. [ES] Colisiones no resueltas. */
  readonly collisions: readonly BarritsExportCollision[];
  /** [EN] Active filters. [ES] Filtros activos. */
  readonly filters?: BarritsSelectionFilters;
};

/**
 * [EN] Type definition for BarritsWatchSnapshot.
 * [ES] Definición de tipo para BarritsWatchSnapshot.
 */
export type BarritsWatchSnapshot = {
  readonly generatedAt: string;
  readonly mode: "watch" | "dev";
  readonly graph: BarritsIntegrationGraph;
  readonly filters?: BarritsSelectionFilters;
};

/**
 * [EN] Type definition for BarritsConsumedStateSummary.
 * [ES] Definición de tipo para BarritsConsumedStateSummary.
 */
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

/**
 * [EN] Type definition for BarritsLanguageToolDomain.
 * [ES] Definición de tipo para BarritsLanguageToolDomain.
 */
export type BarritsLanguageToolDomain = {
  readonly name: string;
  readonly filesCount: number;
  readonly exportNames: readonly string[];
};

/**
 * [EN] Type definition for BarritsLanguageToolSnapshot.
 * [ES] Definición de tipo para BarritsLanguageToolSnapshot.
 */
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
