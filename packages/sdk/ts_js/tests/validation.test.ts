import test from "node:test";
import assert from "node:assert/strict";
import {
  expectRecord,
  expectString,
  expectNumber,
  expectStringArray,
  expectOptionalString,
  expectEnumValue,
  expectOptionalArray,
  withOptionalProperty,
  expectSelectionFilters,
  expectTraitDescriptor,
  expectTraitDiagnostic,
  expectImportAction,
  expectExportCollision,
  expectFileExport,
  expectFileIntegration,
  expectDomainIntegration,
  parseJsonSource,
  createEmptyTraitDiagnosticCounts,
  createEmptyTraitDiagnosticCategoryCounts,
  createEmptyTraitDiagnosticCodeCounts,
  TRAIT_DIAGNOSTIC_CODES,
  DISCOVERY_STRATEGIES,
  FILE_MODES,
  IMPORT_ACTION_KINDS,
  EXPORT_KINDS,
  SOURCE_LAYERS,
  BINDING_KINDS,
  TRAIT_FACTORIES,
  TRAIT_DIAGNOSTIC_SEVERITIES,
  TRAIT_DIAGNOSTIC_CATEGORIES,
  EXPORT_COLLISION_TYPES,
} from "../src/barrits/sdk/validation";

test("expectRecord returns the object when given a plain object", () => {
  const value = { a: 1 };
  assert.equal(expectRecord(value, "test", "$"), value);
});

test("expectRecord throws TypeError for null", () => {
  assert.throws(() => expectRecord(null, "test", "$"), { name: "TypeError" });
});

test("expectRecord throws TypeError for array", () => {
  assert.throws(() => expectRecord([], "test", "$"), { name: "TypeError" });
});

test("expectRecord throws TypeError for string", () => {
  assert.throws(() => expectRecord("hello", "test", "$"), { name: "TypeError" });
});

test("expectRecord throws TypeError for number", () => {
  assert.throws(() => expectRecord(42, "test", "$"), { name: "TypeError" });
});

test("expectRecord throws TypeError for boolean", () => {
  assert.throws(() => expectRecord(true, "test", "$"), { name: "TypeError" });
});

test("expectRecord throws TypeError for undefined", () => {
  assert.throws(() => expectRecord(undefined, "test", "$"), { name: "TypeError" });
});

test("expectRecord error message includes payload name, path, and expected type", () => {
  assert.throws(
    () => expectRecord(null, "config", "root"),
    (err: unknown) => {
      assert.ok(err instanceof TypeError);
      assert.ok((err as TypeError).message.includes("config"));
      assert.ok((err as TypeError).message.includes("root"));
      assert.ok((err as TypeError).message.includes("object"));
      return true;
    },
  );
});

test("expectString returns the string when given a string", () => {
  assert.equal(expectString("hello", "test", "$"), "hello");
});

test("expectString throws TypeError for number", () => {
  assert.throws(() => expectString(42, "test", "$"), TypeError);
});

test("expectString throws TypeError for null", () => {
  assert.throws(() => expectString(null, "test", "$"), TypeError);
});

test("expectString throws TypeError for undefined", () => {
  assert.throws(() => expectString(undefined, "test", "$"), TypeError);
});

test("expectString throws TypeError for object", () => {
  assert.throws(() => expectString({}, "test", "$"), TypeError);
});

test("expectNumber returns the number when given a valid number", () => {
  assert.equal(expectNumber(42, "test", "$"), 42);
});

test("expectNumber returns 0 for zero", () => {
  assert.equal(expectNumber(0, "test", "$"), 0);
});

test("expectNumber returns negative numbers unchanged", () => {
  assert.equal(expectNumber(-1, "test", "$"), -1);
});

test("expectNumber throws TypeError for NaN", () => {
  assert.throws(() => expectNumber(NaN, "test", "$"), TypeError);
});

test("expectNumber throws TypeError for string", () => {
  assert.throws(() => expectNumber("42", "test", "$"), TypeError);
});

test("expectNumber throws TypeError for null", () => {
  assert.throws(() => expectNumber(null, "test", "$"), TypeError);
});

test("expectNumber throws TypeError for undefined", () => {
  assert.throws(() => expectNumber(undefined, "test", "$"), TypeError);
});

test("expectNumber accepts Infinity (typeof number passes guard)", () => {
  assert.equal(expectNumber(Infinity, "test", "$"), Infinity);
});

