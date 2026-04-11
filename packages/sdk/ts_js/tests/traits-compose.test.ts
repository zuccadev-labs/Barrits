import test from "node:test";
import assert from "node:assert/strict";

import { mergeTraits } from "../src/barrits/traits";

test("mergeTraits fails fast when two traits define the same property", () => {
  assert.throws(
    () => mergeTraits({ normalize: () => "left" }, { normalize: () => "right" }),
    /Trait collision for "normalize"/,
  );
});

test("mergeTraits supports explicit conflict resolution policies", () => {
  const keepLeft = mergeTraits(
    { normalize: () => "left", source: "left" },
    { normalize: () => "right", target: "right" },
    { onConflict: "left" },
  );

  const keepRight = mergeTraits(
    { normalize: () => "left", source: "left" },
    { normalize: () => "right", target: "right" },
    { onConflict: "right" },
  );

  const merged = mergeTraits(
    { normalize: () => "left" },
    { normalize: () => "right" },
    {
      resolveConflict: (key, leftValue, rightValue) => {
        assert.equal(key, "normalize");
        assert.equal(typeof leftValue, "function");
        assert.equal(typeof rightValue, "function");
        return () => "custom";
      },
    },
  );

  assert.equal(keepLeft.normalize(), "left");
  assert.equal(keepLeft.target, "right");
  assert.equal(keepRight.normalize(), "right");
  assert.equal(keepRight.source, "left");
  assert.equal(merged.normalize(), "custom");
});