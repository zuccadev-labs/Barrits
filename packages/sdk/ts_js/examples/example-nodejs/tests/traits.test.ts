import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { importTs } from "./helpers/setup";

describe("example-nodejs: traits", () => {
  it("loads runtime trait", async () => {
    const mod = await importTs("barrits/traits/runtime-trait.ts");
    assert.ok(mod.nodeRuntimeTrait);
    assert.equal(mod.nodeRuntimeTrait.name, "runtime-node");
  });

  it("loads user service trait", async () => {
    const mod = await importTs("barrits/traits/user-service.ts");
    assert.ok(mod.userServiceTrait);
    assert.equal(mod.userServiceTrait.name, "user-service");
    assert.deepEqual(mod.userServiceTrait.provides, ["user:crud"]);
  });

  it("loads http handler trait", async () => {
    const mod = await importTs("barrits/traits/http-handler.ts");
    assert.ok(mod.httpHandlerTrait);
    assert.ok(mod.httpHandlerTrait.tags?.includes("http-endpoint"));
  });

  it("re-exports all traits from barrel", async () => {
    const mod = await importTs("barrits/traits/index.ts");
    assert.ok(mod.nodeRuntimeTrait);
    assert.ok(mod.userServiceTrait);
    assert.ok(mod.httpHandlerTrait);
  });
});
