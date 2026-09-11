import { DEFAULT_TRAIT_CONFLICT_STRATEGY, type TraitConflictStrategy } from "../conflict";

/**
 * Collision strategy used by `mergeTraits` when both trait objects define the same key (same vocabulary as
 * `composeTraitDescriptors` and `traitConflictStrategy`).
 */
export type MergeTraitsConflictStrategy = TraitConflictStrategy;

/**
 * Options that control conflict behavior while merging trait capability objects.
 *
 * Allows both declarative strategy selection ("throw" | "left" | "right") and
 * custom conflict resolution via callback. Custom resolver takes precedence over strategy.
 *
 * @example
 * ```typescript
 * // Strategy-based: keep left values on conflict
 * { onConflict: "left" }
 *
 * // Custom resolver: decide per-key which wins
 * { resolveConflict: (key, left, right) => {
 *   return key.startsWith("cache_") ? right : left;
 * }}
 * ```
 */
export type MergeTraitsOptions = {
  /** Conflict resolution strategy ("throw" | "left" | "right"). Default: "throw". */
  onConflict?: MergeTraitsConflictStrategy;
  /** Custom conflict resolver function. Takes precedence over onConflict strategy. */
  resolveConflict?: (key: string, leftValue: unknown, rightValue: unknown) => unknown;
};

/**
 * Merges two trait objects with explicit collision handling.
 *
 * Combines left and right trait capability objects into a single merged result.
 * When keys collide (same capability in both traits), the collision strategy determines winner:
 * "throw" (default): raises error, "left": keeps left value, "right": takes right value.
 * Custom resolver can override both strategy and default behavior.
 *
 * @template TLeft Left trait capability shape
 * @template TRight Right trait capability shape
 * @param left Left trait object (typically lower priority/default)
 * @param right Right trait object (typically higher priority/override)
 * @param options Collision strategy ("throw" | "left" | "right") or custom resolver function
 * @returns Merged trait object with all keys from both inputs
 * @throws {Error} If collision occurs, strategy is "throw", and no custom resolver provided
 *
 * @example
 * ```typescript
 * const cache = { get: async (key: string) => null, set: async (key: string, val: unknown) => {} };
 * const db = { query: async (sql: string) => [] };
 *
 * // No conflict - merge succeeds
 * const merged = mergeTraits(cache, db);
 * // merged = { get, set, query }
 *
 * // With conflict - strategy determines winner
 * const cache2 = { query: async () => "cached" };
 * const merged2 = mergeTraits(cache, cache2, { onConflict: "left" });
 * // merged2.query uses cache version (left wins)
 *
 * // Custom resolver
 * const merged3 = mergeTraits(cache, cache2, {
 *   resolveConflict: (key, left, right) => key === "query" ? right : left
 * });
 * ```
 */
export const mergeTraits = <TLeft extends object, TRight extends object>(
  left: TLeft,
  right: TRight,
  options: MergeTraitsOptions = {},
): TLeft & TRight => {
  const result = { ...(left as Record<string, unknown>) };
  const conflictStrategy = options.onConflict ?? DEFAULT_TRAIT_CONFLICT_STRATEGY;

  for (const [key, rightValue] of Object.entries(right)) {
    if (!(key in result)) {
      result[key] = rightValue;
      continue;
    }

    const leftValue = result[key];

    if (Object.is(leftValue, rightValue)) {
      continue;
    }

    if (options.resolveConflict) {
      result[key] = options.resolveConflict(key, leftValue, rightValue);
      continue;
    }

    if (conflictStrategy === "left") {
      continue;
    }

    if (conflictStrategy === "right") {
      result[key] = rightValue;
      continue;
    }

    throw new Error(`Trait collision for "${key}". Pass { onConflict: "left" | "right" } or a resolveConflict callback to mergeTraits().`);
  }

  return result as TLeft & TRight;
};
