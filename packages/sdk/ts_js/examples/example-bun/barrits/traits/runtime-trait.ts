import { createTraitDescriptor } from "@zuccadev-labs/barrits";

export const bunRuntimeTrait = createTraitDescriptor({
  name: "runtime-bun",
  provides: ["runtime:bun"],
  create: () => ({
    getRuntimeName: () => "bun",
  }),
});
