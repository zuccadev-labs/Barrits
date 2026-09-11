import { describe, it } from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";

import { createBarrits } from "../src/barrits/api/factory";
import {
  BARRITS_RUNTIME_KINDS,
  BARRITS_WATCH_MODES,
  DEFAULT_TRAIT_CONFLICT_STRATEGY,
  TRAIT_CONFLICT_STRATEGIES,
  defineBarritsPackage,
  normalizeTraitConflictStrategy,
  resolveBarritsConfig,
} from "../src/barrits/package";
import { normalizeNamespace } from "../src/barrits/internal/config_normalization";
import { createTraitDescriptor, mergeTraits, parseTraitDescriptorJsDoc } from "../src/barrits/traits";
import { loadTypeScript } from "../src/barrits/sdk/ast/cache";
import { collectTraitDescriptorMetadata, readTraitRuntimeMetadata } from "../src/barrits/sdk/ast/traits";
import { detectRuntime } from "../src/barrits/internal/runtime";

await loadTypeScript();

const descriptorsWithCollision = [
  createTraitDescriptor({ name: "first", provides: ["greet"], create: () => ({ greet: () => "first" }) }),
  createTraitDescriptor({ name: "second", provides: ["greet"], create: () => ({ greet: () => "second" }) }),
] as const;

describe("configuration vocabulary", () => {
  it("exposes a single list of runtime kinds, watch modes and conflict strategies", () => {
    assert.deepEqual([...BARRITS_RUNTIME_KINDS], ["node", "deno", "bun", "react", "browser", "other"]);
    assert.deepEqual([...BARRITS_WATCH_MODES], ["auto", "manual", "off"]);
    assert.deepEqual([...TRAIT_CONFLICT_STRATEGIES], ["throw", "left", "right"]);
    assert.equal(DEFAULT_TRAIT_CONFLICT_STRATEGY, "throw");
    assert.ok((BARRITS_RUNTIME_KINDS as readonly string[]).includes(detectRuntime()));
  });

  it("normalizes canonical and legacy conflict strategies and rejects the rest", () => {
    assert.equal(normalizeTraitConflictStrategy(undefined), "throw");
    assert.equal(normalizeTraitConflictStrategy("left"), "left");
    assert.equal(normalizeTraitConflictStrategy("error"), "throw");
    assert.equal(normalizeTraitConflictStrategy("override"), "right");
    assert.equal(normalizeTraitConflictStrategy("merge"), "right");
    assert.throws(() => normalizeTraitConflictStrategy("ignore"), TypeError);
    assert.throws(() => normalizeTraitConflictStrategy(42), TypeError);
  });

  it("defineBarritsPackage returns canonical values that mergeTraits accepts directly", () => {
    const options = defineBarritsPackage({ traitConflictStrategy: "override" });
    assert.equal(options.traitConflictStrategy, "right");
    assert.deepEqual(mergeTraits({ a: 1 }, { a: 2 }, { onConflict: options.traitConflictStrategy }), { a: 2 });
  });

  it("validates the namespace: identifiers only, reserved keys rejected, blanks ignored", () => {
    assert.equal(normalizeNamespace(undefined), undefined);
    assert.equal(normalizeNamespace("   "), undefined);
    assert.equal(normalizeNamespace(" corpAgent "), "corpAgent");
    assert.equal(normalizeNamespace("$app_1"), "$app_1");
    assert.throws(() => normalizeNamespace("my api"), /identifier/);
    assert.throws(() => normalizeNamespace("1abc"), /identifier/);
    assert.throws(() => normalizeNamespace("brt"), /Reserved/);
    assert.throws(() => normalizeNamespace("config"), /Reserved/);
    assert.throws(() => normalizeNamespace(7), /string/);
  });

  it("resolveBarritsConfig surfaces invalid inline values", async () => {
    await assert.rejects(resolveBarritsConfig({ namespace: "config" }), /Reserved/);
    await assert.rejects(resolveBarritsConfig({ traitConflictStrategy: "warn" as never }), /traitConflictStrategy/);
  });
});

