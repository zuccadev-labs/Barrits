/** [EN] Classification of entries in a filesystem layer. [ES] Clasificación de entradas en una capa de sistema de archivos. */
export type RuntimeFileSystemEntryType = "file" | "directory";

/** [EN] Entry metadata for a runtime filesystem.
 *  [ES] Metadatos de entrada para un sistema de archivos en runtime. */
export type RuntimeFileSystemEntry = {
  /** [EN] Name. [ES] Nombre. */
  readonly name: string;
  /** [EN] Type. [ES] Tipo. */
  readonly type: RuntimeFileSystemEntryType;
};

/** [EN] Deterministic adapter for filesystem operations across different runtimes.
 *  [ES] Adaptador determinístico para operaciones de archivos en diferentes runtimes. */
export type RuntimeFileSystemAdapter = {
  /** [EN] Returns current working directory. [ES] Devuelve el directorio de trabajo actual. */
  cwd: () => string | Promise<string>;
  /** [EN] Checks if a directory exists at the given path. [ES] Comprueba si existe un directorio en la ruta dada. */
  directoryExists: (path: string) => Promise<boolean>;
  /** [EN] Lists subdirectories in the given path. [ES] Lista los subdirectorios en la ruta dada. */
  listDirectories: (path: string) => Promise<string[]>;
  /** [EN] Lists all entries in the given path. [ES] Lista todas las entradas en la ruta dada. */
  listEntries: (path: string) => Promise<RuntimeFileSystemEntry[]>;
  /** [EN] Reads a text file at the given path. [ES] Lee un archivo de texto en la ruta dada. */
  readTextFile: (path: string) => Promise<string>;
};

/** [EN] Strategy used to discover the Barrits project root and library directories.
 *  [ES] Estrategia utilizada para descubrir la raíz del proyecto Barrits y los directorios de la biblioteca. */
export type BarritsDiscoveryStrategy = "current-directory" | "direct-child" | "recursive-child" | "ancestor-child";

/** [EN] Common infrastructure context shared across discovery, graph, and manifest.
 *  [ES] Contexto de infraestructura com\u00fan compartido entre el descubrimiento, el grafo y el manifiesto. */
export type BarritsBaseContext = {
  /** [EN] Project root directory. [ES] Directorio raíz del proyecto. */
  readonly projectRoot: string;
  /** [EN] Barrits directory path. [ES] Ruta del directorio Barrits. */
  readonly barritsDirectory: string;
  /** [EN] Barrits library directory (optional). [ES] Directorio de la biblioteca Barrits (opcional). */
  readonly barritsLibDirectory?: string;
  /** [EN] Discovery strategy used. [ES] Estrategia de descubrimiento utilizada. */
  readonly strategy: BarritsDiscoveryStrategy;
  /** [EN] Roots scanned for discovery. [ES] Raíces escaneadas para el descubrimiento. */
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
  /** [EN] Unique trait name. [ES] Nombre único del trait. */
  readonly name: string;
  /** [EN] Source file path. [ES] Ruta del archivo fuente. */
  readonly sourceFile: string;
  /** [EN] Exported binding name. [ES] Nombre del binding exportado. */
  readonly bindingName: string;
  /** [EN] Kind of binding. [ES] Tipo de binding. */
  readonly bindingKind: "const" | "function" | "class";
  /** [EN] Factory method used for discovery. [ES] Método de factoría utilizado para el descubrimiento. */
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  /** [EN] Brief summary. [ES] Breve resumen. */
  readonly summary?: string;
  /** [EN] Required trait dependencies. [ES] Dependencias de trait requeridas. */
  readonly requires: readonly string[];
  /** [EN] Conflicting trait names. [ES] Nombres de traits en conflicto. */
  readonly conflicts: readonly string[];
  /** [EN] State keys provided. [ES] Claves de estado proporcionadas. */
  readonly state: readonly string[];
  /** [EN] Capabilities consumed. [ES] Capacidades consumidas. */
  readonly consumes: readonly string[];
  /** [EN] Capabilities provided. [ES] Capacidades proporcionadas. */
  readonly provides: readonly string[];
  /** [EN] Organizational tags. [ES] Etiquetas organizativas. */
  readonly tags: readonly string[];
  /** [EN] Target runtimes. [ES] Tiempos de ejecución objetivo. */
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
  /** [EN] Total count of diagnostics. [ES] Conteo total de diagnósticos. */
  readonly total: number;
  /** [EN] Number of error-level diagnostics. [ES] Número de diagnósticos de nivel error. */
  readonly errorCount: number;
  /** [EN] Number of warning-level diagnostics. [ES] Número de diagnósticos de nivel warning. */
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
  /** [EN] Name of the target descriptor. [ES] Nombre del descriptor objetivo. */
  readonly descriptorName: string;
  /** [EN] Source file path. [ES] Ruta del archivo fuente. */
  readonly sourceFile: string;
  /** [EN] Binding identifier (optional). [ES] Identificador del binding (opcional). */
  readonly bindingName?: string;
  /** [EN] Summary counts. [ES] Conteos resumidos. */
  readonly counts: BarritsTraitDiagnosticCounts;
  /** [EN] Counts grouped by category. [ES] Conteos agrupados por categoría. */
  readonly byCategory: BarritsTraitDiagnosticCategoryCounts;
  /** [EN] Counts grouped by code. [ES] Conteos agrupados por código. */
  readonly byCode: BarritsTraitDiagnosticCodeCounts;
  /** [EN] List of diagnostic codes present. [ES] Lista de códigos de diagnóstico presentes. */
  readonly codes: readonly BarritsTraitDiagnosticCode[];
};

