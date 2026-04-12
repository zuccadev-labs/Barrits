import { createTraitDescriptor } from "@zuccadev-labs/barrits";

/**
 * Runtime trait used by the Node example to declare environment capabilities.
 *
 * Contract metadata is centralized in `barrits.config.ts` to keep this file low-config.
 */
export const nodeRuntimeTrait = createTraitDescriptor({
  name: "runtime-node",
  provides: ["runtime:node"],
  create: () => ({
    getRuntimeName: () => "node",
  }),
});