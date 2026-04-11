import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

import { defineBarritsPackage, toBarritsAutomationOptions } from "barrits";
import { barritsVitePlugin } from "barrits/vite";

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