import { type BarritsPackageAutomationOptions } from "./shared";
interface EsbuildBuild {
    onResolve(options: {
        filter: RegExp;
    }, callback: (args: {
        path: string;
    }) => {
        path: string;
        namespace: string;
    } | null): void;
    onLoad(options: {
        filter: RegExp;
        namespace: string;
    }, callback: (args: {
        path: string;
    }) => Promise<{
        contents: string;
        loader: string;
    } | null>): void;
}
type EsbuildPlugin = {
    name: string;
    setup: (build: EsbuildBuild) => void;
};
type BarritsEsbuildPluginOptions = {
    manifestPath?: string;
    package?: BarritsPackageAutomationOptions;
    virtualModuleId?: string;
};
/**
 * [EN] Implementation of Barrits esbuild plugin.
 * [ES] Implementación de Barrits esbuild plugin.
 */
export declare const barritsEsbuildPlugin: (options?: BarritsEsbuildPluginOptions) => EsbuildPlugin;
export {};
