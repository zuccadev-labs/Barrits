import manifest from "barrits-manifest";

import { createBuildManifestSummary } from "@zuccadev-labs/barrits/consume";

export const webpackSummary = createBuildManifestSummary(manifest);

export default webpackSummary;
