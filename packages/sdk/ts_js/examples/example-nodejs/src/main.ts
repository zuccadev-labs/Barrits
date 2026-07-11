import { createBarrits } from "@zuccadev-labs/barrits";
import { createOperationalShowcase } from "./examples/index.mjs";

export const boot = async () => {
  // Test root dynamic factory naming (typed custom namespace from barrits.config.ts)
  const system = await createBarrits<"corpAgent">();
  if (system.corpAgent) {
    console.log("[Corporation] Root api instance successfully instantiated dynamically under 'corpAgent'.");
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
    "[Node] Namespaced call barrits.logic.orderBy ->",
    ranked.map((dev) => dev.name).join(","),
  );

  return createOperationalShowcase();
};

export const showcase = boot();