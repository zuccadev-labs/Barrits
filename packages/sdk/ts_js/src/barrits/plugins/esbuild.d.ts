import { type BarritsPackageAutomationOptions } from "./shared";
type EsbuildOnResolveArgs = {
    path: string;
};
type EsbuildOnLoadArgs = {
    path: string;
};
type EsbuildPluginBuild = {
    onResolve: (options: {
        filter: RegExp;
    }, callback: (args: EsbuildOnResolveArgs) => {
        path: string;
        namespace?: string;
    } | null) => void;
    onLoad: (options: {
        filter: RegExp;
        namespace?: string;
    }, callback: (args: EsbuildOnLoadArgs) => Promise<{
        contents: string;
        loader: "js";
    } | null>) => void;
};
type EsbuildPlugin = {
    name: string;
    setup: (build: EsbuildPluginBuild) => void;
};
type BarritsEsbuildPluginOptions = {
    manifestPath?: string;
    package?: BarritsPackageAutomationOptions;
    virtualModuleId?: string;
};
export declare const barritsEsbuildPlugin: (options?: BarritsEsbuildPluginOptions) => EsbuildPlugin;
export {};
