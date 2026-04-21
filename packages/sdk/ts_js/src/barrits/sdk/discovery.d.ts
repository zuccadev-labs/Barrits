import type { BarritsDiscovery, FindBarritsOptions, RuntimeFileSystemAdapter } from "./contracts";
export declare const findBarritsDirectory: (adapter: RuntimeFileSystemAdapter, options?: FindBarritsOptions) => Promise<BarritsDiscovery | null>;
