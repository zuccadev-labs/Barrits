import type { BarritsExportVisibility, BarritsFileKind } from "./contracts";

/**
 * [EN] Set of valid file kinds for type checking. [ES] Conjunto de tipos de archivo válidos para comprobación de tipos.
 */
const FILE_KINDS = new Set<BarritsFileKind>(["barrel", "internal", "trait", "shared", "domain", "sdk", "root"]);
/**
 * [EN] Set of valid export visibilities for type checking. [ES] Conjunto de visibilidades de exportación válidas para comprobación de tipos.
 */
const EXPORT_VISIBILITIES = new Set<BarritsExportVisibility>(["public", "internal"]);

/**
 * [EN] Checks if a value is a valid Barrits file kind. [ES] Comprueba si un valor es un tipo de archivo Barrits válido.
 * @param value - [EN] The value to check. [ES] El valor a comprobar.
 * @returns [EN] True if the value is a valid Barrits file kind. [ES] True si el valor es un tipo de archivo Barrits válido.
 */
export const isBarritsFileKind = (value: string): value is BarritsFileKind => {
  return FILE_KINDS.has(value as BarritsFileKind);
};

/**
 * [EN] Checks if a value is a valid Barrits export visibility. [ES] Comprueba si un valor es una visibilidad de exportación Barrits válida.
 * @param value - [EN] The value to check. [ES] El valor a comprobar.
 * @returns [EN] True if the value is a valid Barrits export visibility. [ES] True si el valor es una visibilidad de exportación Barrits válida.
 */
export const isBarritsExportVisibility = (value: string): value is BarritsExportVisibility => {
  return EXPORT_VISIBILITIES.has(value as BarritsExportVisibility);
};


