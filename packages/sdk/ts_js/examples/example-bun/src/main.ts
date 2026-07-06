import { createBarrits } from "@zuccadev-labs/barrits";
import { createOperationalShowcase } from "./examples/index.mjs";

export const boot = async () => {
  const system = await createBarrits();
  if (system.corpAgent) {
    console.log("[Bun] Root api instance successfully instantiated dynamically under 'corpAgent'.");
  }

  const showcase = createOperationalShowcase();
  const keys = Object.keys(showcase);
  console.log(`[Bun] Showcase loaded with ${keys.length} families: ${keys.join(", ")}`);
  return showcase;
};

// Execute on run
const result = await boot();
console.log(JSON.stringify(result, null, 2));
