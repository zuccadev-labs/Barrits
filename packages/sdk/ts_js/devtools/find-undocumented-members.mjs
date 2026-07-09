/**
 * find-undocumented-members.mjs
 *
 * [EN] Finds every property/member of exported object-type-literals and
 * interfaces in the JSR publish scope that lacks a JSDoc comment. JSR counts
 * these members as exported symbols for the "Has docs for most symbols"
 * score, so each must be documented individually.
 *
 * [ES] Encuentra cada propiedad/miembro de object-type-literals e interfaces
 * exportados en el alcance de publicación de JSR que carece de JSDoc. JSR
 * cuenta estos miembros como símbolos exportados para el score, así que cada
 * uno debe documentarse individualmente.
 *
 * @module
 */
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const SDK_DIR = resolve(import.meta.dirname, "..");

function findTSFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") results.push(...findTSFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) results.push(full);
  }
  return results;
}

function hasJSDoc(node) {
  const c = ts.getJSDocCommentsAndTags(node);
  return c && c.length > 0;
}

const results = [];
const files = [...findTSFiles(join(SDK_DIR, "src")), ...findTSFiles(join(SDK_DIR, "adapters/deno"))];

for (const filePath of files) {
  const text = readFileSync(filePath, "utf-8");
  const sf = ts.createSourceFile(filePath, text, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const rel = relative(SDK_DIR, filePath);

  function isExported(node) {
    let n = node.parent;
    while (n) {
      if (n.kind === ts.SyntaxKind.ExportDeclaration || n.kind === ts.SyntaxKind.ExportAssignment) return false;
      n = n.parent;
    }
    // check modifiers on the declaration
    const decl = node;
    if (decl.modifiers && decl.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) return true;
    return false;
  }

  function checkMembers(typeNode, typeName, lineBase) {
    let members = [];
    if (typeNode.kind === ts.SyntaxKind.TypeLiteral) members = typeNode.members;
    else if (typeNode.kind === ts.SyntaxKind.InterfaceDeclaration) members = typeNode.members;
    else return;
    for (const mem of members) {
      // Only check PropertySignatures and MethodSignatures (real members)
      if (mem.kind !== ts.SyntaxKind.PropertySignature && mem.kind !== ts.SyntaxKind.MethodSignature) continue;
      const name = mem.name ? mem.name.getText(sf) : "?";
      const line = sf.getLineAndCharacterOfPosition(mem.getStart(sf)).line + 1;
      if (!hasJSDoc(mem)) {
        results.push({ file: rel, type: typeName, member: name, line });
      }
    }
  }

  function visit(node) {
    // interface declaration
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration && isExported(node)) {
      checkMembers(node, node.name.getText(sf), 0);
    }
    // type alias with object literal
    if (node.kind === ts.SyntaxKind.TypeAliasDeclaration && isExported(node)) {
      if (node.type && (node.type.kind === ts.SyntaxKind.TypeLiteral)) {
        checkMembers(node.type, node.name.getText(sf), 0);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

console.log(`Undocumented object/interface members (exported): ${results.length}`);
let cur = "";
for (const r of results.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
  if (r.file !== cur) { cur = r.file; console.log(`\n  ${r.file}`); }
  console.log(`    L${r.line}: ${r.type}.${r.member}`);
}
if (results.length === 0) console.log("✓ none — all members documented");
