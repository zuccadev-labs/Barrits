import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleDirectory = resolve(scriptDirectory, "..");
// Resolve tsx through Node module resolution rather than a literal path: npm
// hoists tsx to the root or keeps it workspace-local depending on the tree it
// computes, and a hardcoded path breaks whenever that decision changes.
const require = createRequire(import.meta.url);
const tsxCliPath = resolve(dirname(require.resolve("tsx/package.json")), "dist/cli.mjs");
const nodeCliPath = resolve(exampleDirectory, "../../adapters/node/bin.ts");

const child = spawn(
  process.execPath,
  [
    tsxCliPath,
    nodeCliPath,
    "build",
    ".",
    "--",
    process.execPath,
    "-e",
    [
      'import { readNodeBuildManifestSummary } from "@zuccadev-labs/barrits/node";',
      'const manifestPath = process.env.BARRITS_BUILD_MANIFEST;',
      'if (!manifestPath) throw new Error("missing build manifest");',
      'const summary = await readNodeBuildManifestSummary(manifestPath);',
      'console.log("node build domains:", summary.domains.join(", "));',
    ].join(" "),
  ],
  {
    stdio: "inherit",
  },
);

child.once("exit", (code) => {
  process.exit(code ?? 0);
});