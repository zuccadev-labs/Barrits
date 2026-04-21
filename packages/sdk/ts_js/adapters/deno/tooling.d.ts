import type { BarritsBuildManifest, BarritsConsumedStateSummary, BarritsLanguageToolSnapshot, BarritsWatchSnapshot } from "../../src/barrits/sdk/contracts";
export declare const readDenoBuildManifest: (filePath: string) => Promise<BarritsBuildManifest>;
export declare const readDenoBuildManifestSummary: (filePath: string) => Promise<BarritsConsumedStateSummary>;
export declare const readDenoWatchSnapshot: (filePath: string) => Promise<BarritsWatchSnapshot>;
export declare const readDenoWatchSnapshotSummary: (filePath: string) => Promise<BarritsConsumedStateSummary>;
export declare const readDenoLanguageToolSnapshot: (filePath: string) => Promise<BarritsLanguageToolSnapshot>;
