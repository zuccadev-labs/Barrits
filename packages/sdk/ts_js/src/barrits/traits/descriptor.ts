type UnionToIntersection<TValue> = (
  TValue extends unknown ? (value: TValue) => void : never
) extends (value: infer TIntersection) => void ? TIntersection : never;

type AnyTraitDescriptor = TraitDescriptor<string, any, any>;

export type TraitConflictStrategy = "throw" | "left" | "right";

export type TraitDescriptorContext<
  TState extends object,
  TResolvedTraits extends object,
  TName extends string,
> = {
  readonly descriptorName: TName;
  readonly order: readonly string[];
  readonly state: TState;
  readonly traits: Partial<TResolvedTraits>;
};

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

export type TraitDescriptorInput<
  TName extends string,
  TState extends object,
  TProvides extends object,
> = {
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

export type TraitDescriptorFromJsDocInput<
  TName extends string,
  TState extends object,
  TProvides extends object,
> = {
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

export type ComposedTraitDescriptorsResult<TState extends object, TTraits extends object> = {
  readonly order: readonly string[];
  readonly state: TState;
  readonly traits: TTraits;
  readonly descriptors: readonly string[];
  readonly stateOwners: Readonly<Record<string, string>>;
  readonly traitProviders: Readonly<Record<string, readonly string[]>>;
  readonly traitMetadata: Readonly<Record<string, TraitDescriptorMetadata>>;
};

type TraitProvides<TDescriptor> = TDescriptor extends TraitDescriptor<string, object, infer TProvides>
  ? TProvides
  : never;

type MergeTraitProvides<TDescriptors extends readonly AnyTraitDescriptor[]> = UnionToIntersection<
  TraitProvides<TDescriptors[number]>
> extends object ? UnionToIntersection<TraitProvides<TDescriptors[number]>> : Record<string, never>;

const normalizeUniqueStrings = (values: readonly string[] | undefined): string[] => {
  if (!values?.length) {
    return [];
  }

  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).sort((left, right) => {
    return left.localeCompare(right);
  });
};

const normalizeJsDocBlock = (value: string): string => {
  return value
    .split(/\r?\n/u)
    .map((line) => line
      .replace(/^\s*\/\*\*?\s?/u, "")
      .replace(/^\s*\*\s?/u, "")
      .replace(/\s*\*\/\s*$/u, "")
      .trim())
    .join("\n")
    .trim();
};

const parseTagValues = (jsDocBlock: string, tagName: string): string[] => {
  const tagExpression = new RegExp(`@${tagName}\\s+([^\\n\\r]+)`, "gu");

  return normalizeUniqueStrings(
    Array.from(jsDocBlock.matchAll(tagExpression))
      .flatMap((match) => match[1].split(/[\s,]+/u))
      .map((value) => value.trim())
      .filter(Boolean),
  );
};

const parseSingleTagValue = (jsDocBlock: string, tagName: string): string | undefined => {
  const tagExpression = new RegExp(`@${tagName}\\s+([^\\n\\r]+)`, "u");
  const matchedValue = jsDocBlock.match(tagExpression)?.[1]?.trim();

  return matchedValue || undefined;
};

const normalizeOptionalString = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim();
  return normalizedValue || undefined;
};

export const parseTraitDescriptorJsDoc = (jsDoc: string): TraitDescriptorJsDocMetadata => {
  const normalizedBlock = normalizeJsDocBlock(jsDoc);

  return {
    name: parseSingleTagValue(normalizedBlock, "barrits-trait"),
    summary: normalizeOptionalString(parseSingleTagValue(normalizedBlock, "barrits-summary")),
    requires: parseTagValues(normalizedBlock, "barrits-requires"),
    conflicts: parseTagValues(normalizedBlock, "barrits-conflicts"),
    state: parseTagValues(normalizedBlock, "barrits-state"),
    consumes: parseTagValues(normalizedBlock, "barrits-consumes"),
    provides: parseTagValues(normalizedBlock, "barrits-provides"),
    tags: parseTagValues(normalizedBlock, "barrits-tags"),
    runtimes: parseTagValues(normalizedBlock, "barrits-runtime"),
  };
};

export const createTraitDescriptor = <
  const TName extends string,
  TState extends object,
  TProvides extends object,
>(
  descriptor: TraitDescriptorInput<TName, TState, TProvides>,
): TraitDescriptor<TName, TState, TProvides> => {
  return {
    name: descriptor.name,
    summary: normalizeOptionalString(descriptor.summary),
    requires: normalizeUniqueStrings(descriptor.requires),
    conflicts: normalizeUniqueStrings(descriptor.conflicts),
    state: normalizeUniqueStrings(descriptor.state),
    consumes: normalizeUniqueStrings(descriptor.consumes),
    provides: normalizeUniqueStrings(descriptor.provides as readonly string[] | undefined) as Array<keyof TProvides & string>,
    tags: normalizeUniqueStrings(descriptor.tags),
    runtimes: normalizeUniqueStrings(descriptor.runtimes),
    create: descriptor.create,
  };
};

