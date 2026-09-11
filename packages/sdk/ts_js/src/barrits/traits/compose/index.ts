import { mergeTraits } from "./merge";
import { composePipeline } from "./pipeline";

/**
 * [EN] Merge two trait descriptors, applying conflict resolution strategy.
 * [ES] Fusiona dos descriptores de traits, aplicando estrategia de resolución de conflictos.
 *
 * [EN] Combines the provides/requires of two traits into one descriptor.
 * On capability conflicts, the strategy determines which trait wins.
 * [ES] Combina los provides/requires de dos traits en un descriptor.
 * En caso de conflictos de capacidades, la estrategia determina qué trait gana.
 *
 * @template T Left trait descriptor shape
 * @template U Right trait descriptor shape
 * @param left First trait to merge
 * @param right Second trait to merge
 * @param options Configuration including conflict resolution strategy
 * @returns Merged trait descriptor with combined capabilities
 * @throws {CircularDependencyError} If merging creates circular dependency
 * @throws {ConflictError} If strategy is "throw" and conflicts detected
 *
 * @example
 * ```typescript
 * const dataTrait = createTraitDescriptor({
 *   name: "data-layer",
 *   provides: ["db:query", "db:execute"]
 * });
 *
 * const cacheTrait = createTraitDescriptor({
 *   name: "cache-layer",
 *   requires: ["db:query"],
 *   provides: ["cache:get"]
 * });
 *
 * // Merge with left strategy: data-layer wins on conflicts
 * const merged = mergeTraits(dataTrait, cacheTrait, { strategy: "left" });
 * // merged.name = "merged:data-layer+cache-layer"
 * // merged.provides = ["db:query", "db:execute", "cache:get"]
 * ```
 */
export { composePipeline, mergeTraits };

/**
 * [EN] Compose traits through a function pipeline.
 * [ES] Componer traits a través de un pipeline de funciones.
 *
 * [EN] Applies a series of transformation functions to a base trait,
 * each function receiving the accumulated trait and returning the next.
 * Useful for building complex traits from simple building blocks.
 * [ES] Aplica una serie de funciones de transformación a un trait base,
 * cada función recibe el trait acumulado y devuelve el siguiente.
 * Útil para construir traits complejos a partir de bloques simples.
 *
 * @template T Trait descriptor shape
 * @param baseTrait Initial trait
 * @param transformers Array of transformation functions
 * @returns Final composed trait after all transformers applied
 *
 * @example
 * ```typescript
 * const composed = composePipeline(
 *   createTraitDescriptor({ name: "base", provides: ["core"] }),
 *   [
 *     (trait) => ({ ...trait, provides: [...trait.provides, "logging"] }),
 *     (trait) => ({ ...trait, provides: [...trait.provides, "monitoring"] })
 *   ]
 * );
 * // composed.provides = ["core", "logging", "monitoring"]
 * ```
 */

/**
 * [EN] Trait composition namespace.
 * [ES] Namespace de composición de traits.
 *
 * [EN] Provides utilities for composing, merging, and combining traits.
 * Exposes merge and pipeline strategies for flexible trait construction.
 * [ES] Proporciona utilidades para componer, fusionar y combinar traits.
 * Expone estrategias de merge y pipeline para construcción flexible de traits.
 *
 * @example
 * ```typescript
 * // Using merge strategy
 * const merged = compose.mergeTraits(trait1, trait2, { strategy: "right" });
 *
 * // Using pipeline strategy
 * const piped = compose.composePipeline(baseTrait, [transform1, transform2]);
 * ```
 */
export const compose = {
  mergeTraits,
  composePipeline,
};
