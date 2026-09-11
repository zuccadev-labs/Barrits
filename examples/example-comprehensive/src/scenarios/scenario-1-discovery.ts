/**
 * [EN] Scenario 1: Discovery — How Barrits finds and catalogs traits in a project.
 * [ES] Escenario 1: Descubrimiento — Cómo Barrits encuentra y cataloga traits en un proyecto.
 *
 * This scenario demonstrates:
 * - Trait discovery with multiple discovery strategies
 * - How Barrits maps the integration graph
 * - Inspection of trait metadata and provides/requires
 */

import { inspectBarritsIntegrations } from "@zuccadev-labs/barrits/sdk";
import { createNodeFileSystemAdapter } from "@zuccadev-labs/barrits/node";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

export async function scenario1Discovery() {
  console.log("\n=== SCENARIO 1: DISCOVERY ===\n");

  const adapter = createNodeFileSystemAdapter();

  const discovery = {
    projectRoot,
    barritsDirectory: resolve(projectRoot, "barrits"),
    discoveryRoots: ["./"],
  };

  console.log(`📍 Project root: ${projectRoot}`);
  console.log(`📍 Barrits directory: ${discovery.barritsDirectory}`);
  console.log(`📍 Discovery roots: ${discovery.discoveryRoots.join(", ")}`);

  try {
    const graph = await inspectBarritsIntegrations(adapter, discovery);

    console.log(`\n✅ Discovery complete`);
    console.log(`   Traits discovered: ${graph.traitDescriptors.length}`);
    console.log(`   Files scanned: ${graph.filesCount}`);
    console.log(`   Exports found: ${graph.exportsCount}`);

    for (const trait of graph.traitDescriptors) {
      console.log(`\n   📦 ${trait.name}`);
      console.log(`      provides: ${trait.provides?.join(", ") || "none"}`);
      console.log(`      requires: ${trait.requires?.join(", ") || "none"}`);
    }
  } catch (error) {
    console.error(`❌ Discovery failed:`, error);
    throw error;
  }
}