test("expectStringArray returns string array for valid input", () => {
  assert.deepEqual(expectStringArray(["a", "b"], "test", "$"), ["a", "b"]);
});

test("expectStringArray throws for non-array", () => {
  assert.throws(() => expectStringArray("not-array", "test", "$"), TypeError);
});

test("expectStringArray throws TypeError for array with non-string element", () => {
  assert.throws(() => expectStringArray([42], "test", "$"), TypeError);
});

test("expectStringArray throws for null", () => {
  assert.throws(() => expectStringArray(null, "test", "$"), TypeError);
});

test("expectStringArray throws for undefined", () => {
  assert.throws(() => expectStringArray(undefined, "test", "$"), TypeError);
});

test("expectStringArray passes for empty array", () => {
  assert.deepEqual(expectStringArray([], "test", "$"), []);
});

test("expectOptionalString returns undefined when value is undefined", () => {
  assert.equal(expectOptionalString(undefined, "test", "$"), undefined);
});

test("expectOptionalString returns the string for valid string", () => {
  assert.equal(expectOptionalString("hello", "test", "$"), "hello");
});

test("expectOptionalString throws TypeError for null", () => {
  assert.throws(() => expectOptionalString(null, "test", "$"), TypeError);
});

test("expectOptionalString throws TypeError for number", () => {
  assert.throws(() => expectOptionalString(42, "test", "$"), TypeError);
});

test("expectEnumValue returns valid enum value", () => {
  const result = expectEnumValue("foo", new Set(["foo", "bar"]), "test", "$", "foo|bar");
  assert.equal(result, "foo");
});

test("expectEnumValue throws TypeError for invalid string", () => {
  assert.throws(() => expectEnumValue("baz", new Set(["foo", "bar"]), "test", "$", "foo|bar"), TypeError);
});

test("expectEnumValue throws TypeError for number", () => {
  assert.throws(() => expectEnumValue(42, new Set(["42"]), "test", "$", "number-string"), TypeError);
});

test("expectEnumValue throws TypeError for null", () => {
  assert.throws(() => expectEnumValue(null, new Set(["foo"]), "test", "$", "foo"), TypeError);
});

test("expectEnumValue throws TypeError for undefined", () => {
  assert.throws(() => expectEnumValue(undefined, new Set(["foo"]), "test", "$", "foo"), TypeError);
});

test("expectEnumValue throws TypeError for empty string", () => {
  assert.throws(() => expectEnumValue("", new Set(["foo"]), "test", "$", "foo"), TypeError);
});

test("expectOptionalArray returns undefined for undefined input", () => {
  const result = expectOptionalArray(undefined, "test", "$", (e) => e);
  assert.equal(result, undefined);
});

test("expectOptionalArray returns mapped array for valid array", () => {
  const result = expectOptionalArray([1, 2, 3], "test", "$", (e) => (e as number) * 2);
  assert.deepEqual(result, [2, 4, 6]);
});

test("expectOptionalArray throws for non-array non-undefined", () => {
  assert.throws(() => expectOptionalArray("string", "test", "$", (e) => e), TypeError);
});

test("expectOptionalArray passes through mapEntry errors", () => {
  assert.throws(() => expectOptionalArray(["a", "b"], "test", "$", () => { throw new Error("map fail"); }), /map fail/);
});

test("expectOptionalArray throws for null", () => {
  assert.throws(() => expectOptionalArray(null, "test", "$", (e) => e), TypeError);
});

test("withOptionalProperty returns original object when optional is undefined", () => {
  const obj = { a: 1 };
  const result = withOptionalProperty(obj, "b", undefined);
  assert.deepEqual(result, { a: 1 });
});

test("withOptionalProperty returns merged object when optional is defined", () => {
  const obj = { a: 1 };
  const result = withOptionalProperty(obj, "b", 2);
  assert.deepEqual(result, { a: 1, b: 2 });
});

test("withOptionalProperty preserves original object when optional is defined", () => {
  const obj = { a: 1 };
  withOptionalProperty(obj, "b", 2);
  assert.deepEqual(obj, { a: 1 });
});

test("withOptionalProperty overwrites existing key", () => {
  const obj = { a: 1, b: 0 };
  const result = withOptionalProperty(obj, "b", 2);
  assert.equal(result.b, 2);
});

test("withOptionalProperty handles empty object", () => {
  const result = withOptionalProperty({}, "key", "val");
  assert.deepEqual(result, { key: "val" });
});

