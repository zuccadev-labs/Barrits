type UnionToIntersection<TValue> = (TValue extends unknown ? (value: TValue) => void : never) extends (value: infer TIntersection) => void
  ? TIntersection
  : never;
type AnyTraitDescriptor = TraitDescriptor<string, any, any>;
/** Collision strategy for capability keys during trait composition. */
export type TraitConflictStrategy = "throw" | "left" | "right";
/** Context object passed to each trait factory during composition. */
export type TraitDescriptorContext<TState extends object, TResolvedTraits extends object, TName extends string> = {
  readonly descriptorName: TName;
  readonly order: readonly string[];
  readonly state: TState;
  readonly traits: Partial<TResolvedTraits>;
};
/** Normalized trait descriptor contract used by composition/runtime inspection. */
export type TraitDescriptor<
  TName extends string = string,
  TState extends object = Record<string, never>,
  TProvides extends object = Record<string, never>,
> = {
  readonly name: TName;
  readonly summary?: string;
  readonly requires: readonly string[];
  readonly conflicts: readonly string[];
  readonly state: readonly string[];
  readonly consumes: readonly string[];
  readonly provides: readonly (keyof TProvides & string)[];
  readonly tags: readonly string[];
  readonly runtimes: readonly string[];
  readonly create: (context: TraitDescriptorContext<TState, TProvides, TName>) => TProvides;
};
/** Authoring input accepted by `createTraitDescriptor`. */
export type TraitDescriptorInput<TName extends string, TState extends object, TProvides extends object> = {
  readonly name: TName;
  readonly summary?: string;
  readonly requires?: readonly string[];
  readonly conflicts?: readonly string[];
  readonly state?: readonly string[];
  readonly consumes?: readonly string[];
  readonly provides?: readonly (keyof TProvides & string)[];
  readonly tags?: readonly string[];
  readonly runtimes?: readonly string[];
  readonly create: (context: TraitDescriptorContext<TState, TProvides, TName>) => TProvides;
};
/** Metadata projection parsed from declarative JSDoc `@barrits-*` tags. */
export type TraitDescriptorJsDocMetadata = {
  readonly name?: string;
  readonly summary?: string;
  readonly requires: readonly string[];
  readonly conflicts: readonly string[];
  readonly state: readonly string[];
  readonly consumes: readonly string[];
  readonly provides: readonly string[];
  readonly tags: readonly string[];
  readonly runtimes: readonly string[];
};
/** Mixed input for JSDoc-derived trait descriptors with explicit override fields. */
export type TraitDescriptorFromJsDocInput<TName extends string, TState extends object, TProvides extends object> = {
  readonly name?: TName;
  readonly summary?: string;
  readonly requires?: readonly string[];
  readonly conflicts?: readonly string[];
  readonly state?: readonly string[];
  readonly consumes?: readonly string[];
  readonly provides?: readonly (keyof TProvides & string)[];
  readonly tags?: readonly string[];
  readonly runtimes?: readonly string[];
  readonly create: (context: TraitDescriptorContext<TState, TProvides, TName>) => TProvides;
};
/** Stable metadata recorded for each trait in composition results and diagnostics. */
export type TraitDescriptorMetadata = {
  readonly summary?: string;
  readonly requires: readonly string[];
  readonly conflicts: readonly string[];
  readonly state: readonly string[];
  readonly consumes: readonly string[];
  readonly provides: readonly string[];
  readonly tags: readonly string[];
  readonly runtimes: readonly string[];
};
/** Optional composition controls for state initialization and collision handling. */
export type ComposeTraitDescriptorsOptions<TState extends object> = {
  readonly state?: TState;
  readonly onConflict?: TraitConflictStrategy;
  readonly resolveConflict?: (
    key: string,
    leftValue: unknown,
    rightValue: unknown,
    leftTraitName: string,
    rightTraitName: string,
  ) => unknown;
};
/** Deterministic trait composition result consumed by runtime tooling and diagnostics. */
export type ComposedTraitDescriptorsResult<TState extends object, TTraits extends object> = {
  readonly order: readonly string[];
  readonly state: TState;
  readonly traits: TTraits;
  readonly descriptors: readonly string[];
  readonly stateOwners: Readonly<Record<string, string>>;
  readonly traitProviders: Readonly<Record<string, readonly string[]>>;
  readonly traitMetadata: Readonly<Record<string, TraitDescriptorMetadata>>;
};
type TraitProvides<TDescriptor> = TDescriptor extends TraitDescriptor<string, object, infer TProvides> ? TProvides : never;
type MergeTraitProvides<TDescriptors extends readonly AnyTraitDescriptor[]> =
  UnionToIntersection<TraitProvides<TDescriptors[number]>> extends object
    ? UnionToIntersection<TraitProvides<TDescriptors[number]>>
    : Record<string, never>;
/**
 * Parses trait descriptor metadata from a JSDoc block using `@barrits-*` tags.
 *
 * Supported tags: trait name, summary, requires, conflicts, state, consumes,
 * provides, tags, and runtime targets.
 *
 * @param jsDoc Raw JSDoc string.
 * @returns Normalized metadata with unique and sorted string arrays.
 */
export declare const parseTraitDescriptorJsDoc: (jsDoc: string) => TraitDescriptorJsDocMetadata;
/**
 * Creates a trait descriptor with normalized metadata arrays and stable ordering.
 *
 * @param descriptor Trait declaration input authored in code.
 * @returns Normalized trait descriptor ready for composition.
 */
export declare const createTraitDescriptor: <const TName extends string, TState extends object, TProvides extends object>(
  descriptor: TraitDescriptorInput<TName, TState, TProvides>,
) => TraitDescriptor<TName, TState, TProvides>;
/**
 * Creates a trait descriptor from JSDoc metadata plus explicit runtime factory logic.
 *
 * Explicit descriptor fields override metadata parsed from the JSDoc block.
 *
 * @param jsDoc Raw JSDoc block containing `@barrits-*` tags.
 * @param descriptor Trait factory configuration and optional override metadata.
 * @returns Normalized trait descriptor built from metadata and explicit overrides.
 * @throws Error when no descriptor name is available from metadata or explicit options.
 */
export declare const createTraitDescriptorFromJsDoc: <
  const TName extends string = string,
  TState extends object = Record<string, never>,
  TProvides extends object = Record<string, never>,
>(
  jsDoc: string,
  descriptor: TraitDescriptorFromJsDocInput<TName, TState, TProvides>,
) => TraitDescriptor<TName, TState, TProvides>;
/**
 * Composes trait descriptors into a deterministic runtime result.
 *
 * The composition performs dependency ordering, conflict checks, state ownership
 * validation, capability collision handling, and consumed-capability checks.
 *
 * @param descriptors Trait descriptors to compose.
 * @param options Optional state and conflict-resolution settings.
 * @returns Ordered descriptors, composed trait functions, metadata, and ownership maps.
 * @throws Error when descriptors are invalid, cyclic, conflicting, or produce missing capabilities.
 */
export declare const composeTraitDescriptors: <
  TState extends object = Record<string, never>,
  const TDescriptors extends readonly AnyTraitDescriptor[] = readonly AnyTraitDescriptor[],
>(
  descriptors: TDescriptors,
  options?: ComposeTraitDescriptorsOptions<TState>,
) => ComposedTraitDescriptorsResult<TState, MergeTraitProvides<TDescriptors>>;
export {};
