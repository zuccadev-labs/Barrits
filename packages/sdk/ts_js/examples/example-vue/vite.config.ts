import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsVitePlugin } from "@zuccadev-labs/barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "browser",
  watch: "auto",
});

export default defineConfig({
  plugins: [vue(), barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
});