test("expectSelectionFilters returns undefined for undefined input", () => {
  assert.equal(expectSelectionFilters(undefined, "test", "$"), undefined);
});

test("expectSelectionFilters returns empty filters for empty record", () => {
  const result = expectSelectionFilters({}, "test", "$");
  assert.deepEqual(result, {});
});

test("expectSelectionFilters parses domains", () => {
  const result = expectSelectionFilters({ domains: ["api"] }, "test", "$");
  assert.deepEqual(result, { domains: ["api"] });
});

test("expectSelectionFilters parses exports", () => {
  const result = expectSelectionFilters({ exports: ["foo"] }, "test", "$");
  assert.deepEqual(result, { exports: ["foo"] });
});

test("expectSelectionFilters parses fileKinds with valid kinds", () => {
  const result = expectSelectionFilters({ fileKinds: ["barrel"] }, "test", "$");
  assert.deepEqual(result, { fileKinds: ["barrel"] });
});

test("expectSelectionFilters rejects invalid fileKinds", () => {
  assert.throws(() => expectSelectionFilters({ fileKinds: ["invalid"] }, "test", "$"), TypeError);
});

test("expectSelectionFilters parses visibilities with valid values", () => {
  const result = expectSelectionFilters({ visibilities: ["public"] }, "test", "$");
  assert.deepEqual(result, { visibilities: ["public"] });
});

test("expectSelectionFilters rejects invalid visibilities", () => {
  assert.throws(() => expectSelectionFilters({ visibilities: ["invalid"] }, "test", "$"), TypeError);
});

test("expectSelectionFilters parses kinds with valid import action kinds", () => {
  const result = expectSelectionFilters({ kinds: ["named-import"] }, "test", "$");
  assert.deepEqual(result, { kinds: ["named-import"] });
});

test("expectSelectionFilters rejects invalid kinds", () => {
  assert.throws(() => expectSelectionFilters({ kinds: ["invalid-kind"] }, "test", "$"), TypeError);
});

test("expectSelectionFilters parses all filters simultaneously", () => {
  const result = expectSelectionFilters({
    domains: ["api", "core"],
    exports: ["foo", "bar"],
    fileKinds: ["barrel"],
    visibilities: ["public"],
    kinds: ["named-import"],
  }, "test", "$");
  assert.deepEqual(result, {
    domains: ["api", "core"],
    exports: ["foo", "bar"],
    fileKinds: ["barrel"],
    visibilities: ["public"],
    kinds: ["named-import"],
  });
});

test("expectSelectionFilters throws TypeError when domains is not an array", () => {
  assert.throws(() => expectSelectionFilters({ domains: "not-array" }, "test", "$"), TypeError);
});

test("expectTraitDescriptor returns valid descriptor", () => {
  const result = expectTraitDescriptor({
    name: "test",
    sourceFile: "file.ts",
    bindingName: "testBinding",
    bindingKind: "const",
    requires: [],
    conflicts: [],
    state: [],
    consumes: [],
    provides: ["result"],
    tags: [],
    runtimes: ["node"],
  }, "descriptor", "$");
  assert.equal(result.name, "test");
  assert.equal(result.sourceFile, "file.ts");
  assert.equal(result.bindingName, "testBinding");
  assert.equal(result.bindingKind, "const");
  assert.deepEqual(result.requires, []);
  assert.deepEqual(result.provides, ["result"]);
  assert.deepEqual(result.runtimes, ["node"]);
});

test("expectTraitDescriptor throws TypeError for missing name", () => {
  assert.throws(() => expectTraitDescriptor({
    sourceFile: "file.ts",
    bindingName: "testBinding",
    bindingKind: "const",
    requires: [],
    conflicts: [],
    state: [],
    consumes: [],
    provides: [],
    tags: [],
    runtimes: [],
  }, "descriptor", "$"), TypeError);
});

test("expectTraitDescriptor throws TypeError for invalid bindingKind", () => {
  assert.throws(() => expectTraitDescriptor({
    name: "test",
    sourceFile: "file.ts",
    bindingName: "testBinding",
    bindingKind: "invalid",
    requires: [],
    conflicts: [],
    state: [],
    consumes: [],
    provides: [],
    tags: [],
    runtimes: [],
  }, "descriptor", "$"), TypeError);
});

