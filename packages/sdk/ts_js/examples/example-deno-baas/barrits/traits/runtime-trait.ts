/**
 * Runtime trait for Deno BaaS.
 *
 * Declares the Deno runtime capability required by all BaaS services.
 *
 * @barrits-trait
 * @barrits-provides runtime:deno
 * @barrits-state RuntimeConfig
 */
export const runtimeTrait = {
  name: "runtime-deno-baas" as const,
  provides: ["runtime:deno"] as readonly string[],
  state: ["RuntimeConfig"] as readonly string[],
  initialize: () => ({
    runtime: "deno",
    features: ["native-http", "deno-kv", "file-system"],
    version: Deno.version,
  }),
};
