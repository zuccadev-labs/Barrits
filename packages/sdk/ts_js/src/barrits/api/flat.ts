/**
 * @module
 * [EN] Flat public API surface that re-exports the package-first symbols used by consumers.
 * [ES] Superficie de API pública plana que re-exporta los símbolos del enfoque "package-first" utilizados por los consumidores.
 */

/**
 * [EN] Path route builders and parsers for operational path handling.
 * [ES] Constructores y parsers de rutas para el manejo operativo de caminos (paths).
 */
export { buildPath, parsePath } from "../routes";

/**
 * [EN] Build and watch manifest readers/summaries for automation tooling.
 * [ES] Lectores y resúmenes de manifiestos de build y watch para herramientas de automatización.
 */
export {
  createBuildManifestSummary,
  createLanguageToolSnapshot,
  createWatchSnapshotSummary,
  parseBuildManifest,
  parseWatchSnapshot,
} from "../consume";

/**
 * [EN] Trait composition and descriptor authoring helpers.
 * [ES] Ayudantes para la autoría de descriptores y composición de traits.
 */
export {
  composePipeline,
  composeTraitDescriptors,
  createTraitDescriptor,
  createTraitDescriptorFromJsDoc,
  mergeTraits,
  parseTraitDescriptorJsDoc,
} from "../traits";

/**
 * [EN] The whole standard library (algorithm families, strings, hashing, validation, datetime, resilience,
 * arithmetic) plus the `logic` and `logicFamilies` namespace objects, re-exported from `../logic`.
 * [ES] Toda la librería estándar (familias de algoritmos, strings, hashing, validación, fechas, resiliencia,
 * aritmética) más los objetos de espacio de nombres `logic` y `logicFamilies`, re-exportados desde `../logic`.
 */
export * from "../logic";

/**
 * [EN] Shared package naming constants used in generated imports and tooling.
 * [ES] Constantes compartidas de nombres de paquetes utilizadas en importaciones generadas y herramientas.
 */
export { PACKAGE_ALIAS, PACKAGE_NAME } from "../shared";

/**
 * [EN] Primitive and shared runtime types used across helper APIs.
 * [ES] Tipos primitivos y de tiempo de ejecución compartidos utilizados en las APIs auxiliares.
 */
export type { NumberInput, PathParts, RuntimeName, UnaryFunction } from "../shared";

/**
 * [EN] Trait descriptor and composition type contracts for advanced typing scenarios.
 * [ES] Contratos de tipo para descriptores de trait y composición para escenarios de tipado avanzado.
 */
export type {
  ComposedTraitDescriptorsResult,
  ComposeTraitDescriptorsOptions,
  TraitConflictStrategy,
  TraitDescriptor,
  TraitDescriptorContext,
  TraitDescriptorFromJsDocInput,
  TraitDescriptorInput,
  TraitDescriptorJsDocMetadata,
  TraitDescriptorMetadata,
} from "../traits";

/**
 * [EN] SDK discovery, graph, import, and manifest contracts exposed to tooling integrators.
 * [ES] Contratos de descubrimiento, grafos, importaciones y manifiestos de SDK expuestos a integradores de herramientas.
 */
export type {
  BarritsDiscovery,
  BarritsDiscoveryStrategy,
  BarritsBuildManifest,
  BarritsConsumedStateSummary,
  BarritsDomainIntegration,
  BarritsExportCollision,
  BarritsExportKind,
  BarritsExportVisibility,
  BarritsFileExport,
  BarritsFileKind,
  BarritsFileIntegration,
  BarritsGraphFilters,
  BarritsIntegrationGraph,
  BarritsImportAction,
  BarritsImportActionKind,
  BarritsSourceLayer,
  BarritsSelectionFilters,
  BarritsLanguageToolDomain,
  BarritsLanguageToolSnapshot,
  BarritsWatchSnapshot,
  FindBarritsOptions,
  RuntimeFileSystemAdapter,
  RuntimeFileSystemEntry,
  RuntimeFileSystemEntryType,
} from "../sdk";
