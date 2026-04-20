/**
 * Collision strategy used by `mergeTraits` when both trait objects define the same key.
 */
export type MergeTraitsConflictStrategy = "throw" | "left" | "right";

/**
 * Options that control conflict behavior while merging trait capability objects.
 */
export type MergeTraitsOptions = {
  onConflict?: MergeTraitsConflictStrategy;
  resolveConflict?: (key: string, leftValue: unknown, rightValue: unknown) => unknown;
};

/**
 * Merges two trait objects with explicit collision handling.
 *
 * @param left Left trait object.
 * @param right Right trait object.
 * @param options Collision strategy or resolver callback.
 * @returns The merged trait object.
 * @throws Error when a collision occurs and no strategy/resolver is provided.
 */
export const mergeTraits = <TLeft extends object, TRight extends object>(
  left: TLeft,
  right: TRight,
  options: MergeTraitsOptions = {},
): TLeft & TRight => {
  const result = { ...(left as Record<string, unknown>) };
  const conflictStrategy = options.onConflict ?? "throw";

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

    throw new Error(
      `Trait collision for "${key}". Pass { onConflict: "left" | "right" } or a resolveConflict callback to mergeTraits().`,
    );
  }

  return result as TLeft & TRight;
};