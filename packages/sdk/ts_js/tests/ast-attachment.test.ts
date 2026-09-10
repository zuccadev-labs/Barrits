import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { loadTypeScript } from "../src/barrits/sdk/ast/cache";
import {
  collectDirectExports,
  extractAttachedJsDoc,
  extractExports,
  resolveRelativeModuleCandidates,
} from "../src/barrits/sdk/ast/extractor";
import { collectTraitDescriptorMetadata } from "../src/barrits/sdk/ast/traits";
import { classifyFileKind, collectFiles, inspectFile } from "../src/barrits/sdk/crawler/layer";
import { createNodeFileSystemAdapter } from "../src/barrits/sdk/adapters";
import { writeProjectFile } from "./helpers/fixtures";

await loadTypeScript();

const traitSource = [
  "/**",
  " * @barrits-trait alpha",
  " * @barrits-provides a",
  " */",
  "export const alpha = createTraitDescriptor({ name: 'alpha', provides: ['a'], create: () => ({ a: 1 }) });",
  "",
  "/* eslint-disable something */",
  "export const beta = createTraitDescriptor({ name: 'beta', provides: ['b'], create: () => ({ b: 1 }) });",
  "",
  "const helper = 1;",
  "",
  "/** @barrits-trait gamma */",
  "export class Gamma {}",
  "",
].join("\n");

describe("JSDoc attachment follows the TypeScript parser", () => {
  it("does not leak a documented trait onto the next export across a plain comment", () => {
    const betaIndex = traitSource.indexOf("export const beta");
    assert.equal(extractAttachedJsDoc(traitSource, betaIndex), undefined);

    const descriptors = collectTraitDescriptorMetadata(traitSource, "traits/x.ts");
    assert.deepEqual(
      descriptors.map((descriptor) => `${descriptor.name}<-${descriptor.bindingName}:${descriptor.bindingKind}`),
      ["alpha<-alpha:const", "gamma<-Gamma:class"],
    );
  });

  it("returns the attached block for documented declarations only", () => {
    const alphaIndex = traitSource.indexOf("export const alpha");
    assert.match(extractAttachedJsDoc(traitSource, alphaIndex) ?? "", /@barrits-trait alpha/);
    assert.equal(extractAttachedJsDoc(traitSource, traitSource.indexOf("const helper")), undefined);
  });
});

describe("collectDirectExports", () => {
  it("collects exported classes with kind class", () => {
    const { exportsMap } = collectDirectExports(
      "/** @barrits-path svc.Gamma */\nexport class Gamma {}\nexport const x = 1;",
      "logic/gamma.ts",
    );
    assert.equal(exportsMap.get("Gamma")?.kind, "class");
    assert.equal(exportsMap.get("Gamma")?.accessPath, "svc.Gamma");
    assert.equal(exportsMap.get("x")?.kind, "const");
  });
});

describe("resolveRelativeModuleCandidates", () => {
  it("maps JavaScript specifiers to their TypeScript counterpart and expands extension-less ones", () => {
    assert.deepEqual(resolveRelativeModuleCandidates("logic/index.ts", "./math.js"), ["logic/math.js", "logic/math.ts"]);
    assert.deepEqual(resolveRelativeModuleCandidates("logic/index.ts", "./math.mjs"), ["logic/math.mjs", "logic/math.mts"]);
    const candidates = resolveRelativeModuleCandidates("index.ts", "./logic");
    assert.equal(candidates[0], "logic.ts");
    assert.ok(candidates.includes("logic/index.ts"));
    assert.ok(candidates.includes("logic.js"));
    assert.deepEqual(resolveRelativeModuleCandidates("index.ts", "bare-package"), []);
  });
});

describe("crawler", () => {
  it("classifies index files of any supported extension as root or barrel", () => {
    assert.equal(classifyFileKind("index.js"), "root");
    assert.equal(classifyFileKind("index.mts"), "root");
    assert.equal(classifyFileKind("logic/index.mjs"), "barrel");
    assert.equal(classifyFileKind("logic/helper.js"), "domain");
  });

  it("ignores declaration files, tests and generated directories; follows .js re-exports to .ts sources", async () => {
    const root = await mkdtemp(join(tmpdir(), "barrits-ast-attachment-"));

    try {
      await writeProjectFile(root, "index.ts", 'export * from "./logic/index.js";\n');
      await writeProjectFile(root, "logic/index.js", 'export * from "./math.js";\n');
      await writeProjectFile(root, "logic/math.ts", "export const sumar = (a: number, b: number) => a + b;\n");
      await writeProjectFile(root, "logic/types.d.ts", "export declare const ghost: number;\n");
      await writeProjectFile(root, "logic/math.test.ts", "export const onlyInTests = 1;\n");
      await writeProjectFile(root, "logic/math.spec.ts", "export const onlyInSpecs = 1;\n");
      await writeProjectFile(root, "logic/__tests__/helper.ts", "export const testHelper = 1;\n");
      await writeProjectFile(root, ".barrits/build-manifest.json", "{}\n");

      const adapter = createNodeFileSystemAdapter();
      const files = (await collectFiles(adapter, root)).map((file) => file.replace(/\\/g, "/").slice(root.replace(/\\/g, "/").length + 1));
      assert.deepEqual(files, ["index.ts", "logic/index.js", "logic/math.ts"]);

      const rootFile = await inspectFile(adapter, root, join(root, "index.ts"), "barrits");
      assert.deepEqual(
        rootFile.exports.map((entry) => `${entry.name}:${entry.kind}`),
        ["sumar:reexport"],
      );
      assert.equal(rootFile.kind, "root");

      const exportsThroughJs = await extractExports(adapter, root, "logic/index.js", 'export * from "./math.js";\n');
      assert.deepEqual(
        exportsThroughJs.map((entry) => entry.name),
        ["sumar"],
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
