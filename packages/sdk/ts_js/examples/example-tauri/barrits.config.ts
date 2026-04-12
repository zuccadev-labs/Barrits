import { defineBarritsConfig } from "@zuccadev-labs/barrits";

export default defineBarritsConfig({
  runtime: "browser",
  watch: "auto",
  autoManifest: true,
  automationDirectory: ".barrits",
});
