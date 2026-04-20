import { compose, composePipeline, mergeTraits } from "./compose";
import { composeTraitDescriptors, createTraitDescriptor, createTraitDescriptorFromJsDoc, parseTraitDescriptorJsDoc } from "./descriptor";

export { compose, composePipeline, composeTraitDescriptors, createTraitDescriptor, createTraitDescriptorFromJsDoc, mergeTraits, parseTraitDescriptorJsDoc };
export type {
  ComposedTraitDescriptorsResult,
  ComposeTraitDescriptorsOptions,
  TraitConflictStrategy,
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