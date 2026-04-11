import { fileURLToPath } from "node:url";

import { defineBarritsPackage, toBarritsAutomationOptions } from "@zuccadev-labs/barrits";
import { barritsWebpackPlugin } from "@zuccadev-labs/barrits/webpack";

const barritsPackage = defineBarritsPackage({
  runtime: "node",
  watch: "auto",
});

export default {
  context: fileURLToPath(new URL("..", import.meta.url)),
  mode: "production",
  target: "node",
  entry: fileURLToPath(new URL("./webpack-manifest-entry.mjs", import.meta.url)),
  output: {
    path: fileURLToPath(new URL("../dist/webpack/", import.meta.url)),
    filename: "main.js",
    library: {
      type: "module",
    },
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [barritsWebpackPlugin({ package: toBarritsAutomationOptions(barritsPackage) })],
};
