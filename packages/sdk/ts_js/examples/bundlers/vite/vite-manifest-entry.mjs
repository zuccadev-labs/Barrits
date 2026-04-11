import manifest from "virtual:barrits/manifest";

import { createBuildManifestSummary } from "@zuccadev-labs/barrits/consume";

export const viteSummary = createBuildManifestSummary(manifest);

export default viteSummary;
