import { getCurrentWorkingDirectory } from "./runtime";
import type {
  BarritsRootConfig,
  BarritsRuntimeKind,
  BarritsWatchMode,
  ResolvedBarritsConfig,
} from "../config";

/** Default folder where Barrits stores generated automation artifacts. */
const DEFAULT_AUTOMATION_DIRECTORY = ".barrits";

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
export const normalizeAutomationDirectory = (value: string | undefined): string => {
  const normalizedValue = value?.trim().replace(/[\\/]+$/g, "");
  return normalizedValue || DEFAULT_AUTOMATION_DIRECTORY;
};

/**
 * Expert normalization of root package options into a deterministic runtime contract.
 * Used by defineBarritsPackage for synchronous simple normalization.
 */
export const normalizePackageOptions = (
  options: BarritsRootConfig = {},
  fallbackProjectRoot = getCurrentWorkingDirectory(),
): {
  runtime: BarritsRuntimeKind;
  watch: BarritsWatchMode;
  debugCommands: boolean;
  projectRoot: string;
  manifestPath?: string;
  autoManifest: boolean;
  automationDirectory: string;
  discoveryRoots: readonly string[];
  traitConflictStrategy: "error" | "override" | "merge";
} => {
  return {
    runtime: options.runtime ?? "other",
    watch: options.watch ?? "auto",
    debugCommands: options.debugCommands ?? false,
    projectRoot: options.projectRoot ?? fallbackProjectRoot,
    manifestPath: options.manifestPath,
    autoManifest: options.autoManifest ?? true,
    automationDirectory: normalizeAutomationDirectory(options.automationDirectory),
    discoveryRoots: options.discoveryRoots ?? [],
    traitConflictStrategy: options.traitConflictStrategy ?? "error",
  };
};

/**
 * Expert resolution of merged configuration.
 * Used by resolveBarritsConfig for final integration.
 */
export const normalizeResolvedConfig = (
  mergedConfig: BarritsRootConfig,
  initialProjectRoot: string,
  configFilePath?: string,
): ResolvedBarritsConfig => {
  const normalized = normalizePackageOptions(mergedConfig, initialProjectRoot);

  return {
    ...normalized,
    contracts: mergedConfig.contracts,
    configFilePath,
    main: mergedConfig.main,
    namespace: mergedConfig.namespace,
  };
};
