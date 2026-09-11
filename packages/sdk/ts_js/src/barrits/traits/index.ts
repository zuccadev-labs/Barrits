import { compose, composePipeline, mergeTraits } from "./compose";
import { composeTraitDescriptors, createTraitDescriptor, createTraitDescriptorFromJsDoc, parseTraitDescriptorJsDoc } from "./descriptor";
import {
  DEFAULT_TRAIT_CONFLICT_STRATEGY,
  TRAIT_CONFLICT_STRATEGIES,
  isTraitConflictStrategy,
  normalizeTraitConflictStrategy,
} from "./conflict";

export {
  compose,
  composePipeline,
  composeTraitDescriptors,
  createTraitDescriptor,
  createTraitDescriptorFromJsDoc,
  DEFAULT_TRAIT_CONFLICT_STRATEGY,
  isTraitConflictStrategy,
  mergeTraits,
  normalizeTraitConflictStrategy,
  parseTraitDescriptorJsDoc,
  TRAIT_CONFLICT_STRATEGIES,
};
export type { LegacyTraitConflictStrategy, TraitConflictStrategy } from "./conflict";
export type {
  AnyTraitDescriptor,
  ComposedTraitDescriptorsResult,
  ComposeTraitDescriptorsOptions,
  MergeTraitProvides,
  TraitDescriptor,
  TraitDescriptorContext,
  TraitDescriptorFromJsDocInput,
  TraitDescriptorInput,
  TraitDescriptorJsDocMetadata,
  TraitDescriptorMetadata,
} from "./descriptor";

/**
 * Trait descriptor and composition helpers exposed under `barrits.traits`.
 */
export const traits = {
  compose,
  composePipeline,
  composeTraitDescriptors,
  createTraitDescriptor,
  createTraitDescriptorFromJsDoc,
  mergeTraits,
  parseTraitDescriptorJsDoc,
};
