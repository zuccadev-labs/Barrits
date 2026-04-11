import { nodeResolve } from "@rollup/plugin-node-resolve";

import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsRollupPlugin } from "@zuccadev-labs/barrits/rollup";

const barritsPackage = defineBarritsPackage({
  runtime: "other",
  watch: "auto",
});

export default {
  input: "./rollup/bundler-manifest-entry.mjs",
  output: {
    file: "./dist/rollup/main.js",
    format: "esm",
  },
  plugins: [
    barritsRollupPlugin({ package: toBarritsAutomationOptions(barritsPackage) }),
    nodeResolve(),
  ],
};
