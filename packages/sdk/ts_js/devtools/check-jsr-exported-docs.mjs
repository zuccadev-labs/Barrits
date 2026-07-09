/**
 * check-jsr-exported-docs.mjs
 *
 * [EN] Accurate JSR docs-score analyzer.
 * Walks the export graph from the JSR entry points (jsr.json `exports`),
 * resolves re-exports (aliases) to their original declarations, and counts
 * how many exported symbols have real JSDoc. This mirrors what JSR actually
 * scores (only entry-point-reachable exported symbols), unlike the naive
 * tool that counts every export in src/ and treats re-exports as documented.
 *
 * [ES] Analizador preciso del score de documentación de JSR.
 * Recorre el grafo de exportaciones desde los puntos de entrada de JSR
 * (exports de jsr.json), resuelve los re-exports (aliases) hasta sus
 * declaraciones originales y cuenta cuántos símbolos exportados tienen JSDoc
 * real. Refleja lo que JSR puntúa realmente.
 *
 * @module
 */

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const SDK_DIR = resolve(import.meta.dirname, "..");

// JSR entry points (mirror of jsr.json `exports` values)
const ENTRY_POINTS = [
  join(SDK_DIR, "src/index.ts"),
  join(SDK_DIR, "src/barrits/consume.ts"),
  join(SDK_DIR, "adapters/deno/mod.ts"),
  join(SDK_DIR, "adapters/deno/cli.ts"),
];

// Collect all .ts files in publish scope to build a resolvable program
function findTSFiles(dir) {
  const { readdirSync } = require("node:fs");
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
      results.push(...findTSFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

const rootNames = [
  ...ENTRY_POINTS,
  ...findTSFiles(join(SDK_DIR, "src")),
  ...findTSFiles(join(SDK_DIR, "adapters/deno")),
];

const program = ts.createProgram(rootNames, {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  allowJs: false,
  skipLibCheck: true,
  strict: false,
  noEmit: true,
});
const checker = program.getTypeChecker();

function symbolHasDoc(symbol) {
  const doc = symbol.getDocumentationComment(checker);
  if (doc && doc.length > 0) return true;
  const tags = symbol.getJsDocTags(checker);
  return tags && tags.length > 0;
}

function locationOf(symbol) {
  const decls = symbol.getDeclarations();
  if (!decls || decls.length === 0) return "unknown";
  const d = decls[0];
  const sf = d.getSourceFile();
  const line = sf.getLineAndCharacterOfPosition(d.getStart(sf)).line + 1;
  return `${sf.fileName}:${line}`;
}

const visited = new Set();
const results = [];

function resolveAndRecord(symbol, exportName, depth) {
  if (depth > 20) return;
  // Follow aliases to the original declaration
  let resolved = symbol;
  if (symbol.flags & ts.SymbolFlags.Alias) {
    try {
      resolved = checker.getAliasedSymbol(symbol);
    } catch {
      /* keep alias */
    }
  }
  const key = resolved === symbol ? symbolName(resolved) + "@" + locationOf(resolved) : symbolName(resolved) + "@" + locationOf(resolved);
  if (visited.has(key)) return;
  visited.add(key);

  const documented = symbolHasDoc(resolved);
  results.push({
    name: exportName,
    documented,
    location: locationOf(resolved),
  });

  // For namespaces/objects, JSR also counts exported members? No — only top-level
  // exported symbols. We stop here.
}

function symbolName(sym) {
  return sym.getName ? sym.getName() : String(sym.name);
}

for (const entryPath of ENTRY_POINTS) {
  const sf = program.getSourceFile(entryPath);
  if (!sf) {
    console.error(`Missing entry source file: ${entryPath}`);
    continue;
  }
  const moduleSymbol = checker.getSymbolAtLocation(sf);
  if (!moduleSymbol) continue;
  const exports = checker.getExportsOfModule(moduleSymbol);
  for (const exp of exports) {
    resolveAndRecord(exp, exp.getName(), 0);
  }
}

const total = results.length;
const documented = results.filter((r) => r.documented).length;
const pct = total > 0 ? ((documented / total) * 100).toFixed(1) : "N/A";

console.log("=== JSR Exported Symbol Docs (entry-point reachable) ===");
console.log(`Total exported symbols: ${total}`);
console.log(`Documented:             ${documented} (${pct}%)`);
console.log(`Undocumented:           ${total - documented}`);

const undoc = results.filter((r) => !r.documented);
if (undoc.length > 0) {
  console.log("\n--- Undocumented exported symbols ---");
  for (const u of undoc.sort((a, b) => a.location.localeCompare(b.location))) {
    console.log(`  ${u.location}  \`${u.name}\``);
  }
}

console.log(`\n${Number(pct) >= 80 ? "✓ Meets JSR threshold (>= 80%)" : "✗ Below JSR threshold (< 80%)"}`);
if (Number(pct) < 80) process.exitCode = 1;
