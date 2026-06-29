/**
 * @module
 * [EN] Recursive discovery and auto-location of barrits directories within project trees.
 * [ES] Descubrimiento recursivo y localización automática de directorios barrits en árboles de proyecto.
 */
import type { BarritsDiscovery, FindBarritsOptions, RuntimeFileSystemAdapter } from "./contracts";
/**
 * Discovers the Barrits project structure starting from a given directory.
 * @param adapter - Filesystem adapter for the current runtime.
 * @param options - Optional configuration for the discovery process.
 * @returns A promise that resolves to the discovered Barrits structure or null if not found.
 */
export declare const findBarritsDirectory: (
  adapter: RuntimeFileSystemAdapter,
  options?: FindBarritsOptions,
) => Promise<BarritsDiscovery | null>;