/**
 * [EN] Type definition for BarritsTraitDiagnosticAggregate.
 * [ES] Definición de tipo para BarritsTraitDiagnosticAggregate.
 */
export type BarritsTraitDiagnosticAggregate = {
  /** [EN] Summary counts. [ES] Conteos resumidos. */
  readonly counts: BarritsTraitDiagnosticCounts;
  /** [EN] Counts grouped by category. [ES] Conteos agrupados por categoría. */
  readonly byCategory: BarritsTraitDiagnosticCategoryCounts;
  /** [EN] Counts grouped by code. [ES] Conteos agrupados por código. */
  readonly byCode: BarritsTraitDiagnosticCodeCounts;
  /** [EN] Per-descriptor aggregates. [ES] Agregados por descriptor. */
  readonly byDescriptor: readonly BarritsTraitDiagnosticDescriptorAggregate[];
};

/**
 * [EN] Type definition for BarritsConsumedTraitDescriptor.
 * [ES] Definición de tipo para BarritsConsumedTraitDescriptor.
 */
export type BarritsConsumedTraitDescriptor = {
  /** [EN] Unique trait name. [ES] Nombre único del trait. */
  readonly name: string;
  /** [EN] Source file path. [ES] Ruta del archivo fuente. */
  readonly sourceFile: string;
  /** [EN] Exported binding name. [ES] Nombre del binding exportado. */
  readonly bindingName: string;
  /** [EN] Kind of binding. [ES] Tipo de binding. */
  readonly bindingKind: "const" | "function" | "class";
  /** [EN] Factory method used for discovery. [ES] Método de factoría utilizado para el descubrimiento. */
  readonly factory?: "createTraitDescriptor" | "createTraitDescriptorFromJsDoc";
  /** [EN] Brief summary. [ES] Breve resumen. */
  readonly summary?: string;
  /** [EN] Required trait dependencies. [ES] Dependencias de trait requeridas. */
  readonly requires: readonly string[];
  /** [EN] Conflicting trait names. [ES] Nombres de traits en conflicto. */
  readonly conflicts: readonly string[];
  /** [EN] State keys provided. [ES] Claves de estado proporcionadas. */
  readonly state: readonly string[];
  /** [EN] Capabilities consumed. [ES] Capacidades consumidas. */
  readonly consumes: readonly string[];
  /** [EN] Capabilities provided. [ES] Capacidades proporcionadas. */
  readonly provides: readonly string[];
  /** [EN] Organizational tags. [ES] Etiquetas organizativas. */
  readonly tags: readonly string[];
  /** [EN] Target runtimes. [ES] Tiempos de ejecución objetivo. */
  readonly runtimes: readonly string[];
};

/**
 * [EN] Type definition for BarritsFileIntegration.
 * [ES] Definición de tipo para BarritsFileIntegration.
 */
