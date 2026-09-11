/**
 * @module
 * [EN] Manifest creation, integrity sealing and serialization utilities for Barrits.
 * [ES] Utilidades de creación, sellado de integridad y serialización de manifiestos para Barrits.
 */
import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsSelectionFilters, BarritsWatchSnapshot } from "./contracts";
import { filterImportActions } from "./imports";
import { filterIntegrationGraph } from "./query";
import { deterministicStringify } from "../../barrits_lib/logic/hashing/deterministic-stringify";
import { sha256Hex } from "../../barrits_lib/logic/hashing/sha256-hex";

/**
 * [EN] Prefix that identifies the checksum algorithm and payload contract of a build manifest.
 * [ES] Prefijo que identifica el algoritmo de checksum y el contrato de payload de un manifiesto de build.
 */
export const BUILD_MANIFEST_CHECKSUM_PREFIX = "sha256-barrits-";

/**
 * [EN] Manifest fields covered by the integrity checksum (everything except the seal itself and the timestamp).
 * [ES] Campos del manifiesto cubiertos por el checksum de integridad (todo salvo el propio sello y la marca de tiempo).
 */
export type BarritsBuildManifestPayload = Omit<BarritsBuildManifest, "checksum" | "generatedAt">;

/**
 * [EN] Outcome of a build manifest integrity verification.
 * [ES] Resultado de una verificación de integridad de manifiesto de build.
 */
export type BarritsBuildManifestIntegrity = {
  /** [EN] Whether the stored checksum matches the recomputed one. [ES] Si el checksum almacenado coincide con el recalculado. */
  readonly valid: boolean;
  /** [EN] Checksum recomputed from the manifest content. [ES] Checksum recalculado a partir del contenido del manifiesto. */
  readonly expected: string;
  /** [EN] Checksum stored in the manifest. [ES] Checksum almacenado en el manifiesto. */
  readonly actual: string;
};

const hasSelectionFilters = (filters: BarritsSelectionFilters | undefined): filters is BarritsSelectionFilters => {
  if (!filters) {
    return false;
  }
  return (
    (filters.domains?.length ?? 0) > 0 ||
    (filters.exports?.length ?? 0) > 0 ||
    (filters.fileKinds?.length ?? 0) > 0 ||
    (filters.visibilities?.length ?? 0) > 0 ||
    (filters.kinds?.length ?? 0) > 0
  );
};

/**
 * [EN] Projects an integration graph through selection filters (files, exports, domains) and import-action filters.
 * [ES] Proyecta un grafo de integración a través de filtros de selección (archivos, exports, dominios) y de acciones de importación.
 *
 * @param graph - [EN] Full integration graph. [ES] Grafo de integración completo.
 * @param filters - [EN] Selection filters; empty means identity. [ES] Filtros de selección; vacío equivale a identidad.
 * @returns [EN] A new graph restricted to the selection. [ES] Un nuevo grafo restringido a la selección.
 */
export const createProjectedGraph = (graph: BarritsIntegrationGraph, filters: BarritsSelectionFilters = {}): BarritsIntegrationGraph => {
  const filteredGraph = filterIntegrationGraph(graph, filters);

  return filterImportActions(filteredGraph, {
    domains: filters.domains,
    exports: filters.exports,
    kinds: filters.kinds,
  });
};

const toChecksumPayload = (
  manifest: BarritsBuildManifestPayload & Partial<Pick<BarritsBuildManifest, "checksum" | "generatedAt">>,
): BarritsBuildManifestPayload => {
  const { checksum: _checksum, generatedAt: _generatedAt, ...payload } = manifest;
  return payload;
};

/**
 * [EN] Computes the integrity checksum of a build manifest: SHA-256 over the deterministic JSON serialization
 * (recursively sorted keys, code-unit order) of every field except `checksum` and `generatedAt`. Two manifests
 * with identical content therefore share a checksum regardless of when or where they were generated.
 * [ES] Calcula el checksum de integridad de un manifiesto de build: SHA-256 sobre la serialización JSON determinista
 * (claves ordenadas recursivamente por code unit) de todos los campos salvo `checksum` y `generatedAt`. Dos manifiestos
 * con contenido idéntico comparten checksum independientemente de cuándo o dónde se generaron.
 *
 * @param manifest - [EN] Manifest payload (the seal and timestamp are ignored when present). [ES] Payload del manifiesto (el sello y la marca de tiempo se ignoran si están presentes).
 * @returns [EN] Checksum prefixed with `sha256-barrits-`. [ES] Checksum con el prefijo `sha256-barrits-`.
 */
export const computeBuildManifestChecksum = async (
  manifest: BarritsBuildManifestPayload & Partial<Pick<BarritsBuildManifest, "checksum" | "generatedAt">>,
): Promise<string> => {
  const digest = await sha256Hex(deterministicStringify(toChecksumPayload(manifest)));
  return `${BUILD_MANIFEST_CHECKSUM_PREFIX}${digest}`;
};

/**
 * [EN] Recomputes the checksum of a manifest and compares it with the stored seal.
 * [ES] Recalcula el checksum de un manifiesto y lo compara con el sello almacenado.
 *
 * @param manifest - [EN] Parsed build manifest. [ES] Manifiesto de build parseado.
 * @returns [EN] Verification outcome with both checksums. [ES] Resultado de la verificación con ambos checksums.
 */
