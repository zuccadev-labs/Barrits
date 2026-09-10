/**
 * @module
 * Deno adapter entrypoint for Barrits runtime APIs, algorithms, and tooling helpers.
 */

/** Domain namespaces (`barrits`, `brt`) for package-first composition. */
export { barrits, brt } from "../../src/barrits/api/domains";

/** Flat public API: standard library, trait helpers, path helpers, manifest parsers and package constants. */
export * from "../../src/barrits/api/flat";

/** Discovery, inspection, manifest, import and query engine (runtime-agnostic, adapter-driven). */
export * from "../../src/barrits/sdk";

/** Package-level configuration helpers used by runtimes and plugins. */
export { defineBarritsConfig, defineBarritsPackage, toBarritsAutomationOptions } from "../../src/barrits/package";

/** Runtime and watch mode types used by package-first config. */
export type { BarritsRuntimeKind, BarritsWatchMode } from "../../src/barrits/package";

/** File system adapter implementation backed by Deno APIs. */
export { createDenoFileSystemAdapter } from "./filesystem";

/** Deno-specific readers for build manifests and watch snapshots. */
export {
  readDenoBuildManifest,
  readDenoBuildManifestSummary,
  readDenoLanguageToolSnapshot,
  readDenoWatchSnapshot,
  readDenoWatchSnapshotSummary,
} from "./tooling";

/** Lazy CLI runner used by runtime wrappers and integration tests. */
export const runDenoCli = async (argumentsList?: string[]): Promise<number> => {
  const cliModule = await import("./cli");
  return cliModule.runDenoCli(argumentsList);
};