export const createTraitDescriptorFromJsDoc = <
  const TName extends string = string,
  TState extends object = Record<string, never>,
  TProvides extends object = Record<string, never>,
>(
  jsDoc: string,
  descriptor: TraitDescriptorFromJsDocInput<TName, TState, TProvides>,
): TraitDescriptor<TName, TState, TProvides> => {
  const metadata = parseTraitDescriptorJsDoc(jsDoc);
  const resolvedName = descriptor.name ?? metadata.name;

  if (!resolvedName) {
    throw new Error("Trait descriptor metadata requires a name. Declare it in @barrits-trait or pass name explicitly.");
  }

  return createTraitDescriptor({
    name: resolvedName as TName,
    summary: descriptor.summary ?? metadata.summary,
    requires: descriptor.requires ?? metadata.requires,
    conflicts: descriptor.conflicts ?? metadata.conflicts,
    state: descriptor.state ?? metadata.state,
    consumes: descriptor.consumes ?? metadata.consumes,
    provides: descriptor.provides ?? (metadata.provides as Array<keyof TProvides & string>),
    tags: descriptor.tags ?? metadata.tags,
    runtimes: descriptor.runtimes ?? metadata.runtimes,
    create: descriptor.create,
  });
};

const toTraitDescriptorMetadata = (descriptor: AnyTraitDescriptor): TraitDescriptorMetadata => {
  return {
    summary: descriptor.summary,
    requires: descriptor.requires,
    conflicts: descriptor.conflicts,
    state: descriptor.state,
    consumes: descriptor.consumes,
    provides: descriptor.provides,
    tags: descriptor.tags,
    runtimes: descriptor.runtimes,
  };
};

const assertConsumedCapabilities = (
  descriptors: readonly AnyTraitDescriptor[],
  traitValues: Record<string, unknown>,
): void => {
  for (const descriptor of descriptors) {
    for (const consumedCapability of descriptor.consumes) {
      if (consumedCapability in traitValues) {
        continue;
      }

      throw new Error(
        `Trait descriptor "${descriptor.name}" consumes "${consumedCapability}", but that capability is not available in the composed result. Declare the provider trait or remove the consumed capability contract.`,
      );
    }
  }
};

const orderTraitDescriptors = (descriptors: readonly AnyTraitDescriptor[]): string[] => {
  const descriptorMap = new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
  const dependencyCounts = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const descriptor of descriptors) {
    dependencyCounts.set(descriptor.name, descriptor.requires.length);

    for (const requiredDescriptor of descriptor.requires) {
      if (!descriptorMap.has(requiredDescriptor)) {
        throw new Error(
          `Trait descriptor "${descriptor.name}" requires "${requiredDescriptor}", but it is not part of the composition.`,
        );
      }

      const currentDependents = dependents.get(requiredDescriptor) ?? [];
      currentDependents.push(descriptor.name);
      dependents.set(requiredDescriptor, currentDependents);
    }
  }

  const pending = Array.from(dependencyCounts.entries())
    .filter(([, count]) => count === 0)
    .map(([name]) => name)
    .sort((left, right) => left.localeCompare(right));
  const ordered: string[] = [];

  while (pending.length > 0) {
    const currentName = pending.shift();

    if (!currentName) {
      continue;
    }

    ordered.push(currentName);

    for (const dependentName of (dependents.get(currentName) ?? []).sort((left, right) => left.localeCompare(right))) {
      const nextCount = (dependencyCounts.get(dependentName) ?? 0) - 1;
      dependencyCounts.set(dependentName, nextCount);

      if (nextCount === 0) {
        pending.push(dependentName);
        pending.sort((left, right) => left.localeCompare(right));
      }
    }
  }

  if (ordered.length !== descriptors.length) {
    throw new Error("Trait descriptors contain a cyclic dependency graph.");
  }

  return ordered;
};

const assertTraitNameUniqueness = (descriptors: readonly AnyTraitDescriptor[]): void => {
  const seen = new Set<string>();

  for (const descriptor of descriptors) {
    if (seen.has(descriptor.name)) {
      throw new Error(`Trait descriptor "${descriptor.name}" is declared more than once.`);
    }

    seen.add(descriptor.name);
  }
};

