import type { BarritsBuildManifest } from "../sdk/contracts";
export type BarritsPackageAutomationOptions = {
    projectRoot?: string;
    manifestPath?: string;
    autoManifest?: boolean;
    automationDirectory?: string;
};
type ResolvedBarritsPackageAutomationOptions = {
    projectRoot: string;
    manifestPath?: string;
    autoManifest: boolean;
    automationDirectory: string;
};
export declare const resolveManifestPath: (manifestPath?: string) => string | undefined;
export declare const resolvePackageAutomationOptions: (options: BarritsPackageAutomationOptions | undefined, fallbackProjectRoot?: string) => Promise<ResolvedBarritsPackageAutomationOptions>;
export declare const loadManifest: (manifestPath: string) => Promise<BarritsBuildManifest>;
export declare const loadManifestOrCreate: (manifestPath: string | undefined, projectRoot?: string, automationDirectory?: string) => Promise<BarritsBuildManifest | null>;
export declare const loadManifestForPackage: (options: BarritsPackageAutomationOptions | undefined, fallbackProjectRoot?: string) => Promise<BarritsBuildManifest | null>;
export declare const createManifestModuleSource: (manifest: BarritsBuildManifest | null, banner: string) => string;
export {};
