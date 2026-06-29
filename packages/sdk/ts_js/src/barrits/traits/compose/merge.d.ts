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
export declare const mergeTraits: <TLeft extends object, TRight extends object>(
  left: TLeft,
  right: TRight,
  options?: MergeTraitsOptions,
) => TLeft & TRight;
