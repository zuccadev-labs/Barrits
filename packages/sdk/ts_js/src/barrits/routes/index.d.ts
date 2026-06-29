import { buildPath, parsePath, path } from "./path";
export { buildPath, parsePath, path };
/**
 * [EN] Routing helpers namespace exposed under `barrits.routes`.
 * Contains utilities for building, parsing and managing resource paths.
 *
 * [ES] Espacio de nombres de ayudantes de enrutamiento expuesto bajo `barrits.routes`.
 * Contiene utilidades para construir, parsear y gestionar rutas de recursos.
 */
export declare const routes: {
  /** [EN] Path manipulation utility. [ES] Utilidad de manipulación de rutas. */
  path: {
    buildPath: (...segments: string[]) => string;
    parsePath: (value: string) => import("..").PathParts;
  };
  /** [EN] Build a path from parts. [ES] Construir una ruta a partir de partes. */
  buildPath: (...segments: string[]) => string;
  /** [EN] Parse a path into metadata. [ES] Parsear una ruta en metadatos. */
  parsePath: (value: string) => import("..").PathParts;
};
