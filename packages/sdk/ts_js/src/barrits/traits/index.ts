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

export const traits = {
  compose,
  composePipeline,
  composeTraitDescriptors,
  createTraitDescriptor,
  createTraitDescriptorFromJsDoc,
  mergeTraits,
  parseTraitDescriptorJsDoc,
};