const assertTraitConflictCompatibility = (descriptors: readonly AnyTraitDescriptor[]): void => {
  const descriptorMap = new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));

  for (const descriptor of descriptors) {
    for (const conflictingName of descriptor.conflicts) {
      const conflictingDescriptor = descriptorMap.get(conflictingName);

      if (!conflictingDescriptor) {
        continue;
      }

      throw new Error(
        `Trait descriptor "${descriptor.name}" cannot be composed with "${conflictingDescriptor.name}" because the conflict is declared explicitly.`,
      );
    }
  }
};

const assertStateOwnership = (descriptors: readonly AnyTraitDescriptor[]): Record<string, string> => {
  const stateOwners: Record<string, string> = {};

  for (const descriptor of descriptors) {
    for (const stateKey of descriptor.state) {
      const existingOwner = stateOwners[stateKey];

      if (existingOwner && existingOwner !== descriptor.name) {
        throw new Error(
          `State key "${stateKey}" is declared by both "${existingOwner}" and "${descriptor.name}". State ownership must be explicit and unique.`,
        );
      }

      stateOwners[stateKey] = descriptor.name;
    }
  }

  return stateOwners;
};

const resolveProvidedKeys = (descriptor: AnyTraitDescriptor, traitValue: Record<string, unknown>): string[] => {
  const actualKeys = Object.keys(traitValue).sort((left, right) => left.localeCompare(right));

  if (descriptor.provides.length === 0) {
    return actualKeys;
  }

  const declaredKeys = [...descriptor.provides].sort((left, right) => left.localeCompare(right));

  if (declaredKeys.length !== actualKeys.length || declaredKeys.some((key, index) => key !== actualKeys[index])) {
    throw new Error(
      `Trait descriptor "${descriptor.name}" declared provides [${declaredKeys.join(", ")}], but created [${actualKeys.join(", ")}].`,
    );
  }

  return declaredKeys;
};

export const composeTraitDescriptors = <
  TState extends object = Record<string, never>,
  const TDescriptors extends readonly AnyTraitDescriptor[] = readonly AnyTraitDescriptor[],
>(
  descriptors: TDescriptors,
  options: ComposeTraitDescriptorsOptions<TState> = {},
): ComposedTraitDescriptorsResult<TState, MergeTraitProvides<TDescriptors>> => {
  assertTraitNameUniqueness(descriptors);
  assertTraitConflictCompatibility(descriptors);

  const stateOwners = assertStateOwnership(descriptors);
  const descriptorMap = new Map<string, AnyTraitDescriptor>(descriptors.map((descriptor) => [descriptor.name, descriptor]));
  const order = orderTraitDescriptors(descriptors);
  const traits: Record<string, unknown> = {};
  const traitProviders: Record<string, readonly string[]> = {};
  const traitMetadata: Record<string, TraitDescriptorMetadata> = {};
  const state = (options.state ?? ({} as TState));
  const conflictStrategy = options.onConflict ?? "throw";

  for (const descriptorName of order) {
    const descriptor = descriptorMap.get(descriptorName);

    if (!descriptor) {
      continue;
    }

    const createdTrait = descriptor.create({
      descriptorName,
      order,
      state,
      traits: traits as Partial<MergeTraitProvides<TDescriptors>>,
    }) as Record<string, unknown>;
    const providedKeys = resolveProvidedKeys(descriptor, createdTrait);
    traitProviders[descriptor.name] = providedKeys;
    traitMetadata[descriptor.name] = toTraitDescriptorMetadata(descriptor);

    for (const providedKey of providedKeys) {
      if (!(providedKey in traits)) {
        traits[providedKey] = createdTrait[providedKey];
        continue;
      }

      const leftValue = traits[providedKey];
      const rightValue = createdTrait[providedKey];

      if (Object.is(leftValue, rightValue)) {
        continue;
      }

      const ownerTraitName = Object.entries(traitProviders).find(([, keys]) => keys.includes(providedKey))?.[0] ?? "unknown";

      if (options.resolveConflict) {
        traits[providedKey] = options.resolveConflict(
          providedKey,
          leftValue,
          rightValue,
          ownerTraitName,
          descriptor.name,
        );
        continue;
      }

      if (conflictStrategy === "left") {
        continue;
      }

      if (conflictStrategy === "right") {
        traits[providedKey] = rightValue;
        continue;
      }

      throw new Error(
        `Trait capability collision for "${providedKey}" between "${ownerTraitName}" and "${descriptor.name}". Declare explicit conflicts or pass a conflict strategy.`,
      );
    }
  }

  assertConsumedCapabilities(descriptors, traits);

  return {
    order,
    state,
    traits: traits as MergeTraitProvides<TDescriptors>,
    descriptors: descriptors.map((descriptor) => descriptor.name),
    stateOwners,
    traitProviders,
    traitMetadata,
  };
};