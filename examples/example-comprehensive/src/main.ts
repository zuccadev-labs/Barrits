/**
 * [EN] Comprehensive example entry point. Runs all scenarios.
 * [ES] Punto de entrada del ejemplo comprehensivo. Ejecuta todos los escenarios.
 */

import { scenario1Discovery } from "./scenarios/scenario-1-discovery";
import { scenario2Composition } from "./scenarios/scenario-2-composition";
import { scenario3Diagnostics } from "./scenarios/scenario-3-diagnostics";
import { scenario4IoC } from "./scenarios/scenario-4-ioc";
import { scenario5Manifest } from "./scenarios/scenario-5-manifest";
import { scenario6OpenAPI } from "./scenarios/scenario-6-openapi";
import { scenario7Namespaced } from "./scenarios/scenario-7-namespaced";

async function main() {
  console.log("\n🚀 BARRITS COMPREHENSIVE EXAMPLE\n");
  console.log("This example demonstrates all core Barrits patterns:\n");

  try {
    await scenario1Discovery();
    scenario2Composition();
    scenario3Diagnostics();
    scenario4IoC();
    scenario5Manifest();
    scenario6OpenAPI();
    await scenario7Namespaced();

    console.log("\n\n✅ ALL SCENARIOS COMPLETE\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    process.exit(1);
  }
}

main();
