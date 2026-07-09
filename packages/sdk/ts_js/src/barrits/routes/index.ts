import { buildPath, parsePath, path } from "./path";

export { buildPath, parsePath, path };

/**
 * [EN] Routing helpers namespace exposed under `barrits.routes`.
 * Contains utilities for building, parsing and managing resource paths.
 *
 * [ES] Espacio de nombres de ayudantes de enrutamiento expuesto bajo `barrits.routes`.
 * Contiene utilidades para construir, parsear y gestionar rutas de recursos.
 */
export const routes = {
  /** [EN] Path manipulation utility. [ES] Utilidad de manipulación de rutas. */
  path,
  /** [EN] Build a path from parts. [ES] Construir una ruta a partir de partes. */
  buildPath,
  /** [EN] Parse a path into metadata. [ES] Parsear una ruta en metadatos. */
  parsePath,
};
