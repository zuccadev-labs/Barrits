import type { BarritsRootConfig, BarritsRuntimeKind, BarritsWatchMode, ResolvedBarritsConfig } from "../config";
/**
 * Expert-level internal service for configuration normalization.
 * Following SRP: This service only handles data mapping and normalization.
 */
/**
 * Normalizes a raw automation directory string into a clean path.
 *
 * @param value Raw directory value.
 * @returns Cleaned or default directory name.
 */
export declare const normalizeAutomationDirectory: (value: string | undefined) => string;
/**
 * Expert normalization of root package options into a deterministic runtime contract.
 * Used by defineBarritsPackage for synchronous simple normalization.
 */
export declare const normalizePackageOptions: (
  options?: BarritsRootConfig,
  fallbackProjectRoot?: string,
) => {
  runtime: BarritsRuntimeKind;
  watch: BarritsWatchMode;
  debugCommands: boolean;
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
  discoveryRoots: readonly string[];
  traitConflictStrategy: "error" | "override" | "merge";
};
/**
 * Expert resolution of merged configuration.
 * Used by resolveBarritsConfig for final integration.
 */
export declare const normalizeResolvedConfig: (
  mergedConfig: BarritsRootConfig,
  initialProjectRoot: string,
  configFilePath?: string,
) => ResolvedBarritsConfig;
