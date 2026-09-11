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

/**
 * [EN] Recomputes the SHA-256 seal of a build manifest and compares it with the stored checksum.
 * [ES] Recalcula el sello SHA-256 de un manifiesto de build y lo compara con el checksum almacenado.
 */
export { verifyBuildManifest } from "./sdk/manifest";

/**
 * [EN] Verifies a build manifest and throws when it was modified after generation.
 * [ES] Verifica un manifiesto de build y lanza cuando fue modificado tras su generación.
 */
export { assertBuildManifestIntegrity } from "./sdk/manifest";

/**
 * [EN] Computes the checksum of a manifest payload (useful to seal manifests produced by custom tooling).
 * [ES] Calcula el checksum de un payload de manifiesto (útil para sellar manifiestos producidos por herramientas propias).
 */
export { computeBuildManifestChecksum } from "./sdk/manifest";

/**
 * [EN] Integrity verification result and payload contract types.
 * [ES] Tipos del resultado de verificación de integridad y del contrato de payload.
 */
export type { BarritsBuildManifestIntegrity, BarritsBuildManifestPayload } from "./sdk/manifest";