test("expectTraitDescriptor includes optional factory when present", () => {
  const result = expectTraitDescriptor({
    name: "test",
    sourceFile: "file.ts",
    bindingName: "testBinding",
    bindingKind: "const",
    requires: [],
    conflicts: [],
    state: [],
    consumes: [],
    provides: [],
    tags: [],
    runtimes: [],
    factory: "createTraitDescriptor",
  }, "descriptor", "$");
  assert.equal(result.factory, "createTraitDescriptor");
});

test("expectTraitDescriptor includes optional summary when present", () => {
  const result = expectTraitDescriptor({
    name: "test",
    sourceFile: "file.ts",
    bindingName: "testBinding",
    bindingKind: "const",
    requires: [],
    conflicts: [],
    state: [],
    consumes: [],
    provides: [],
    tags: [],
    runtimes: [],
    summary: "A test trait",
  }, "descriptor", "$");
  assert.equal(result.summary, "A test trait");
});

test("expectTraitDiagnostic returns valid diagnostic", () => {
  const result = expectTraitDiagnostic({
    code: "trait-duplicate-name",
    category: "drift",
    severity: "error",
    message: "Duplicate name found",
    sourceFile: "file.ts",
  }, "diagnostic", "$");
  assert.equal(result.code, "trait-duplicate-name");
  assert.equal(result.category, "drift");
  assert.equal(result.severity, "error");
  assert.equal(result.message, "Duplicate name found");
  assert.equal(result.sourceFile, "file.ts");
});

test("expectTraitDiagnostic includes optional descriptorName", () => {
  const result = expectTraitDiagnostic({
    code: "trait-duplicate-name",
    category: "drift",
    severity: "error",
    message: "test",
    sourceFile: "file.ts",
    descriptorName: "dup",
  }, "diagnostic", "$");
  assert.equal(result.descriptorName, "dup");
});

test("expectTraitDiagnostic includes optional bindingName", () => {
  const result = expectTraitDiagnostic({
    code: "trait-duplicate-name",
    category: "drift",
    severity: "error",
    message: "test",
    sourceFile: "file.ts",
    bindingName: "dupBinding",
  }, "diagnostic", "$");
  assert.equal(result.bindingName, "dupBinding");
});

test("expectTraitDiagnostic includes optional capabilityName", () => {
  const result = expectTraitDiagnostic({
    code: "trait-duplicate-name",
    category: "drift",
    severity: "error",
    message: "test",
    sourceFile: "file.ts",
    capabilityName: "cap",
  }, "diagnostic", "$");
  assert.equal(result.capabilityName, "cap");
});

test("expectTraitDiagnostic throws TypeError for invalid code", () => {
  assert.throws(() => expectTraitDiagnostic({
    code: "invalid-code",
    category: "drift",
    severity: "error",
    message: "test",
    sourceFile: "file.ts",
  }, "diagnostic", "$"), TypeError);
});

test("expectTraitDiagnostic throws TypeError for invalid category", () => {
  assert.throws(() => expectTraitDiagnostic({
    code: "trait-duplicate-name",
    category: "invalid",
    severity: "error",
    message: "test",
    sourceFile: "file.ts",
  }, "diagnostic", "$"), TypeError);
});

test("expectTraitDiagnostic throws TypeError for invalid severity", () => {
  assert.throws(() => expectTraitDiagnostic({
    code: "trait-duplicate-name",
    category: "drift",
    severity: "invalid",
    message: "test",
    sourceFile: "file.ts",
  }, "diagnostic", "$"), TypeError);
});

test("expectImportAction returns valid import action", () => {
  const result = expectImportAction({
    exportName: "foo",
    domain: "api",
    sourceFile: "foo.ts",
    kind: "named-import",
    statement: 'import { foo } from "./foo"',
  }, "action", "$");
  assert.equal(result.exportName, "foo");
  assert.equal(result.domain, "api");
  assert.equal(result.statement, 'import { foo } from "./foo"');
});

test("expectImportAction throws TypeError for missing exportName", () => {
  assert.throws(() => expectImportAction({
    domain: "api",
    sourceFile: "foo.ts",
    kind: "named-import",
    statement: '',
  }, "action", "$"), TypeError);
});

test("expectImportAction throws TypeError for invalid kind", () => {
  assert.throws(() => expectImportAction({
    exportName: "foo",
    domain: "api",
    sourceFile: "foo.ts",
    kind: "invalid",
    statement: '',
  }, "action", "$"), TypeError);
});

