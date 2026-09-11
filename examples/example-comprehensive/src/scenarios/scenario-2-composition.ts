/**
 * [EN] Scenario 2: Composition — Composing multiple traits and handling conflicts.
 * [ES] Escenario 2: Composición — Composición de múltiples traits y manejo de conflictos.
 *
 * This scenario demonstrates:
 * - Creating trait descriptors
 * - Composing traits with mergeTraits
 * - Conflict resolution strategies (throw/left/right)
 * - Dependency satisfaction
 */

import { createTraitDescriptor, mergeTraits } from "@zuccadev-labs/barrits/sdk";

export function scenario2Composition() {
  console.log("\n=== SCENARIO 2: COMPOSITION ===\n");

  const dataTrait = createTraitDescriptor({
    name: "data-layer",
    provides: ["db:query", "db:execute"],
    state: { connected: false },
    create: async () => ({
      query: async (sql: string) => [{ result: "mocked" }],
      execute: async (sql: string) => 1,
    }),
  });

  const cacheTrait = createTraitDescriptor({
    name: "cache-layer",
    requires: ["db:query"],
    provides: ["cache:get", "cache:set"],
    state: { entries: new Map() },
    create: async () => ({
      get: async (key: string) => null,
      set: async (key: string, value: unknown) => console.log(`cached: ${key}`),
    }),
  });

  console.log("✅ Created data-layer trait");
  console.log(`   provides: ${dataTrait.provides.join(", ")}`);

  console.log("\n✅ Created cache-layer trait");
  console.log(`   requires: ${cacheTrait.requires?.join(", ") || "none"}`);
  console.log(`   provides: ${cacheTrait.provides.join(", ")}`);

  try {
    const composed = mergeTraits(dataTrait, cacheTrait, { strategy: "left" });
    console.log("\n✅ Composed traits successfully");
    console.log(`   name: ${composed.name}`);
    console.log(`   provides: ${composed.provides.join(", ")}`);
  } catch (error) {
    console.error(`❌ Composition failed:`, error);
  }
}
