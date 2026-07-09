import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "bun",
  watch: "manual",
  autoManifest: true,
  automationDirectory: ".barrits",
  contracts: {
    traits: [
      {
        name: "runtime-bun",
        sourceFile: "traits/runtime-trait.ts",
        bindingName: "bunRuntimeTrait",
        provides: ["runtime:bun"],
        tags: ["runtime"],
        runtimes: ["bun"],
      },
      {
        name: "queue-service",
        sourceFile: "traits/queue-service.ts",
        bindingName: "queueServiceTrait",
        provides: ["queue:crud"],
        tags: ["service", "crud"],
        runtimes: ["bun"],
      },
      {
        name: "http-handler",
        sourceFile: "traits/http-handler.ts",
        bindingName: "httpHandlerTrait",
        provides: ["http:request"],
        tags: ["http-endpoint", "runtime"],
        runtimes: ["bun"],
      },
    ],
  },
});
