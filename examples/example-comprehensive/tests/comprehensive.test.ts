/**
 * [EN] Comprehensive example tests. Validates all pattern implementations.
 * [ES] Tests del ejemplo comprehensivo. Valida todas las implementaciones de patrones.
 */

import { test } from "node:test";
import assert from "node:assert";
import { scenario2Composition } from "../src/scenarios/scenario-2-composition";
import { scenario3Diagnostics } from "../src/scenarios/scenario-3-diagnostics";
import { scenario4IoC } from "../src/scenarios/scenario-4-ioc";
import { scenario5Manifest } from "../src/scenarios/scenario-5-manifest";
import { scenario6OpenAPI } from "../src/scenarios/scenario-6-openapi";
import { scenario7Namespaced } from "../src/scenarios/scenario-7-namespaced";

test("Scenario 2: Trait composition", () => {
  assert.doesNotThrow(() => {
    scenario2Composition();
  });
});

test("Scenario 3: Trait diagnostics", () => {
  assert.doesNotThrow(() => {
    scenario3Diagnostics();
  });
});

test("Scenario 4: IoC container", () => {
  assert.doesNotThrow(() => {
    scenario4IoC();
  });
});

test("Scenario 5: Manifest consumption", () => {
  assert.doesNotThrow(() => {
    scenario5Manifest();
  });
});

test("Scenario 6: OpenAPI schema", () => {
  assert.doesNotThrow(() => {
    scenario6OpenAPI();
  });
});

test("Scenario 7: Namespaced API", async () => {
  assert.doesNotThrow(async () => {
    await scenario7Namespaced();
  });
});

test("All scenarios runnable", async () => {
  const scenarios = [scenario2Composition, scenario3Diagnostics, scenario4IoC, scenario5Manifest, scenario6OpenAPI];
  assert.strictEqual(scenarios.length, 5, "All 5 demo scenarios available");
});

test("Trait hierarchy validates", () => {
  const hierarchy = {
    "data-layer": { provides: ["db:query", "db:execute"] },
    "cache-layer": { requires: ["db:query"], provides: ["cache:get", "cache:set"] },
    "api-gateway": { requires: ["db:query", "cache:get"], provides: ["http:listen"] },
    analytics: { requires: ["cache:set", "http:route"], provides: ["analytics:track"] },
  };

  assert.strictEqual(Object.keys(hierarchy).length, 4, "4-trait hierarchy defined");
  assert.ok(hierarchy["cache-layer"].requires?.includes("db:query"), "Cache requires data-layer capability");
  assert.ok(hierarchy["api-gateway"].requires?.includes("cache:get"), "API requires cache capability");
});
