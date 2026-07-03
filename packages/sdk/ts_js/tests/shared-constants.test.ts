import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { PACKAGE_NAME, PACKAGE_ALIAS } from "../src/barrits/shared/constants";

describe("shared constants", () => {
  it("PACKAGE_NAME is 'barrits'", () => {
    assert.equal(PACKAGE_NAME, "barrits");
  });

  it("PACKAGE_ALIAS is 'brt'", () => {
    assert.equal(PACKAGE_ALIAS, "brt");
  });


});
