import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "node",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
  contracts: {
    traits: [
      {
        name: "runtime-node",
        sourceFile: "traits/index.ts",
        bindingName: "nodeRuntimeTrait",
        provides: ["runtime:node"],
        tags: ["runtime"],
        runtimes: ["node"],
      },
    ],
  },
});
