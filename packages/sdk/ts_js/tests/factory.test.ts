import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createBarrits } from "../src/barrits/api/factory";

describe("createBarrits", () => {
  it("returns an object with barrits and brt keys", async () => {
    const api = await createBarrits();
    assert.ok(api.barrits);
    assert.ok(api.brt);
  });

  it("returns an object with config key", async () => {
    const api = await createBarrits();
    assert.ok(api.config);
    assert.equal(typeof api.config, "object");
  });

  it("config has runtime default", async () => {
    const api = await createBarrits();
    assert.equal(api.config.runtime, "other");
  });

  it("config has default watch mode", async () => {
    const api = await createBarrits();
    assert.equal(api.config.watch, "auto");
  });

  it("config has default projectRoot matching cwd", async () => {
    const api = await createBarrits();
    assert.equal(api.config.projectRoot, process.cwd());
  });

  it("barrits and brt reference the same domain object", async () => {
    const { barrits: domain } = await import("../src/barrits/api/domains");
    const api = await createBarrits();
    assert.equal(api.barrits, domain);
    assert.equal(api.brt, domain);
  });

  it("applies runtime option override", async () => {
    const api = await createBarrits({ runtime: "node" });
    assert.equal(api.config.runtime, "node");
  });

  it("applies options without config file", async () => {
    const api = await createBarrits({ autoManifest: false });
    assert.equal(api.config.autoManifest, false);
  });
});
