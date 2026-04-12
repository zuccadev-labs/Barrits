import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "other",
  watch: "manual",
  debugCommands: true,
  autoManifest: true,
  automationDirectory: ".barrits",
});
