import manifest from "virtual:barrits/manifest";

import { createBuildManifestSummary } from "barrits/consume";

export const viteSummary = createBuildManifestSummary(manifest);

export default viteSummary;
