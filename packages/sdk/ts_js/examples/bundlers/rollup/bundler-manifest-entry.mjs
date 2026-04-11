import manifest from "barrits:manifest";

import { createBuildManifestSummary } from "barrits/consume";

export const bundlerSummary = createBuildManifestSummary(manifest);

export default bundlerSummary;
