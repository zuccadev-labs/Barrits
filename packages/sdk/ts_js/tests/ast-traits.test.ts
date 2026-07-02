import { describe, it } from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import {
  resolveTraitDescriptorFactoryFromExpression,
  readStringArrayLiteral,
  readTraitRuntimeMetadataFromCall,
  collectExportedTraitBindings,
  collectTraitDescriptorMetadata,
  normalizeContractStringArray,
  toTraitContractDescriptor,
  mergeTraitDescriptors,
} from "../src/barrits/sdk/ast/traits";
import type { BarritsTraitDescriptorInspection } from "../src/barrits/sdk/contracts";
import type { BarritsTraitContractConfig } from "../src/barrits/config";

const sf = (code: string) => ts.createSourceFile("test.ts", code, 99, true);
const expr = (code: string) => (sf(code).statements[0] as any)?.declarationList?.declarations?.[0]?.initializer ?? sf(code).statements[0];

describe("resolveTraitDescriptorFactoryFromExpression", () => {
  it("returns undefined for no expression", () => {
    assert.equal(resolveTraitDescriptorFactoryFromExpression(undefined), undefined);
  });

  it("detects createTraitDescriptor call", () => {
    const node = sf("const x = createTraitDescriptor({ name: 'test', create: () => ({}) });").statements[0] as ts.VariableStatement;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptor");
  });

  it("detects createTraitDescriptorFromJsDoc call", () => {
    const node = sf("const x = createTraitDescriptorFromJsDoc('/** */', { create: () => ({}) });").statements[0] as ts.VariableStatement;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptorFromJsDoc");
  });

  it("returns undefined for unrelated call", () => {
    const node = sf("const x = someFunction();").statements[0] as ts.VariableStatement;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(node.declarationList.declarations[0].initializer), undefined);
  });

  it("resolves through parenthesized expression", () => {
    const node = sf("const x = (createTraitDescriptor({ name: 't', create: () => ({}) }));").statements[0] as ts.VariableStatement;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(node.declarationList.declarations[0].initializer), "createTraitDescriptor");
  });

  it("resolves through satisfies expression", () => {
    const node = sf("const x = (createTraitDescriptor({ name: 't', create: () => ({}) }) satisfies Record<string, unknown>);").statements[0] as any;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptor");
  });

  it("resolves through as expression", () => {
    const node = sf("const x = (createTraitDescriptor({ name: 't', create: () => ({}) }) as Record<string, unknown>);").statements[0] as any;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptor");
  });

  it("resolves through non-null expression", () => {
    const node = sf("const x = createTraitDescriptor({ name: 't', create: () => ({}) })!;").statements[0] as any;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptor");
  });

  it("resolves through binary expression (nullish coalescing)", () => {
    const node = sf("const x = null ?? createTraitDescriptor({ name: 't', create: () => ({}) });").statements[0] as any;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptor");
  });

  it("resolves through await expression", () => {
    const source = "const x = await createTraitDescriptor({ name: 't', create: () => ({}) });";
    const node = sf(source).statements[0] as any;
    const initializer = node.declarationList.declarations[0].initializer;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(initializer), "createTraitDescriptor");
  });

  it("resolves through conditional expression", () => {
    const node = sf("const x = true ? createTraitDescriptor({ name: 't', create: () => ({}) }) : null;").statements[0] as any;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(node.declarationList.declarations[0].initializer), "createTraitDescriptor");
  });

  it("does not resolve through property access (not a direct call)", () => {
    const node = sf("const x = mod.createTraitDescriptor({ name: 't', create: () => ({}) });").statements[0] as any;
    assert.equal(resolveTraitDescriptorFactoryFromExpression(node.declarationList.declarations[0].initializer), undefined);
  });
});

describe("readStringArrayLiteral", () => {
  it("returns sorted unique strings from array literal", () => {
    const node = sf("const x = ['b', 'a', 'b'];").statements[0] as any;
    const arr = node.declarationList.declarations[0].initializer;
    assert.deepEqual(readStringArrayLiteral(arr), ["a", "b"]);
  });

  it("returns undefined for non-array", () => {
    const node = sf("const x = 'string';").statements[0] as any;
    assert.equal(readStringArrayLiteral(node.declarationList.declarations[0].initializer), undefined);
  });

  it("returns [] for empty array", () => {
    const node = sf("const x: string[] = [];").statements[0] as any;
    assert.deepEqual(readStringArrayLiteral(node.declarationList.declarations[0].initializer), []);
  });

  it("returns undefined for no expression", () => {
    assert.equal(readStringArrayLiteral(undefined), undefined);
  });
});

