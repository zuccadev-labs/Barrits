import { readDenoBuildManifestSummary } from "../../../dist/adapters/deno/mod.js";

const manifestPath = Deno.env.get("BARRITS_BUILD_MANIFEST");

if (!manifestPath) {
  throw new Error("missing build manifest");
}

const summary = await readDenoBuildManifestSummary(manifestPath);

console.log("deno build domains:", summary.domains.join(", "));