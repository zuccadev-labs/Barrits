import manifest from "barrits-manifest";

import { createBuildManifestSummary } from "barrits/consume";

export const webpackSummary = createBuildManifestSummary(manifest);

export default webpackSummary;
