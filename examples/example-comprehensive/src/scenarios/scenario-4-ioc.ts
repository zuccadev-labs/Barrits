/**
 * Scenario 4: IoC Container — Register, resolve, and wire dependencies.
 */

import { createIoCContainer } from "@zuccadev-labs/barrits/ioc";

export function scenario4IoC() {
  console.log("\n=== SCENARIO 4: IOC CONTAINER ===\n");

  const container = createIoCContainer();

  console.log("📦 Registering capabilities...");
  container.register("db:query", async () => ({ query: async (sql: string) => [] }));
  container.register("cache:get", async () => ({ get: async (key: string) => null }));
  container.register("http:listen", async () => ({ listen: async (port: number) => {} }));

  console.log("✅ Registered 3 capabilities");

  console.log("\n🔗 Checking dependencies...");
  console.log(`   has("db:query"): ${container.has("db:query")}`);
  console.log(`   has("cache:get"): ${container.has("cache:get")}`);
  console.log(`   has("missing:cap"): ${container.has("missing:cap")}`);

  console.log("\n✅ IoC container ready");
}
