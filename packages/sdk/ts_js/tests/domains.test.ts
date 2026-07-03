import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { barrits, brt } from "../src/barrits/api/domains";

describe("barrits domain object", () => {
  it("has logic property", () => {
    assert.ok(barrits.logic);
  });

  it("has routes property", () => {
    assert.ok(barrits.routes);
  });

  it("has traits property", () => {
    assert.ok(barrits.traits);
  });

  it("has exactly three properties (logic, routes, traits)", () => {
    assert.equal(Object.keys(barrits).length, 3);
  });
});

describe("brt alias", () => {
  it("is the same reference as barrits", () => {
    assert.equal(brt, barrits);
  });

  it("exposes the same properties", () => {
    assert.equal(brt.logic, barrits.logic);
    assert.equal(brt.routes, barrits.routes);
    assert.equal(brt.traits, barrits.traits);
  });
});