export type BarritsFileIntegration = {
  /** [EN] File path relative to project root. [ES] Ruta del archivo relativa a la raíz del proyecto. */
  readonly path: string;
  /** [EN] Whether the file is a barrel index file. [ES] Indica si el archivo es un barrel index. */
  readonly isIndex: boolean;
  /** [EN] Architectural classification of the file. [ES] Clasificación arquitectónica del archivo. */
  readonly kind: BarritsFileKind;
  /** [EN] Source layer (library vs project code). [ES] Capa de origen (biblioteca vs código del proyecto). */
  readonly sourceLayer: BarritsSourceLayer;
  /** [EN] List of exported symbols. [ES] Lista de símbolos exportados. */
  readonly exports: readonly BarritsFileExport[];
  /** [EN] Trait descriptors declared in this file. [ES] Descriptores de trait declarados en este archivo. */
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
  /** [EN] Root files. [ES] Raíz archivos. */
  readonly rootFiles: readonly BarritsFileIntegration[];
  /** [EN] Domains. [ES] Dominios. */
  readonly domains: readonly BarritsDomainIntegration[];
  /** [EN] Library root files. [ES] Library raíz archivos. */
  readonly libraryRootFiles: readonly BarritsFileIntegration[];
  /** [EN] Library domains. [ES] Library dominios. */
  readonly libraryDomains: readonly BarritsDomainIntegration[];
  /** [EN] Files count. [ES] Archivos conteo. */
  readonly filesCount: number;
  /** [EN] Exports count. [ES] Exportaciones conteo. */
  readonly exportsCount: number;
  /** [EN] Public exports count. [ES] Public exportaciones conteo. */
  readonly publicExportsCount: number;
  /** [EN] Internal exports count. [ES] Internal exportaciones conteo. */
  readonly internalExportsCount: number;
  /** [EN] Barrels count. [ES] Barrels conteo. */
  readonly barrelsCount: number;
  /** [EN] Trait descriptors. [ES] Trait descriptor. */
  readonly traitDescriptors: readonly BarritsTraitDescriptorInspection[];
  /** [EN] Trait diagnostics. [ES] Trait diagnostics. */
  readonly traitDiagnostics: readonly BarritsTraitDiagnostic[];
  /** [EN] Import actions. [ES] Importación actions. */
  readonly importActions: readonly BarritsImportAction[];
  /** [EN] Collisions. [ES] Collisions. */
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
  /** [EN] Filter by domain names. [ES] Filtrar por nombres de dominio. */
  readonly domains?: readonly string[];
  /** [EN] Filter by export names. [ES] Filtrar por nombres de exportación. */
  readonly exports?: readonly string[];
  /** [EN] Filter by import action kinds. [ES] Filtrar por tipos de acción de importación. */
  readonly kinds?: readonly BarritsImportActionKind[];
};

/**
 * [EN] Type definition for BarritsGraphFilters.
 * [ES] Definición de tipo para BarritsGraphFilters.
 */
export type BarritsGraphFilters = {
  /** [EN] Filter by domain names. [ES] Filtrar por nombres de dominio. */
  readonly domains?: readonly string[];
  /** [EN] Filter by export names. [ES] Filtrar por nombres de exportación. */
  readonly exports?: readonly string[];
  /** [EN] Filter by file architectural kinds. [ES] Filtrar por tipos arquitectónicos de archivo. */
  readonly fileKinds?: readonly BarritsFileKind[];
  /** [EN] Filter by export visibility level. [ES] Filtrar por nivel de visibilidad de exportación. */
  readonly visibilities?: readonly BarritsExportVisibility[];
};

/**
 * [EN] Type definition for BarritsSelectionFilters.
 * [ES] Definición de tipo para BarritsSelectionFilters.
 */
export type BarritsSelectionFilters = BarritsGraphFilters & {
  /** [EN] Kinds. [ES] Tipos. */
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
    /** [EN] Files count. [ES] Archivos conteo. */
    readonly filesCount: number;
    /** [EN] Exports count. [ES] Exportaciones conteo. */
    readonly exportsCount: number;
    /** [EN] Public exports count. [ES] Public exportaciones conteo. */
    readonly publicExportsCount: number;
    /** [EN] Internal exports count. [ES] Internal exportaciones conteo. */
    readonly internalExportsCount: number;
    /** [EN] Barrels count. [ES] Barrels conteo. */
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
  /** [EN] Generation timestamp. [ES] Marca de tiempo de generación. */
  readonly generatedAt: string;
  /** [EN] Watch mode. [ES] Modo de observación. */
  readonly mode: "watch" | "dev";
  /** [EN] Full integration graph snapshot. [ES] Snapshot completo del grafo de integración. */
  readonly graph: BarritsIntegrationGraph;
  /** [EN] Active selection filters. [ES] Filtros de selección activos. */
  readonly filters?: BarritsSelectionFilters;
};

