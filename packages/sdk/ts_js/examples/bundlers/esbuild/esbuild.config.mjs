import { fileURLToPath } from "node:url";

import { build } from "esbuild";

import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsEsbuildPlugin } from "@zuccadev-labs/barrits/esbuild";

const barritsPackage = defineBarritsPackage({
  runtime: "other",
  watch: "auto",
});

await build({
  absWorkingDir: fileURLToPath(new URL("..", import.meta.url)),
  entryPoints: ["./esbuild/bundler-manifest-entry.mjs"],
  outfile: "./dist/esbuild/main.js",
  format: "esm",
  bundle: true,
  plugins: [barritsEsbuildPlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
});
