/**
 * @module
 * [EN] Typed manifest and snapshot consumption helpers for runtime tooling.
 * [ES] Ayudantes de consumo de manifiestos y snapshots tipados para herramientas de tiempo de ejecución.
 */

/**
 * [EN] All contract types used by the consume surface, re-exported for deno doc --lint compliance.
 * [ES] Todos los tipos de contrato utilizados por la superficie de consumo, re-exportados para conformidad con deno doc --lint.
 */
export type * from "./sdk/contracts";

/**
 * [EN] Parses a serialized build manifest into a typed payload.
 * [ES] Parsea un manifiesto de build serializado en una carga útil tipada.
 */
export { parseBuildManifest } from "./sdk/consume";

/**
 * [EN] Parses a serialized watch snapshot into a typed payload.
 * [ES] Parsea un snapshot de observación serializado en una carga útil tipada.
 */
export { parseWatchSnapshot } from "./sdk/consume";

/**
 * [EN] Reads a build manifest from disk with schema validation.
 * [ES] Lee un manifiesto de build desde el disco con validación de esquema.
 */
export { readBuildManifest } from "./sdk/consume";

/**
 * [EN] Reads and summarizes a build manifest for fast tooling consumption.
 * [ES] Lee y resume un manifiesto de build para un consumo rápido por herramientas.
 */
export { readBuildManifestSummary } from "./sdk/consume";

/**
 * [EN] Reads a watch snapshot from disk with schema validation.
 * [ES] Lee un snapshot de observación desde el disco con validación de esquema.
 */
export { readWatchSnapshot } from "./sdk/consume";

/**
 * [EN] Reads and summarizes a watch snapshot for runtime dashboards.
 * [ES] Lee y resume un snapshot de observación para tableros de tiempo de ejecución.
 */
export { readWatchSnapshotSummary } from "./sdk/consume";

/**
 * [EN] Reads language-tool snapshot payload used by editor integrations.
 * [ES] Lee la carga útil del snapshot de herramientas de lenguaje utilizada por integraciones de editores.
 */
export { readLanguageToolSnapshot } from "./sdk/consume";

/**
 * [EN] Creates a compact summary view from a build manifest payload.
 * [ES] Crea una vista de resumen compacta a partir de una carga útil de manifiesto de build.
 */
export { createBuildManifestSummary } from "./sdk/summarization";

/**
 * [EN] Creates a compact summary view from a watch snapshot payload.
 * [ES] Crea una vista de resumen compacta a partir de una carga útil de snapshot de observación.
 */
export { createWatchSnapshotSummary } from "./sdk/summarization";

/**
 * [EN] Creates an editor-focused snapshot model for tooling pipelines.
 * [ES] Crea un modelo de snapshot enfocado en el editor para pipelines de herramientas.
 */
export { createLanguageToolSnapshot } from "./sdk/summarization";
