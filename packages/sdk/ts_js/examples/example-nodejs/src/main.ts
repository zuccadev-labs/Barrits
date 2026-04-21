import { createBarrits } from "@zuccadev-labs/barrits";
import { createOperationalShowcase } from "./examples/index.mjs";

export const boot = async () => {
  // Test root dynamic factory naming
  const system = await createBarrits();
  if (system.corpAgent) {
    console.log("[Corporation] Root api instance successfully instantiated dynamically under 'corpAgent'.");
  }

  return createOperationalShowcase();
};

export const showcase = boot();