import { defineBarritsConfig } from "@zuccadev-labs/barrits";
import { boot } from "./src/main";

export default defineBarritsConfig({
  runtime: "node",
  watch: "auto",
  namespace: "corpAgent",
  autoManifest: true,
  automationDirectory: ".barrits",
  main: boot,
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
      {
        name: "user-service",
        sourceFile: "traits/user-service.ts",
        bindingName: "userServiceTrait",
        provides: ["user:crud"],
        tags: ["service", "crud"],
        runtimes: ["node"],
      },
      {
        name: "http-handler",
        sourceFile: "traits/http-handler.ts",
        bindingName: "httpHandlerTrait",
        provides: ["http:request"],
        tags: ["http-endpoint", "runtime"],
        runtimes: ["node"],
      },
    ],
  },
});
