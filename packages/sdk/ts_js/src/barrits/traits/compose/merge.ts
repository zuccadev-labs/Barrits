export type MergeTraitsConflictStrategy = "throw" | "left" | "right";

export type MergeTraitsOptions = {
  onConflict?: MergeTraitsConflictStrategy;
  resolveConflict?: (key: string, leftValue: unknown, rightValue: unknown) => unknown;
};

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