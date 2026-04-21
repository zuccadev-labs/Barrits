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
export const deterministicStringify = (value: unknown, indent?: number): string => {
  return JSON.stringify(sortKeysRecursive(value), null, indent);
};

/**
 * Recursively sorts all object keys in a value tree. Arrays preserve their
 * element order; only plain object keys are reordered.
 *
 * @param node - The current node in the value tree.
 * @returns A new value tree with all object keys sorted.
 */
const sortKeysRecursive = (node: unknown): unknown => {
  if (node === null || node === undefined) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(sortKeysRecursive);
  }

  if (typeof node === "object" && !(node instanceof Date) && !(node instanceof RegExp)) {
    const record = node as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort((a, b) => a.localeCompare(b));
    const result: Record<string, unknown> = {};

    for (const key of sortedKeys) {
      result[key] = sortKeysRecursive(record[key]);
    }

    return result;
  }

  return node;
};
