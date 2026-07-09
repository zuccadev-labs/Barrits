import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/barrits/consume.ts",
    "src/barrits/plugins/esbuild.ts",
    "src/barrits/plugins/rollup.ts",
    "src/barrits/plugins/vite.ts",
    "src/barrits/plugins/webpack.ts",
    "adapters/node/index.ts",
    "adapters/node/cli.ts",
    "adapters/deno/mod.ts",
    "adapters/deno/cli.ts",
    "adapters/bun/index.ts",
    "adapters/bun/cli.ts",
    "src/barrits/ioc/index.ts",
    "src/barrits/schema/openapi.ts",
  ],
  format: ["esm", "cjs"],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: ["typescript"],
  outDir: "dist",
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
});