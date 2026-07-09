import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  traits,
  compose,
  composePipeline,
  composeTraitDescriptors,
  createTraitDescriptor,
  createTraitDescriptorFromJsDoc,
  mergeTraits,
  parseTraitDescriptorJsDoc,
} from "../src/barrits/traits";

describe("traits namespace object (barrits.traits)", () => {
  it("is an object", () => {
    assert.equal(typeof traits, "object");
    assert.notEqual(traits, null);
  });

  it("has compose property", () => {
    assert.ok("compose" in traits);
    assert.equal(typeof traits.compose, "object");
    assert.notEqual(traits.compose, null);
  });

  it("has composePipeline property", () => {
    assert.ok("composePipeline" in traits);
    assert.equal(typeof traits.composePipeline, "function");
  });

  it("has composeTraitDescriptors property", () => {
    assert.ok("composeTraitDescriptors" in traits);
    assert.equal(typeof traits.composeTraitDescriptors, "function");
  });

  it("has createTraitDescriptor property", () => {
    assert.ok("createTraitDescriptor" in traits);
    assert.equal(typeof traits.createTraitDescriptor, "function");
  });

  it("has createTraitDescriptorFromJsDoc property", () => {
    assert.ok("createTraitDescriptorFromJsDoc" in traits);
    assert.equal(typeof traits.createTraitDescriptorFromJsDoc, "function");
  });

  it("has mergeTraits property", () => {
    assert.ok("mergeTraits" in traits);
    assert.equal(typeof traits.mergeTraits, "function");
  });

  it("has parseTraitDescriptorJsDoc property", () => {
    assert.ok("parseTraitDescriptorJsDoc" in traits);
    assert.equal(typeof traits.parseTraitDescriptorJsDoc, "function");
  });

  it("has exactly seven properties", () => {
    assert.equal(Object.keys(traits).length, 7);
  });

  it("references the same compose namespace object", () => {
    assert.equal(traits.compose, compose);
  });

  it("references the same composePipeline function", () => {
    assert.equal(traits.composePipeline, composePipeline);
  });

  it("references the same composeTraitDescriptors function", () => {
    assert.equal(traits.composeTraitDescriptors, composeTraitDescriptors);
  });

  it("references the same createTraitDescriptor function", () => {
    assert.equal(traits.createTraitDescriptor, createTraitDescriptor);
  });

  it("references the same createTraitDescriptorFromJsDoc function", () => {
    assert.equal(
      traits.createTraitDescriptorFromJsDoc,
      createTraitDescriptorFromJsDoc,
    );
  });

  it("references the same mergeTraits function", () => {
    assert.equal(traits.mergeTraits, mergeTraits);
  });

  it("references the same parseTraitDescriptorJsDoc function", () => {
    assert.equal(traits.parseTraitDescriptorJsDoc, parseTraitDescriptorJsDoc);
  });
});
