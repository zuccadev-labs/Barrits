import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export const nodeRuntimeTrait = createTraitDescriptor({
  name: "runtime-node",
  provides: ["runtime:node"],
  create: () => ({
    getRuntimeName: () => "node",
  }),
});