describe("createBarrits().composeTraits", () => {
  it("uses the configured strategy as the default onConflict", async () => {
    const throwing = await createBarrits({ autoManifest: false });
    assert.throws(() => throwing.composeTraits(descriptorsWithCollision), /collision/);

    const lenient = await createBarrits({ autoManifest: false, traitConflictStrategy: "override" });
    assert.equal(lenient.config.traitConflictStrategy, "right");
    assert.equal(lenient.composeTraits(descriptorsWithCollision).traits.greet(), "second");

    const keepFirst = await createBarrits({ autoManifest: false, traitConflictStrategy: "left" });
    assert.equal(keepFirst.composeTraits(descriptorsWithCollision).traits.greet(), "first");
  });

  it("lets per-call options override the configured strategy", async () => {
    const lenient = await createBarrits({ autoManifest: false, traitConflictStrategy: "right" });
    assert.throws(() => lenient.composeTraits(descriptorsWithCollision, { onConflict: "throw" }), /collision/);
  });

  it("exposes the custom namespace and rejects reserved ones", async () => {
    const api = await createBarrits<"corpAgent">({ autoManifest: false, namespace: "corpAgent" });
    assert.equal(api.corpAgent, api.barrits);
    await assert.rejects(createBarrits({ autoManifest: false, namespace: "brt" }), TypeError);
  });
});

describe("JSDoc tag parsing", () => {
  it("does not let a bare @barrits-trait swallow the next line", () => {
    const metadata = parseTraitDescriptorJsDoc(["/**", " * @barrits-trait", " * @barrits-provides database:connection", " */"].join("\n"));
    assert.equal(metadata.name, undefined);
    assert.deepEqual(metadata.provides, ["database:connection"]);

    const named = parseTraitDescriptorJsDoc("/** @barrits-trait   spaced-name  \n * @barrits-requires\n * @barrits-provides x */");
    assert.equal(named.name, "spaced-name");
    assert.deepEqual(named.requires, []);
    assert.deepEqual(named.provides, ["x"]);
  });

  it("names a bare @barrits-trait after the runtime name literal, then the binding", () => {
    const source = [
      "/**",
      " * @barrits-trait",
      " * @barrits-provides database:connection",
      " */",
      'export const databaseServiceTrait = { name: "database-service" as const, provides: ["database:connection"] as readonly string[] };',
      "",
      "/** @barrits-trait */",
      "export function createAuthSession(): string { return 'x'; }",
      "",
      "/** @barrits-trait */",
      "export const dynamicTrait = createTraitDescriptor(buildOptions());",
    ].join("\n");

    const descriptors = collectTraitDescriptorMetadata(source, "traits/service.ts");
    assert.deepEqual(
      descriptors.map((descriptor) => `${descriptor.name}<-${descriptor.bindingName}`),
      ["createAuthSession<-createAuthSession", "database-service<-databaseServiceTrait", "dynamicTrait<-dynamicTrait"],
    );
    assert.deepEqual(descriptors[1].provides, ["database:connection"]);
  });

  it("reads runtime metadata from object literals wrapped in as/satisfies", () => {
    const readFromSource = (source: string) => {
      const sourceFile = ts.createSourceFile("probe.ts", source, ts.ScriptTarget.Latest, true);
      const statement = sourceFile.statements[0] as ts.VariableStatement;
      return readTraitRuntimeMetadata(statement.declarationList.declarations[0].initializer);
    };

    assert.deepEqual(
      readFromSource('const t = { name: "obj" as const, provides: ["a", "b"] as readonly string[], state: ["S"] } satisfies object;'),
      {
        conflicts: [],
        consumes: [],
        name: "obj",
        requires: [],
        provides: ["a", "b"],
        state: ["S"],
      },
    );
    assert.equal(readFromSource("const t = 42;"), undefined);
    assert.equal(readFromSource("const t = otherFactory({ name: 'x' });"), undefined);
    assert.equal(readFromSource("const t = createTraitDescriptor(buildOptions());"), undefined);
  });
});
