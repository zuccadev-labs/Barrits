import { describe, expect, test } from "bun:test";

describe("traits", () => {
  test("loads runtime trait", async () => {
    const mod = await import("../barrits/traits/runtime-trait.ts");
    expect(mod.bunRuntimeTrait).toBeDefined();
    expect(mod.bunRuntimeTrait.name).toBe("runtime-bun");
  });
  test("loads queue service trait", async () => {
    const mod = await import("../barrits/traits/queue-service.ts");
    expect(mod.queueServiceTrait).toBeDefined();
    expect(mod.queueServiceTrait.name).toBe("queue-service");
    expect(mod.queueServiceTrait.provides).toEqual(["queue:crud"]);
  });
  test("loads http handler trait", async () => {
    const mod = await import("../barrits/traits/http-handler.ts");
    expect(mod.httpHandlerTrait).toBeDefined();
    expect(mod.httpHandlerTrait.tags).toContain("http-endpoint");
  });
  test("re-exports all traits from barrel", async () => {
    const mod = await import("../barrits/traits/index.ts");
    expect(mod.bunRuntimeTrait).toBeDefined();
    expect(mod.queueServiceTrait).toBeDefined();
    expect(mod.httpHandlerTrait).toBeDefined();
  });
});
