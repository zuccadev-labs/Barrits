/**
 * Produces a deterministic JSON string representation of the provided value.
 *
 * Standard `JSON.stringify` preserves insertion order, so two structurally identical
 * objects can serialize differently. This function recursively sorts every plain-object
 * key by UTF-16 code unit (the default `Array.prototype.sort` order), which is locale-
 * and ICU-independent, so the output is byte-for-byte reproducible across runtimes and
 * machines. That property is what makes it suitable for checksums, content-addressable
 * caching and manifest integrity verification.
 *
 * Behaviour notes:
 * - Arrays keep their element order.
 * - `Date` and `RegExp` instances are passed through to `JSON.stringify` (dates become ISO strings).
 * - `Map` and `Set` are not JSON-representable; convert them to arrays or objects before serializing.
 * - `undefined` properties are omitted, exactly as `JSON.stringify` does.
 *
 * @param value - The value to serialize. Accepts any JSON-compatible type.
 * @param indent - Optional indentation for human-readable output. When omitted, the output is compact.
 * @returns A deterministic JSON string with all object keys sorted by code unit.
 *
 * @example
 * ```ts
 * import { deterministicStringify } from "@zuccadev-labs/barrits";
 *
 * const a = { z: 1, a: 2, m: { b: 3, a: 4 } };
 * const b = { a: 2, m: { a: 4, b: 3 }, z: 1 };
 *
 * deterministicStringify(a) === deterministicStringify(b); // true
 * ```
 */
export const deterministicStringify = (value: unknown, indent?: number): string => {
  return JSON.stringify(sortKeysRecursive(value), null, indent);
};

const isPlainObject = (node: object): node is Record<string, unknown> => {
  return !(node instanceof Date) && !(node instanceof RegExp);
};

/**
 * Recursively sorts all object keys in a value tree by code unit. Arrays preserve their
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

  if (typeof node === "object" && isPlainObject(node)) {
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(node).sort()) {
      result[key] = sortKeysRecursive(node[key]);
    }

    return result;
  }

  return node;
};
