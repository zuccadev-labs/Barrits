import manifest from "barrits:manifest";

import { createBuildManifestSummary } from "@zuccadev-labs/barrits/consume";

export const bundlerSummary = createBuildManifestSummary(manifest);

export default bundlerSummary;
