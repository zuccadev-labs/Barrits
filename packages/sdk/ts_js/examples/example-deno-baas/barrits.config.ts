/**
 * Barrits root configuration for the Deno BaaS example.
 *
 * This configuration declares the runtime identity and trait discovery
 * strategy used by the Barrits SDK. The BaaS pattern requires explicit
 * trait contracts for IoC container wiring and OpenAPI schema generation.
 *
 * @see {@link https://jsr.io/@aspect/barrits} for the full configuration schema.
 */
import { defineBarritsConfig } from "../../dist/adapters/deno/mod.js";

export default defineBarritsConfig({
  /** Target runtime for adapter selection and platform-specific behavior. */
  runtime: "deno",

  /** Watch mode policy. "manual" disables automatic file watching. */
  watch: "manual",

  /**
   * Additional directories scanned for JSDoc-annotated trait contracts.
   * The Barrits SDK inspects these roots in addition to the primary
   * `barrits/` directory during discovery.
   */
  discoveryRoots: ["barrits"],

  /**
   * Trait conflict resolution strategy.
   * - "error": Halts discovery when conflicting trait compositions are detected.
   * - "override": Last-declared trait wins in case of conflict.
   * - "merge": Attempts to merge conflicting trait capabilities.
   */
  traitConflictStrategy: "error",
});
