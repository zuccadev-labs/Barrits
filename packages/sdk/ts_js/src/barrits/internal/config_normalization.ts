import { getCurrentWorkingDirectory } from "./runtime";
import {
  BARRITS_RUNTIME_KINDS,
  BARRITS_WATCH_MODES,
  DEFAULT_AUTOMATION_DIRECTORY,
  DEFAULT_RUNTIME_KIND,
  DEFAULT_WATCH_MODE,
  RESERVED_BARRITS_NAMESPACES,
  isBarritsRuntimeKind,
  isBarritsWatchMode,
} from "./config_defaults";
import { normalizeTraitConflictStrategy } from "../traits/conflict";
import type { BarritsRootConfig, ResolvedBarritsConfig, ResolvedBarritsPackageOptions } from "../config";

/**
 * @module
 * [EN] Configuration normalization: maps the loosely-typed `barrits.config.*` object (which may come from an
 * untyped JavaScript file) into the deterministic resolved contracts, validating every enumerated field.
 * [ES] Normalización de configuración: convierte el objeto `barrits.config.*` (que puede venir de un archivo
 * JavaScript sin tipos) en los contratos resueltos deterministas, validando cada campo enumerado.
 */

const NAMESPACE_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;

const describeChoices = (choices: readonly string[]): string => choices.map((choice) => JSON.stringify(choice)).join(", ");

/**
 * [EN] Normalizes a raw automation directory string into a clean path (trailing slashes removed; empty → default).
 * [ES] Normaliza un directorio de automatización en una ruta limpia (sin barras finales; vacío → valor por defecto).
 */
export const normalizeAutomationDirectory = (value: string | undefined): string => {
  const normalizedValue = value?.trim().replace(/[\\/]+$/g, "");
  // Empty string is not a valid directory; fall back to default (intentional falsy check).
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return normalizedValue || DEFAULT_AUTOMATION_DIRECTORY;
};

/**
 * [EN] Validates the `namespace` used by `createBarrits()`: it must be a JavaScript identifier and must not shadow
 * the fixed `brt`/`config` keys of the returned API object. Empty/blank values resolve to `undefined` (default).
 * [ES] Valida el `namespace` usado por `createBarrits()`: debe ser un identificador JavaScript y no puede pisar las
 * claves fijas `brt`/`config` del objeto devuelto. Valores vacíos resuelven a `undefined` (por defecto).
 */
export const normalizeNamespace = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new TypeError(`[barrits] Invalid namespace ${JSON.stringify(value)}. Expected a string identifier.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (!NAMESPACE_PATTERN.test(trimmed)) {
    throw new TypeError(`[barrits] Invalid namespace ${JSON.stringify(value)}. Expected a valid JavaScript identifier.`);
  }

  if ((RESERVED_BARRITS_NAMESPACES as readonly string[]).includes(trimmed)) {
    throw new TypeError(
      `[barrits] Invalid namespace ${JSON.stringify(trimmed)}. Reserved names: ${describeChoices(RESERVED_BARRITS_NAMESPACES)}.`,
    );
  }

  return trimmed;
};

const normalizeRuntimeKind = (value: unknown): ResolvedBarritsPackageOptions["runtime"] => {
  if (value === undefined) {
    return DEFAULT_RUNTIME_KIND;
  }

  if (isBarritsRuntimeKind(value)) {
    return value;
  }

  throw new TypeError(`[barrits] Invalid runtime ${JSON.stringify(value)}. Expected one of ${describeChoices(BARRITS_RUNTIME_KINDS)}.`);
};

const normalizeWatchMode = (value: unknown): ResolvedBarritsPackageOptions["watch"] => {
  if (value === undefined) {
    return DEFAULT_WATCH_MODE;
  }

  if (isBarritsWatchMode(value)) {
    return value;
  }

  throw new TypeError(`[barrits] Invalid watch mode ${JSON.stringify(value)}. Expected one of ${describeChoices(BARRITS_WATCH_MODES)}.`);
};

const isStringArray = (value: unknown): value is readonly string[] => {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
};

const normalizeDiscoveryRoots = (value: unknown): readonly string[] => {
  if (value === undefined) {
    return [];
  }

  if (!isStringArray(value)) {
    throw new TypeError("[barrits] Invalid discoveryRoots. Expected an array of strings.");
  }

  return value.map((entry) => entry.trim()).filter(Boolean);
};

/**
 * [EN] Normalizes package-first options into the deterministic `ResolvedBarritsPackageOptions` contract, applying
 * defaults and validating `runtime`, `watch`, `discoveryRoots` and `traitConflictStrategy` (legacy spellings of the
 * latter are mapped to the canonical vocabulary). Used by `defineBarritsPackage` and `resolveBarritsConfig`.
 * [ES] Normaliza las opciones package-first en el contrato determinista `ResolvedBarritsPackageOptions`, aplicando
 * valores por defecto y validando `runtime`, `watch`, `discoveryRoots` y `traitConflictStrategy` (las grafías
 * heredadas de esta última se mapean al vocabulario canónico). Usada por `defineBarritsPackage` y
 * `resolveBarritsConfig`.
 */
export const normalizePackageOptions = (
  options: BarritsRootConfig = {},
  fallbackProjectRoot = getCurrentWorkingDirectory(),
): ResolvedBarritsPackageOptions => {
  return {
    runtime: normalizeRuntimeKind(options.runtime),
    watch: normalizeWatchMode(options.watch),
    debugCommands: options.debugCommands ?? false,
    projectRoot: options.projectRoot ?? fallbackProjectRoot,
    manifestPath: options.manifestPath,
    autoManifest: options.autoManifest ?? true,
    automationDirectory: normalizeAutomationDirectory(options.automationDirectory),
    discoveryRoots: normalizeDiscoveryRoots(options.discoveryRoots),
    traitConflictStrategy: normalizeTraitConflictStrategy(options.traitConflictStrategy),
  };
};

/**
 * [EN] Resolves the merged configuration (file + inline overrides) into `ResolvedBarritsConfig`: package options
 * plus contracts, the config file path and the validated namespace.
 * [ES] Resuelve la configuración fusionada (archivo + overrides inline) en `ResolvedBarritsConfig`: opciones de
 * paquete más contratos, ruta del archivo de configuración y namespace validado.
 */
export const normalizeResolvedConfig = (
  mergedConfig: BarritsRootConfig,
  initialProjectRoot: string,
  configFilePath?: string,
): ResolvedBarritsConfig => {
  return {
    ...normalizePackageOptions(mergedConfig, initialProjectRoot),
    contracts: mergedConfig.contracts,
    configFilePath,
    namespace: normalizeNamespace(mergedConfig.namespace),
  };
};
