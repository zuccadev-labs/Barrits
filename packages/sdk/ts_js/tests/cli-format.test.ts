import test from "node:test";
import assert from "node:assert/strict";
import { formatTraitOverviewLines, formatTraitDiagnosticDetailLines } from "../src/barrits/sdk/cli-format";

const makeDiagnostic = (overrides: Record<string, unknown> = {}) => ({
  code: "trait-duplicate-name",
  category: "drift" as const,
  severity: "warning" as const,
  message: "test diagnostic",
  sourceFile: "test.ts",
  ...overrides,
});

test("formatTraitOverviewLines shows trait count with no diagnostics", () => {
  const lines = formatTraitOverviewLines({ traitDescriptors: [], traitDiagnostics: [] });
  assert.deepEqual(lines, ["traits: 0"]);
});

test("formatTraitOverviewLines shows trait count with descriptors", () => {
  const lines = formatTraitOverviewLines({ traitDescriptors: [{ name: "test" }], traitDiagnostics: [] } as any);
  assert.deepEqual(lines, ["traits: 1"]);
});

test("formatTraitOverviewLines shows diagnostics summary when present", () => {
  const lines = formatTraitOverviewLines({
    traitDescriptors: [],
    traitDiagnostics: [makeDiagnostic(), makeDiagnostic({ severity: "error" })],
  });
  assert.deepEqual(lines, ["traits: 0", "traitDiagnostics: 2 (1 errors, 1 warnings)"]);
});

test("formatTraitOverviewLines shows only warnings when no errors", () => {
  const lines = formatTraitOverviewLines({
    traitDescriptors: [],
    traitDiagnostics: [makeDiagnostic(), makeDiagnostic()],
  });
  assert.deepEqual(lines, ["traits: 0", "traitDiagnostics: 2 (0 errors, 2 warnings)"]);
});

test("formatTraitDiagnosticDetailLines returns empty for no diagnostics", () => {
  const lines = formatTraitDiagnosticDetailLines([]);
  assert.deepEqual(lines, []);
});

test("formatTraitDiagnosticDetailLines includes category summary", () => {
  const lines = formatTraitDiagnosticDetailLines([
    makeDiagnostic({ category: "drift" }),
    makeDiagnostic({ category: "impossible" }),
  ]);
  assert.ok(lines.includes("  - categories: 1 drift, 1 impossible"));
});

test("formatTraitDiagnosticDetailLines formats diagnostic entries", () => {
  const lines = formatTraitDiagnosticDetailLines([
    makeDiagnostic({ code: "trait-duplicate-name", message: "name conflict" }),
  ]);
  assert.ok(lines.some((line) => line.includes("[warning]") && line.includes("trait-duplicate-name") && line.includes("name conflict")));
});

test("formatTraitDiagnosticDetailLines respects limit", () => {
  const diagnostics = Array.from({ length: 15 }, (_, i) => makeDiagnostic({ message: `diag ${i}` }));
  const lines = formatTraitDiagnosticDetailLines(diagnostics, 5);
  const detailLines = lines.filter((line) => line.startsWith("  - ["));
  assert.equal(detailLines.length, 5);
  assert.ok(lines.some((line) => line.includes("... 10 more")));
});

test("formatTraitDiagnosticDetailLines shows all when under limit", () => {
  const diagnostics = Array.from({ length: 3 }, (_, i) => makeDiagnostic({ message: `diag ${i}` }));
  const lines = formatTraitDiagnosticDetailLines(diagnostics, 12);
  const detailLines = lines.filter((line) => line.startsWith("  - ["));
  assert.equal(detailLines.length, 3);
  assert.ok(lines.every((line) => !line.includes("more")));
});

test("formatTraitDiagnosticDetailLines handles empty limit gracefully", () => {
  const diagnostics = Array.from({ length: 5 }, (_, i) => makeDiagnostic({ message: `diag ${i}` }));
  const lines = formatTraitDiagnosticDetailLines(diagnostics, 0);
  const detailLines = lines.filter((line) => line.startsWith("  - ["));
  assert.equal(detailLines.length, 0);
  assert.ok(lines.some((line) => line.includes("... 5 more")));
});
