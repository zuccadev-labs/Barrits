/**
 * Re-exports the flat API surface for direct consumer imports.
 */
export * from "./flat";

/**
 * Re-exports grouped domain namespaces (`barrits`, `brt`) for package-first usage.
 */
export { barrits, brt } from "./domains";

/**
 * Factory and initialization APIs for dynamic contexts.
 */
export * from "./factory";