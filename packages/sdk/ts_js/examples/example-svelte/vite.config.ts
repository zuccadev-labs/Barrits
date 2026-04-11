import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

import { defineBarritsPackage, toBarritsAutomationOptions } from "barrits";
import { barritsVitePlugin } from "barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "browser",
  watch: "auto",
});

export default defineConfig({
  plugins: [svelte(), barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
});