describe("readTraitRuntimeMetadataFromCall", () => {
  it("returns undefined for non-call expression", () => {
    const node = sf("const x = 42;").statements[0] as any;
    assert.equal(readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer), undefined);
  });

  it("returns undefined for non-createTraitDescriptor call", () => {
    const node = sf("const x = otherFunction({});").statements[0] as any;
    assert.equal(readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer), undefined);
  });

  it("parses name from descriptor argument", () => {
    const node = sf("const x = createTraitDescriptor({ name: 'myTrait', create: () => ({}) });").statements[0] as any;
    const meta = readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer);
    assert.equal(meta?.name, "myTrait");
  });

  it("parses provides array", () => {
    const node = sf("const x = createTraitDescriptor({ provides: ['capA', 'capB'], create: () => ({}) });").statements[0] as any;
    const meta = readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer);
    assert.deepEqual(meta?.provides, ["capA", "capB"]);
  });

  it("parses conflicts array", () => {
    const node = sf("const x = createTraitDescriptor({ conflicts: ['otherTrait'], create: () => ({}) });").statements[0] as any;
    assert.deepEqual(readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer)?.conflicts, ["otherTrait"]);
  });

  it("parses requires array", () => {
    const node = sf("const x = createTraitDescriptor({ requires: ['depTrait'], create: () => ({}) });").statements[0] as any;
    assert.deepEqual(readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer)?.requires, ["depTrait"]);
  });

  it("parses consumes array", () => {
    const node = sf("const x = createTraitDescriptor({ consumes: ['capX'], create: () => ({}) });").statements[0] as any;
    assert.deepEqual(readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer)?.consumes, ["capX"]);
  });

  it("parses state array", () => {
    const node = sf("const x = createTraitDescriptor({ state: ['key1'], create: () => ({}) });").statements[0] as any;
    assert.deepEqual(readTraitRuntimeMetadataFromCall(node.declarationList.declarations[0].initializer)?.state, ["key1"]);
  });
});

describe("collectExportedTraitBindings", () => {
  it("collects const bindings with createTraitDescriptor", () => {
    const source = `export const myTrait = createTraitDescriptor({ name: 'myTrait', create: () => ({}) });`;
    const bindings = collectExportedTraitBindings(source, "index.ts");
    assert.equal(bindings.length, 1);
    assert.equal(bindings[0].bindingName, "myTrait");
    assert.equal(bindings[0].factory, "createTraitDescriptor");
  });

  it("collects exported functions", () => {
    const bindings = collectExportedTraitBindings("export function doStuff() {}", "index.ts");
    assert.equal(bindings.length, 1);
    assert.equal(bindings[0].bindingKind, "function");
    assert.equal(bindings[0].bindingName, "doStuff");
  });

  it("collects exported classes", () => {
    const bindings = collectExportedTraitBindings("export class MyClass {}", "index.ts");
    assert.equal(bindings.length, 1);
    assert.equal(bindings[0].bindingKind, "class");
    assert.equal(bindings[0].bindingName, "MyClass");
  });

  it("skips non-const variable statements", () => {
    const bindings = collectExportedTraitBindings("export let x = 1;", "index.ts");
    assert.equal(bindings.length, 0);
  });

  it("skips non-exported statements", () => {
    const bindings = collectExportedTraitBindings("const x = 1;", "index.ts");
    assert.equal(bindings.length, 0);
  });
});

