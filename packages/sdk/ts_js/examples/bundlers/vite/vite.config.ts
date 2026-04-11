import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

import { defineBarritsPackage, toBarritsAutomationOptions } from "barrits";
import { barritsVitePlugin } from "barrits/vite";

const barritsPackage = defineBarritsPackage({
  runtime: "other",
  watch: "auto",
});

export default defineConfig({
  root: fileURLToPath(new URL("..", import.meta.url)),
  plugins: [barritsVitePlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
  build: {
    outDir: fileURLToPath(new URL("../dist/vite", import.meta.url)),
    lib: {
      entry: fileURLToPath(new URL("./vite-manifest-entry.mjs", import.meta.url)),
      formats: ["es"],
      fileName: () => "main.js",
    },
  },
});