export const verifyBuildManifest = async (manifest: BarritsBuildManifest): Promise<BarritsBuildManifestIntegrity> => {
  const expected = await computeBuildManifestChecksum(manifest);

  return {
    valid: expected === manifest.checksum,
    expected,
    actual: manifest.checksum,
  };
};

/**
 * [EN] Verifies a manifest and throws when its content no longer matches the stored checksum.
 * [ES] Verifica un manifiesto y lanza cuando su contenido ya no coincide con el checksum almacenado.
 *
 * @param manifest - [EN] Parsed build manifest. [ES] Manifiesto de build parseado.
 * @returns [EN] The same manifest when the seal is valid. [ES] El mismo manifiesto cuando el sello es válido.
 * @throws Error - [EN] When the manifest was modified after generation or sealed by an incompatible version. [ES] Cuando el manifiesto fue modificado tras generarse o sellado por una versión incompatible.
 */
export const assertBuildManifestIntegrity = async (manifest: BarritsBuildManifest): Promise<BarritsBuildManifest> => {
  const integrity = await verifyBuildManifest(manifest);

  if (!integrity.valid) {
    throw new Error(
      `Build manifest integrity check failed: expected ${integrity.expected} but found ${integrity.actual}. The manifest was modified after generation or was sealed by an incompatible Barrits version.`,
    );
  }

  return manifest;
};

/**
 * [EN] Builds a sealed manifest from an integration graph: files and domains are flattened, trait descriptors and
 * import actions are sorted, selection filters are recorded when present, and the checksum covers the whole payload.
 * [ES] Construye un manifiesto sellado a partir de un grafo de integración: archivos y dominios se aplanan, descriptores
 * de traits y acciones de importación se ordenan, los filtros de selección se registran si existen y el checksum cubre
 * todo el payload.
 *
 * @param graph - [EN] Integration graph (usually already projected). [ES] Grafo de integración (normalmente ya proyectado).
 * @param filters - [EN] Selection filters applied to the graph. [ES] Filtros de selección aplicados al grafo.
 * @returns [EN] Sealed build manifest. [ES] Manifiesto de build sellado.
 */
export const createBuildManifest = async (
  graph: BarritsIntegrationGraph,
  filters?: BarritsSelectionFilters,
): Promise<BarritsBuildManifest> => {
  const { rootFiles: _rootFiles, domains, libraryRootFiles: _libraryRootFiles, libraryDomains: _libraryDomains, ...base } = graph;

  const payload: BarritsBuildManifestPayload = {
    ...base,
    domains: domains.map((domain) => domain.name),
    traitDescriptors: [...graph.traitDescriptors].sort((left, right) => left.name.localeCompare(right.name)),
    traitDiagnostics: graph.traitDiagnostics,
    importActions: [...graph.importActions].sort((left, right) => left.exportName.localeCompare(right.exportName)),
    collisions: graph.collisions,
    ...(hasSelectionFilters(filters) ? { filters } : {}),
  };

  return {
    generatedAt: new Date().toISOString(),
    checksum: await computeBuildManifestChecksum(payload),
    ...payload,
  };
};

/**
 * [EN] Serializes a sealed build manifest as pretty-printed JSON.
 * [ES] Serializa un manifiesto de build sellado como JSON con formato legible.
 *
 * @param graph - [EN] Integration graph. [ES] Grafo de integración.
 * @param filters - [EN] Selection filters. [ES] Filtros de selección.
 * @returns [EN] JSON text with two-space indentation. [ES] Texto JSON con sangría de dos espacios.
 */
export const stringifyBuildManifest = async (graph: BarritsIntegrationGraph, filters?: BarritsSelectionFilters): Promise<string> => {
  return JSON.stringify(await createBuildManifest(graph, filters), null, 2);
};

/**
 * [EN] Wraps an integration graph in a watch snapshot with its mode and optional filters.
 * [ES] Envuelve un grafo de integración en un snapshot de observación con su modo y filtros opcionales.
 *
 * @param graph - [EN] Integration graph. [ES] Grafo de integración.
 * @param mode - [EN] Session mode (`watch` or `dev`). [ES] Modo de sesión (`watch` o `dev`).
 * @param filters - [EN] Selection filters. [ES] Filtros de selección.
 * @returns [EN] Watch snapshot. [ES] Snapshot de observación.
 */
export const createWatchSnapshot = (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
): BarritsWatchSnapshot => {
  return {
    generatedAt: new Date().toISOString(),
    mode,
    graph,
    ...(hasSelectionFilters(filters) ? { filters } : {}),
  };
};

/**
 * [EN] Serializes a watch snapshot as pretty-printed JSON.
 * [ES] Serializa un snapshot de observación como JSON con formato legible.
 *
 * @param graph - [EN] Integration graph. [ES] Grafo de integración.
 * @param mode - [EN] Session mode. [ES] Modo de sesión.
 * @param filters - [EN] Selection filters. [ES] Filtros de selección.
 * @returns [EN] JSON text with two-space indentation. [ES] Texto JSON con sangría de dos espacios.
 */
export const stringifyWatchSnapshot = (
  graph: BarritsIntegrationGraph,
  mode: "watch" | "dev",
  filters?: BarritsSelectionFilters,
): string => {
  return JSON.stringify(createWatchSnapshot(graph, mode, filters), null, 2);
};
