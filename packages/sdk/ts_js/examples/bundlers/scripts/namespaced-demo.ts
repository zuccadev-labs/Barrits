import { createBarrits } from "@zuccadev-labs/barrits";

/**
 * Namespaced API demonstration (mirrors `examples/example-nodejs` and
 * `examples/example-bun`).
 *
 * The bundler examples are *manifest-consumption* surfaces: their entries
 * (`*-manifest-entry.mjs`) consume `virtual:barrits/manifest` through the
 * bundler plugins. This standalone script demonstrates the complementary
 * runtime namespaced API (`barrits.<domain>.<family>.<member>`) against the
 * same `barrits/` domain, without touching the bundler entry points.
 */
const system = await createBarrits();

// The root namespace defaults to "barrits" because `barrits.config.ts` does
// not declare a custom `namespace`.
const rootName = system.config.namespace ?? "barrits";
console.log(`[bundlers] createBarrits() resolved namespace: ${rootName}`);

// Namespaced access to the built-in logic family.
const developers = [
  { name: "ada", score: 9 },
  { name: "lin", score: 2 },
];
const ranked = system.barrits.logic.orderBy(developers, [
  { project: (dev) => dev.score, direction: "desc" },
]);
console.log(
  "[bundlers] Namespaced call barrits.logic.orderBy ->",
  ranked.map((dev) => dev.name).join(","),
);

// The same API is reachable through the short alias `brt`.
const ascending = system.brt.logic.orderBy(developers, [
  { project: (dev) => dev.score, direction: "asc" },
]);
console.log(
  "[bundlers] Alias brt.logic.orderBy ->",
  ascending.map((dev) => dev.name).join(","),
);