/**
 * [EN] Type definition for BarritsConsumedStateSummary.
 * [ES] Definición de tipo para BarritsConsumedStateSummary.
 */
export type BarritsConsumedStateSummary = {
  /** [EN] Generation timestamp (null if not yet generated). [ES] Marca de tiempo de generación (null si no generado). */
  readonly generatedAt: string | null;
  /** [EN] Operational mode. [ES] Modo operativo. */
  readonly mode?: "watch" | "dev";
  /** [EN] Discovery strategy used. [ES] Estrategia de descubrimiento utilizada. */
  readonly strategy: string;
  /** [EN] Discovered domain names. [ES] Nombres de dominio descubiertos. */
  readonly domains: readonly string[];
  /** [EN] Generated import statements for proxy consumption. [ES] Sentencias de importación generadas para consumo de proxy. */
  readonly importStatements: readonly string[];
  /** [EN] Consumed trait descriptors. [ES] Descriptores de traits consumidos. */
  readonly traitDescriptors: readonly BarritsConsumedTraitDescriptor[];
  /** [EN] Global diagnostics (optional). [ES] Diagnósticos globales (opcional). */
  readonly traitDiagnostics?: readonly BarritsTraitDiagnostic[];
  /** [EN] Aggregated diagnostic metrics (optional). [ES] Métricas de diagnóstico agregadas (opcional). */
  readonly traitDiagnosticAggregate?: BarritsTraitDiagnosticAggregate;
  /** [EN] Count of unresolved export collisions. [ES] Conteo de colisiones de exportación no resueltas. */
  readonly collisionsCount?: number;
  /** [EN] Active selection filters. [ES] Filtros de selección activos. */
  readonly filters?: BarritsSelectionFilters;
};

/**
 * [EN] Type definition for BarritsLanguageToolDomain.
 * [ES] Definición de tipo para BarritsLanguageToolDomain.
 */
export type BarritsLanguageToolDomain = {
  /** [EN] Domain name. [ES] Nombre del dominio. */
  readonly name: string;
  /** [EN] Number of files in the domain. [ES] Número de archivos en el dominio. */
  readonly filesCount: number;
  /** [EN] Names of exported symbols. [ES] Nombres de los símbolos exportados. */
  readonly exportNames: readonly string[];
};

/**
 * [EN] Type definition for BarritsLanguageToolSnapshot.
 * [ES] Definición de tipo para BarritsLanguageToolSnapshot.
 */
export type BarritsLanguageToolSnapshot = {
  /** [EN] Generation timestamp. [ES] Marca de tiempo de generación. */
  readonly generatedAt: string;
  /** [EN] Operational mode. [ES] Modo operativo. */
  readonly mode: "watch" | "dev";
  /** [EN] Discovery strategy used. [ES] Estrategia de descubrimiento utilizada. */
  readonly strategy: string;
  /** [EN] Domain entries in the snapshot. [ES] Entradas de dominio en el snapshot. */
  readonly domains: readonly BarritsLanguageToolDomain[];
  /** [EN] Consumed trait descriptors. [ES] Descriptores de traits consumidos. */
  readonly traitDescriptors: readonly BarritsConsumedTraitDescriptor[];
  /** [EN] Global diagnostics. [ES] Diagnósticos globales. */
  readonly traitDiagnostics: readonly BarritsTraitDiagnostic[];
  /** [EN] Aggregated diagnostic metrics. [ES] Métricas de diagnóstico agregadas. */
  readonly traitDiagnosticAggregate: BarritsTraitDiagnosticAggregate;
  /** [EN] Planned import actions. [ES] Acciones de importación planificadas. */
  readonly importActions: readonly BarritsImportAction[];
  /** [EN] Generated import statements. [ES] Sentencias de importación generadas. */
  readonly importStatements: readonly string[];
  /** [EN] Unresolved export collisions. [ES] Colisiones de exportación no resueltas. */
  readonly collisions: readonly BarritsExportCollision[];
  /** [EN] Active selection filters. [ES] Filtros de selección activos. */
  readonly filters?: BarritsSelectionFilters;
};
