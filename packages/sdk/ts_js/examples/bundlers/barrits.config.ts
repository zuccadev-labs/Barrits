import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "other",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
