import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BarritsIoCContainer } from "../src/barrits/ioc/index";
import type { BarritsBuildManifest } from "../src/barrits/sdk/contracts";

describe("BarritsIoCContainer", () => {
  it("creates an empty container", () => {
    const container = new BarritsIoCContainer();
    assert.ok(container instanceof BarritsIoCContainer);
  });

  it("creates a container with manifest", () => {
    const manifest = { projectRoot: "/test", traitDescriptors: [] } as unknown as BarritsBuildManifest;
    const container = new BarritsIoCContainer(manifest);
    assert.ok(container instanceof BarritsIoCContainer);
  });

  it("register and resolve a sync factory", async () => {
    const container = new BarritsIoCContainer();
    container.register("logger", () => ({ log: (msg: string) => msg }));
    const logger = await container.resolve<{ log: (msg: string) => string }>("logger");
    assert.equal(logger.log("hello"), "hello");
  });

  it("returns the same singleton instance on repeated resolve", async () => {
    const container = new BarritsIoCContainer();
    container.register("counter", () => ({ count: 0 }));
    const a = await container.resolve<{ count: number }>("counter");
    const b = await container.resolve<{ count: number }>("counter");
    assert.equal(a, b);
  });

  it("resolves async factory", async () => {
    const container = new BarritsIoCContainer();
    container.register("asyncValue", async () => "resolved-async");
    const value = await container.resolve<string>("asyncValue");
    assert.equal(value, "resolved-async");
  });

  it("throws for unresolved capability", async () => {
    const container = new BarritsIoCContainer();
    await assert.rejects(
      () => container.resolve("nonexistent"),
      /Unresolved dependency/,
    );
  });

  it("allows factory to resolve sub-dependencies", async () => {
    const container = new BarritsIoCContainer();
    container.register("config", () => ({ url: "http://localhost" }));
    container.register("client", async (c) => {
      const config = await c.resolve<{ url: string }>("config");
      return { connect: () => config.url };
    });
    const client = await container.resolve<{ connect: () => string }>("client");
    assert.equal(client.connect(), "http://localhost");
  });

  it("wire does nothing when no manifest", async () => {
    const container = new BarritsIoCContainer();
    await container.wire();
    await assert.rejects(() => container.resolve("anything"), /Unresolved dependency/);
  });

  it("wire does nothing with empty traitDescriptors", async () => {
    const manifest = { projectRoot: "/test", traitDescriptors: [] } as unknown as BarritsBuildManifest;
    const container = new BarritsIoCContainer(manifest);
    await container.wire();
    await assert.rejects(() => container.resolve("anything"), /Unresolved dependency/);
  });

  it("wire processes provides from trait descriptors", async () => {
    const manifest = {
      projectRoot: "/test",
      traitDescriptors: [
        { name: "myTrait", provides: ["capA"], sourceFile: "traits/a.ts", bindingName: "a", bindingKind: "const" as const, requires: [], conflicts: [], state: [], consumes: [], tags: [], runtimes: [] },
      ],
    } as unknown as BarritsBuildManifest;
    const container = new BarritsIoCContainer(manifest);
    container.register("capA", () => "capability-a");
    await container.wire();
    const value = await container.resolve<string>("capA");
    assert.equal(value, "capability-a");
  });
});
