import { defineBarritsConfig } from "../../src/barrits/config.ts";

export default defineBarritsConfig({
  runtime: "deno",
  watch: "manual",
  autoManifest: true,
  automationDirectory: ".barrits",
});
