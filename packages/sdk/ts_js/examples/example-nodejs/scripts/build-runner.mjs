import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleDirectory = resolve(scriptDirectory, "..");
const tsxCliPath = resolve(exampleDirectory, "../../../../../node_modules/tsx/dist/cli.mjs");
const nodeCliPath = resolve(exampleDirectory, "../../adapters/node/cli.ts");

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
      'import { readNodeBuildManifestSummary } from "barrits/node";',
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