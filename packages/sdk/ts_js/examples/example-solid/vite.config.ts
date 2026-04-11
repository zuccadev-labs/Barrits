import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "browser",
  watch: "auto",
});

export default defineConfig({
  plugins: [solid(), barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
  build: {
    target: "esnext",
  },
});