import type { BarritsPackageAutomationOptions } from "./plugins/shared";
import {
  DEFAULT_AUTOMATION_DIRECTORY,
  type BarritsRootConfig,
  type BarritsRuntimeKind,
  type BarritsWatchMode,
} from "./config";
import { getCurrentWorkingDirectory } from "./internal/runtime";
import { normalizePackageOptions } from "./internal/config_normalization";

export type { BarritsRootConfig, BarritsRuntimeKind, BarritsWatchMode } from "./config";
export { BARRITS_CONFIG_FILENAMES, DEFAULT_AUTOMATION_DIRECTORY, defineBarritsConfig, findBarritsConfigFile, loadBarritsConfig, resolveBarritsConfig } from "./config";

/** Public alias for package-first root configuration accepted by Barrits. */
export type BarritsPackageOptions = BarritsRootConfig;

type ResolvedBarritsPackageOptions = {
  runtime: BarritsRuntimeKind;
  watch: BarritsWatchMode;
  debugCommands: boolean;
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
};

/**
 * Normalizes package-first configuration into a deterministic runtime contract.
 *
 * @param options Optional root configuration passed by the consumer project.
 * @returns Normalized package options consumed by Barrits automation and adapters.
 */
export const defineBarritsPackage = (
  options: BarritsPackageOptions = {},
): ResolvedBarritsPackageOptions => {
  return normalizePackageOptions(options);
};

/**
 * Converts package-level configuration into automation options for plugins/adapters.
 *
 * @param options Optional root package options.
 * @returns Automation options with watch-aware manifest behavior.
 */
export const toBarritsAutomationOptions = (
  options: BarritsPackageOptions = {},
): BarritsPackageAutomationOptions => {
  const normalizedOptions = defineBarritsPackage(options);

  return {
    projectRoot: normalizedOptions.projectRoot,
    manifestPath: normalizedOptions.manifestPath,
    autoManifest: normalizedOptions.autoManifest && normalizedOptions.watch !== "off",
    automationDirectory: normalizedOptions.automationDirectory,
  };
};