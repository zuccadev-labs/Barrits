import { createBarrits } from "@zuccadev-labs/barrits";
import { createOperationalShowcase } from "./examples/index.mjs";

export const boot = async () => {
  // Typed custom namespace from barrits.config.ts (namespace: "corpAgent")
  const system = await createBarrits<"corpAgent">();
  if (system.corpAgent) {
    console.log("[Bun] Root api instance successfully instantiated dynamically under 'corpAgent'.");
  }

  // Namespaced API access: barrits.<domain>.<family?>.<member>
  const developers = [
    { name: "ada", score: 9 },
    { name: "lin", score: 2 },
  ];
  const ranked = system.barrits.logic.orderBy(developers, [
    { project: (dev) => dev.score, direction: "desc" },
  ]);
  console.log(
    `[Bun] Namespaced call barrits.logic.orderBy -> ${ranked.map((dev) => dev.name).join(",")}`,
  );

  const showcase = await createOperationalShowcase();
  const keys = Object.keys(showcase);
  console.log(`[Bun] Showcase loaded with ${keys.length} families: ${keys.join(", ")}`);
  return showcase;
};

// Execute on run
const result = await boot();
console.log(JSON.stringify(result, null, 2));