test("expectExportCollision returns valid collision", () => {
  const result = expectExportCollision({
    type: "project-project",
    namespace: "ns",
    exportName: "foo",
    projectSourceFile: "a.ts",
    conflictSourceFile: "b.ts",
    message: "collision",
  }, "collision", "$");
  assert.equal(result.type, "project-project");
  assert.equal(result.namespace, "ns");
  assert.equal(result.exportName, "foo");
});

test("expectExportCollision includes optional librarySourceFile", () => {
  const result = expectExportCollision({
    type: "project-library",
    namespace: "ns",
    exportName: "foo",
    projectSourceFile: "a.ts",
    conflictSourceFile: "lib.ts",
    librarySourceFile: "lib.ts",
    message: "collision with library",
  }, "collision", "$");
  assert.equal(result.librarySourceFile, "lib.ts");
});

test("expectExportCollision throws TypeError for invalid type", () => {
  assert.throws(() => expectExportCollision({
    type: "invalid",
    namespace: "ns",
    exportName: "foo",
    projectSourceFile: "a.ts",
    conflictSourceFile: "b.ts",
    message: "err",
  }, "collision", "$"), TypeError);
});

test("expectExportCollision does not include librarySourceFile when absent", () => {
  const result = expectExportCollision({
    type: "project-project",
    namespace: "ns",
    exportName: "foo",
    projectSourceFile: "a.ts",
    conflictSourceFile: "b.ts",
    message: "err",
  }, "collision", "$");
  assert.equal(result.librarySourceFile, undefined);
});

test("expectFileExport returns valid file export", () => {
  const result = expectFileExport({
    name: "foo",
    accessPath: "./foo",
    accessStrategy: "export-name",
    kind: "const",
    visibility: "public",
  }, "export", "$");
  assert.equal(result.name, "foo");
  assert.equal(result.kind, "const");
});

test("expectFileExport throws TypeError for invalid accessStrategy", () => {
  assert.throws(() => expectFileExport({
    name: "foo",
    accessPath: "./foo",
    accessStrategy: "invalid",
    kind: "const",
    visibility: "public",
  }, "export", "$"), TypeError);
});

test("expectFileExport throws TypeError for missing name", () => {
  assert.throws(() => expectFileExport({
    accessPath: "./foo",
    accessStrategy: "export-name",
    kind: "const",
    visibility: "public",
  }, "export", "$"), TypeError);
});

test("expectFileIntegration returns valid file integration", () => {
  const result = expectFileIntegration({
    path: "src/foo.ts",
    isIndex: false,
    kind: "barrel",
    sourceLayer: "barrits",
    exports: [],
    traitDescriptors: [],
  }, "file", "$");
  assert.equal(result.path, "src/foo.ts");
  assert.equal(result.isIndex, false);
  assert.equal(result.kind, "barrel");
  assert.equal(result.sourceLayer, "barrits");
  assert.deepEqual(result.exports, []);
});

test("expectFileIntegration returns isIndex true when set", () => {
  const result = expectFileIntegration({
    path: "src/index.ts",
    isIndex: true,
    kind: "barrel",
    sourceLayer: "barrits",
    exports: [],
    traitDescriptors: [],
  }, "file", "$");
  assert.equal(result.isIndex, true);
});

test("expectFileIntegration throws TypeError when isIndex is not boolean", () => {
  assert.throws(() => expectFileIntegration({
    path: "src/index.ts",
    isIndex: "yes",
    kind: "source",
    sourceLayer: "barrits",
    exports: [],
    traitDescriptors: [],
  }, "file", "$"), TypeError);
});

test("expectFileIntegration throws TypeError for invalid kind", () => {
  assert.throws(() => expectFileIntegration({
    path: "src/index.ts",
    isIndex: false,
    kind: "invalid",
    sourceLayer: "barrits",
    exports: [],
    traitDescriptors: [],
  }, "file", "$"), TypeError);
});

test("expectFileIntegration throws TypeError for invalid sourceLayer", () => {
  assert.throws(() => expectFileIntegration({
    path: "src/index.ts",
    isIndex: false,
    kind: "source",
    sourceLayer: "invalid-layer",
    exports: [],
    traitDescriptors: [],
  }, "file", "$"), TypeError);
});

