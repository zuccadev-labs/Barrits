import { type BarritsPackageAutomationOptions } from "./shared";
type VitePlugin = {
    name: string;
    resolveId?: (id: string) => string | null | Promise<string | null>;
    load?: (id: string) => string | null | Promise<string | null>;
    config?: () => {
        define?: Record<string, string>;
    } | void | Promise<{
        define?: Record<string, string>;
    } | void>;
};
type BarritsVitePluginOptions = {
    manifestPath?: string;
    package?: BarritsPackageAutomationOptions;
    virtualModuleId?: string;
};
/**
 * [EN] Implementation of Barrits vite plugin.
 * [ES] Implementación de Barrits vite plugin.
 */
export declare const barritsVitePlugin: (options?: BarritsVitePluginOptions) => VitePlugin;
export {};
