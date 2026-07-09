/**
 * check-jsdoc-coverage.mjs
 *
 * [EN] Checks JSDoc coverage of all exported symbols in the JSR publish scope.
 * Uses the TypeScript Compiler API to parse files and count documented vs total exports.
 *
 * [ES] Verifica la cobertura JSDoc de todos los símbolos exportados en el
 * alcance de publicación de JSR. Usa la API del compilador de TypeScript para
 * analizar archivos y contar exportaciones documentadas vs totales.
 *
 * @example
 *   node devtools/check-jsdoc-coverage.mjs
 *   node devtools/check-jsdoc-coverage.mjs --json
 *   node devtools/check-jsdoc-coverage.mjs --verbose
 *
 * @module
 */

import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const SDK_DIR = resolve(import.meta.dirname, "..");
const INCLUDE_DIRS = ["src", "adapters/deno"];

const args = process.argv.slice(2);
const showJson = args.includes("--json");
const showVerbose = args.includes("--verbose");

function findTSFiles(dir) {
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

function hasJSDoc(node) {
  const jsDocComments = ts.getJSDocCommentsAndTags(node);
  if (jsDocComments && jsDocComments.length > 0) {
    for (const comment of jsDocComments) {
      if (ts.isJSDoc(comment)) {
        if (comment.comment && comment.comment.length > 0) return true;
        if (comment.tags && comment.tags.length > 0) return true;
      }
    }
  }
  return false;
}

function analyzeFile(sourceFile) {
  const symbols = [];

  function visit(node, depth = 0) {
    if (depth > 15) return;

    if (ts.isVariableStatement(node) && hasMod(node, ts.SyntaxKind.ExportKeyword)) {
      for (const decl of node.declarationList.declarations) {
        if (decl.name && (ts.isIdentifier(decl.name) || ts.isStringLiteral(decl.name))) {
          symbols.push({ name: decl.name.text, hasDoc: hasJSDoc(node), kind: "variable", line: getLine(node) });
        }
      }
    }

    if (ts.isFunctionDeclaration(node) && node.name && hasMod(node, ts.SyntaxKind.ExportKeyword)) {
      symbols.push({ name: node.name.text, hasDoc: hasJSDoc(node), kind: "function", line: getLine(node) });
    }

    if (ts.isInterfaceDeclaration(node) && hasMod(node, ts.SyntaxKind.ExportKeyword)) {
      symbols.push({ name: node.name.text, hasDoc: hasJSDoc(node), kind: "interface", line: getLine(node) });
    }

    if (ts.isTypeAliasDeclaration(node) && hasMod(node, ts.SyntaxKind.ExportKeyword)) {
      symbols.push({ name: node.name.text, hasDoc: hasJSDoc(node), kind: "type", line: getLine(node) });
    }

    if (ts.isClassDeclaration(node) && node.name && hasMod(node, ts.SyntaxKind.ExportKeyword)) {
      symbols.push({ name: node.name.text, hasDoc: hasJSDoc(node), kind: "class", line: getLine(node) });
    }

    if (ts.isEnumDeclaration(node) && hasMod(node, ts.SyntaxKind.ExportKeyword)) {
      symbols.push({ name: node.name.text, hasDoc: hasJSDoc(node), kind: "enum", line: getLine(node) });
    }

    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const specifier of node.exportClause.elements) {
          symbols.push({ name: specifier.name.text, hasDoc: false, kind: "re-export", line: getLine(node) });
        }
      }
    }

    if (ts.isExportAssignment(node)) {
      symbols.push({ name: "default", hasDoc: hasJSDoc(node), kind: "default-export", line: getLine(node) });
    }

    ts.forEachChild(node, (child) => visit(child, depth + 1));
  }

  function hasMod(node, modifier) {
    return node.modifiers ? node.modifiers.some((m) => m.kind === modifier) : false;
  }

  function getLine(node) {
    return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
  }

  visit(sourceFile);

  const total = symbols.length;
  const documented = symbols.filter((s) => s.hasDoc || s.kind === "re-export").length;

  return { total, documented, symbols };
}

// ── Main ──────────────────────────────────────────────────────────────────────
let allFiles = [];
for (const dir of INCLUDE_DIRS) {
  allFiles.push(...findTSFiles(join(SDK_DIR, dir)));
}

console.error(`Found ${allFiles.length} .ts files in publish scope\n`);

const sourceFiles = [];
for (const filePath of allFiles) {
  const text = readFileSync(filePath, "utf-8");
  sourceFiles.push(ts.createSourceFile(filePath, text, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS));
}

let grandTotal = 0;
let grandDocumented = 0;
const undocByFile = {};
const allSymbols = [];

for (const sourceFile of sourceFiles) {
  const relPath = relative(SDK_DIR, sourceFile.fileName);
  const { total, documented, symbols } = analyzeFile(sourceFile);
  grandTotal += total;
  grandDocumented += documented;
  allSymbols.push(...symbols.map((s) => ({ ...s, file: relPath })));

  if (total > documented) {
    const undoc = symbols.filter((s) => !s.hasDoc && s.kind !== "re-export");
    if (undoc.length > 0) {
      undocByFile[relPath] = undoc;
    }
  }
}

const pct = grandTotal > 0 ? ((grandDocumented / grandTotal) * 100).toFixed(1) : "N/A";

if (showJson) {
  console.log(JSON.stringify({
    total: grandTotal,
    documented: grandDocumented,
    coveragePct: pct,
    undocumented: grandTotal - grandDocumented,
    filesWithGaps: Object.keys(undocByFile).length,
  }, null, 2));
} else {
  console.log("=== JSDoc Coverage Report ===");
  console.log(`Total exported symbols: ${grandTotal}`);
  console.log(`Documented:             ${grandDocumented} (${pct}%)`);
  console.log(`Undocumented:           ${grandTotal - grandDocumented}`);

  if (showVerbose && Object.keys(undocByFile).length > 0) {
    console.log("\n--- Undocumented symbols ---");
    for (const [file, symbols] of Object.entries(undocByFile)) {
      console.log(`  ${file}:`);
      for (const s of symbols) {
        console.log(`    - L${s.line}: ${s.kind} \`${s.name}\``);
      }
    }
  }

  if (Number(pct) >= 80) {
    console.log(`\n✓ Coverage meets JSR threshold (>= 80%)`);
  } else {
    console.log(`\n✗ Coverage below JSR threshold (< 80%)`);
    process.exitCode = 1;
  }
}
