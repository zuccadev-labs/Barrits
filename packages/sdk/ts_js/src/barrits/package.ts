import type { BarritsPackageAutomationOptions } from "./plugins/shared";
import {
  DEFAULT_AUTOMATION_DIRECTORY,
  defineBarritsConfig,
  loadBarritsConfig,
  type BarritsRootConfig,
  type BarritsRuntimeKind,
  type BarritsWatchMode,
} from "./config";
import { getCurrentWorkingDirectory } from "./internal/runtime";

export type { BarritsRootConfig, BarritsRuntimeKind, BarritsWatchMode } from "./config";
export { BARRITS_CONFIG_FILENAMES, DEFAULT_AUTOMATION_DIRECTORY, defineBarritsConfig, findBarritsConfigFile, loadBarritsConfig, resolveBarritsConfig } from "./config";

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

export const defineBarritsPackage = (
  options: BarritsPackageOptions = {},
): ResolvedBarritsPackageOptions => {
  return {
    runtime: options.runtime ?? "other",
    watch: options.watch ?? "auto",
    debugCommands: options.debugCommands ?? false,
    projectRoot: options.projectRoot ?? getCurrentWorkingDirectory(),
    manifestPath: options.manifestPath,
    autoManifest: options.autoManifest ?? true,
    automationDirectory: options.automationDirectory ?? DEFAULT_AUTOMATION_DIRECTORY,
  };
};

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