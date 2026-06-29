import { type BarritsPackageAutomationOptions } from "./shared";
type WebpackCompiler = {
  context: string;
  options: {
    resolve?: {
      alias?: Record<string, string>;
    };
  };
  hooks: {
    beforeRun: {
      tapPromise: (name: string, callback: () => Promise<void>) => void;
    };
    watchRun: {
      tapPromise: (name: string, callback: () => Promise<void>) => void;
    };
  };
};
type WebpackPlugin = {
  apply: (compiler: WebpackCompiler) => void;
};
export type BarritsWebpackPluginOptions = {
  manifestPath?: string;
  package?: BarritsPackageAutomationOptions;
  virtualModuleId?: string;
  generatedModulePath?: string;
};
export declare class BarritsWebpackPlugin implements WebpackPlugin {
  private readonly packageOptions?;
  private readonly virtualModuleId;
  private readonly generatedModulePath;
  constructor(options?: BarritsWebpackPluginOptions);
  apply(compiler: WebpackCompiler): void;
}
export declare const barritsWebpackPlugin: (options?: BarritsWebpackPluginOptions) => BarritsWebpackPlugin;
export {};
