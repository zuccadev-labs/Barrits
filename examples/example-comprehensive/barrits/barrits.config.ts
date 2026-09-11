/**
 * [EN] Barrits configuration for comprehensive example.
 * [ES] Configuración de Barrits para ejemplo comprehensivo.
 */

import type { BarritsConfig } from "@zuccadev-labs/barrits";

export const barritsConfig: BarritsConfig = {
  namespace: "comprehensive",
  discoveryRoots: ["./barrits"],
  watch: false,
  contracts: {
    traits: [
      {
        name: "data-layer",
        provides: ["db:query", "db:execute", "db:transaction"],
      },
      {
        name: "cache-layer",
        requires: ["db:query", "db:execute"],
        provides: ["cache:get", "cache:set", "cache:invalidate"],
      },
      {
        name: "api-gateway",
        requires: ["db:query", "cache:get", "cache:set"],
        provides: ["http:listen", "http:route"],
      },
      {
        name: "analytics",
        requires: ["cache:set", "http:route"],
        provides: ["analytics:track", "analytics:report"],
      },
    ],
    exports: [
      {
        sourceFile: "traits/index.ts",
        exportName: "createDataLayerTrait",
        visibility: "public",
      },
    ],
  },
};
