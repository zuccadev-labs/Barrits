import type { BarritsExportVisibility, BarritsFileKind } from "./contracts";
/**
 * [EN] Checks if a value is a valid Barrits file kind. [ES] Comprueba si un valor es un tipo de archivo Barrits válido.
 * @param value - [EN] The value to check. [ES] El valor a comprobar.
 * @returns [EN] True if the value is a valid Barrits file kind. [ES] True si el valor es un tipo de archivo Barrits válido.
 */
export declare const isBarritsFileKind: (value: string) => value is BarritsFileKind;
/**
 * [EN] Checks if a value is a valid Barrits export visibility. [ES] Comprueba si un valor es una visibilidad de exportación Barrits válida.
 * @param value - [EN] The value to check. [ES] El valor a comprobar.
 * @returns [EN] True if the value is a valid Barrits export visibility. [ES] True si el valor es una visibilidad de exportación Barrits válida.
 */
export declare const isBarritsExportVisibility: (value: string) => value is BarritsExportVisibility;