test("expectFileIntegration validates export visibility", () => {
  assert.throws(() => expectFileIntegration({
    path: "src/index.ts",
    isIndex: false,
    kind: "source",
    sourceLayer: "barrits",
    exports: [{
      name: "foo",
      accessPath: "./foo",
      accessStrategy: "export-name",
      kind: "const",
      visibility: "invalid-visibility",
    }],
    traitDescriptors: [],
  }, "file", "$"), TypeError);
});

test("expectFileIntegration parses traitDescriptors when present", () => {
  const result = expectFileIntegration({
    path: "src/index.ts",
    isIndex: false,
    kind: "barrel",
    sourceLayer: "barrits",
    exports: [],
    traitDescriptors: [{
      name: "test",
      sourceFile: "file.ts",
      bindingName: "testBinding",
      bindingKind: "const",
      requires: [],
      conflicts: [],
      state: [],
      consumes: [],
      provides: [],
      tags: [],
      runtimes: [],
    }],
  }, "file", "$");
  assert.equal(result.traitDescriptors.length, 1);
  assert.equal(result.traitDescriptors[0].name, "test");
});

test("expectFileIntegration defaults traitDescriptors to empty array when absent", () => {
  const result = expectFileIntegration({
    path: "src/index.ts",
    isIndex: false,
    kind: "barrel",
    sourceLayer: "barrits",
    exports: [],
  }, "file", "$");
  assert.deepEqual(result.traitDescriptors, []);
});

test("expectFileIntegration defaults exports to empty array when exports absent", () => {
  const result = expectFileIntegration({
    path: "src/index.ts",
    isIndex: false,
    kind: "barrel",
    sourceLayer: "barrits",
  }, "file", "$");
  assert.deepEqual(result.exports, []);
});

test("expectDomainIntegration returns valid domain integration", () => {
  const result = expectDomainIntegration({
    name: "api",
    path: "src/api",
    files: [{
      path: "src/api/route.ts",
      isIndex: false,
      kind: "barrel",
      sourceLayer: "barrits",
      exports: [{
        name: "handler",
        accessPath: "./handler",
        accessStrategy: "export-name",
        kind: "function",
        visibility: "public",
      }],
      traitDescriptors: [],
    }],
  }, "domain", "$");
  assert.equal(result.name, "api");
  assert.equal(result.files.length, 1);
  assert.equal(result.files[0].exports[0].name, "handler");
});

test("expectDomainIntegration defaults files to empty array when absent", () => {
  const result = expectDomainIntegration({
    name: "api",
    path: "src/api",
  }, "domain", "$");
  assert.deepEqual(result.files, []);
});

test("expectDomainIntegration throws TypeError for missing name", () => {
  assert.throws(() => expectDomainIntegration({
    path: "src/api",
  }, "domain", "$"), TypeError);
});

test("parseJsonSource parses valid JSON", () => {
  const result = parseJsonSource('{"a":1}', "config");
  assert.deepEqual(result, { a: 1 });
});

test("parseJsonSource parses nested JSON", () => {
  const result = parseJsonSource('{"a":{"b":2}}', "config");
  assert.deepEqual(result, { a: { b: 2 } });
});

test("parseJsonSource throws TypeError for non-object JSON", () => {
  assert.throws(() => parseJsonSource('"string"', "config"), TypeError);
});

test("parseJsonSource throws SyntaxError for malformed JSON", () => {
  assert.throws(() => parseJsonSource("{invalid}", "config"), SyntaxError);
});

test("parseJsonSource throws Error for oversized JSON", () => {
  const large = '{"a":"' + "x".repeat(11 * 1024 * 1024) + '"}';
  assert.throws(() => parseJsonSource(large, "config"), /exceeds maximum size/);
});

test("parseJsonSource throws TypeError for JSON array (not object)", () => {
  assert.throws(() => parseJsonSource('[{"x":1}]', "config"), TypeError);
});

test("createEmptyTraitDiagnosticCounts returns zeroed counts", () => {
  const result = createEmptyTraitDiagnosticCounts();
  assert.equal(result.total, 0);
  assert.equal(result.errorCount, 0);
  assert.equal(result.warningCount, 0);
});

test("createEmptyTraitDiagnosticCounts returns a new object each call", () => {
  assert.notEqual(createEmptyTraitDiagnosticCounts(), createEmptyTraitDiagnosticCounts());
});

test("createEmptyTraitDiagnosticCategoryCounts returns zeroed category counts", () => {
  const result = createEmptyTraitDiagnosticCategoryCounts();
  assert.equal(result.drift, 0);
  assert.equal(result.impossible, 0);
  assert.equal(result["non-verifiable"], 0);
});

