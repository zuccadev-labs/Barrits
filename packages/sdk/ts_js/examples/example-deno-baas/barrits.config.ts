/**
 * Barrits root configuration for the Deno BaaS example.
 *
 * This configuration declares the runtime identity and trait discovery
 * strategy used by the Barrits SDK. The BaaS pattern requires explicit
 * trait contracts for IoC container wiring and OpenAPI schema generation.
 *
 * @see {@link https://jsr.io/@zuccadev-labs/barrits} for the full configuration schema.
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
   * Trait conflict resolution strategy (default `onConflict` of `createBarrits().composeTraits`).
   * - "throw": Fail on the first capability provided by two traits.
   * - "left": Keep the capability of the first provider.
   * - "right": Let the last provider win.
   */
  traitConflictStrategy: "throw",
});
