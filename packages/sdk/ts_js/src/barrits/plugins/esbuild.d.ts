import { type BarritsPackageAutomationOptions } from "./shared";
type EsbuildPlugin = {
    name: string;
    setup: (build: any) => void;
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