test("createEmptyTraitDiagnosticCategoryCounts returns a new object each call", () => {
  assert.notEqual(createEmptyTraitDiagnosticCategoryCounts(), createEmptyTraitDiagnosticCategoryCounts());
});

test("createEmptyTraitDiagnosticCodeCounts returns zeroed code counts", () => {
  const result = createEmptyTraitDiagnosticCodeCounts();
  for (const code of TRAIT_DIAGNOSTIC_CODES) {
    assert.equal(result[code], 0, `Expected ${code} to be 0`);
  }
});

test("createEmptyTraitDiagnosticCodeCounts has correct number of codes", () => {
  const result = createEmptyTraitDiagnosticCodeCounts();
  assert.equal(Object.keys(result).length, TRAIT_DIAGNOSTIC_CODES.length);
});

test("DISCOVERY_STRATEGIES contains all expected values", () => {
  assert.ok(DISCOVERY_STRATEGIES.has("current-directory"));
  assert.ok(DISCOVERY_STRATEGIES.has("direct-child"));
  assert.ok(DISCOVERY_STRATEGIES.has("recursive-child"));
  assert.ok(DISCOVERY_STRATEGIES.has("ancestor-child"));
  assert.equal(DISCOVERY_STRATEGIES.size, 4);
});

test("FILE_MODES contains watch and dev", () => {
  assert.ok(FILE_MODES.has("watch"));
  assert.ok(FILE_MODES.has("dev"));
  assert.equal(FILE_MODES.size, 2);
});

test("IMPORT_ACTION_KINDS contains all import action kinds", () => {
  assert.ok(IMPORT_ACTION_KINDS.has("named-import"));
  assert.ok(IMPORT_ACTION_KINDS.has("namespace-access"));
  assert.ok(IMPORT_ACTION_KINDS.has("alias-namespace-access"));
  assert.equal(IMPORT_ACTION_KINDS.size, 3);
});

test("EXPORT_KINDS contains const, function, reexport", () => {
  assert.ok(EXPORT_KINDS.has("const"));
  assert.ok(EXPORT_KINDS.has("function"));
  assert.ok(EXPORT_KINDS.has("reexport"));
  assert.equal(EXPORT_KINDS.size, 3);
});

test("SOURCE_LAYERS contains barrits and barrits_lib", () => {
  assert.ok(SOURCE_LAYERS.has("barrits"));
  assert.ok(SOURCE_LAYERS.has("barrits_lib"));
  assert.equal(SOURCE_LAYERS.size, 2);
});

test("BINDING_KINDS contains const, function, class", () => {
  assert.ok(BINDING_KINDS.has("const"));
  assert.ok(BINDING_KINDS.has("function"));
  assert.ok(BINDING_KINDS.has("class"));
  assert.equal(BINDING_KINDS.size, 3);
});

test("TRAIT_FACTORIES contains all trait factories", () => {
  assert.ok(TRAIT_FACTORIES.has("createTraitDescriptor"));
  assert.ok(TRAIT_FACTORIES.has("createTraitDescriptorFromJsDoc"));
  assert.equal(TRAIT_FACTORIES.size, 2);
});

test("TRAIT_DIAGNOSTIC_SEVERITIES contains warning and error", () => {
  assert.ok(TRAIT_DIAGNOSTIC_SEVERITIES.has("warning"));
  assert.ok(TRAIT_DIAGNOSTIC_SEVERITIES.has("error"));
  assert.equal(TRAIT_DIAGNOSTIC_SEVERITIES.size, 2);
});

test("TRAIT_DIAGNOSTIC_CATEGORIES contains all categories", () => {
  assert.ok(TRAIT_DIAGNOSTIC_CATEGORIES.has("drift"));
  assert.ok(TRAIT_DIAGNOSTIC_CATEGORIES.has("impossible"));
  assert.ok(TRAIT_DIAGNOSTIC_CATEGORIES.has("non-verifiable"));
  assert.equal(TRAIT_DIAGNOSTIC_CATEGORIES.size, 3);
});

test("EXPORT_COLLISION_TYPES contains project-project and project-library", () => {
  assert.ok(EXPORT_COLLISION_TYPES.has("project-project"));
  assert.ok(EXPORT_COLLISION_TYPES.has("project-library"));
  assert.equal(EXPORT_COLLISION_TYPES.size, 2);
});
