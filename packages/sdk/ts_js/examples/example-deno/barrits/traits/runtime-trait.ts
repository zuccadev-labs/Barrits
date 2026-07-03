import { createTraitDescriptor } from "../../../../dist/adapters/deno/mod.js";

export const denoRuntimeTrait = createTraitDescriptor({
  name: "runtime-deno",
  provides: ["runtime:deno"],
  create: () => ({
    getRuntimeName: () => "deno",
  }),
});
