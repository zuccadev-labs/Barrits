/**
 * Produces a deterministic JSON string representation of the provided value.
 *
 * Standard `JSON.stringify` does not guarantee key ordering within objects,
 * which means two structurally identical objects may produce different string
 * representations depending on insertion order. This function resolves that
 * ambiguity by recursively sorting all object keys in lexicographic order
 * before serialization.
 *
 * This deterministic output is essential for computing reproducible checksums,
 * content-addressable caching, and manifest integrity verification across
 * geographically distributed build systems.
 *
 * @param value - The value to serialize. Accepts any JSON-compatible type.
 * @param indent - Optional indentation for human-readable output. When omitted,
 *   the output is compact (no whitespace).
 * @returns A deterministic JSON string with all object keys sorted lexicographically.
 *
 * @example
 * ```ts
 * import { deterministicStringify } from "@aspect/barrits";
 *
 * const a = { z: 1, a: 2, m: { b: 3, a: 4 } };
 * const b = { a: 2, m: { a: 4, b: 3 }, z: 1 };
 *
 * // Both produce identical output despite different insertion order.
 * deterministicStringify(a) === deterministicStringify(b); // true
 * ```
 */
export declare const deterministicStringify: (value: unknown, indent?: number) => string;
