import type { BarritsExportVisibility, BarritsFileKind } from "./contracts";

/**
 * [EN] Every architectural file kind recognized by the crawler, in a stable order (source of truth for validation,
 * CLI filters and shell completions).
 * [ES] Todos los tipos arquitectónicos de archivo reconocidos por el crawler, en orden estable (fuente de verdad para
 * validación, filtros de la CLI y completado de shell).
 */
export const BARRITS_FILE_KINDS = [
  "barrel",
  "internal",
  "trait",
  "shared",
  "domain",
  "sdk",
  "root",
] as const satisfies readonly BarritsFileKind[];

/**
 * [EN] Every export visibility level, in a stable order.
 * [ES] Todos los niveles de visibilidad de exportación, en orden estable.
 */
export const BARRITS_EXPORT_VISIBILITIES = ["public", "internal"] as const satisfies readonly BarritsExportVisibility[];

const FILE_KINDS = new Set<string>(BARRITS_FILE_KINDS);
const EXPORT_VISIBILITIES = new Set<string>(BARRITS_EXPORT_VISIBILITIES);

/**
 * [EN] Checks if a value is a valid Barrits file kind. [ES] Comprueba si un valor es un tipo de archivo Barrits válido.
 * @param value - [EN] The value to check. [ES] El valor a comprobar.
 * @returns [EN] True if the value is a valid Barrits file kind. [ES] True si el valor es un tipo de archivo Barrits válido.
 */
export const isBarritsFileKind = (value: string): value is BarritsFileKind => {
  return FILE_KINDS.has(value);
};

/**
 * [EN] Checks if a value is a valid Barrits export visibility. [ES] Comprueba si un valor es una visibilidad de exportación Barrits válida.
 * @param value - [EN] The value to check. [ES] El valor a comprobar.
 * @returns [EN] True if the value is a valid Barrits export visibility. [ES] True si el valor es una visibilidad de exportación Barrits válida.
 */
export const isBarritsExportVisibility = (value: string): value is BarritsExportVisibility => {
  return EXPORT_VISIBILITIES.has(value);
};
