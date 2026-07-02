import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { collectTraitDiagnostics } from "../src/barrits/sdk/ast/diagnostics";
import type { BarritsTraitDescriptorInspection, BarritsTraitDiagnostic } from "../src/barrits/sdk/contracts";
import type { ExportedTraitBinding } from "../src/barrits/sdk/ast/traits";

const makeDescriptor = (overrides: Partial<BarritsTraitDescriptorInspection> = {}): BarritsTraitDescriptorInspection => ({
  name: "testTrait",
  sourceFile: "traits/test.ts",
  bindingName: "testTrait",
  bindingKind: "const",
  factory: undefined,
  summary: undefined,
  requires: [],
  conflicts: [],
  state: [],
  consumes: [],
  provides: [],
  tags: [],
  runtimes: [],
  ...overrides,
});

const makeBinding = (overrides: Partial<ExportedTraitBinding> = {}): ExportedTraitBinding => ({
  bindingKind: "const",
  bindingName: "testTrait",
  matchIndex: 0,
  ...overrides,
});

describe("collectTraitDiagnostics", () => {
  describe("self-consistency", () => {
    it("detects self-requires", () => {
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ requires: ["testTrait"] })],
        new Map(),
      );
      assert.ok(diags.some((d) => d.code === "trait-self-requires"));
    });

    it("detects self-conflict", () => {
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ conflicts: ["testTrait"] })],
        new Map(),
      );
      assert.ok(diags.some((d) => d.code === "trait-self-conflict"));
    });

    it("detects contradictory requires and conflicts", () => {
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ requires: ["otherTrait"], conflicts: ["otherTrait"] })],
        new Map(),
      );
      assert.ok(diags.some((d) => d.code === "trait-requires-conflict-overlap"));
    });

    it("detects required-conflict between two required traits", () => {
      const otherA: BarritsTraitDescriptorInspection = makeDescriptor({
        name: "traitA", sourceFile: "traits/a.ts", bindingName: "traitA",
        conflicts: ["traitB"],
      });
      const otherB: BarritsTraitDescriptorInspection = makeDescriptor({
        name: "traitB", sourceFile: "traits/b.ts", bindingName: "traitB",
      });
      const main = makeDescriptor({ requires: ["traitA", "traitB"] });
      const diags = collectTraitDiagnostics([main, otherA, otherB], new Map());
      assert.ok(diags.some((d) => d.code === "trait-required-conflicts"));
    });

    it("passes clean descriptor without diagnostics", () => {
      const diags = collectTraitDiagnostics([makeDescriptor()], new Map());
      assert.equal(diags.filter((d) => d.code !== "trait-unsupported-factory").length, 0);
    });
  });

  describe("missing dependencies", () => {
    it("detects missing required trait", () => {
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ requires: ["missingTrait"] })],
        new Map(),
      );
      assert.ok(diags.some((d) => d.code === "trait-missing-required-trait"));
    });

    it("detects missing consumed capability", () => {
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ consumes: ["missingCap"] })],
        new Map(),
      );
      assert.ok(diags.some((d) => d.code === "trait-missing-consumed-capability"));
    });

    it("does not flag consumed capability when it matches a require name", () => {
      const provider = makeDescriptor({ name: "capProvider", provides: ["missingCap"] });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ requires: ["capProvider"] }), provider],
        new Map(),
      );
      assert.equal(diags.filter((d) => d.code === "trait-missing-consumed-capability").length, 0);
    });

    it("detects unsupported factory", () => {
      const diags = collectTraitDiagnostics([makeDescriptor()], new Map());
      assert.ok(diags.some((d) => d.code === "trait-unsupported-factory"));
    });
  });

  describe("runtime mismatches", () => {
    it("detects name mismatch", () => {
      const binding = makeBinding({ runtimeName: "runtimeName" });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptor", name: "docName" })],
        new Map([["traits/test.ts", [binding]]]),
      );
      assert.ok(diags.some((d) => d.code === "trait-name-mismatch"));
    });

    it("detects provides mismatch", () => {
      const binding = makeBinding({ runtimeProvides: ["capB"] });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptor", provides: ["capA"] })],
        new Map([["traits/test.ts", [binding]]]),
      );
      assert.ok(diags.some((d) => d.code === "trait-provides-mismatch"));
    });

    it("detects conflicts mismatch", () => {
      const binding = makeBinding({ runtimeConflicts: ["otherB"] });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptor", conflicts: ["otherA"] })],
        new Map([["traits/test.ts", [binding]]]),
      );
      assert.ok(diags.some((d) => d.code === "trait-conflicts-mismatch"));
    });

    it("detects requires mismatch", () => {
      const binding = makeBinding({ runtimeRequires: ["depB"] });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptor", requires: ["depA"] })],
        new Map([["traits/test.ts", [binding]]]),
      );
      assert.ok(diags.some((d) => d.code === "trait-requires-mismatch"));
    });

    it("detects consumes mismatch", () => {
      const binding = makeBinding({ runtimeConsumes: ["capB"] });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptor", consumes: ["capA"] })],
        new Map([["traits/test.ts", [binding]]]),
      );
      assert.ok(diags.some((d) => d.code === "trait-consumes-mismatch"));
    });

    it("detects state mismatch", () => {
      const binding = makeBinding({ runtimeState: ["keyB"] });
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptor", state: ["keyA"] })],
        new Map([["traits/test.ts", [binding]]]),
      );
      assert.ok(diags.some((d) => d.code === "trait-state-mismatch"));
    });
  });

  describe("global duplicates", () => {
    it("detects duplicate trait names", () => {
      const a = makeDescriptor({ name: "dupName", sourceFile: "traits/a.ts" });
      const b = makeDescriptor({ name: "dupName", sourceFile: "traits/b.ts" });
      const diags = collectTraitDiagnostics([a, b], new Map());
      assert.ok(diags.some((d) => d.code === "trait-duplicate-name"));
    });

    it("detects duplicate provides", () => {
      const a = makeDescriptor({ name: "traitA", provides: ["sharedCap"] });
      const b = makeDescriptor({ name: "traitB", provides: ["sharedCap"] });
      const diags = collectTraitDiagnostics([a, b], new Map());
      assert.ok(diags.some((d) => d.code === "trait-duplicate-provides"));
    });
  });

  describe("edge cases", () => {
    it("returns empty for empty descriptors array", () => {
      const diags = collectTraitDiagnostics([], new Map());
      assert.equal(diags.length, 0);
    });

    it("does not flag createTraitDescriptorFromJsDoc as unsupported", () => {
      const diags = collectTraitDiagnostics(
        [makeDescriptor({ factory: "createTraitDescriptorFromJsDoc" })],
        new Map(),
      );
      assert.equal(diags.filter((d) => d.code === "trait-unsupported-factory").length, 0);
    });
  });

  describe("sorting", () => {
    it("sorts by severity, then code, then descriptorName, then sourceFile", () => {
      const a = makeDescriptor({ factory: "createTraitDescriptor", name: "zName", requires: ["missingTrait"] });
      const b = makeDescriptor({ factory: undefined as any, name: "aName" });
      const diags = collectTraitDiagnostics([a, b], new Map());
      assert.equal(diags.length, 2);
      const sortedCodes = diags.map((d) => d.code);
      assert.equal(sortedCodes[0], "trait-missing-required-trait");
      assert.equal(sortedCodes[1], "trait-unsupported-factory");
    });
  });
});
