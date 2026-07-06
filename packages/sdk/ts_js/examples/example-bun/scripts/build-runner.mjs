import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const exampleDirectory = resolve(scriptDirectory, "..");
const bunCliPath = resolve(exampleDirectory, "../../adapters/bun/cli.ts");

const child = spawn(
  "bun",
  [
    "run",
    bunCliPath,
    "build",
    ".",
    "--",
    "bun",
    "-e",
    [
      'import { readBunBuildManifestSummary } from "@zuccadev-labs/barrits/bun";',
      'const manifestPath = process.env.BARRITS_BUILD_MANIFEST;',
      'if (!manifestPath) throw new Error("missing build manifest");',
      'const summary = await readBunBuildManifestSummary(manifestPath);',
      'console.log("bun build domains:", summary.domains.join(", "));',
    ].join(" "),
  ],
  {
    stdio: "inherit",
  },
);

child.once("exit", (code) => {
  process.exit(code ?? 0);
});
