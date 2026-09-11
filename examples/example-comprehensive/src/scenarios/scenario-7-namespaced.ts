/**
 * Scenario 7: Namespaced API — Using createBarrits with custom namespace.
 */

import { createBarrits } from "@zuccadev-labs/barrits";

export async function scenario7Namespaced() {
  console.log("\n=== SCENARIO 7: NAMESPACED API ===\n");

  const barrits = createBarrits({
    namespace: "myapp",
    discoveryRoots: ["./barrits"],
    watch: false,
  });

  console.log("🎯 Created namespaced Barrits instance");
  console.log(`   Namespace: ${barrits.namespace}`);
  console.log(`   Type: ${typeof barrits.namespace}`);

  console.log("\n📌 Available methods:");
  console.log(`   • barrits.inspect()`);
  console.log(`   • barrits.compose(trait1, trait2)`);
  console.log(`   • barrits.container.register(name, factory)`);
  console.log(`   • barrits.container.resolve(name)`);

  console.log("\n✅ Namespaced API ready");
}
