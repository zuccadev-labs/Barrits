import { type BarritsPackageAutomationOptions } from "./shared";
type RollupPlugin = {
  name: string;
  resolveId?: (id: string) => string | null | Promise<string | null>;
  load?: (id: string) => string | null | Promise<string | null>;
};
type BarritsRollupPluginOptions = {
  manifestPath?: string;
  package?: BarritsPackageAutomationOptions;
  virtualModuleId?: string;
};
/**
 * [EN] Implementation of Barrits rollup plugin.
 * [ES] Implementación de Barrits rollup plugin.
 */
export declare const barritsRollupPlugin: (options?: BarritsRollupPluginOptions) => RollupPlugin;
export {};