describe("collectTraitDescriptorMetadata", () => {
  it("collects trait descriptors from JSDoc-annotated exports", () => {
    const source = [
      "/**",
      " * @barrits-trait myTrait",
      " * @barrits-summary A test trait",
      " * @barrits-requires dep1 dep2",
      " * @barrits-provides capA",
      " */",
      "export const myTrait = createTraitDescriptor({ name: 'myTrait', create: () => ({}) });",
    ].join("\n");
    const descriptors = collectTraitDescriptorMetadata(source, "traits/myTrait.ts");
    assert.equal(descriptors.length, 1);
    assert.equal(descriptors[0].name, "myTrait");
    assert.equal(descriptors[0].summary, "A test trait");
    assert.deepEqual(descriptors[0].requires, ["dep1", "dep2"]);
    assert.deepEqual(descriptors[0].provides, ["capA"]);
  });

  it("skips exports without @barrits-trait JSDoc", () => {
    const source = "export const notATrait = 42;";
    assert.equal(collectTraitDescriptorMetadata(source, "index.ts").length, 0);
  });

  it("skips JSDoc blocks without trait name", () => {
    const source = "/** @barrits-summary no name */\nexport const noName = {};";
    assert.equal(collectTraitDescriptorMetadata(source, "index.ts").length, 0);
  });

  it("sorts descriptors by name", () => {
    const sourceB = [
      "/** @barrits-trait beta */",
      "export const beta = createTraitDescriptor({ name: 'beta', create: () => ({}) });",
    ].join("\n");
    const sourceA = [
      "/** @barrits-trait alpha */",
      "export const alpha = createTraitDescriptor({ name: 'alpha', create: () => ({}) });",
    ].join("\n");
    const combined = [sourceA, sourceB].join("\n");
    const descriptors = collectTraitDescriptorMetadata(combined, "traits/combined.ts");
    assert.equal(descriptors.length, 2);
    assert.equal(descriptors[0].name, "alpha");
    assert.equal(descriptors[1].name, "beta");
  });
});

describe("normalizeContractStringArray", () => {
  it("returns sorted unique trimmed strings", () => {
    assert.deepEqual(normalizeContractStringArray(["b", "a", " b", ""]), ["a", "b"]);
  });

  it("returns empty array for undefined", () => {
    assert.deepEqual(normalizeContractStringArray(undefined), []);
  });

  it("returns empty array for empty array", () => {
    assert.deepEqual(normalizeContractStringArray([]), []);
  });
});

describe("toTraitContractDescriptor", () => {
  it("converts a valid config to inspection", () => {
    const config: BarritsTraitContractConfig = {
      name: "myTrait",
      bindingName: "myTrait",
      sourceFile: "./traits/myTrait.ts",
      bindingKind: "const",
      provides: ["capA"],
    };
    const result = toTraitContractDescriptor(config);
    assert.equal(result?.name, "myTrait");
    assert.equal(result?.bindingName, "myTrait");
    assert.equal(result?.sourceFile, "traits/myTrait.ts");
    assert.deepEqual(result?.provides, ["capA"]);
  });

  it("returns null when name is empty", () => {
    assert.equal(toTraitContractDescriptor({ name: "", bindingName: "x", sourceFile: "./x.ts" }), null);
  });

  it("returns null when bindingName is empty", () => {
    assert.equal(toTraitContractDescriptor({ name: "x", bindingName: "", sourceFile: "./x.ts" }), null);
  });

  it("normalizes empty sourceFile to current directory", () => {
    const result = toTraitContractDescriptor({ name: "x", bindingName: "x", sourceFile: "" });
    assert.equal(result?.sourceFile, ".");
    assert.equal(result?.name, "x");
  });
});

describe("mergeTraitDescriptors", () => {
  const base: BarritsTraitDescriptorInspection = {
    name: "test", sourceFile: "test.ts", bindingName: "test", bindingKind: "const",
    requires: [], conflicts: [], state: [], consumes: [], provides: [], tags: [], runtimes: [],
  };

  it("merges discovered and contract descriptors", () => {
    const result = mergeTraitDescriptors([base], []);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "test");
  });

  it("deduplicates by sourceFile::bindingName key, preferring contract values", () => {
    const contract: BarritsTraitDescriptorInspection = {
      ...base, summary: "contract summary",
    };
    const result = mergeTraitDescriptors([base], [contract]);
    assert.equal(result.length, 1);
    assert.equal(result[0].summary, "contract summary");
  });

  it("sorts by name then sourceFile", () => {
    const b: BarritsTraitDescriptorInspection = { ...base, name: "beta", sourceFile: "b.ts" };
    const a: BarritsTraitDescriptorInspection = { ...base, name: "alpha", sourceFile: "a.ts" };
    const result = mergeTraitDescriptors([b, a], []);
    assert.equal(result[0].name, "alpha");
    assert.equal(result[1].name, "beta");
  });
});
