import type { BarritsBuildManifest } from "../sdk/contracts";
/**
 * [EN] Type definition for BarritsPackageAutomationOptions.
 * [ES] Definición de tipo para BarritsPackageAutomationOptions.
 */
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
/**
 * [EN] Implementation of Resolve manifest path.
 * [ES] Implementación de Resolve manifest path.
 */
export declare const resolveManifestPath: (manifestPath?: string) => string | undefined;
/**
 * [EN] Implementation of Resolve package automation options.
 * [ES] Implementación de Resolve package automation options.
 */
export declare const resolvePackageAutomationOptions: (options: BarritsPackageAutomationOptions | undefined, fallbackProjectRoot?: string) => Promise<ResolvedBarritsPackageAutomationOptions>;
/**
 * [EN] Implementation of Load manifest.
 * [ES] Implementación de Load manifest.
 */
export declare const loadManifest: (manifestPath: string) => Promise<BarritsBuildManifest>;
/**
 * [EN] Implementation of Load manifest or create.
 * [ES] Implementación de Load manifest or create.
 */
export declare const loadManifestOrCreate: (manifestPath: string | undefined, projectRoot?: string, automationDirectory?: string) => Promise<BarritsBuildManifest | null>;
/**
 * [EN] Implementation of Load manifest for package.
 * [ES] Implementación de Load manifest for package.
 */
export declare const loadManifestForPackage: (options: BarritsPackageAutomationOptions | undefined, fallbackProjectRoot?: string) => Promise<BarritsBuildManifest | null>;
/**
 * [EN] Implementation of Create manifest module source.
 * [ES] Implementación de Create manifest module source.
 */
export declare const createManifestModuleSource: (manifest: BarritsBuildManifest | null, banner: string) => string;
/**
 * [EN] Helper to normalize base plugin options to reduce duplication.
 * [ES] Ayudante para normalizar opciones base de plugins para reducir duplicación.
 */
export declare const createPluginBaseOptions: (options: {
    virtualModuleId?: string;
    manifestPath?: string;
    package?: BarritsPackageAutomationOptions;
    defaultVirtualModuleId: string;
    resolvedPrefix: string;
}) => {
    virtualModuleId: string;
    resolvedVirtualModuleId: string;
    manifestPath: string | undefined;
    packageOptions: BarritsPackageAutomationOptions | undefined;
};
export {};
